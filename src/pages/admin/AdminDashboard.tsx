import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { PendingQueueCard } from "@/components/admin/PendingQueueCard";
import { TopDesignersCard } from "@/components/admin/TopDesignersCard";
import { RecentActivityCard } from "@/components/admin/RecentActivityCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Box, 
  FolderOpen, 
  Store,
  DollarSign,
  TrendingUp,
  Crown,
  FileCheck,
  Clock,
  Sparkles,
  Zap,
  BarChart3,
  Bell,
  Download,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user, isSuperadmin } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDesigners: 0,
    activeStyleboxes: 0,
    pendingPublications: 0,
    monthlyRevenue: 0,
    founderCount: 0,
    liveProducts: 0,
    styleboxCompletions: 0,
    approvalRate: 0,
    pendingSubmissions: 0,
    avgCompletionTime: 0,
    topPerformingStylebox: "",
    submissionTrend: [] as { date: string; count: number }[],
  });
  const [pendingPublications, setPendingPublications] = useState<any[]>([]);
  const [topDesigners, setTopDesigners] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      // Fetch designer count
      const { count: designerCount } = await supabaseAdmin
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch active styleboxes
      const { count: styleboxCount } = await supabaseAdmin
        .from("styleboxes")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      // Fetch pending publications
      const { count: pendingCount, data: pendingData } = await supabaseAdmin
        .from("portfolio_publications")
        .select("*, portfolios(designer_id, title, category)")
        .eq("status", "pending")
        .limit(5);

      // Fetch pending Stylebox submissions
      const { count: pendingSubmissions } = await supabaseAdmin
        .from("stylebox_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "submitted");

      // Fetch Stylebox completion trend (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: submissionTrend } = await supabaseAdmin
        .from("stylebox_submissions")
        .select("submitted_at")
        .gte("submitted_at", thirtyDaysAgo.toISOString())
        .order("submitted_at");

      // Fetch monthly revenue
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data: earningsData } = await supabaseAdmin
        .from("earnings")
        .select("amount")
        .gte("created_at", startOfMonth.toISOString());

      const monthlyRevenue = earningsData?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      // Fetch live products
      const { count: productsCount } = await supabaseAdmin
        .from("marketplace_products")
        .select("*", { count: "exact", head: true })
        .eq("status", "live");

      // Fetch founder count from foundation_purchases
      const { count: founderCount } = await supabaseAdmin
        .from("foundation_purchases")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed");

      // Fetch approved and total submissions for approval rate
      const { count: approvedCount } = await supabaseAdmin
        .from("stylebox_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      const { count: totalSubmissions } = await supabaseAdmin
        .from("stylebox_submissions")
        .select("*", { count: "exact", head: true });

      const approvalRate = totalSubmissions && totalSubmissions > 0 
        ? Math.round(((approvedCount || 0) / totalSubmissions) * 100) 
        : 0;

      // Calculate average completion time
      const { data: completedSubmissions } = await supabaseAdmin
        .from("stylebox_submissions")
        .select("submitted_at, stylebox_id")
        .eq("status", "approved")
        .limit(50);

      let avgCompletionTime = 0;
      if (completedSubmissions && completedSubmissions.length > 0) {
        const completionTimes = await Promise.all(
          completedSubmissions.map(async (sub) => {
            const { data: stylebox } = await supabaseAdmin
              .from("styleboxes")
              .select("created_at")
              .eq("id", sub.stylebox_id)
              .single();
            
            if (stylebox) {
              const created = new Date(stylebox.created_at);
              const submitted = new Date(sub.submitted_at);
              return (submitted.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); // days
            }
            return 0;
          })
        );
        
        const validTimes = completionTimes.filter(time => time > 0);
        avgCompletionTime = validTimes.length > 0 
          ? Math.round(validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length)
          : 0;
      }

      // Fetch top designers with real earnings data
      const { data: designers } = await supabaseAdmin
        .from("profiles")
        .select("id, name, avatar_url, xp, rank_id")
        .order("xp", { ascending: false })
        .limit(5);

      // Fetch earnings for each designer
      const designersWithEarnings = await Promise.all(
        (designers || []).map(async (d) => {
          const { data: earnings } = await supabaseAdmin
            .from("earnings")
            .select("amount")
            .eq("designer_id", d.id)
            .gte("created_at", startOfMonth.toISOString());
          
          const revenue = earnings?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

          const { count: completedCount } = await supabaseAdmin
            .from("stylebox_submissions")
            .select("*", { count: "exact", head: true })
            .eq("designer_id", d.id)
            .eq("status", "approved");

          const { count: publishedCount } = await supabaseAdmin
            .from("marketplace_products")
            .select("*", { count: "exact", head: true })
            .eq("designer_id", d.id)
            .eq("status", "live");

          return {
            id: d.id,
            name: d.name || "Designer",
            avatar: d.avatar_url || "",
            rank: "Designer",
            revenue,
            completedStyleboxes: completedCount || 0,
            publishedItems: publishedCount || 0,
          };
        })
      );

      setStats({
        totalDesigners: designerCount || 0,
        activeStyleboxes: styleboxCount || 0,
        pendingPublications: pendingCount || 0,
        monthlyRevenue,
        founderCount: founderCount || 0,
        liveProducts: productsCount || 0,
        styleboxCompletions: approvedCount || 0,
        approvalRate,
        pendingSubmissions: pendingSubmissions || 0,
        avgCompletionTime,
        topPerformingStylebox: "The Modular Kantha", // Placeholder - would fetch from DB
        submissionTrend: submissionTrend || [],
      });

      // Format pending publications
      if (pendingData) {
        setPendingPublications(pendingData.slice(0, 3).map((p) => ({
          id: p.id,
          title: p.portfolios?.title || "Untitled",
          designer: { name: "Designer", avatar: "", rank: "Designer" },
          category: p.portfolios?.category || "Fashion",
          submittedAt: getRelativeTime(new Date(p.submitted_at)),
          status: "pending_review" as const,
        })));
      }

      // Set top designers with real data
      setTopDesigners(designersWithEarnings);

      // Fetch recent activities - combining different activity types
      await fetchRecentActivities();

    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecentActivities = async () => {
    const activities: any[] = [];

    // Fetch new designers (recent signups)
    const { data: newDesigners } = await supabaseAdmin
      .from("profiles")
      .select("id, name, created_at")
      .order("created_at", { ascending: false })
      .limit(2);

    newDesigners?.forEach((d) => {
      activities.push({
        id: `reg-${d.id}`,
        type: "registration" as const,
        title: d.name || "New Designer",
        description: "Joined Adorzia Studio",
        timestamp: new Date(d.created_at),
      });
    });

    // Fetch recent stylebox completions
    const { data: completions } = await supabaseAdmin
      .from("stylebox_submissions")
      .select("id, submitted_at, stylebox_id, styleboxes(title)")
      .eq("status", "approved")
      .order("submitted_at", { ascending: false })
      .limit(2);

    completions?.forEach((c) => {
      activities.push({
        id: `sb-${c.id}`,
        type: "stylebox_completion" as const,
        title: (c.styleboxes as any)?.title || "StyleBox",
        description: "Submission approved",
        timestamp: new Date(c.submitted_at),
      });
    });

    // Fetch recent publication requests
    const { data: publications } = await supabaseAdmin
      .from("portfolio_publications")
      .select("id, submitted_at, portfolios(title)")
      .eq("status", "pending")
      .order("submitted_at", { ascending: false })
      .limit(2);

    publications?.forEach((p) => {
      activities.push({
        id: `pub-${p.id}`,
        type: "publish_request" as const,
        title: (p.portfolios as any)?.title || "Publication",
        description: "Awaiting review",
        timestamp: new Date(p.submitted_at),
      });
    });

    // Sort by timestamp and take top 4
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setRecentActivities(activities.slice(0, 4));
  };

  useEffect(() => {
    fetchData();

    // Set up realtime subscription for new designers
    const channel = supabaseAdmin
      .channel('admin-dashboard-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          const newDesigner = payload.new as { name?: string; email?: string };
          toast({
            title: "New Designer Joined!",
            description: newDesigner.name || newDesigner.email || "A new designer has registered",
          });
          // Refresh stats
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'stylebox_submissions'
        },
        (payload) => {
          const submission = payload.new as { id: string; stylebox_id: string };
          toast({
            title: "New Submission Received!",
            description: "A designer has submitted a new Stylebox entry for review",
            action: {
              label: "View",
              onClick: () => window.location.href = '/admin/stylebox-submissions'
            }
          });
          // Refresh stats
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabaseAdmin.removeChannel(channel);
    };
  }, [fetchData, toast]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const secondaryStats = [
    { icon: Crown, value: stats.founderCount.toString(), label: "F1/F2 Founders", color: "bg-admin-foreground text-admin-background" },
    { icon: Store, value: stats.liveProducts.toString(), label: "Live Products", color: "bg-success/10 text-success" },
    { icon: Box, value: stats.styleboxCompletions.toLocaleString(), label: "StyleBox Completions", color: "bg-admin-muted text-admin-foreground" },
    { icon: TrendingUp, value: `${stats.approvalRate}%`, label: "Approval Rate", color: "bg-admin-muted text-admin-foreground/70" },
  ];

  const quickActions = [
    { icon: Users, label: "View All Designers", color: "hover:bg-admin-foreground hover:text-admin-background" },
    { icon: Box, label: "Create StyleBox", color: "hover:bg-admin-foreground hover:text-admin-background" },
    { icon: FolderOpen, label: "Review Queue", color: "hover:bg-warning/10 hover:text-warning" },
    { icon: DollarSign, label: "Process Payouts", color: "hover:bg-success/10 hover:text-success" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div 
        className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-admin-muted/50 p-6 sm:p-8" role="banner">
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-admin-foreground">Dashboard</h1>
                {isSuperadmin ? (
                  <Badge className="h-6 px-2.5 text-xs font-bold bg-admin-foreground text-admin-card border-0 uppercase tracking-wider">Superadmin</Badge>
                ) : (
                  <Badge variant="outline" className="h-6 px-2.5 text-xs font-medium bg-success/10 text-success border-success/20">Live</Badge>
                )}
              </div>
              <p className="text-sm text-admin-muted-foreground">
                Welcome back, <span className="text-admin-foreground font-medium">{user?.user_metadata?.name || user?.email?.split('@')[0]}</span>. Overview of Adorzia Studio operations.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 h-10 px-4 transition-all hover:bg-admin-muted active:scale-[0.98] border-admin-border text-admin-foreground">
                <Clock className="h-4 w-4" />Last 7 Days
              </Button>
              <Button className="gap-2 h-10 px-4 bg-admin-foreground text-admin-background hover:bg-admin-foreground/90 transition-all active:scale-[0.98] shadow-md">
                <FileCheck className="h-4 w-4" />Review Queue
                <Badge className="ml-1 bg-admin-background/20 text-admin-background h-5 px-1.5">{stats.pendingPublications}</Badge>
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Primary Stats */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-admin-muted-foreground" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">Key Metrics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            <AdminStatCard title="Total Designers" value={stats.totalDesigners.toLocaleString()} subtitle="Active accounts" icon={Users} trend={{ value: 12, isPositive: true }} variant="wine" />
            <AdminStatCard title="Active StyleBoxes" value={stats.activeStyleboxes.toLocaleString()} subtitle="In progress" icon={Box} trend={{ value: 8, isPositive: true }} variant="camel" />
            <AdminStatCard title="Pending Publications" value={stats.pendingPublications.toString()} subtitle="Awaiting review" icon={FolderOpen} variant="warning" />
            <AdminStatCard title="Revenue This Month" value={`$${stats.monthlyRevenue.toLocaleString()}`} subtitle="Across all designers" icon={DollarSign} trend={{ value: 18, isPositive: true }} variant="success" />
          </div>
        </motion.section>

        {/* Secondary Stats */}
        <motion.section variants={itemVariants} className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {secondaryStats.map((stat) => (
            <Card key={stat.label} hover className="group card-interactive bg-admin-card border-admin-border">
              <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                <div className={`h-11 w-11 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-admin-foreground truncate">{stat.value}</p>
                  <p className="text-xs font-medium text-admin-muted-foreground uppercase tracking-wider truncate">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.section>

        {/* Stylebox Analytics Section */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-admin-muted-foreground" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">Stylebox Analytics</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Key Metrics */}
            <div className="space-y-4">
              <Card className="bg-admin-card border-admin-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-admin-muted-foreground">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-admin-muted-foreground">Pending Reviews</span>
                    <Badge variant="outline" className="bg-amber-500/20 text-amber-600 border-amber-500/30">
                      {stats.pendingSubmissions}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-admin-muted-foreground">Avg Completion Time</span>
                    <span className="font-medium">{stats.avgCompletionTime} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-admin-muted-foreground">Approval Rate</span>
                    <span className="font-medium">{stats.approvalRate}%</span>
                  </div>
                  <div className="pt-2 border-t border-admin-border">
                    <p className="text-xs text-admin-muted-foreground mb-1">Top Performing</p>
                    <p className="text-sm font-medium truncate">{stats.topPerformingStylebox || "Loading..."}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submission Trend Chart */}
            <div className="lg:col-span-2">
              <Card className="bg-admin-card border-admin-border h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-admin-muted-foreground">Submission Trend (30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.submissionTrend.length > 0 ? (
                    <div className="h-64 flex items-end justify-between gap-1">
                      {Array.from({ length: 30 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (29 - i));
                        const dateStr = date.toISOString().split('T')[0];
                        const count = stats.submissionTrend.filter(s => 
                          s.submitted_at?.split('T')[0] === dateStr
                        ).length;
                        
                        // Calculate bar height
                        const counts = stats.submissionTrend.map(s => {
                          const sDate = s.submitted_at?.split('T')[0];
                          return sDate ? stats.submissionTrend.filter(x => x.submitted_at?.split('T')[0] === sDate).length : 0;
                        });
                        const maxCount = Math.max(...counts.concat([1]));
                        
                        const barHeight = Math.max(4, (count / maxCount) * 100);
                        
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                              style={{ height: `${barHeight}%` }}
                            />
                            <span className="text-[8px] text-admin-muted-foreground mt-1">
                              {date.getDate()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-admin-muted-foreground">
                      <BarChart3 className="h-8 w-8 mr-2" />
                      <span>No submission data available</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.section>

        {/* Action Center */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-admin-muted-foreground" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">Action Center</h2>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
            <div className="xl:col-span-2">
              <PendingQueueCard items={pendingPublications} title="Pending Publications" viewAllLink="/admin/publications" />
            </div>
            <TopDesignersCard designers={topDesigners} />
          </div>
        </motion.section>

        {/* Bottom Section */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <RecentActivityCard activities={recentActivities} />
          <Card className="overflow-hidden bg-admin-card border-admin-border shadow-sm">
            <CardHeader className="pb-4 border-b border-admin-border bg-admin-muted/30">
              <CardTitle className="text-base font-bold uppercase tracking-wider text-admin-foreground">Quick Actions</CardTitle>
              <p className="text-xs text-admin-muted-foreground">Common administrative tasks</p>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Button key={action.label} variant="ghost" className={`h-auto py-6 flex-col gap-3 rounded-2xl border border-admin-border bg-admin-muted/30 text-admin-foreground transition-all active:scale-[0.98] ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                    <span className="text-xs font-bold uppercase tracking-widest">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>
    </AdminLayout>
  );
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
}

export default AdminDashboard;
