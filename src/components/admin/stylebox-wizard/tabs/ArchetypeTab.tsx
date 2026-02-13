import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useWizardContext } from "../WizardContext";
import { Button } from "@/components/ui/button";
import { Upload, X, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { applyWatermark } from "@/lib/image-processing";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";

const STANDARD_SILHOUETTES = [
  "A-Line",
  "Ball Gown",
  "Empire",
  "Mermaid",
  "Sheath",
  "Exoskeletal",
  "Modular",
  "Asymmetrical",
  "Custom",
];

export function ArchetypeTab() {
  const { formData, updateFormData } = useWizardContext();
  const archetype = (formData as any).archetype || { silhouette: "", custom_silhouette: "", rationale: "", anchor_image: "" };
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpdate = (key: string, value: any) => {
    updateFormData("archetype" as any, { ...archetype, [key]: value } as any);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      // Apply watermark first
      const watermarkedFile = await applyWatermark(file);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `archetypes/${fileName}`;

      const { data, error } = await supabase.storage
        .from('stylebox-curation-assets')
        .upload(filePath, watermarkedFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('stylebox-curation-assets')
        .getPublicUrl(filePath);

      handleUpdate("anchor_image", publicUrl);
      toast({
        title: "Image uploaded",
        description: "Anchor image has been watermarked and saved.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload and watermark image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Quadrant 1: The Archetype
          <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-admin-accent text-admin-accent-foreground uppercase tracking-wider">
            Commercial Constant
          </div>
        </h3>
        <p className="text-sm text-muted-foreground">
          Define the foundational structure and commercial logic of the design.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Silhouette Input */}
          <div className="space-y-2">
            <Label>Silhouette Archetype *</Label>
            <div className="flex gap-2">
              <Select
                value={archetype.silhouette || ""}
                onValueChange={(v) => handleUpdate("silhouette", v)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select silhouette..." />
                </SelectTrigger>
                <SelectContent>
                  {STANDARD_SILHOUETTES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {archetype.silhouette === "Custom" && (
                <Input
                  placeholder="Enter custom silhouette..."
                  value={archetype.custom_silhouette || ""}
                  onChange={(e) => handleUpdate("custom_silhouette", e.target.value)}
                  className="flex-1"
                />
              )}
            </div>
          </div>

          {/* Rationale Text */}
          <div className="space-y-2">
            <Label htmlFor="rationale" className="flex items-center gap-1.5">
              Rationale & Commercial Logic
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </Label>
            <Textarea
              id="rationale"
              value={archetype.rationale || ""}
              onChange={(e) => handleUpdate("rationale", e.target.value)}
              placeholder="Explain the 'Commercial Constant' logic... (Rich Text Editor placeholder)"
              className="min-h-[200px] font-serif leading-relaxed"
            />
            <p className="text-[10px] text-muted-foreground italic">
              * Text supports Markdown for formatting.
            </p>
          </div>
        </div>

        {/* Visual Upload: Anchor Image */}
        <div className="space-y-2">
          <Label>Anchor Reference Image *</Label>
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center transition-all duration-200 overflow-hidden bg-muted/20",
              isDragging ? "border-admin-accent bg-admin-accent/5" : "border-admin-border hover:border-admin-accent/50",
              archetype.anchor_image && "border-none"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) {
                uploadFile(file);
              }
            }}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-admin-accent" />
                <p className="text-sm font-medium">Processing & Uploading...</p>
              </div>
            ) : archetype.anchor_image ? (
              <>
                <img 
                  src={archetype.anchor_image} 
                  alt="Anchor Reference" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleUpdate("anchor_image", "")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-full bg-admin-card shadow-sm mb-4">
                  <Upload className="h-6 w-6 text-admin-accent" />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-medium">Drop the 'Anchor' image here</p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse from computer</p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  accept="image/*"
                />
              </>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Maximum file size: 20MB. High-resolution technical flats preferred.
          </p>
        </div>
      </div>
    </div>
  );
}
