import { useQuery } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";

export interface DesignerOption {
  id: string;
  name: string;
  brand_name?: string;
  email: string;
  avatar_url?: string;
}

export function useAdminDesigners() {
  return useQuery({
    queryKey: ["admin-designers"],
    queryFn: async () => {
      // Fetch all profiles - the role filter might not work if role column doesn't exist
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, name, brand_name, email, avatar_url")
        .not("name", "is", null)
        .order("name", { ascending: true });

      if (error) throw error;
      
      return (data || []).map((profile) => ({
        id: profile.user_id,
        name: profile.name || "Unknown Designer",
        brand_name: profile.brand_name || undefined,
        email: profile.email || "",
        avatar_url: profile.avatar_url || undefined,
      })) as DesignerOption[];
    },
  });
}