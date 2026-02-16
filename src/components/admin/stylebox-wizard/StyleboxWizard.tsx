import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
<<<<<<< HEAD
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";
import { X, ChevronLeft, ChevronRight, Eye, Save, History } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import type { Json } from "@/integrations/supabase/types";
import { useState } from "react";
import { sanitizeTitle, sanitizeInput, sanitizeRichText } from "@/lib/input-sanitizer";

import { WizardProvider, useWizardContext } from "./WizardContext";
import { BasicSetupTab } from "./tabs/BasicSetupTab";
import { ArchetypeTab } from "./tabs/ArchetypeTab";
import { MutationTab } from "./tabs/MutationTab";
import { RestrictionsTab } from "./tabs/RestrictionsTab";
import { ManifestationTab } from "./tabs/ManifestationTab";
import { DeliverablesConfigTab } from "./tabs/DeliverablesConfigTab";
import { TimelineTab } from "./tabs/TimelineTab";
import { StyleboxDesignerPreview } from "./StyleboxDesignerPreview";
=======
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import type { Json } from "@/integrations/supabase/types";

import { WizardProvider, useWizardContext } from "./WizardContext";
import { BasicSetupTab } from "./tabs/BasicSetupTab";
import { ScenarioTab } from "./tabs/ScenarioTab";
import { ConstraintsTab } from "./tabs/ConstraintsTab";
import { TrendDirectionTab } from "./tabs/TrendDirectionTab";
import { VisualDirectionTab } from "./tabs/VisualDirectionTab";
import { ColorSystemTab } from "./tabs/ColorSystemTab";
import { MaterialDirectionTab } from "./tabs/MaterialDirectionTab";
import { DesignGuidelinesTab } from "./tabs/DesignGuidelinesTab";
import { TechnicalRequirementsTab } from "./tabs/TechnicalRequirementsTab";
import { DetailedDeliverablesTab } from "./tabs/DetailedDeliverablesTab";
import { EvaluationTab } from "./tabs/EvaluationTab";
import { TimelineTab } from "./tabs/TimelineTab";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import type { StyleBoxTemplate, StudioName, LevelNumber } from "@/lib/stylebox-template";

type Stylebox = Database["public"]["Tables"]["styleboxes"]["Row"];
type StyleboxInsert = Database["public"]["Tables"]["styleboxes"]["Insert"];
type StyleboxUpdate = Database["public"]["Tables"]["styleboxes"]["Update"];
type ContentStatus = Database["public"]["Enums"]["content_status"];

interface StyleboxWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stylebox?: Stylebox | null;
}

const TABS = [
<<<<<<< HEAD
  { id: "basic", label: "Basic Setup" },
  { id: "archetype", label: "Q1: Archetype" },
  { id: "mutation", label: "Q2: Mutation" },
  { id: "restrictions", label: "Q3: Restrictions" },
  { id: "manifestation", label: "Q4: Manifestation" },
  { id: "deliverables_config", label: "Deliverables" },
  { id: "publish", label: "Timeline" },
=======
  { id: "basic", label: "Basic" },
  { id: "scenario", label: "Scenario" },
  { id: "constraints", label: "Constraints" },
  { id: "trend", label: "Trend" },
  { id: "visual", label: "Visual" },
  { id: "colors", label: "Colors" },
  { id: "materials", label: "Materials" },
  { id: "guidelines", label: "Guidelines" },
  { id: "technical", label: "Technical" },
  { id: "deliverables", label: "Deliverables" },
  { id: "evaluation", label: "Evaluation" },
  { id: "publish", label: "Publish" },
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
];

