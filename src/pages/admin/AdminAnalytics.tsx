import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity, 
  Users, 
  FileText, 
  DollarSign,
  Clock,
  UserPlus,
  Package,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from "lucide-react";
import { useAdminRealtimeStats } from "@/hooks/useAdminRealtimeStats";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const AdminAnalytics = () => {
  const { stats, activity } = useAdminRealtimeStats();

  const activityTypeConfig = {
    signup: { icon: UserPlus, color: "text-success", bg: "bg-success/10" },
    submission: { icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    publication: { icon: Package, color: "text-purple-500", bg: "bg-purple-500/10" },
    earning: { icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
  };

  // Pie chart data for submissions vs publications
  const pieData = [
    { name: "Pending Submissions", value: stats.pendingSubmissions, color: "hsl(var(--primary))" },
    { name: "Pending Publications", value: stats.pendingPublications, color: "hsl(var(--accent))" },
  ];

  // Signup trend data (mock for visualization)
  const signupTrend = [
    { period: "Today", value: stats.newSignupsToday },
    { period: "This Week", value: stats.newSignupsWeek },
    { period: "This Month", value: stats.newSignupsMonth },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-admin-foreground">Analytics</h1>
            <p className="text-admin-muted-foreground">Real-time platform insights and metrics</p>
          </div>
          <Badge variant="outline" className="gap-2 bg-success/10 text-success border-success/20">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Live
          </Badge>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-admin-card border-admin-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div className="flex items-center text-success text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4" />
                  +{stats.newSignupsToday} today
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-admin-foreground">{stats.totalDesigners.toLocaleString()}</p>
                <p className="text-sm text-admin-muted-foreground">Total Designers</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-admin-card border-admin-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <Badge variant="secondary" className="text-xs">Pending</Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-admin-foreground">{stats.pendingSubmissions}</p>
                <p className="text-sm text-admin-muted-foreground">Stylebox Submissions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-admin-card border-admin-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-purple-500" />
                </div>
                <Badge variant="secondary" className="text-xs">Pending</Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-admin-foreground">{stats.pendingPublications}</p>
                <p className="text-sm text-admin-muted-foreground">Publication Requests</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-admin-card border-admin-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-amber-500" />
                </div>
                <div className="flex items-center text-emerald-500 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4" />
                  This month
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-admin-foreground">${stats.revenueThisMonth.toLocaleString()}</p>
                <p className="text-sm text-admin-muted-foreground">Revenue This Month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 bg-admin-card border-admin-border">
            <CardHeader>
              <CardTitle className="text-admin-foreground">Revenue Trend</CardTitle>
              <CardDescription className="text-admin-muted-foreground">
                Last 30 days earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>

          {/* Signup Stats */}
          <Card className="bg-admin-card border-admin-border">
            <CardHeader>
              <CardTitle className="text-admin-foreground">Designer Signups</CardTitle>
              <CardDescription className="text-admin-muted-foreground">
                New registrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-admin-muted/50">
                  <span className="text-sm text-admin-muted-foreground">Today</span>
                  <span className="font-bold text-admin-foreground">{stats.newSignupsToday}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-admin-muted/50">
                  <span className="text-sm text-admin-muted-foreground">This Week</span>
                  <span className="font-bold text-admin-foreground">{stats.newSignupsWeek}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-admin-muted/50">
                  <span className="text-sm text-admin-muted-foreground">This Month</span>
                  <span className="font-bold text-admin-foreground">{stats.newSignupsMonth}</span>
                </div>
              </div>

              {/* Pending Work Distribution */}
              <div className="pt-4 border-t border-admin-border">
                <p className="text-sm font-medium text-admin-foreground mb-3">Pending Work</p>
                <div className="flex items-center justify-center">
                  <div className="h-32 w-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-admin-muted-foreground">Submissions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span className="text-admin-muted-foreground">Publications</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card className="bg-admin-card border-admin-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-admin-foreground flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Activity Feed
              </CardTitle>
              <CardDescription className="text-admin-muted-foreground">
                Real-time platform events
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3" />
              {activity.length} events
            </Badge>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <div className="text-center py-8 text-admin-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm mt-1">Events will appear here in real-time</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activity.map((item) => {
                  const config = activityTypeConfig[item.type];
                  const IconComponent = config.icon;
                  return (
                    <div 
                      key={item.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-admin-muted/30 hover:bg-admin-muted/50 transition-colors"
                    >
                      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", config.bg)}>
                        <IconComponent className={cn("h-5 w-5", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-admin-foreground truncate">
                          {item.message}
                        </p>
                        <p className="text-xs text-admin-muted-foreground">
                          {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {item.type}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-admin-foreground">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-admin-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-admin-foreground">{stats.newSignupsMonth}</p>
              <p className="text-xs text-admin-muted-foreground">Monthly Growth</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-6 w-6 mx-auto text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-admin-foreground">
                {stats.pendingSubmissions + stats.pendingPublications}
              </p>
              <p className="text-xs text-admin-muted-foreground">Total Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-4 text-center">
              <PieChart className="h-6 w-6 mx-auto text-amber-500 mb-2" />
              <p className="text-2xl font-bold text-admin-foreground">
                {((stats.revenueThisMonth / Math.max(stats.totalRevenue, 1)) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-admin-muted-foreground">Monthly Share</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
