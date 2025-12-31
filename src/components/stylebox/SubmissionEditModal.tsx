import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Save, X, Plus, Link2, Trash2 } from "lucide-react";

interface Submission {
  id: string;
  description?: string | null;
  submission_files?: string[] | null;
  status: string;
}

interface SubmissionEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: Submission | null;
  styleboxId: string;
}

export function SubmissionEditModal({ 
  open, 
  onOpenChange, 
  submission,
  styleboxId
}: SubmissionEditModalProps) {
  const queryClient = useQueryClient();
  
  const [description, setDescription] = useState("");
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [newFileUrl, setNewFileUrl] = useState("");

  useEffect(() => {
    if (submission) {
      setDescription(submission.description || "");
      setFileUrls(submission.submission_files || []);
    }
  }, [submission]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!submission?.id) throw new Error("No submission ID");

      const { error } = await supabase
        .from("stylebox_submissions")
        .update({
          description: description || null,
          submission_files: fileUrls.length > 0 ? fileUrls : null,
        })
        .eq("id", submission.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Submission updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["stylebox-submissions", styleboxId] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to update submission: " + error.message);
    },
  });

  const handleAddFileUrl = () => {
    if (newFileUrl.trim() && !fileUrls.includes(newFileUrl.trim())) {
      setFileUrls([...fileUrls, newFileUrl.trim()]);
      setNewFileUrl("");
    }
  };

  const handleRemoveFileUrl = (index: number) => {
    setFileUrls(fileUrls.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFileUrl();
    }
  };

  const canEdit = submission?.status === "submitted" || submission?.status === "revision_requested";

  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Submission</DialogTitle>
          <DialogDescription>
            {canEdit 
              ? "Update your submission details and files"
              : "This submission cannot be edited in its current status"
            }
          </DialogDescription>
        </DialogHeader>

        {!canEdit ? (
          <div className="py-8 text-center">
            <Badge variant="secondary" className="mb-4">
              Status: {submission.status}
            </Badge>
            <p className="text-muted-foreground">
              Only submissions with "submitted" or "revision requested" status can be edited.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6 py-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={submission.status === "revision_requested" ? "warning" : "secondary"}>
                  {submission.status.replace("_", " ")}
                </Badge>
              </div>

              {/* Description / Notes */}
              <div className="space-y-2">
                <Label htmlFor="description">Notes / Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add notes about your submission..."
                  rows={4}
                />
              </div>

              {/* File URLs */}
              <div className="space-y-3">
                <Label>Submission Files</Label>
                <div className="flex gap-2">
                  <Input
                    value={newFileUrl}
                    onChange={(e) => setNewFileUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste file URL..."
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleAddFileUrl}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {fileUrls.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {fileUrls.map((url, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border text-sm"
                      >
                        <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="flex-1 truncate text-muted-foreground">{url}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveFileUrl(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Add URLs to your design files (Google Drive, Dropbox, etc.)
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={() => saveMutation.mutate()} 
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
