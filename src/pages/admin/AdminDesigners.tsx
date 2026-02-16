<<<<<<< HEAD
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FilterBar } from "@/components/admin/FilterBar";
import { EmptyState } from "@/components/admin/EmptyState";
import { TablePagination } from "@/components/admin/TablePagination";
=======
import { AdminLayout } from "@/components/admin/AdminLayout";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
  Mail,
  Loader2,
  RefreshCw,
  ArrowUpDown,
  FileSearch,
  Users
=======
  Mail
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RANKS, RankTier, safeGetRank, isValidRankTier } from "@/lib/ranks";

<<<<<<< HEAD
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
=======
// Mock designer data - using valid RankTier values
const designers = [
  {
    id: "1",
    name: "Aria Kim",
    email: "aria.kim@email.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    country: "South Korea",
    category: "Fashion",
    rank: "f1" as RankTier,
    subscription: "elite",
    status: "active",
    completedStyleboxes: 47,
    publishedItems: 23,
    revenue: 12450,
    joinedAt: "Mar 2023",
  },
  {
    id: "2",
    name: "Marcus Chen",
    email: "marcus.chen@email.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    country: "USA",
    category: "Fashion",
    rank: "creative_director" as RankTier,
    subscription: "pro",
    status: "active",
    completedStyleboxes: 38,
    publishedItems: 18,
    revenue: 9820,
    joinedAt: "Apr 2023",
  },
  {
    id: "3",
    name: "Sophie Laurent",
    email: "sophie.laurent@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    country: "France",
    category: "Textile",
    rank: "visionary" as RankTier,
    subscription: "pro",
    status: "active",
    completedStyleboxes: 32,
    publishedItems: 15,
    revenue: 7340,
    joinedAt: "May 2023",
  },
  {
    id: "4",
    name: "James Park",
    email: "james.park@email.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    country: "UK",
    category: "Jewelry",
    rank: "couturier" as RankTier,
    subscription: "pro",
    status: "active",
    completedStyleboxes: 28,
    publishedItems: 12,
    revenue: 5120,
    joinedAt: "Jun 2023",
  },
  {
    id: "5",
    name: "Elena Rodriguez",
    email: "elena.rod@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    country: "Spain",
    category: "Fashion",
    rank: "patternist" as RankTier,
    subscription: "basic",
    status: "active",
    completedStyleboxes: 24,
    publishedItems: 9,
    revenue: 3890,
    joinedAt: "Jul 2023",
  },
  {
    id: "6",
    name: "David Wilson",
    email: "david.w@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    country: "Canada",
    category: "Textile",
    rank: "apprentice" as RankTier,
    subscription: "basic",
    status: "suspended",
    completedStyleboxes: 8,
    publishedItems: 2,
    revenue: 890,
    joinedAt: "Sep 2023",
  },
];

const rankColors: Record<RankTier, string> = {
  'f1': 'bg-rank-f1/10 text-rank-f1 border-rank-f1/30',
  'f2': 'bg-rank-f2/10 text-rank-f2 border-rank-f2/30',
  'apprentice': 'bg-rank-apprentice/10 text-rank-apprentice border-rank-apprentice/30',
  'patternist': 'bg-muted/20 text-muted-foreground border-muted-foreground/30',
  'stylist': 'bg-muted/30 text-foreground border-muted-foreground/40',
  'couturier': 'bg-foreground/10 text-foreground border-foreground/30',
  'visionary': 'bg-foreground/15 text-foreground border-foreground/40',
  'creative_director': 'bg-foreground/20 text-foreground border-foreground/50',
};

const AdminDesigners = () => {
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Designer Management
            </h1>
            <p className="text-muted-foreground mt-1">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              View and manage all registered designers
            </p>
          </div>
          <div className="flex gap-3">
<<<<<<< HEAD
            <Button variant="outline" className="gap-2 h-10 px-4 transition-all hover:bg-admin-muted active:scale-[0.98]" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="accent" className="gap-2 h-10 px-4 bg-admin-foreground text-admin-background hover:bg-admin-foreground/90 transition-all active:scale-[0.98] shadow-md">
=======
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="accent" className="gap-2">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              <UserPlus className="h-4 w-4" />
              Add Designer
            </Button>
          </div>
        </div>

<<<<<<< HEAD
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
=======
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, email..." className="pl-10" />
              </div>
              <Select defaultValue="all-ranks">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-ranks">All Ranks</SelectItem>
                  <SelectItem value="f1">F1 - Founder</SelectItem>
                  <SelectItem value="f2">F2 - Pioneer</SelectItem>
                  <SelectItem value="elite">Elite</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-subs">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-subs">All Plans</SelectItem>
                  <SelectItem value="elite">Elite</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-status">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Designers Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Designer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>StyleBoxes</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {designers.map((designer) => (
                  <TableRow key={designer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={designer.avatar} />
                          <AvatarFallback>{designer.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{designer.name}</p>
                          <p className="text-xs text-muted-foreground">{designer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{designer.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={cn(rankColors[designer.rank] || rankColors.apprentice)}
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        {safeGetRank(designer.rank).name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          designer.subscription === 'elite' ? 'accent' :
                          designer.subscription === 'pro' ? 'secondary' : 'outline'
                        }
                        className="capitalize"
                      >
                        {designer.subscription}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{designer.completedStyleboxes}</span>
                      <span className="text-muted-foreground"> / {designer.publishedItems} pub</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-success">
                        ${designer.revenue.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={designer.status === 'active' ? 'success' : 'destructive'}
                        className="capitalize"
                      >
                        {designer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Crown className="h-4 w-4 mr-2" />
                            Change Rank
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        </Card>
      </div>
    </AdminLayout>
  );
};

<<<<<<< HEAD

=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
export default AdminDesigners;
