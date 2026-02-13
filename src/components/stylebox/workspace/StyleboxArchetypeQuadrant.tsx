import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface StyleboxArchetypeQuadrantProps {
  data: {
    silhouette?: string;
    custom_silhouette?: string;
    rationale?: string;
    anchor_image?: string;
  };
  darkroomMode: boolean;
}

export function StyleboxArchetypeQuadrant({
  data,
  darkroomMode,
}: StyleboxArchetypeQuadrantProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const silhouetteDisplay =
    data?.silhouette === "Custom"
      ? data?.custom_silhouette || "Custom"
      : data?.silhouette || "Not specified";

  return (
    <>
      <div
        className={cn(
          "border-r border-b p-8 flex flex-col gap-6 relative group",
          darkroomMode
            ? "border-white/10 bg-[#1a1a1a]"
            : "border-gray-200 bg-white"
        )}
      >
        {/* Quadrant Label */}
        <div
          className={cn(
            "absolute top-4 left-4 text-[10px] font-bold uppercase tracking-[0.2em]",
            darkroomMode ? "text-white/40" : "text-gray-400"
          )}
        >
          Q1: Archetype
        </div>

        <div className="flex-1 flex flex-col justify-center gap-8 max-w-xl mx-auto w-full mt-8">
          {/* Title and Description */}
          <div className="space-y-4">
            <h3
              className={cn(
                "text-3xl font-serif italic",
                darkroomMode ? "text-white/90" : "text-gray-900"
              )}
            >
              {silhouetteDisplay}
            </h3>
            <div
              className={cn(
                "text-[10px] uppercase font-bold tracking-widest",
                darkroomMode ? "text-white/50" : "text-gray-500"
              )}
            >
              Commercial Constant
            </div>
            <p
              className={cn(
                "text-sm leading-relaxed font-light",
                darkroomMode ? "text-white/60" : "text-gray-600"
              )}
            >
              {data?.rationale || "No rationale provided for this archetype."}
            </p>
          </div>

          {/* Anchor Image with Deep Zoom */}
          <div
            className={cn(
              "relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl",
              darkroomMode
                ? "bg-white/5 border border-white/5"
                : "bg-gray-100 border border-gray-200"
            )}
          >
            {data?.anchor_image ? (
              <>
                <img
                  src={data.anchor_image}
                  alt="Anchor Reference"
                  className="w-full h-full object-contain cursor-zoom-in"
                  onClick={() => setZoomOpen(true)}
                />
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    className={cn(
                      "h-8 w-8 rounded-full",
                      darkroomMode
                        ? "bg-white/10 hover:bg-white/20 border-white/10"
                        : "bg-gray-800/80 hover:bg-gray-800"
                    )}
                    onClick={() => setZoomOpen(true)}
                  >
                    <ZoomIn
                      className={cn(
                        "h-4 w-4",
                        darkroomMode ? "text-white" : "text-white"
                      )}
                    />
                  </Button>
                </div>
              </>
            ) : (
              <div
                className={cn(
                  "w-full h-full flex items-center justify-center uppercase tracking-widest text-[10px]",
                  darkroomMode ? "text-white/20" : "text-gray-300"
                )}
              >
                Reference Anchor
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deep Zoom Modal */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent
          className={cn(
            "max-w-[95vw] max-h-[95vh] p-0 overflow-hidden",
            darkroomMode ? "bg-black border-white/10" : "bg-white"
          )}
        >
          <div className="relative w-full h-[90vh]">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70"
              onClick={() => setZoomOpen(false)}
            >
              <X className="h-4 w-4 text-white" />
            </Button>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/80 rounded-full px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel((prev) => Math.max(50, prev - 25))}
                className="h-8 px-3 text-white hover:bg-white/10"
                disabled={zoomLevel <= 50}
              >
                −
              </Button>
              <span className="text-white text-xs font-mono min-w-[60px] text-center">
                {zoomLevel}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel((prev) => Math.min(200, prev + 25))}
                className="h-8 px-3 text-white hover:bg-white/10"
                disabled={zoomLevel >= 200}
              >
                +
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(100)}
                className="h-8 px-3 text-white hover:bg-white/10 ml-2"
              >
                Reset
              </Button>
            </div>

            {/* Zoomable Image */}
            <div className="w-full h-full overflow-auto p-8 flex items-center justify-center">
              {data?.anchor_image && (
                <img
                  src={data.anchor_image}
                  alt="Anchor Reference - Zoomed"
                  className="transition-transform duration-200"
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: "center center",
                  }}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
