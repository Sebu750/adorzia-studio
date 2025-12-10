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
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";

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
  return (
    <AdminLayout userRole="superadmin">
      <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight">
                Dashboard
              </h1>
              <Badge variant="outline" className="h-6 px-2.5 text-xs font-medium bg-success/10 text-success border-success/20">
                Live
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Overview of Adorzia Studio operations • Last updated just now
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 h-10 px-4 hover:bg-secondary">
              <Clock className="h-4 w-4" />
              Last 7 Days
            </Button>
            <Button className="gap-2 h-10 px-4 bg-foreground text-background hover:bg-foreground/90">
              <FileCheck className="h-4 w-4" />
              Review Queue
              <Badge className="ml-1 bg-background/20 text-background h-5 px-1.5">23</Badge>
            </Button>
          </div>
        </div>

        {/* Primary Stats Grid */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Key Metrics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </section>

        {/* Secondary Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Crown, value: "48", label: "F1/F2 Founders", color: "bg-foreground text-background" },
            { icon: Store, value: "312", label: "Live Products", color: "bg-success/10 text-success" },
            { icon: Box, value: "12,847", label: "StyleBox Completions", color: "bg-foreground/5 text-foreground" },
            { icon: TrendingUp, value: "94%", label: "Approval Rate", color: "bg-foreground/5 text-foreground/70" },
          ].map((stat, index) => (
            <Card 
              key={stat.label} 
              className="group hover:shadow-md transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Main Content Grid */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Action Center</h2>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivityCard activities={recentActivities} />
          
          {/* Quick Actions */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-4 border-b bg-secondary/30">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              <p className="text-sm text-muted-foreground">Common administrative tasks</p>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Users, label: "View All Designers", color: "bg-foreground/5 hover:bg-foreground/10 text-foreground" },
                  { icon: Box, label: "Create StyleBox", color: "bg-foreground/5 hover:bg-foreground/10 text-foreground/80" },
                  { icon: FolderOpen, label: "Review Queue", color: "bg-warning/5 hover:bg-warning/10 text-warning" },
                  { icon: DollarSign, label: "Process Payouts", color: "bg-success/5 hover:bg-success/10 text-success" },
                ].map((action) => (
                  <Button 
                    key={action.label}
                    variant="ghost" 
                    className={`h-auto py-5 flex-col gap-3 rounded-xl border border-transparent hover:border-border transition-all ${action.color}`}
                  >
                    <action.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
