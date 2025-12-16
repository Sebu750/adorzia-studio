import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, TrendingUp, Gift, Percent, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RANKS, RankTier, getNextStandardRank, getRankProgress, calculateEffectiveRevenueShare, STANDARD_RANKS } from "@/lib/ranks";
import { SCORE_WEIGHTS, formatScore, DesignerScores } from "@/lib/scoring";
import { motion } from "framer-motion";

interface RankProgressProps {
  currentRank: RankTier;
  foundationRank?: 'f1' | 'f2' | null;
  scores: DesignerScores;
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

const ScoreBar = ({ 
  label, 
  weight, 
  score, 
  contribution 
}: { 
  label: string; 
  weight: number; 
  score: number; 
  contribution: number;
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">
        {formatScore(score)} × {(weight * 100).toFixed(0)}% = {formatScore(contribution)}
      </span>
    </div>
    <Progress value={Math.min(100, score)} className="h-1.5" />
  </div>
);

export function RankProgress({
  currentRank,
  foundationRank,
  scores,
  badges,
}: RankProgressProps) {
  const rankDef = RANKS[currentRank];
  const nextRank = getNextStandardRank(currentRank);
  const style = rankStyles[currentRank];
  
  // Calculate effective revenue share
  const effectiveShare = calculateEffectiveRevenueShare(currentRank, foundationRank);
  
  // Calculate progress to next rank
  const progressPercent = nextRank 
    ? getRankProgress(currentRank, scores.weightedTotal, nextRank.minWeightedScore)
    : 100;

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
        {/* Rank Display */}
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative flex-shrink-0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className={cn(
              "h-14 w-14 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300",
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
            <p className="text-sm text-muted-foreground line-clamp-2">{rankDef.description}</p>
          </div>
        </div>

        {/* Revenue Share Highlight */}
        <div className={cn(
          "flex items-center justify-between p-3 rounded-xl border transition-all duration-300 hover:shadow-sm",
          style.bg,
          style.border
        )}>
          <div className="flex items-center gap-2">
            <Percent className={cn("h-4 w-4", style.text)} />
            <span className="text-sm font-medium">Revenue Share</span>
          </div>
          <div className="text-right">
            <span className={cn("text-2xl font-display font-bold tabular-nums", style.text)}>
              {effectiveShare}%
            </span>
            {foundationRank && !rankDef.isFoundation && (
              <p className="text-[10px] text-muted-foreground">
                {rankDef.revenueShare}% + {RANKS[foundationRank].bonusPercentage}% bonus
              </p>
            )}
          </div>
        </div>

        {/* Weighted Score Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Weighted Score</span>
            </div>
            <span className={cn("text-lg font-display font-bold tabular-nums", style.text)}>
              {formatScore(scores.weightedTotal)}
            </span>
          </div>
          
          <div className="space-y-2">
            <ScoreBar 
              label="Stylebox (Learning)" 
              weight={SCORE_WEIGHTS.stylebox} 
              score={scores.styleboxScore}
              contribution={scores.styleboxScore * SCORE_WEIGHTS.stylebox}
            />
            <ScoreBar 
              label="Portfolio (Creating)" 
              weight={SCORE_WEIGHTS.portfolio} 
              score={scores.portfolioScore}
              contribution={scores.portfolioScore * SCORE_WEIGHTS.portfolio}
            />
            <ScoreBar 
              label="Publications (Impact)" 
              weight={SCORE_WEIGHTS.publication} 
              score={scores.publicationScore}
              contribution={scores.publicationScore * SCORE_WEIGHTS.publication}
            />
            <ScoreBar 
              label="Selling (Market)" 
              weight={SCORE_WEIGHTS.selling} 
              score={scores.sellingScore}
              contribution={scores.sellingScore * SCORE_WEIGHTS.selling}
            />
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
              <span>{formatScore(scores.weightedTotal)} score</span>
              <span>{formatScore(nextRank.minWeightedScore)} needed</span>
            </div>
          </div>
        )}

        {/* Foundation Rank Lifetime Badge */}
        {foundationRank && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary border border-border">
            <Gift className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium">
              {RANKS[foundationRank].name} - Lifetime +{RANKS[foundationRank].bonusPercentage}% bonus locked in
            </span>
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-label">Recent Badges</h4>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all
              </button>
            </div>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Earned badges">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border/50 transition-all duration-200 hover:border-border hover:shadow-sm"
                  role="listitem"
                >
                  <span className="text-base">{badge.icon}</span>
                  <span className="text-xs font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
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
