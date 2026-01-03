import { Lock, Star, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UnlockTooltipProps {
  isLocked: boolean;
  requiredRank?: string;
  requiredLevel?: number;
  requiredSubscription?: string;
  children?: React.ReactNode;
  className?: string;
}

export function UnlockTooltip({
  isLocked,
  requiredRank,
  requiredLevel,
  requiredSubscription,
  children,
  className,
}: UnlockTooltipProps) {
  if (!isLocked) {
    return <>{children}</>;
  }

  const requirements: string[] = [];
  if (requiredRank) requirements.push(`Rank: ${requiredRank}`);
  if (requiredLevel) requirements.push(`Level ${requiredLevel}+ completed`);
  if (requiredSubscription) requirements.push(`${requiredSubscription} subscription`);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("relative cursor-not-allowed", className)}>
            {children}
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Locked</span>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium text-sm">Unlock Requirements</p>
            <ul className="space-y-1">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  {req.includes("Rank") && <Crown className="h-3 w-3" />}
                  {req.includes("Level") && <Star className="h-3 w-3" />}
                  {req.includes("subscription") && <Star className="h-3 w-3" />}
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
