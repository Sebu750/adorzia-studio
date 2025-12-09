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
  ArrowUpRight,
  Crown,
  FileCheck,
  Clock
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
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Overview of Adorzia Studio operations
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Last 7 Days
            </Button>
            <Button variant="accent" className="gap-2">
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
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-admin-wine/10 flex items-center justify-center">
                <Crown className="h-5 w-5 text-admin-wine" />
              </div>
              <div>
                <p className="text-2xl font-display font-semibold">48</p>
                <p className="text-xs text-muted-foreground">F1/F2 Founders</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Store className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-display font-semibold">312</p>
                <p className="text-xs text-muted-foreground">Live Products</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Box className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-display font-semibold">12,847</p>
                <p className="text-xs text-muted-foreground">StyleBox Completions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-admin-camel/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-admin-camel" />
              </div>
              <div>
                <p className="text-2xl font-display font-semibold">94%</p>
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
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Users className="h-5 w-5 text-admin-wine" />
                <span className="text-sm">View All Designers</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Box className="h-5 w-5 text-admin-camel" />
                <span className="text-sm">Create StyleBox</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FolderOpen className="h-5 w-5 text-warning" />
                <span className="text-sm">Review Queue</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <DollarSign className="h-5 w-5 text-success" />
                <span className="text-sm">Process Payouts</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
