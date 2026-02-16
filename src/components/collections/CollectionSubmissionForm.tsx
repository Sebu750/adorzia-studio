import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, FileImage, Send, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUpload {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface CollectionSubmission {
  id: string;
  title: string;
  description: string | null;
  category: string;
  inspiration: string | null;
  concept_notes: string | null;
  files: FileUpload[];
  thumbnail_url: string | null;
  status: string;
  admin_feedback: string | null;
}

interface CollectionSubmissionFormProps {
  open: boolean;
  onClose: () => void;
  editingSubmission: CollectionSubmission | null;
}

export function CollectionSubmissionForm({ open, onClose, editingSubmission }: CollectionSubmissionFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "fashion",
    inspiration: "",
    concept_notes: "",
  });
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (editingSubmission) {
      setFormData({
        title: editingSubmission.title,
        description: editingSubmission.description || "",
        category: editingSubmission.category,
        inspiration: editingSubmission.inspiration || "",
        concept_notes: editingSubmission.concept_notes || "",
      });
      setFiles(editingSubmission.files || []);
    } else {
      setFormData({
        title: "",
        description: "",
        category: "fashion",
        inspiration: "",
        concept_notes: "",
      });
      setFiles([]);
    }
  }, [editingSubmission, open]);

  const saveMutation = useMutation({
    mutationFn: async ({ status }: { status: 'draft' | 'pending' }) => {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        inspiration: formData.inspiration || null,
        concept_notes: formData.concept_notes || null,
        files: files as unknown as any,
        thumbnail_url: files[0]?.url || null,
        status,
        submitted_at: status === 'pending' ? new Date().toISOString() : null,
        designer_id: user?.id!,
      };

      if (editingSubmission) {
        const { error } = await supabase
          .from('collection_submissions')
          .update(payload)
          .eq('id', editingSubmission.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('collection_submissions')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['collection-submissions'] });
      toast({
        title: status === 'pending' ? "Collection submitted for review!" : "Draft saved successfully",
        description: status === 'pending' ? "You'll be notified when it's reviewed." : undefined,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to save collection",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || !user?.id) return;
    
    setUploading(true);
    const newFiles: FileUpload[] = [];

    try {
      for (const file of Array.from(fileList)) {
        if (!file.type.startsWith('image/')) {
          toast({ title: "Only image files are allowed", variant: "destructive" });
          continue;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          toast({ title: "File size must be less than 5MB", variant: "destructive" });
          continue;
        }

        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('collection-files')
          .upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('collection-files')
          .getPublicUrl(data.path);

        newFiles.push({
          name: file.name,
          url: urlData.publicUrl,
          type: file.type,
          size: file.size,
        });
      }

      setFiles(prev => [...prev, ...newFiles]);
      toast({ title: `${newFiles.length} file(s) uploaded` });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  }, [user?.id]);

  const isValid = formData.title.trim().length >= 3 && files.length > 0;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSubmission ? "Edit Collection" : "New Collection Submission"}
          </DialogTitle>
          <DialogDescription>
            {editingSubmission?.status === 'revisions_required' 
              ? "Make the requested revisions and resubmit for review."
              : "Upload your design collection with sketches, moodboards, and concept notes."}
          </DialogDescription>
        </DialogHeader>

        {/* Admin Feedback Banner */}
        {editingSubmission?.admin_feedback && editingSubmission.status === 'revisions_required' && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm font-medium text-destructive mb-1">Reviewer Feedback:</p>
            <p className="text-sm text-destructive/80">{editingSubmission.admin_feedback}</p>
          </div>
        )}

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title">Collection Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Urban Street Style Collection"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fashion">Fashion Design</SelectItem>
                  <SelectItem value="textile">Textile Design</SelectItem>
                  <SelectItem value="jewelry">Jewelry Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your collection concept, target audience, and key design elements..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspiration">Inspiration</Label>
            <Textarea
              id="inspiration"
              placeholder="What inspired this collection? References, mood, cultural influences..."
              value={formData.inspiration}
              onChange={(e) => setFormData(prev => ({ ...prev, inspiration: e.target.value }))}
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="concept_notes">Concept Notes</Label>
            <Textarea
              id="concept_notes"
              placeholder="Technical details, fabric choices, color palette, silhouettes..."
              value={formData.concept_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, concept_notes: e.target.value }))}
              className="min-h-[60px]"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label>Upload Files * (Sketches, Moodboards, Images)</Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
                dragActive ? "border-accent bg-accent/5" : "border-border",
                uploading && "pointer-events-none opacity-50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
                disabled={uploading}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {uploading ? (
                  <Loader2 className="h-10 w-10 mx-auto text-muted-foreground animate-spin" />
                ) : (
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                )}
                <p className="mt-2 text-sm font-medium">
                  {uploading ? "Uploading..." : "Drop files here or click to upload"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB each
                </p>
              </label>
            </div>

            {/* File Preview Grid */}
            {files.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {files.map((file, index) => (
                  <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 text-[10px] bg-background/80 px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => saveMutation.mutate({ status: 'draft' })}
            disabled={!formData.title.trim() || saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Draft
          </Button>
          <Button
            onClick={() => saveMutation.mutate({ status: 'pending' })}
            disabled={!isValid || saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Submit for Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}