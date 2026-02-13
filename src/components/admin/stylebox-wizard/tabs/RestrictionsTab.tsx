import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWizardContext } from "../WizardContext";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function RestrictionsTab() {
  const { formData, updateFormData } = useWizardContext();
  const restrictions = (formData as any).restrictions || { points: [], tolerances: { max_weight: "", max_cost: "" } };

  const handleUpdate = (key: string, value: any) => {
    updateFormData("restrictions" as any, { ...restrictions, [key]: value } as any);
  };

  const addRestrictionPoint = () => {
    const newPoint = {
      id: Math.random().toString(36).substr(2, 9),
      type: "Substrate",
      label: "",
      details: "",
      isOpen: true
    };
    handleUpdate("points", [...restrictions.points, newPoint]);
  };

  const removeRestrictionPoint = (id: string) => {
    handleUpdate("points", restrictions.points.filter((p: any) => p.id !== id));
  };

  const updatePoint = (id: string, key: string, value: any) => {
    handleUpdate("points", restrictions.points.map((p: any) => 
      p.id === id ? { ...p, [key]: value } : p
    ));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Quadrant 3: The Restrictions
          <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-admin-accent text-admin-accent-foreground uppercase tracking-wider">
            Technical Brief
          </div>
        </h3>
        <p className="text-sm text-muted-foreground">
          Define the technical constraints, protocols, and tolerances.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dynamic List Builder */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-bold">Restriction Points</Label>
            <Button onClick={addRestrictionPoint} size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Add Point
            </Button>
          </div>

          <div className="space-y-3">
            {restrictions.points.map((point: any) => (
              <Collapsible
                key={point.id}
                open={point.isOpen}
                onOpenChange={(open) => updatePoint(point.id, "isOpen", open)}
                className="border rounded-xl bg-background shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between p-3 bg-muted/30">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="px-2 py-0.5 rounded bg-admin-accent/10 text-admin-accent text-[10px] font-bold uppercase">
                      {point.type}
                    </div>
                    <Input
                      placeholder="Point Label (e.g., Fabric Weight)"
                      value={point.label}
                      onChange={(e) => updatePoint(point.id, "label", e.target.value)}
                      className="h-8 border-none bg-transparent font-medium focus-visible:ring-0 px-0"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeRestrictionPoint(point.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {point.isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent className="p-4 border-t space-y-4 bg-muted/5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Category</Label>
                      <Input 
                        value={point.type} 
                        onChange={(e) => updatePoint(point.id, "type", e.target.value)}
                        placeholder="e.g., Substrate, Protocol"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Collapsible Details / Guidelines</Label>
                    <Textarea
                      placeholder="Enter technical details and specific constraints..."
                      value={point.details}
                      onChange={(e) => updatePoint(point.id, "details", e.target.value)}
                      className="min-h-[80px] text-xs"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

            {restrictions.points.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/10 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm">No technical restriction points defined</p>
                <Button onClick={addRestrictionPoint} variant="link" className="text-admin-accent text-xs">
                  Add your first restriction
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Tolerance Inputs */}
        <div className="space-y-6">
          <div className="p-5 border rounded-xl bg-admin-card shadow-sm space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-admin-muted-foreground">Numerical Tolerances</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max_weight" className="text-xs font-medium">Max Allowed Weight (kg)</Label>
                <div className="relative">
                  <Input
                    id="max_weight"
                    type="text"
                    placeholder="e.g., 1.2"
                    value={restrictions.tolerances.max_weight}
                    onChange={(e) => handleUpdate("tolerances", { ...restrictions.tolerances, max_weight: e.target.value })}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">KG</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_cost" className="text-xs font-medium">Max Production Cost ($)</Label>
                <div className="relative">
                  <Input
                    id="max_cost"
                    type="text"
                    placeholder="e.g., 500"
                    value={restrictions.tolerances.max_cost}
                    onChange={(e) => handleUpdate("tolerances", { ...restrictions.tolerances, max_cost: e.target.value })}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">USD</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 flex gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Tolerances are strictly enforced during the review phase. Ensure values are realistic for the specified difficulty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
