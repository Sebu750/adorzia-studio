import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  author_id: string | null;
  category: string;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tags: string[] | null;
  view_count: number | null;
  is_featured: boolean | null;
}

export interface ArticleFilters {
  status?: string;
  category?: string;
  search?: string;
  limit?: number;
}

export function useArticles(filters: ArticleFilters = {}) {
  return useQuery({
    queryKey: ["articles", filters],
    queryFn: async () => {
      let query = supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
      if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Article[];
    },
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as Article;
    },
    enabled: !!slug,
  });
}

export function usePublishedArticles(limit?: number) {
  return useQuery({
    queryKey: ["published-articles", limit],
    queryFn: async () => {
      let query = supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Article[];
    },
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (article: Partial<Article>) => {
      const { data, error } = await supabase
        .from("articles")
        .insert(article as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({ title: "Article created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Article> }) => {
      const { error } = await supabase
        .from("articles")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({ title: "Article updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({ title: "Article deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export const ARTICLE_CATEGORIES = [
  { value: "trend-report", label: "Trend Reports" },
  { value: "designer-spotlight", label: "Designer Spotlights" },
  { value: "style-guide", label: "Style Guides" },
  { value: "industry-news", label: "Industry News" },
  { value: "sustainability", label: "Sustainability" },
  { value: "behind-the-scenes", label: "Behind the Scenes" },
];
