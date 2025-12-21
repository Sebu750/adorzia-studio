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
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Stylebox = Database["public"]["Tables"]["styleboxes"]["Row"];
type StyleboxSubmission = Database["public"]["Tables"]["stylebox_submissions"]["Row"];

interface ColorEntry {
  name: string;
  hex: string;
  pantone?: string;
  type: "core" | "accent" | "optional";
}

interface MoodboardImage {
  url: string;
  caption?: string;
  tags?: string[];
}

interface DeliverableItem {
  name: string;
  required: boolean;
  naming_convention?: string;
}

interface DetailedDeliverable {
  name: string;
  category: string;
  description: string;
  specifications: string[];
  file_format: string;
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

const difficultyColors: Record<string, string> = {
  free: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
  easy: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  medium: "bg-amber-500/20 text-amber-600 border-amber-500/30",
  hard: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  insane: "bg-red-500/20 text-red-600 border-red-500/30",
};

const categoryColors: Record<string, string> = {
  fashion: "bg-purple-500/20 text-purple-600 border-purple-500/30",
  textile: "bg-teal-500/20 text-teal-600 border-teal-500/30",
  jewelry: "bg-pink-500/20 text-pink-600 border-pink-500/30",
};

export default function StyleboxPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [submissionDescription, setSubmissionDescription] = useState("");
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

  // Fetch user's submissions for this stylebox
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
      
