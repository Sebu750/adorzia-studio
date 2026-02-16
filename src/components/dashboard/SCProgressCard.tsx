import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, TrendingUp, Gift, Percent, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { RANKS, RankTier, getNextStandardRank, getRankProgress, calculateEffectiveCommission, formatSC } from "@/lib/ranks";
import { motion } from "framer-motion";

interface SCProgressCardProps {
  styleCredits: number;
  totalStyleCredits: number;
  currentRank: RankTier;
  foundationRank?: 'f1' | 'f2' | null;
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
    bg: "bg-gradient-to-br from-rank-patternist/20 to-rank-patternist/5",
    border: "border-rank-patternist/30",
    text: "text-rank-patternist",
  },
  stylist: {
    bg: "bg-gradient-to-br from-rank-stylist/20 to-rank-stylist/5",
    border: "border-rank-stylist/30",
    text: "text-rank-stylist",
  },
  couturier: {
    bg: "bg-gradient-to-br from-rank-couturier/20 to-rank-couturier/5",
    border: "border-rank-couturier/30",
    text: "text-rank-couturier",
  },
  visionary: {
    bg: "bg-gradient-to-br from-rank-visionary/20 to-rank-visionary/5",
    border: "border-rank-visionary/30",
    text: "text-rank-visionary",
  },
  creative_director: {
    bg: "bg-gradient-to-br from-rank-creative-director/20 to-rank-creative-director/5",
    border: "border-rank-creative-director/40",
    text: "text-rank-creative-director",
    glow: "shadow-[0_0_20px_hsl(var(--rank-creative-director)/0.3)]",
  },
};

const RankIcon = ({ rank }: { rank: RankTier }) => {
  const isFoundation = RANKS[rank].isFoundation;
  const isTopTier = rank === 'creative_director' || rank === 'visionary';
  
  if (isFoundation) {
    return <Sparkles className="h-7 w-7" />;
  }
  if (isTopTier) {
    return <Crown className="h-7 w-7" />;
  }
  return <Star className="h-7 w-7" />;
};

export function SCProgressCard({
  styleCredits,
  totalStyleCredits,
  currentRank,
  foundationRank,
}: SCProgressCardProps) {
  const rankDef = RANKS[currentRank];
  const nextRank = getNextStandardRank(currentRank);
  const style = rankStyles[currentRank] || rankStyles.apprentice;
  
  // Calculate effective commission
  const effectiveCommission = calculateEffectiveCommission(currentRank, foundationRank);
  
  // Calculate progress to next rank
  const progressPercent = getRankProgress(currentRank, styleCredits);
  const scNeeded = nextRank ? Math.max(0, nextRank.minSC - styleCredits) : 0;

  return (
    <Card className="overflow-hidden" role="region" aria-labelledby="sc-title">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle id="sc-title" className="flex items-center gap-2.5 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <Zap className="h-4 w-4 text-foreground" />
          </div>
<<<<<<< HEAD
          SC
=======
          Style Credits
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* SC Display */}
        <div className="text-center space-y-2">
          <motion.div 
            className={cn("text-5xl font-display font-bold tabular-nums", style.text)}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {formatSC(styleCredits)}
          </motion.div>
          <p className="text-sm text-muted-foreground">
            {formatSC(totalStyleCredits)} lifetime SC earned
          </p>
        </div>

        {/* Rank Display */}
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative flex-shrink-0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300",
              style.bg,
              style.border,
              style.glow
            )}>
              <span className={style.text}>
                <RankIcon rank={currentRank} />
              </span>
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
              <span className={cn("font-display text-xl font-semibold", style.text)}>
                {rankDef.name}
              </span>
              {foundationRank && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-foreground/30 text-foreground/70">
                  {RANKS[foundationRank].name}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">{rankDef.description}</p>
          </div>
        </div>

        {/* Commission Highlight */}
        <div className={cn(
          "flex items-center justify-between p-3 rounded-xl border transition-all duration-300 hover:shadow-sm",
          style.bg,
          style.border
        )}>
          <div className="flex items-center gap-2">
            <Percent className={cn("h-4 w-4", style.text)} />
            <span className="text-sm font-medium">Commission Rate</span>
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

        {/* Foundation Rank Badge */}
        {foundationRank && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary border border-border">
            <Gift className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium">
              {RANKS[foundationRank].name} - Lifetime +{RANKS[foundationRank].bonusPercentage}% bonus
            </span>
          </div>
        )}

        {/* Next Unlock */}
        {nextRank && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>Next unlock:</span>
              </div>
              <span className="font-medium text-foreground">{nextRank.perks[0]}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
