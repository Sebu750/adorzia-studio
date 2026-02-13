import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Download, 
  Share2, 
  Save,
  CheckCircle2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StyleboxArchetypeQuadrant } from "@/components/stylebox/workspace/StyleboxArchetypeQuadrant";
import { StyleboxMutationQuadrant } from "@/components/stylebox/workspace/StyleboxMutationQuadrant";
import { StyleboxRestrictionsQuadrant } from "@/components/stylebox/workspace/StyleboxRestrictionsQuadrant";
import { StyleboxManifestationQuadrant } from "@/components/stylebox/workspace/StyleboxManifestationQuadrant";
import { DeliverablesChecklist } from "@/components/stylebox/workspace/DeliverablesChecklist";
import { SubmissionConfirmationModal } from "@/components/stylebox/workspace/SubmissionConfirmationModal";
import { canSubmit as canSubmitCheck } from "@/types/designer-submissions";
import type { StyleboxSubmission, SubmissionStatus } from "@/types/designer-submissions";

export default function StyleboxWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [darkroomMode, setDarkroomMode] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  const getStatusConfig = (status: SubmissionStatus) => {
    switch (status) {
      case 'draft':
        return { label: 'Draft', className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
      case 'submitted':
        return { label: 'Submitted', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
      case 'under_review':
        return { label: 'Under Review', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
      case 'approved':
        return { label: 'Approved', className: 'bg-green-500/10 text-green-500 border-green-500/20' };
      case 'rejected':
        return { label: 'Rejected', className: 'bg-red-500/10 text-red-500 border-red-500/20' };
      case 'revision_requested':
        return { label: 'Revision Requested', className: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };
      default:
        return { label: status, className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
    }
  };

  // Fetch StyleBox data
  const { data: stylebox, isLoading: styleboxLoading } = useQuery({
    queryKey: ["stylebox", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("styleboxes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch or create submission
  const { data: submission, isLoading: submissionLoading, refetch: refetchSubmission } = useQuery({
    queryKey: ["submission", id, user?.id],
    queryFn: async () => {
      if (!user?.id || !id) return null;

      // Check for existing submission
      const { data: existing, error: fetchError } = await supabase
        .from("stylebox_submissions")
        .select("*")
        .eq("stylebox_id", id)
        .eq("designer_id", user.id)
        .order("version_number", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // Create new submission if none exists
      if (!existing) {
        const deliverables = stylebox?.adorzia_deliverables || [];
        const totalDeliverables = Array.isArray(deliverables) ? deliverables.length : 0;

        const { data: newSubmission, error: createError } = await supabase
          .from("stylebox_submissions")
          .insert({
            stylebox_id: id,
            designer_id: user.id,
            version_number: 1,
            status: "draft",
            total_deliverables: totalDeliverables,
            completed_deliverables: 0,
            progress_percentage: 0,
          })
          .select()
          .single();

        if (createError) throw createError;
        return newSubmission as StyleboxSubmission;
      }

      return existing as StyleboxSubmission;
    },
    enabled: !!user?.id && !!id && !!stylebox,
  });

  // Auto-save effect (every 60 seconds)
  useEffect(() => {
    if (!submission) return;

    const autoSaveInterval = setInterval(() => {
      // Auto-save logic will be handled by individual quadrant components
      setLastSaved(new Date());
    }, 60000);

    return () => clearInterval(autoSaveInterval);
  }, [submission]);

  if (styleboxLoading || submissionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading StyleBox...</p>
        </div>
      </div>
    );
  }

  if (!stylebox || !submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-center">
          <p className="text-white/80 text-lg mb-4">StyleBox not found</p>
          <Button variant="outline" onClick={() => navigate("/styleboxes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to StyleBoxes
          </Button>
        </div>
      </div>
    );
  }

  const quadrantData = {
    archetype: stylebox.archetype as any,
    mutation: stylebox.mutation as any,
    restrictions: stylebox.restrictions as any,
    manifestation: stylebox.manifestation as any,
  };

  const canSubmit = canSubmitCheck(submission);
  const isReadOnly = submission.status !== 'draft' && submission.status !== 'revision_requested';

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col transition-colors duration-300",
        darkroomMode ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-900"
      )}
    >
      {/* Top Header Bar */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-md",
          darkroomMode
            ? "bg-black/60 border-white/10"
            : "bg-white/60 border-gray-200"
        )}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/styleboxes")}
              className={cn(darkroomMode && "hover:bg-white/10")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-3">
              {stylebox.display_id && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold tracking-widest uppercase",
                    darkroomMode
                      ? "bg-white/5 border-white/20 text-white/80"
                      : "bg-gray-100 border-gray-300"
                  )}
                >
                  {stylebox.display_id}
                </Badge>
              )}
              <h1 className="text-sm font-semibold">{stylebox.title}</h1>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] uppercase",
                  darkroomMode && "bg-white/10"
                )}
              >
                {stylebox.difficulty}
              </Badge>
              
              {submission && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                    getStatusConfig(submission.status).className
                  )}
                >
                  {getStatusConfig(submission.status).label}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-save indicator */}
            {lastSaved && (
              <span
                className={cn(
                  "text-[10px] flex items-center gap-1",
                  darkroomMode ? "text-white/40" : "text-gray-500"
                )}
              >
                <Save className="h-3 w-3" />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}

            {/* Darkroom Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkroomMode(!darkroomMode)}
              className={cn(darkroomMode && "hover:bg-white/10")}
              title="Toggle Darkroom Mode"
            >
              {darkroomMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Design Kit Download */}
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 text-[11px]",
                darkroomMode &&
                  "border-white/20 hover:bg-white/10 hover:border-white/40"
              )}
            >
              <Download className="h-3.5 w-3.5" />
              Design Kit
            </Button>

            {/* Share */}
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 text-[11px]",
                darkroomMode &&
                  "border-white/20 hover:bg-white/10 hover:border-white/40"
              )}
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Main 4-Quadrant Grid + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* 4-Quadrant Adorzia Protocol Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-auto">
          {/* Q1: Archetype (Read-only) */}
          <StyleboxArchetypeQuadrant
            data={quadrantData.archetype}
            darkroomMode={darkroomMode}
          />

          {/* Q2: Mutation (Read-only) */}
          <StyleboxMutationQuadrant
            data={quadrantData.mutation}
            darkroomMode={darkroomMode}
          />

          {/* Q3: Restrictions (Read-only) */}
          <StyleboxRestrictionsQuadrant
            data={quadrantData.restrictions}
            darkroomMode={darkroomMode}
          />

          {/* Q4: Manifestation (Workspace - Active) */}
          <StyleboxManifestationQuadrant
            data={quadrantData.manifestation}
            submission={submission}
            styleboxId={stylebox.id}
            darkroomMode={darkroomMode}
            isReadOnly={isReadOnly}
            onSave={() => {
              setLastSaved(new Date());
              refetchSubmission();
            }}
          />
        </div>

        {/* Right Sidebar: Deliverables Checklist */}
        <aside
          className={cn(
            "w-80 border-l overflow-y-auto hidden lg:block",
            darkroomMode
              ? "bg-black/40 border-white/10"
              : "bg-gray-50 border-gray-200"
          )}
        >
          <DeliverablesChecklist
            deliverables={stylebox.adorzia_deliverables as any}
            submission={submission}
            darkroomMode={darkroomMode}
            isReadOnly={isReadOnly}
            onRefresh={refetchSubmission}
          />

          {/* Submit Button */}
          <div className="p-6 border-t border-white/10">
            <Button
              disabled={!canSubmit}
              onClick={() => setShowSubmissionModal(true)}
              className={cn(
                "w-full h-12 uppercase font-bold tracking-widest text-xs gap-2",
                canSubmit
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              {canSubmit ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Submit to Adorzia
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4" />
                  Complete All Deliverables
                </>
              )}
            </Button>

            {/* Progress Indicator */}
            <div className="mt-4 text-center">
              <p
                className={cn(
                  "text-[10px] uppercase tracking-wider font-bold",
                  darkroomMode ? "text-white/40" : "text-gray-500"
                )}
              >
                Progress: {submission.completed_deliverables} /{" "}
                {submission.total_deliverables}
              </p>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${submission.progress_percentage}%` }}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Submission Confirmation Modal */}
      {submission && (
        <SubmissionConfirmationModal
          open={showSubmissionModal}
          onOpenChange={setShowSubmissionModal}
          submission={submission}
          styleboxTitle={stylebox.title}
          darkroomMode={darkroomMode}
          onSuccess={() => {
            refetchSubmission();
            toast({
              title: "Success!",
              description: "Your StyleBox submission has been sent for review.",
            });
          }}
        />
      )}
    </div>
  );
}
