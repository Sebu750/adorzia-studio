import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWizardContext } from "../WizardContext";
import { DIFFICULTY_PRESETS } from "@/lib/stylebox-template";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Flame, Skull, Gift } from "lucide-react";

export function DesignGuidelinesTab() {
  const { formData, updateNestedData } = useWizardContext();
  const guidelines = formData.design_guidelines;
  const difficulty = formData.difficulty;
  const category = formData.category;

  const getDifficultyIcon = () => {
    switch (difficulty) {
      case "free": return <Gift className="h-4 w-4" />;
      case "easy": return <Sparkles className="h-4 w-4" />;
      case "medium": return <Zap className="h-4 w-4" />;
      case "hard": return <Flame className="h-4 w-4" />;
      case "insane": return <Skull className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "free": return "bg-chart-5 text-foreground";
      case "easy": return "bg-chart-4 text-foreground";
      case "medium": return "bg-chart-3 text-white";
      case "hard": return "bg-chart-2 text-white";
      case "insane": return "bg-chart-1 text-white";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Design Guidelines</h3>
        <p className="text-sm text-muted-foreground">
          Difficulty-based guidelines and category-specific construction notes
        </p>
      </div>

      {/* Difficulty Badge */}
      <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
        <Badge className={`gap-1 ${getDifficultyColor()}`}>
          {getDifficultyIcon()}
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {DIFFICULTY_PRESETS[difficulty]?.complexity_notes}
          </p>
          {DIFFICULTY_PRESETS[difficulty]?.piece_count && (
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: {DIFFICULTY_PRESETS[difficulty].piece_count?.min}-{DIFFICULTY_PRESETS[difficulty].piece_count?.max} pieces
            </p>
          )}
        </div>
      </div>

      {/* Complexity Notes */}
      <div className="space-y-2">
        <Label htmlFor="complexity_notes">Complexity Notes *</Label>
        <Textarea
          id="complexity_notes"
          value={guidelines.complexity_notes || ""}
          onChange={(e) => updateNestedData("design_guidelines", "complexity_notes", e.target.value)}
          placeholder="Describe the expected complexity level, technical skills required, and design scope..."
          className="min-h-[100px]"
        />
      </div>

      {/* Piece Count */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min_pieces">Minimum Pieces</Label>
          <Input
            id="min_pieces"
            type="number"
            min={1}
            value={guidelines.piece_count?.min || ""}
            onChange={(e) => updateNestedData("design_guidelines", "piece_count", {
              ...guidelines.piece_count,
              min: parseInt(e.target.value) || 1,
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_pieces">Maximum Pieces</Label>
          <Input
            id="max_pieces"
            type="number"
            min={1}
            value={guidelines.piece_count?.max || ""}
            onChange={(e) => updateNestedData("design_guidelines", "piece_count", {
              ...guidelines.piece_count,
              max: parseInt(e.target.value) || 10,
            })}
          />
        </div>
      </div>

      {/* Category-Specific Fields */}
      {category === "fashion" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="construction_guidance">Construction Guidance</Label>
            <Textarea
              id="construction_guidance"
              value={guidelines.construction_guidance || ""}
              onChange={(e) => updateNestedData("design_guidelines", "construction_guidance", e.target.value)}
              placeholder="Seaming techniques, finishing details, construction methods to explore..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="silhouette_guidance">Silhouette Guidance</Label>
            <Textarea
              id="silhouette_guidance"
              value={guidelines.silhouette_guidance || ""}
              onChange={(e) => updateNestedData("design_guidelines", "silhouette_guidance", e.target.value)}
              placeholder="Preferred silhouettes, proportions, fit expectations..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category_build">Category Build</Label>
            <Textarea
              id="category_build"
              value={guidelines.category_build || ""}
              onChange={(e) => updateNestedData("design_guidelines", "category_build", e.target.value)}
              placeholder="Mix of tops, bottoms, outerwear, dresses, accessories..."
              className="min-h-[80px]"
            />
          </div>
        </>
      )}

      {category === "textile" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="repeat_structure_guidance">Repeat Structure Guidance</Label>
            <Textarea
              id="repeat_structure_guidance"
              value={guidelines.repeat_structure_guidance || ""}
              onChange={(e) => updateNestedData("design_guidelines", "repeat_structure_guidance", e.target.value)}
              placeholder="Repeat types to explore: half-drop, brick, mirror, rotational..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="print_complexity">Print Complexity</Label>
            <Textarea
              id="print_complexity"
              value={guidelines.print_complexity || ""}
              onChange={(e) => updateNestedData("design_guidelines", "print_complexity", e.target.value)}
              placeholder="Color count, scale variations, layering techniques..."
              className="min-h-[80px]"
            />
          </div>
        </>
      )}

      {category === "jewelry" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="engineering_level">Engineering Level</Label>
            <Textarea
              id="engineering_level"
              value={guidelines.engineering_level || ""}
              onChange={(e) => updateNestedData("design_guidelines", "engineering_level", e.target.value)}
              placeholder="Technical complexity: simple casting, articulated pieces, mechanisms..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hardware_complexity">Hardware Complexity</Label>
            <Textarea
              id="hardware_complexity"
              value={guidelines.hardware_complexity || ""}
              onChange={(e) => updateNestedData("design_guidelines", "hardware_complexity", e.target.value)}
              placeholder="Clasps, hinges, closures, moving parts expectations..."
              className="min-h-[80px]"
            />
          </div>
        </>
      )}

      {/* Reference Notes */}
      <div className="space-y-2">
        <Label htmlFor="reference_notes">Reference Notes</Label>
        <Textarea
          id="reference_notes"
          value={guidelines.reference_notes || ""}
          onChange={(e) => updateNestedData("design_guidelines", "reference_notes", e.target.value)}
          placeholder="Designer references, brand inspirations, market positioning..."
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}
