import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductFilters {
  category?: string;
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
    id: string;
    name: string;
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
      name: string;
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
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('action', 'list');
      
      if (filters.category) params.set('category', filters.category);
      if (filters.designer) params.set('designer', filters.designer);
      if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
      if (filters.sort) params.set('sort', filters.sort);
      if (filters.search) params.set('search', filters.search);
      if (filters.featured) params.set('featured', 'true');
      if (filters.bestseller) params.set('bestseller', 'true');
      if (filters.page) params.set('page', filters.page.toString());
      if (filters.limit) params.set('limit', filters.limit.toString());

      const { data, error } = await supabase.functions.invoke('marketplace-products', {
        body: null,
        headers: {},
      });

      // Since we can't pass query params easily, we'll modify the call
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marketplace-products?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      return response.json();
    },
  });
}

export function useMarketplaceProduct(idOrSlug: string) {
  return useQuery<ProductDetailResponse>({
    queryKey: ['marketplace-product', idOrSlug],
    queryFn: async () => {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const params = new URLSearchParams();
      params.set('action', 'detail');
      params.set(isUUID ? 'id' : 'slug', idOrSlug);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marketplace-products?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      return response.json();
    },
    enabled: !!idOrSlug,
  });
}

export function useMarketplaceCategories() {
  return useQuery({
    queryKey: ['marketplace-categories'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marketplace-products?action=categories`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      return response.json();
    },
  });
}

export function useMarketplaceCollections(featured = false) {
  return useQuery({
    queryKey: ['marketplace-collections', featured],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('action', 'collections');
      if (featured) params.set('featured', 'true');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marketplace-products?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      return response.json();
    },
  });
}
