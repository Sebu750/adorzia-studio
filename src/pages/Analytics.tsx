import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyEarnings } from "@/components/empty-states/EmptyEarnings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Eye,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

const Analytics = () => {
  const { stats, revenueData, topProducts, transactions, loading, error } = useAnalyticsData();

  const hasData = stats.totalEarnings > 0 || stats.productsSold > 0 || stats.productViews > 0;

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-5 w-48 mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!hasData) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">
                Earnings & Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your marketplace performance and revenue
              </p>
            </div>
          </div>
          <EmptyEarnings />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Earnings & Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your marketplace performance and revenue
            </p>
          </div>
          <div className="flex gap-3">
            <Select defaultValue="6months">
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
                {stats.totalEarnings > 0 && (
                  <div className="flex items-center gap-1 text-success text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    --
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="font-display text-3xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                {stats.monthlyEarnings > 0 && (
                  <div className="flex items-center gap-1 text-success text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    --
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="font-display text-3xl font-bold">${stats.monthlyEarnings.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Products Sold</p>
              <p className="font-display text-3xl font-bold">{stats.productsSold}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-warning" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Product Views</p>
              <p className="font-display text-3xl font-bold">{stats.productViews.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {revenueData.some(d => d.earnings > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`$${value}`, "Earnings"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No revenue data yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                      </div>
                      <p className="font-display font-semibold text-accent">${product.revenue}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No products sold yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            {transactions.length > 0 && (
              <Button variant="ghost" size="sm">View All</Button>
            )}
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Transaction ID</th>
                      <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Product</th>
                      <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Amount</th>
                      <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Date</th>
                      <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-4 text-sm font-mono">{txn.id}</td>
                        <td className="py-3 px-4 text-sm">{txn.product}</td>
                        <td className="py-3 px-4 text-sm font-medium">${txn.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{txn.date}</td>
                        <td className="py-3 px-4">
                          <Badge variant={txn.status === "completed" ? "success" : "warning"}>
                            {txn.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No transactions yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Analytics;
