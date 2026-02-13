import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Clock, 
  FileText, 
  History, 
  ShieldAlert, 
  UserCheck,
  Eye,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Submitted", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: FileText },
  under_review: { label: "Under Review", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
  revisions_required: { label: "Feedback Sent", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: MessageSquare },
  approved: { label: "Approved", color: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

const AdminFoundingReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAdminAuth();
  
  const [submission, setSubmission] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [feedback, setFeedback] = React.useState("");
  const [internalNotes, setInternalNotes] = React.useState("");
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [isApproving, setIsApproving] = React.useState(false);
  const [isRejecting, setIsRejecting] = React.useState(false);
  const [selectedTier, setSelectedTier] = React.useState("standard");
  const [assignTitle, setAssignTitle] = React.useState(true);
  const [activeArticleIdx, setActiveArticleIdx] = React.useState(0);

  const fetchSubmission = async () => {
    if (!id) {
      console.error("No ID provided in URL params");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      console.log("Fetching submission with ID:", id);
      
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log("Current admin session:", currentSession ? "Active" : "None");
      
      if (!currentSession) {
        console.warn("No active admin session found during fetch");
      }

      // 1. Fetch submission details
      const { data: subData, error: subError } = await supabase
        .from("founding_designers_submissions")
        .select("*")
        .eq("id", id.trim())
        .maybeSingle();

      if (subError) {
        console.error("Supabase error fetching submission:", subError);
        throw subError;
      }
      
      if (!subData) {
        console.error("No submission found for ID:", id);
        // Fallback: try fetching all and finding it locally to see if it's a query filter issue
        const { data: allSubs } = await supabase.from("founding_designers_submissions").select("id").limit(10);
        console.log("Existing IDs in DB (sample):", allSubs?.map(s => s.id));
        
        setSubmission(null);
        return;
      }

      console.log("Submission found:", subData.collection_name);

      // 2. Fetch designer profile separately to avoid join issues
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name, email, avatar_url, brand_name, is_founding_designer")
        .eq("user_id", subData.designer_id)
        .maybeSingle();

      if (profileError) {
        console.warn("Error fetching designer profile:", profileError);
      }

      const enrichedData = {
        ...subData,
        designer: profileData || null
      };

      setSubmission(enrichedData);
      setFeedback(subData.admin_feedback || "");
      setInternalNotes(subData.internal_notes || "");
    } catch (error: any) {
      console.error("Error in fetchSubmission:", error);
      toast.error(error.message || "Failed to load submission details");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSubmission();
  }, [id]);

  const handleAction = async (action: string) => {
    try {
      console.log(`Invoking 'manage-founding' for action: ${action}`);
      const { data, error } = await supabase.functions.invoke('manage-founding', {
        body: {
          action,
          submissionId: id,
          designerId: submission.designer_id,
          feedback,
          internalNotes,
          rejectionReason: action === 'reject' ? rejectionReason : undefined,
          tier: selectedTier,
          assignTitle
        }
      });

      if (error) {
        console.error("Edge function error returned:", error);
        throw new Error(error.message || "Edge function failed to process request");
      }
      
      // Show success message from backend if available
      const successMessage = data?.message || `Action '${action}' completed successfully`;
      toast.success(successMessage);
      setIsApproving(false);
      setIsRejecting(false);
      fetchSubmission();
    } catch (error: any) {
      console.error("Action error:", error);
      toast.error(error.message || "Failed to process request");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!submission) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-bold">Submission Not Found</h2>
          <Button variant="link" onClick={() => navigate("/admin/founding-submissions")}>
            Back to Overview
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const status = statusConfig[submission.status] || statusConfig.pending;
  const articles = submission.articles || [];
  const currentArticle = articles[activeArticleIdx];

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="-ml-2 text-admin-muted-foreground hover:text-admin-foreground"
              onClick={() => navigate("/admin/founding-submissions")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Overview
            </Button>
            <h1 className="text-3xl font-display font-bold tracking-tight">{submission.collection_name}</h1>
            <div className="flex items-center gap-2 text-sm text-admin-muted-foreground">
              <span className="font-medium text-admin-foreground">{submission.designer?.name}</span>
              <span>·</span>
              <span>{submission.designer?.brand_name || "Independent"}</span>
              <Badge className={cn("ml-2 border", status.color)}>
                <status.icon className="h-3 w-3 mr-1" /> {status.label}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-admin-border"
              onClick={() => handleAction('feedback')}
            >
              <MessageSquare className="h-4 w-4 mr-2" /> Send Feedback
            </Button>
            <Button 
              variant="outline" 
              className="text-destructive border-destructive/20 hover:bg-destructive/10"
              onClick={() => setIsRejecting(true)}
              disabled={submission.status === 'rejected'}
            >
              <XCircle className="h-4 w-4 mr-2" /> Reject
            </Button>
            <Button 
              className="bg-success text-success-foreground hover:bg-success/90"
              onClick={() => setIsApproving(true)}
              disabled={submission.status === 'approved'}
            >
              <CheckCircle className="h-4 w-4 mr-2" /> Approve
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Review Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Overview Card */}
            <Card className="bg-admin-card border-admin-border">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-admin-muted-foreground font-bold">Collection Identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-admin-muted-foreground">Description</Label>
                      <p className="text-sm leading-relaxed">{submission.design_philosophy}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-admin-muted-foreground">Category</Label>
                        <p className="text-sm capitalize">{submission.primary_category}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-admin-muted-foreground">Seasonal Launch</Label>
                        <p className="text-sm capitalize">{submission.target_seasonal_launch.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-admin-muted-foreground">Designer Vision Statement</Label>
                    <div className="p-4 rounded-lg bg-admin-muted/20 border border-admin-border italic text-sm leading-relaxed">
                      "{submission.designer_vision_statement}"
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles Explorer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Articles Review ({articles.length})</h3>
                <div className="flex gap-1">
                  {articles.map((_: any, i: number) => (
                    <button 
                      key={i}
                      onClick={() => setActiveArticleIdx(i)}
                      className={cn(
                        "h-2 w-8 rounded-full transition-all",
                        activeArticleIdx === i ? "bg-primary" : "bg-admin-border hover:bg-admin-muted"
                      )}
                    />
                  ))}
                </div>
              </div>

              {currentArticle ? (
                <Card className="bg-admin-card border-admin-border overflow-hidden">
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Article Image Gallery */}
                    <div className="md:w-1/2 bg-admin-muted/30 border-r border-admin-border p-6 flex flex-col gap-4">
                      <div className="aspect-[4/5] rounded-xl overflow-hidden border border-admin-border bg-white relative group">
                        <img 
                          src={currentArticle.images?.[0] || "/placeholder.svg"} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Button variant="secondary" size="sm" className="gap-2">
                            <ExternalLink className="h-4 w-4" /> View Full Size
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {currentArticle.images?.map((img: string, i: number) => (
                          <div key={i} className="aspect-square rounded-lg border border-admin-border overflow-hidden bg-white cursor-pointer hover:ring-2 ring-primary transition-all">
                            <img src={img} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Article Details */}
                    <div className="md:w-1/2 p-8 space-y-8 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-2xl font-bold">{currentArticle.name}</h4>
                          <Badge variant="outline" className="border-admin-border capitalize">{currentArticle.category}</Badge>
                        </div>
                        <p className="text-2xl font-display font-bold text-success">${currentArticle.estimated_price}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-admin-muted-foreground">Fabric / Material</Label>
                          <p className="text-sm font-medium">{currentArticle.fabric_material}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-admin-muted-foreground">Color(s)</Label>
                          <p className="text-sm font-medium">{currentArticle.colors}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-admin-muted-foreground">Size Range</Label>
                          <p className="text-sm font-medium">{currentArticle.size_range}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-admin-muted-foreground">Production Timeline</Label>
                          <p className="text-sm font-medium">{currentArticle.timeline}</p>
                        </div>
                      </div>

                      <div className="space-y-2 flex-1">
                        <Label className="text-[10px] uppercase text-admin-muted-foreground">Description</Label>
                        <p className="text-sm leading-relaxed text-admin-muted-foreground">{currentArticle.description}</p>
                      </div>

                      <div className="flex justify-between pt-4 border-t border-admin-border">
                        <Button 
                          variant="ghost" 
                          disabled={activeArticleIdx === 0}
                          onClick={() => setActiveArticleIdx(prev => prev - 1)}
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                        </Button>
                        <Button 
                          variant="ghost"
                          disabled={activeArticleIdx === articles.length - 1}
                          onClick={() => setActiveArticleIdx(prev => prev + 1)}
                        >
                          Next <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="p-12 text-center bg-admin-muted/10 border-2 border-dashed border-admin-border rounded-xl">
                  <AlertCircle className="h-12 w-12 mx-auto text-admin-muted-foreground opacity-30 mb-4" />
                  <p className="text-admin-muted-foreground font-medium">Incomplete Submission: No articles found.</p>
                </div>
              )}
            </div>

            {/* Audit Log */}
            <Card className="bg-admin-card border-admin-border">
              <CardHeader className="flex flex-row items-center gap-2">
                <History className="h-4 w-4 text-admin-muted-foreground" />
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-admin-muted-foreground">Audit Log & Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 text-sm">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold">Initial Submission</p>
                      <p className="text-xs text-admin-muted-foreground">{format(new Date(submission.created_at), "MMM d, yyyy · HH:mm")}</p>
                    </div>
                  </div>
                  {submission.status_history?.map((log: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 text-sm border-l-2 border-admin-border ml-1 pl-4 pb-4">
                      <div className="flex-1">
                        <p className="font-bold capitalize">Status: {log.to.replace('_', ' ')}</p>
                        <p className="text-xs text-admin-muted-foreground">
                          {format(new Date(log.timestamp), "MMM d, yyyy · HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Designer Snapshot */}
            <Card className="bg-admin-card border-admin-border">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-admin-muted-foreground font-bold">Designer Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-admin-border">
                    <AvatarImage src={submission.designer?.avatar_url} />
                    <AvatarFallback>{submission.designer?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-admin-foreground leading-tight">{submission.designer?.name}</p>
                    <p className="text-xs text-admin-muted-foreground">{submission.designer?.email}</p>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[10px] uppercase font-bold">
                    <span className="text-admin-muted-foreground">Profile Progress</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-admin-muted h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[85%]" />
                  </div>
                </div>
                <Separator className="bg-admin-border" />
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-admin-muted-foreground">Founding Title</span>
                    <Badge variant={submission.designer?.is_founding_designer ? "default" : "outline"} className="text-[10px]">
                      {submission.designer?.is_founding_designer ? "Assigned" : "Not Assigned"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-admin-muted-foreground">Previous Submissions</span>
                    <span className="font-bold">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Internal Notes */}
            <Card className="bg-admin-card border-admin-border shadow-sm ring-1 ring-primary/10">
              <CardHeader className="pb-3 flex flex-row items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold text-primary uppercase tracking-wider">Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Visible only to admin team..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="bg-admin-muted/30 border-admin-border text-xs min-h-[150px] resize-none"
                />
              </CardContent>
            </Card>

            {/* Feedback to Designer */}
            <Card className="bg-admin-card border-admin-border">
              <CardHeader className="pb-3 flex flex-row items-center gap-2">
                <MessageSquare className="h-4 w-4 text-admin-muted-foreground" />
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Feedback to Designer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Tell the designer what needs to be changed..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="bg-admin-muted/30 border-admin-border text-xs min-h-[150px] resize-none"
                />
                <p className="text-[10px] text-admin-muted-foreground leading-relaxed italic">
                  * Sending feedback will unlock the submission for editing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Approval Flow Dialog */}
      <Dialog open={isApproving} onOpenChange={setIsApproving}>
        <DialogContent className="max-w-md bg-admin-card border-admin-border text-admin-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <UserCheck className="h-5 w-5" />
              Confirm Approval
            </DialogTitle>
            <DialogDescription className="text-admin-muted-foreground">
              This will finalize the collection and promote the designer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
              <div className="space-y-1">
                <Label className="font-bold">Assign Founding Designer Title</Label>
                <p className="text-[10px] text-admin-muted-foreground">Displays official badge on public profile.</p>
              </div>
              <Switch checked={assignTitle} onCheckedChange={setAssignTitle} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-admin-muted-foreground">Select Payout Tier</Label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="bg-admin-muted border-admin-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-admin-card border-admin-border text-admin-foreground">
                  <SelectItem value="standard">Standard Founding (Default)</SelectItem>
                  <SelectItem value="f1">Tier F1 (Priority Visibility)</SelectItem>
                  <SelectItem value="f2">Tier F2 (Elite Splits)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsApproving(false)}>Cancel</Button>
            <Button className="bg-success text-success-foreground" onClick={() => handleAction('approve')}>
              Approve & Promote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Flow Dialog */}
      <Dialog open={isRejecting} onOpenChange={setIsRejecting}>
        <DialogContent className="max-w-md bg-admin-card border-admin-border text-admin-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Reject Submission
            </DialogTitle>
            <DialogDescription className="text-admin-muted-foreground">
              This action is irreversible and will lock the submission.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold">Rejection Reason <span className="text-destructive">*</span></Label>
              <Textarea 
                placeholder="Explain the decision..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-admin-muted border-admin-border min-h-[120px] text-xs"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRejecting(false)}>Cancel</Button>
            <Button 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
              onClick={() => handleAction('reject')}
              disabled={!rejectionReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminFoundingReview;
