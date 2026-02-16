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
<<<<<<< HEAD
import { Badge } from "@/components/ui/badge";
import { useWizardContext } from "../WizardContext";
import { 
  SEASON_OPTIONS, 
  COLLECTION_LINE_OPTIONS, 
  MARKET_CONTEXT_OPTIONS,
  VISIBILITY_TAG_OPTIONS
} from "@/lib/stylebox-template";
import type { Database } from "@/integrations/supabase/types";
import { Sparkles } from "lucide-react";
=======
import { useWizardContext } from "../WizardContext";
import { SEASON_OPTIONS } from "@/lib/stylebox-template";
import type { Database } from "@/integrations/supabase/types";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

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
<<<<<<< HEAD
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData("title", e.target.value)}
            placeholder="e.g., Urban Minimalist Capsule Collection"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="display_id">StyleBox ID</Label>
          <div className="relative">
            <Input
              id="display_id"
              value={formData.display_id || "Auto-generated"}
              readOnly
              className="bg-muted font-mono text-xs"
            />
            {!formData.display_id && (
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Classification Taxonomy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Collection Line</Label>
          <Select
            value={formData.collection_line || ""}
            onValueChange={(v) => updateFormData("collection_line", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select collection line..." />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {COLLECTION_LINE_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Market Context</Label>
          <Select
            value={formData.market_context || ""}
            onValueChange={(v) => updateFormData("market_context", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select market context..." />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {MARKET_CONTEXT_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
=======
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData("title", e.target.value)}
          placeholder="e.g., Urban Minimalist Capsule Collection"
          className="max-w-xl"
        />
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="xp_reward">SC Reward</Label>
=======
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="xp_reward">XP Reward</Label>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
        <div className="space-y-2">
          <Label>Visibility Tags</Label>
          <Select
            value={formData.visibility_tags?.[0] || ""}
            onValueChange={(v) => updateFormData("visibility_tags", [v])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select targeting..." />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {VISIBILITY_TAG_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
