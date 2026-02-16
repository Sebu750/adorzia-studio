import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  activeStyleboxes: number;
  completedStyleboxes: number;
  portfolioItems: number;
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayouts: number;
  productsSold: number;
  loveCount: number;
}

export function useDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeStyleboxes: 0,
    completedStyleboxes: 0,
    portfolioItems: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    pendingPayouts: 0,
    productsSold: 0,
    loveCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch stylebox submissions
      const { data: submissions } = await supabase
        .from("stylebox_submissions")
        .select("status")
        .eq("designer_id", user.id);

      const activeStyleboxes = submissions?.filter(
        (s) => s.status !== "approved" && s.status !== "rejected"
      ).length || 0;
      
      const completedStyleboxes = submissions?.filter(
        (s) => s.status === "approved"
      ).length || 0;

      // Fetch portfolio projects count accurately across all portfolios for this designer
      const { count: portfolioCount } = await supabase
        .from("portfolio_projects")
        .select("id, portfolios!inner(designer_id)", { count: "exact", head: true })
        .eq("portfolios.designer_id", user.id);

      // Fetch earnings
      const { data: earnings } = await supabase
        .from("earnings")
        .select("amount, created_at")
        .eq("designer_id", user.id);

      const totalEarnings = earnings?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      // Calculate monthly earnings (current month)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyEarnings = earnings?.filter(
        (e) => new Date(e.created_at) >= startOfMonth
      ).reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      // Fetch pending payouts
      const { data: payouts } = await supabase
        .from("payouts")
        .select("amount")
        .eq("designer_id", user.id)
        .eq("status", "pending");

      const pendingPayouts = payouts?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      // Fetch products sold
      const { data: products } = await supabase
        .from("marketplace_products")
        .select("id")
        .eq("designer_id", user.id)
        .eq("status", "live");

      const productIds = products?.map((p) => p.id) || [];
      
      let productsSold = 0;
      if (productIds.length > 0) {
        const { data: sales } = await supabase
          .from("product_sales")
          .select("quantity_sold")
          .in("product_id", productIds);
        
        productsSold = sales?.reduce((sum, s) => sum + s.quantity_sold, 0) || 0;
      }

      // Fetch love count (followers count for this designer)
      const { count: loveCount } = await supabase
        .from("designer_follows")
        .select("id", { count: "exact", head: true })
        .eq("designer_id", user.id);

      setStats({
        activeStyleboxes,
        completedStyleboxes,
        portfolioItems: portfolioCount || 0,
        totalEarnings,
        monthlyEarnings,
        pendingPayouts,
        productsSold,
        loveCount: loveCount || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to changes in portfolio_projects to make count realtime
    const channel = supabase
      .channel('dashboard-stats-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portfolio_projects' },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { stats, loading };
}
