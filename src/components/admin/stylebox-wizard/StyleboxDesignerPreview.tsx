import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWizardContext } from "./WizardContext";
import { X, ZoomIn, Download, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StyleboxDesignerPreviewProps {
  onClose: () => void;
}

export function StyleboxDesignerPreview({ onClose }: StyleboxDesignerPreviewProps) {
  const { formData } = useWizardContext();
  const archetype = (formData as any).archetype || {};
  const mutation = (formData as any).mutation || {};
  const restrictions = (formData as any).restrictions || { points: [] };
  const manifestation = (formData as any).manifestation || {};
  const deliverables = (formData as any).adorzia_deliverables || [];

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-200">
      {/* Top Bar (Designer Workspace Header) */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-muted/30">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-background text-[10px] font-bold tracking-widest uppercase">
            Designer Preview Mode
          </Badge>
          <h2 className="text-sm font-semibold">{formData.title}</h2>
          <Badge variant="secondary" className="text-[10px] uppercase">
            {formData.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Design Kit
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main 4-Quadrant Grid (The Adorzia Protocol) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#1a1a1a] text-white">
        {/* Q1: Archetype */}
        <div className="border-r border-b border-white/10 p-8 flex flex-col gap-6 relative group">
          <div className="absolute top-4 left-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Q1: Archetype</div>
          <div className="flex-1 flex flex-col justify-center gap-8 max-w-xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-3xl font-serif italic text-white/90">{archetype.silhouette || "The Foundation"}</h3>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                {archetype.rationale || "No rationale provided for this archetype."}
              </p>
            </div>
            <div className="relative aspect-[4/5] bg-white/5 rounded-sm overflow-hidden border border-white/5 shadow-2xl">
              {archetype.anchor_image ? (
                <img src={archetype.anchor_image} alt="Anchor" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 uppercase tracking-widest text-[10px]">Reference Anchor</div>
              )}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 border-white/10">
                  <ZoomIn className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Q2: Mutation */}
        <div className="border-b border-white/10 p-8 flex flex-col gap-6 relative">
          <div className="absolute top-4 left-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Q2: Mutation</div>
          <div className="flex-1 flex flex-col gap-8">
            <div className="space-y-4 max-w-xl">
              <h3 className="text-2xl font-serif italic text-white/90">{mutation.concept || "The Disruption"}</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                {mutation.directive || "No creative directive provided."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 flex-1">
              {(mutation.moodboard?.length > 0 ? mutation.moodboard : [1, 2, 3, 4]).map((img: any, i: number) => (
                <div key={i} className="aspect-square bg-white/5 rounded-sm overflow-hidden border border-white/5 transition-all hover:scale-[1.02] cursor-zoom-in">
                  {img.url ? (
                    <img src={img.url} alt={`Mood ${i}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 text-[8px] uppercase tracking-widest">Mood Asset {i + 1}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Q3: Restrictions */}
        <div className="border-r border-white/10 p-8 flex flex-col gap-6 relative">
          <div className="absolute top-4 left-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Q3: Restrictions</div>
          <div className="flex-1 flex flex-col gap-8 max-w-xl mx-auto w-full">
            <div className="space-y-6 mt-8">
              {restrictions.points.map((p: any) => (
                <div key={p.id} className="border-l border-white/20 pl-6 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-white/30 uppercase">{p.type}</span>
                    <h4 className="text-sm font-semibold tracking-wide">{p.label}</h4>
                  </div>
                  <p className="text-xs text-white/40 font-light leading-relaxed">{p.details}</p>
                </div>
              ))}
              {restrictions.points.length === 0 && (
                <div className="text-center py-12 text-white/20 text-xs italic">No technical restrictions defined.</div>
              )}
            </div>

            {(restrictions.tolerances?.max_weight || restrictions.tolerances?.max_cost) && (
              <div className="mt-auto grid grid-cols-2 gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                {restrictions.tolerances.max_weight && (
                  <div>
                    <div className="text-[8px] uppercase font-bold text-white/30 mb-1">Max Weight</div>
                    <div className="text-lg font-mono">{restrictions.tolerances.max_weight} <span className="text-[10px] text-white/40">KG</span></div>
                  </div>
                )}
                {restrictions.tolerances.max_cost && (
                  <div>
                    <div className="text-[8px] uppercase font-bold text-white/30 mb-1">Max Cost</div>
                    <div className="text-lg font-mono">${restrictions.tolerances.max_cost} <span className="text-[10px] text-white/40">USD</span></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Q4: Manifestation (Workspace) */}
        <div className="p-8 flex flex-col gap-6 relative bg-black/40">
          <div className="absolute top-4 left-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Q4: Manifestation</div>
          <div className="flex-1 flex flex-col gap-8 max-w-xl mx-auto w-full h-full">
            <div className="space-y-4 text-center mt-12">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/40">The Prompt</h3>
              <p className="text-xl font-serif text-white/80 leading-relaxed italic">
                "{manifestation.prompt || "Final design prompt will appear here."}"
              </p>
            </div>

            <div className="flex-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 bg-white/[0.02]">
              <div className="p-4 rounded-full bg-white/5">
                <Upload className="h-8 w-8 text-white/20" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white/60">Drag and drop your work here</p>
                <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest">Deliverables Required: {deliverables.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Designer Sidebar (Checklist) */}
      <div className="absolute right-0 top-16 bottom-0 w-80 bg-background border-l shadow-2xl p-6 hidden lg:flex flex-col gap-8">
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-widest">Deliverables Checklist</h3>
          <p className="text-[10px] text-muted-foreground italic">Complete all to activate submission</p>
        </div>

        <div className="flex-1 space-y-4">
          {deliverables.map((d: any) => (
            <div key={d.id} className="flex items-start gap-3 p-3 rounded-xl border bg-muted/20 opacity-60">
              <div className="h-5 w-5 rounded-full border border-dashed flex-shrink-0 flex items-center justify-center">
                <Lock className="h-2.5 w-2.5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold">{d.name}</p>
                <Badge variant="outline" className="text-[8px] h-4 px-1.5 font-bold">{d.file_type}</Badge>
              </div>
            </div>
          ))}
          {deliverables.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-xs italic">No deliverables configured.</div>
          )}
        </div>

        <Button disabled className="w-full h-12 uppercase font-bold tracking-widest text-xs gap-2">
          <CheckCircle2 className="h-4 w-4" /> Submit to Adorzia
        </Button>
      </div>
    </div>
  );
}
