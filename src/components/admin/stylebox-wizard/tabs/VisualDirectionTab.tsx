import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWizardContext } from "../WizardContext";
import { Plus, X, Image, Upload } from "lucide-react";
import type { MoodboardImage } from "@/lib/stylebox-template";

export function VisualDirectionTab() {
  const { formData, updateFormData } = useWizardContext();
  const [newKeyword, setNewKeyword] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageTag, setNewImageTag] = useState("");

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.visual_keywords.includes(newKeyword.trim())) {
      updateFormData("visual_keywords", [...formData.visual_keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    updateFormData("visual_keywords", formData.visual_keywords.filter(k => k !== keyword));
  };

  const addMoodboardImage = () => {
    if (newImageUrl.trim()) {
      const newImage: MoodboardImage = {
        url: newImageUrl.trim(),
        theme_tag: newImageTag.trim() || "Inspiration",
        alt_text: newImageTag.trim() || "Moodboard image",
      };
      updateFormData("moodboard_images", [...formData.moodboard_images, newImage]);
      setNewImageUrl("");
      setNewImageTag("");
    }
  };

  const removeMoodboardImage = (index: number) => {
    updateFormData(
      "moodboard_images", 
      formData.moodboard_images.filter((_, i) => i !== index)
    );
  };

  const updateImageTag = (index: number, tag: string) => {
    const updated = [...formData.moodboard_images];
    updated[index] = { ...updated[index], theme_tag: tag };
    updateFormData("moodboard_images", updated);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Visual Direction</h3>
        <p className="text-sm text-muted-foreground">
          Upload moodboard images and define visual keywords (6-12 images recommended)
        </p>
      </div>

      {/* Visual Keywords */}
      <div className="space-y-3">
        <Label>Visual Keywords</Label>
        <div className="flex gap-2">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Add keyword (e.g., minimalist, organic, structured)"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
            className="max-w-xs"
          />
          <Button type="button" variant="outline" size="icon" onClick={addKeyword}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.visual_keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="gap-1">
              {keyword}
              <button 
                type="button" 
                onClick={() => removeKeyword(keyword)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {formData.visual_keywords.length === 0 && (
            <p className="text-sm text-muted-foreground">No keywords added yet</p>
          )}
        </div>
      </div>

      {/* Moodboard Images */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Moodboard Images</Label>
          <span className="text-xs text-muted-foreground">
            {formData.moodboard_images.length} / 12 images
          </span>
        </div>
        
        {/* Add Image Input */}
        <div className="flex gap-2 flex-wrap">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Image URL"
            className="flex-1 min-w-[200px]"
          />
          <Input
            value={newImageTag}
            onChange={(e) => setNewImageTag(e.target.value)}
            placeholder="Theme tag (e.g., Texture)"
            className="w-40"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={addMoodboardImage}
            disabled={!newImageUrl.trim()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {formData.moodboard_images.map((image, index) => (
            <div 
              key={index} 
              className="relative group aspect-square bg-muted rounded-lg overflow-hidden border"
            >
              {image.url ? (
                <img 
                  src={image.url} 
                  alt={image.alt_text || "Moodboard"} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <button
                  type="button"
                  onClick={() => removeMoodboardImage(index)}
                  className="self-end p-1 bg-destructive rounded-full"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
                <Input
                  value={image.theme_tag}
                  onChange={(e) => updateImageTag(index, e.target.value)}
                  className="text-xs h-7 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  placeholder="Theme tag"
                />
              </div>
              
              {/* Tag Badge */}
              <div className="absolute bottom-2 left-2 right-2">
                <Badge variant="secondary" className="text-xs truncate max-w-full">
                  {image.theme_tag}
                </Badge>
              </div>
            </div>
          ))}
          
          {formData.moodboard_images.length < 12 && (
            <div className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors">
              <Image className="h-8 w-8 mb-2" />
              <span className="text-xs">Add image above</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
