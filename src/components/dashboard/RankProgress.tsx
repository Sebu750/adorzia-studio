import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankProgressProps {
  currentRank: string;
  currentLevel: number;
  xp: number;
  xpToNextLevel: number;
  badges: { name: string; icon: string }[];
}

const rankColors = {
  bronze: "text-rank-bronze",
  silver: "text-rank-silver",
  gold: "text-rank-gold",
  platinum: "text-rank-platinum",
  diamond: "text-rank-diamond",
};

export function RankProgress({
  currentRank,
  currentLevel,
  xp,
  xpToNextLevel,
  badges,
}: RankProgressProps) {
  const progressPercent = (xp / xpToNextLevel) * 100;
  const rankColor = rankColors[currentRank.toLowerCase() as keyof typeof rankColors] || "text-accent";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Crown className={cn("h-5 w-5", rankColor)} />
          Designer Rank
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={cn(
              "h-16 w-16 rounded-2xl flex items-center justify-center",
              "bg-gradient-to-br from-rank-gold/20 to-rank-gold/5 border-2 border-rank-gold/30"
            )}>
              <Crown className="h-8 w-8 text-rank-gold" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border-2 border-rank-gold flex items-center justify-center">
              <span className="text-xs font-bold text-rank-gold">{currentLevel}</span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn("font-display text-xl font-semibold", rankColor)}>
                {currentRank}
              </span>
              <span className="text-sm text-muted-foreground">Designer</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{xp.toLocaleString()} XP</span>
                <span className="text-muted-foreground">{xpToNextLevel.toLocaleString()} XP</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">Recent Badges</h4>
            <button className="text-xs text-accent hover:underline">View all</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border"
              >
                <span className="text-base">{badge.icon}</span>
                <span className="text-xs font-medium">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Star className="h-4 w-4 text-accent" />
              <span>Next unlock:</span>
            </div>
            <span className="font-medium">Priority Marketplace Access</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
