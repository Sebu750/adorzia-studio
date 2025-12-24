import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  FileText,
  User,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  ExternalLink,
  Filter,
  Search,
  Loader2,
  Eye,
  RotateCcw,
  Box
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Submission = Database["public"]["Tables"]["stylebox_submissions"]["Row"];
type Stylebox = Database["public"]["Tables"]["styleboxes"]["Row"];

interface SubmissionWithDetails extends Submission {
  stylebox?: Stylebox;
  profile?: {
    name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
}

const statusColors: Record<string, string> = {
  submitted: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  approved: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-600 border-red-500/30",
};

export default function AdminStyleboxSubmissions() {
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithDetails | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterStylebox, setFilterStylebox] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Review form state
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected">("approved");
  const [reviewScore, setReviewScore] = useState<number>(75);
  const [reviewFeedback, setReviewFeedback] = useState("");

  // Fetch all submissions with related data
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin-stylebox-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stylebox_submissions")
        .select(`
          *,
          stylebox:styleboxes(id, title, difficulty, category),
          profile:profiles!stylebox_submissions_designer_id_fkey(name, email, avatar_url)
        `)
        .order("submitted_at", { ascending: false });
      
      if (error) throw error;
      return data as unknown as SubmissionWithDetails[];
    },
  });

  // Fetch all styleboxes for filter
  const { data: styleboxes } = useQuery({
    queryKey: ["admin-styleboxes-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("styleboxes")
        .select("id, title")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  // Review mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ submissionId, status, score }: { submissionId: string; status: string; score: number | null }) => {
      const { error } = await supabase
        .from("stylebox_submissions")
        .update({
          status: status as "submitted" | "approved" | "rejected",
          score: score,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submissionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Submission reviewed successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-stylebox-submissions"] });
      setReviewModalOpen(false);
      setSelectedSubmission(null);
      resetReviewForm();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const resetReviewForm = () => {
    setReviewAction("approved");
    setReviewScore(75);
    setReviewFeedback("");
  };

  const handleOpenReview = (submission: SubmissionWithDetails) => {
    setSelectedSubmission(submission);
    setReviewModalOpen(true);
    resetReviewForm();
  };

  const handleSubmitReview = () => {
    if (!selectedSubmission) return;
    
    reviewMutation.mutate({
      submissionId: selectedSubmission.id,
      status: reviewAction,
      score: reviewAction === "approved" ? reviewScore : null,
    });
  };

  // Filter submissions
  const filteredSubmissions = submissions?.filter((sub) => {
    if (filterStatus !== "all" && sub.status !== filterStatus) return false;
    if (filterStylebox !== "all" && sub.stylebox_id !== filterStylebox) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const designerName = sub.profile?.name?.toLowerCase() || "";
      const designerEmail = sub.profile?.email?.toLowerCase() || "";
      const styleboxTitle = sub.stylebox?.title?.toLowerCase() || "";
      if (!designerName.includes(query) && !designerEmail.includes(query) && !styleboxTitle.includes(query)) {
        return false;
      }
    }
    return true;
  });

  const pendingCount = submissions?.filter(s => s.status === "submitted").length || 0;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">StyleBox Submissions</h1>
            <p className="text-muted-foreground mt-1">
              Review and score designer submissions
            </p>
          </div>
          {pendingCount > 0 && (
            <Badge className="w-fit gap-1.5 bg-amber-500/20 text-amber-600 border-amber-500/30 py-1.5 px-3">
              <Clock className="h-4 w-4" />
              {pendingCount} Pending Review
            </Badge>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by designer or stylebox..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStylebox} onValueChange={setFilterStylebox}>
                <SelectTrigger className="w-[220px]">
                  <Box className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by StyleBox" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All StyleBoxes</SelectItem>
                  {styleboxes?.map((sb) => (
                    <SelectItem key={sb.id} value={sb.id}>
                      {sb.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSubmissions?.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Submissions Found</h3>
            <p className="text-muted-foreground">
              {filterStatus !== "all" || filterStylebox !== "all" || searchQuery
                ? "Try adjusting your filters"
                : "No submissions have been made yet"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubmissions?.map((submission) => (
              <Card 
                key={submission.id} 
                className={`hover:shadow-md transition-all cursor-pointer ${
                  submission.status === "submitted" ? "border-amber-500/30 bg-amber-500/5" : ""
                }`}
                onClick={() => handleOpenReview(submission)}
              >
                <CardContent className="p-5 space-y-4">
                  {/* StyleBox Info */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate text-sm">
                        {submission.stylebox?.title || "Unknown StyleBox"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {submission.stylebox?.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {submission.stylebox?.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={statusColors[submission.status]}>
                      {submission.status === "submitted" ? "Pending" : submission.status}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Designer Info */}
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {submission.profile?.name || "Unknown Designer"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {submission.profile?.email}
                      </p>
                    </div>
                  </div>

                  {/* Submission Details */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(submission.submitted_at), "MMM d, yyyy")}
                    </div>
                    {submission.score !== null && (
                      <div className="flex items-center gap-1.5 text-primary font-medium">
                        <Award className="h-3.5 w-3.5" />
                        Score: {submission.score}
                      </div>
                    )}
                  </div>

                  {/* Files Count */}
                  {submission.submission_files && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      {Array.isArray(submission.submission_files) 
                        ? submission.submission_files.length 
                        : 0} file(s) attached
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review Modal */}
        <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Review Submission
              </DialogTitle>
              <DialogDescription>
                {selectedSubmission?.stylebox?.title}
              </DialogDescription>
            </DialogHeader>

            {selectedSubmission && (
              <div className="space-y-6">
                {/* Designer Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Designer</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedSubmission.profile?.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{selectedSubmission.profile?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        Submitted {format(new Date(selectedSubmission.submitted_at), "PPP 'at' p")}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description / Hack Log */}
                {selectedSubmission.description && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Designer's Notes / Hack Log
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm whitespace-pre-wrap">{selectedSubmission.description}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Submitted Files */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Submitted Files</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    {Array.isArray(selectedSubmission.submission_files) && selectedSubmission.submission_files.length > 0 ? (
                      selectedSubmission.submission_files.map((url, idx) => (
                        <a
                          key={idx}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                        >
                          <FileText className="h-4 w-4 shrink-0" />
                          <span className="flex-1 truncate">{url as string}</span>
                          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </a>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No files attached</p>
                    )}
                  </CardContent>
                </Card>

                {/* Review Form */}
                {selectedSubmission.status === "submitted" && (
                  <Card className="border-primary/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Review Decision</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      {/* Action Selection */}
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant={reviewAction === "approved" ? "default" : "outline"}
                          className={`flex-1 gap-2 ${reviewAction === "approved" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                          onClick={() => setReviewAction("approved")}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant={reviewAction === "rejected" ? "destructive" : "outline"}
                          className="flex-1 gap-2"
                          onClick={() => setReviewAction("rejected")}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>

                      {/* Score Slider (only for approval) */}
                      {reviewAction === "approved" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Score</Label>
                            <span className="text-lg font-bold text-primary">{reviewScore}</span>
                          </div>
                          <Slider
                            value={[reviewScore]}
                            onValueChange={(v) => setReviewScore(v[0])}
                            min={1}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>1</span>
                            <span>50</span>
                            <span>100</span>
                          </div>
                        </div>
                      )}

                      {/* Feedback */}
                      <div className="space-y-2">
                        <Label htmlFor="feedback">Feedback (Optional)</Label>
                        <Textarea
                          id="feedback"
                          placeholder="Add feedback for the designer..."
                          value={reviewFeedback}
                          onChange={(e) => setReviewFeedback(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Already Reviewed */}
                {selectedSubmission.status !== "submitted" && (
                  <Card className={selectedSubmission.status === "approved" ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}>
                    <CardContent className="p-4 flex items-center gap-3">
                      {selectedSubmission.status === "approved" ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">
                          This submission has been {selectedSubmission.status}
                        </p>
                        {selectedSubmission.score !== null && (
                          <p className="text-sm text-muted-foreground">
                            Score: {selectedSubmission.score}
                          </p>
                        )}
                        {selectedSubmission.reviewed_at && (
                          <p className="text-sm text-muted-foreground">
                            Reviewed on {format(new Date(selectedSubmission.reviewed_at), "PPP")}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
                Cancel
              </Button>
              {selectedSubmission?.status === "submitted" && (
                <Button 
                  onClick={handleSubmitReview}
                  disabled={reviewMutation.isPending}
                  className={reviewAction === "approved" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  {reviewMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {reviewAction === "approved" ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Confirm {reviewAction === "approved" ? "Approval" : "Rejection"}
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
