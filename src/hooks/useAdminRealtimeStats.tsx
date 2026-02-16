import { useState, useEffect } from "react";
<<<<<<< HEAD
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
=======
import { supabase } from "@/integrations/supabase/client";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { useQuery } from "@tanstack/react-query";

interface RealtimeStats {
  totalDesigners: number;
  newSignupsToday: number;
  newSignupsWeek: number;
  newSignupsMonth: number;
  pendingSubmissions: number;
  pendingPublications: number;
  totalRevenue: number;
  revenueThisMonth: number;
}

interface ActivityItem {
  id: string;
  type: "signup" | "submission" | "publication" | "earning";
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export function useAdminRealtimeStats() {
  const [realtimeActivity, setRealtimeActivity] = useState<ActivityItem[]>([]);

  // Fetch initial stats
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["admin-realtime-stats"],
    queryFn: async (): Promise<RealtimeStats> => {
<<<<<<< HEAD
      const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (error) throw error;
      
      const stats = data as any;

      return {
        totalDesigners: stats.total_designers || 0,
        newSignupsToday: stats.new_signups_today || 0,
        newSignupsWeek: stats.new_signups_week || 0,
        newSignupsMonth: stats.new_signups_month || 0,
        pendingSubmissions: stats.pending_submissions || 0,
        pendingPublications: stats.pending_publications || 0,
        totalRevenue: stats.total_revenue || 0,
        revenueThisMonth: stats.revenue_this_month || 0,
=======
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfWeek = new Date(now.setDate(now.getDate() - 7)).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Total designers
      const { count: totalDesigners } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // New signups today
      const { count: newSignupsToday } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfDay);

      // New signups this week
      const { count: newSignupsWeek } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfWeek);

      // New signups this month
      const { count: newSignupsMonth } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth);

      // Pending submissions
      const { count: pendingSubmissions } = await supabase
        .from("stylebox_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "submitted");

      // Pending publications
      const { count: pendingPublications } = await supabase
        .from("portfolio_publications")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Total revenue
      const { data: allEarnings } = await supabase
        .from("earnings")
        .select("amount");
      const totalRevenue = allEarnings?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      // Revenue this month
      const { data: monthEarnings } = await supabase
        .from("earnings")
        .select("amount")
        .gte("created_at", startOfMonth);
      const revenueThisMonth = monthEarnings?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      return {
        totalDesigners: totalDesigners || 0,
        newSignupsToday: newSignupsToday || 0,
        newSignupsWeek: newSignupsWeek || 0,
        newSignupsMonth: newSignupsMonth || 0,
        pendingSubmissions: pendingSubmissions || 0,
        pendingPublications: pendingPublications || 0,
        totalRevenue,
        revenueThisMonth,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch recent activity
  const { data: recentActivity } = useQuery({
    queryKey: ["admin-recent-activity"],
    queryFn: async (): Promise<ActivityItem[]> => {
      const activities: ActivityItem[] = [];

      // Recent signups
      const { data: recentSignups } = await supabase
        .from("profiles")
        .select("id, name, email, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      recentSignups?.forEach((signup) => {
        activities.push({
          id: `signup-${signup.id}`,
          type: "signup",
          message: `${signup.name || signup.email || "New user"} joined the platform`,
          timestamp: signup.created_at,
        });
      });

      // Recent submissions
      const { data: recentSubmissions } = await supabase
        .from("stylebox_submissions")
        .select("id, designer_id, stylebox_id, submitted_at, status")
        .order("submitted_at", { ascending: false })
        .limit(5);

      recentSubmissions?.forEach((sub) => {
        activities.push({
          id: `submission-${sub.id}`,
          type: "submission",
          message: `New stylebox submission (${sub.status})`,
          timestamp: sub.submitted_at,
        });
      });

      // Recent publications
      const { data: recentPublications } = await supabase
        .from("portfolio_publications")
        .select("id, status, submitted_at")
        .order("submitted_at", { ascending: false })
        .limit(5);

      recentPublications?.forEach((pub) => {
        activities.push({
          id: `publication-${pub.id}`,
          type: "publication",
          message: `Publication request (${pub.status})`,
          timestamp: pub.submitted_at,
        });
      });

      // Sort by timestamp
      return activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, 10);
    },
    refetchInterval: 30000,
  });

  // Set up realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("admin-realtime-dashboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload) => {
          console.log("New profile:", payload);
          const newActivity: ActivityItem = {
            id: `signup-${payload.new.id}-${Date.now()}`,
            type: "signup",
            message: `${payload.new.name || payload.new.email || "New user"} joined the platform`,
            timestamp: payload.new.created_at,
          };
          setRealtimeActivity((prev) => [newActivity, ...prev].slice(0, 20));
          refetchStats();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "stylebox_submissions" },
        (payload) => {
          console.log("New submission:", payload);
          const newActivity: ActivityItem = {
            id: `submission-${payload.new.id}-${Date.now()}`,
            type: "submission",
            message: "New stylebox submission received",
            timestamp: payload.new.submitted_at,
          };
          setRealtimeActivity((prev) => [newActivity, ...prev].slice(0, 20));
          refetchStats();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "portfolio_publications" },
        (payload) => {
          console.log("Publication change:", payload);
          if (payload.eventType === "INSERT") {
            const newActivity: ActivityItem = {
              id: `publication-${payload.new.id}-${Date.now()}`,
              type: "publication",
              message: "New publication request submitted",
              timestamp: payload.new.submitted_at,
            };
            setRealtimeActivity((prev) => [newActivity, ...prev].slice(0, 20));
          }
          refetchStats();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "earnings" },
        (payload) => {
          console.log("New earning:", payload);
          const newActivity: ActivityItem = {
            id: `earning-${payload.new.id}-${Date.now()}`,
            type: "earning",
            message: `New earning: $${Number(payload.new.amount).toFixed(2)}`,
            timestamp: payload.new.created_at,
          };
          setRealtimeActivity((prev) => [newActivity, ...prev].slice(0, 20));
          refetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchStats]);

  // Combine initial activity with realtime updates
  const allActivity = [...realtimeActivity, ...(recentActivity || [])]
    .filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 15);

  return {
    stats: stats || {
      totalDesigners: 0,
      newSignupsToday: 0,
      newSignupsWeek: 0,
      newSignupsMonth: 0,
      pendingSubmissions: 0,
      pendingPublications: 0,
      totalRevenue: 0,
      revenueThisMonth: 0,
    },
    activity: allActivity,
    refetchStats,
  };
}
