import { useState } from "react";
import { useWizardContext } from "../WizardContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, AlertTriangle, Layers } from "lucide-react";
import type { StyleBoxConstraint, ConstraintType } from "@/lib/stylebox-template";

const CONSTRAINT_TYPES: { value: ConstraintType; label: string; color: string }[] = [
  { value: 'silhouette', label: 'Silhouette', color: 'bg-purple-500/20 text-purple-600' },
  { value: 'fabric', label: 'Fabric', color: 'bg-blue-500/20 text-blue-600' },
  { value: 'structure', label: 'Structure', color: 'bg-amber-500/20 text-amber-600' },
<<<<<<< HEAD
  { value: 'technique', label: 'Technique', color: 'bg-success/20 text-success' },
=======
  { value: 'technique', label: 'Technique', color: 'bg-emerald-500/20 text-emerald-600' },
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  { value: 'sizing', label: 'Sizing', color: 'bg-pink-500/20 text-pink-600' },
  { value: 'innovation', label: 'Innovation', color: 'bg-red-500/20 text-red-600' },
  { value: 'colors', label: 'Colors', color: 'bg-orange-500/20 text-orange-600' },
  { value: 'motifs', label: 'Motifs', color: 'bg-teal-500/20 text-teal-600' },
  { value: 'application', label: 'Application', color: 'bg-indigo-500/20 text-indigo-600' },
  { value: 'mechanism', label: 'Mechanism', color: 'bg-cyan-500/20 text-cyan-600' },
  { value: 'format', label: 'Format', color: 'bg-violet-500/20 text-violet-600' },
  { value: 'stone', label: 'Stone', color: 'bg-rose-500/20 text-rose-600' },
  { value: 'metal', label: 'Metal', color: 'bg-yellow-500/20 text-yellow-600' },
];

export function ConstraintsTab() {
  const { formData, updateFormData } = useWizardContext();
  const constraints = formData.constraints || [];
  
  const [newConstraint, setNewConstraint] = useState<Partial<StyleBoxConstraint>>({
    type: 'technique',
    label: '',
    value: '',
    is_required: true,
  });

  const addConstraint = () => {
    if (!newConstraint.label?.trim() || !newConstraint.value?.trim()) return;
    
    const constraint: StyleBoxConstraint = {
      type: newConstraint.type as ConstraintType,
      label: newConstraint.label.trim(),
      value: newConstraint.value.trim(),
      is_required: newConstraint.is_required ?? true,
    };
    
    updateFormData("constraints", [...constraints, constraint]);
    setNewConstraint({
      type: 'technique',
      label: '',
      value: '',
      is_required: true,
    });
  };

  const removeConstraint = (index: number) => {
    updateFormData("constraints", constraints.filter((_, i) => i !== index));
  };

  const toggleRequired = (index: number) => {
    const updated = [...constraints];
    updated[index] = { ...updated[index], is_required: !updated[index].is_required };
    updateFormData("constraints", updated);
  };

  const getConstraintColor = (type: ConstraintType) => {
    return CONSTRAINT_TYPES.find(ct => ct.value === type)?.color || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Design Constraints</h3>
        <p className="text-sm text-muted-foreground">
          Define the specific constraints and requirements designers must follow in this challenge.
        </p>
      </div>

      {/* Current Constraints */}
      {constraints.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Active Constraints ({constraints.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {constraints.map((constraint, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getConstraintColor(constraint.type)}>
                      {constraint.type}
                    </Badge>
                    <span className="font-medium text-sm">{constraint.label}</span>
                    {constraint.is_required && (
                      <Badge variant="destructive" className="text-xs gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{constraint.value}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Required</Label>
                    <Switch
                      checked={constraint.is_required}
                      onCheckedChange={() => toggleRequired(index)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeConstraint(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add New Constraint */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            Add Constraint
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={newConstraint.type}
                onValueChange={(value) => setNewConstraint(prev => ({ ...prev, type: value as ConstraintType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONSTRAINT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${type.color.split(' ')[0]}`} />
                        {type.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={newConstraint.label || ''}
                onChange={(e) => setNewConstraint(prev => ({ ...prev, label: e.target.value }))}
                placeholder="e.g., Silhouette, Fabric"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newConstraint.is_required ?? true}
                  onCheckedChange={(checked) => setNewConstraint(prev => ({ ...prev, is_required: checked }))}
                />
                <Label className="text-sm">Required</Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Value / Specification</Label>
            <Input
              value={newConstraint.value || ''}
              onChange={(e) => setNewConstraint(prev => ({ ...prev, value: e.target.value }))}
              placeholder="e.g., Bias-cut slip dress, Must appear fluid (Silk Satin)"
            />
            <p className="text-xs text-muted-foreground">
              Describe the specific requirement or constraint for this aspect.
            </p>
          </div>
          <Button 
            type="button" 
            onClick={addConstraint}
            disabled={!newConstraint.label?.trim() || !newConstraint.value?.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Constraint
          </Button>
        </CardContent>
      </Card>

      {/* Empty State */}
      {constraints.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/30">
          <Layers className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No constraints added yet.</p>
          <p className="text-sm text-muted-foreground">Add constraints to define the challenge rules.</p>
        </div>
      )}
    </div>
  );
}
