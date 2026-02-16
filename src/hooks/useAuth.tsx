<<<<<<< HEAD
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'customer' | 'designer' | 'admin' | 'superadmin' | null;

export interface CustomerProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
  updated_at?: string;
}
=======
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'designer' | 'admin' | 'superadmin' | null;
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isDesigner: boolean;
<<<<<<< HEAD
  isCustomer: boolean;
  userRole: AppRole;
  customerProfile: CustomerProfile | null;
=======
  userRole: AppRole;
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // Refs to prevent stale closures
  const userRef = useRef<User | null>(null);
  const isMountedRef = useRef(true);
  
  userRef.current = user;

  // Memoized role checking function
  const checkUserRole = useCallback(async (userId: string) => {
    if (!isMountedRef.current) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (!isMountedRef.current) return;
      
      if (error) {
        setUserRole(null);
      } else if (data && data.length > 0) {
        const roles = data.map(r => r.role);
        
        // Priority: superadmin > admin > designer > customer
        if (roles.includes('superadmin')) {
          setUserRole('superadmin');
        } else if (roles.includes('admin')) {
          setUserRole('admin');
        } else if (roles.includes('designer')) {
          setUserRole('designer');
        } else if (roles.includes('customer')) {
          setUserRole('customer');
        } else {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    } catch (error) {
      if (isMountedRef.current) {
        setUserRole(null);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);
=======
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const isDesigner = userRole === 'designer' || isAdmin;

  // Stable ref to prevent stale closures
  const userRef = React.useRef<User | null>(null);
  userRef.current = user;
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

  // Multi-tab sync for auth state - only handle explicit sign-outs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
<<<<<<< HEAD
      if (!isMountedRef.current) return;
      
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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

<<<<<<< HEAD
  // Main auth state listener
  useEffect(() => {
    isMountedRef.current = true;
    
    let authCheckTimeout: NodeJS.Timeout;
=======
  useEffect(() => {
    let isMounted = true;
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
<<<<<<< HEAD
        if (!isMountedRef.current) return;
        
        // Ignore TOKEN_REFRESHED events that might cause flickering
        if (event === 'TOKEN_REFRESHED') {
=======
        if (!isMounted) return;
        
        // Ignore TOKEN_REFRESHED events that might cause flickering
        if (event === 'TOKEN_REFRESHED' && session) {
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          setSession(currentSession);
          return;
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (!currentSession?.user) {
          setUserRole(null);
          setLoading(false);
        } else {
<<<<<<< HEAD
          // Debounce role checking to prevent rapid calls
          clearTimeout(authCheckTimeout);
          authCheckTimeout = setTimeout(() => {
            if (isMountedRef.current && currentSession.user) {
              checkUserRole(currentSession.user.id);
            }
          }, 100);
=======
          // Check role with setTimeout to prevent deadlock
          setTimeout(() => {
            if (isMounted) {
              checkUserRole(currentSession.user.id);
            }
          }, 0);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        }
      }
    );

<<<<<<< HEAD
    // THEN check for existing session (only on mount)
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!isMountedRef.current) return;
=======
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!isMounted) return;
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        checkUserRole(existingSession.user.id);
      } else {
        setLoading(false);
      }
<<<<<<< HEAD
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
  }, []); // Empty dependency array - only run on mount

  const signUp = useCallback(async (email: string, password: string, name: string, category: string, bio?: string, skills?: string[]) => {
=======
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
            signup_type: 'designer', // Used by trigger to assign correct role
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
=======
  };

  const signIn = async (email: string, password: string) => {
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
  }, []);

  const signOut = useCallback(async () => {
    if (isSigningOut) return;
    
=======
  };

  const signOut = async () => {
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    setIsSigningOut(true);
    try {
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
<<<<<<< HEAD
    } catch (error) {
      // Silently handle signout errors
    } finally {
      if (isMountedRef.current) {
        setIsSigningOut(false);
      }
    }
  }, [user, isSigningOut]);

  // Fetch customer profile when user is a customer
  useEffect(() => {
    if (user && userRole === 'customer') {
      fetchCustomerProfile(user.id);
    } else {
      setCustomerProfile(null);
    }
  }, [user, userRole]);

  const fetchCustomerProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('marketplace_customers')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!error && data) {
        setCustomerProfile(data as CustomerProfile);
      }
    } catch (error) {
      console.error('Error fetching customer profile:', error);
    }
  }, []);

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const isDesigner = userRole === 'designer' || isAdmin;
  const isCustomer = userRole === 'customer';
=======
    } finally {
      setIsSigningOut(false);
    }
  };
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isAdmin, 
      isDesigner, 
<<<<<<< HEAD
      isCustomer,
      userRole,
      customerProfile,
=======
      userRole,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
