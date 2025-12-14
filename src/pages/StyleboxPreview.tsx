import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
  Crown
} from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Stylebox = Database["public"]["Tables"]["styleboxes"]["Row"];

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

interface EvaluationCriterion {
  name: string;
  description: string;
  weight: number;
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

  const handleDownloadPDF = () => {
    // PDF download functionality - could integrate with a PDF library
    // For now, show a toast or open the pdf_url if available
    if (stylebox?.pdf_url) {
      window.open(stylebox.pdf_url, "_blank");
    } else {
      // Could trigger PDF generation here
      alert("PDF generation coming soon! This will create a comprehensive design brief.");
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
  const evaluationCriteria = (stylebox.evaluation_criteria as unknown as EvaluationCriterion[] | null) || [];
  const designGuidelines = (stylebox.design_guidelines as Record<string, unknown> | null) || {};
  const technicalRequirements = (stylebox.technical_requirements as Record<string, unknown> | null) || {};
  const materialDirection = (stylebox.material_direction as Record<string, unknown> | null) || {};

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
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className={categoryColors[stylebox.category]}>
                  {stylebox.category.charAt(0).toUpperCase() + stylebox.category.slice(1)}
                </Badge>
                <Badge variant="outline" className={difficultyColors[stylebox.difficulty]}>
                  {stylebox.difficulty.charAt(0).toUpperCase() + stylebox.difficulty.slice(1)}
                </Badge>
                {stylebox.is_featured && (
                  <Badge variant="accent" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight">{stylebox.title}</h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">{stylebox.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF Brief
            </Button>
            <Button>
              Start Challenge
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* Deliverables */}
            {deliverables.length > 0 && (
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
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Challenge Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <Button className="w-full" size="lg">
                  Start Challenge
                </Button>
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