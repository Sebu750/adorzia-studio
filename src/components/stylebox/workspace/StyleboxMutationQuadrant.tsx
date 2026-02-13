import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface StyleboxMutationQuadrantProps {
  data: {
    concept?: string;
    directive?: string;
    moodboard?: Array<{ url: string; id: string }>;
  };
  darkroomMode: boolean;
}

export function StyleboxMutationQuadrant({
  data,
  darkroomMode,
}: StyleboxMutationQuadrantProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const moodboard = data?.moodboard || [];

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % moodboard.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? moodboard.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div
        className={cn(
          "border-b p-8 flex flex-col gap-6 relative",
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
          Q2: Mutation
        </div>

        <div className="flex-1 flex flex-col gap-8 mt-8">
          {/* Concept and Directive */}
          <div className="space-y-4 max-w-xl">
            <div
              className={cn(
                "text-[10px] uppercase font-bold tracking-widest",
                darkroomMode ? "text-white/50" : "text-gray-500"
              )}
            >
              The Disruption
            </div>
            <h3
              className={cn(
                "text-2xl font-serif italic",
                darkroomMode ? "text-white/90" : "text-gray-900"
              )}
            >
              {data?.concept || "The Concept"}
            </h3>
            <p
              className={cn(
                "text-xs leading-relaxed",
                darkroomMode ? "text-white/50" : "text-gray-600"
              )}
            >
              {data?.directive || "No creative directive provided."}
            </p>
          </div>

          {/* Mood Board Grid */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {moodboard.length > 0 ? (
              moodboard.map((img, index) => (
                <div
                  key={img.id}
                  className={cn(
                    "aspect-square rounded-sm overflow-hidden transition-all hover:scale-[1.02] cursor-zoom-in group relative",
                    darkroomMode
                      ? "bg-white/5 border border-white/5"
                      : "bg-gray-100 border border-gray-200"
                  )}
                  onClick={() => openGallery(index)}
                >
                  <img
                    src={img.url}
                    alt={`Mood ${index + 1}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                </div>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-sm overflow-hidden flex items-center justify-center",
                    darkroomMode
                      ? "bg-white/5 border border-white/5"
                      : "bg-gray-100 border border-gray-200"
                  )}
                >
                  <div
                    className={cn(
                      "text-[8px] uppercase tracking-widest",
                      darkroomMode ? "text-white/10" : "text-gray-300"
                    )}
                  >
                    Mood Asset {i + 1}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full-Screen Gallery Modal */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent
          className={cn(
            "max-w-[98vw] max-h-[98vh] p-0 overflow-hidden",
            darkroomMode ? "bg-black border-white/10" : "bg-white"
          )}
        >
          <div className="relative w-full h-[95vh]">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70"
              onClick={() => setGalleryOpen(false)}
            >
              <X className="h-4 w-4 text-white" />
            </Button>

            {/* Navigation Arrows */}
            {moodboard.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 h-12 w-12"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 h-12 w-12"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/80 rounded-full px-4 py-2">
              <span className="text-white text-xs font-mono">
                {currentImageIndex + 1} / {moodboard.length}
              </span>
            </div>

            {/* Main Image */}
            <div className="w-full h-full flex items-center justify-center p-8">
              {moodboard[currentImageIndex] && (
                <img
                  src={moodboard[currentImageIndex].url}
                  alt={`Mood Board ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Thumbnail Strip */}
            {moodboard.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-black/80 rounded-full px-4 py-2">
                {moodboard.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-12 h-12 rounded-md overflow-hidden border-2 transition-all",
                      index === currentImageIndex
                        ? "border-white scale-110"
                        : "border-white/30 opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
