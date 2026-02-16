import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress;
  email: string;
  saveAddress?: boolean;
}

interface CheckoutState {
  isLoading: boolean;
  clientSecret: string | null;
  orderId: string | null;
  error: string | null;
}

export function useCheckout() {
  const [state, setState] = useState<CheckoutState>({
    isLoading: false,
    clientSecret: null,
    orderId: null,
    error: null,
  });
  const { toast } = useToast();

  const createCheckoutSession = useCallback(async (
    checkoutData: CheckoutData,
    cartId: string
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('marketplace-checkout', {
        body: {
          action: 'create',
          cart_id: cartId,
          shipping_address: checkoutData.shippingAddress,
          email: checkoutData.email,
          customer_id: session?.user?.id || null,
          save_address: checkoutData.saveAddress,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { clientSecret, orderId } = response.data;
      
      setState({
        isLoading: false,
        clientSecret,
        orderId,
        error: null,
      });

      return { clientSecret, orderId };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create checkout session';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast({
        title: "Checkout Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const confirmPayment = useCallback(async (orderId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await supabase.functions.invoke('marketplace-checkout', {
        body: {
          action: 'confirm',
          order_id: orderId,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to confirm payment';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const applyPromoCode = useCallback(async (code: string, cartId: string) => {
    try {
      const response = await supabase.functions.invoke('marketplace-cart', {
        body: {
          action: 'apply_promo',
          cart_id: cartId,
          promo_code: code,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Promo Applied",
        description: `Discount code "${code}" has been applied.`,
      });

      return response.data;
    } catch (error: any) {
      toast({
        title: "Invalid Code",
        description: error.message || 'Failed to apply promo code',
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const removePromoCode = useCallback(async (cartId: string) => {
    try {
      const response = await supabase.functions.invoke('marketplace-cart', {
        body: {
          action: 'remove_promo',
          cart_id: cartId,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Promo Removed",
        description: "Discount code has been removed.",
      });

      return response.data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to remove promo code',
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  return {
    ...state,
    createCheckoutSession,
    confirmPayment,
    applyPromoCode,
    removePromoCode,
  };
}
