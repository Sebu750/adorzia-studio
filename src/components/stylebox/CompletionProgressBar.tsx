import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompletionProgressBarProps {
  completedItems: number;
  totalItems: number;
  scReward?: { min: number; max: number };
  className?: string;
}

export function CompletionProgressBar({
  completedItems,
  totalItems,
  scReward,
  className,
}: CompletionProgressBarProps) {
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const isComplete = completedItems >= totalItems;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Deliverables: {completedItems}/{totalItems} completed
        </span>
        {scReward && (
          <div className="flex items-center gap-1.5 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold tabular-nums">
              {scReward.min}-{scReward.max} SC
            </span>
          </div>
        )}
      </div>
      <Progress 
        value={progress} 
        className={cn("h-2", isComplete && "bg-success/20")}
        animated={!isComplete}
      />
      {isComplete && (
        <p className="text-xs text-success font-medium">
          ✓ All deliverables completed! Ready to submit.
        </p>
      )}
    </div>
  );
}
