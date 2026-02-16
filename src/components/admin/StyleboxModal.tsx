import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
<<<<<<< HEAD
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
=======
import { supabase } from "@/integrations/supabase/client";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { useToast } from "@/hooks/use-toast";
import { Save, Send, X, Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import type { Json } from "@/integrations/supabase/types";
<<<<<<< HEAD
import { sanitizeTitle, sanitizeInput } from "@/lib/input-sanitizer";
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

type Stylebox = Database["public"]["Tables"]["styleboxes"]["Row"];
type StyleboxInsert = Database["public"]["Tables"]["styleboxes"]["Insert"];
type StyleboxUpdate = Database["public"]["Tables"]["styleboxes"]["Update"];
type StyleboxDifficulty = Database["public"]["Enums"]["stylebox_difficulty"];
type DesignerCategory = Database["public"]["Enums"]["designer_category"];
type ContentStatus = Database["public"]["Enums"]["content_status"];

interface StyleboxModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stylebox?: Stylebox | null;
}

const DELIVERABLE_OPTIONS = [
  "Moodboard",
  "Sketch",
  "Color Palette",
  "Styled Mockup",
  "3D Mockup",
  "Vision Statement",
  "Tech Pack",
  "Pattern Design",
  "Material Notes",
  "Technical Description",
];

export function StyleboxModal({ open, onOpenChange, stylebox }: StyleboxModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!stylebox;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "fashion" as DesignerCategory,
    difficulty: "easy" as StyleboxDifficulty,
    xp_reward: 100,
    brief: "",
    deliverables: [] as string[],
    status: "draft" as ContentStatus,
  });

  useEffect(() => {
    if (stylebox) {
      const deliverables = Array.isArray(stylebox.deliverables) 
        ? (stylebox.deliverables as string[])
        : [];
      const briefText = typeof stylebox.brief === 'object' && stylebox.brief !== null
        ? JSON.stringify(stylebox.brief, null, 2)
        : "";
        
      setFormData({
        title: stylebox.title,
        description: stylebox.description || "",
        category: stylebox.category,
        difficulty: stylebox.difficulty,
        xp_reward: stylebox.xp_reward || 100,
        brief: briefText,
        deliverables,
        status: stylebox.status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "fashion",
        difficulty: "easy",
        xp_reward: 100,
        brief: "",
        deliverables: [],
        status: "draft",
      });
    }
  }, [stylebox, open]);

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
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create StyleBox. Please try again.",
        variant: "destructive",
      });
      console.error(error);
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

  const handleSubmit = (publishNow: boolean) => {
<<<<<<< HEAD
    const sanitizedTitle = sanitizeTitle(formData.title);
    const sanitizedDescription = sanitizeInput(formData.description);
    const sanitizedBrief = sanitizeInput(formData.brief);
    
    if (!sanitizedTitle.trim()) {
=======
    if (!formData.title.trim()) {
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      toast({
        title: "Validation error",
        description: "Title is required.",
        variant: "destructive",
      });
      return;
    }

    let briefJson: Json = null;
<<<<<<< HEAD
    if (sanitizedBrief.trim()) {
      try {
        briefJson = JSON.parse(sanitizedBrief);
      } catch {
        briefJson = { content: sanitizedBrief };
=======
    if (formData.brief.trim()) {
      try {
        briefJson = JSON.parse(formData.brief);
      } catch {
        briefJson = { content: formData.brief };
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      }
    }

    const data = {
<<<<<<< HEAD
      title: sanitizedTitle.trim(),
      description: sanitizedDescription.trim() || null,
=======
      title: formData.title.trim(),
      description: formData.description.trim() || null,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      category: formData.category,
      difficulty: formData.difficulty,
      xp_reward: formData.xp_reward,
      brief: briefJson,
      deliverables: formData.deliverables as unknown as Json,
      status: publishNow ? "active" as ContentStatus : formData.status,
    };

    if (isEditing && stylebox) {
      updateMutation.mutate({ id: stylebox.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const toggleDeliverable = (deliverable: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.includes(deliverable)
        ? prev.deliverables.filter(d => d !== deliverable)
        : [...prev.deliverables, deliverable],
    }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEditing ? "Edit StyleBox" : "Create New StyleBox"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Minimalist Streetwear Capsule"
            />
          </div>

          {/* Category & Difficulty Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, category: v as DesignerCategory }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="textile">Textile</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty *</Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, difficulty: v as StyleboxDifficulty }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="insane">Insane</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* XP & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
<<<<<<< HEAD
              <Label htmlFor="xp">SC Reward</Label>
=======
              <Label htmlFor="xp">XP Reward</Label>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              <Input
                id="xp"
                type="number"
                min={0}
                step={25}
                value={formData.xp_reward}
                onChange={(e) => setFormData(prev => ({ ...prev, xp_reward: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as ContentStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description / Brief</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the challenge, target audience, and design goals..."
              className="min-h-[100px]"
            />
          </div>

          {/* Brief JSON (Advanced) */}
          <div className="space-y-2">
            <Label htmlFor="brief">Brief Details (JSON or text)</Label>
            <Textarea
              id="brief"
              value={formData.brief}
              onChange={(e) => setFormData(prev => ({ ...prev, brief: e.target.value }))}
              placeholder='{"focus": "...", "target_market": "...", "style": "..."}'
              className="min-h-[80px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Add structured brief data in JSON format for advanced filtering.
            </p>
          </div>

          {/* Deliverables */}
          <div className="space-y-3">
            <Label>Deliverables</Label>
            <div className="grid grid-cols-2 gap-2">
              {DELIVERABLE_OPTIONS.map((deliverable) => (
                <div key={deliverable} className="flex items-center space-x-2">
                  <Checkbox
                    id={deliverable}
                    checked={formData.deliverables.includes(deliverable)}
                    onCheckedChange={() => toggleDeliverable(deliverable)}
                  />
                  <label
                    htmlFor={deliverable}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {deliverable}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleSubmit(false)}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save as Draft
            </Button>
            <Button 
              onClick={() => handleSubmit(true)}
              disabled={isLoading}
              className="bg-admin-wine hover:bg-admin-wine/90"
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Publish Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
