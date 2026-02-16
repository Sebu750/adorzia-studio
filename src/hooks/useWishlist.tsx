import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchWishlist = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // For guest users, check localStorage
        const guestWishlist = localStorage.getItem('guest_wishlist');
        if (guestWishlist) {
          const productIds = JSON.parse(guestWishlist);
          if (productIds.length > 0) {
            const { data: products } = await supabase
              .from('marketplace_products')
              .select(`
                id,
                title,
                price,
                sale_price,
                images,
                designer_id,
                designer:profiles!marketplace_products_designer_id_fkey(name, brand_name)
              `)
              .in('id', productIds)
              .eq('status', 'live');
            
            if (products) {
              setItems(products.map(p => ({
                id: p.id,
                product_id: p.id,
                title: p.title,
                price: p.price,
                sale_price: p.sale_price,
                images: p.images || [],
                designer_id: p.designer_id,
                designer_name: (p.designer as any)?.name || '',
                brand_name: (p.designer as any)?.brand_name || '',
                added_at: new Date().toISOString(),
              })));
            }
          } else {
            setItems([]);
          }
        } else {
          setItems([]);
        }
        setIsLoading(false);
        return;
      }

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
        .eq('customer_id', session.user.id)
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
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = useCallback(async (productId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Store in localStorage for guest users
        const guestWishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
        if (!guestWishlist.includes(productId)) {
          guestWishlist.push(productId);
          localStorage.setItem('guest_wishlist', JSON.stringify(guestWishlist));
          await fetchWishlist();
          toast({
            title: "Added to wishlist",
            description: "Sign in to save your wishlist permanently.",
          });
        }
        return;
      }

      const { error } = await supabase
        .from('marketplace_wishlist')
        .insert({
          customer_id: session.user.id,
          product_id: productId,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already in wishlist",
            description: "This item is already in your wishlist.",
          });
          return;
        }
        throw error;
      }

      await fetchWishlist();
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist.",
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist.",
        variant: "destructive",
      });
    }
  }, [fetchWishlist, toast]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Remove from localStorage for guest users
        const guestWishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
        const updated = guestWishlist.filter((id: string) => id !== productId);
        localStorage.setItem('guest_wishlist', JSON.stringify(updated));
        await fetchWishlist();
        toast({
          title: "Removed",
          description: "Item has been removed from your wishlist.",
        });
        return;
      }

      const { error } = await supabase
        .from('marketplace_wishlist')
        .delete()
        .eq('customer_id', session.user.id)
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
  }, [fetchWishlist, toast]);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.product_id === productId);
  }, [items]);

  return (
    <WishlistContext.Provider value={{
      items,
      isLoading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      refreshWishlist: fetchWishlist,
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
