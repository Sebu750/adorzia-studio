import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, TrendingUp, Gift, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { RANKS, RankTier, getNextStandardRank, getRankProgress, calculateEffectiveCommission, formatSC, safeGetRank, isValidRankTier } from "@/lib/ranks";
import { motion } from "framer-motion";

interface RankProgressProps {
  currentRank: RankTier;
  foundationRank?: 'f1' | 'f2' | null;
  styleCredits: number;
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
  apprentice: {
    bg: "bg-gradient-to-br from-rank-apprentice/20 to-rank-apprentice/5",
    border: "border-rank-apprentice/30",
    text: "text-rank-apprentice",
  },
  patternist: {
    bg: "bg-gradient-to-br from-muted/40 to-muted/10",
    border: "border-muted-foreground/30",
    text: "text-muted-foreground",
  },
  stylist: {
    bg: "bg-gradient-to-br from-muted/50 to-muted/20",
    border: "border-muted-foreground/40",
    text: "text-foreground",
  },
  couturier: {
    bg: "bg-gradient-to-br from-foreground/10 to-foreground/5",
    border: "border-foreground/30",
    text: "text-foreground",
  },
  visionary: {
    bg: "bg-gradient-to-br from-foreground/15 to-foreground/5",
    border: "border-foreground/40",
    text: "text-foreground",
  },
  creative_director: {
    bg: "bg-gradient-to-br from-foreground/20 to-foreground/10",
    border: "border-foreground/50",
    text: "text-foreground",
    glow: "shadow-[0_0_20px_hsl(var(--foreground)/0.2)]",
  },
};

const RankIcon = ({ rank }: { rank: RankTier }) => {
  const rankDef = safeGetRank(rank);
  const isTopTier = rank === 'creative_director' || rank === 'visionary';
  
  if (rankDef.isFoundation) return <Sparkles className="h-7 w-7" />;
  if (isTopTier) return <Crown className="h-7 w-7" />;
  return <Star className="h-7 w-7" />;
};

export function RankProgress({
  currentRank,
  foundationRank,
  styleCredits,
  badges,
}: RankProgressProps) {
  // Use safe accessor to prevent crashes on invalid rank keys
  const safeRank: RankTier = isValidRankTier(currentRank) ? currentRank : 'apprentice';
  const rankDef = safeGetRank(safeRank);
  const nextRank = getNextStandardRank(safeRank);
  const style = rankStyles[safeRank] || rankStyles.apprentice;
  
  const effectiveCommission = calculateEffectiveCommission(safeRank, foundationRank);
  const progressPercent = getRankProgress(safeRank, styleCredits);
  const scNeeded = nextRank ? Math.max(0, nextRank.minSC - styleCredits) : 0;

  return (
    <Card className="overflow-hidden" role="region" aria-labelledby="rank-title">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle id="rank-title" className="flex items-center gap-2.5 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <Crown className="h-4 w-4 text-foreground" />
          </div>
          Designer Rank
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* SC Display */}
        <div className="text-center">
          <motion.div 
            className={cn("text-4xl font-display font-bold tabular-nums", style.text)}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {formatSC(styleCredits)} SC
          </motion.div>
        </div>

        {/* Rank Display */}
        <div className="flex items-center gap-4">
          <motion.div className="relative flex-shrink-0">
            <div className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center border-2",
              style.bg, style.border, style.glow
            )}>
              <span className={style.text}><RankIcon rank={currentRank} /></span>
            </div>
            {foundationRank && (
              <div className="absolute -top-1 -right-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background shadow-md">
                  {foundationRank.toUpperCase()}
                </span>
              </div>
            )}
          </motion.div>
          
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("font-display text-xl font-semibold", style.text)}>{rankDef.name}</span>
              {foundationRank && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {RANKS[foundationRank].name}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{rankDef.description}</p>
          </div>
        </div>

        {/* Commission Highlight */}
        <div className={cn("flex items-center justify-between p-3 rounded-xl border", style.bg, style.border)}>
          <div className="flex items-center gap-2">
            <Percent className={cn("h-4 w-4", style.text)} />
            <span className="text-sm font-medium">Commission</span>
          </div>
          <div className="text-right">
            <span className={cn("text-2xl font-display font-bold tabular-nums", style.text)}>
              {effectiveCommission}%
            </span>
            {foundationRank && !rankDef.isFoundation && (
              <p className="text-[10px] text-muted-foreground">
                {rankDef.commission}% + {RANKS[foundationRank].bonusPercentage}% bonus
              </p>
            )}
          </div>
        </div>

        {/* Progress to Next Rank */}
        {nextRank && !rankDef.isFoundation && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Progress to {nextRank.name}</span>
              </div>
              <span className="font-semibold tabular-nums">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" animated />
            <div className="flex items-center justify-between text-xs text-muted-foreground tabular-nums">
              <span>{formatSC(styleCredits)} SC</span>
              <span>{formatSC(scNeeded)} SC needed</span>
            </div>
          </div>
        )}

        {/* Foundation Badge */}
        {foundationRank && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary border border-border">
            <Gift className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium">
              {RANKS[foundationRank].name} - Lifetime +{RANKS[foundationRank].bonusPercentage}% bonus
            </span>
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-label">Recent Badges</h4>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border/50">
                  <span className="text-base">{badge.icon}</span>
                  <span className="text-xs font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
