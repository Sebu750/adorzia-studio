import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  sale_price: number | null;
  images: string[];
  designer_id: string;
  category_id: string | null;
  average_rating: number;
  review_count: number;
  sold_count: number;
  is_bestseller: boolean;
  is_limited_edition: boolean;
  is_made_to_order: boolean;
  slug: string | null;
  status: string;
  created_at: string;
  sku?: string;
  materials?: string[];
  care_instructions?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface DesignerProductsResponse {
  data: Product[];
  isLoading: boolean;
  error: Error | null;
}

export function useDesignerProducts(designerId?: string) {
  return useQuery<Product[]>({
    queryKey: ['designer-products', designerId],
    queryFn: async ({ signal }) => {
      if (!designerId) {
        return [];
      }

      // Create abort controller with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Link to React Query's signal
      if (signal) {
        signal.addEventListener('abort', () => {
          controller.abort();
          clearTimeout(timeoutId);
        });
      }

      try {
        const { data, error } = await supabase
          .from('marketplace_products')
          .select(`
            *,
            category:category_id (
              id,
              name,
              slug
            )
          `)
          .eq('designer_id', designerId)
          .eq('status', 'live')
          .order('created_at', { ascending: false });

        clearTimeout(timeoutId);

        if (error) {
          throw new Error(`Failed to fetch designer products: ${error.message}`);
        }

        return data || [];
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
    },
    enabled: !!designerId,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime is now gcTime in v5)
  });
}
