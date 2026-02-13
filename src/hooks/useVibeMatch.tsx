import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * FR 1: Visual Similarity Engine (Vibe-Match)
 * Hook for product recommendations based on visual attributes
 */

interface VisualAttributes {
  silhouette_type?: string[];
  fabric_texture?: string[];
  aesthetic_tags?: string[];
  color_palette?: string;
  pattern_type?: string[];
}

interface SimilarProduct {
  product_id: string;
  similarity_score: number;
  match_reasons: string[];
  product?: any;
}

/**
 * Find visually similar products (Vibe-Match)
 */
export function useSimilarProducts(productId: string, limit = 10) {
  return useQuery({
    queryKey: ['similar-products', productId, limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('find_similar_products', {
        p_product_id: productId,
        p_limit: limit,
      });

      if (error) throw error;

      // Fetch full product details
      if (data && data.length > 0) {
        const productIds = data.map((item: any) => item.product_id);
        const { data: products, error: productsError } = await supabase
          .from('marketplace_products')
          .select(`
            *,
            designer:profiles!designer_id(
              id,
              name,
              brand_name,
              avatar_url
            )
          `)
          .in('id', productIds)
          .eq('status', 'live');

        if (productsError) throw productsError;

        return data.map((item: any) => ({
          ...item,
          product: products.find((p: any) => p.id === item.product_id),
        }));
      }

      return [];
    },
    enabled: !!productId,
  });
}

/**
 * Get personalized recommendations based on user's visual preferences
 */
export function usePersonalizedRecommendations(userId?: string, limit = 20) {
  return useQuery({
    queryKey: ['personalized-recommendations', userId, limit],
    queryFn: async () => {
      if (!userId) {
        // For non-authenticated users, return trending products
        const { data, error } = await supabase
          .from('marketplace_products')
          .select(`
            *,
            designer:profiles!designer_id(
              id,
              name,
              brand_name,
              avatar_url
            )
          `)
          .eq('status', 'live')
          .order('view_count', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase.rpc('get_personalized_recommendations', {
        p_user_id: userId,
        p_limit: limit,
      });

      if (error) throw error;

      // Fetch full product details
      if (data && data.length > 0) {
        const productIds = data.map((item: any) => item.product_id);
        const { data: products, error: productsError } = await supabase
          .from('marketplace_products')
          .select(`
            *,
            designer:profiles!designer_id(
              id,
              name,
              brand_name,
              avatar_url
            )
          `)
          .in('id', productIds)
          .eq('status', 'live');

        if (productsError) throw productsError;

        return data.map((item: any) => ({
          ...item,
          product: products.find((p: any) => p.id === item.product_id),
        }));
      }

      return [];
    },
    enabled: true,
  });
}

/**
 * Track user interaction with product (for learning preferences)
 */
export function useTrackInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      interactionType,
      durationSeconds,
    }: {
      productId: string;
      interactionType: 'view' | 'like' | 'cart_add' | 'purchase' | 'wishlist';
      durationSeconds?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('user_product_interactions')
        .insert({
          user_id: user?.id,
          product_id: productId,
          interaction_type: interactionType,
          duration_seconds: durationSeconds,
        });

      if (error) throw error;

      // Update user preferences if authenticated
      if (user?.id) {
        await supabase.rpc('update_user_visual_preferences', {
          p_user_id: user.id,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalized-recommendations'] });
    },
  });
}

/**
 * Search products by visual attributes (Vibe-Match search)
 */
export function useVibeSearch(attributes: VisualAttributes, limit = 20) {
  return useQuery({
    queryKey: ['vibe-search', attributes, limit],
    queryFn: async () => {
      let query = supabase
        .from('marketplace_products')
        .select(`
          *,
          visual_attributes:product_visual_attributes(*),
          designer:profiles!designer_id(
            id,
            name,
            brand_name,
            avatar_url
          )
        `)
        .eq('status', 'live');

      // Build filters based on visual attributes
      if (attributes.silhouette_type && attributes.silhouette_type.length > 0) {
        query = query.contains('visual_attributes.silhouette_type', attributes.silhouette_type);
      }

      if (attributes.aesthetic_tags && attributes.aesthetic_tags.length > 0) {
        query = query.contains('visual_attributes.aesthetic_tags', attributes.aesthetic_tags);
      }

      if (attributes.fabric_texture && attributes.fabric_texture.length > 0) {
        query = query.contains('visual_attributes.fabric_texture', attributes.fabric_texture);
      }

      if (attributes.color_palette) {
        query = query.eq('visual_attributes.color_palette', attributes.color_palette);
      }

      const { data, error } = await query.limit(limit);

      if (error) throw error;
      return data;
    },
    enabled: Object.keys(attributes).length > 0,
  });
}

/**
 * Get user's visual preference profile
 */
export function useUserVibeProfile(userId?: string) {
  return useQuery({
    queryKey: ['user-vibe-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('user_visual_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore not found
      return data;
    },
    enabled: !!userId,
  });
}

/**
 * Get product visual attributes
 */
export function useProductVisualAttributes(productId: string) {
  return useQuery({
    queryKey: ['product-visual-attributes', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_visual_attributes')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!productId,
  });
}
