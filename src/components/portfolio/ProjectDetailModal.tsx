import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  X,
  Edit2,
  Save,
  Trash2,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  Star,
  StarOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ProjectAsset {
  id: string;
  file_url: string;
  file_name: string;
  display_order: number;
}

interface ProjectDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onDelete?: () => void;
}

export function ProjectDetailModal({
  open,
  onOpenChange,
  projectId,
  onDelete,
}: ProjectDetailModalProps) {
  const queryClient = useQueryClient();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [project, setProject] = useState<any>(null);
  const [assets, setAssets] = useState<ProjectAsset[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch project details
  const fetchProject = async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from("portfolio_projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError) throw projectError;

      setProject(projectData);
      setTitle(projectData.title || "");
      setDescription(projectData.description || "");
      setCategory(projectData.category || "");
      setTags(projectData.tags || []);

      // Fetch assets
      const { data: assetsData, error: assetsError } = await supabase
        .from("portfolio_assets")
        .select("id, file_url, file_name, display_order")
        .eq("project_id", projectId)
        .order("display_order", { ascending: true });

      if (assetsError) throw assetsError;

      setAssets(assetsData || []);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  // Save changes mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("portfolio_projects")
        .update({
          title,
          description: description || null,
          category: category || null,
          tags: tags.length > 0 ? tags : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-projects"] });
      setEditMode(false);
      fetchProject();
    },
    onError: (error) => {
      toast.error("Failed to update project: " + error.message);
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("portfolio_projects")
        .update({ is_featured: !project?.is_featured })
        .eq("id", projectId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(project?.is_featured ? "Removed from featured" : "Added to featured");
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      fetchProject();
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      // Delete assets first
      const { error: assetsError } = await supabase
        .from("portfolio_assets")
        .delete()
        .eq("project_id", projectId);

      if (assetsError) throw assetsError;

      // Delete project
      const { error: projectError } = await supabase
        .from("portfolio_projects")
        .delete()
        .eq("id", projectId);

      if (projectError) throw projectError;
    },
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-projects"] });
      onOpenChange(false);
      onDelete?.();
    },
    onError: (error) => {
      toast.error("Failed to delete project: " + error.message);
    },
  });

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? assets.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === assets.length - 1 ? 0 : prev + 1));
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/portfolio/${projectId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  // Load project when modal opens
  useState(() => {
    if (open && projectId) {
      fetchProject();
    }
  });

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-display">
              {editMode ? "Edit Project" : project?.title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {!editMode && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleFeaturedMutation.mutate()}
                    disabled={toggleFeaturedMutation.isPending}
                  >
                    {project?.is_featured ? (
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    ) : (
                      <StarOff className="h-5 w-5" />
                    )}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditMode(true)}
                  >
                    <Edit2 className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </>
              )}
              <Button size="icon" variant="ghost" onClick={() => onOpenChange(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Image Gallery */}
          {assets.length > 0 && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={assets[currentImageIndex]?.file_url}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                {assets.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {assets.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {assets.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {assets.map((asset, index) => (
                    <button
                      key={asset.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                        currentImageIndex === index
                          ? "border-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img
                        src={asset.file_url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Project Details */}
          <div className="space-y-4">
            {editMode ? (
              <>
                {/* Edit Mode */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Project title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Project description"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                      placeholder="Add tag..."
                    />
                    <Button onClick={handleAddTag}>Add</Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                {description && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {category && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Category</h4>
                      <Badge variant="secondary">{category}</Badge>
                    </div>
                  )}
                  {project?.created_at && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Created
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(project.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  )}
                </div>
                {tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
