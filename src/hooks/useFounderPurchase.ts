import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PurchaseResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

export const useFounderPurchase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseFounderTier = async (tierId: string): Promise<PurchaseResult> => {
    setLoading(true);
    setError(null);
    
    try {
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated. Please sign in first.');
      }

      // Call the Supabase edge function directly
      const { data, error: funcError } = await supabase.functions.invoke('purchase-foundation-rank', {
        body: { tierId }
      });

      if (funcError) {
        throw new Error(funcError.message || 'Failed to initiate purchase');
      }

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
        return { success: true, redirectUrl: data.url };
      } else {
        throw new Error('No redirect URL received from server');
      }
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || 'An error occurred during purchase');
      return { success: false, error: err.message || 'An error occurred during purchase' };
    } finally {
      setLoading(false);
    }
  };

  return {
    purchaseFounderTier,
    loading,
    error,
  };
};