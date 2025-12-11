import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { PendingQueueCard } from "@/components/admin/PendingQueueCard";
import { TopDesignersCard } from "@/components/admin/TopDesignersCard";
import { RecentActivityCard } from "@/components/admin/RecentActivityCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Mock data
const pendingPublications = [
  {
    id: "1",
    title: "Minimalist Ring Collection",
    designer: {
      name: "Aria Kim",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      rank: "Senior",
    },
    category: "Jewelry",
    submittedAt: "2 hours ago",
    status: "pending_review" as const,
  },
  {
    id: "2",
    title: "Urban Street Style Series",
    designer: {
      name: "Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      rank: "Designer",
    },
    category: "Fashion",
    submittedAt: "5 hours ago",
    status: "pending_review" as const,
  },
  {
    id: "3",
    title: "Heritage Weave Patterns",
    designer: {
      name: "Sophie Laurent",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      rank: "Lead",
    },
    category: "Textile",
    submittedAt: "1 day ago",
    status: "revision_requested" as const,
  },
];

const topDesigners = [
  {
    id: "1",
    name: "Aria Kim",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    rank: "F1",
    revenue: 12450,
    completedStyleboxes: 47,
    publishedItems: 23,
  },
  {
    id: "2",
    name: "Marcus Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    rank: "Elite",
    revenue: 9820,
    completedStyleboxes: 38,
    publishedItems: 18,
  },
  {
    id: "3",
    name: "Sophie Laurent",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    rank: "Lead",
    revenue: 7340,
    completedStyleboxes: 32,
    publishedItems: 15,
  },
  {
    id: "4",
    name: "James Park",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    rank: "Senior",
    revenue: 5120,
    completedStyleboxes: 28,
    publishedItems: 12,
  },
  {
    id: "5",
    name: "Elena Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    rank: "Designer",
    revenue: 3890,
    completedStyleboxes: 24,
    publishedItems: 9,
  },
];

const recentActivities = [
  {
    id: "1",
    type: "registration" as const,
    title: "New Designer Registration",
    description: "Emma Watson joined the platform",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "2",
    type: "stylebox_completion" as const,
    title: "StyleBox Completed",
    description: "Aria Kim completed 'Sustainable Resort Collection'",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "3",
    type: "publish_request" as const,
    title: "Publication Request",
    description: "Marcus Chen submitted 'Urban Street Style Series'",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    actionUrl: "/admin/publications",
  },
  {
    id: "4",
    type: "revision_needed" as const,
    title: "Revision Requested",
    description: "Heritage Weave Patterns needs material specs",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

const AdminDashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const secondaryStats = [
    { icon: Crown, value: "48", label: "F1/F2 Founders", color: "bg-admin-foreground text-admin-background" },
    { icon: Store, value: "312", label: "Live Products", color: "bg-success/10 text-success" },
    { icon: Box, value: "12,847", label: "StyleBox Completions", color: "bg-admin-muted text-admin-foreground" },
    { icon: TrendingUp, value: "94%", label: "Approval Rate", color: "bg-admin-muted text-admin-foreground/70" },
  ];

  const quickActions = [
    { icon: Users, label: "View All Designers", color: "hover:bg-admin-foreground hover:text-admin-background" },
    { icon: Box, label: "Create StyleBox", color: "hover:bg-admin-foreground hover:text-admin-background" },
    { icon: FolderOpen, label: "Review Queue", color: "hover:bg-warning/10 hover:text-warning" },
    { icon: DollarSign, label: "Process Payouts", color: "hover:bg-success/10 hover:text-success" },
  ];

  return (
    <AdminLayout userRole="superadmin">
      <motion.div 
        className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header 
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-admin-muted/50 p-6 sm:p-8"
          role="banner"
        >
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-display-xl text-admin-foreground">Dashboard</h1>
                <Badge variant="outline" className="h-6 px-2.5 text-xs font-medium bg-success/10 text-success border-success/20">
                  Live
                </Badge>
              </div>
              <p className="text-caption text-base text-admin-muted-foreground">
                Overview of Adorzia Studio operations
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 h-10 px-4 btn-press border-admin-border text-admin-foreground hover:bg-admin-muted">
                <Clock className="h-4 w-4" />
                Last 7 Days
              </Button>
              <Button className="gap-2 h-10 px-4 bg-admin-foreground text-admin-background hover:bg-admin-foreground/90 btn-press shadow-md">
                <FileCheck className="h-4 w-4" />
                Review Queue
                <Badge className="ml-1 bg-admin-background/20 text-admin-background h-5 px-1.5">23</Badge>
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Primary Stats Grid */}
        <motion.section 
          variants={itemVariants}
          className="space-y-4"
          aria-labelledby="metrics-heading"
          role="region"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-admin-muted-foreground" />
            <h2 id="metrics-heading" className="text-label text-admin-muted-foreground">Key Metrics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            <AdminStatCard
              title="Total Designers"
              value="1,247"
              subtitle="Active accounts"
              icon={Users}
              trend={{ value: 12, isPositive: true }}
              variant="wine"
            />
            <AdminStatCard
              title="Active StyleBoxes"
              value="3,892"
              subtitle="In progress"
              icon={Box}
              trend={{ value: 8, isPositive: true }}
              variant="camel"
            />
            <AdminStatCard
              title="Pending Publications"
              value="23"
              subtitle="Awaiting review"
              icon={FolderOpen}
              variant="warning"
            />
            <AdminStatCard
              title="Revenue This Month"
              value="$89,420"
              subtitle="Across all designers"
              icon={DollarSign}
              trend={{ value: 18, isPositive: true }}
              variant="success"
            />
          </div>
        </motion.section>

        {/* Secondary Stats */}
        <motion.section 
          variants={itemVariants}
          className="grid grid-cols-2 xl:grid-cols-4 gap-4"
          role="region"
          aria-label="Secondary statistics"
        >
          {secondaryStats.map((stat, index) => (
            <Card 
              key={stat.label} 
              hover
              className="group card-interactive bg-admin-card border-admin-border"
              tabIndex={0}
              role="article"
              aria-label={`${stat.label}: ${stat.value}`}
            >
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

        {/* Main Content Grid */}
        <motion.section 
          variants={itemVariants}
          className="space-y-4"
          aria-labelledby="action-heading"
          role="region"
        >
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-admin-muted-foreground" />
            <h2 id="action-heading" className="text-label text-admin-muted-foreground">Action Center</h2>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
            {/* Pending Queue - Takes 2 columns */}
            <div className="xl:col-span-2">
              <PendingQueueCard 
                items={pendingPublications}
                title="Pending Publications"
                viewAllLink="/admin/publications"
              />
            </div>

            {/* Top Designers */}
            <TopDesignersCard designers={topDesigners} />
          </div>
        </motion.section>

        {/* Bottom Section */}
        <motion.section 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6"
          role="region"
          aria-label="Activity and quick actions"
        >
          <RecentActivityCard activities={recentActivities} />
          
          {/* Quick Actions */}
          <Card className="overflow-hidden bg-admin-card border-admin-border">
            <CardHeader className="pb-4 border-b border-admin-border">
              <CardTitle className="text-lg font-semibold text-admin-foreground">Quick Actions</CardTitle>
              <p className="text-caption text-admin-muted-foreground">Common administrative tasks</p>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Button 
                    key={action.label}
                    variant="ghost" 
                    className={`h-auto py-5 flex-col gap-3 rounded-xl border border-admin-border bg-admin-muted/30 text-admin-foreground transition-all btn-press ${action.color}`}
                  >
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

export default AdminDashboard;