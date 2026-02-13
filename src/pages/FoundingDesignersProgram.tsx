import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Info,
  ArrowRight,
  Eye,
  Edit3
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { 
  useFoundingSubmissions, 
  useCreateFoundingSubmission, 
  useUpdateFoundingSubmission,
  uploadFoundingFile, 
  FoundingSubmissionInput,
  FoundingArticle 
} from "@/hooks/useFoundingSubmissions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const initialArticle: FoundingArticle = {
  name: "",
  category: "womenswear",
  fabric_material: "",
  colors: "",
  size_range: "",
  estimated_price: 0,
  timeline: "4-6 weeks",
  description: "",
  images: [],
};

const initialFormData: FoundingSubmissionInput = {
  collection_name: "",
  design_philosophy: "",
  designer_vision_statement: "",
  primary_category: "womenswear",
  moodboard_files: [],
  tech_pack_files: [],
  articles: [],
  estimated_articles: 2,
  proposed_materials: "",
  target_seasonal_launch: "spring_summer",
  originality_certified: true,
  program_terms_accepted: true,
  is_draft: true,
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Submitted", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: FileText },
  under_review: { label: "Under Review", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
  approved: { label: "Approved", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive border-destructive/20", icon: X },
  revisions_required: { label: "Feedback Received", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: Info },
};

export default function FoundingDesignersProgram() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: submissions, isLoading: loadingSubmissions } = useFoundingSubmissions();
  const createSubmission = useCreateFoundingSubmission();
  const updateSubmission = useUpdateFoundingSubmission();

  const activeSubmission = submissions?.find(s => s.status !== 'rejected') || submissions?.[0];
  
  const [formData, setFormData] = React.useState<FoundingSubmissionInput>(initialFormData);
  const [isEditing, setIsEditing] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(false);
  const [activeArticleIndex, setActiveArticleIndex] = React.useState<number | null>(null);

  // Sync with existing submission
  React.useEffect(() => {
    if (activeSubmission) {
      setFormData({
        collection_name: activeSubmission.collection_name,
        design_philosophy: activeSubmission.design_philosophy,
        designer_vision_statement: activeSubmission.designer_vision_statement || "",
        primary_category: activeSubmission.primary_category,
        moodboard_files: activeSubmission.moodboard_files,
        tech_pack_files: activeSubmission.tech_pack_files,
        articles: activeSubmission.articles || [],
        estimated_articles: activeSubmission.estimated_articles,
        proposed_materials: activeSubmission.proposed_materials,
        target_seasonal_launch: activeSubmission.target_seasonal_launch,
        originality_certified: activeSubmission.originality_certified,
        program_terms_accepted: activeSubmission.program_terms_accepted,
        is_draft: activeSubmission.is_draft,
      });
      
      // Lock editing if submitted and not revisions_required
      if (!activeSubmission.is_draft && activeSubmission.status !== 'revisions_required') {
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    }
  }, [activeSubmission]);

  const handleAddArticle = () => {
    if (formData.articles.length >= 3) {
      toast({
        title: "Limit Reached",
        description: "You can add maximum 3 articles for your founding collection.",
        variant: "destructive"
      });
      return;
    }
    setFormData(prev => ({
      ...prev,
      articles: [...prev.articles, { ...initialArticle }]
    }));
    setActiveArticleIndex(formData.articles.length);
  };

  const handleRemoveArticle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      articles: prev.articles.filter((_, i) => i !== index)
    }));
    if (activeArticleIndex === index) setActiveArticleIndex(null);
  };

  const updateArticle = (index: number, data: Partial<FoundingArticle>) => {
    setFormData(prev => ({
      ...prev,
      articles: prev.articles.map((art, i) => i === index ? { ...art, ...data } : art)
    }));
  };

  const handleImageUpload = React.useCallback(async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const url = await uploadFoundingFile(file, 'moodboard'); // Reusing bucket
        uploadedUrls.push(url);
      }
      
      const currentImages = formData.articles[index].images;
      updateArticle(index, { images: [...currentImages, ...uploadedUrls] });
      
      toast({ title: "Images Uploaded" });
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  }, [formData.articles, toast]);

  const checklist = {
    details: !!formData.collection_name && !!formData.design_philosophy && !!formData.designer_vision_statement,
    count: formData.articles.length >= 2 && formData.articles.length <= 3,
    complete: formData.articles.every(a => !!a.name && !!a.category && a.images.length > 0),
  };

  const isReadyToSubmit = checklist.details && checklist.count && checklist.complete;

  const handleSaveDraft = async () => {
    if (activeSubmission) {
      await updateSubmission.mutateAsync({ id: activeSubmission.id, input: { ...formData, is_draft: true } });
    } else {
      await createSubmission.mutateAsync({ ...formData, is_draft: true });
    }
  };

  const handleSubmit = async () => {
    if (!isReadyToSubmit) return;
    
    if (activeSubmission) {
      await updateSubmission.mutateAsync({ id: activeSubmission.id, input: { ...formData, is_draft: false } });
    } else {
      await createSubmission.mutateAsync({ ...formData, is_draft: false });
    }
  };

  if (loadingSubmissions) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-display font-bold tracking-tight">
                {isEditing ? "Submit Your First Collection" : "Collection Summary"}
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                This collection represents your design vision on Adorzia. 
                All designers can submit one founding collection consisting of 2–3 articles.
              </p>
            </div>
            {activeSubmission && (
              <Badge className={cn("px-3 py-1 text-sm border", statusConfig[activeSubmission.status]?.color)}>
                {statusConfig[activeSubmission.status]?.label}
              </Badge>
            )}
          </div>
          
          {activeSubmission?.status === 'revisions_required' && activeSubmission.admin_feedback && (
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-orange-800">Feedback from Adorzia Team</p>
                  <p className="text-sm text-orange-700">{activeSubmission.admin_feedback}</p>
                  <Button variant="link" className="p-0 h-auto text-orange-800 font-bold" onClick={() => setIsEditing(true)}>
                    Edit & Resubmit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </header>

        {isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Collection Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Collection Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="collection_name">Collection Name</Label>
                    <Input 
                      id="collection_name"
                      placeholder="e.g. Summer Solstice 2026"
                      value={formData.collection_name}
                      onChange={(e) => setFormData({ ...formData, collection_name: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Give your collection a clear, memorable name.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="design_philosophy">Collection Description</Label>
                    <Textarea 
                      id="design_philosophy"
                      placeholder="Briefly describe the theme, mood, and inspiration..."
                      value={formData.design_philosophy}
                      onChange={(e) => setFormData({ ...formData, design_philosophy: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vision_statement">Designer Vision Statement</Label>
                    <Textarea 
                      id="vision_statement"
                      placeholder="Explain what defines you as a designer..."
                      value={formData.designer_vision_statement}
                      onChange={(e) => setFormData({ ...formData, designer_vision_statement: e.target.value })}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Articles Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Articles (2–3 Required)</h3>
                    <p className="text-sm text-muted-foreground">
                      Articles Added: {formData.articles.length} / 3
                    </p>
                  </div>
                  {formData.articles.length < 3 && (
                    <Button variant="outline" size="sm" onClick={handleAddArticle} className="gap-2">
                      <Plus className="h-4 w-4" /> Add Article
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {formData.articles.map((article, index) => (
                      <Card key={index} className="overflow-hidden border-muted-foreground/20">
                        <div 
                          className="p-4 bg-muted/30 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setActiveArticleIndex(activeArticleIndex === index ? null : index)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {index + 1}
                            </div>
                            <span className="font-semibold">{article.name || "Untitled Article"}</span>
                            {!article.name && <Badge variant="secondary" className="text-[10px] h-4">Incomplete</Badge>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); handleRemoveArticle(index); }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {activeArticleIndex === index ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </div>
                        </div>

                        {activeArticleIndex === index && (
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <CardContent className="p-6 space-y-6 bg-card">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label>Article Name</Label>
                                  <Input 
                                    value={article.name}
                                    onChange={(e) => updateArticle(index, { name: e.target.value })}
                                    placeholder="Silk Embroidered Kaftan"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Category</Label>
                                  <Select 
                                    value={article.category}
                                    onValueChange={(val) => updateArticle(index, { category: val })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="womenswear">Womenswear</SelectItem>
                                      <SelectItem value="menswear">Menswear</SelectItem>
                                      <SelectItem value="unisex">Unisex</SelectItem>
                                      <SelectItem value="accessories">Accessories</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Fabric / Material</Label>
                                  <Input 
                                    value={article.fabric_material}
                                    onChange={(e) => updateArticle(index, { fabric_material: e.target.value })}
                                    placeholder="100% Raw Silk"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Color(s)</Label>
                                  <Input 
                                    value={article.colors}
                                    onChange={(e) => updateArticle(index, { colors: e.target.value })}
                                    placeholder="Indigo, Ivory"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Size Range</Label>
                                  <Input 
                                    value={article.size_range}
                                    onChange={(e) => updateArticle(index, { size_range: e.target.value })}
                                    placeholder="XS - XL"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Estimated Price ($)</Label>
                                  <Input 
                                    type="number"
                                    value={article.estimated_price}
                                    onChange={(e) => updateArticle(index, { estimated_price: Number(e.target.value) })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Made-to-Order Timeline</Label>
                                  <Input 
                                    value={article.timeline}
                                    onChange={(e) => updateArticle(index, { timeline: e.target.value })}
                                    placeholder="4-6 weeks"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Article Description</Label>
                                <Textarea 
                                  value={article.description}
                                  onChange={(e) => updateArticle(index, { description: e.target.value })}
                                  placeholder="Describe the design, silhouette, and key details..."
                                  rows={3}
                                />
                              </div>

                              <div className="space-y-4">
                                <Label>Images (Min 1 required)</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  {article.images.map((img, i) => (
                                    <div key={i} className="group relative aspect-square rounded-lg overflow-hidden border">
                                      <img src={img} alt="Article" className="w-full h-full object-cover" />
                                      <button 
                                        className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => updateArticle(index, { images: article.images.filter((_, idx) => idx !== i) })}
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                  <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all">
                                    <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                                    <span className="text-[10px] text-muted-foreground">Upload</span>
                                    <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleImageUpload(index, e)} />
                                  </label>
                                </div>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </Card>
                    ))}
                  </AnimatePresence>
                  
                  {formData.articles.length === 0 && (
                    <div className="text-center p-12 border-2 border-dashed rounded-xl bg-muted/20">
                      <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">Add minimum 2 and maximum 3 articles to begin.</p>
                      <Button variant="outline" className="mt-4 gap-2" onClick={handleAddArticle}>
                        <Plus className="h-4 w-4" /> Add First Article
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Sticky Checklist */}
            <div className="space-y-6 lg:sticky lg:top-24 h-fit">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Submission Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    {checklist.details ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <Clock className="h-5 w-5 text-muted-foreground shrink-0" />}
                    <span className={cn("text-sm", checklist.details ? "text-emerald-700 font-medium" : "text-muted-foreground")}>
                      Collection identity completed
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    {checklist.count ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <Clock className="h-5 w-5 text-muted-foreground shrink-0" />}
                    <span className={cn("text-sm", checklist.count ? "text-emerald-700 font-medium" : "text-muted-foreground")}>
                      2–3 articles added
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    {checklist.complete ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <Clock className="h-5 w-5 text-muted-foreground shrink-0" />}
                    <span className={cn("text-sm", checklist.complete ? "text-emerald-700 font-medium" : "text-muted-foreground")}>
                      All articles have required details
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={!isReadyToSubmit || createSubmission.isPending} onClick={handleSubmit}>
                    {createSubmission.isPending ? "Submitting..." : "Submit Collection"}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleSaveDraft} disabled={createSubmission.isPending}>
                    Save as Draft
                  </Button>
                </CardFooter>
              </Card>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-xs flex gap-3">
                <Info className="h-4 w-4 shrink-0" />
                <p>
                  Once submitted, our curation team will review your collection. 
                  Editing will be locked until review is complete.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Post-Submission Read-Only View */
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Collection Summary</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Submitted: {activeSubmission?.submitted_at ? format(new Date(activeSubmission.submitted_at), "MMM d, yyyy") : "N/A"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Collection Name</Label>
                      <p className="font-semibold text-lg">{formData.collection_name}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Description</Label>
                      <p className="text-sm leading-relaxed">{formData.design_philosophy}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Vision Statement</Label>
                    <p className="text-sm italic leading-relaxed bg-muted/30 p-4 rounded-lg">"{formData.designer_vision_statement}"</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="font-bold text-xl">Included Articles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.articles.map((article, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-xl border bg-muted/10 group hover:bg-muted/20 transition-all">
                        <div className="h-24 w-24 rounded-lg overflow-hidden shrink-0 border bg-white">
                          <img src={article.images[0]} alt={article.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-bold">{article.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{article.category} • {article.fabric_material}</p>
                          <p className="text-xs font-medium text-emerald-600 mt-2">${article.estimated_price}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 p-6 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Status: <span className="font-bold uppercase tracking-wider">{activeSubmission?.status.replace('_', ' ')}</span>
                </p>
                {activeSubmission?.status === 'revisions_required' && (
                  <Button onClick={() => setIsEditing(true)}>Edit & Resubmit</Button>
                )}
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
