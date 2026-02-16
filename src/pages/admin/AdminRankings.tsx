import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Crown, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  DollarSign,
  Download,
  Filter,
  ArrowUpDown,
  Users,
  TrendingUp,
  Wallet,
  Check,
  X,
  Eye,
  Sparkles,
  AlertCircle,
  Clock
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { DesignerRankModal } from "@/components/admin/DesignerRankModal";
import { PayoutApprovalModal } from "@/components/admin/PayoutApprovalModal";
import { RankDistributionChart } from "@/components/admin/RankDistributionChart";
import { RevenueChart } from "@/components/admin/RevenueChart";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Rank = Database["public"]["Tables"]["ranks"]["Row"];
type Payout = Database["public"]["Tables"]["payouts"]["Row"];
type Earning = Database["public"]["Tables"]["earnings"]["Row"];

interface DesignerWithRank extends Profile {
  ranks?: Rank | null;
  total_earnings?: number;
  pending_payout?: number;
}

const rankColors: Record<string, string> = {
  "F1": "bg-purple-500/20 text-purple-600 border-purple-500/30",
  "F2": "bg-indigo-500/20 text-indigo-600 border-indigo-500/30",
  "Apprentice": "bg-slate-500/20 text-slate-600 border-slate-500/30",
  "Patternist": "bg-amber-500/20 text-amber-600 border-amber-500/30",
  "Stylist": "bg-blue-500/20 text-blue-600 border-blue-500/30",
  "Couturier": "bg-success/20 text-success border-success/30",
  "Visionary": "bg-orange-500/20 text-orange-600 border-orange-500/30",
  "Creative Director": "bg-rose-500/20 text-rose-600 border-rose-500/30",
  // Fallback for old rank names
  "Novice": "bg-slate-500/20 text-slate-600 border-slate-500/30",
  "Designer": "bg-blue-500/20 text-blue-600 border-blue-500/30",
  "Senior": "bg-success/20 text-success border-success/30",
  "Lead": "bg-orange-500/20 text-orange-600 border-orange-500/30",
  "Elite": "bg-rose-500/20 text-rose-600 border-rose-500/30",
};

const statusColors: Record<string, string> = {
  active: "bg-success/20 text-success border-success/30",
  suspended: "bg-destructive/20 text-destructive border-destructive/30",
  inactive: "bg-muted text-muted-foreground border-border",
};

const payoutStatusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-600 border-amber-500/30",
  processed: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  paid: "bg-success/20 text-success border-success/30",
};

