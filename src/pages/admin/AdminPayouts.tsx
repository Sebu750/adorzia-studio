import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  RefreshCw,
  Search,
  ArrowUpRight,
  TrendingUp,
  History
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const AdminPayouts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: payouts = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-payouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payouts')
        .select(`
          *,
          profiles:designer_id (
            name,
            email
          )
        `)
        .order('status', { ascending: false }) // Show pending first
        .order('id', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-payout-stats'],
    queryFn: async () => {
      const [
        { data: earnings },
        { data: totalPaid }
      ] = await Promise.all([
        supabase.from('earnings').select('amount'),
        supabase.from('payouts').select('amount').eq('status', 'paid')
      ]);

      const totalEarned = earnings?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const totalPaidAmount = totalPaid?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const pendingAmount = payouts
        .filter((p: any) => p.status === 'pending')
        .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

      return {
        totalEarned,
        totalPaidAmount,
        pendingAmount,
        payoutRate: totalEarned > 0 ? (totalPaidAmount / totalEarned) * 100 : 0
      };
    },
    enabled: !!payouts
  });

  const updatePayoutMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'paid' | 'processed' }) => {
      const { error } = await supabase
        .from('payouts')
        .update({ status, processed_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-payout-stats'] });
      toast({ title: "Payout updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error updating payout", description: error.message, variant: "destructive" });
    }
  });

  const filteredPayouts = payouts.filter((p: any) => 
    p.profiles?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.designer_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Financial Operations</h1>
            <p className="text-muted-foreground">Manage designer earnings and payout requests</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Sync Data
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-admin-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <Badge variant="outline" className="bg-success/5 text-success border-success/20">Total</Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">${stats?.totalEarned.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Gross Platform Earnings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-admin-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                </div>
                <Badge variant="outline" className="bg-blue-500/5 text-blue-500 border-blue-500/20">Paid</Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">${stats?.totalPaidAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Successfully Disbursed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-admin-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <Badge variant="outline" className="bg-amber-500/5 text-amber-500 border-amber-500/20">Queue</Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">${stats?.pendingAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Pending Payout Requests</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-admin-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-purple-500" />
                </div>
                <Badge variant="outline" className="bg-purple-500/5 text-purple-500 border-purple-500/20">Rate</Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stats?.payoutRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Payout to Revenue Ratio</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by designer or ID..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Designer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-admin-wine" />
                    </TableCell>
                  </TableRow>
                ) : filteredPayouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No payout requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayouts.map((payout: any) => (
                    <TableRow key={payout.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payout.profiles?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{payout.profiles?.email || payout.designer_id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        ${Number(payout.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {payout.created_at ? formatDistanceToNow(new Date(payout.created_at), { addSuffix: true }) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            payout.status === 'pending' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                            payout.status === 'paid' ? "bg-success/10 text-success border-success/20" :
                            "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          )}
                        >
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {payout.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-success border-success/20 hover:bg-success/10"
                              onClick={() => updatePayoutMutation.mutate({ id: payout.id, status: 'paid' })}
                              disabled={updatePayoutMutation.isPending}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-destructive border-destructive/20 hover:bg-destructive/5"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Processed {payout.processed_at ? new Date(payout.processed_at).toLocaleDateString() : ""}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPayouts;

