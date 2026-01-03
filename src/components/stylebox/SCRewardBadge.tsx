import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SC_DIFFICULTY_RANGES, type SCDifficulty } from "@/lib/style-credits";

interface SCRewardBadgeProps {
  difficulty: SCDifficulty;
  className?: string;
  showRange?: boolean;
  compact?: boolean;
}

export function SCRewardBadge({ 
  difficulty, 
  className, 
  showRange = true,
  compact = false 
}: SCRewardBadgeProps) {
  const range = SC_DIFFICULTY_RANGES[difficulty];

  if (compact) {
    return (
      <div className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium",
        className
      )}>
        <Sparkles className="h-3 w-3" />
        <span className="tabular-nums">
          {showRange ? `${range.min}-${range.max}` : range.max} SC
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20",
      className
    )}>
      <Sparkles className="h-4 w-4 text-primary" />
      <span className="text-sm font-semibold text-primary tabular-nums">
        {showRange ? `${range.min}-${range.max}` : range.max} SC
      </span>
    </div>
  );
}
