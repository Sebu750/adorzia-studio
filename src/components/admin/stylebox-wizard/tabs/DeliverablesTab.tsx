import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useWizardContext } from "../WizardContext";
import { STANDARD_DELIVERABLES, getCategoryDeliverables } from "@/lib/stylebox-template";
import type { DeliverableItem } from "@/lib/stylebox-template";
import { Plus, X, GripVertical } from "lucide-react";
import { useState } from "react";

export function DeliverablesTab() {
  const { formData, updateFormData } = useWizardContext();
  const [newDeliverable, setNewDeliverable] = useState({
    name: "",
    description: "",
    required: false,
  });

  const categoryDeliverables = getCategoryDeliverables(formData.category);

  const toggleDeliverable = (id: string) => {
    const exists = formData.deliverables.find(d => d.id === id);
    if (exists) {
      updateFormData("deliverables", formData.deliverables.filter(d => d.id !== id));
    } else {
      const standard = STANDARD_DELIVERABLES.find(d => d.id === id);
      if (standard) {
        updateFormData("deliverables", [...formData.deliverables, standard]);
      }
    }
  };

  const updateDeliverable = (id: string, field: keyof DeliverableItem, value: any) => {
    updateFormData("deliverables", formData.deliverables.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  const addCustomDeliverable = () => {
    if (newDeliverable.name.trim()) {
      const custom: DeliverableItem = {
        id: `custom-${Date.now()}`,
        name: newDeliverable.name.trim(),
        description: newDeliverable.description.trim() || undefined,
        required: newDeliverable.required,
      };
      updateFormData("deliverables", [...formData.deliverables, custom]);
      setNewDeliverable({ name: "", description: "", required: false });
    }
  };

  const removeDeliverable = (id: string) => {
    updateFormData("deliverables", formData.deliverables.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Deliverables</h3>
        <p className="text-sm text-muted-foreground">
          Define what designers must submit for this StyleBox
        </p>
      </div>

      {/* Standard Deliverables */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Standard Deliverables for {formData.category}
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categoryDeliverables.map((item) => {
            const isSelected = formData.deliverables.some(d => d.id === item.id);
            return (
              <div
                key={item.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                }`}
                onClick={() => toggleDeliverable(item.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleDeliverable(item.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.name}</span>
                      {item.required && (
                        <span className="text-xs text-muted-foreground">(Recommended)</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Deliverables with Details */}
      {formData.deliverables.length > 0 && (
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Selected Deliverables ({formData.deliverables.length})
          </Label>
          <div className="space-y-2">
            {formData.deliverables.map((deliverable) => (
              <div
                key={deliverable.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="font-medium text-sm">{deliverable.name}</div>
                  <Input
                    value={deliverable.naming_convention || ""}
                    onChange={(e) => updateDeliverable(deliverable.id, "naming_convention", e.target.value)}
                    placeholder="Naming convention..."
                    className="h-8 text-sm"
                  />
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`required-${deliverable.id}`}
                        checked={deliverable.required}
                        onCheckedChange={(checked) => updateDeliverable(deliverable.id, "required", checked)}
                      />
                      <label htmlFor={`required-${deliverable.id}`} className="text-xs">
                        Required
                      </label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeDeliverable(deliverable.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Deliverable */}
      <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
        <Label className="text-sm font-medium">Add Custom Deliverable</Label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="space-y-1">
            <Label className="text-xs">Name *</Label>
            <Input
              value={newDeliverable.name}
              onChange={(e) => setNewDeliverable(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Lookbook Spread"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs">Description</Label>
            <Input
              value={newDeliverable.description}
              onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description..."
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="new-required"
                checked={newDeliverable.required}
                onCheckedChange={(checked) => setNewDeliverable(prev => ({ ...prev, required: !!checked }))}
              />
              <label htmlFor="new-required" className="text-xs">Required</label>
            </div>
            <Button
              type="button"
              onClick={addCustomDeliverable}
              disabled={!newDeliverable.name.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
