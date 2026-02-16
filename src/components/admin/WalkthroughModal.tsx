import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  BookOpen,
  Sparkles,
  Lock,
  Calendar,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type Stylebox = Database["public"]["Tables"]["styleboxes"]["Row"];

interface WalkthroughStep {
  title: string;
  description: string;
  instructions: string[];
  tips: string[];
  deliverable: string;
}

interface WalkthroughModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walkthrough: Stylebox | null;
}

const defaultStep: WalkthroughStep = {
  title: "",
  description: "",
  instructions: [],
  tips: [],
  deliverable: "",
};

export function WalkthroughModal({ open, onOpenChange, walkthrough }: WalkthroughModalProps) {
  const { toast } = useToast();
  const { user } = useAdminAuth();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"fashion" | "textile" | "jewelry">("fashion");
  const [difficulty, setDifficulty] = useState<"free" | "easy" | "medium" | "hard" | "insane">("easy");
  const [xpReward, setXpReward] = useState(50);
  const [status, setStatus] = useState<"draft" | "active" | "archived">("draft");
  const [steps, setSteps] = useState<WalkthroughStep[]>([{ ...defaultStep }]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [requiredSubscription, setRequiredSubscription] = useState<string>("none");
  const [requiredRankOrder, setRequiredRankOrder] = useState<string>("none");
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [archiveDate, setArchiveDate] = useState<string>("");
  const [activeTab, setActiveTab] = useState("basic");

  // Reset form when modal opens/closes or walkthrough changes
  useEffect(() => {
    if (walkthrough) {
      setTitle(walkthrough.title);
      setDescription(walkthrough.description || "");
      setCategory(walkthrough.category);
      setDifficulty(walkthrough.difficulty);
      setXpReward(walkthrough.xp_reward || 50);
      setStatus(walkthrough.status);
      setIsFeatured(walkthrough.is_featured || false);
      setRequiredSubscription(walkthrough.required_subscription_tier || "none");
      setRequiredRankOrder(walkthrough.required_rank_order?.toString() || "none");
      setReleaseDate(walkthrough.release_date ? walkthrough.release_date.split("T")[0] : "");
      setArchiveDate(walkthrough.archive_date ? walkthrough.archive_date.split("T")[0] : "");
      
      const parsedSteps = Array.isArray(walkthrough.steps) 
        ? (walkthrough.steps as unknown as WalkthroughStep[])
        : [{ ...defaultStep }];
      setSteps(parsedSteps.length > 0 ? parsedSteps : [{ ...defaultStep }]);
    } else {
      setTitle("");
      setDescription("");
      setCategory("fashion");
      setDifficulty("easy");
      setXpReward(50);
      setStatus("draft");
      setSteps([{ ...defaultStep }]);
      setIsFeatured(false);
      setRequiredSubscription("none");
      setRequiredRankOrder("none");
      setReleaseDate("");
      setArchiveDate("");
    }
    setActiveTab("basic");
  }, [walkthrough, open]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        title,
        description,
        category,
        difficulty,
        xp_reward: xpReward,
        status,
        is_walkthrough: true,
        is_featured: isFeatured,
        steps: steps as unknown as Database["public"]["Tables"]["styleboxes"]["Insert"]["steps"],
        required_subscription_tier: requiredSubscription === "none" ? null : requiredSubscription as Database["public"]["Enums"]["subscription_tier"],
        required_rank_order: requiredRankOrder === "none" ? null : parseInt(requiredRankOrder),
        release_date: releaseDate ? new Date(releaseDate).toISOString() : null,
        archive_date: archiveDate ? new Date(archiveDate).toISOString() : null,
        version: walkthrough ? (walkthrough.version || 1) + 1 : 1,
        created_by: walkthrough?.created_by || user?.id,
      };

      if (walkthrough) {
        const { error } = await supabase
          .from("styleboxes")
          .update(data)
          .eq("id", walkthrough.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("styleboxes").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-walkthroughs"] });
      toast({
        title: walkthrough ? "Walkthrough updated" : "Walkthrough created",
        description: walkthrough 
          ? "Changes have been saved successfully." 
          : "New walkthrough has been created.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save walkthrough. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const addStep = () => {
    setSteps([...steps, { ...defaultStep }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index: number, field: keyof WalkthroughStep, value: string | string[]) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const addInstruction = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].instructions = [...newSteps[stepIndex].instructions, ""];
    setSteps(newSteps);
  };

  const updateInstruction = (stepIndex: number, instrIndex: number, value: string) => {
    const newSteps = [...steps];
    newSteps[stepIndex].instructions[instrIndex] = value;
    setSteps(newSteps);
  };

  const removeInstruction = (stepIndex: number, instrIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].instructions = newSteps[stepIndex].instructions.filter((_, i) => i !== instrIndex);
    setSteps(newSteps);
  };

  const addTip = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].tips = [...newSteps[stepIndex].tips, ""];
    setSteps(newSteps);
  };

  const updateTip = (stepIndex: number, tipIndex: number, value: string) => {
    const newSteps = [...steps];
    newSteps[stepIndex].tips[tipIndex] = value;
    setSteps(newSteps);
  };

  const removeTip = (stepIndex: number, tipIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].tips = newSteps[stepIndex].tips.filter((_, i) => i !== tipIndex);
    setSteps(newSteps);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-admin-wine" />
            {walkthrough ? "Edit Walkthrough" : "Create Walkthrough"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="modules">Modules ({steps.length})</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="basic" className="space-y-4 pr-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Master Fashion Illustration"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what designers will learn..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Track/Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
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
                  <Label>Difficulty</Label>
                  <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="insane">Insane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="xp">SC Reward</Label>
                  <Input
                    id="xp"
                    type="number"
                    min={0}
                    max={200}
                    value={xpReward}
                    onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
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

                <div className="flex items-center justify-between md:col-span-2 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <div>
                      <Label>Featured Walkthrough</Label>
                      <p className="text-xs text-muted-foreground">
                        Highlight this walkthrough on the main page
                      </p>
                    </div>
                  </div>
                  <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="modules" className="space-y-4 pr-4">
              {steps.map((step, stepIndex) => (
                <Card key={stepIndex} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <Badge variant="outline">Module {stepIndex + 1}</Badge>
                      </div>
                      {steps.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStep(stepIndex)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Module Title</Label>
                      <Input
                        value={step.title}
                        onChange={(e) => updateStep(stepIndex, "title", e.target.value)}
                        placeholder="e.g., Creative Direction & Understanding the Brief"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={step.description}
                        onChange={(e) => updateStep(stepIndex, "description", e.target.value)}
                        placeholder="Describe what this module covers..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Instructions</Label>
                        <Button variant="ghost" size="sm" onClick={() => addInstruction(stepIndex)}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {step.instructions.map((instr, instrIndex) => (
                          <div key={instrIndex} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-4">{instrIndex + 1}.</span>
                            <Input
                              value={instr}
                              onChange={(e) => updateInstruction(stepIndex, instrIndex, e.target.value)}
                              placeholder="Add an instruction step..."
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeInstruction(stepIndex, instrIndex)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {step.instructions.length === 0 && (
                          <p className="text-xs text-muted-foreground italic">
                            No instructions added yet
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Pro Tips</Label>
                        <Button variant="ghost" size="sm" onClick={() => addTip(stepIndex)}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {step.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-center gap-2">
                            <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                            <Input
                              value={tip}
                              onChange={(e) => updateTip(stepIndex, tipIndex, e.target.value)}
                              placeholder="Add a helpful tip..."
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTip(stepIndex, tipIndex)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Deliverable</Label>
                      <Textarea
                        value={step.deliverable}
                        onChange={(e) => updateStep(stepIndex, "deliverable", e.target.value)}
                        placeholder="Describe what the designer should submit..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" onClick={addStep} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Module
              </Button>
            </TabsContent>

            <TabsContent value="access" className="space-y-4 pr-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Access Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Required Subscription Tier</Label>
                    <Select value={requiredSubscription} onValueChange={setRequiredSubscription}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Requirement (Free)</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="elite">Elite</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Users without this subscription will see the walkthrough as locked
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Required Rank Level</Label>
                    <Select value={requiredRankOrder} onValueChange={setRequiredRankOrder}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Requirement</SelectItem>
                        <SelectItem value="1">Novice (Level 1)</SelectItem>
                        <SelectItem value="2">Apprentice (Level 2)</SelectItem>
                        <SelectItem value="3">Designer (Level 3)</SelectItem>
                        <SelectItem value="4">Senior Designer (Level 4)</SelectItem>
                        <SelectItem value="5">Lead Designer (Level 5)</SelectItem>
                        <SelectItem value="6">Elite Designer (Level 6)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Users below this rank will see the walkthrough as locked
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduling" className="space-y-4 pr-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Release Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Release Date</Label>
                    <Input
                      type="date"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Schedule when this walkthrough becomes visible to users
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Archive Date</Label>
                    <Input
                      type="date"
                      value={archiveDate}
                      onChange={(e) => setArchiveDate(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Automatically archive this walkthrough after this date
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !title.trim()}
            className="bg-admin-wine hover:bg-admin-wine/90 gap-2"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? "Saving..." : "Save Walkthrough"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
