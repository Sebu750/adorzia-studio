import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Check, 
  X, 
  Upload, 
  Crown, 
  Lock,
  Box,
  BookOpen,
  Folder,
  ChevronRight,
  Loader2,
  FileImage,
  FileText,
  Palette,
  Image,
  MessageSquare,
  Scissors
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RANKS, RankTier } from "@/lib/ranks";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type SourceType = "stylebox" | "walkthrough" | "portfolio";
type SubscriptionTier = Database["public"]["Enums"]["subscription_tier"];

interface PublicationRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const sourceConfig = {
  stylebox: {
    label: "StyleBox Submission",
    description: "Work completed from a StyleBox challenge",
    icon: Box,
  },
  walkthrough: {
    label: "Walkthrough Project",
    description: "Design created during a guided walkthrough",
    icon: BookOpen,
  },
  portfolio: {
    label: "Portfolio Item",
    description: "Independent work from your portfolio",
    icon: Folder,
  },
};

const fieldConfig = {
  title: { label: "Title", icon: FileText },
  description: { label: "Description", icon: MessageSquare },
  category: { label: "Category", icon: Palette },
  sketches: { label: "Sketches", icon: FileImage },
  moodboard: { label: "Moodboard", icon: Image },
  mockups: { label: "Mockups / 3D", icon: Scissors },
};

interface SourceItem {
  id: string;
  title: string;
  category: string;
  thumbnail?: string;
  description?: string;
  completedAt?: string;
}

