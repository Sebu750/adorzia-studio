import { useState, useEffect } from "react";
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
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDesigners: 0,
    activeStyleboxes: 0,
    pendingPublications: 0,
    monthlyRevenue: 0,
    founderCount: 0,
    liveProducts: 0,
    styleboxCompletions: 0,
    approvalRate: 94,
  });
  const [pendingPublications, setPendingPublications] = useState<any[]>([]);
  const [topDesigners, setTopDesigners] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch designer count
        const { count: designerCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Fetch active styleboxes
        const { count: styleboxCount } = await supabase
          .from("styleboxes")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");

        // Fetch pending publications
        const { count: pendingCount, data: pendingData } = await supabase
          .from("portfolio_publications")
          .select("*, portfolios(designer_id, title, category)")
          .eq("status", "pending")
          .limit(5);

        // Fetch monthly revenue
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const { data: earningsData } = await supabase
          .from("earnings")
          .select("amount")
          .gte("created_at", startOfMonth.toISOString());

        const monthlyRevenue = earningsData?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

        // Fetch live products
        const { count: productsCount } = await supabase
          .from("marketplace_products")
          .select("*", { count: "exact", head: true })
          .eq("status", "live");

        // Fetch completions
        const { count: completionsCount } = await supabase
          .from("stylebox_submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved");

        // Fetch top designers by XP
        const { data: designers } = await supabase
          .from("profiles")
          .select("*")
          .order("xp", { ascending: false })
          .limit(5);

        setStats({
          totalDesigners: designerCount || 0,
          activeStyleboxes: styleboxCount || 0,
          pendingPublications: pendingCount || 0,
          monthlyRevenue,
          founderCount: 48,
          liveProducts: productsCount || 0,
          styleboxCompletions: completionsCount || 0,
          approvalRate: 94,
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

        // Format top designers
        if (designers) {
          setTopDesigners(designers.map((d) => ({
            id: d.id,
            name: d.name || "Designer",
            avatar: d.avatar_url || "",
            rank: "Designer",
            revenue: 0,
            completedStyleboxes: 0,
            publishedItems: 0,
          })));
        }

        // Fetch recent admin logs
        const { data: logs } = await supabase
          .from("admin_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(4);

        if (logs) {
          setRecentActivities(logs.map((log) => ({
            id: log.id,
            type: "registration" as const,
            title: log.action,
            description: log.target_type || "",
            timestamp: new Date(log.created_at),
          })));
        }

      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <AdminLayout userRole="superadmin">
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
    <AdminLayout userRole="superadmin">
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
                <h1 className="text-display-xl text-admin-foreground">Dashboard</h1>
                <Badge variant="outline" className="h-6 px-2.5 text-xs font-medium bg-success/10 text-success border-success/20">Live</Badge>
              </div>
              <p className="text-caption text-base text-admin-muted-foreground">Overview of Adorzia Studio operations</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 h-10 px-4 btn-press border-admin-border text-admin-foreground hover:bg-admin-muted">
                <Clock className="h-4 w-4" />Last 7 Days
              </Button>
              <Button className="gap-2 h-10 px-4 bg-admin-foreground text-admin-background hover:bg-admin-foreground/90 btn-press shadow-md">
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
            <h2 className="text-label text-admin-muted-foreground">Key Metrics</h2>
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
                  <p className="stat-value text-2xl truncate text-admin-foreground">{stat.value}</p>
                  <p className="text-caption text-xs truncate text-admin-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.section>

        {/* Action Center */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-admin-muted-foreground" />
            <h2 className="text-label text-admin-muted-foreground">Action Center</h2>
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
          <Card className="overflow-hidden bg-admin-card border-admin-border">
            <CardHeader className="pb-4 border-b border-admin-border">
              <CardTitle className="text-lg font-semibold text-admin-foreground">Quick Actions</CardTitle>
              <p className="text-caption text-admin-muted-foreground">Common administrative tasks</p>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Button key={action.label} variant="ghost" className={`h-auto py-5 flex-col gap-3 rounded-xl border border-admin-border bg-admin-muted/30 text-admin-foreground transition-all btn-press ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{action.label}</span>
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
