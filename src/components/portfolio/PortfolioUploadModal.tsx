import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, Upload, X, Plus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImages, formatBytes, getTotalSavings, type CompressionResult } from "@/lib/image-compression";

interface PortfolioUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CATEGORIES = [
  "Fashion Design",
  "Jewelry Design",
  "Textile Design",
  "Accessory Design",
  "Footwear Design",
  "Bag Design",
  "Other",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface ImageFile {
  file: File;
  preview: string;
  fileName: string;
  fileType: string;
  compressionResult?: CompressionResult;
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
  const [compressing, setCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (images.length === 0) throw new Error("At least one image is required");
      if (!title.trim()) throw new Error("Title is required");

      setCurrentFile("Preparing upload...");

      // Convert images to base64 with progress tracking
      const imageData = await Promise.all(
        images.map(async (img, index) => {
          setCurrentFile(`Processing image ${index + 1} of ${images.length}`);
          setUploadProgress(Math.round(((index + 1) / images.length) * 50));
          
          return new Promise<{ fileName: string; fileType: string; fileData: string }>(
            (resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve({
                  fileName: img.fileName,
                  fileType: img.compressionResult?.file.type || img.fileType,
                  fileData: reader.result as string,
                });
              };
              reader.onerror = reject;
              reader.readAsDataURL(img.compressionResult?.file || img.file);
            }
          );
        })
      );

      setCurrentFile("Uploading to server...");
      setUploadProgress(60);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-portfolio-project`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description: description || undefined,
            category: category || undefined,
            tags: tags.length > 0 ? tags : undefined,
            images: imageData,
          }),
        }
      );

      setUploadProgress(90);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      setUploadProgress(100);
      return response.json();
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
      setUploadProgress(0);
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
    setCompressing(false);
    setCompressionProgress(0);
    setUploadProgress(0);
    setCurrentFile("");
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

    // Compress images
    setCompressing(true);
    setCompressionProgress(0);

    try {
      const compressionResults = await compressImages(
        validFiles,
        {},
        (current, total) => {
          setCompressionProgress(Math.round((current / total) * 100));
        }
      );

      const newImages: ImageFile[] = compressionResults.map((result, index) => {
        const preview = URL.createObjectURL(result.file);
        return {
          file: validFiles[index],
          preview,
          fileName: validFiles[index].name,
          fileType: validFiles[index].type,
          compressionResult: result,
        };
      });

      setImages((prev) => [...prev, ...newImages]);

      // Show compression savings
      const savings = getTotalSavings(compressionResults);
      if (savings.savingsPercent > 10) {
        toast.success(
          `Images compressed! Saved ${formatBytes(savings.savings)} (${savings.savingsPercent.toFixed(0)}%)`
        );
      }
    } catch (error) {
      console.error("Compression error:", error);
      toast.error("Failed to compress images");
    } finally {
      setCompressing(false);
      setCompressionProgress(0);
    }
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
          {/* Compression Progress */}
          {compressing && (
            <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
                <span>Compressing images... {compressionProgress}%</span>
              </div>
              <Progress value={compressionProgress} className="h-2" />
            </div>
          )}

          {/* Upload Progress */}
          {uploadMutation.isPending && (
            <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Upload className="h-4 w-4 text-primary animate-pulse" />
                <span>{currentFile}</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
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
                {images.some(img => img.compressionResult && img.compressionResult.savingsPercent > 5) && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Zap className="h-3 w-3 text-green-500" />
                    <span>
                      Total savings: {formatBytes(getTotalSavings(images.map(img => img.compressionResult!).filter(Boolean)).savings)}
                    </span>
                  </div>
                )}
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
                      {index === 0 && (
                        <Badge className="absolute top-2 left-2 text-xs">
                          Thumbnail
                        </Badge>
                      )}
                      {img.compressionResult && img.compressionResult.savingsPercent > 5 && (
                        <Badge variant="secondary" className="absolute bottom-2 right-2 text-xs gap-1">
                          <Zap className="h-3 w-3" />
                          -{img.compressionResult.savingsPercent.toFixed(0)}%
                        </Badge>
                      )}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploadMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={() => uploadMutation.mutate()}
            disabled={uploadMutation.isPending || compressing || images.length === 0 || !title.trim()}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : compressing ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-pulse" />
                Compressing...
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
