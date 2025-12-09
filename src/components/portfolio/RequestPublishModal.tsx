import { useState } from "react";
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
import { 
  Check, 
  X, 
  AlertCircle, 
  FileImage, 
  FileText, 
  Palette, 
  Image, 
  MessageSquare,
  Scissors,
  Upload,
  Crown,
  Percent,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  ProjectCompleteness, 
  REQUIRED_FIELDS, 
  calculateCompleteness,
  isEligibleForPublish
} from "@/lib/publication";
import { RANKS, RankTier } from "@/lib/ranks";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface RequestPublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    title: string;
    category: string;
    thumbnail: string;
  };
  currentRank: RankTier;
  subscriptionTier: 'basic' | 'pro' | 'elite';
  onSubmit: (projectId: string, notes: string) => void;
}

// Mock completeness data - in real app would come from project
const mockCompleteness: ProjectCompleteness = {
  title: true,
  description: true,
  category: true,
  sketches: true,
  moodboard: true,
  mockups: true,
  story: true,
  fabricNotes: false,
};

const fieldConfig = {
  title: { label: "Title", icon: FileText },
  description: { label: "Description", icon: MessageSquare },
  category: { label: "Category", icon: Palette },
  sketches: { label: "Sketches", icon: FileImage },
  moodboard: { label: "Moodboard", icon: Image },
  mockups: { label: "Mockups / 3D", icon: Scissors },
  story: { label: "Story & Vision", icon: MessageSquare, optional: true },
  fabricNotes: { label: "Fabric Notes", icon: FileText, optional: true },
};

export function RequestPublishModal({
  open,
  onOpenChange,
  project,
  currentRank,
  subscriptionTier,
  onSubmit,
}: RequestPublishModalProps) {
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeness = calculateCompleteness(mockCompleteness);
  const eligibility = isEligibleForPublish(completeness, subscriptionTier);
  const rankDef = RANKS[currentRank];

  const handleSubmit = async () => {
    if (!eligibility.eligible || !agreed) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit(project.id, notes);
    setIsSubmitting(false);
    onOpenChange(false);
    
    toast.success("Publication request submitted!", {
      description: "You'll be notified when our team reviews your project.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-accent" />
            Request Publication
          </DialogTitle>
          <DialogDescription>
            Submit your project for marketplace consideration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Preview */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 border border-border">
            <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0">
              <img 
                src={project.thumbnail} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-semibold truncate">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.category}</p>
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
                {rankDef.name}
              </Badge>
              <span className="text-xl font-display font-bold text-accent">
                {rankDef.revenueShare}%
              </span>
            </div>
          </div>

          {/* Subscription Check */}
          {subscriptionTier === 'basic' && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <Lock className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Pro Subscription Required</p>
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
              <span className={cn(
                "text-sm font-semibold",
                completeness === 100 ? "text-success" : "text-warning"
              )}>
                {completeness}%
              </span>
            </div>
            <Progress value={completeness} className="h-2" />
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              {REQUIRED_FIELDS.map((field) => {
                const config = fieldConfig[field];
                const isComplete = mockCompleteness[field];
                const Icon = config.icon;
                
                return (
                  <div 
                    key={field}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg text-sm",
                      isComplete 
                        ? "bg-success/10 text-success" 
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4 shrink-0" />
                    ) : (
                      <X className="h-4 w-4 shrink-0" />
                    )}
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{config.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Optional fields (boost visibility):</p>
            <div className="flex gap-2">
              {(['story', 'fabricNotes'] as const).map((field) => {
                const config = fieldConfig[field];
                const isComplete = mockCompleteness[field];
                
                return (
                  <Badge 
                    key={field}
                    variant={isComplete ? "success" : "secondary"}
                    className="gap-1"
                  >
                    {isComplete && <Check className="h-3 w-3" />}
                    {config.label}
                  </Badge>
                );
              })}
            </div>
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
              disabled={!eligibility.eligible}
            />
            <label 
              htmlFor="agree" 
              className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
            >
              I confirm this is original work and I agree to Adorzia's{" "}
              <a href="#" className="text-accent hover:underline">Publication Terms</a>.
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="accent"
            onClick={handleSubmit}
            disabled={!eligibility.eligible || !agreed || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Submit for Review
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
