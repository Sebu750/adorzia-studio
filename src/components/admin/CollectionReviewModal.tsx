import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  FileImage,
  Download,
  ExternalLink,
  Calendar,
  User,
  Folder,
  MessageSquare,
  Lightbulb,
} from "lucide-react";
import { format } from "date-fns";

interface CollectionSubmission {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  designer_id: string;
  files: any[];
  thumbnail_url: string | null;
  concept_notes: string | null;
  inspiration: string | null;
  admin_feedback: string | null;
  designer?: {
    name: string | null;
    avatar_url: string | null;
    email: string | null;
  };
}

interface CollectionReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: CollectionSubmission | null;
  onStatusUpdate: (id: string, status: string, feedback?: string) => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-admin-muted text-admin-muted-foreground" },
  pending: { label: "Pending Review", color: "bg-warning/10 text-warning" },
  approved: { label: "Approved", color: "bg-success/10 text-success" },
  revisions_required: { label: "Revisions Required", color: "bg-orange-500/10 text-orange-500" },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive" },
};

export function CollectionReviewModal({
  open,
  onOpenChange,
  submission,
  onStatusUpdate,
}: CollectionReviewModalProps) {
  const [feedback, setFeedback] = useState("");
  const [activeAction, setActiveAction] = useState<string | null>(null);

  if (!submission) return null;

  const status = statusConfig[submission.status] || statusConfig.draft;

  const handleAction = (action: string) => {
    if (action === "approved") {
      onStatusUpdate(submission.id, "approved", feedback || undefined);
    } else if (action === "revisions_required" || action === "rejected") {
      if (!feedback.trim()) {
        setActiveAction(action);
        return;
      }
      onStatusUpdate(submission.id, action, feedback);
    }
    setFeedback("");
    setActiveAction(null);
  };

  const handleSubmitWithFeedback = () => {
    if (activeAction && feedback.trim()) {
      onStatusUpdate(submission.id, activeAction, feedback);
      setFeedback("");
      setActiveAction(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-admin-card border-admin-border p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-admin-border">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-xl text-admin-foreground">
                {submission.title}
              </DialogTitle>
              <DialogDescription className="text-admin-muted-foreground">
                Collection submission review
              </DialogDescription>
            </div>
            <Badge className={status.color}>{status.label}</Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 space-y-6">
            {/* Designer Info */}
            <div className="flex items-center gap-4 p-4 bg-admin-muted/30 rounded-xl">
              <Avatar className="h-12 w-12">
                <AvatarImage src={submission.designer?.avatar_url || undefined} />
                <AvatarFallback className="bg-admin-foreground text-admin-background">
                  {submission.designer?.name?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-admin-foreground">
                  {submission.designer?.name || "Unknown Designer"}
                </p>
                <p className="text-sm text-admin-muted-foreground">
                  {submission.designer?.email}
                </p>
              </div>
              <div className="text-right text-sm text-admin-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Submitted {submission.submitted_at 
                    ? format(new Date(submission.submitted_at), "MMM d, yyyy")
                    : format(new Date(submission.created_at), "MMM d, yyyy")}
                </div>
              </div>
            </div>

            {/* Tabs for Details */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-admin-muted border border-admin-border">
                <TabsTrigger value="details" className="data-[state=active]:bg-admin-card">
                  Details
                </TabsTrigger>
                <TabsTrigger value="files" className="data-[state=active]:bg-admin-card">
                  Files ({submission.files?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-admin-card">
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-admin-muted-foreground text-xs uppercase tracking-wider">
                      Category
                    </Label>
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-admin-muted-foreground" />
                      <Badge variant="outline" className="capitalize border-admin-border text-admin-foreground">
                        {submission.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-admin-muted-foreground text-xs uppercase tracking-wider">
                      Status
                    </Label>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                </div>

                {submission.description && (
                  <div className="space-y-2">
                    <Label className="text-admin-muted-foreground text-xs uppercase tracking-wider">
                      Description
                    </Label>
                    <p className="text-admin-foreground bg-admin-muted/30 p-3 rounded-lg">
                      {submission.description}
                    </p>
                  </div>
                )}

                {submission.inspiration && (
                  <div className="space-y-2">
                    <Label className="text-admin-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Inspiration
                    </Label>
                    <p className="text-admin-foreground bg-admin-muted/30 p-3 rounded-lg">
                      {submission.inspiration}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="files" className="mt-4">
                {submission.files && submission.files.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {submission.files.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="group relative aspect-square bg-admin-muted rounded-xl overflow-hidden border border-admin-border"
                      >
                        {file.url && (file.type?.startsWith('image/') || file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) ? (
                          <img
                            src={file.url}
                            alt={file.name || `File ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-admin-muted-foreground">
                            <FileImage className="h-10 w-10" />
                            <span className="text-xs text-center px-2 truncate max-w-full">
                              {file.name || `File ${index + 1}`}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-admin-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {file.url && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="gap-1"
                              onClick={() => window.open(file.url, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-admin-muted-foreground">
                    <FileImage className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No files uploaded</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notes" className="mt-4 space-y-4">
                {submission.concept_notes && (
                  <div className="space-y-2">
                    <Label className="text-admin-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Concept Notes
                    </Label>
                    <p className="text-admin-foreground bg-admin-muted/30 p-3 rounded-lg whitespace-pre-wrap">
                      {submission.concept_notes}
                    </p>
                  </div>
                )}

                {submission.admin_feedback && (
                  <div className="space-y-2">
                    <Label className="text-admin-muted-foreground text-xs uppercase tracking-wider">
                      Previous Admin Feedback
                    </Label>
                    <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg">
                      <p className="text-admin-foreground whitespace-pre-wrap">
                        {submission.admin_feedback}
                      </p>
                    </div>
                  </div>
                )}

                {!submission.concept_notes && !submission.admin_feedback && (
                  <div className="text-center py-8 text-admin-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No notes available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Feedback Input */}
            {submission.status === "pending" && (
              <>
                <Separator className="bg-admin-border" />
                <div className="space-y-3">
                  <Label className="text-admin-foreground">
                    Admin Feedback {activeAction && "(Required for this action)"}
                  </Label>
                  <Textarea
                    placeholder="Enter feedback for the designer..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[100px] bg-admin-muted border-admin-border text-admin-foreground"
                  />
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        {submission.status === "pending" && (
          <div className="p-6 pt-4 border-t border-admin-border">
            {activeAction ? (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveAction(null);
                    setFeedback("");
                  }}
                  className="border-admin-border text-admin-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitWithFeedback}
                  disabled={!feedback.trim()}
                  className={activeAction === "rejected" 
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                    : "bg-orange-500 text-white hover:bg-orange-600"}
                >
                  {activeAction === "rejected" ? "Confirm Rejection" : "Request Revisions"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleAction("approved")}
                  className="gap-2 bg-success text-success-foreground hover:bg-success/90"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleAction("revisions_required")}
                  variant="outline"
                  className="gap-2 border-orange-500 text-orange-500 hover:bg-orange-500/10"
                >
                  <RotateCcw className="h-4 w-4" />
                  Request Revisions
                </Button>
                <Button
                  onClick={() => handleAction("rejected")}
                  variant="outline"
                  className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
