import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWizardContext } from "../WizardContext";
import { Info } from "lucide-react";

export function ManifestationTab() {
  const { formData, updateFormData } = useWizardContext();
  const manifestation = (formData as any).manifestation || { prompt: "" };

  const handleUpdate = (key: string, value: any) => {
    updateFormData("manifestation" as any, { ...manifestation, [key]: value } as any);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Quadrant 4: The Manifestation
          <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-admin-accent text-admin-accent-foreground uppercase tracking-wider">
            Final Prompt
          </div>
        </h3>
        <p className="text-sm text-muted-foreground">
          Define the final design prompt and instructions for the designer.
        </p>
      </div>

      <div className="space-y-4 max-w-4xl">
        <div className="space-y-2">
          <Label htmlFor="prompt" className="flex items-center gap-1.5">
            Design Prompt *
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </Label>
          <Textarea
            id="prompt"
            value={manifestation.prompt || ""}
            onChange={(e) => handleUpdate("prompt", e.target.value)}
            placeholder="Write the final prompt to the designer... This is the ultimate instruction they must follow."
            className="min-h-[300px] font-serif text-lg leading-relaxed p-6 bg-admin-card border-admin-border"
          />
          <div className="flex justify-between items-center text-[10px] text-muted-foreground italic px-1">
            <p>* This prompt will be the focal point of the designer's workspace.</p>
            <p>{manifestation.prompt?.length || 0} characters</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-admin-accent/5 border border-admin-accent/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-admin-accent mb-2">Curator Tip</h4>
          <p className="text-xs text-admin-muted-foreground leading-relaxed">
            A strong manifestation prompt bridges the gap between the <span className="font-semibold text-admin-foreground italic">Archetype</span> (The Constant) and the <span className="font-semibold text-admin-foreground italic">Mutation</span> (The Disruption). It should be clear, inspiring, and technically grounded.
          </p>
        </div>
      </div>
    </div>
  );
}
