import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/integrations/supabase/admin-client';

// MVP: Single role - superadmin only
type AdminRole = 'superadmin' | null;

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperadmin: boolean;
  adminRole: AdminRole;
  isSigningOut: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminRole, setAdminRole] = useState<AdminRole>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // Refs to prevent stale closures
  const userRef = useRef<User | null>(null);
  const isMountedRef = useRef(true);
  
  userRef.current = user;

  // MVP: isAdmin and isSuperadmin are the same - only superadmin role exists
  const isAdmin = adminRole === 'superadmin';
  const isSuperadmin = adminRole === 'superadmin';

  // Memoized role checking function
  const checkAdminRole = useCallback(async (userId: string) => {
    if (!isMountedRef.current) return;
    
    try {
      // 1. Check user_roles table for administrative access
      const { data, error } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (!isMountedRef.current) return;
      
      if (error) {
        await handleInvalidAccess();
      } else if (data && data.length > 0) {
        const roles = data.map(r => r.role);
        
        // MVP: Only superadmin role is allowed
        if (roles.includes('superadmin')) {
          setAdminRole('superadmin');
        } else {
          // Authenticated but NOT a superadmin (e.g. Designer or old admin trying to log in)
          await handleInvalidAccess();
        }
      } else {
        await handleInvalidAccess();
      }
    } catch (error) {
      if (isMountedRef.current) {
        await handleInvalidAccess();
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const handleInvalidAccess = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setAdminRole(null);
    setUser(null);
    setSession(null);
    // Force sign out from THIS isolated storage to prevent Designer session hijacking the Admin portal
    await supabaseAdmin.auth.signOut({ scope: 'local' });
  }, []);

  // Multi-tab sync for admin auth state - only handle explicit sign-outs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!isMountedRef.current) return;
      
      // Only sync if admin token was explicitly removed (sign-out)
      if (e.key?.includes('admin:') && e.key?.includes('auth-token') && e.newValue === null && userRef.current) {
        setUser(null);
        setSession(null);
        setAdminRole(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Main admin auth state listener - only run once on mount
  useEffect(() => {
    isMountedRef.current = true;
    
    let authCheckTimeout: NodeJS.Timeout;
    let isInitialized = false;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabaseAdmin.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMountedRef.current) return;
        
        // Ignore TOKEN_REFRESHED events that might cause flickering
        if (event === 'TOKEN_REFRESHED') {
          setSession(currentSession);
          return;
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (!currentSession?.user) {
          setAdminRole(null);
          setLoading(false);
        } else if (!isInitialized || event === 'SIGNED_IN') {
          // Only check role on initial load or explicit sign-in
          clearTimeout(authCheckTimeout);
          authCheckTimeout = setTimeout(() => {
            if (isMountedRef.current && currentSession.user) {
              checkAdminRole(currentSession.user.id);
            }
          }, 100);
        }
      }
    );

    // THEN check for existing session (only on mount)
    supabaseAdmin.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!isMountedRef.current) return;
      
      isInitialized = true;
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        checkAdminRole(existingSession.user.id);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      if (isMountedRef.current) {
        setLoading(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      clearTimeout(authCheckTimeout);
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount, auth state listener handles updates

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Log failed attempt
        await supabaseAdmin.from('auth_logs').insert({
          action: 'admin_login_failed',
          metadata: { error_type: error.message?.includes('Invalid') ? 'invalid_credentials' : 'unknown' },
          user_agent: navigator.userAgent,
        });
        throw error;
      }

      // Log success
      if (data.user) {
        await supabaseAdmin.from('auth_logs').insert({
          user_id: data.user.id,
          action: 'admin_login_success',
          user_agent: navigator.userAgent,
        });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      if (user) {
        await supabaseAdmin.from('admin_logs').insert({
          admin_id: user.id,
          action: 'admin_logout',
          target_type: 'session',
        });
      }
      // Use local scope to only sign out from admin session, not studio
      await supabaseAdmin.auth.signOut({ scope: 'local' });
      setAdminRole(null);
    } catch (error) {
      // Silently handle signout errors
    } finally {
      if (isMountedRef.current) {
        setIsSigningOut(false);
      }
    }
  }, [user, isSigningOut]);

  return (
    <AdminAuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isAdmin, 
      isSuperadmin,
      adminRole,
      isSigningOut,
      signIn, 
      signOut 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
