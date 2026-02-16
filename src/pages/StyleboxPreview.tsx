import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  Clock, 
  Sparkles, 
  Palette, 
  Layers,
  Target,
  FileText,
  Award,
  Image,
  Ruler,
  Crown,
  AlertTriangle,
  User,
  Building2,
  CheckCircle2,
  Upload,
  XCircle,
  Loader2,
  Zap,
  Shield,
  Wrench,
  Eye,
  Package,
  BookOpen,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";
<<<<<<< HEAD
import { sanitizeInput } from "@/lib/input-sanitizer";
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

type Stylebox = Database["public"]["Tables"]["styleboxes"]["Row"];
type StyleboxSubmission = Database["public"]["Tables"]["stylebox_submissions"]["Row"];

interface ColorEntry {
  name: string;
  hex: string;
  pantone?: string;
  type: string;
  usage_ratio?: number;
}

interface MoodboardImage {
  url: string;
  theme?: string;
  keywords?: string[];
}

interface DeliverableItem {
  id?: string;
  name: string;
  is_required?: boolean;
  required?: boolean;
  description?: string;
}

interface DetailedDeliverable {
  id?: string;
  name: string;
  category: string;
  description: string;
  specifications?: string[];
  file_format?: string;
  required: boolean;
}

interface EvaluationCriterion {
  name: string;
  description: string;
  weight: number;
}

interface Scenario {
  context?: string;
  theme?: string;
  difficulty_spike?: string;
}

interface Constraint {
  type: string;
  label: string;
  value: string;
  is_required?: boolean;
}

