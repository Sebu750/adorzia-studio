import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/integrations/supabase/admin-client';

// Add diagnostic import
import { useDiagnostics } from '@/components/DiagnosticOverlay';

type AdminRole = 'admin' | 'superadmin' | 'lead_curator' | null;

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
  
  // Diagnostic hook
  const { addDiagnostic } = useDiagnostics();
  
  // Refs to prevent stale closures
  const userRef = useRef<User | null>(null);
  const isMountedRef = useRef(true);
  
  userRef.current = user;

  const isAdmin = adminRole === 'admin' || adminRole === 'superadmin' || adminRole === 'lead_curator';
  const isSuperadmin = adminRole === 'superadmin';

  // Memoized role checking function
  const checkAdminRole = useCallback(async (userId: string) => {
    if (!isMountedRef.current) return;
    
    try {
      addDiagnostic('useAdminAuth', 'loading', `Checking admin role for user: ${userId}`);
      
      // 1. Check user_roles table for administrative access
      const { data, error } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (!isMountedRef.current) return;
      
      addDiagnostic('useAdminAuth', 'success', 'User roles query completed', { data, error });
      
      if (error) {
        console.error('Error checking admin role:', error);
        addDiagnostic('useAdminAuth', 'error', 'Failed to check admin role', error);
        await handleInvalidAccess();
      } else if (data && data.length > 0) {
        const roles = data.map(r => r.role);
        addDiagnostic('useAdminAuth', 'success', `User roles found: ${roles.join(', ')}`);
        
        if (roles.includes('superadmin')) {
          addDiagnostic('useAdminAuth', 'success', 'Setting role to superadmin');
          setAdminRole('superadmin');
        } else if (roles.includes('admin')) {
          addDiagnostic('useAdminAuth', 'success', 'Setting role to admin');
          setAdminRole('admin');
        } else if (roles.includes('lead_curator')) {
          addDiagnostic('useAdminAuth', 'success', 'Setting role to lead_curator');
          setAdminRole('lead_curator');
        } else {
          addDiagnostic('useAdminAuth', 'error', 'User has roles but none are admin roles', roles);
          // Authenticated but NOT an admin (e.g. a Designer trying to log in to Admin portal)
          await handleInvalidAccess();
        }
      } else {
        addDiagnostic('useAdminAuth', 'error', 'No roles found for user');
        await handleInvalidAccess();
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Exception in checkAdminRole:', error);
        addDiagnostic('useAdminAuth', 'error', 'Exception checking admin role', error);
        await handleInvalidAccess();
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [addDiagnostic]);

  const handleInvalidAccess = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setAdminRole(null);
    setUser(null);
    setSession(null);
    // Force sign out from THIS isolated storage to prevent Designer session hijacking the Admin portal
    await supabaseAdmin.auth.signOut({ scope: 'local' });
    addDiagnostic('useAdminAuth', 'success', 'Invalid access handled - user signed out from admin');
  }, [addDiagnostic]);

  // Multi-tab sync for admin auth state - only handle explicit sign-outs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!isMountedRef.current) return;
      
      // Only sync if admin token was explicitly removed (sign-out)
      if (e.key?.includes('admin:') && e.key?.includes('auth-token') && e.newValue === null && userRef.current) {
        addDiagnostic('useAdminAuth', 'success', 'Admin session cleared due to storage change');
        setUser(null);
        setSession(null);
        setAdminRole(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [addDiagnostic]);

  // Main admin auth state listener
  useEffect(() => {
    isMountedRef.current = true;
    
    addDiagnostic('useAdminAuth', 'loading', 'Initializing admin auth listener');
    
    let authCheckTimeout: NodeJS.Timeout;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabaseAdmin.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMountedRef.current) return;
        
        addDiagnostic('useAdminAuth', 'success', `Admin auth state changed: ${event}`);
        
        // Ignore TOKEN_REFRESHED events that might cause flickering
        if (event === 'TOKEN_REFRESHED' && session) {
          setSession(currentSession);
          return;
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (!currentSession?.user) {
          setAdminRole(null);
          setLoading(false);
          addDiagnostic('useAdminAuth', 'success', 'Admin user logged out');
        } else {
          // Debounce role checking to prevent rapid calls
          clearTimeout(authCheckTimeout);
          authCheckTimeout = setTimeout(() => {
            if (isMountedRef.current && currentSession.user) {
              checkAdminRole(currentSession.user.id);
            }
          }, 100);
        }
      }
    );

    // THEN check for existing session
    supabaseAdmin.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!isMountedRef.current) return;
      
      addDiagnostic('useAdminAuth', 'success', existingSession ? 'Existing admin session found' : 'No existing admin session');
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        checkAdminRole(existingSession.user.id);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      if (isMountedRef.current) {
        console.error('Error getting admin session:', error);
        addDiagnostic('useAdminAuth', 'error', 'Failed to get admin session', error);
        setLoading(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      clearTimeout(authCheckTimeout);
      subscription.unsubscribe();
    };
  }, [checkAdminRole, session, addDiagnostic]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      addDiagnostic('useAdminAuth', 'loading', `Admin signing in user: ${email}`);
      
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

      addDiagnostic('useAdminAuth', 'success', 'Admin user signed in successfully');
      return { error: null };
    } catch (error) {
      addDiagnostic('useAdminAuth', 'error', 'Admin signin failed', error);
      return { error: error as Error };
    }
  }, [addDiagnostic]);

  const signOut = useCallback(async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      addDiagnostic('useAdminAuth', 'loading', 'Admin signing out user');
      
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
      
      addDiagnostic('useAdminAuth', 'success', 'Admin user signed out successfully');
    } catch (error) {
      addDiagnostic('useAdminAuth', 'error', 'Admin signout failed', error);
    } finally {
      if (isMountedRef.current) {
        setIsSigningOut(false);
      }
    }
  }, [user, isSigningOut, addDiagnostic]);

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
