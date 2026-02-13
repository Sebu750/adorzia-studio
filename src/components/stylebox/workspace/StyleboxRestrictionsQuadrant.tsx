import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Restriction {
  id: string;
  type: string;
  label: string;
  details?: string;
}

interface StyleboxRestrictionsQuadrantProps {
  data: {
    points?: Restriction[];
    tolerances?: {
      max_weight?: number;
      max_cost?: number;
    };
  };
  darkroomMode: boolean;
}

export function StyleboxRestrictionsQuadrant({
  data,
  darkroomMode,
}: StyleboxRestrictionsQuadrantProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const restrictions = data?.points || [];
  const tolerances = data?.tolerances || {};

  return (
    <div
      className={cn(
        "border-r p-8 flex flex-col gap-6 relative",
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
        Q3: Restrictions
      </div>

      <div className="flex-1 flex flex-col gap-8 max-w-xl mx-auto w-full mt-8">
        <div
          className={cn(
            "text-[10px] uppercase font-bold tracking-widest",
            darkroomMode ? "text-white/50" : "text-gray-500"
          )}
        >
          Technical Constraints
        </div>

        {/* Restrictions List */}
        <div className="space-y-6">
          {restrictions.length > 0 ? (
            restrictions.map((restriction) => (
              <div
                key={restriction.id}
                className={cn(
                  "border-l pl-6 space-y-2",
                  darkroomMode ? "border-white/20" : "border-gray-300"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase",
                          darkroomMode ? "text-white/30" : "text-gray-400"
                        )}
                      >
                        {restriction.type}
                      </span>
                      <h4
                        className={cn(
                          "text-sm font-semibold tracking-wide",
                          darkroomMode ? "text-white/90" : "text-gray-900"
                        )}
                      >
                        {restriction.label}
                      </h4>
                    </div>

                    {restriction.details && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "mt-2 h-6 px-2 text-[10px]",
                            darkroomMode
                              ? "hover:bg-white/10"
                              : "hover:bg-gray-100"
                          )}
                          onClick={() => toggleExpand(restriction.id)}
                        >
                          {expandedItems.has(restriction.id) ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              Show Details
                            </>
                          )}
                        </Button>

                        {expandedItems.has(restriction.id) && (
                          <p
                            className={cn(
                              "text-xs font-light leading-relaxed mt-2",
                              darkroomMode ? "text-white/40" : "text-gray-600"
                            )}
                          >
                            {restriction.details}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className={cn(
                "text-center py-12 text-xs italic",
                darkroomMode ? "text-white/20" : "text-gray-400"
              )}
            >
              No technical restrictions defined.
            </div>
          )}
        </div>

        {/* Numerical Tolerances */}
        {(tolerances.max_weight || tolerances.max_cost) && (
          <div
            className={cn(
              "mt-auto grid grid-cols-2 gap-4 p-4 rounded-lg",
              darkroomMode
                ? "bg-white/5 border border-white/10"
                : "bg-gray-100 border border-gray-200"
            )}
          >
            {tolerances.max_weight && (
              <div>
                <div
                  className={cn(
                    "text-[8px] uppercase font-bold mb-1",
                    darkroomMode ? "text-white/30" : "text-gray-500"
                  )}
                >
                  Max Weight
                </div>
                <div
                  className={cn(
                    "text-lg font-mono",
                    darkroomMode ? "text-white/90" : "text-gray-900"
                  )}
                >
                  {tolerances.max_weight}{" "}
                  <span
                    className={cn(
                      "text-[10px]",
                      darkroomMode ? "text-white/40" : "text-gray-500"
                    )}
                  >
                    KG
                  </span>
                </div>
              </div>
            )}
            {tolerances.max_cost && (
              <div>
                <div
                  className={cn(
                    "text-[8px] uppercase font-bold mb-1",
                    darkroomMode ? "text-white/30" : "text-gray-500"
                  )}
                >
                  Max Cost
                </div>
                <div
                  className={cn(
                    "text-lg font-mono",
                    darkroomMode ? "text-white/90" : "text-gray-900"
                  )}
                >
                  ${tolerances.max_cost}{" "}
                  <span
                    className={cn(
                      "text-[10px]",
                      darkroomMode ? "text-white/40" : "text-gray-500"
                    )}
                  >
                    USD
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