const difficultyConfig: Record<string, { color: string; emoji: string; label: string }> = {
  free: { color: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30", emoji: "🟢", label: "FREE" },
  easy: { color: "bg-blue-500/20 text-blue-600 border-blue-500/30", emoji: "🔵", label: "EASY" },
  medium: { color: "bg-amber-500/20 text-amber-600 border-amber-500/30", emoji: "🟡", label: "MEDIUM" },
  hard: { color: "bg-orange-500/20 text-orange-600 border-orange-500/30", emoji: "🟠", label: "HARD" },
  insane: { color: "bg-purple-500/20 text-purple-600 border-purple-500/30", emoji: "🟣", label: "INSANE" },
};

const constraintTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  physics: { icon: Zap, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  construction: { icon: Wrench, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  material: { icon: Layers, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  technical: { icon: Shield, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  aesthetic: { icon: Eye, color: "bg-pink-500/10 text-pink-600 border-pink-500/20" },
};

export default function StyleboxPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [hackLog, setHackLog] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState<string[]>([]);
  const [newFileUrl, setNewFileUrl] = useState("");

  const { data: stylebox, isLoading, error } = useQuery({
    queryKey: ["stylebox-preview", id],
    queryFn: async () => {
      if (!id) throw new Error("No stylebox ID");
      const { data, error } = await supabase
        .from("styleboxes")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Stylebox;
    },
    enabled: !!id,
  });

  const { data: submissions } = useQuery({
    queryKey: ["stylebox-submissions", id, user?.id],
    queryFn: async () => {
      if (!id || !user?.id) return [];
      const { data, error } = await supabase
        .from("stylebox_submissions")
        .select("*")
        .eq("stylebox_id", id)
        .eq("designer_id", user.id)
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data as StyleboxSubmission[];
    },
    enabled: !!id && !!user?.id,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !id) throw new Error("Not authenticated");
      if (submissionFiles.length === 0) throw new Error("Please add at least one file URL");
      
<<<<<<< HEAD
      const sanitizedHackLog = sanitizeInput(hackLog);
      
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      const { error } = await supabase
        .from("stylebox_submissions")
        .insert({
          stylebox_id: id,
          designer_id: user.id,
<<<<<<< HEAD
          description: sanitizedHackLog || null,
=======
          description: hackLog || null,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          submission_files: submissionFiles,
          status: "submitted",
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Submission created successfully!");
      setHackLog("");
      setSubmissionFiles([]);
      queryClient.invalidateQueries({ queryKey: ["stylebox-submissions", id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAddFileUrl = () => {
    if (newFileUrl.trim()) {
      setSubmissionFiles([...submissionFiles, newFileUrl.trim()]);
      setNewFileUrl("");
    }
  };

  const handleRemoveFileUrl = (index: number) => {
    setSubmissionFiles(submissionFiles.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 space-y-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !stylebox) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground mb-4">StyleBox not found</p>
          <Button onClick={() => navigate("/styleboxes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to StyleBoxes
          </Button>
        </div>
      </AppLayout>
    );
  }

  // Parse JSON fields safely
  const colorSystem = (stylebox.color_system as unknown as ColorEntry[] | null) || [];
  const moodboardImages = (stylebox.moodboard_images as unknown as MoodboardImage[] | null) || [];
  const visualKeywords = (stylebox.visual_keywords as unknown as string[] | null) || [];
  const deliverables = (stylebox.deliverables as unknown as DeliverableItem[] | null) || [];
  const detailedDeliverables = (stylebox.detailed_deliverables as unknown as DetailedDeliverable[] | null) || [];
  const evaluationCriteria = (stylebox.evaluation_criteria as unknown as EvaluationCriterion[] | null) || [];
  const designGuidelines = (stylebox.design_guidelines as Record<string, unknown> | null) || {};
  const technicalRequirements = (stylebox.technical_requirements as Record<string, unknown> | null) || {};
  const materialDirection = (stylebox.material_direction as Record<string, unknown> | null) || {};
  const scenario = (stylebox.scenario as unknown as Scenario | null) || {};
  const constraints = (stylebox.constraints as unknown as Constraint[] | null) || [];

  const difficultyInfo = difficultyConfig[stylebox.difficulty] || difficultyConfig.easy;

  // Calculate deliverables checklist
  const requiredDeliverables = detailedDeliverables.filter(d => d.required);
  const optionalDeliverables = detailedDeliverables.filter(d => !d.required);

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Premium Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl" />
          <div className="relative p-6 rounded-2xl border bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/styleboxes")} className="shrink-0">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="space-y-3">
                  {/* Badges Row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {stylebox.studio_name && (
                      <Badge variant="outline" className="gap-1.5 bg-background/80">
                        <Building2 className="h-3 w-3" />
                        {stylebox.studio_name}
                      </Badge>
                    )}
                    <Badge variant="outline" className={difficultyInfo.color}>
                      {difficultyInfo.emoji} {difficultyInfo.label}
                    </Badge>
                    {stylebox.is_featured && (
                      <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">
                    {stylebox.title}
                  </h1>
                  
                  {/* Reward Badge */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-bold text-primary">{stylebox.xp_reward?.toLocaleString() || 100} XP</span>
                    </div>
                    {stylebox.time_limit_hours && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
                        <Clock className="h-4 w-4 text-destructive" />
                        <span className="font-bold text-destructive">{stylebox.time_limit_hours} Hours</span>
                      </div>
                    )}
                    {stylebox.target_role && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="text-sm">{stylebox.target_role}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Download Button */}
              <Button variant="outline" className="shrink-0 gap-2">
                <Download className="h-4 w-4" />
                Download Brief PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* THE INTEL BRIEF */}
            {(scenario.context || scenario.theme || stylebox.description) && (
              <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-primary">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">The Intel Brief</span>
                  </div>
                  <CardTitle className="text-xl">The "What"</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scenario.theme && (
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-medium text-muted-foreground mb-1">TREND</p>
                      <p className="font-semibold text-lg">{scenario.theme}</p>
                    </div>
                  )}
                  
                  {(stylebox.description || scenario.context) && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">THE STORY</p>
                      <p className="text-foreground leading-relaxed">
                        {scenario.context || stylebox.description}
                      </p>
                    </div>
                  )}
                  
                  {scenario.difficulty_spike && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-amber-600 mb-1">⚠️ KEY CHALLENGE</p>
                        <p className="text-sm text-foreground">{scenario.difficulty_spike}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* THE CONSTRAINT MATRIX */}
            {constraints.length > 0 && (
              <Card className="border-destructive/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">The Constraint Matrix</span>
                  </div>
                  <CardTitle className="text-xl">The "Hard Rules"</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {constraints.map((constraint, idx) => {
                      const config = constraintTypeConfig[constraint.type] || constraintTypeConfig.technical;
                      const IconComponent = config.icon;
                      return (
                        <div 
                          key={idx} 
                          className={`p-4 rounded-lg border ${config.color} flex items-start gap-3`}
                        >
                          <div className="h-8 w-8 rounded-lg bg-background/80 flex items-center justify-center shrink-0">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                                {constraint.type}
                              </span>
                              {constraint.is_required && (
                                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Required</Badge>
                              )}
                            </div>
                            <p className="font-medium">{constraint.label}</p>
                            <p className="text-sm text-muted-foreground mt-1">{constraint.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* THE ASSET KIT */}
            {(moodboardImages.length > 0 || Object.keys(materialDirection).length > 0) && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Package className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">The Asset Kit</span>
                  </div>
                  <CardTitle className="text-xl">Your Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Material Direction */}
                  {materialDirection.primary_fabrics && Array.isArray(materialDirection.primary_fabrics) && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">MATERIALS PROVIDED</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(materialDirection.primary_fabrics as Array<{name: string; description: string}>).map((fabric, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-muted/50 border">
                            <p className="font-medium">{fabric.name}</p>
                            <p className="text-sm text-muted-foreground">{fabric.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Moodboard */}
                  {moodboardImages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">MOODBOARD REFERENCES</p>
                      <div className="grid grid-cols-3 gap-2">
                        {moodboardImages.slice(0, 3).map((img, idx) => (
                          <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-muted border">
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                              <Image className="h-8 w-8 text-primary/40" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* COLOR PALETTE */}
            {colorSystem.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Palette className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Color System</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {colorSystem.map((color, idx) => (
                      <div key={idx} className="space-y-2">
                        <div 
                          className="aspect-square rounded-xl border-2 shadow-lg"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="text-center">
                          <p className="font-medium text-sm">{color.name}</p>
                          <p className="text-xs text-muted-foreground">{color.hex}</p>
                          {color.usage_ratio && (
                            <Badge variant="outline" className="mt-1 text-xs">{color.usage_ratio}%</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* THE SUBMISSION TERMINAL */}
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-primary">
                  <Upload className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">The Submission Terminal</span>
                </div>
                <CardTitle className="text-xl">Submit Your Work</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Deliverables Checklist */}
                {detailedDeliverables.length > 0 && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">REQUIRED DELIVERABLES</p>
                      <div className="space-y-2">
                        {requiredDeliverables.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                            <div className="h-5 w-5 rounded border-2 border-destructive/50 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-destructive">{idx + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              {item.file_format && (
                                <Badge variant="outline" className="mt-2 text-xs">{item.file_format}</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {optionalDeliverables.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-3">OPTIONAL BONUS</p>
                        <div className="space-y-2">
                          {optionalDeliverables.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
                              <div className="h-5 w-5 rounded border border-muted-foreground/30 shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* File Upload Section */}
                {user ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>File URLs</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Paste file URL (Google Drive, Dropbox, etc.)"
                          value={newFileUrl}
                          onChange={(e) => setNewFileUrl(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddFileUrl()}
                        />
                        <Button type="button" variant="secondary" onClick={handleAddFileUrl}>
                          Add
                        </Button>
                      </div>
                      {submissionFiles.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {submissionFiles.map((url, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 rounded bg-muted text-sm">
                              <FileText className="h-4 w-4 shrink-0" />
                              <span className="flex-1 truncate">{url}</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={() => handleRemoveFileUrl(idx)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Hack Log */}
                    <div className="space-y-2">
                      <Label htmlFor="hackLog" className="flex items-center gap-2">
                        <span>The Hack Log</span>
                        {stylebox.difficulty === "insane" && (
                          <Badge variant="destructive" className="text-xs">Required for Insane</Badge>
                        )}
                      </Label>
                      <Textarea
                        id="hackLog"
                        placeholder="Explain how you managed the technical challenges. What innovative solutions did you use? This is your chance to showcase your problem-solving skills..."
                        value={hackLog}
                        onChange={(e) => setHackLog(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>

                    <Button 
                      className="w-full h-12 text-base font-semibold gap-2" 
                      size="lg"
                      onClick={() => submitMutation.mutate()}
                      disabled={submitMutation.isPending || submissionFiles.length === 0}
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5" />
                          Submit Entry
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">Sign in to submit your work</p>
                    <Button onClick={() => navigate("/auth")}>Sign In</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Submissions */}
            {submissions && submissions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    My Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="p-4 rounded-lg bg-muted/50 border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(sub.submitted_at), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                          <Badge 
                            variant={
                              sub.status === "approved" ? "default" : 
                              sub.status === "rejected" ? "destructive" : "secondary"
                            }
                          >
                            {sub.status}
                          </Badge>
                        </div>
                        {sub.description && (
                          <p className="text-sm mb-2">{sub.description}</p>
                        )}
                        {sub.score && (
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="h-4 w-4 text-primary" />
                            <span>Score: {sub.score}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Challenge Stats */}
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Challenge Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stylebox.time_limit_hours && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time Limit</p>
                      <p className="font-bold text-lg text-destructive">{stylebox.time_limit_hours} Hours</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">XP Reward</p>
                    <p className="font-bold text-lg text-primary">{stylebox.xp_reward?.toLocaleString() || 100} XP</p>
                  </div>
                </div>

                {stylebox.season && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Season</p>
                      <p className="font-semibold">{stylebox.season}</p>
                    </div>
                  </div>
                )}

                {stylebox.submission_deadline && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="font-semibold">{format(new Date(stylebox.submission_deadline), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Evaluation Criteria */}
            {evaluationCriteria.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Grading Rubric
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {evaluationCriteria.map((criterion, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{criterion.name}</span>
                        <Badge variant="outline">{criterion.weight}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{criterion.description}</p>
                      <Progress value={criterion.weight} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Technical Requirements */}
            {Object.keys(technicalRequirements).length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    Technical Specs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {technicalRequirements.file_formats && (
                      <div>
                        <p className="text-muted-foreground mb-1">File Formats</p>
                        <div className="flex flex-wrap gap-1">
                          {(technicalRequirements.file_formats as string[]).map((format, idx) => (
                            <Badge key={idx} variant="secondary">{format}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {technicalRequirements.resolution && (
                      <div>
                        <p className="text-muted-foreground mb-1">Resolution</p>
                        <p className="font-medium">{technicalRequirements.resolution as string}</p>
                      </div>
                    )}
                    {technicalRequirements.required_views && (
                      <div>
                        <p className="text-muted-foreground mb-1">Required Views</p>
                        <div className="flex flex-wrap gap-1">
                          {(technicalRequirements.required_views as string[]).map((view, idx) => (
                            <Badge key={idx} variant="outline">{view}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
