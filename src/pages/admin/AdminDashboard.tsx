import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { PendingQueueCard } from "@/components/admin/PendingQueueCard";
import { TopDesignersCard } from "@/components/admin/TopDesignersCard";
import { RecentActivityCard } from "@/components/admin/RecentActivityCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Box, 
  FolderOpen, 
  Store,
  DollarSign,
  TrendingUp,
  Crown,
  FileCheck,
  Calendar,
  ArrowRight,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

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

const quickActions = [
  { label: "View Designers", icon: Users, href: "/admin/designers", color: "text-foreground" },
  { label: "Create StyleBox", icon: Box, href: "/admin/styleboxes", color: "text-muted-foreground" },
  { label: "Review Queue", icon: FolderOpen, href: "/admin/publications", color: "text-warning" },
  { label: "Process Payouts", icon: DollarSign, href: "/admin/payouts", color: "text-success" },
];

const AdminDashboard = () => {
  return (
    <AdminLayout userRole="superadmin">
      <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Welcome back, Admin
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 h-10">
              <Calendar className="h-4 w-4" />
              Last 7 Days
            </Button>
            <Button className="gap-2 h-10 bg-foreground text-background hover:bg-foreground/90">
              <FileCheck className="h-4 w-4" />
              Review Queue
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
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

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="group hover:shadow-md transition-all duration-300">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                <Crown className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">48</p>
                <p className="text-xs text-muted-foreground">F1/F2 Founders</p>
              </div>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-md transition-all duration-300">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/15 transition-colors">
                <Store className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">312</p>
                <p className="text-xs text-muted-foreground">Live Products</p>
              </div>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-md transition-all duration-300">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                <Box className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">12,847</p>
                <p className="text-xs text-muted-foreground">StyleBox Completions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-md transition-all duration-300">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">94%</p>
                <p className="text-xs text-muted-foreground">Approval Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Queue - Takes 2 columns */}
          <div className="lg:col-span-2">
            <PendingQueueCard 
              items={pendingPublications}
              title="Pending Publications"
              viewAllLink="/admin/publications"
            />
          </div>

          {/* Top Designers */}
          <TopDesignersCard designers={topDesigners} />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivityCard activities={recentActivities} />
          
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                  <p className="text-sm text-muted-foreground">Common tasks</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.label} to={action.href}>
                    <Button 
                      variant="outline" 
                      className="w-full h-auto py-6 flex-col gap-3 hover:bg-muted/50 hover:border-border transition-all group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                        <action.icon className={`h-5 w-5 ${action.color}`} />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;