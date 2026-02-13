import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWizardContext } from "../WizardContext";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, FileType, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const FILE_TYPE_OPTIONS = [
  { value: "PDF", label: "PDF Document" },
  { value: "JPG", label: "High-Res Image (JPG)" },
  { value: "PNG", label: "Transparent Image (PNG)" },
  { value: "MP4", label: "Video Documentation (MP4)" },
  { value: "OBJ/GLB", label: "3D Model (OBJ/GLB)" },
  { value: "AI/PSD", label: "Source File (AI/PSD)" },
];

export function DeliverablesConfigTab() {
  const { formData, updateFormData } = useWizardContext();
  const deliverables = (formData as any).adorzia_deliverables || [];

  const handleUpdate = (newList: any[]) => {
    updateFormData("adorzia_deliverables" as any, newList as any);
  };

  const addDeliverable = () => {
    const newDeliverable = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      file_type: "PDF",
      description: "",
      required: true,
      grading_rubric: "",
      rubric_visible: false
    };
    handleUpdate([...deliverables, newDeliverable]);
  };

  const removeDeliverable = (id: string) => {
    handleUpdate(deliverables.filter((d: any) => d.id !== id));
  };

  const updateDeliverable = (id: string, key: string, value: any) => {
    handleUpdate(deliverables.map((d: any) => 
      d.id === id ? { ...d, [key]: value } : d
    ));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Module C: Adorzia Deliverables
          <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-admin-accent text-admin-accent-foreground uppercase tracking-wider">
            Output Configurator
          </div>
        </h3>
        <p className="text-sm text-muted-foreground">
          Define the specific assets required from the designer and their grading criteria.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <Label className="text-base font-bold">Required Assets & Grading</Label>
          <Button onClick={addDeliverable} size="sm" className="gap-2 bg-admin-foreground text-admin-background">
            <Plus className="h-4 w-4" /> Add Deliverable
          </Button>
        </div>

        <div className="space-y-6">
          {deliverables.map((item: any, index: number) => (
            <div key={item.id} className="relative p-6 border rounded-2xl bg-background shadow-sm space-y-6 transition-all hover:border-admin-accent/30">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Basic Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-[10px] font-bold">{index + 1}</span>
                      <Input
                        placeholder="Deliverable Name (e.g., Stitch Density Map)"
                        value={item.name}
                        onChange={(e) => updateDeliverable(item.id, "name", e.target.value)}
                        className="h-9 font-semibold text-base border-none focus-visible:ring-0 p-0"
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeDeliverable(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs flex items-center gap-1.5">
                        <FileType className="h-3 w-3" /> Accepted File Type
                      </Label>
                      <Select
                        value={item.file_type}
                        onValueChange={(v) => updateDeliverable(item.id, "file_type", v)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FILE_TYPE_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col justify-end">
                      <div className="flex items-center gap-2 h-9">
                        <Switch
                          checked={item.required}
                          onCheckedChange={(v) => updateDeliverable(item.id, "required", v)}
                        />
                        <Label className="text-xs">Required for submission</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Brief Instructions for this Asset</Label>
                    <Textarea
                      placeholder="Specific requirements for this deliverable..."
                      value={item.description}
                      onChange={(e) => updateDeliverable(item.id, "description", e.target.value)}
                      className="min-h-[60px] text-xs resize-none"
                    />
                  </div>
                </div>

                {/* Grading Rubric (Module C - FR-CR-09) */}
                <div className="flex-1 p-5 rounded-xl bg-muted/30 border border-dashed space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 text-admin-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Grading Rubric
                    </Label>
                    <div className="flex items-center gap-2">
                      {item.rubric_visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      <Switch
                        size="sm"
                        checked={item.rubric_visible}
                        onCheckedChange={(v) => updateDeliverable(item.id, "rubric_visible", v)}
                      />
                      <span className="text-[10px] font-medium uppercase">{item.rubric_visible ? "Public" : "Internal"}</span>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Define evaluation criteria... (e.g., Accuracy: 40%, Innovation: 60%)"
                    value={item.grading_rubric}
                    onChange={(e) => updateDeliverable(item.id, "grading_rubric", e.target.value)}
                    className="min-h-[120px] text-xs bg-background"
                  />
                  <p className="text-[9px] text-muted-foreground leading-tight italic">
                    * If set to Public, the designer will see these criteria as a guide during their workflow.
                  </p>
                </div>
              </div>
            </div>
          ))}

          {deliverables.length === 0 && (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-3xl bg-muted/10 text-muted-foreground">
              <div className="p-4 rounded-full bg-background shadow-sm mb-4">
                <CheckCircle2 className="h-8 w-8 opacity-20" />
              </div>
              <p className="text-sm font-medium">No deliverables configured yet</p>
              <p className="text-xs mt-1 mb-4">You must add at least one deliverable for the designer to submit.</p>
              <Button onClick={addDeliverable} variant="outline" size="sm">
                Initialize Deliverables List
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
