import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductFilters {
  category?: string;
  collection?: string;
  designer?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'bestselling';
  search?: string;
  featured?: boolean;
  bestseller?: boolean;
  page?: number;
  limit?: number;
}

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
  slug: string | null;
  status: string;
  created_at: string;
  sku?: string;
  materials?: string[];
  care_instructions?: string;
  designer?: {
    user_id: string;
    name: string;
    brand_name: string;
    avatar_url: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ProductDetailResponse {
  product: Product & {
    designer?: {
      id: string;
      full_name: string;
      brand_name: string;
      avatar_url: string;
      bio: string;
    };
  };
  relatedProducts: Product[];
  reviews: Array<{
    id: string;
    rating: number;
    title: string;
    content: string;
    created_at: string;
    customer?: {
      name: string;
    };
  }>;
}

export function useMarketplaceProducts(filters: ProductFilters = {}) {
  return useQuery<ProductsResponse>({
    queryKey: ['marketplace-products', filters],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams();
      params.set('action', 'list');
      
      if (filters.category) params.set('category', filters.category);
      if (filters.collection) params.set('collection', filters.collection);
      if (filters.designer) params.set('designer', filters.designer);
      if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
      if (filters.sort) params.set('sort', filters.sort);
      if (filters.search) params.set('search', filters.search);
      if (filters.featured) params.set('featured', 'true');
      if (filters.bestseller) params.set('bestseller', 'true');
      if (filters.page) params.set('page', filters.page.toString());
      if (filters.limit) params.set('limit', filters.limit.toString());

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
        // Direct fetch call to handle query parameters properly
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marketplace-products?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
    },
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useMarketplaceProduct(idOrSlug: string) {
  return useQuery<ProductDetailResponse>({
    queryKey: ['marketplace-product', idOrSlug],
    queryFn: async ({ signal }) => {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const params = new URLSearchParams();
      params.set('action', 'detail');
      params.set(isUUID ? 'id' : 'slug', idOrSlug);

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
        // Direct fetch call to handle query parameters properly
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marketplace-products?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
        }

        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
    },
    enabled: !!idOrSlug,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}

export function useMarketplaceCategories() {
  return useQuery({
    queryKey: ['marketplace-categories'],
    queryFn: async ({ signal }) => {
      // Create abort controller with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      // Link to React Query's signal
      if (signal) {
        signal.addEventListener('abort', () => {
          controller.abort();
          clearTimeout(timeoutId);
        });
      }

      try {
        // Direct fetch call to handle query parameters properly
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marketplace-products?action=categories`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // Return the categories array directly for consistent usage
        return data.categories || [];
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useMarketplaceCollections(featured = false) {
  return useQuery({
    queryKey: ['marketplace-collections', featured],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams();
      params.set('action', 'collections');
      if (featured) params.set('featured', 'true');

      // Create abort controller with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      // Link to React Query's signal
      if (signal) {
        signal.addEventListener('abort', () => {
          controller.abort();
          clearTimeout(timeoutId);
        });
      }

      try {
        // Direct fetch call to handle query parameters properly
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marketplace-products?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch collections: ${response.status} ${response.statusText}`);
        }

        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  });
}