      const { error } = await supabase
        .from("stylebox_submissions")
        .insert({
          stylebox_id: id,
          designer_id: user.id,
          description: submissionDescription || null,
          submission_files: submissionFiles,
          status: "submitted",
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Submission created successfully!");
      setSubmissionDescription("");
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

  const handleDownloadPDF = () => {
    if (stylebox?.pdf_url) {
      window.open(stylebox.pdf_url, "_blank");
    } else {
      toast.info("PDF generation coming soon!");
    }
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
  const constraints = (stylebox.constraints as unknown as string[] | null) || [];

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/styleboxes")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                {stylebox.studio_name && (
                  <Badge variant="outline" className="gap-1 bg-background">
                    <Building2 className="h-3 w-3" />
                    {stylebox.studio_name}
                  </Badge>
                )}
                <Badge variant="outline" className={categoryColors[stylebox.category]}>
                  {stylebox.category.charAt(0).toUpperCase() + stylebox.category.slice(1)}
                </Badge>
                <Badge variant="outline" className={difficultyColors[stylebox.difficulty]}>
                  {stylebox.difficulty.charAt(0).toUpperCase() + stylebox.difficulty.slice(1)}
                </Badge>
                {stylebox.level_number && (
                  <Badge variant="secondary">Level {stylebox.level_number}</Badge>
                )}
                {stylebox.is_featured && (
                  <Badge variant="accent" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight">{stylebox.title}</h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">{stylebox.description}</p>
              
              {stylebox.target_role && (
                <div className="flex items-center gap-2 mt-3">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Target Role: {stylebox.target_role}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF Brief
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Scenario Card */}
            {(scenario.context || scenario.theme || scenario.difficulty_spike) && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Challenge Scenario
                  </CardTitle>
                  {scenario.theme && (
                    <CardDescription className="text-base font-medium text-foreground">
                      Theme: {scenario.theme}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {scenario.context && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Context</h4>
                      <p className="text-foreground">{scenario.context}</p>
                    </div>
                  )}
                  {scenario.difficulty_spike && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm text-amber-600 mb-1">Key Challenge</h4>
                        <p className="text-sm text-foreground">{scenario.difficulty_spike}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Constraints */}
            {constraints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Constraints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {constraints.map((constraint, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="py-2 px-3 text-sm bg-destructive/5 border-destructive/20 text-foreground"
                      >
                        {constraint}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trend Direction */}
            {(stylebox.trend_narrative || stylebox.global_drivers || stylebox.local_relevance) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Trend Direction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stylebox.trend_narrative && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Trend Narrative</h4>
                      <p className="text-foreground">{stylebox.trend_narrative}</p>
                    </div>
                  )}
                  {stylebox.global_drivers && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Global Drivers</h4>
                      <p className="text-foreground">{stylebox.global_drivers}</p>
                    </div>
                  )}
                  {stylebox.local_relevance && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Local Relevance</h4>
                      <p className="text-foreground">{stylebox.local_relevance}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Visual Direction */}
            {(visualKeywords.length > 0 || moodboardImages.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-primary" />
                    Visual Direction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {visualKeywords.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Visual Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {visualKeywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {moodboardImages.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Moodboard</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {moodboardImages.slice(0, 6).map((img, idx) => (
                          <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={img.url} 
                              alt={img.caption || `Moodboard ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Color System */}
            {colorSystem.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Color System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {colorSystem.map((color, idx) => (
                      <div key={idx} className="space-y-2">
                        <div 
                          className="aspect-square rounded-lg border shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div>
                          <p className="font-medium text-sm">{color.name}</p>
                          <p className="text-xs text-muted-foreground">{color.hex}</p>
                          {color.pantone && (
                            <p className="text-xs text-muted-foreground">{color.pantone}</p>
                          )}
                          <Badge variant="outline" className="mt-1 text-xs">
                            {color.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Material Direction */}
            {Object.keys(materialDirection).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Material Direction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(materialDirection).map(([key, value]) => {
                      if (!value || (Array.isArray(value) && value.length === 0)) return null;
                      return (
                        <div key={key}>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2 capitalize">
                            {key.replace(/_/g, " ")}
                          </h4>
                          {Array.isArray(value) ? (
                            <div className="space-y-1">
                              {(value as Array<{ name?: string; description?: string }>).map((item, idx) => (
                                <div key={idx} className="text-sm">
                                  {typeof item === "string" ? item : item.name || JSON.stringify(item)}
                                </div>
                              ))}
                            </div>
                          ) : typeof value === "string" ? (
                            <p className="text-sm">{value}</p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Design Guidelines */}
            {Object.keys(designGuidelines).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    Design Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {designGuidelines.min_pieces && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Collection Size</h4>
                        <p className="text-foreground">
                          {designGuidelines.min_pieces as number} - {(designGuidelines.max_pieces as number) || "∞"} pieces
                        </p>
                      </div>
                    )}
                    {designGuidelines.complexity_notes && (
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Complexity Notes</h4>
                        <p className="text-foreground text-sm">{designGuidelines.complexity_notes as string}</p>
                      </div>
                    )}
                    {designGuidelines.construction_guidance && (
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Construction Guidance</h4>
                        <p className="text-foreground text-sm">{designGuidelines.construction_guidance as string}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detailed Deliverables */}
            {detailedDeliverables.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Required Deliverables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {detailedDeliverables.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-muted/50 border">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{item.name}</span>
                            <Badge variant="outline" className="text-xs">{item.category}</Badge>
                          </div>
                          {item.required ? (
                            <Badge variant="destructive" className="text-xs shrink-0">Required</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs shrink-0">Optional</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <FileText className="h-3 w-3" />
                          <span>Format: {item.file_format}</span>
                        </div>
                        {item.specifications && item.specifications.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Specifications:</p>
                            <ul className="text-xs text-muted-foreground space-y-0.5">
                              {item.specifications.map((spec, specIdx) => (
                                <li key={specIdx} className="flex items-center gap-2">
                                  <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                                  {spec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Legacy Deliverables (fallback) */}
            {deliverables.length > 0 && detailedDeliverables.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Deliverables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={`h-2 w-2 rounded-full mt-2 ${item.required ? "bg-destructive" : "bg-muted-foreground"}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.name}</span>
                            {item.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                          </div>
                          {item.naming_convention && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Naming: {item.naming_convention}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Evaluation Criteria */}
            {evaluationCriteria.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Evaluation Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {evaluationCriteria.map((criterion, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{criterion.name}</span>
                          <Badge variant="secondary">{criterion.weight}%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{criterion.description}</p>
                        <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${criterion.weight}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submission Section */}
            {user && (
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Submit Your Work
                  </CardTitle>
                  <CardDescription>
                    Add your deliverable file URLs and submit your entry
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your submission, approach, or any notes for reviewers..."
                      value={submissionDescription}
                      onChange={(e) => setSubmissionDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
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

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => submitMutation.mutate()}
                    disabled={submitMutation.isPending || submissionFiles.length === 0}
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Entry
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

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
            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Challenge Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stylebox.time_limit_hours && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time Limit</p>
                      <p className="font-bold text-lg">{stylebox.time_limit_hours} hours</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">XP Reward</p>
                    <p className="font-semibold">{stylebox.xp_reward || 100} XP</p>
                  </div>
                </div>
                
                {stylebox.season && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Season</p>
                      <p className="font-semibold">{stylebox.season}</p>
                    </div>
                  </div>
                )}

                {stylebox.collection_size && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Collection Size</p>
                      <p className="font-semibold">{stylebox.collection_size} pieces</p>
                    </div>
                  </div>
                )}

                {stylebox.submission_deadline && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-semibold">{format(new Date(stylebox.submission_deadline), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                )}

                {stylebox.required_subscription_tier && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Required Tier</p>
                      <p className="font-semibold capitalize">{stylebox.required_subscription_tier}</p>
                    </div>
                  </div>
                )}

                <Separator />

                <Button variant="outline" className="w-full" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Brief
                </Button>
              </CardContent>
            </Card>

            {/* Technical Requirements */}
            {Object.keys(technicalRequirements).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {technicalRequirements.file_formats && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">File Formats</p>
                      <div className="flex flex-wrap gap-1">
                        {(technicalRequirements.file_formats as string[]).map((format, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{format}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {technicalRequirements.image_resolution && (
                    <div>
                      <p className="text-sm text-muted-foreground">Resolution</p>
                      <p className="font-medium">{technicalRequirements.image_resolution as string}</p>
                    </div>
                  )}
                  {technicalRequirements.required_views && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Required Views</p>
                      <div className="flex flex-wrap gap-1">
                        {(technicalRequirements.required_views as string[]).map((view, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{view}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