export function PublicationRequestForm({
  open,
  onOpenChange,
  onSuccess,
}: PublicationRequestFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sourceType, setSourceType] = useState<SourceType | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when closed
  useEffect(() => {
    if (!open) {
      setStep(1);
      setSourceType(null);
      setSelectedItemId(null);
      setNotes("");
      setAgreed(false);
    }
  }, [open]);

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*, ranks(*)")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch completed stylebox submissions
  const { data: styleboxItems = [], isLoading: styleboxLoading } = useQuery({
    queryKey: ["stylebox-submissions-for-publish", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("stylebox_submissions")
        .select(`
          id,
          description,
          submitted_at,
          status,
          styleboxes (
            id,
            title,
            category,
            description
          )
        `)
        .eq("designer_id", user.id)
        .eq("status", "approved");
      if (error) throw error;
      return (data || []).map((item) => ({
        id: item.id,
        title: (item.styleboxes as any)?.title || "Untitled",
        category: (item.styleboxes as any)?.category || "fashion",
        description: item.description || (item.styleboxes as any)?.description,
        completedAt: item.submitted_at,
      })) as SourceItem[];
    },
    enabled: !!user?.id && sourceType === "stylebox",
  });

  // Fetch completed walkthroughs
  const { data: walkthroughItems = [], isLoading: walkthroughLoading } = useQuery({
    queryKey: ["walkthrough-progress-for-publish", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("walkthrough_progress")
        .select(`
          id,
          completed_at,
          submission_notes,
          styleboxes (
            id,
            title,
            category,
            description
          )
        `)
        .eq("designer_id", user.id)
        .not("completed_at", "is", null);
      if (error) throw error;
      return (data || []).map((item) => ({
        id: item.id,
        title: (item.styleboxes as any)?.title || "Untitled",
        category: (item.styleboxes as any)?.category || "fashion",
        description: item.submission_notes || (item.styleboxes as any)?.description,
        completedAt: item.completed_at,
      })) as SourceItem[];
    },
    enabled: !!user?.id && sourceType === "walkthrough",
  });

  // Fetch portfolio items
  const { data: portfolioItems = [], isLoading: portfolioLoading } = useQuery({
    queryKey: ["portfolios-for-publish", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("designer_id", user.id);
      if (error) throw error;
      return (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        category: "fashion", // Default, portfolios don't have category
        description: item.description,
        completedAt: item.created_at,
      })) as SourceItem[];
    },
    enabled: !!user?.id && sourceType === "portfolio",
  });

  // Get current source items
  const getSourceItems = () => {
    switch (sourceType) {
      case "stylebox":
        return styleboxItems;
      case "walkthrough":
        return walkthroughItems;
      case "portfolio":
        return portfolioItems;
      default:
        return [];
    }
  };

  const isLoadingItems = styleboxLoading || walkthroughLoading || portfolioLoading;
  const sourceItems = getSourceItems();
  const selectedItem = sourceItems.find((item) => item.id === selectedItemId);

  // Check subscription eligibility
  const subscriptionTier = profile?.subscription_tier || "basic";
  const isEligible = subscriptionTier === "pro" || subscriptionTier === "elite";
  const rankName = (profile?.ranks as any)?.name || "Novice";
  const revenueShare = (profile?.ranks as any)?.revenue_share_percent || 20;

  // Mock completeness - in production, this would come from the actual item
  const completeness = 100;

  const handleSubmit = async () => {
    if (!user?.id || !selectedItem || !sourceType) return;

    setIsSubmitting(true);

    try {
      // First, we need a portfolio entry for the publication
      // If source is portfolio, use the existing portfolio_id
      // Otherwise, create a new portfolio entry or use an existing one
      let portfolioId = sourceType === "portfolio" ? selectedItemId : null;

      if (!portfolioId) {
        // Create a portfolio entry for the submission
        const { data: newPortfolio, error: portfolioError } = await supabase
          .from("portfolios")
          .insert({
            designer_id: user.id,
            title: selectedItem.title,
            description: selectedItem.description || "",
          })
          .select()
          .single();

        if (portfolioError) throw portfolioError;
        portfolioId = newPortfolio.id;
      }

      // Create publication request
      const { error } = await supabase.from("portfolio_publications").insert({
        portfolio_id: portfolioId,
        source_type: sourceType,
        source_id: selectedItemId,
        status: "pending",
        decision: "pending",
        design_metadata: {
          original_title: selectedItem.title,
          category: selectedItem.category,
          notes: notes,
        },
      });

      if (error) throw error;

      toast.success("Publication request submitted!", {
        description: "You'll be notified when our team reviews your project.",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting publication request:", error);
      toast.error("Failed to submit request", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 = sourceType !== null;
  const canProceedToStep3 = selectedItemId !== null;
  const canSubmit = isEligible && agreed && completeness >= 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-accent" />
            Request Publication
          </DialogTitle>
          <DialogDescription>
            Submit your work for marketplace review
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 py-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step >= s
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={cn(
                    "flex-1 h-0.5",
                    step > s ? "bg-accent" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Source Type */}
        {step === 1 && (
          <div className="space-y-4 py-4">
            <Label className="text-sm font-medium">Where is your work from?</Label>
            <RadioGroup
              value={sourceType || ""}
              onValueChange={(value) => setSourceType(value as SourceType)}
              className="space-y-3"
            >
              {(Object.entries(sourceConfig) as [SourceType, typeof sourceConfig.stylebox][]).map(
                ([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <Label
                      key={key}
                      htmlFor={key}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                        sourceType === key
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      )}
                    >
                      <RadioGroupItem value={key} id={key} className="sr-only" />
                      <div
                        className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          sourceType === key ? "bg-accent/20" : "bg-muted"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            sourceType === key ? "text-accent" : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{config.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                      {sourceType === key && (
                        <Check className="h-5 w-5 text-accent" />
                      )}
                    </Label>
                  );
                }
              )}
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Select Item */}
        {step === 2 && (
          <div className="space-y-4 py-4">
            <Label className="text-sm font-medium">Select your project</Label>
            {isLoadingItems ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : sourceItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No eligible items found. Complete a{" "}
                  {sourceType === "stylebox"
                    ? "StyleBox challenge"
                    : sourceType === "walkthrough"
                    ? "Walkthrough"
                    : "portfolio project"}{" "}
                  first.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[280px] pr-4">
                <div className="space-y-2">
                  {sourceItems.map((item) => (
                    <Card
                      key={item.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        selectedItemId === item.id
                          ? "border-accent bg-accent/5"
                          : "hover:border-accent/50"
                      )}
                      onClick={() => setSelectedItemId(item.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="h-full w-full object-cover rounded-lg"
                            />
                          ) : (
                            <FileImage className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="secondary" className="text-xs capitalize">
                              {item.category}
                            </Badge>
                            {item.completedAt && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.completedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedItemId === item.id && (
                          <Check className="h-5 w-5 text-accent shrink-0" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && selectedItem && (
          <div className="space-y-5 py-4">
            {/* Selected Project Preview */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 border border-border">
              <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center">
                <FileImage className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-semibold truncate">
                  {selectedItem.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {selectedItem.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {sourceConfig[sourceType!].label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Revenue Share Preview */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Your Revenue Share</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-background">
                  {rankName}
                </Badge>
                <span className="text-xl font-display font-bold text-accent">
                  {revenueShare}%
                </span>
              </div>
            </div>

            {/* Subscription Check */}
            {!isEligible && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <Lock className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Pro Subscription Required
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Upgrade to Pro or Elite to publish designs on the marketplace.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Plans
                  </Button>
                </div>
              </div>
            )}

            {/* Completeness Check */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Project Completeness</span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    completeness === 100 ? "text-success" : "text-warning"
                  )}
                >
                  {completeness}%
                </span>
              </div>
              <Progress value={completeness} className="h-2" />
            </div>

            {/* Notes for Reviewer */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes for Review Team (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions or context for our team..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Agreement */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                disabled={!isEligible}
              />
              <label
                htmlFor="agree"
                className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
              >
                I confirm this is original work and I agree to Adorzia's{" "}
                <a href="#" className="text-accent hover:underline">
                  Publication Terms
                </a>
                .
              </label>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((step - 1) as 1 | 2)}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          {step === 1 && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
          {step < 3 ? (
            <Button
              variant="accent"
              onClick={() => setStep((step + 1) as 2 | 3)}
              disabled={step === 1 ? !canProceedToStep2 : !canProceedToStep3}
              className="gap-2"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="accent"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Submit for Review
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
