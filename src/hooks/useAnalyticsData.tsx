import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { startOfMonth, format, subMonths } from "date-fns";

export interface AnalyticsStats {
  totalEarnings: number;
  monthlyEarnings: number;
  productsSold: number;
  productViews: number;
}

export interface RevenueDataPoint {
  month: string;
  earnings: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export interface Transaction {
  id: string;
  product: string;
  amount: number;
  date: string;
  status: string;
}

export interface AnalyticsDataResult {
  stats: AnalyticsStats;
  revenueData: RevenueDataPoint[];
  topProducts: TopProduct[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

export function useAnalyticsData(): AnalyticsDataResult {
  const { user } = useAuth();
  const [stats, setStats] = useState<AnalyticsStats>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    productsSold: 0,
    productViews: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

<<<<<<< HEAD
        // Fetch consolidated stats using RPC
        const { data: statsData, error: statsError } = await supabase.rpc('get_designer_stats', {
          designer_uuid: user.id
        });

        if (statsError) throw statsError;

        // statsData is returned as JSONB from RPC
        const rpcStats = statsData as any;

        setStats({
          totalEarnings: Number(rpcStats.total_earnings) || 0,
          monthlyEarnings: Number(rpcStats.monthly_earnings) || 0,
          productsSold: Number(rpcStats.products_sold) || 0,
          productViews: Number(rpcStats.product_views) || 0,
        });

        // Fetch earnings for chart data
=======
        const monthStart = startOfMonth(new Date()).toISOString();

        // Fetch earnings
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        const { data: earningsData, error: earningsError } = await supabase
          .from("earnings")
          .select("amount, created_at")
          .eq("designer_id", user.id);

        if (earningsError) throw earningsError;

<<<<<<< HEAD
        // Fetch products for transactions and top products
=======
        const totalEarnings = earningsData?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
        const monthlyEarnings = earningsData
          ?.filter(e => e.created_at >= monthStart)
          .reduce((sum, e) => sum + Number(e.amount), 0) || 0;

        // Fetch products and sales
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        const { data: productsData, error: productsError } = await supabase
          .from("marketplace_products")
          .select("id, title")
          .eq("designer_id", user.id);

        if (productsError) throw productsError;

        const productIds = productsData?.map(p => p.id) || [];

<<<<<<< HEAD
=======
        let productsSold = 0;
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        let salesData: any[] = [];
        if (productIds.length > 0) {
          const { data: sales, error: salesError } = await supabase
            .from("product_sales")
            .select("product_id, quantity_sold, total_revenue, designer_share, sale_date")
            .in("product_id", productIds)
            .order("sale_date", { ascending: false });

          if (!salesError && sales) {
            salesData = sales;
<<<<<<< HEAD
          }
        }

=======
            productsSold = sales.reduce((sum, s) => sum + s.quantity_sold, 0);
          }
        }

        // Fetch portfolio views
        const { data: portfolios } = await supabase
          .from("portfolios")
          .select("id")
          .eq("designer_id", user.id);

        let productViews = 0;
        if (portfolios && portfolios.length > 0) {
          const portfolioIds = portfolios.map(p => p.id);
          const { data: analytics } = await supabase
            .from("portfolio_analytics")
            .select("id")
            .in("portfolio_id", portfolioIds)
            .eq("event_type", "view");
          
          productViews = analytics?.length || 0;
        }

        setStats({
          totalEarnings,
          monthlyEarnings,
          productsSold,
          productViews,
        });

>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        // Build revenue data for last 6 months
        const revenueByMonth: Record<string, number> = {};
        for (let i = 5; i >= 0; i--) {
          const monthDate = subMonths(new Date(), i);
          const monthKey = format(monthDate, "MMM");
          revenueByMonth[monthKey] = 0;
        }

        earningsData?.forEach(e => {
          const monthKey = format(new Date(e.created_at), "MMM");
          if (revenueByMonth[monthKey] !== undefined) {
            revenueByMonth[monthKey] += Number(e.amount);
          }
        });

        setRevenueData(
          Object.entries(revenueByMonth).map(([month, earnings]) => ({ month, earnings }))
        );

        // Build top products
        const productSalesMap: Record<string, { sales: number; revenue: number }> = {};
        salesData.forEach(sale => {
          const productId = sale.product_id;
          if (!productSalesMap[productId]) {
            productSalesMap[productId] = { sales: 0, revenue: 0 };
          }
          productSalesMap[productId].sales += sale.quantity_sold;
          productSalesMap[productId].revenue += Number(sale.designer_share);
        });

        const topProductsList: TopProduct[] = productsData
          ?.map(p => ({
            name: p.title,
            sales: productSalesMap[p.id]?.sales || 0,
            revenue: productSalesMap[p.id]?.revenue || 0,
          }))
          .filter(p => p.sales > 0)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 4) || [];

        setTopProducts(topProductsList);

        // Build transactions
        const transactionsList: Transaction[] = salesData.slice(0, 5).map((sale, index) => {
          const product = productsData?.find(p => p.id === sale.product_id);
          return {
            id: `TXN${String(index + 1).padStart(3, "0")}`,
            product: product?.title || "Unknown Product",
            amount: Number(sale.designer_share),
            date: format(new Date(sale.sale_date), "MMM d, yyyy"),
            status: "completed",
          };
        });

        setTransactions(transactionsList);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { stats, revenueData, topProducts, transactions, loading, error };
}
