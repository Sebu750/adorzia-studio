import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useWizardContext } from "../WizardContext";
import { SEASON_OPTIONS } from "@/lib/stylebox-template";
import type { Database } from "@/integrations/supabase/types";

type StyleboxDifficulty = Database["public"]["Enums"]["stylebox_difficulty"];
type DesignerCategory = Database["public"]["Enums"]["designer_category"];
type ContentStatus = Database["public"]["Enums"]["content_status"];

export function BasicSetupTab() {
  const { formData, updateFormData } = useWizardContext();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Basic Setup</h3>
        <p className="text-sm text-muted-foreground">
          Configure the core details of this StyleBox
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData("title", e.target.value)}
          placeholder="e.g., Urban Minimalist Capsule Collection"
          className="max-w-xl"
        />
      </div>

      {/* Season & Collection Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Season</Label>
          <Select
            value={formData.season || ""}
            onValueChange={(v) => updateFormData("season", v || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select season..." />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {SEASON_OPTIONS.map((season) => (
                <SelectItem key={season} value={season}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="collection_size">Collection Size (pieces)</Label>
          <Input
            id="collection_size"
            type="number"
            min={1}
            max={50}
            value={formData.collection_size || ""}
            onChange={(e) => updateFormData("collection_size", parseInt(e.target.value) || undefined)}
            placeholder="e.g., 5"
          />
        </div>
      </div>

      {/* Category & Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(v) => updateFormData("category", v as DesignerCategory)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="textile">Textile</SelectItem>
              <SelectItem value="jewelry">Jewelry</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Difficulty *</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(v) => updateFormData("difficulty", v as StyleboxDifficulty)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="insane">Insane</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* XP & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="xp_reward">XP Reward</Label>
          <Input
            id="xp_reward"
            type="number"
            min={0}
            step={25}
            value={formData.xp_reward || 100}
            onChange={(e) => updateFormData("xp_reward", parseInt(e.target.value) || 100)}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status || "draft"}
            onValueChange={(v) => updateFormData("status", v as ContentStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="Brief overview of this challenge (shown in card previews)"
          className="min-h-[80px]"
        />
      </div>

      {/* Feature Toggles */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Featured StyleBox</Label>
            <p className="text-sm text-muted-foreground">
              Highlight this StyleBox on the main page
            </p>
          </div>
          <Switch
            checked={formData.is_featured || false}
            onCheckedChange={(checked) => updateFormData("is_featured", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Walkthrough Mode</Label>
            <p className="text-sm text-muted-foreground">
              Enable step-by-step tutorial experience
            </p>
          </div>
          <Switch
            checked={formData.is_walkthrough || false}
            onCheckedChange={(checked) => updateFormData("is_walkthrough", checked)}
          />
        </div>
      </div>
    </div>
  );
}
