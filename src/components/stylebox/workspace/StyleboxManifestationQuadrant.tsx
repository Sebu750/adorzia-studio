import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { StyleboxSubmission } from "@/types/designer-submissions";

interface StyleboxManifestationQuadrantProps {
  data: {
    prompt?: string;
  };
  submission: StyleboxSubmission;
  styleboxId: string;
  darkroomMode: boolean;
  isReadOnly?: boolean;
  onSave?: () => void;
}

export function StyleboxManifestationQuadrant({
  data,
  submission,
  styleboxId,
  darkroomMode,
  isReadOnly = false,
  onSave,
}: StyleboxManifestationQuadrantProps) {
  const [rationale, setRationale] = useState(
    submission.manifestation_rationale || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveRationale = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("stylebox_submissions")
        .update({
          manifestation_rationale: rationale,
          updated_at: new Date().toISOString(),
        })
        .eq("id", submission.id);

      if (error) throw error;

      toast({
        title: "Saved",
        description: "Your rationale has been saved.",
      });

      if (onSave) onSave();
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save rationale.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={cn(
        "p-8 flex flex-col gap-6 relative",
        darkroomMode
          ? "bg-black/40 border-white/5"
          : "bg-gray-50 border-gray-200"
      )}
    >
      {/* Quadrant Label */}
      <div
        className={cn(
          "absolute top-4 left-4 text-[10px] font-bold uppercase tracking-[0.2em]",
          darkroomMode ? "text-white/40" : "text-gray-400"
        )}
      >
        Q4: Manifestation
      </div>

      <div className="flex-1 flex flex-col gap-8 max-w-xl mx-auto w-full h-full mt-8">
        {/* Design Prompt */}
        <div className="space-y-4 text-center">
          <h3
            className={cn(
              "text-sm font-bold uppercase tracking-[0.3em]",
              darkroomMode ? "text-white/40" : "text-gray-500"
            )}
          >
            The Prompt
          </h3>
          <p
            className={cn(
              "text-xl font-serif italic leading-relaxed",
              darkroomMode ? "text-white/80" : "text-gray-800"
            )}
          >
            "{data?.prompt || "Final design prompt will appear here."}"
          </p>
        </div>

        {/* Rationale Text Area */}
        <div className="space-y-2">
          <label
            className={cn(
              "text-xs font-bold uppercase tracking-wider",
              darkroomMode ? "text-white/60" : "text-gray-600"
            )}
          >
            Your Rationale (How you met the constraints)
          </label>
          <Textarea
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            disabled={isReadOnly}
            placeholder={isReadOnly ? "No rationale provided." : "Explain your design approach, material choices, and how you addressed the technical restrictions..."}
            className={cn(
              "min-h-[120px] resize-none font-light",
              darkroomMode
                ? "bg-white/5 border-white/10 text-white/90 placeholder:text-white/30"
                : "bg-white border-gray-300 text-gray-900",
              isReadOnly && "opacity-70"
            )}
          />
          {!isReadOnly && (
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveRationale}
                disabled={isSaving}
                className={cn(
                  "gap-2 text-[11px]",
                  darkroomMode && "border-white/20 hover:bg-white/10"
                )}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3" />
                    Save Rationale
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Upload Zone Placeholder */}
        <div
          className={cn(
            "flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 min-h-[200px]",
            darkroomMode
              ? "border-white/10 bg-white/[0.02]"
              : "border-gray-300 bg-gray-100"
          )}
        >
          <div
            className={cn(
              "p-4 rounded-full",
              darkroomMode ? "bg-white/5" : "bg-gray-200"
            )}
          >
            <Upload
              className={cn(
                "h-8 w-8",
                darkroomMode ? "text-white/20" : "text-gray-400"
              )}
            />
          </div>
          <div className="text-center">
            <p
              className={cn(
                "text-sm font-medium",
                darkroomMode ? "text-white/60" : "text-gray-700"
              )}
            >
              Upload your deliverables
            </p>
            <p
              className={cn(
                "text-[10px] mt-1 uppercase tracking-widest",
                darkroomMode ? "text-white/30" : "text-gray-500"
              )}
            >
              Use sidebar checklist to upload files
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