export function StyleboxWizard({ open, onOpenChange, stylebox }: StyleboxWizardProps) {
  // Convert database row to template format
  const initialData: StyleBoxTemplate | null = stylebox ? {
    id: stylebox.id,
<<<<<<< HEAD
    display_id: (stylebox as any).display_id || undefined,
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    title: stylebox.title,
    description: stylebox.description || undefined,
    category: stylebox.category,
    difficulty: stylebox.difficulty,
<<<<<<< HEAD
    collection_line: (stylebox as any).collection_line || undefined,
    market_context: (stylebox as any).market_context || undefined,
    visibility_tags: ((stylebox as any).visibility_tags as string[]) || [],
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    xp_reward: stylebox.xp_reward || 100,
    is_featured: stylebox.is_featured || false,
    is_walkthrough: stylebox.is_walkthrough,
    status: stylebox.status,
    version: stylebox.version || 1,
    season: (stylebox as any).season || undefined,
    collection_size: (stylebox as any).collection_size || undefined,
    trend_narrative: (stylebox as any).trend_narrative || undefined,
    global_drivers: (stylebox as any).global_drivers || undefined,
    local_relevance: (stylebox as any).local_relevance || undefined,
    visual_keywords: ((stylebox as any).visual_keywords as string[]) || [],
    moodboard_images: ((stylebox as any).moodboard_images as any[]) || [],
    color_system: ((stylebox as any).color_system as any[]) || [],
    material_direction: ((stylebox as any).material_direction as any) || {},
    technical_requirements: ((stylebox as any).technical_requirements as any) || { file_formats: [], required_views: [] },
    design_guidelines: ((stylebox as any).design_guidelines as any) || { difficulty_level: stylebox.difficulty, complexity_notes: "" },
    deliverables: Array.isArray(stylebox.deliverables) 
      ? (stylebox.deliverables as any[]).map((d, i) => 
          typeof d === "string" 
            ? { id: `legacy-${i}`, name: d, required: true }
            : d
        )
      : [],
    evaluation_criteria: ((stylebox as any).evaluation_criteria as any[]) || [],
    submission_deadline: (stylebox as any).submission_deadline || undefined,
    release_date: stylebox.release_date || undefined,
    required_subscription_tier: stylebox.required_subscription_tier || undefined,
    required_rank_order: stylebox.required_rank_order || undefined,
    thumbnail_url: (stylebox as any).thumbnail_url || undefined,
    pdf_url: (stylebox as any).pdf_url || undefined,
  } : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <WizardProvider initialData={initialData}>
          <WizardContent onOpenChange={onOpenChange} stylebox={stylebox} />
        </WizardProvider>
      </DialogContent>
    </Dialog>
  );
}

function WizardContent({ 
  onOpenChange, 
  stylebox 
}: { 
  onOpenChange: (open: boolean) => void;
  stylebox?: Stylebox | null;
}) {
  const { formData, currentTab, setCurrentTab, resetForm, setFormData } = useWizardContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
<<<<<<< HEAD
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [lastSavedData, setLastSavedData] = useState<string>(JSON.stringify(formData));
  const isEditing = !!stylebox;

=======
  const isEditing = !!stylebox;

  const currentIndex = TABS.findIndex(t => t.id === currentTab);
  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < TABS.length - 1;

  const goToTab = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < TABS.length) {
      setCurrentTab(TABS[newIndex].id);
    }
  };

