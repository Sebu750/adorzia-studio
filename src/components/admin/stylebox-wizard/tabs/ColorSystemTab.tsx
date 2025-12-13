import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWizardContext } from "../WizardContext";
import { Plus, X, Palette } from "lucide-react";
import type { ColorEntry } from "@/lib/stylebox-template";

export function ColorSystemTab() {
  const { formData, updateFormData } = useWizardContext();
  const [newColor, setNewColor] = useState<Partial<ColorEntry>>({
    name: "",
    hex: "#000000",
    pantone: "",
    type: "core",
    usage_ratio: 20,
  });

  const addColor = () => {
    if (newColor.name?.trim() && newColor.hex) {
      const color: ColorEntry = {
        name: newColor.name.trim(),
        hex: newColor.hex,
        pantone: newColor.pantone || undefined,
        type: newColor.type || "core",
        usage_ratio: newColor.usage_ratio,
      };
      updateFormData("color_system", [...formData.color_system, color]);
      setNewColor({
        name: "",
        hex: "#000000",
        pantone: "",
        type: "core",
        usage_ratio: 20,
      });
    }
  };

  const removeColor = (index: number) => {
    updateFormData("color_system", formData.color_system.filter((_, i) => i !== index));
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "core": return "Core";
      case "accent": return "Accent";
      case "optional": return "Optional";
      default: return type;
    }
  };

  const coreColors = formData.color_system.filter(c => c.type === "core");
  const accentColors = formData.color_system.filter(c => c.type === "accent");
  const optionalColors = formData.color_system.filter(c => c.type === "optional");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Color System</h3>
        <p className="text-sm text-muted-foreground">
          Define the color palette with Pantone, HEX, and usage ratios
        </p>
      </div>

      {/* Add Color Form */}
      <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
        <Label className="text-sm font-medium">Add New Color</Label>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="space-y-1">
            <Label className="text-xs">Color *</Label>
            <Input
              type="color"
              value={newColor.hex}
              onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
              className="h-10 p-1 cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Name *</Label>
            <Input
              value={newColor.name}
              onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Midnight Black"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">HEX</Label>
            <Input
              value={newColor.hex}
              onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
              placeholder="#000000"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Pantone</Label>
            <Input
              value={newColor.pantone}
              onChange={(e) => setNewColor(prev => ({ ...prev, pantone: e.target.value }))}
              placeholder="19-0000 TCX"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Type</Label>
            <Select
              value={newColor.type}
              onValueChange={(v) => setNewColor(prev => ({ ...prev, type: v as ColorEntry["type"] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="accent">Accent</SelectItem>
                <SelectItem value="optional">Optional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={addColor} disabled={!newColor.name?.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Color Palette Preview */}
      {formData.color_system.length > 0 && (
        <div className="space-y-4">
          {/* Palette Strip */}
          <div className="flex h-12 rounded-lg overflow-hidden border">
            {formData.color_system.map((color, index) => (
              <div
                key={index}
                className="flex-1 relative group cursor-pointer"
                style={{ backgroundColor: color.hex }}
                title={`${color.name} (${color.hex})`}
              />
            ))}
          </div>

          {/* Color Groups */}
          {coreColors.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Core Colors</Label>
              <div className="flex flex-wrap gap-2">
                {coreColors.map((color, index) => {
                  const globalIndex = formData.color_system.indexOf(color);
                  return (
                    <ColorChip 
                      key={globalIndex} 
                      color={color} 
                      onRemove={() => removeColor(globalIndex)} 
                    />
                  );
                })}
              </div>
            </div>
          )}

          {accentColors.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Accent Colors</Label>
              <div className="flex flex-wrap gap-2">
                {accentColors.map((color, index) => {
                  const globalIndex = formData.color_system.indexOf(color);
                  return (
                    <ColorChip 
                      key={globalIndex} 
                      color={color} 
                      onRemove={() => removeColor(globalIndex)} 
                    />
                  );
                })}
              </div>
            </div>
          )}

          {optionalColors.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Optional Colors</Label>
              <div className="flex flex-wrap gap-2">
                {optionalColors.map((color, index) => {
                  const globalIndex = formData.color_system.indexOf(color);
                  return (
                    <ColorChip 
                      key={globalIndex} 
                      color={color} 
                      onRemove={() => removeColor(globalIndex)} 
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {formData.color_system.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Palette className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No colors added yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add 3-5 core colors, 1-2 accent colors, and optional alternatives
          </p>
        </div>
      )}
    </div>
  );
}

function ColorChip({ color, onRemove }: { color: ColorEntry; onRemove: () => void }) {
  const isLight = isLightColor(color.hex);
  
  return (
    <div 
      className="flex items-center gap-2 px-3 py-2 rounded-lg border group"
      style={{ backgroundColor: color.hex }}
    >
      <span className={`text-sm font-medium ${isLight ? "text-black" : "text-white"}`}>
        {color.name}
      </span>
      {color.pantone && (
        <span className={`text-xs ${isLight ? "text-black/60" : "text-white/60"}`}>
          {color.pantone}
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        className={`ml-1 opacity-0 group-hover:opacity-100 transition-opacity ${isLight ? "text-black/60 hover:text-black" : "text-white/60 hover:text-white"}`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
