import { Lock, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NextUnlockHintProps {
  currentSC: number;
  nextStyleboxTitle: string;
  nextStyleboxId: string;
  requiredSC: number;
  className?: string;
}

export function NextUnlockHint({
  currentSC,
  nextStyleboxTitle,
  nextStyleboxId,
  requiredSC,
  className,
}: NextUnlockHintProps) {
  const navigate = useNavigate();
  const scNeeded = requiredSC - currentSC;
  const progress = Math.min(100, (currentSC / requiredSC) * 100);
  const isUnlocked = currentSC >= requiredSC;

  if (isUnlocked) {
    return (
      <div className={cn(
        "flex items-center justify-between p-4 rounded-lg border border-success/20 bg-success/5",
        className
      )}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium">New Challenge Unlocked!</p>
            <p className="text-xs text-muted-foreground">{nextStyleboxTitle}</p>
          </div>
        </div>
        <Button 
          size="sm" 
          className="gap-1.5"
          onClick={() => navigate(`/styleboxes/${nextStyleboxId}`)}
        >
          Start Now
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 rounded-lg border border-border bg-muted/30",
      className
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">Next: {nextStyleboxTitle}</p>
          <p className="text-xs text-muted-foreground">
            Earn <span className="font-semibold text-primary">{scNeeded} more SC</span> to unlock
          </p>
        </div>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-primary/50 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <span className="tabular-nums">{currentSC} SC</span>
        <span className="tabular-nums">{requiredSC} SC required</span>
      </div>
    </div>
  );
}
