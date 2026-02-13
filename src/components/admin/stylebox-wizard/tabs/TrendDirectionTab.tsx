import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWizardContext } from "../WizardContext";
import { Globe, MapPin } from "lucide-react";

export function TrendDirectionTab() {
  const { formData, updateFormData } = useWizardContext();

  const narrativeWordCount = (formData.trend_narrative || "").split(/\s+/).filter(Boolean).length;
  const isNarrativeValid = narrativeWordCount >= 300 && narrativeWordCount <= 600;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Trend Direction</h3>
        <p className="text-sm text-muted-foreground">
          Define the creative narrative and market context
        </p>
      </div>

      {/* Trend Narrative */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="trend_narrative">Trend Narrative *</Label>
          <span className={`text-xs ${isNarrativeValid ? "text-success" : narrativeWordCount > 0 ? "text-warning" : "text-muted-foreground"}`}>
            {narrativeWordCount} / 300-600 words
          </span>
        </div>
        <Textarea
          id="trend_narrative"
          value={formData.trend_narrative || ""}
          onChange={(e) => updateFormData("trend_narrative", e.target.value)}
          placeholder="Write a compelling 300-600 word trend narrative that sets the creative direction. Include cultural context, market drivers, and design inspiration..."
          className="min-h-[200px]"
        />
        <p className="text-xs text-muted-foreground">
          This narrative will be included in the full PDF brief. It should inspire and guide designers.
        </p>
      </div>

      {/* Global Drivers */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="global_drivers">Global Drivers</Label>
        </div>
        <Textarea
          id="global_drivers"
          value={formData.global_drivers || ""}
          onChange={(e) => updateFormData("global_drivers", e.target.value)}
          placeholder="Describe the global macro trends driving this direction: cultural shifts, consumer behavior changes, market movements, sustainability concerns, etc."
          className="min-h-[120px]"
        />
      </div>

      {/* Local Relevance */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="local_relevance">Local Relevance (Pakistan/South Asia)</Label>
        </div>
        <Textarea
          id="local_relevance"
          value={formData.local_relevance || ""}
          onChange={(e) => updateFormData("local_relevance", e.target.value)}
          placeholder="How does this trend translate to the Pakistan and South Asian market? Consider local craftsmanship, cultural sensibilities, and regional consumer preferences..."
          className="min-h-[120px]"
        />
      </div>

      {/* Story Essence Preview */}
      {formData.trend_narrative && (
        <div className="p-4 bg-muted/50 rounded-lg border space-y-2">
          <Label className="text-xs uppercase tracking-wider">Preview: Story Essence</Label>
          <p className="text-sm italic text-muted-foreground line-clamp-3">
            "{formData.trend_narrative.slice(0, 200)}..."
          </p>
        </div>
      )}
    </div>
  );
}
