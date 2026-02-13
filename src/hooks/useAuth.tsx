import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Add diagnostic import
import { useDiagnostics } from '@/components/DiagnosticOverlay';

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
  
  // Diagnostic hook
  const { addDiagnostic } = useDiagnostics();
  
  // Refs to prevent stale closures
  const userRef = useRef<User | null>(null);
  const isMountedRef = useRef(true);
  
  userRef.current = user;

  // Memoized role checking function
  const checkUserRole = useCallback(async (userId: string) => {
    if (!isMountedRef.current) return;
    
    try {
      addDiagnostic('useAuth', 'loading', `Checking role for user: ${userId}`);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (!isMountedRef.current) return;
      
      if (error) {
        console.error('Error checking user role:', error);
        addDiagnostic('useAuth', 'error', 'Failed to check user role', error);
        setUserRole(null);
      } else if (data && data.length > 0) {
        const roles = data.map(r => r.role);
        addDiagnostic('useAuth', 'success', `User roles found: ${roles.join(', ')}`);
        
        // Priority: superadmin > admin > designer
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
        addDiagnostic('useAuth', 'success', 'No roles found for user');
        setUserRole(null);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Exception in checkUserRole:', error);
        addDiagnostic('useAuth', 'error', 'Exception checking user role', error);
        setUserRole(null);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [addDiagnostic]);

  // Multi-tab sync for auth state - only handle explicit sign-outs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!isMountedRef.current) return;
      
      // Only sync if token was explicitly removed (sign-out)
      if (e.key?.includes('supabase.auth.token') && e.newValue === null && userRef.current) {
        addDiagnostic('useAuth', 'success', 'Session cleared due to storage change');
        setUser(null);
        setSession(null);
        setUserRole(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [addDiagnostic]);

  // Main auth state listener
  useEffect(() => {
    isMountedRef.current = true;
    
    addDiagnostic('useAuth', 'loading', 'Initializing auth listener');
    
    let authCheckTimeout: NodeJS.Timeout;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMountedRef.current) return;
        
        addDiagnostic('useAuth', 'success', `Auth state changed: ${event}`);
        
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
          addDiagnostic('useAuth', 'success', 'User logged out');
        } else {
          // Debounce role checking to prevent rapid calls
          clearTimeout(authCheckTimeout);
          authCheckTimeout = setTimeout(() => {
            if (isMountedRef.current && currentSession.user) {
              checkUserRole(currentSession.user.id);
            }
          }, 100);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!isMountedRef.current) return;
      
      addDiagnostic('useAuth', 'success', existingSession ? 'Existing session found' : 'No existing session');
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        checkUserRole(existingSession.user.id);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      if (isMountedRef.current) {
        console.error('Error getting session:', error);
        addDiagnostic('useAuth', 'error', 'Failed to get session', error);
        setLoading(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      clearTimeout(authCheckTimeout);
      subscription.unsubscribe();
    };
  }, [checkUserRole, session, addDiagnostic]);

  const signUp = useCallback(async (email: string, password: string, name: string, category: string, bio?: string, skills?: string[]) => {
    try {
      addDiagnostic('useAuth', 'loading', `Signing up user: ${email}`);
      
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

      addDiagnostic('useAuth', 'success', 'User signed up successfully');
      return { error: null };
    } catch (error) {
      addDiagnostic('useAuth', 'error', 'Signup failed', error);
      return { error: error as Error };
    }
  }, [addDiagnostic]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      addDiagnostic('useAuth', 'loading', `Signing in user: ${email}`);
      
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

      addDiagnostic('useAuth', 'success', 'User signed in successfully');
      return { error: null };
    } catch (error) {
      addDiagnostic('useAuth', 'error', 'Signin failed', error);
      return { error: error as Error };
    }
  }, [addDiagnostic]);

  const signOut = useCallback(async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      addDiagnostic('useAuth', 'loading', 'Signing out user');
      
      if (user) {
        await supabase.from('auth_logs').insert({
          user_id: user.id,
          action: 'logout',
          user_agent: navigator.userAgent,
        });
      }
      // Use local scope to only sign out from studio session, not admin
      await supabase.auth.signOut({ scope: 'local' });
      setUserRole(null);
      
      addDiagnostic('useAuth', 'success', 'User signed out successfully');
    } catch (error) {
      addDiagnostic('useAuth', 'error', 'Signout failed', error);
    } finally {
      if (isMountedRef.current) {
        setIsSigningOut(false);
      }
    }
  }, [user, isSigningOut, addDiagnostic]);

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const isDesigner = userRole === 'designer' || isAdmin;

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
