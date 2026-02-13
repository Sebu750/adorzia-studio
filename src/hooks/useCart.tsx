import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  product_id: string;
  title: string;
  designer_name?: string;
  price: number;
  image: string | null;
  quantity: number;
  variant?: Record<string, string>;
  product?: {
    id: string;
    title: string;
    price: number;
    images: string[];
    inventory_count: number;
    status: string;
  };
  available?: boolean;
}

interface Cart {
  id: string;
  customer_id: string | null;
  session_id: string | null;
  items: CartItem[];
  subtotal: number;
  discount_code: string | null;
  discount_amount: number;
}

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  addItem: (productId: string, quantity?: number, variant?: Record<string, string>) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variant?: Record<string, string>) => Promise<void>;
  removeItem: (productId: string, variant?: Record<string, string>) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate a session ID for guest carts
const getSessionId = () => {
  let sessionId = localStorage.getItem('marketplace_session_id');
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('marketplace_session_id', sessionId);
  }
  return sessionId;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const getAuthHeader = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
  };

  const callCartFunction = useCallback(async (action: string, body: Record<string, unknown> = {}) => {
    const authHeader = await getAuthHeader();
    const sessionId = getSessionId();

    const response = await supabase.functions.invoke('marketplace-cart', {
      headers: authHeader,
      body: {
        action,
        session_id: sessionId,
        ...body,
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await callCartFunction('get');
      setCart(data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [callCartFunction]);

  const addItem = useCallback(async (
    productId: string, 
    quantity = 1, 
    variant?: Record<string, string>
  ) => {
    try {
      const data = await callCartFunction('add', {
        product_id: productId,
        quantity,
        variant,
      });
      setCart(data.cart);
      toast({
        title: "Added to bag",
        description: data.message || "Item has been added to your shopping bag.",
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  }, [callCartFunction, toast]);

  const updateQuantity = useCallback(async (
    productId: string, 
    quantity: number, 
    variant?: Record<string, string>
  ) => {
    try {
      const data = await callCartFunction('update', {
        product_id: productId,
        quantity,
        variant,
      });
      setCart(data.cart);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive",
      });
    }
  }, [callCartFunction, toast]);

  const removeItem = useCallback(async (
    productId: string, 
    variant?: Record<string, string>
  ) => {
    try {
      const data = await callCartFunction('remove', {
        product_id: productId,
        variant,
      });
      setCart(data.cart);
      toast({
        title: "Removed",
        description: "Item has been removed from your bag.",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item.",
        variant: "destructive",
      });
    }
  }, [callCartFunction, toast]);

  const clearCart = useCallback(async () => {
    try {
      const data = await callCartFunction('clear');
      setCart(data.cart);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
    }
  }, [callCartFunction, toast]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart,
      itemCount,
      isLoading,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
