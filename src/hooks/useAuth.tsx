import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'designer' | 'admin' | 'superadmin' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isDesigner: boolean;
  userRole: AppRole;
  isSigningOut: boolean;
  signUp: (email: string, password: string, name: string, category: string, bio?: string, skills?: string[]) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<AppRole>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const isDesigner = userRole === 'designer' || isAdmin;

  // Stable ref to prevent stale closures
  const userRef = React.useRef<User | null>(null);
  userRef.current = user;

  // Multi-tab sync for auth state - only handle explicit sign-outs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only sync if token was explicitly removed (sign-out)
      if (e.key?.includes('supabase.auth.token') && e.newValue === null && userRef.current) {
        setUser(null);
        setSession(null);
        setUserRole(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
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
          setUserRole(null);
          setLoading(false);
        } else {
          // Check role with setTimeout to prevent deadlock
          setTimeout(() => {
            if (isMounted) {
              checkUserRole(currentSession.user.id);
            }
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!isMounted) return;
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        checkUserRole(existingSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkUserRole = async (userId: string) => {
    try {
      // Get the highest privilege role for the user
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error checking user role:', error);
        setUserRole(null);
      } else if (data && data.length > 0) {
        // Priority: superadmin > admin > designer
        const roles = data.map(r => r.role);
        if (roles.includes('superadmin')) {
          setUserRole('superadmin');
        } else if (roles.includes('admin')) {
          setUserRole('admin');
        } else if (roles.includes('designer')) {
          setUserRole('designer');
        } else {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    } catch {
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, category: string, bio?: string, skills?: string[]) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            category,
          },
        },
      });

      if (error) throw error;

      // Update profile with bio and skills if provided
      if (data.user && (bio || skills)) {
        await supabase
          .from('profiles')
          .update({ 
            bio: bio || null, 
            skills: skills || [] 
          })
          .eq('user_id', data.user.id);
      }

      // Log signup (without PII)
      await supabase.from('auth_logs').insert({
        action: 'signup',
        metadata: { timestamp: new Date().toISOString() },
        user_agent: navigator.userAgent,
      });

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Log failed attempt (without PII - only error type)
        await supabase.from('auth_logs').insert({
          action: 'login_failed',
          metadata: { error_type: error.message?.includes('Invalid') ? 'invalid_credentials' : 'unknown' },
          user_agent: navigator.userAgent,
        });
        throw error;
      }

      // Log success
      if (data.user) {
        await supabase.from('auth_logs').insert({
          user_id: data.user.id,
          action: 'login_success',
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
        await supabase.from('auth_logs').insert({
          user_id: user.id,
          action: 'logout',
          user_agent: navigator.userAgent,
        });
      }
      await supabase.auth.signOut();
      setUserRole(null);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isAdmin, 
      isDesigner, 
      userRole,
      isSigningOut,
      signUp, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
