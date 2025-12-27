import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/integrations/supabase/admin-client';

type AdminRole = 'admin' | 'superadmin' | null;

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

  const isAdmin = adminRole === 'admin' || adminRole === 'superadmin';
  const isSuperadmin = adminRole === 'superadmin';

  // Stable ref to prevent stale closures
  const userRef = React.useRef<User | null>(null);
  userRef.current = user;

  // Multi-tab sync for admin auth state - only handle explicit sign-outs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
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

  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabaseAdmin.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted) return;
        
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
        } else {
          // Check role with setTimeout to prevent deadlock
          setTimeout(() => {
            if (isMounted) {
              checkAdminRole(currentSession.user.id);
            }
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabaseAdmin.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!isMounted) return;
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        checkAdminRole(existingSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      // Get admin/superadmin roles only for the user
      const { data, error } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error checking admin role:', error);
        setAdminRole(null);
      } else if (data && data.length > 0) {
        // Priority: superadmin > admin
        const roles = data.map(r => r.role);
        if (roles.includes('superadmin')) {
          setAdminRole('superadmin');
        } else if (roles.includes('admin')) {
          setAdminRole('admin');
        } else {
          // User is authenticated but not an admin
          setAdminRole(null);
        }
      } else {
        setAdminRole(null);
      }
    } catch {
      setAdminRole(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
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
  };

  const signOut = async () => {
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
    } finally {
      setIsSigningOut(false);
    }
  };

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
