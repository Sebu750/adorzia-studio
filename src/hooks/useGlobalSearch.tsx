import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SearchResult {
  result_type: 'designer' | 'product' | 'collection';
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  url: string;
  relevance: number;
}

export function useGlobalSearch(query: string, enabled: boolean = true) {
  return useQuery<SearchResult[]>({
    queryKey: ['global-search', query],
    queryFn: async () => {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const { data, error } = await supabase.rpc('global_search', {
        search_query: query.trim(),
        result_limit: 20
      });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      return (data || []) as SearchResult[];
    },
    enabled: enabled && query.trim().length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useFollowDesigner() {
  const followDesigner = async (designerId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to follow designers');

    const { error } = await supabase
      .from('designer_follows')
      .insert({ follower_id: user.id, designer_id: designerId });

    if (error) throw error;
  };

  const unfollowDesigner = async (designerId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to unfollow designers');

    const { error } = await supabase
      .from('designer_follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('designer_id', designerId);

    if (error) throw error;
  };

  const isFollowing = async (designerId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('designer_follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('designer_id', designerId)
      .maybeSingle();

    if (error) {
      console.error('Error checking follow status:', error);
      return false;
    }

    return !!data;
  };

  return { followDesigner, unfollowDesigner, isFollowing };
}

export function useDesignerFollowers(designerId: string) {
  return useQuery<number>({
    queryKey: ['designer-followers', designerId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_follower_count', {
        designer_user_id: designerId
      });

      if (error) {
        console.error('Error getting follower count:', error);
        return 0;
      }

      return data || 0;
    },
    enabled: !!designerId,
  });
}

export function useUserFollowing(userId?: string) {
  return useQuery<string[]>({
    queryKey: ['user-following', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('designer_follows')
        .select('designer_id')
        .eq('follower_id', userId);

      if (error) {
        console.error('Error getting following list:', error);
        return [];
      }

      return data.map(f => f.designer_id);
    },
    enabled: !!userId,
  });
}
