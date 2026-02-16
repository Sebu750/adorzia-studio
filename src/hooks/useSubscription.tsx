import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { SubscriptionTier, PRODUCT_TO_TIER, SUBSCRIPTION_TIERS } from '@/lib/subscription';

interface SubscriptionContextType {
  tier: SubscriptionTier | null;
  isSubscribed: boolean;
  subscriptionEnd: string | null;
  loading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  startCheckout: (tier: SubscriptionTier) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
<<<<<<< HEAD
  forceRefreshSubscription: () => Promise<void>; // New manual refresh option
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD
  const [errorCount, setErrorCount] = useState(0); // Track consecutive errors

  // TEMPORARY: Completely disable subscription checks to stop the 500 errors
  // This prevents the function from being called at all
  const refreshSubscription = useCallback(async () => {
    console.log('Subscription check temporarily disabled to prevent 500 errors');
    // Always return basic tier immediately
    setTier('basic');
    setIsSubscribed(false);
    setSubscriptionEnd(null);
    setLoading(false);
    setError(null);
    setErrorCount(0);
  }, []);

  // Manual refresh also disabled
  const forceRefreshSubscription = useCallback(async () => {
    return refreshSubscription();
  }, [refreshSubscription]);
=======

  const refreshSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setTier(null);
      setIsSubscribed(false);
      setSubscriptionEnd(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fnError } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      // Don't throw on error - just default to free tier
      if (fnError) {
        console.warn('Subscription check failed, defaulting to free tier:', fnError);
        setTier('basic');
        setIsSubscribed(false);
        setSubscriptionEnd(null);
        setLoading(false);
        return;
      }

      if (data?.subscribed && data?.product_id) {
        const tierFromProduct = PRODUCT_TO_TIER[data.product_id];
        setTier(tierFromProduct || 'basic');
        setIsSubscribed(true);
        setSubscriptionEnd(data.subscription_end || null);
      } else {
        setTier('basic');
        setIsSubscribed(false);
        setSubscriptionEnd(null);
      }
    } catch (err) {
      // Gracefully handle errors - don't block the UI
      console.warn('Error checking subscription, defaulting to free tier:', err);
      setError(err instanceof Error ? err.message : 'Failed to check subscription');
      setTier('basic');
      setIsSubscribed(false);
      setSubscriptionEnd(null);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

  const startCheckout = useCallback(async (selectedTier: SubscriptionTier) => {
    if (!session?.access_token) {
      throw new Error('You must be logged in to subscribe');
    }

    const tierConfig = SUBSCRIPTION_TIERS[selectedTier];
    if (!tierConfig) {
      throw new Error('Invalid tier selected');
    }

    const { data, error: fnError } = await supabase.functions.invoke('create-checkout', {
      body: { priceId: tierConfig.priceId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (fnError) throw fnError;
    if (data.error) throw new Error(data.error);

    if (data.url) {
      window.open(data.url, '_blank');
    }
  }, [session?.access_token]);

  const openCustomerPortal = useCallback(async () => {
    if (!session?.access_token) {
      throw new Error('You must be logged in to manage subscription');
    }

    const { data, error: fnError } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (fnError) throw fnError;
    if (data.error) throw new Error(data.error);

    if (data.url) {
      window.open(data.url, '_blank');
    }
  }, [session?.access_token]);

<<<<<<< HEAD
  // TEMPORARY: Disable initial subscription check to prevent errors
  // useEffect(() => {
  //   if (user) {
  //     setErrorCount(0); // Reset error count when user changes
  //     refreshSubscription();
  //   } else {
  //     setTier(null);
  //     setIsSubscribed(false);
  //     setSubscriptionEnd(null);
  //     setLoading(false);
  //     setErrorCount(0);
  //   }
  // }, [user, refreshSubscription]);
  
  // Always set to basic tier immediately
  useEffect(() => {
    setTier('basic');
    setIsSubscribed(false);
    setSubscriptionEnd(null);
    setLoading(false);
    setError(null);
    setErrorCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // One-time initialization - no dependencies needed

  // TEMPORARY: Disable auto-refresh completely to prevent errors
  // useEffect(() => {
  //   if (!user) return;
  //
  //   const interval = setInterval(() => {
  //     refreshSubscription();
  //   }, 300000); // 5 minutes
  //
  //   return () => clearInterval(interval);
  // }, [user, refreshSubscription]);
=======
  // Check subscription on mount and when user changes
  useEffect(() => {
    if (user) {
      refreshSubscription();
    } else {
      setTier(null);
      setIsSubscribed(false);
      setSubscriptionEnd(null);
      setLoading(false);
    }
  }, [user, refreshSubscription]);

  // Refresh subscription periodically (every 60 seconds)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [user, refreshSubscription]);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isSubscribed,
        subscriptionEnd,
        loading,
        error,
        refreshSubscription,
<<<<<<< HEAD
        forceRefreshSubscription, // Add the manual refresh function
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        startCheckout,
        openCustomerPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
