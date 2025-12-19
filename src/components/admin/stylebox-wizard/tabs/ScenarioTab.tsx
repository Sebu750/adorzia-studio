import { useWizardContext } from "../WizardContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Target, Sparkles } from "lucide-react";
import { STUDIO_OPTIONS, TARGET_ROLE_OPTIONS, LEVEL_LABELS } from "@/lib/stylebox-template";
import type { StudioName, LevelNumber } from "@/lib/stylebox-template";

export function ScenarioTab() {
  const { formData, updateFormData, updateNestedData } = useWizardContext();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Scenario Setup</h3>
        <p className="text-sm text-muted-foreground">
          Define the client scenario, target role, and challenge context for this production-grade StyleBox.
        </p>
      </div>

      {/* Studio & Client */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Studio & Client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Studio</Label>
              <Select
                value={formData.studio_name || ''}
                onValueChange={(value) => {
                  const studio = STUDIO_OPTIONS.find(s => s.value === value);
                  updateFormData("studio_name", value as StudioName);
                  if (studio) {
                    updateFormData("category", studio.category);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select studio" />
                </SelectTrigger>
                <SelectContent>
                  {STUDIO_OPTIONS.map((studio) => (
                    <SelectItem key={studio.value} value={studio.value}>
                      {studio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input
                value={formData.client_name || ""}
                onChange={(e) => updateFormData("client_name", e.target.value)}
                placeholder="e.g., Sophia, Maria B."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level & Role */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Level & Target Role
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Level Number</Label>
              <Select
                value={String(formData.level_number || 1)}
                onValueChange={(value) => updateFormData("level_number", parseInt(value) as LevelNumber)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {([1, 2, 3, 4] as LevelNumber[]).map((level) => (
                    <SelectItem key={level} value={String(level)}>
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${LEVEL_LABELS[level].color}`} />
                        {LEVEL_LABELS[level].label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Role</Label>
              <Select
                value={formData.target_role || ''}
                onValueChange={(value) => updateFormData("target_role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target role" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Time Limit (Hours)
              </Label>
              <Input
                type="number"
                min={1}
                max={168}
                value={formData.time_limit_hours || ""}
                onChange={(e) => updateFormData("time_limit_hours", parseInt(e.target.value) || undefined)}
                placeholder="e.g., 4, 12, 48, 72"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Context */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Scenario Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Context</Label>
              <Input
                value={formData.scenario?.context || ""}
                onChange={(e) => updateNestedData("scenario", "context", e.target.value)}
                placeholder="e.g., Engagement Party, Fashion Week"
              />
              <p className="text-xs text-muted-foreground">The occasion or situation for this design.</p>
            </div>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Input
                value={formData.scenario?.theme || ""}
                onChange={(e) => updateNestedData("scenario", "theme", e.target.value)}
                placeholder="e.g., Romantic Minimalism, Eco-Couture"
              />
              <p className="text-xs text-muted-foreground">The creative theme or direction.</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Difficulty Spike</Label>
            <Textarea
              value={formData.scenario?.difficulty_spike || ""}
              onChange={(e) => updateNestedData("scenario", "difficulty_spike", e.target.value)}
              placeholder="Explain what makes this level uniquely challenging..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              The key challenge that distinguishes this level. What makes it harder than the previous?
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
