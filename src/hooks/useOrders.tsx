import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Order {
  id: string;
  order_number: string;
  status: 'confirmed' | 'sampling' | 'production' | 'quality_check' | 'shipping' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  total: number;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  created_at: string;
  shipping_address: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  tracking_number?: string;
  tracking_url?: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: {
    id: string;
    title: string;
    images: string[];
    designer?: {
      brand_name: string;
    };
  };
}

export interface SavedAddress {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
}

export function useOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchOrders = async (): Promise<Order[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return [];
    }

    const { data, error } = await supabase
      .from('marketplace_orders')
      .select(`
        *,
        items:marketplace_order_items(
          *,
          product:marketplace_products(
            id,
            title,
            images,
            designer:profiles!marketplace_products_designer_id_fkey(brand_name)
          )
        )
      `)
      .eq('customer_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((order: any) => ({
      ...order,
      items: order.items?.map((item: any) => ({
        ...item,
        product: item.product ? {
          ...item.product,
          designer: item.product.designer?.[0] || null,
        } : null,
      })) || [],
    }));
  };

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: fetchOrders,
  });

  const fetchOrderById = async (orderId: string): Promise<Order | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;

    const { data, error } = await supabase
      .from('marketplace_orders')
      .select(`
        *,
        items:marketplace_order_items(
          *,
          product:marketplace_products(
            id,
            title,
            images,
            designer:profiles!marketplace_products_designer_id_fkey(brand_name)
          )
        )
      `)
      .eq('id', orderId)
      .eq('customer_id', session.user.id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      items: data.items?.map((item: any) => ({
        ...item,
        product: item.product ? {
          ...item.product,
          designer: item.product.designer?.[0] || null,
        } : null,
      })) || [],
    };
  };

  return {
    orders,
    isLoading,
    error,
    fetchOrderById,
  };
}

export function useSavedAddresses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchAddresses = async (): Promise<SavedAddress[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return [];
    }

    const { data, error } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', session.user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['saved-addresses'],
    queryFn: fetchAddresses,
  });

  const addAddress = useMutation({
    mutationFn: async (address: Omit<SavedAddress, 'id'>) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('customer_addresses')
        .insert({
          ...address,
          customer_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-addresses'] });
      toast({
        title: "Address Saved",
        description: "Your address has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save address",
        variant: "destructive",
      });
    },
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, ...address }: SavedAddress) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('customer_addresses')
        .update(address)
        .eq('id', id)
        .eq('customer_id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-addresses'] });
      toast({
        title: "Address Updated",
        description: "Your address has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update address",
        variant: "destructive",
      });
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', id)
        .eq('customer_id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-addresses'] });
      toast({
        title: "Address Deleted",
        description: "Your address has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete address",
        variant: "destructive",
      });
    },
  });

  const setDefaultAddress = useMutation({
    mutationFn: async (id: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // First, unset current default
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('customer_id', session.user.id);

      // Then set new default
      const { data, error } = await supabase
        .from('customer_addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('customer_id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-addresses'] });
      toast({
        title: "Default Updated",
        description: "Your default address has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update default address",
        variant: "destructive",
      });
    },
  });

  return {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
