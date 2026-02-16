import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, CustomerProfile } from './useAuth';
import { useToast } from './use-toast';

interface CustomerSignUpData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

interface CustomerAuthReturn {
  // From useAuth
  user: ReturnType<typeof useAuth>['user'];
  session: ReturnType<typeof useAuth>['session'];
  loading: ReturnType<typeof useAuth>['loading'];
  isCustomer: ReturnType<typeof useAuth>['isCustomer'];
  customerProfile: ReturnType<typeof useAuth>['customerProfile'];
  isSigningOut: ReturnType<typeof useAuth>['isSigningOut'];
  signIn: ReturnType<typeof useAuth>['signIn'];
  signOut: ReturnType<typeof useAuth>['signOut'];
  // Customer-specific methods
  signUpAsCustomer: (data: CustomerSignUpData) => Promise<{ error: Error | null }>;
  updateCustomerProfile: (updates: Partial<CustomerProfile>) => Promise<{ error: Error | null }>;
  continueAsGuest: () => void;
  isGuest: boolean;
}

const GUEST_SESSION_KEY = 'adorzia_guest_session';

export function useCustomerAuth(): CustomerAuthReturn {
  const auth = useAuth();
  const { toast } = useToast();

  /**
   * Sign up as a new customer
   * Creates auth user, assigns customer role, and creates customer record
   */
  const signUpAsCustomer = useCallback(async ({
    email,
    password,
    name,
    phone
  }: CustomerSignUpData): Promise<{ error: Error | null }> => {
    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/shop/account`,
          data: { 
            name, 
            role: 'customer',
            signup_type: 'customer', // Used by trigger to assign correct role
            phone: phone || null
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Note: Customer role is now automatically assigned by database trigger based on signup_type metadata
        // See migration: 20260215000000_fix_role_assignment.sql

        // 2. Create customer record
        const { error: customerError } = await supabase
          .from('marketplace_customers')
          .insert({
            user_id: authData.user.id,
            email,
            name,
            phone: phone || null,
          });

        if (customerError) {
          console.error('Error creating customer record:', customerError);
          // Don't throw - user is created, record can be fixed later
        }

        // 3. Log signup
        await supabase.from('auth_logs').insert({
          user_id: authData.user.id,
          action: 'customer_signup',
          metadata: { 
            timestamp: new Date().toISOString(),
            has_phone: !!phone 
          },
          user_agent: navigator.userAgent,
        });
      }

      toast({
        title: "Account created!",
        description: "Welcome to Adorzia. Check your email to verify your account.",
      });

      return { error: null };
    } catch (error) {
      const err = error as Error;
      
      // Handle specific error cases
      if (err.message?.includes('User already registered')) {
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
      } else if (err.message?.includes('weak_password')) {
        toast({
          title: "Weak password",
          description: "Please choose a stronger password with at least 8 characters.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign up failed",
          description: err.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }

      return { error: err };
    }
  }, [toast]);

  /**
   * Update customer profile information
   */
  const updateCustomerProfile = useCallback(async (
    updates: Partial<CustomerProfile>
  ): Promise<{ error: Error | null }> => {
    if (!auth.user) {
      return { error: new Error('Not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('marketplace_customers')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', auth.user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your information has been saved.",
      });

      return { error: null };
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Update failed",
        description: err.message || "Could not update your profile. Please try again.",
        variant: "destructive",
      });
      return { error: err };
    }
  }, [auth.user, toast]);

  /**
   * Continue as guest - creates a temporary guest session
   */
  const continueAsGuest = useCallback(() => {
    const guestSession = {
      id: `guest_${Date.now()}`,
      created_at: new Date().toISOString(),
      is_guest: true,
    };
    
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(guestSession));
    
    toast({
      title: "Continuing as guest",
      description: "You can create an account later to save your information.",
    });
  }, [toast]);

  /**
   * Check if current session is a guest session
   */
  const isGuest = (() => {
    if (typeof window === 'undefined') return false;
    const guestSession = localStorage.getItem(GUEST_SESSION_KEY);
    return !!guestSession && !auth.user;
  })();

  /**
   * Clear guest session (call after successful login/signup)
   */
  const clearGuestSession = useCallback(() => {
    localStorage.removeItem(GUEST_SESSION_KEY);
  }, []);

  return {
    // Pass through auth context
    user: auth.user,
    session: auth.session,
    loading: auth.loading,
    isCustomer: auth.isCustomer,
    customerProfile: auth.customerProfile,
    isSigningOut: auth.isSigningOut,
    signIn: auth.signIn,
    signOut: auth.signOut,
    // Customer-specific
    signUpAsCustomer,
    updateCustomerProfile,
    continueAsGuest,
    isGuest,
  };
}

/**
 * Helper to get guest session ID for cart/wishlist storage
 */
export function getGuestSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  const guestSession = localStorage.getItem(GUEST_SESSION_KEY);
  if (guestSession) {
    try {
      const session = JSON.parse(guestSession);
      return session.id;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Clear guest session (useful after login)
 */
export function clearGuestSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GUEST_SESSION_KEY);
  }
}
