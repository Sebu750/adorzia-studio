import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FilterBar } from "@/components/admin/FilterBar";
import { EmptyState } from "@/components/admin/EmptyState";
import { TablePagination } from "@/components/admin/TablePagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  UserPlus,
  Download,
  Eye,
  Edit,
  Crown,
  Ban,
  Mail,
  Loader2,
  RefreshCw,
  ArrowUpDown,
  FileSearch,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RANKS, RankTier, safeGetRank, isValidRankTier } from "@/lib/ranks";

const rankColors: Record<string, string> = {
  f1: "bg-amber-100 text-amber-700 border-amber-200",
  f2: "bg-slate-100 text-slate-700 border-slate-200",
  f3: "bg-orange-100 text-orange-700 border-orange-200",
  apprentice: "bg-blue-100 text-blue-700 border-blue-200",
};

const AdminDesigners = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [rankFilter, setRankFilter] = useState("all-ranks");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch designers with their submission counts and earnings
  const { data: designers = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-designers'],
    queryFn: async () => {
      try {
        // 1. Fetch all profiles (all users in the system are considered designers)
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) {
          throw profilesError;
        }

        if (!profiles || profiles.length === 0) {
          return []; // Return empty array if no profiles found
        }

        // 2. Fetch submission counts and revenue for each designer
        const designerIds = profiles.map(p => p.user_id);
        
        // Only query if there are designer IDs to avoid empty .in() queries
        let submissions = [];
        let earnings = [];
        
        if (designerIds.length > 0) {
          const [
            { data: submissionsData, error: submissionsError },
            { data: earningsData, error: earningsError }
          ] = await Promise.all([
            supabase.from('stylebox_submissions').select('designer_id, status').in('designer_id', designerIds),
            supabase.from('earnings').select('designer_id, amount').in('designer_id', designerIds)
          ]);
          
          // Silently handle query errors
          
          submissions = submissionsData || [];
          earnings = earningsData || [];
        }

        return profiles.map(profile => {
          const designerSubmissions = submissions?.filter(s => s.designer_id === profile.user_id) || [];
          const designerEarnings = earnings?.filter(e => e.designer_id === profile.user_id) || [];
          
          return {
            id: profile.user_id,
            name: profile.name || "Unknown",
            email: profile.email || "No email",
            avatar: profile.avatar_url,
            category: profile.category,
            rank: profile.founder_tier === 'f1' ? 'f1' : profile.founder_tier === 'f2' ? 'f2' : profile.rank_id ? 'f1' : 'apprentice',
            rank_name: profile.founder_tier === 'f1' ? 'F1 - Founding Legacy' : profile.founder_tier === 'f2' ? 'F2 - The Pioneer' : "Apprentice",
            subscription: profile.subscription_tier,
            status: profile.status,
            completedStyleboxes: designerSubmissions.filter(s => s.status === 'approved').length,
            publishedItems: designerSubmissions.length, // Total submissions as publishedItems proxy for now
            revenue: designerEarnings.reduce((sum, e) => sum + Number(e.amount || 0), 0),
            joinedAt: new Date(profile.created_at).toLocaleDateString()
          };
        });
      } catch (error) {
        throw error;
      }
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status: status as any })
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-designers'] });
      toast({ title: "Status updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    }
  });

  const filteredDesigners = designers.filter(designer => {
    const matchesSearch = 
      designer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      designer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all-status" || designer.status === statusFilter;
    
    // Filter by rank - include founder tier if applicable
    const matchesRank = rankFilter === "all-ranks" || 
      (rankFilter === 'f1' && designer.rank === 'f1') || 
      (rankFilter === 'f2' && designer.rank === 'f2') || 
      (rankFilter === 'apprentice' && designer.rank === 'apprentice');
    
    return matchesSearch && matchesStatus && matchesRank;
  });

  const totalPages = Math.ceil(filteredDesigners.length / itemsPerPage);
  const paginatedDesigners = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDesigners.slice(start, start + itemsPerPage);
  }, [filteredDesigners, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-admin-foreground">
              Designer Management
            </h1>
            <p className="text-sm text-admin-muted-foreground mt-1">
              View and manage all registered designers
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 h-10 px-4 transition-all hover:bg-admin-muted active:scale-[0.98]" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="accent" className="gap-2 h-10 px-4 bg-admin-foreground text-admin-background hover:bg-admin-foreground/90 transition-all active:scale-[0.98] shadow-md">
              <UserPlus className="h-4 w-4" />
              Add Designer
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar 
          searchValue={searchQuery}
          onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          searchPlaceholder="Search by name, email..."
          filters={[
            {
              value: rankFilter,
              onChange: (val) => { setRankFilter(val); setCurrentPage(1); },
              placeholder: "Rank",
              options: [
                { value: "all-ranks", label: "All Ranks" },
                { value: "f1", label: "F1 - Founding Legacy" },
                { value: "f2", label: "F2 - The Pioneer" },
                { value: "apprentice", label: "Apprentice" },
              ]
            },
            {
              value: statusFilter,
              onChange: (val) => { setStatusFilter(val); setCurrentPage(1); },
              placeholder: "Status",
              options: [
                { value: "all-status", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "suspended", label: "Suspended" },
              ]
            }
          ]}
        />

        {/* Enhanced Table */}
        <Card className="overflow-hidden border-admin-border shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-admin-muted/50 sticky top-0">
                <TableRow className="border-b-2 border-admin-border hover:bg-transparent">
                  <TableHead className="h-12 px-4 text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">
                    Designer
                  </TableHead>
                  <TableHead className="h-12 px-4 text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">
                    Category
                  </TableHead>
                  <TableHead className="h-12 px-4 text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">
                    Rank
                  </TableHead>
                  <TableHead className="h-12 px-4 text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">
                    Subscription
                  </TableHead>
                  <TableHead className="h-12 px-4 text-xs font-bold uppercase tracking-wider text-admin-muted-foreground text-right">
                    StyleBoxes
                  </TableHead>
                  <TableHead className="h-12 px-4 text-xs font-bold uppercase tracking-wider text-admin-muted-foreground text-right">
                    Revenue
                  </TableHead>
                  <TableHead className="h-12 px-4 text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="h-12 px-4 text-xs font-bold uppercase tracking-wider text-admin-muted-foreground text-right w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-admin-muted-foreground" />
                        <p className="text-sm text-admin-muted-foreground">Loading designers...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedDesigners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64">
                      <EmptyState
                        icon={searchQuery ? FileSearch : Users}
                        title={searchQuery ? "No designers found" : "No designers yet"}
                        description={
                          searchQuery
                            ? `No results match "${searchQuery}". Try adjusting your filters.`
                            : "Get started by inviting designers to join Adorzia."
                        }
                        actionLabel={!searchQuery ? "Invite Designer" : undefined}
                        onAction={!searchQuery ? () => {} : undefined}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDesigners.map((designer) => (
                    <TableRow 
                      key={designer.id}
                      className="group hover:bg-admin-muted/30 transition-colors border-b border-admin-border/50"
                    >
                      <TableCell className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-admin-border">
                            <AvatarImage src={designer.avatar} />
                            <AvatarFallback className="bg-admin-foreground text-admin-background text-xs font-semibold">
                              {designer.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm text-admin-foreground truncate">
                              {designer.name}
                            </span>
                            <span className="text-xs text-admin-muted-foreground truncate">
                              {designer.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Badge variant="outline" className="capitalize text-xs border-admin-border bg-admin-muted/30">
                          {designer.category || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Badge 
                          variant="outline"
                          className={cn("text-xs font-medium", rankColors[designer.rank] || rankColors.apprentice)}
                        >
                          <Crown className="h-3 w-3 mr-1" />
                          {designer.rank_name}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Badge 
                          variant={
                            designer.subscription === 'elite' ? 'accent' :
                            designer.subscription === 'pro' ? 'secondary' : 'outline'
                          }
                          className="capitalize text-xs font-medium"
                        >
                          {designer.subscription}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-semibold text-admin-foreground">{designer.completedStyleboxes}</span>
                          <span className="text-[10px] text-admin-muted-foreground font-medium">/ {designer.publishedItems} pub</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right">
                        <span className="text-sm font-bold text-success">
                          ${designer.revenue.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Badge 
                          variant={designer.status === 'active' ? 'success' : 'destructive'}
                          className="capitalize text-xs font-bold"
                        >
                          {designer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-admin-muted transition-all active:scale-95">
                              <MoreHorizontal className="h-4 w-4 text-admin-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-admin-card border-admin-border shadow-lg">
                            <DropdownMenuLabel className="text-xs font-bold text-admin-muted-foreground uppercase tracking-wider">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-admin-border" />
                            <DropdownMenuItem className="cursor-pointer focus:bg-admin-muted">
                              <Eye className="h-4 w-4 mr-2.5 text-admin-muted-foreground" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer focus:bg-admin-muted">
                              <Mail className="h-4 w-4 mr-2.5 text-admin-muted-foreground" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-admin-border" />
                            {designer.status === 'active' ? (
                              <DropdownMenuItem 
                                className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
                                onClick={() => updateStatusMutation.mutate({ userId: designer.id, status: 'suspended' })}
                              >
                                <Ban className="h-4 w-4 mr-2.5" />
                                Suspend Account
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                className="text-success cursor-pointer focus:bg-success/10 focus:text-success"
                                onClick={() => updateStatusMutation.mutate({ userId: designer.id, status: 'active' })}
                              >
                                <RefreshCw className="h-4 w-4 mr-2.5" />
                                Activate Account
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {!isLoading && filteredDesigners.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredDesigners.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};


export default AdminDesigners;
