import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useWizardContext } from "../WizardContext";
import { DEFAULT_EVALUATION_CRITERIA } from "@/lib/stylebox-template";
import type { EvaluationCriterion } from "@/lib/stylebox-template";
import { Plus, X, AlertCircle, CheckCircle } from "lucide-react";

export function EvaluationTab() {
  const { formData, updateFormData } = useWizardContext();
  const [newCriterion, setNewCriterion] = useState({
    name: "",
    description: "",
    weight: 25,
  });

  const totalWeight = formData.evaluation_criteria.reduce((sum, c) => sum + c.weight, 0);
  const isValid = totalWeight === 100;

  const updateCriterion = (index: number, field: keyof EvaluationCriterion, value: any) => {
    const updated = [...formData.evaluation_criteria];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("evaluation_criteria", updated);
  };

  const removeCriterion = (index: number) => {
    updateFormData("evaluation_criteria", formData.evaluation_criteria.filter((_, i) => i !== index));
  };

  const addCriterion = () => {
    if (newCriterion.name.trim()) {
      const criterion: EvaluationCriterion = {
        name: newCriterion.name.trim(),
        description: newCriterion.description.trim(),
        weight: newCriterion.weight,
      };
      updateFormData("evaluation_criteria", [...formData.evaluation_criteria, criterion]);
      setNewCriterion({ name: "", description: "", weight: 25 });
    }
  };

  const resetToDefaults = () => {
    updateFormData("evaluation_criteria", [...DEFAULT_EVALUATION_CRITERIA]);
  };

  const distributeEvenly = () => {
    const count = formData.evaluation_criteria.length;
    if (count === 0) return;
    const evenWeight = Math.floor(100 / count);
    const remainder = 100 - evenWeight * count;
    const updated = formData.evaluation_criteria.map((c, i) => ({
      ...c,
      weight: evenWeight + (i === 0 ? remainder : 0),
    }));
    updateFormData("evaluation_criteria", updated);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Evaluation Criteria</h3>
        <p className="text-sm text-muted-foreground">
          Define scoring rubric for submissions (weights must total 100%)
        </p>
      </div>

      {/* Weight Status */}
      <div className={`flex items-center gap-2 p-3 rounded-lg border ${
        isValid ? "bg-success/10 border-success/30" : "bg-warning/10 border-warning/30"
      }`}>
        {isValid ? (
          <CheckCircle className="h-4 w-4 text-success" />
        ) : (
          <AlertCircle className="h-4 w-4 text-warning" />
        )}
        <span className="text-sm font-medium">
          Total Weight: {totalWeight}% {!isValid && "(must equal 100%)"}
        </span>
        <div className="flex-1" />
        <Button type="button" variant="outline" size="sm" onClick={distributeEvenly}>
          Distribute Evenly
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={resetToDefaults}>
          Reset Defaults
        </Button>
      </div>

      {/* Criteria List */}
      <div className="space-y-4">
        {formData.evaluation_criteria.map((criterion, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    value={criterion.name}
                    onChange={(e) => updateCriterion(index, "name", e.target.value)}
                    placeholder="Criterion name"
                    className="font-medium"
                  />
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <span className="text-2xl font-bold">{criterion.weight}%</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCriterion(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={criterion.description}
                  onChange={(e) => updateCriterion(index, "description", e.target.value)}
                  placeholder="Description of what judges look for..."
                  className="text-sm"
                />
                <Slider
                  value={[criterion.weight]}
                  onValueChange={([value]) => updateCriterion(index, "weight", value)}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Criterion */}
      <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
        <Label className="text-sm font-medium">Add New Criterion</Label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="space-y-1">
            <Label className="text-xs">Name *</Label>
            <Input
              value={newCriterion.name}
              onChange={(e) => setNewCriterion(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Innovation"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs">Description</Label>
            <Input
              value={newCriterion.description}
              onChange={(e) => setNewCriterion(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What judges evaluate..."
            />
          </div>
          <Button
            type="button"
            onClick={addCriterion}
            disabled={!newCriterion.name.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {formData.evaluation_criteria.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">No evaluation criteria defined</p>
          <Button type="button" variant="outline" onClick={resetToDefaults}>
            Use Default Criteria
          </Button>
        </div>
      )}
    </div>
  );
}
