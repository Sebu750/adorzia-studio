import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["marketplace_products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["marketplace_products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["marketplace_products"]["Update"];

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
      const [
        { count: totalProducts },
        { count: adorziaProducts },
        { count: vendorProducts },
        { count: liveProducts },
      ] = await Promise.all([
        supabase.from("marketplace_products").select("*", { count: "exact", head: true }),
        supabase.from("marketplace_products").select("*", { count: "exact", head: true }).eq("is_adorzia_product", true),
        supabase.from("marketplace_products").select("*", { count: "exact", head: true }).eq("is_adorzia_product", false),
        supabase.from("marketplace_products").select("*", { count: "exact", head: true }).eq("status", "live"),
      ]);

      // Get pending review count using filter workaround for new enum value
      const { count: pendingReview } = await supabase
        .from("marketplace_products")
        .select("*", { count: "exact", head: true })
        .filter("status", "eq", "pending_review");

      return {
        totalProducts: totalProducts || 0,
        adorziaProducts: adorziaProducts || 0,
        vendorProducts: vendorProducts || 0,
        pendingReview: pendingReview || 0,
        liveProducts: liveProducts || 0,
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
