import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface WishlistItem {
  id: string;
  product_id: string;
  title: string;
  price: number;
  sale_price: number | null;
  images: string[];
  designer_id: string;
  designer_name: string;
  brand_name: string;
  added_at: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
  isAuthenticated: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, isCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchWishlist = useCallback(async () => {
    // Only fetch wishlist for authenticated customers
    if (!user || !isCustomer) {
      setItems([]);
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('marketplace_wishlist')
        .select(`
          id,
          product_id,
          added_at,
          product:marketplace_products!inner(
            id,
            title,
            price,
            sale_price,
            images,
            designer_id,
            designer:profiles!marketplace_products_designer_id_fkey(name, brand_name)
          )
        `)
        .eq('customer_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;

      const formattedItems: WishlistItem[] = (data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        title: item.product.title,
        price: item.product.price,
        sale_price: item.product.sale_price,
        images: item.product.images || [],
        designer_id: item.product.designer_id,
        designer_name: item.product.designer?.name || '',
        brand_name: item.product.designer?.brand_name || '',
        added_at: item.added_at,
      }));

      setItems(formattedItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isCustomer]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = useCallback(async (productId: string): Promise<boolean> => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save items to your wishlist.",
      });
      navigate('/shop/auth', { state: { from: location.pathname } });
      return false;
    }
    
    // Check if user has customer role
    if (!isCustomer) {
      toast({
        title: "Customer account required",
        description: "Only customer accounts can save items to wishlist.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('marketplace_wishlist')
        .insert({
          customer_id: user.id,
          product_id: productId,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already in wishlist",
            description: "This item is already in your wishlist.",
          });
          return false;
        }
        throw error;
      }

      await fetchWishlist();
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist.",
      });
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist.",
        variant: "destructive",
      });
      return false;
    }
  }, [fetchWishlist, toast, user, isCustomer, navigate, location.pathname]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    // Check if user is authenticated
    if (!user || !isCustomer) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('marketplace_wishlist')
        .delete()
        .eq('customer_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      await fetchWishlist();
      toast({
        title: "Removed",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive",
      });
    }
  }, [fetchWishlist, toast, user, isCustomer]);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.product_id === productId);
  }, [items]);

  const isAuthenticated = !!user && isCustomer;

  return (
    <WishlistContext.Provider value={{
      items,
      isLoading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      refreshWishlist: fetchWishlist,
      isAuthenticated,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
