import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWizardContext } from "../WizardContext";
import { Plus, X, Shirt, Layers, Gem } from "lucide-react";

export function MaterialDirectionTab() {
  const { formData, updateFormData, updateNestedData } = useWizardContext();
  const category = formData.category;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Material Direction</h3>
        <p className="text-sm text-muted-foreground">
          Category-specific material and construction guidance for {category}
        </p>
      </div>

      {category === "fashion" && <FashionMaterials />}
      {category === "textile" && <TextileMaterials />}
      {category === "jewelry" && <JewelryMaterials />}
    </div>
  );
}

function FashionMaterials() {
  const { formData, updateNestedData } = useWizardContext();
  const materials = formData.material_direction;
  const [newFabric, setNewFabric] = useState("");
  const [newTrim, setNewTrim] = useState("");

  const addToArray = (field: string, value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      const current = (materials as any)[field] || [];
      updateNestedData("material_direction", field, [...current, value.trim()]);
      setter("");
    }
  };

  const removeFromArray = (field: string, index: number) => {
    const current = (materials as any)[field] || [];
    updateNestedData("material_direction", field, current.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Shirt className="h-5 w-5" />
        <span className="text-sm font-medium">Fashion Materials</span>
      </div>

      {/* Fabrics */}
      <div className="space-y-2">
        <Label>Fabrics (Woven/Knit)</Label>
        <div className="flex gap-2">
          <Input
            value={newFabric}
            onChange={(e) => setNewFabric(e.target.value)}
            placeholder="e.g., Organic cotton twill, Silk charmeuse"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("fabrics", newFabric, setNewFabric))}
          />
          <Button type="button" variant="outline" size="icon" onClick={() => addToArray("fabrics", newFabric, setNewFabric)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(materials.fabrics as any[] || []).map((fabric: any, index: number) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {typeof fabric === "string" ? fabric : fabric.name}
              <button type="button" onClick={() => removeFromArray("fabrics", index)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Trims */}
      <div className="space-y-2">
        <Label>Trims & Closures</Label>
        <div className="flex gap-2">
          <Input
            value={newTrim}
            onChange={(e) => setNewTrim(e.target.value)}
            placeholder="e.g., Metal zippers, Horn buttons"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("trims", newTrim, setNewTrim))}
          />
          <Button type="button" variant="outline" size="icon" onClick={() => addToArray("trims", newTrim, setNewTrim)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(materials.trims || []).map((trim: string, index: number) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {trim}
              <button type="button" onClick={() => removeFromArray("trims", index)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Text Fields */}
      <div className="space-y-2">
        <Label htmlFor="silhouette">Silhouette Guidance</Label>
        <Textarea
          id="silhouette"
          value={materials.silhouette_guidance || ""}
          onChange={(e) => updateNestedData("material_direction", "silhouette_guidance", e.target.value)}
          placeholder="Describe preferred silhouettes: oversized, tailored, draped, structured..."
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="layering">Layering Rules</Label>
        <Textarea
          id="layering"
          value={materials.layering_rules || ""}
          onChange={(e) => updateNestedData("material_direction", "layering_rules", e.target.value)}
          placeholder="How pieces should work together: base layers, mid layers, outerwear..."
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="construction">Construction Suggestions</Label>
        <Textarea
          id="construction"
          value={materials.construction_suggestions || ""}
          onChange={(e) => updateNestedData("material_direction", "construction_suggestions", e.target.value)}
          placeholder="Construction techniques, seaming, finishing details..."
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}

function TextileMaterials() {
  const { formData, updateNestedData } = useWizardContext();
  const materials = formData.material_direction;
  const [newPrint, setNewPrint] = useState("");
  const [newTechnique, setNewTechnique] = useState("");

  const addToArray = (field: string, value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      const current = (materials as any)[field] || [];
      updateNestedData("material_direction", field, [...current, value.trim()]);
      setter("");
    }
  };

  const removeFromArray = (field: string, index: number) => {
    const current = (materials as any)[field] || [];
    updateNestedData("material_direction", field, current.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Layers className="h-5 w-5" />
        <span className="text-sm font-medium">Textile Materials</span>
      </div>

      {/* Print Styles */}
      <div className="space-y-2">
        <Label>Print Styles</Label>
        <div className="flex gap-2">
          <Input
            value={newPrint}
            onChange={(e) => setNewPrint(e.target.value)}
            placeholder="e.g., Geometric, Botanical, Abstract"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("print_styles", newPrint, setNewPrint))}
          />
          <Button type="button" variant="outline" size="icon" onClick={() => addToArray("print_styles", newPrint, setNewPrint)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(materials.print_styles || []).map((style: string, index: number) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {style}
              <button type="button" onClick={() => removeFromArray("print_styles", index)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Surface Techniques */}
      <div className="space-y-2">
        <Label>Surface Techniques</Label>
        <div className="flex gap-2">
          <Input
            value={newTechnique}
            onChange={(e) => setNewTechnique(e.target.value)}
            placeholder="e.g., Screen print, Digital print, Block print"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("surface_techniques", newTechnique, setNewTechnique))}
          />
          <Button type="button" variant="outline" size="icon" onClick={() => addToArray("surface_techniques", newTechnique, setNewTechnique)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(materials.surface_techniques || []).map((technique: string, index: number) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {technique}
              <button type="button" onClick={() => removeFromArray("surface_techniques", index)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Text Fields */}
      <div className="space-y-2">
        <Label htmlFor="repeat_structure">Repeat Structure</Label>
        <Textarea
          id="repeat_structure"
          value={materials.repeat_structure || ""}
          onChange={(e) => updateNestedData("material_direction", "repeat_structure", e.target.value)}
          placeholder="Half-drop, brick, mirror, rotational repeat guidance..."
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="print_story">Print Story</Label>
        <Textarea
          id="print_story"
          value={materials.print_story || ""}
          onChange={(e) => updateNestedData("material_direction", "print_story", e.target.value)}
          placeholder="The narrative behind the print collection..."
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}

function JewelryMaterials() {
  const { formData, updateNestedData } = useWizardContext();
  const materials = formData.material_direction;
  const [newMetal, setNewMetal] = useState("");
  const [newStone, setNewStone] = useState("");

  const addToArray = (field: string, value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      const current = (materials as any)[field] || [];
      updateNestedData("material_direction", field, [...current, value.trim()]);
      setter("");
    }
  };

  const removeFromArray = (field: string, index: number) => {
    const current = (materials as any)[field] || [];
    updateNestedData("material_direction", field, current.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Gem className="h-5 w-5" />
        <span className="text-sm font-medium">Jewelry Materials</span>
      </div>

      {/* Metals */}
      <div className="space-y-2">
        <Label>Metals & Plating</Label>
        <div className="flex gap-2">
          <Input
            value={newMetal}
            onChange={(e) => setNewMetal(e.target.value)}
            placeholder="e.g., Sterling silver, 18K gold plated, Brass"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("metals", newMetal, setNewMetal))}
          />
          <Button type="button" variant="outline" size="icon" onClick={() => addToArray("metals", newMetal, setNewMetal)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(materials.metals as any[] || []).map((metal: any, index: number) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {typeof metal === "string" ? metal : metal.name}
              <button type="button" onClick={() => removeFromArray("metals", index)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Stones */}
      <div className="space-y-2">
        <Label>Stones & Crystals</Label>
        <div className="flex gap-2">
          <Input
            value={newStone}
            onChange={(e) => setNewStone(e.target.value)}
            placeholder="e.g., Swarovski crystals, Semi-precious stones"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("stones", newStone, setNewStone))}
          />
          <Button type="button" variant="outline" size="icon" onClick={() => addToArray("stones", newStone, setNewStone)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(materials.stones || []).map((stone: string, index: number) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {stone}
              <button type="button" onClick={() => removeFromArray("stones", index)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Text Fields */}
      <div className="space-y-2">
        <Label htmlFor="metal_hierarchy">Metal Hierarchy</Label>
        <Textarea
          id="metal_hierarchy"
          value={materials.metal_hierarchy || ""}
          onChange={(e) => updateNestedData("material_direction", "metal_hierarchy", e.target.value)}
          placeholder="Primary and secondary metal usage, mixing rules..."
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scale_proportion">Scale & Proportion</Label>
        <Textarea
          id="scale_proportion"
          value={materials.scale_proportion || ""}
          onChange={(e) => updateNestedData("material_direction", "scale_proportion", e.target.value)}
          placeholder="Size guidelines, weight considerations, wearability..."
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hardware_mechanics">Hardware Mechanics</Label>
        <Textarea
          id="hardware_mechanics"
          value={materials.hardware_mechanics || ""}
          onChange={(e) => updateNestedData("material_direction", "hardware_mechanics", e.target.value)}
          placeholder="Clasps, hinges, closures, articulated elements..."
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}
