import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Upload, X, Plus, Palette, Lightbulb, FolderOpen, Calendar, Scissors, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CATEGORIES = [
  "Fashion Design",
  "Bridal Couture",
  "Haute Couture",
  "Prêt-à-Porter",
  "Streetwear",
  "Jewelry Design",
  "Textile Design",
  "Accessory Design",
  "Footwear Design",
  "Bag Design",
  "Sustainable Fashion",
  "Other",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface ImageFile {
  file: File;
  preview: string;
  fileName: string;
  fileType: string;
}

export function PortfolioUploadModal({
  open,
  onOpenChange,
  onSuccess,
}: PortfolioUploadModalProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [currentFile, setCurrentFile] = useState("");
  
  // Enhanced Manual Project Fields
  const [collectionName, setCollectionName] = useState("");
  const [year, setYear] = useState<string>("");
  const [fabricDetails, setFabricDetails] = useState("");
  const [inspiration, setInspiration] = useState("");

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (images.length === 0) throw new Error("At least one image is required");
      if (!title.trim()) throw new Error("Title is required");

      setCurrentFile("Checking authentication...");

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Not authenticated. Please log in again.");
      }

      setCurrentFile("Preparing portfolio...");

      // Get or create portfolio for the user
      let { data: portfolio, error: portfolioError } = await supabase
        .from("portfolios")
        .select("id")
        .eq("designer_id", user.id)
        .single();

      if (portfolioError || !portfolio) {
        // Create portfolio if it doesn't exist
        const { data: newPortfolio, error: createError } = await supabase
          .from("portfolios")
          .insert({
            designer_id: user.id,
            title: `${user.email}'s Portfolio`,
            description: "My design portfolio",
          })
          .select("id")
          .single();

        if (createError) {
          console.error("Error creating portfolio:", createError);
          throw new Error("Failed to create portfolio: " + createError.message);
        }
        portfolio = newPortfolio;
      }

      setCurrentFile("Creating project...");

      // Create portfolio project
      const { data: project, error: projectError } = await supabase
        .from("portfolio_projects")
        .insert({
          portfolio_id: portfolio.id,
          title,
          description: description || null,
          category: category || null,
          tags: tags.length > 0 ? tags : null,
          source_type: "manual",
        })
        .select("id")
        .single();

      if (projectError) {
        console.error("Error creating project:", projectError);
        throw new Error("Failed to create project: " + projectError.message);
      }

      // Upload images to storage
      const uploadedAssets = [];
      let thumbnailUrl: string | null = null;

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        setCurrentFile(`Uploading image ${i + 1} of ${images.length}...`);

        // Generate unique filename
        const fileExt = img.fileName.split(".").pop() || "jpg";
        const fileName = `${user.id}/${project.id}/${Date.now()}-${i}.${fileExt}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(fileName, img.file, {
            contentType: img.fileType,
            cacheControl: "3600",
          });

        if (uploadError) {
          console.error(`Error uploading image ${i + 1}:`, uploadError);
          // Continue with other images, don't fail completely
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("portfolio")
          .getPublicUrl(fileName);

        // Set first image as thumbnail
        if (i === 0) {
          thumbnailUrl = publicUrl;
        }

        // Create asset record
        const { data: asset, error: assetError } = await supabase
          .from("portfolio_assets")
          .insert({
            portfolio_id: portfolio.id,
            project_id: project.id,
            designer_id: user.id,
            file_url: publicUrl,
            file_name: img.fileName,
            file_type: "image",
            file_size: img.file.size,
            mime_type: img.fileType,
            display_order: i,
          })
          .select()
          .single();

        if (!assetError && asset) {
          uploadedAssets.push(asset);
        }
      }

      // Update project with thumbnail
      if (thumbnailUrl) {
        await supabase
          .from("portfolio_projects")
          .update({ thumbnail_url: thumbnailUrl })
          .eq("id", project.id);
      }

      return {
        success: true,
        project: { id: project.id, title, thumbnail_url: thumbnailUrl },
        assets: uploadedAssets,
      };
    },
    onSuccess: () => {
      toast.success("Project uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-projects"] });
      onSuccess?.();
      handleClose();
    },
    onError: (error: Error) => {
      toast.error("Upload failed: " + error.message);
      setCurrentFile("");
    },
  });

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setTags([]);
    setNewTag("");
    setImages([]);
    setCurrentFile("");
    setCollectionName("");
    setYear("");
    setFabricDetails("");
    setInspiration("");
    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return `${file.name}: Invalid file type. Only JPEG, PNG, and WebP are allowed.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: File size exceeds 10MB limit.`;
    }
    return null;
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast.error(errors.join("\n"));
    }

    if (validFiles.length === 0) return;

    // Create image previews from original files (no compression)
    const newImages: ImageFile[] = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      fileName: file.name,
      fileType: file.type,
    }));

    setImages((prev) => [...prev, ...newImages]);
    toast.success(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} ready for upload`);
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Upload Status */}
          {uploadMutation.isPending && (
            <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Upload className="h-4 w-4 text-primary animate-pulse" />
                <span>{currentFile}</span>
              </div>
            </div>
          )}

          {/* Image Upload Area */}
          <div className="space-y-3">
            <Label>Project Images *</Label>

            {/* Drag & Drop Zone */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                multiple
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={handleFileInput}
                className="hidden"
              />
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP up to 10MB
              </p>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{images.length} image{images.length > 1 ? 's' : ''} selected</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border group"
                    >
                      <img
                        src={img.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              rows={4}
              maxLength={1000}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tag..."
                maxLength={30}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Manual Project Details */}
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Image className="h-4 w-4" />
              Additional Project Details (Optional)
            </div>

            {/* Collection Name & Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collection" className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  Collection Name
                </Label>
                <Input
                  id="collection"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="e.g., Spring 2026"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Year
                </Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fabric Details */}
            <div className="space-y-2">
              <Label htmlFor="fabric" className="flex items-center gap-2">
                <Scissors className="h-4 w-4 text-muted-foreground" />
                Fabric & Material Details
              </Label>
              <Textarea
                id="fabric"
                value={fabricDetails}
                onChange={(e) => setFabricDetails(e.target.value)}
                placeholder="Describe fabrics, materials, textures used..."
                rows={3}
                maxLength={500}
              />
            </div>

            {/* Inspiration */}
            <div className="space-y-2">
              <Label htmlFor="inspiration" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                Inspiration
              </Label>
              <Textarea
                id="inspiration"
                value={inspiration}
                onChange={(e) => setInspiration(e.target.value)}
                placeholder="What inspired this design? Reference artists, cultures, themes..."
                rows={3}
                maxLength={500}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploadMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={() => uploadMutation.mutate()}
            disabled={uploadMutation.isPending || images.length === 0 || !title.trim()}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
