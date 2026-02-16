import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminCollectionsContent from "@/components/admin/marketplace/AdminCollectionsContent";

const AdminCollections = () => {
  return (
    <AdminLayout>
      <AdminCollectionsContent />
    </AdminLayout>
  );
};

export default AdminCollections;
