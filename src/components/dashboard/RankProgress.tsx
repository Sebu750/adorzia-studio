import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, TrendingUp, Gift, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { RANKS, RankTier, getNextRank, getRankProgress } from "@/lib/ranks";
import { motion } from "framer-motion";

interface RankProgressProps {
  currentRank: RankTier;
  xp: number;
  xpToNextLevel: number;
  badges: { name: string; icon: string }[];
}

const rankStyles: Record<RankTier, { bg: string; border: string; text: string; glow?: string }> = {
  f1: {
    bg: "bg-gradient-to-br from-rank-f1/20 to-rank-f1/5",
    border: "border-rank-f1/40",
    text: "text-rank-f1",
    glow: "shadow-[0_0_20px_hsl(var(--rank-f1)/0.3)]",
  },
  f2: {
    bg: "bg-gradient-to-br from-rank-f2/20 to-rank-f2/5",
    border: "border-rank-f2/40",
    text: "text-rank-f2",
    glow: "shadow-[0_0_20px_hsl(var(--rank-f2)/0.3)]",
  },
  novice: {
    bg: "bg-gradient-to-br from-rank-novice/20 to-rank-novice/5",
    border: "border-rank-novice/30",
    text: "text-rank-novice",
  },
  apprentice: {
    bg: "bg-gradient-to-br from-rank-apprentice/20 to-rank-apprentice/5",
    border: "border-rank-apprentice/30",
    text: "text-rank-apprentice",
  },
  designer: {
    bg: "bg-gradient-to-br from-rank-designer/20 to-rank-designer/5",
    border: "border-rank-designer/30",
    text: "text-rank-designer",
  },
  senior: {
    bg: "bg-gradient-to-br from-rank-senior/20 to-rank-senior/5",
    border: "border-rank-senior/30",
    text: "text-rank-senior",
  },
  lead: {
    bg: "bg-gradient-to-br from-rank-lead/20 to-rank-lead/5",
    border: "border-rank-lead/30",
    text: "text-rank-lead",
  },
  elite: {
    bg: "bg-gradient-to-br from-rank-elite/20 to-rank-elite/5",
    border: "border-rank-elite/40",
    text: "text-rank-elite",
    glow: "shadow-[0_0_20px_hsl(var(--rank-elite)/0.3)]",
  },
};

const RankIcon = ({ rank }: { rank: RankTier }) => {
  const isFoundation = RANKS[rank].isFoundation;
  const isElite = rank === 'elite';
  
  if (isFoundation) {
    return <Sparkles className="h-7 w-7" />;
  }
  if (isElite) {
    return <Crown className="h-7 w-7" />;
  }
  return <Star className="h-7 w-7" />;
};

export function RankProgress({
  currentRank,
  xp,
  xpToNextLevel,
  badges,
}: RankProgressProps) {
  const rankDef = RANKS[currentRank];
  const nextRank = getNextRank(currentRank);
  const progressPercent = getRankProgress(currentRank, xp, xpToNextLevel);
  const style = rankStyles[currentRank];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Crown className={cn("h-5 w-5", style.text)} />
          Designer Rank
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rank Display */}
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={cn(
              "h-16 w-16 rounded-2xl flex items-center justify-center border-2",
              style.bg,
              style.border,
              style.glow
            )}>
              <span className={style.text}>
                <RankIcon rank={currentRank} />
              </span>
            </div>
            {rankDef.isFoundation && (
              <div className="absolute -top-1 -right-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rank-f1 text-[10px] font-bold text-white">
                  ★
                </span>
              </div>
            )}
          </motion.div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("font-display text-xl font-semibold", style.text)}>
                {rankDef.name}
              </span>
              {rankDef.isFoundation && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-rank-f1/40 text-rank-f1">
                  FOUNDER
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{rankDef.description}</p>
          </div>
        </div>

        {/* Revenue Share Highlight */}
        <div className={cn(
          "flex items-center justify-between p-3 rounded-xl border",
          style.bg,
          style.border
        )}>
          <div className="flex items-center gap-2">
            <Percent className={cn("h-4 w-4", style.text)} />
            <span className="text-sm font-medium">Revenue Share</span>
          </div>
          <span className={cn("text-2xl font-display font-bold", style.text)}>
            {rankDef.revenueShare}%
          </span>
        </div>

        {/* Progress to Next Rank */}
        {nextRank && !rankDef.isFoundation && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Progress to {nextRank.name}</span>
              </div>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{xp.toLocaleString()} XP</span>
              <span>{xpToNextLevel.toLocaleString()} XP needed</span>
            </div>
          </div>
        )}

        {/* Foundation Rank Lifetime Badge */}
        {rankDef.isFoundation && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rank-f1/10 border border-rank-f1/20">
            <Gift className="h-4 w-4 text-rank-f1" />
            <span className="text-sm font-medium text-rank-f1">Lifetime benefits locked in</span>
          </div>
        )}

        {/* Badges */}
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

        {/* Next Unlock */}
        {nextRank && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Star className="h-4 w-4 text-accent" />
                <span>Next unlock:</span>
              </div>
              <span className="font-medium">{nextRank.perks[0]}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