export default function AdminRankings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [rankFilter, setRankFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("SC");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const [editingDesigner, setEditingDesigner] = useState<DesignerWithRank | null>(null);
  const [editingPayout, setEditingPayout] = useState<Payout | null>(null);

  // Fetch ranks
  const { data: ranks } = useQuery({
    queryKey: ["ranks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ranks")
        .select("*")
        .order("rank_order", { ascending: true });
      if (error) throw error;
      return data as Rank[];
    },
  });

  // Fetch designers with rank info
  const { data: designers, isLoading: loadingDesigners } = useQuery({
    queryKey: ["admin-designers-rankings", categoryFilter, rankFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select(`*, ranks(*)`)
        .order("style_credits", { ascending: false });

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter as "fashion" | "textile" | "jewelry");
      }
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as "active" | "suspended" | "inactive");
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DesignerWithRank[];
    },
  });

  // Fetch payouts
  const { data: payouts, isLoading: loadingPayouts } = useQuery({
    queryKey: ["admin-payouts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payouts")
        .select("*")
        .order("processed_at", { ascending: false, nullsFirst: true });
      if (error) throw error;
      return data as Payout[];
    },
  });

  // Fetch earnings summary
  const { data: earningsSummary } = useQuery({
    queryKey: ["admin-earnings-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("earnings")
        .select("amount, created_at");
      if (error) throw error;
      
      const total = (data as Earning[]).reduce((sum, e) => sum + Number(e.amount), 0);
      return { total, count: data.length };
    },
  });

  // Update payout status
  const updatePayoutMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("payouts")
        .update({ 
          status: status as "pending" | "processed" | "paid",
          processed_at: status !== "pending" ? new Date().toISOString() : null
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
      toast({ title: "Payout updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update payout", variant: "destructive" });
    },
  });

  // Filter designers by search
  const filteredDesigners = designers?.filter(d => {
    const matchesSearch = 
      d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRank = rankFilter === "all" || d.ranks?.name === rankFilter;
    return matchesSearch && matchesRank;
  });

  // Calculate stats
  const pendingPayouts = payouts?.filter(p => p.status === "pending") || [];
  const totalPendingAmount = pendingPayouts.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPaidAmount = payouts?.filter(p => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  // Rank distribution for chart
  const rankDistribution = ranks?.map(rank => ({
    name: rank.name,
    count: designers?.filter(d => d.rank_id === rank.id).length || 0,
  })) || [];

  // Export to CSV
  const exportDesigners = () => {
    if (!filteredDesigners) return;
    
    const headers = ["Name", "Email", "Category", "Rank", "XP", "Revenue Share %", "Status"];
    const rows = filteredDesigners.map(d => [
      d.name || "",
      d.email || "",
      d.category || "",
      d.ranks?.name || "Unranked",
      d.style_credits?.toString() || "0",
      d.ranks?.revenue_share_percent?.toString() || "0",
      d.status || "",
    ]);
    
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `designers-rankings-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Export complete", description: "Designer rankings exported to CSV." });
  };

  const exportPayouts = () => {
    if (!payouts) return;
    
    const headers = ["Designer ID", "Amount", "Status", "Processed At"];
    const rows = payouts.map(p => [
      p.designer_id,
      p.amount.toString(),
      p.status,
      p.processed_at || "Pending",
    ]);
    
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payouts-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Export complete", description: "Payouts exported to CSV." });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <Crown className="h-6 w-6 text-admin-camel" />
              Ranking & Revenue Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage designer ranks, revenue shares, and payouts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportDesigners}>
              <Download className="h-4 w-4 mr-2" />
              Export Rankings
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-admin-wine/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-admin-wine" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Designers</p>
                  <p className="text-2xl font-bold">{designers?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payouts</p>
                  <p className="text-2xl font-bold">${totalPendingAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold">${totalPaidAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">${earningsSummary?.total.toLocaleString() || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="designers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="designers">Designer Rankings</TabsTrigger>
            <TabsTrigger value="payouts" className="relative">
              Payouts
              {pendingPayouts.length > 0 && (
                <Badge className="ml-2 h-5 px-1.5 bg-destructive text-destructive-foreground">
                  {pendingPayouts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="insights">Performance Insights</TabsTrigger>
          </TabsList>

          {/* Designers Tab */}
          <TabsContent value="designers" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center bg-card rounded-lg border p-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="textile">Textile</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={rankFilter} onValueChange={setRankFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Rank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranks</SelectItem>
                    {ranks?.map(rank => (
                      <SelectItem key={rank.id} value={rank.name}>{rank.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Designers Table */}
            <div className="bg-card rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[250px]">Designer</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="gap-1 -ml-3">
                        Rank
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Revenue Share</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="gap-1 -ml-3">
                        XP
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingDesigners ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7}>
                          <div className="h-12 bg-muted/50 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredDesigners?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground">No designers found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDesigners?.map((designer) => (
                      <TableRow key={designer.id} className="group hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-admin-wine/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-admin-wine">
                                {designer.name?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{designer.name || "Unknown"}</p>
                              <p className="text-xs text-muted-foreground">{designer.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{designer.category}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={rankColors[designer.ranks?.name || ""] || "bg-muted"}>
                            {designer.ranks?.name || "Unranked"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{designer.ranks?.revenue_share_percent || 0}%</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-4 w-4 text-admin-camel" />
                            <span className="font-medium">{designer.style_credits?.toLocaleString() || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[designer.status || "inactive"]}>
                            {designer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => setEditingDesigner(designer)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Rank / XP
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Portfolio
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Wallet className="h-4 w-4 mr-2" />
                                View Earnings
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Payouts Tab */}
          <TabsContent value="payouts" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Card className="px-4 py-2">
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-lg font-bold text-amber-600">{pendingPayouts.length}</p>
                </Card>
                <Card className="px-4 py-2">
                  <p className="text-xs text-muted-foreground">To Process</p>
                  <p className="text-lg font-bold">${totalPendingAmount.toLocaleString()}</p>
                </Card>
              </div>
              <Button variant="outline" size="sm" onClick={exportPayouts}>
                <Download className="h-4 w-4 mr-2" />
                Export Payouts
              </Button>
            </div>

            <div className="bg-card rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Designer ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Processed At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingPayouts ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={5}>
                          <div className="h-12 bg-muted/50 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : payouts?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <Wallet className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground">No payouts found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    payouts?.map((payout) => (
                      <TableRow key={payout.id} className="group hover:bg-muted/30">
                        <TableCell className="font-mono text-sm">
                          {payout.designer_id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <span className="font-bold">${Number(payout.amount).toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={payoutStatusColors[payout.status]}>
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {payout.processed_at 
                            ? format(new Date(payout.processed_at), "MMM d, yyyy HH:mm")
                            : "—"
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          {payout.status === "pending" && (
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-success hover:text-success hover:bg-success/10"
                                onClick={() => updatePayoutMutation.mutate({ id: payout.id, status: "processed" })}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setEditingPayout(payout)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          {payout.status === "processed" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updatePayoutMutation.mutate({ id: payout.id, status: "paid" })}
                            >
                              Mark Paid
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rank Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <RankDistributionChart data={rankDistribution} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <RevenueChart />
                </CardContent>
              </Card>
            </div>

            {/* Top Designers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-admin-camel" />
                  Top Designers by XP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredDesigners?.slice(0, 5).map((designer, index) => (
                    <div key={designer.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <div className="h-8 w-8 rounded-full bg-admin-wine/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-admin-wine">
                            {designer.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{designer.name}</p>
                          <p className="text-xs text-muted-foreground">{designer.ranks?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{designer.style_credits?.toLocaleString()} SC</p>
                        <p className="text-xs text-muted-foreground">{designer.ranks?.revenue_share_percent}% share</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rank Threshold Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  Approaching Next Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Designers close to ranking up will appear here once XP thresholds are configured.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Designer Rank Edit Modal */}
      {editingDesigner && (
        <DesignerRankModal
          open={!!editingDesigner}
          onOpenChange={() => setEditingDesigner(null)}
          designer={editingDesigner}
          ranks={ranks || []}
        />
      )}

      {/* Payout Approval Modal */}
      {editingPayout && (
        <PayoutApprovalModal
          open={!!editingPayout}
          onOpenChange={() => setEditingPayout(null)}
          payout={editingPayout}
        />
      )}
    </AdminLayout>
  );
}