>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  const createMutation = useMutation({
    mutationFn: async (data: StyleboxInsert) => {
      const { error } = await supabase.from("styleboxes").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-styleboxes"] });
      toast({
        title: "StyleBox created",
        description: formData.status === "active" 
          ? "The StyleBox is now live for designers." 
          : "The StyleBox has been saved as a draft.",
      });
      resetForm();
      onOpenChange(false);
    },
<<<<<<< HEAD
    onError: (error: any) => {
      console.error("StyleBox creation error:", error);
      toast({
        title: "Error creating StyleBox",
        description: error?.message || error?.error?.message || "Failed to create StyleBox. Please check all required fields and try again.",
        variant: "destructive",
      });
=======
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create StyleBox. Please try again.",
        variant: "destructive",
      });
      console.error(error);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StyleboxUpdate }) => {
      const { error } = await supabase.from("styleboxes").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-styleboxes"] });
      toast({
        title: "StyleBox updated",
        description: "Changes have been saved successfully.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update StyleBox. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

<<<<<<< HEAD
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const currentIndex = TABS.findIndex(t => t.id === currentTab);
  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < TABS.length - 1;

  const goToTab = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < TABS.length) {
      setCurrentTab(TABS[newIndex].id);
    }
  };

  // Auto-save logic
  useEffect(() => {
    const timer = setInterval(() => {
      const currentData = JSON.stringify(formData);
      if (formData.title.trim() && !isLoading && currentData !== lastSavedData) {
        console.log("Auto-saving draft...");
        handleSave(false);
        setLastSaved(new Date());
        setLastSavedData(currentData);
      }
    }, 60000); // Every 60 seconds

    return () => clearInterval(timer);
  }, [formData, isLoading, lastSavedData]);

  const handleSave = (publishNow: boolean, isNewVersion: boolean = false) => {
    const sanitizedTitle = sanitizeTitle(formData.title);
    const sanitizedDescription = sanitizeInput(formData.description || "");
    const sanitizedTrendNarrative = sanitizeRichText(formData.trend_narrative || "");
    const sanitizedGlobalDrivers = sanitizeInput(formData.global_drivers || "");
    const sanitizedLocalRelevance = sanitizeInput(formData.local_relevance || "");
    const sanitizedCollectionLine = sanitizeInput(formData.collection_line || "");
    const sanitizedMarketContext = sanitizeInput(formData.market_context || "");
    
    if (!sanitizedTitle.trim()) {
=======
  const handleSave = (publishNow: boolean) => {
    if (!formData.title.trim()) {
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      toast({
        title: "Validation error",
        description: "Title is required.",
        variant: "destructive",
      });
      setCurrentTab("basic");
      return;
    }

    // Convert template data to database format
    const data: StyleboxInsert = {
<<<<<<< HEAD
      title: sanitizedTitle.trim(),
      description: sanitizedDescription.trim() || null,
=======
      title: formData.title.trim(),
      description: formData.description?.trim() || null,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      category: formData.category,
      difficulty: formData.difficulty,
      xp_reward: formData.xp_reward || 100,
      is_featured: formData.is_featured || false,
      is_walkthrough: formData.is_walkthrough || false,
      status: publishNow ? "active" as ContentStatus : (formData.status || "draft") as ContentStatus,
<<<<<<< HEAD
      version: isNewVersion ? (formData.version || 1) + 1 : (formData.version || 1),
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      
      // New template fields
      season: formData.season || null,
      collection_size: formData.collection_size || null,
<<<<<<< HEAD
      collection_line: sanitizedCollectionLine || null,
      market_context: sanitizedMarketContext || null,
      visibility_tags: formData.visibility_tags as unknown as Json,
      
      // Only include display_id if it exists (for updates) - let DB generate for new records
      ...(formData.display_id && { display_id: formData.display_id }),
      
      // Quadrant Builder Data
      archetype: (formData as any).archetype as unknown as Json,
      mutation: (formData as any).mutation as unknown as Json,
      restrictions: (formData as any).restrictions as unknown as Json,
      manifestation: (formData as any).manifestation as unknown as Json,
      adorzia_deliverables: (formData as any).adorzia_deliverables as unknown as Json,
      
      trend_narrative: sanitizedTrendNarrative || null,
      global_drivers: sanitizedGlobalDrivers || null,
      local_relevance: sanitizedLocalRelevance || null,
=======
      trend_narrative: formData.trend_narrative || null,
      global_drivers: formData.global_drivers || null,
      local_relevance: formData.local_relevance || null,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      visual_keywords: formData.visual_keywords as unknown as Json,
      moodboard_images: formData.moodboard_images as unknown as Json,
      color_system: formData.color_system as unknown as Json,
      material_direction: formData.material_direction as unknown as Json,
      technical_requirements: formData.technical_requirements as unknown as Json,
      design_guidelines: formData.design_guidelines as unknown as Json,
      evaluation_criteria: formData.evaluation_criteria as unknown as Json,
      submission_deadline: formData.submission_deadline ? new Date(formData.submission_deadline).toISOString() : null,
      thumbnail_url: formData.thumbnail_url || null,
      pdf_url: formData.pdf_url || null,
      
      // Legacy fields for backward compatibility
      deliverables: formData.deliverables.map(d => d.name) as unknown as Json,
<<<<<<< HEAD
      brief: { template_version: 3 } as unknown as Json,
=======
      brief: { template_version: 2 } as unknown as Json,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      
      // Existing fields
      release_date: formData.release_date ? new Date(formData.release_date).toISOString() : null,
      required_subscription_tier: formData.required_subscription_tier || null,
      required_rank_order: formData.required_rank_order || null,
    };

<<<<<<< HEAD
    if (isNewVersion) {
      // Create new record for versioning
      const { id, created_at, updated_at, ...newData } = data as any;
      createMutation.mutate(newData);
    } else if (isEditing && stylebox) {
=======
    if (isEditing && stylebox) {
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      updateMutation.mutate({ id: stylebox.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

<<<<<<< HEAD
  return (
    <>
      {showPreview && <StyleboxDesignerPreview onClose={() => setShowPreview(false)} />}
      
      <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <DialogTitle className="font-display text-xl">
              {isEditing ? "Edit StyleBox" : "Create StyleBox"}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-2 gap-1.5 text-[10px] uppercase font-bold"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </Button>
              {isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2 gap-1.5 text-[10px] uppercase font-bold text-amber-500 border-amber-500/50 hover:bg-amber-500/10"
                  onClick={() => handleSave(false, true)}
                  disabled={isLoading}
                >
                  <History className="h-3.5 w-3.5" /> Save as Version {(formData.version || 1) + 1}.0
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Save className="h-3 w-3" /> Auto-saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
=======
  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <DialogTitle className="font-display text-xl">
            {isEditing ? "Edit StyleBox" : "Create StyleBox"}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        </div>
      </DialogHeader>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 flex flex-col overflow-hidden">
<<<<<<< HEAD
        <TabsList className="flex-shrink-0 h-auto p-1 mx-6 mt-4 grid grid-cols-4 lg:grid-cols-7 gap-1 bg-muted/50">
=======
        <TabsList className="flex-shrink-0 h-auto p-1 mx-6 mt-4 grid grid-cols-5 lg:grid-cols-10 gap-1 bg-muted/50">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          {TABS.map((tab, index) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="text-xs px-2 py-1.5 data-[state=active]:bg-background"
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{index + 1}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <TabsContent value="basic" className="m-0 mt-0">
            <BasicSetupTab />
          </TabsContent>
<<<<<<< HEAD
          <TabsContent value="archetype" className="m-0 mt-0">
            <ArchetypeTab />
          </TabsContent>
          <TabsContent value="mutation" className="m-0 mt-0">
            <MutationTab />
          </TabsContent>
          <TabsContent value="restrictions" className="m-0 mt-0">
            <RestrictionsTab />
          </TabsContent>
          <TabsContent value="manifestation" className="m-0 mt-0">
            <ManifestationTab />
          </TabsContent>
          <TabsContent value="deliverables_config" className="m-0 mt-0">
            <DeliverablesConfigTab />
=======
          <TabsContent value="scenario" className="m-0 mt-0">
            <ScenarioTab />
          </TabsContent>
          <TabsContent value="constraints" className="m-0 mt-0">
            <ConstraintsTab />
          </TabsContent>
          <TabsContent value="trend" className="m-0 mt-0">
            <TrendDirectionTab />
          </TabsContent>
          <TabsContent value="visual" className="m-0 mt-0">
            <VisualDirectionTab />
          </TabsContent>
          <TabsContent value="colors" className="m-0 mt-0">
            <ColorSystemTab />
          </TabsContent>
          <TabsContent value="materials" className="m-0 mt-0">
            <MaterialDirectionTab />
          </TabsContent>
          <TabsContent value="guidelines" className="m-0 mt-0">
            <DesignGuidelinesTab />
          </TabsContent>
          <TabsContent value="technical" className="m-0 mt-0">
            <TechnicalRequirementsTab />
          </TabsContent>
          <TabsContent value="deliverables" className="m-0 mt-0">
            <DetailedDeliverablesTab />
          </TabsContent>
          <TabsContent value="evaluation" className="m-0 mt-0">
            <EvaluationTab />
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          </TabsContent>
          <TabsContent value="publish" className="m-0 mt-0">
            <TimelineTab onSave={handleSave} isLoading={isLoading} />
          </TabsContent>
        </div>

        {/* Navigation Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t flex items-center justify-between bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={() => goToTab("prev")}
            disabled={!canGoBack}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Step {currentIndex + 1} of {TABS.length}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => goToTab("next")}
            disabled={!canGoNext}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </Tabs>
    </>
  );
}
