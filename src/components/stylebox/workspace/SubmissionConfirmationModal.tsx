import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { StyleboxSubmission } from "@/types/designer-submissions";

interface SubmissionConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: StyleboxSubmission;
  styleboxTitle: string;
  darkroomMode: boolean;
  onSuccess: () => void;
}

export function SubmissionConfirmationModal({
  open,
  onOpenChange,
  submission,
  styleboxTitle,
  darkroomMode,
  onSuccess,
}: SubmissionConfirmationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Update submission status to 'submitted'
      const { error: updateError } = await supabase
        .from("stylebox_submissions")
        .update({
          status: "submitted",
          is_final: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", submission.id);

      if (updateError) throw updateError;

      // Call edge function to send email notification
      try {
        await supabase.functions.invoke("send-transactional", {
          body: {
            type: "stylebox_submission",
            to: "admin@adorzia.com", // Admin email
            data: {
              stylebox_title: styleboxTitle,
              submission_id: submission.id,
              designer_id: submission.designer_id,
              submitted_at: new Date().toISOString(),
            },
          },
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // Don't fail the submission if email fails
      }

      toast({
        title: "Submission successful!",
        description: "Your work has been submitted to Adorzia for review.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description: "Failed to submit your work. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = submission.completed_deliverables >= submission.total_deliverables;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-lg",
          darkroomMode
            ? "bg-[#1a1a1a] border-white/10 text-white"
            : "bg-white border-gray-200"
        )}
      >
        <DialogHeader>
          <DialogTitle
            className={cn(
              "text-xl font-bold uppercase tracking-wide",
              darkroomMode ? "text-white" : "text-gray-900"
            )}
          >
            Submit to Adorzia
          </DialogTitle>
          <DialogDescription
            className={cn(
              "text-sm",
              darkroomMode ? "text-white/60" : "text-gray-600"
            )}
          >
            Review your submission checklist before finalizing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* StyleBox Info */}
          <div
            className={cn(
              "p-4 rounded-lg border",
              darkroomMode
                ? "bg-black/40 border-white/10"
                : "bg-gray-50 border-gray-200"
            )}
          >
            <p
              className={cn(
                "text-xs uppercase tracking-wider font-bold mb-1",
                darkroomMode ? "text-white/40" : "text-gray-500"
              )}
            >
              StyleBox
            </p>
            <p
              className={cn(
                "text-sm font-semibold",
                darkroomMode ? "text-white" : "text-gray-900"
              )}
            >
              {styleboxTitle}
            </p>
          </div>

          {/* Completion Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p
                className={cn(
                  "text-xs uppercase tracking-wider font-bold",
                  darkroomMode ? "text-white/40" : "text-gray-500"
                )}
              >
                Deliverables Progress
              </p>
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={cn(darkroomMode ? "text-white/80" : "text-gray-700")}>
                  Completed
                </span>
                <span className={cn("font-bold", darkroomMode ? "text-white" : "text-gray-900")}>
                  {submission.completed_deliverables} / {submission.total_deliverables}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    isComplete ? "bg-green-500" : "bg-blue-500"
                  )}
                  style={{ width: `${submission.progress_percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Warning if incomplete */}
          {!isComplete && (
            <div
              className={cn(
                "p-4 rounded-lg border flex items-start gap-3",
                "bg-yellow-500/10 border-yellow-500/30"
              )}
            >
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                  Incomplete Submission
                </p>
                <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80 mt-1">
                  You have not completed all required deliverables. You can still submit, but
                  your work may be rejected.
                </p>
              </div>
            </div>
          )}

          {/* Confirmation Message */}
          <div
            className={cn(
              "p-4 rounded-lg border",
              darkroomMode
                ? "bg-black/40 border-white/10"
                : "bg-gray-50 border-gray-200"
            )}
          >
            <p
              className={cn(
                "text-xs leading-relaxed",
                darkroomMode ? "text-white/70" : "text-gray-600"
              )}
            >
              By submitting, you confirm that your work adheres to all technical restrictions
              and design requirements specified in this StyleBox brief. Your submission will
              be reviewed by Adorzia's team.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className={cn(
              darkroomMode
                ? "border-white/20 hover:bg-white/10"
                : "border-gray-300 hover:bg-gray-100"
            )}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(
              "gap-2 font-bold uppercase tracking-wider",
              isComplete
                ? "bg-green-600 hover:bg-green-700"
                : "bg-yellow-600 hover:bg-yellow-700"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
