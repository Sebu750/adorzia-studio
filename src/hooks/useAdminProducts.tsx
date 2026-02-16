import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["marketplace_products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["marketplace_products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["marketplace_products"]["Update"];

interface CollectionLinkData {
  productId: string;
  collectionId: string;
}

interface CreateCollectionData {
  name: string;
  description?: string;
  designer_id?: string | null;
}

interface CreateCollectionAndLinkData {
  collection: CreateCollectionData;
  productId: string;
}

export interface AdminProductFilters {
  status?: string;
  is_adorzia_product?: boolean;
  designer_id?: string;
  category_id?: string;
  search?: string;
}

export function useAdminProducts(filters: AdminProductFilters = {}) {
  return useQuery({
    queryKey: ["admin-products", filters],
    queryFn: async () => {
      let query = supabase
        .from("marketplace_products")
        .select(`
          *,
          marketplace_categories(id, name, slug)
        `)
        .order("created_at", { ascending: false });

      if (filters.status) {
        // Status filter uses string since we've added new enum values
        query = query.eq("status", filters.status as "draft" | "live" | "archived");
      }
      if (filters.is_adorzia_product !== undefined) {
        query = query.eq("is_adorzia_product", filters.is_adorzia_product);
      }
      if (filters.designer_id) {
        query = query.eq("designer_id", filters.designer_id);
      }
      if (filters.category_id) {
        query = query.eq("category_id", filters.category_id);
      }
      if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useAdminProductStats() {
  return useQuery({
    queryKey: ["admin-product-stats"],
    queryFn: async () => {
      const [totalResult, adorziaResult, vendorResult, liveResult] = await Promise.all([
        supabase.from("marketplace_products").select("*", { count: "exact", head: true }),
        supabase.from("marketplace_products").select("*", { count: "exact", head: true }).eq("is_adorzia_product", true),
        supabase.from("marketplace_products").select("*", { count: "exact", head: true }).eq("is_adorzia_product", false),
        supabase.from("marketplace_products").select("*", { count: "exact", head: true }).eq("status", "live"),
      ]);

      // Try to get pending review count - handle if status enum doesn't include pending_review
      let pendingReview = 0;
      try {
        // The database might only have: draft, live, archived as valid statuses
        // pending_review might not exist in the enum
        const { count } = await supabase
          .from("marketplace_products")
          .select("*", { count: "exact", head: true })
          .eq("status", "draft"); // Use draft as proxy for pending items
        pendingReview = count || 0;
      } catch (e) {
        console.warn('Could not fetch pending review count:', e);
      }

      return {
        totalProducts: totalResult.count || 0,
        adorziaProducts: adorziaResult.count || 0,
        vendorProducts: vendorResult.count || 0,
        pendingReview: pendingReview,
        liveProducts: liveResult.count || 0,
      };
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("marketplace_products")
        .insert({
          ...product,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-stats"] });
      toast({ title: "Product created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating product", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProductUpdate }) => {
      const { data, error } = await supabase
        .from("marketplace_products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-stats"] });
      toast({ title: "Product updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating product", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("marketplace_products")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-stats"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting product", description: error.message, variant: "destructive" });
    },
  });
}

export function useApproveProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("marketplace_products")
        .update({
          status: "live",
          approved_at: new Date().toISOString(),
          approved_by: user.id,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-stats"] });
      toast({ title: "Product approved and published" });
    },
    onError: (error: Error) => {
      toast({ title: "Error approving product", description: error.message, variant: "destructive" });
    },
  });
}

export function useRejectProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("marketplace_products")
        .update({ status: "archived" as "draft" | "live" | "archived" }) // Using archived as rejected workaround
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-stats"] });
      toast({ title: "Product rejected" });
    },
    onError: (error: Error) => {
      toast({ title: "Error rejecting product", description: error.message, variant: "destructive" });
    },
  });
}

export function useLinkProductToCollection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, collectionId }: CollectionLinkData) => {
      const { data, error } = await supabase
        .from("marketplace_collection_products")
        .insert({
          product_id: productId,
          collection_id: collectionId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-marketplace-collections"] });
      toast({ title: "Product linked to collection" });
    },
    onError: (error: Error) => {
      toast({ title: "Error linking product to collection", description: error.message, variant: "destructive" });
    },
  });
}

export function useCreateCollectionAndLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ collection, productId }: CreateCollectionAndLinkData) => {
      // First create the collection
      const { data: newCollection, error: collectionError } = await supabase
        .from("marketplace_collections")
        .insert({
          name: collection.name,
          description: collection.description || null,
          designer_id: collection.designer_id || null,
          slug: collection.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          is_active: true,
          is_featured: false,
        })
        .select()
        .single();

      if (collectionError) throw collectionError;

      // Then link the product to the new collection
      const { error: linkError } = await supabase
        .from("marketplace_collection_products")
        .insert({
          product_id: productId,
          collection_id: newCollection.id,
        });

      if (linkError) throw linkError;

      return newCollection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-marketplace-collections"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Collection created and product linked" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating collection", description: error.message, variant: "destructive" });
    },
  });
}

export function useDesignerCollections(designerId: string | null | undefined) {
  return useQuery({
    queryKey: ["designer-collections", designerId],
    queryFn: async () => {
      if (!designerId) return [];
      
      const { data, error } = await supabase
        .from("marketplace_collections")
        .select("*")
        .eq("designer_id", designerId)
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data || [];
    },
    enabled: !!designerId,
  });
}
