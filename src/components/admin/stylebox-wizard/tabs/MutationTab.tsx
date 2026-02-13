import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWizardContext } from "../WizardContext";
import { Button } from "@/components/ui/button";
import { Upload, X, GripVertical, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { applyWatermark } from "@/lib/image-processing";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";

export function MutationTab() {
  const { formData, updateFormData } = useWizardContext();
  const mutation = (formData as any).mutation || { concept: "", directive: "", moodboard: [] };
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpdate = (key: string, value: any) => {
    updateFormData("mutation" as any, { ...mutation, [key]: value } as any);
  };

  const uploadFiles = async (files: FileList) => {
    setIsUploading(true);
    const newImages = [...mutation.moodboard];
    
    try {
      for (const file of Array.from(files)) {
        // Apply watermark
        const watermarkedFile = await applyWatermark(file);
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `moodboards/${fileName}`;

        const { error } = await supabase.storage
          .from('stylebox-curation-assets')
          .upload(filePath, watermarkedFile);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('stylebox-curation-assets')
          .getPublicUrl(filePath);

        newImages.push({
          url: publicUrl,
          id: Math.random().toString(36).substr(2, 9)
        });
      }

      handleUpdate("moodboard", newImages);
      toast({
        title: "Images uploaded",
        description: `${files.length} images have been watermarked and added to the mood board.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Some images failed to upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  };

  const removeImage = (id: string) => {
    handleUpdate("moodboard", mutation.moodboard.filter((img: any) => img.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Quadrant 2: The Mutation
          <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-admin-accent text-admin-accent-foreground uppercase tracking-wider">
            The Disruption
          </div>
        </h3>
        <p className="text-sm text-muted-foreground">
          Define the conceptual shift and creative narrative for the mutation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Concept Field */}
          <div className="space-y-2">
            <Label htmlFor="concept">Mutation Concept *</Label>
            <Textarea
              id="concept"
              value={mutation.concept || ""}
              onChange={(e) => handleUpdate("concept", e.target.value)}
              placeholder="Describe the high-level mutation concept... (e.g., Crystallography, Biomimicry)"
              className="min-h-[120px]"
            />
          </div>

          {/* Directive Field */}
          <div className="space-y-2">
            <Label htmlFor="directive">Creative Directive *</Label>
            <Textarea
              id="directive"
              value={mutation.directive || ""}
              onChange={(e) => handleUpdate("directive", e.target.value)}
              placeholder="Provide specific instructions for the 'Disruption' strategy..."
              className="min-h-[120px]"
            />
          </div>
        </div>

        {/* Mood Board Builder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Visual Narrative (Mood Board)</Label>
            <Button variant="outline" size="sm" className="relative cursor-pointer" disabled={isUploading}>
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Add Images
              <input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                accept="image/*"
              />
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border rounded-xl bg-muted/20 min-h-[300px]">
            {isUploading && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 bg-background/50 backdrop-blur-sm rounded-lg border-2 border-dashed border-admin-accent/50 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-admin-accent mb-2" />
                <p className="text-sm font-medium">Watermarking & Uploading...</p>
              </div>
            )}
            {mutation.moodboard.length > 0 ? (
              mutation.moodboard.map((img: any, index: number) => (
                <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border bg-background shadow-sm transition-all hover:ring-2 hover:ring-admin-accent/50">
                  <img src={img.url} alt={`Moodboard ${index}`} className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => removeImage(img.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 cursor-grab active:cursor-grabbing">
                      <GripVertical className="h-2.5 w-2.5" />
                      Move
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">No images added to visual narrative</p>
                <p className="text-xs mt-1">Images will appear here for drag-reordering</p>
              </div>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground">
            * Drag and drop images to reorder the visual story. High-fidelity references only.
          </p>
        </div>
      </div>
    </div>
  );
}
