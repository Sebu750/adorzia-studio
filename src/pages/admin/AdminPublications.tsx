import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FilterBar } from "@/components/admin/FilterBar";
import { EmptyState } from "@/components/admin/EmptyState";
import { TablePagination } from "@/components/admin/TablePagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Search, 
  Check,
  X,
  AlertCircle,
  Eye,
  Clock,
  FileSearch,
  Crown,
  Percent,
  Package,
  Store,
  Send,
  Star,
  History,
  Lock,
  BarChart3,
  Users,
  CheckCircle2,
  XCircle,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RANKS, RankTier, RANK_ORDER } from "@/lib/ranks";
import { toast } from "sonner";
import { format } from "date-fns";

const decisionColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/30",
  approved: "bg-success/10 text-success border-success/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
  revision_requested: "bg-orange-500/10 text-orange-500 border-orange-500/30",
};

const marketplaceStatusColors: Record<string, string> = {
  pending_handoff: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  awaiting_sampling: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  sampling_approved: "bg-teal-500/10 text-teal-500 border-teal-500/30",
  production_started: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  listing_scheduled: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
  published: "bg-success/10 text-success border-success/30",
  discontinued: "bg-muted text-muted-foreground border-border",
};

const marketplaceStatusLabels: Record<string, string> = {
  pending_handoff: "Pending Handoff",
  awaiting_sampling: "Awaiting Sampling",
  sampling_approved: "Sampling Approved",
  production_started: "In Production",
  listing_scheduled: "Listing Scheduled",
  published: "Published",
  discontinued: "Discontinued",
};

const sourceTypeLabels: Record<string, string> = {
  stylebox: "StyleBox Output",
  walkthrough: "Walkthrough Project",
  independent: "Independent Design",
  portfolio: "Portfolio Item",
};

