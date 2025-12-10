import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusTab, setStatusTab] = useState("all");
  
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

  // Filter publications
  const filteredPublications = publications?.filter((pub: any) => {
    const title = pub.portfolio?.title?.toLowerCase() || "";
    const designerName = pub.portfolio?.designer?.name?.toLowerCase() || "";
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || 
                         designerName.includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const pendingCount = publications?.filter((p: any) => p.decision === "pending").length || 0;
  const approvedCount = publications?.filter((p: any) => p.decision === "approved").length || 0;
  const rejectedCount = publications?.filter((p: any) => p.decision === "rejected").length || 0;
  const revisionCount = publications?.filter((p: any) => p.decision === "revision_requested").length || 0;

  return (
    <AdminLayout userRole="superadmin">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Publication Queue
            </h1>
            <p className="text-muted-foreground mt-1">
              Review designer submissions and manage marketplace pipeline
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{revisionCount}</p>
                  <p className="text-sm text-muted-foreground">Revisions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{rejectedCount}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by title or designer..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="stylebox">StyleBox</SelectItem>
              <SelectItem value="walkthrough">Walkthrough</SelectItem>
              <SelectItem value="independent">Independent</SelectItem>
              <SelectItem value="portfolio">Portfolio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={statusTab} onValueChange={setStatusTab} className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-admin-wine data-[state=active]:text-admin-wine-foreground gap-2"
            >
              All
              <Badge variant="outline" className="text-xs px-1.5">
                {publications?.length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="data-[state=active]:bg-admin-wine data-[state=active]:text-admin-wine-foreground gap-2"
            >
              Pending
              <Badge variant="outline" className="text-xs px-1.5">{pendingCount}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="revision"
              className="data-[state=active]:bg-admin-wine data-[state=active]:text-admin-wine-foreground gap-2"
            >
              Revisions
              <Badge variant="outline" className="text-xs px-1.5">{revisionCount}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="approved"
              className="data-[state=active]:bg-admin-wine data-[state=active]:text-admin-wine-foreground gap-2"
            >
              Approved
              <Badge variant="outline" className="text-xs px-1.5">{approvedCount}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="production"
              className="data-[state=active]:bg-admin-wine data-[state=active]:text-admin-wine-foreground gap-2"
            >
              In Production
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusTab} className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-24 bg-muted/50 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))
            ) : filteredPublications?.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileSearch className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No publications found</p>
                </CardContent>
              </Card>
            ) : (
              filteredPublications?.map((pub: any) => {
                const portfolio = pub.portfolio;
                const designer = portfolio?.designer;
                const rankInfo = designer?.rank_id ? RANKS[designer.rank_id as RankTier] : null;
                
                return (
                  <Card key={pub.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        {/* Content */}
                        <div className="flex-1 p-5">
                          <div className="flex flex-col gap-4">
                            {/* Header Row */}
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-display text-xl font-semibold">
                                    {portfolio?.title || "Untitled"}
                                  </h3>
                                  <Badge variant="outline" className="text-xs">
                                    {sourceTypeLabels[pub.source_type] || pub.source_type}
                                  </Badge>
                                  <Badge 
                                    variant="outline"
                                    className={cn(decisionColors[pub.decision])}
                                  >
                                    {pub.decision === "revision_requested" ? "Revision Requested" : pub.decision}
                                  </Badge>
                                  {pub.marketplace_status && (
                                    <Badge 
                                      variant="outline"
                                      className={cn(marketplaceStatusColors[pub.marketplace_status])}
                                    >
                                      {marketplaceStatusLabels[pub.marketplace_status]}
                                    </Badge>
                                  )}
                                  {pub.locked_at && (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {portfolio?.description}
                                </p>
                              </div>

                              {/* Quality Rating */}
                              {pub.quality_rating && (
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i}
                                      className={cn(
                                        "h-4 w-4",
                                        i < pub.quality_rating 
                                          ? "text-amber-500 fill-amber-500" 
                                          : "text-muted-foreground/30"
                                      )}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Designer Info */}
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={designer?.avatar_url || undefined} />
                                <AvatarFallback>
                                  {designer?.name?.slice(0, 2) || "??"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{designer?.name || "Unknown Designer"}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Crown className="h-3 w-3" />
                                  <span>{rankInfo?.name || "Unranked"}</span>
                                  <span>•</span>
                                  <Percent className="h-3 w-3" />
                                  <span>
                                    {pub.designer_revenue_share || rankInfo?.revenueShare || 20}% share
                                    {pub.revenue_override && " (override)"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                Submitted {format(new Date(pub.submitted_at), "MMM d, yyyy")}
                              </div>
                              {pub.reviewed_at && (
                                <div className="flex items-center gap-1.5">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Reviewed {format(new Date(pub.reviewed_at), "MMM d, yyyy")}
                                </div>
                              )}
                            </div>

                            {/* Decision Notes */}
                            {pub.decision_notes && pub.decision !== "pending" && (
                              <div className={cn(
                                "p-3 rounded-lg border",
                                pub.decision === "rejected" 
                                  ? "bg-destructive/5 border-destructive/20"
                                  : pub.decision === "revision_requested"
                                  ? "bg-orange-500/5 border-orange-500/20"
                                  : "bg-success/5 border-success/20"
                              )}>
                                <p className="text-sm">
                                  <strong>Admin Notes:</strong> {pub.decision_notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex lg:flex-col gap-2 p-4 lg:p-5 lg:border-l bg-muted/30 lg:w-48">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1.5 flex-1 lg:flex-none"
                            onClick={() => {
                              setSelectedPublication(pub);
                              setShowHistoryModal(true);
                            }}
                          >
                            <History className="h-4 w-4" />
                            History
                          </Button>
                          
                          {(pub.decision === "pending" || pub.decision === "revision_requested") && (
                            <>
                              <Button 
                                size="sm" 
                                className="gap-1.5 bg-success hover:bg-success/90 flex-1 lg:flex-none"
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
                                className="gap-1.5 text-warning border-warning/30 hover:bg-warning/10 flex-1 lg:flex-none"
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
                                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 flex-1 lg:flex-none"
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
                              className="gap-1.5 flex-1 lg:flex-none"
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
                            <div className="text-xs text-center text-muted-foreground mt-2 lg:mt-auto">
                              Status synced from Marketplace
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Decision Dialog */}
      <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "Approve for Marketplace"}
              {actionType === "revision" && "Request Revision"}
              {actionType === "reject" && "Reject Submission"}
            </DialogTitle>
            <DialogDescription>
              {selectedPublication && (
                <span>
                  {actionType === "approve" && `Approve "${selectedPublication.portfolio?.title}" for Marketplace production pipeline.`}
                  {actionType === "revision" && `Request changes for "${selectedPublication.portfolio?.title}".`}
                  {actionType === "reject" && `Reject "${selectedPublication.portfolio?.title}". This will notify the designer.`}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Quality Rating */}
            <div className="space-y-2">
              <Label>Quality Rating</Label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setQualityRating(i + 1)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={cn(
                        "h-6 w-6",
                        i < qualityRating 
                          ? "text-amber-500 fill-amber-500" 
                          : "text-muted-foreground/30"
                      )}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {qualityRating}/5
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>
                {actionType === "approve" ? "Approval Notes (Optional)" : "Notes (Required)"}
              </Label>
              <Textarea
                placeholder={
                  actionType === "approve" 
                    ? "Any notes for the production team..."
                    : actionType === "revision"
                    ? "Explain what changes are needed..."
                    : "Explain why this submission is being rejected..."
                }
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={4}
              />
            </div>

            {actionType === "approve" && selectedPublication && (
              <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                <p className="text-sm text-success">
                  <strong>Marketplace Package will include:</strong>
                </p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <li>• Design files and metadata</li>
                  <li>• Designer ID: {selectedPublication.portfolio?.designer?.user_id}</li>
                  <li>• Revenue share: {selectedPublication.designer_revenue_share || RANKS[selectedPublication.portfolio?.designer?.rank_id as RankTier]?.revenueShare || 20}%</li>
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
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
                actionType === "approve" && "bg-success hover:bg-success/90",
                actionType === "reject" && "bg-destructive hover:bg-destructive/90"
              )}
            >
              {decisionMutation.isPending ? "Processing..." : (
                <>
                  {actionType === "approve" && "Approve & Send to Marketplace"}
                  {actionType === "revision" && "Request Revision"}
                  {actionType === "reject" && "Reject Submission"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review History</DialogTitle>
            <DialogDescription>
              {selectedPublication?.portfolio?.title}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-96">
            {reviews?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No review history yet
              </p>
            ) : (
              <div className="space-y-4">
                {reviews?.map((review: any) => (
                  <div key={review.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                      review.action === "approved" && "bg-success/10 text-success",
                      review.action === "rejected" && "bg-destructive/10 text-destructive",
                      review.action === "revision_requested" && "bg-orange-500/10 text-orange-500"
                    )}>
                      {review.action === "approved" && <Check className="h-4 w-4" />}
                      {review.action === "rejected" && <X className="h-4 w-4" />}
                      {review.action === "revision_requested" && <AlertCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium capitalize">{review.action.replace("_", " ")}</p>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(review.created_at), "MMM d, yyyy h:mm a")}
                        </span>
                      </div>
                      {review.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{review.notes}</p>
                      )}
                      {review.quality_rating && (
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i}
                              className={cn(
                                "h-3 w-3",
                                i < review.quality_rating 
                                  ? "text-amber-500 fill-amber-500" 
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Revenue Override Dialog */}
      <Dialog open={showRevenueModal} onOpenChange={setShowRevenueModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revenue Share Override</DialogTitle>
            <DialogDescription>
              Manually set the designer revenue share for this publication.
              This is a superadmin-only action.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Revenue Share Percentage</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={10}
                  max={60}
                  value={revenueOverride || ""}
                  onChange={(e) => setRevenueOverride(parseInt(e.target.value) || null)}
                  className="w-24"
                />
                <span className="text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Standard range: 10-50% based on designer rank
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevenueModal(false)}>
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
              className="bg-admin-wine hover:bg-admin-wine/90"
            >
              {revenueOverrideMutation.isPending ? "Saving..." : "Apply Override"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
