import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useWizardContext } from "../WizardContext";
import { DEFAULT_FILE_FORMATS, DEFAULT_REQUIRED_VIEWS } from "@/lib/stylebox-template";

export function TechnicalRequirementsTab() {
  const { formData, updateNestedData } = useWizardContext();
  const requirements = formData.technical_requirements;
  const category = formData.category;

  const toggleFormat = (format: string) => {
    const current = requirements.file_formats || [];
    const updated = current.includes(format)
      ? current.filter(f => f !== format)
      : [...current, format];
    updateNestedData("technical_requirements", "file_formats", updated);
  };

  const toggleView = (view: string) => {
    const current = requirements.required_views || [];
    const updated = current.includes(view)
      ? current.filter(v => v !== view)
      : [...current, view];
    updateNestedData("technical_requirements", "required_views", updated);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Technical Requirements</h3>
        <p className="text-sm text-muted-foreground">
          File formats, views, and category-specific technical specifications
        </p>
      </div>

      {/* File Formats */}
      <div className="space-y-3">
        <Label>Accepted File Formats</Label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {DEFAULT_FILE_FORMATS.map((format) => (
            <div key={format} className="flex items-center space-x-2">
              <Checkbox
                id={`format-${format}`}
                checked={requirements.file_formats?.includes(format)}
                onCheckedChange={() => toggleFormat(format)}
              />
              <label
                htmlFor={`format-${format}`}
                className="text-sm cursor-pointer"
              >
                {format}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Required Views */}
      <div className="space-y-3">
        <Label>Required Views</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {DEFAULT_REQUIRED_VIEWS.map((view) => (
            <div key={view} className="flex items-center space-x-2">
              <Checkbox
                id={`view-${view}`}
                checked={requirements.required_views?.includes(view)}
                onCheckedChange={() => toggleView(view)}
              />
              <label
                htmlFor={`view-${view}`}
                className="text-sm cursor-pointer"
              >
                {view}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Image Resolution */}
      <div className="space-y-2">
        <Label htmlFor="image_resolution">Image Resolution Requirements</Label>
        <Input
          id="image_resolution"
          value={requirements.image_resolution || ""}
          onChange={(e) => updateNestedData("technical_requirements", "image_resolution", e.target.value)}
          placeholder="e.g., Minimum 300 DPI, 2000x2000px for hero images"
        />
      </div>

      {/* Category-Specific Requirements */}
      {category === "textile" && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <Label className="text-sm font-medium">Textile-Specific Requirements</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="repeat_width">Repeat Width</Label>
              <div className="flex gap-2">
                <Input
                  id="repeat_width"
                  type="number"
                  value={requirements.repeat_dimensions?.width || ""}
                  onChange={(e) => updateNestedData("technical_requirements", "repeat_dimensions", {
                    ...requirements.repeat_dimensions,
                    width: parseFloat(e.target.value) || 0,
                  })}
                  placeholder="0"
                />
                <span className="flex items-center text-sm text-muted-foreground">cm</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="repeat_height">Repeat Height</Label>
              <div className="flex gap-2">
                <Input
                  id="repeat_height"
                  type="number"
                  value={requirements.repeat_dimensions?.height || ""}
                  onChange={(e) => updateNestedData("technical_requirements", "repeat_dimensions", {
                    ...requirements.repeat_dimensions,
                    height: parseFloat(e.target.value) || 0,
                  })}
                  placeholder="0"
                />
                <span className="flex items-center text-sm text-muted-foreground">cm</span>
              </div>
            </div>
            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="color_separations"
                  checked={requirements.color_separations || false}
                  onCheckedChange={(checked) => updateNestedData("technical_requirements", "color_separations", checked)}
                />
                <label htmlFor="color_separations" className="text-sm cursor-pointer">
                  Color Separations Required
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {category === "jewelry" && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <Label className="text-sm font-medium">Jewelry-Specific Requirements</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight_min">Weight Range (grams)</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="weight_min"
                  type="number"
                  value={requirements.weight_limits?.min || ""}
                  onChange={(e) => updateNestedData("technical_requirements", "weight_limits", {
                    ...requirements.weight_limits,
                    min: parseFloat(e.target.value) || undefined,
                    unit: "g",
                  })}
                  placeholder="Min"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  id="weight_max"
                  type="number"
                  value={requirements.weight_limits?.max || ""}
                  onChange={(e) => updateNestedData("technical_requirements", "weight_limits", {
                    ...requirements.weight_limits,
                    max: parseFloat(e.target.value) || undefined,
                    unit: "g",
                  })}
                  placeholder="Max"
                />
                <span className="text-sm text-muted-foreground">g</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cad_requirements">CAD Requirements</Label>
              <Input
                id="cad_requirements"
                value={requirements.cad_requirements || ""}
                onChange={(e) => updateNestedData("technical_requirements", "cad_requirements", e.target.value)}
                placeholder="e.g., Rhino, Matrix, STL files"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="scale_drawings"
              checked={requirements.scale_drawings || false}
              onCheckedChange={(checked) => updateNestedData("technical_requirements", "scale_drawings", checked)}
            />
            <label htmlFor="scale_drawings" className="text-sm cursor-pointer">
              Scale Drawings Required (1:1)
            </label>
          </div>
        </div>
      )}

      {/* Naming Conventions */}
      <div className="space-y-2">
        <Label htmlFor="naming_conventions">File Naming Conventions</Label>
        <Textarea
          id="naming_conventions"
          value={requirements.naming_conventions || ""}
          onChange={(e) => updateNestedData("technical_requirements", "naming_conventions", e.target.value)}
          placeholder="e.g., [DesignerName]_[StyleboxTitle]_[View]_[Version].png"
          className="min-h-[60px]"
        />
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additional_notes">Additional Technical Notes</Label>
        <Textarea
          id="additional_notes"
          value={requirements.additional_notes || ""}
          onChange={(e) => updateNestedData("technical_requirements", "additional_notes", e.target.value)}
          placeholder="Any other technical requirements or submission guidelines..."
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}