export default function AdminPublications() {
  const { user } = useAdminAuth();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusTab, setStatusTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [selectedPublication, setSelectedPublication] = useState<any>(null);
  const [actionType, setActionType] = useState<"approve" | "revision" | "reject" | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [qualityRating, setQualityRating] = useState<number>(3);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [revenueOverride, setRevenueOverride] = useState<number | null>(null);

  // Fetch publications with portfolios and designer profiles
  const { data: publications, isLoading } = useQuery({
    queryKey: ["admin-publications", statusTab],
    queryFn: async () => {
      let query = supabase
        .from("portfolio_publications")
        .select(`
          *,
          portfolio:portfolios(
            id,
            title,
            description,
            items,
            designer_id,
            designer:profiles!portfolios_designer_id_fkey(
              id,
              user_id,
              name,
              email,
              avatar_url,
              rank_id,
              xp
            )
          )
        `)
        .order("submitted_at", { ascending: false });

      if (statusTab !== "all") {
        if (statusTab === "pending") {
          query = query.eq("decision", "pending");
        } else if (statusTab === "approved") {
          query = query.eq("decision", "approved");
        } else if (statusTab === "rejected") {
          query = query.eq("decision", "rejected");
        } else if (statusTab === "revision") {
          query = query.eq("decision", "revision_requested");
        } else if (statusTab === "production") {
          query = query.not("marketplace_status", "is", null);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch publication reviews for history
  const { data: reviews } = useQuery({
    queryKey: ["publication-reviews", selectedPublication?.id],
    queryFn: async () => {
      if (!selectedPublication?.id) return [];
      const { data, error } = await supabase
        .from("publication_reviews")
        .select("*")
        .eq("publication_id", selectedPublication.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedPublication?.id && showHistoryModal,
  });

  const filteredPublications = useMemo(() => {
    if (!publications) return [];
    return publications.filter((p: any) => {
      const matchesSearch = p.portfolio?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.portfolio?.designer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.portfolio?.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [publications, searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filteredPublications.length / itemsPerPage);
  const paginatedPublications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPublications.slice(start, start + itemsPerPage);
  }, [filteredPublications, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Decision mutation (Approve/Reject/Request Revision)
  const decisionMutation = useMutation({
    mutationFn: async ({ publicationId, decision, notes, rating }: {
      publicationId: string;
      decision: string;
      notes: string;
      rating?: number;
    }) => {
      // Update publication
      const updateData: any = {
        decision,
        decision_notes: notes,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      };
      
      if (rating) {
        updateData.quality_rating = rating;
      }
      
      if (decision === "approved") {
        updateData.locked_at = new Date().toISOString();
        updateData.marketplace_status = "pending_handoff";
        
        // Calculate revenue share based on designer rank
        const designer = selectedPublication?.portfolio?.designer;
        if (designer) {
          const rankOrder = RANK_ORDER.indexOf(designer.rank_id as RankTier);
          const rank = RANKS[designer.rank_id as RankTier];
          updateData.designer_revenue_share = rank?.revenueShare || 20;
        }
      }

      const { error: updateError } = await supabase
        .from("portfolio_publications")
        .update(updateData)
        .eq("id", publicationId);
      
      if (updateError) throw updateError;

      // Log the review action
      const { error: reviewError } = await supabase
        .from("publication_reviews")
        .insert({
          publication_id: publicationId,
          reviewer_id: user?.id,
          action: decision,
          notes,
          quality_rating: rating || null,
        });
      
      if (reviewError) throw reviewError;

      // Log admin action
      await supabase.from("admin_logs").insert({
        admin_id: user?.id,
        action: `publication_${decision}`,
        target_type: "publication",
        target_id: publicationId,
        metadata: { notes, quality_rating: rating },
      });
    },
    onSuccess: (_, { decision }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
      const messages = {
        approved: "Publication approved and sent to Marketplace queue",
        rejected: "Publication rejected",
        revision_requested: "Revision requested from designer",
      };
      toast.success(messages[decision as keyof typeof messages] || "Action completed");
      setActionType(null);
      setSelectedPublication(null);
      setActionNotes("");
    },
    onError: (error) => {
      toast.error("Failed to process decision");
      console.error(error);
    },
  });

  // Revenue override mutation (superadmin only)
  const revenueOverrideMutation = useMutation({
    mutationFn: async ({ publicationId, share }: { publicationId: string; share: number }) => {
      const { error } = await supabase
        .from("portfolio_publications")
        .update({
          designer_revenue_share: share,
          revenue_override: true,
        })
        .eq("id", publicationId);
      
      if (error) throw error;

      await supabase.from("admin_logs").insert({
        admin_id: user?.id,
        action: "revenue_override",
        target_type: "publication",
        target_id: publicationId,
        metadata: { new_share: share },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
      toast.success("Revenue share updated");
      setShowRevenueModal(false);
    },
    onError: (error) => {
      toast.error("Failed to update revenue share");
      console.error(error);
    },
  });

  // Generate marketplace package (for handoff)
  const generateMarketplacePackage = (publication: any) => {
    const portfolio = publication.portfolio;
    const designer = portfolio?.designer;
    
    return {
      publication_id: publication.id,
      title: portfolio?.title,
      description: portfolio?.description,
      category: publication.source_type,
      designer: {
        id: designer?.user_id,
        name: designer?.name,
        email: designer?.email,
        rank: designer?.rank_id,
      },
      revenue_share_percent: publication.designer_revenue_share,
      design_metadata: publication.design_metadata,
      submission_files: publication.submission_files,
      items: portfolio?.items,
      approved_at: publication.reviewed_at,
      approved_by: publication.reviewed_by,
    };
  };

  // Stats
  const pendingCount = publications?.filter((p: any) => p.decision === "pending").length || 0;
  const approvedCount = publications?.filter((p: any) => p.decision === "approved").length || 0;
  const rejectedCount = publications?.filter((p: any) => p.decision === "rejected").length || 0;
  const revisionCount = publications?.filter((p: any) => p.decision === "revision_requested").length || 0;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-admin-foreground">
              Publication Queue
            </h1>
            <p className="text-sm text-admin-muted-foreground mt-1">
              Review designer submissions and manage marketplace pipeline
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          <Card className="border-admin-border bg-admin-card shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-admin-foreground">{pendingCount}</p>
                <p className="text-xs text-admin-muted-foreground uppercase font-semibold tracking-wider">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-admin-border bg-admin-card shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-admin-foreground">{approvedCount}</p>
                <p className="text-xs text-admin-muted-foreground uppercase font-semibold tracking-wider">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-admin-border bg-admin-card shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                <RotateCcw className="h-6 w-6 text-orange-500" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-admin-foreground">{revisionCount}</p>
                <p className="text-xs text-admin-muted-foreground uppercase font-semibold tracking-wider">Revisions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-admin-border bg-admin-card shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-admin-foreground">{rejectedCount}</p>
                <p className="text-xs text-admin-muted-foreground uppercase font-semibold tracking-wider">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <FilterBar 
          searchValue={searchQuery}
          onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          searchPlaceholder="Search by title or designer..."
          filters={[
            {
              value: categoryFilter,
              onChange: (val) => { setCategoryFilter(val); setCurrentPage(1); },
              placeholder: "Category",
              options: [
                { value: "all", label: "All Sources" },
                { value: "stylebox", label: "StyleBox" },
                { value: "walkthrough", label: "Walkthrough" },
                { value: "independent", label: "Independent" },
                { value: "portfolio", label: "Portfolio" },
              ]
            }
          ]}
        />

        {/* Tabs */}
        <Tabs value={statusTab} onValueChange={setStatusTab} className="space-y-6">
          <div className="sticky top-0 z-10 bg-admin-background/80 backdrop-blur-sm py-2 -mx-2 px-2">
            <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-admin-foreground data-[state=active]:text-admin-background gap-2 rounded-lg transition-all"
              >
                All
                <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 border-admin-border">
                  {publications?.length || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="pending"
                className="data-[state=active]:bg-admin-foreground data-[state=active]:text-admin-background gap-2 rounded-lg transition-all"
              >
                Pending
                <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 border-admin-border">{pendingCount}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="revision"
                className="data-[state=active]:bg-admin-foreground data-[state=active]:text-admin-background gap-2 rounded-lg transition-all"
              >
                Revisions
                <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 border-admin-border">{revisionCount}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="approved"
                className="data-[state=active]:bg-admin-foreground data-[state=active]:text-admin-background gap-2 rounded-lg transition-all"
              >
                Approved
                <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 border-admin-border">{approvedCount}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="production"
                className="data-[state=active]:bg-admin-foreground data-[state=active]:text-admin-background gap-2 rounded-lg transition-all"
              >
                In Production
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={statusTab} className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border-admin-border">
                  <CardContent className="p-6">
                    <div className="h-32 bg-admin-muted/50 rounded-xl animate-pulse" />
                  </CardContent>
                </Card>
              ))
            ) : paginatedPublications.length === 0 ? (
              <Card className="border-admin-border shadow-sm">
                <CardContent className="p-0">
                  <EmptyState
                    icon={FileSearch}
                    title="No publications found"
                    description={searchQuery ? `No results match "${searchQuery}". Try adjusting your filters.` : "The publication queue is empty."}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {paginatedPublications.map((pub: any) => {
                  const portfolio = pub.portfolio;
                  const designer = portfolio?.designer;
                  const rankInfo = designer?.rank_id ? RANKS[designer.rank_id as RankTier] : null;
                  
                  return (
                    <Card key={pub.id} className="overflow-hidden border-admin-border hover:shadow-md transition-shadow group">
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          {/* Main Content */}
                          <div className="flex-1 p-6">
                            <div className="flex flex-col gap-5">
                              {/* Header Row */}
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-lg font-semibold text-admin-foreground group-hover:text-admin-foreground/80 transition-colors">
                                      {portfolio?.title || "Untitled"}
                                    </h3>
                                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-admin-border bg-admin-muted/30">
                                      {sourceTypeLabels[pub.source_type] || pub.source_type}
                                    </Badge>
                                    <Badge 
                                      variant="outline"
                                      className={cn("text-[10px] font-bold uppercase tracking-wider", decisionColors[pub.decision])}
                                    >
                                      {pub.decision === "revision_requested" ? "Revision Requested" : pub.decision}
                                    </Badge>
                                    {pub.marketplace_status && (
                                      <Badge 
                                        variant="outline"
                                        className={cn("text-[10px] font-bold uppercase tracking-wider", marketplaceStatusColors[pub.marketplace_status])}
                                      >
                                        {marketplaceStatusLabels[pub.marketplace_status]}
                                      </Badge>
                                    )}
                                    {pub.locked_at && (
                                      <Lock className="h-3.5 w-3.5 text-admin-muted-foreground" />
                                    )}
                                  </div>
                                  <p className="text-sm text-admin-muted-foreground line-clamp-2 max-w-3xl leading-relaxed">
                                    {portfolio?.description}
                                  </p>
                                </div>

                                {/* Quality Rating */}
                                {pub.quality_rating && (
                                  <div className="flex items-center gap-1 bg-admin-muted/30 px-2 py-1 rounded-lg">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star 
                                        key={i}
                                        className={cn(
                                          "h-3.5 w-3.5",
                                          i < pub.quality_rating 
                                            ? "text-amber-500 fill-amber-500" 
                                            : "text-admin-muted-foreground/30"
                                        )}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Footer Info Grid */}
                              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-admin-border/50">
                                {/* Designer */}
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9 ring-2 ring-admin-border">
                                    <AvatarImage src={designer?.avatar_url || undefined} />
                                    <AvatarFallback className="bg-admin-foreground text-admin-background text-xs font-semibold">
                                      {designer?.name?.slice(0, 2).toUpperCase() || "??"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-admin-foreground">{designer?.name || "Unknown Designer"}</p>
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-admin-muted-foreground">
                                      <Crown className="h-3 w-3 text-warning" />
                                      <span>{rankInfo?.name || "Unranked"}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Revenue Meta */}
                                <div className="flex items-center gap-4">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-admin-muted-foreground">Revenue Share</span>
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-admin-foreground">
                                      <Percent className="h-3.5 w-3.5 text-success" />
                                      <span>{pub.designer_revenue_share || rankInfo?.revenueShare || 20}%</span>
                                      {pub.revenue_override && <Badge variant="outline" className="text-[8px] h-4 px-1 leading-none">Override</Badge>}
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-admin-muted-foreground">Submitted</span>
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-admin-foreground">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>{format(new Date(pub.submitted_at), "MMM d, yyyy")}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Decision Notes */}
                              {pub.decision_notes && pub.decision !== "pending" && (
                                <div className={cn(
                                  "p-4 rounded-xl border leading-relaxed",
                                  pub.decision === "rejected" 
                                    ? "bg-destructive/5 border-destructive/20"
                                    : pub.decision === "revision_requested"
                                    ? "bg-orange-500/5 border-orange-500/20"
                                    : "bg-success/5 border-success/20"
                                )}>
                                  <p className="text-xs font-bold uppercase tracking-widest text-admin-muted-foreground mb-1">Admin Feedback</p>
                                  <p className="text-sm text-admin-foreground">
                                    {pub.decision_notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions Sidebar */}
                          <div className="flex lg:flex-col gap-2 p-4 lg:p-6 lg:border-l border-admin-border bg-admin-muted/30 lg:w-52">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2 h-10 font-medium border-admin-border hover:bg-admin-card transition-all active:scale-[0.98] flex-1 lg:flex-none"
                              onClick={() => {
                                setSelectedPublication(pub);
                                setShowHistoryModal(true);
                              }}
                            >
                              <History className="h-4 w-4 text-admin-muted-foreground" />
                              History
                            </Button>
                            
                            {(pub.decision === "pending" || pub.decision === "revision_requested") && (
                              <>
                                <Button 
                                  size="sm" 
                                  className="gap-2 h-10 font-bold bg-success hover:bg-success/90 transition-all active:scale-[0.98] shadow-sm flex-1 lg:flex-none"
                                  onClick={() => {
                                    setSelectedPublication(pub);
                                    setActionType("approve");
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="gap-2 h-10 font-medium text-warning border-warning/30 hover:bg-warning/10 transition-all active:scale-[0.98] flex-1 lg:flex-none"
                                  onClick={() => {
                                    setSelectedPublication(pub);
                                    setActionType("revision");
                                  }}
                                >
                                  <AlertCircle className="h-4 w-4" />
                                  Revisions
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="gap-2 h-10 font-medium text-destructive border-destructive/30 hover:bg-destructive/10 transition-all active:scale-[0.98] flex-1 lg:flex-none"
                                  onClick={() => {
                                    setSelectedPublication(pub);
                                    setActionType("reject");
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                  Reject
                                </Button>
                              </>
                            )}

                            {pub.decision === "approved" && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-2 h-10 font-medium border-admin-border transition-all active:scale-[0.98] flex-1 lg:flex-none"
                                onClick={() => {
                                  setSelectedPublication(pub);
                                  setShowRevenueModal(true);
                                  setRevenueOverride(pub.designer_revenue_share);
                                }}
                              >
                                <Percent className="h-4 w-4" />
                                Revenue
                              </Button>
                            )}

                            {pub.marketplace_status && (
                              <div className="text-[10px] font-bold uppercase tracking-widest text-center text-admin-muted-foreground mt-2 lg:mt-auto py-2 border-t border-admin-border/50">
                                Marketplace Sync
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {filteredPublications.length > itemsPerPage && (
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredPublications.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Decision Dialog */}
      <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <DialogContent className="max-w-lg border-admin-border shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-admin-border bg-admin-muted/30">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold text-admin-foreground">
                  {actionType === "approve" && "Approve Submission"}
                  {actionType === "revision" && "Request Revisions"}
                  {actionType === "reject" && "Reject Submission"}
                </DialogTitle>
                <DialogDescription className="text-sm font-medium">
                  {selectedPublication?.portfolio?.title}
                </DialogDescription>
              </div>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-2.5 py-1",
                  actionType === "approve" ? "bg-success/10 text-success border-success/30" :
                  actionType === "reject" ? "bg-destructive/10 text-destructive border-destructive/30" :
                  "bg-warning/10 text-warning border-warning/30"
                )}
              >
                {actionType}
              </Badge>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Quality Rating */}
            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider text-admin-muted-foreground">Quality Rating</Label>
              <div className="flex items-center gap-2 p-4 rounded-xl bg-admin-muted/30 border border-admin-border/50">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setQualityRating(i + 1)}
                      className="p-1 hover:scale-125 transition-all active:scale-95"
                    >
                      <Star 
                        className={cn(
                          "h-7 w-7 transition-colors",
                          i < qualityRating 
                            ? "text-amber-500 fill-amber-500" 
                            : "text-admin-muted-foreground/20"
                        )}
                      />
                    </button>
                  ))}
                </div>
                <div className="ml-auto h-10 w-10 rounded-full bg-admin-card flex items-center justify-center border border-admin-border shadow-sm">
                  <span className="text-lg font-bold text-admin-foreground">{qualityRating}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider text-admin-muted-foreground">
                {actionType === "approve" ? "Approval Notes (Optional)" : "Decision Feedback (Required)"}
              </Label>
              <Textarea
                placeholder={
                  actionType === "approve" 
                    ? "Internal notes for the production team..."
                    : actionType === "revision"
                    ? "Clearly explain what changes the designer needs to make..."
                    : "State the specific reasons for rejection..."
                }
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={5}
                className="rounded-xl border-admin-border focus:ring-2 focus:ring-admin-foreground/10 resize-none leading-relaxed"
              />
              <p className="text-[10px] text-admin-muted-foreground italic">
                * This feedback will be visible to the designer.
              </p>
            </div>

            {actionType === "approve" && selectedPublication && (
              <div className="p-4 rounded-xl bg-success/5 border border-success/20 space-y-2">
                <p className="text-xs font-bold text-success uppercase tracking-widest">Handoff Package Preview</p>
                <div className="grid grid-cols-2 gap-4 text-[11px] text-admin-muted-foreground">
                  <div className="flex flex-col gap-1">
                    <span className="uppercase">Designer ID</span>
                    <span className="font-mono font-bold text-admin-foreground">{selectedPublication.portfolio?.designer?.user_id?.slice(0,8)}...</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="uppercase">Rev Share</span>
                    <span className="font-bold text-admin-foreground">{selectedPublication.designer_revenue_share || RANKS[selectedPublication.portfolio?.designer?.rank_id as RankTier]?.revenueShare || 20}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 pt-0 border-t border-admin-border bg-admin-muted/30 flex-row items-center gap-3">
            <Button variant="ghost" onClick={() => setActionType(null)} className="flex-1 h-11 font-medium hover:bg-admin-card">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!selectedPublication || !actionType) return;
                if ((actionType === "revision" || actionType === "reject") && !actionNotes.trim()) {
                  toast.error("Notes are required");
                  return;
                }
                decisionMutation.mutate({
                  publicationId: selectedPublication.id,
                  decision: actionType === "revision" ? "revision_requested" : actionType,
                  notes: actionNotes,
                  rating: qualityRating,
                });
              }}
              disabled={decisionMutation.isPending}
              className={cn(
                "flex-[2] h-11 font-bold transition-all active:scale-[0.98] shadow-md",
                actionType === "approve" && "bg-success hover:bg-success/90",
                actionType === "reject" && "bg-destructive hover:bg-destructive/90",
                actionType === "revision" && "bg-admin-foreground text-admin-background hover:bg-admin-foreground/90"
              )}
            >
              {decisionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {actionType === "approve" && "Confirm & Approve"}
                  {actionType === "revision" && "Request Revisions"}
                  {actionType === "reject" && "Confirm Rejection"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-2xl border-admin-border p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 border-b border-admin-border bg-admin-muted/30">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold text-admin-foreground">Publication History</DialogTitle>
                <DialogDescription className="text-sm font-medium">
                  {selectedPublication?.portfolio?.title}
                </DialogDescription>
              </div>
              <div className="h-10 w-10 rounded-full bg-admin-card flex items-center justify-center border border-admin-border">
                <History className="h-5 w-5 text-admin-muted-foreground" />
              </div>
            </div>
          </DialogHeader>

          <div className="p-0 bg-admin-card">
            <ScrollArea className="h-[450px]">
              {reviews?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                  <History className="h-12 w-12 mb-4" />
                  <p className="font-medium">No history records found</p>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {reviews?.map((review: any, idx: number) => (
                    <div key={review.id} className="relative flex gap-4">
                      {idx !== reviews.length - 1 && (
                        <div className="absolute left-4.5 top-10 bottom-0 w-0.5 bg-admin-border" />
                      )}
                      <div className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10",
                        review.action === "approved" ? "bg-success text-white" :
                        review.action === "rejected" ? "bg-destructive text-white" :
                        "bg-warning text-white"
                      )}>
                        {review.action === "approved" && <Check className="h-5 w-5" />}
                        {review.action === "rejected" && <X className="h-5 w-5" />}
                        {review.action === "revision_requested" && <AlertCircle className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-admin-foreground uppercase tracking-wider">
                            {review.action.replace("_", " ")}
                          </p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-admin-muted-foreground bg-admin-muted/50 px-2 py-1 rounded">
                            {format(new Date(review.created_at), "MMM d, HH:mm")}
                          </span>
                        </div>
                        <div className="p-4 rounded-xl bg-admin-muted/30 border border-admin-border/50 leading-relaxed">
                          <p className="text-sm text-admin-foreground">{review.notes || "No notes provided."}</p>
                          {review.quality_rating && (
                            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-admin-border/30">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i}
                                  className={cn(
                                    "h-3 w-3",
                                    i < review.quality_rating ? "text-amber-500 fill-amber-500" : "text-admin-muted-foreground/20"
                                  )}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          <DialogFooter className="p-4 border-t border-admin-border bg-admin-muted/30">
            <Button variant="ghost" onClick={() => setShowHistoryModal(false)} className="w-full h-10 font-bold hover:bg-admin-card">
              Close History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revenue Override Dialog */}
      <Dialog open={showRevenueModal} onOpenChange={setShowRevenueModal}>
        <DialogContent className="max-w-sm border-admin-border shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-admin-border bg-admin-muted/30">
            <DialogTitle className="text-xl font-bold text-admin-foreground">Revenue Override</DialogTitle>
            <DialogDescription className="text-xs font-medium mt-1">
              Adjust revenue share for superadmin operations.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-admin-muted-foreground">New Percentage</Label>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-admin-muted/30 border border-admin-border/50">
                <Percent className="h-5 w-5 text-success" />
                <Input
                  type="number"
                  min={10}
                  max={60}
                  value={revenueOverride || ""}
                  onChange={(e) => setRevenueOverride(parseInt(e.target.value) || null)}
                  className="h-10 text-lg font-bold bg-admin-card border-admin-border focus:ring-2 focus:ring-success/20"
                />
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-admin-muted text-admin-muted-foreground font-black">%</div>
              </div>
              <p className="text-[10px] text-admin-muted-foreground italic leading-relaxed">
                Standard range: 10-50% based on designer rank. Overriding will bypass rank-based calculations for this publication.
              </p>
            </div>
          </div>

          <DialogFooter className="p-6 pt-0 border-t border-admin-border bg-admin-muted/30 flex-row items-center gap-3">
            <Button variant="ghost" onClick={() => setShowRevenueModal(false)} className="flex-1 h-11 font-medium hover:bg-admin-card">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!selectedPublication || !revenueOverride) return;
                revenueOverrideMutation.mutate({
                  publicationId: selectedPublication.id,
                  share: revenueOverride,
                });
              }}
              disabled={revenueOverrideMutation.isPending || !revenueOverride}
              className="flex-[2] h-11 font-bold bg-admin-foreground text-admin-background hover:bg-admin-foreground/90 transition-all shadow-md"
            >
              {revenueOverrideMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply Override"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
