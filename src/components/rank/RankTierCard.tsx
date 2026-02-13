import { cn } from "@/lib/utils";
import { RANKS, RankTier, calculateEffectiveRevenueShare } from "@/lib/ranks";
import { Crown, Star, Sparkles, Check, Lock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface RankTierCardProps {
  rank: RankTier;
  isCurrentRank?: boolean;
  isUnlocked?: boolean;
  foundationRank?: 'f1' | 'f2' | null;
  showEffectiveShare?: boolean;
}

const rankStyles: Record<RankTier, { bg: string; border: string; text: string; iconBg: string }> = {
  f1: {
    bg: "bg-gradient-to-br from-rank-f1/15 to-rank-f1/5",
    border: "border-rank-f1/30",
    text: "text-rank-f1",
    iconBg: "bg-rank-f1/20",
  },
  f2: {
    bg: "bg-gradient-to-br from-rank-f2/15 to-rank-f2/5",
    border: "border-rank-f2/30",
    text: "text-rank-f2",
    iconBg: "bg-rank-f2/20",
  },
  apprentice: {
    bg: "bg-gradient-to-br from-rank-apprentice/15 to-rank-apprentice/5",
    border: "border-rank-apprentice/30",
    text: "text-rank-apprentice",
    iconBg: "bg-rank-apprentice/20",
  },
  patternist: {
    bg: "bg-gradient-to-br from-rank-patternist/15 to-rank-patternist/5",
    border: "border-rank-patternist/30",
    text: "text-rank-patternist",
    iconBg: "bg-rank-patternist/20",
  },
  stylist: {
    bg: "bg-gradient-to-br from-rank-stylist/15 to-rank-stylist/5",
    border: "border-rank-stylist/30",
    text: "text-rank-stylist",
    iconBg: "bg-rank-stylist/20",
  },
  couturier: {
    bg: "bg-gradient-to-br from-rank-couturier/15 to-rank-couturier/5",
    border: "border-rank-couturier/30",
    text: "text-rank-couturier",
    iconBg: "bg-rank-couturier/20",
  },
  visionary: {
    bg: "bg-gradient-to-br from-rank-visionary/15 to-rank-visionary/5",
    border: "border-rank-visionary/30",
    text: "text-rank-visionary",
    iconBg: "bg-rank-visionary/20",
  },
  creative_director: {
    bg: "bg-gradient-to-br from-rank-creative_director/15 to-rank-creative_director/5",
    border: "border-rank-creative_director/30",
    text: "text-rank-creative_director",
    iconBg: "bg-rank-creative_director/20",
  },
};

const RankIcon = ({ rank }: { rank: RankTier }) => {
  const isFoundation = RANKS[rank].isFoundation;
  const isTopRank = rank === 'creative_director';
  
  if (isFoundation) return <Sparkles className="h-5 w-5" />;
  if (isTopRank) return <Crown className="h-5 w-5" />;
  return <Star className="h-5 w-5" />;
};

export function RankTierCard({ 
  rank, 
  isCurrentRank = false, 
  isUnlocked = false,
  foundationRank,
  showEffectiveShare = false,
}: RankTierCardProps) {
  const rankDef = RANKS[rank];
  const style = rankStyles[rank];
  
  // Calculate effective share if foundation rank is provided and this is a standard rank
  const effectiveShare = !rankDef.isFoundation && foundationRank 
    ? calculateEffectiveRevenueShare(rank, foundationRank)
    : rankDef.revenueShare;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rankDef.order * 0.05 }}
      className={cn(
        "relative p-4 rounded-xl border transition-all duration-300",
        style.bg,
        style.border,
        isCurrentRank && "ring-2 ring-offset-2 ring-offset-background",
        isCurrentRank && rank === 'f1' && "ring-rank-f1",
        isCurrentRank && rank === 'f2' && "ring-rank-f2",
        isCurrentRank && rank === 'creative_director' && "ring-rank-creative_director",
        isCurrentRank && !['f1', 'f2', 'creative_director'].includes(rank) && "ring-accent",
        !isUnlocked && !isCurrentRank && "opacity-50"
      )}
    >
      {/* Status indicator */}
      <div className="absolute top-3 right-3">
        {isCurrentRank ? (
          <span className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full",
            style.iconBg
          )}>
            <Check className={cn("h-3.5 w-3.5", style.text)} />
          </span>
        ) : !isUnlocked ? (
          <Lock className="h-4 w-4 text-muted-foreground" />
        ) : null}
      </div>

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          style.iconBg
        )}>
          <span className={style.text}>
            <RankIcon rank={rank} />
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn("font-display font-semibold", style.text)}>
              {rankDef.name}
            </h3>
            {rankDef.isFoundation && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rank-f1/20 text-rank-f1">
                FOUNDER
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{rankDef.title}</p>
          
          {/* Min SC for standard ranks */}
          {!rankDef.isFoundation && rankDef.minSC > 0 && (
            <p className="text-[10px] text-muted-foreground mt-1">
              Min SC: {rankDef.minSC.toLocaleString()}
            </p>
          )}
          
          {/* Price for foundation ranks */}
          {rankDef.isFoundation && rankDef.priceUsd && (
            <div className="flex items-center gap-1 mt-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                ${rankDef.priceUsd} one-time
              </span>
            </div>
          )}
        </div>

        {/* Revenue Share */}
        <div className="text-right">
          {showEffectiveShare && !rankDef.isFoundation && foundationRank ? (
            <>
              <span className={cn("text-xl font-display font-bold", style.text)}>
                {effectiveShare}%
              </span>
              <p className="text-[10px] text-muted-foreground">
                {rankDef.revenueShare}% + {RANKS[foundationRank].bonusPercentage}%
              </p>
            </>
          ) : rankDef.isFoundation ? (
            <>
              <span className={cn("text-xl font-display font-bold", style.text)}>
                +{rankDef.bonusPercentage}%
              </span>
              <p className="text-[10px] text-muted-foreground">bonus</p>
            </>
          ) : (
            <>
              <span className={cn("text-xl font-display font-bold", style.text)}>
                {rankDef.revenueShare}%
              </span>
              <p className="text-[10px] text-muted-foreground">share</p>
            </>
          )}
        </div>
      </div>

      {/* Requirements */}
      {isCurrentRank && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Requirements:</p>
          <ul className="space-y-1">
            {rankDef.requirements.map((req, i) => (
              <li key={i} className="text-xs flex items-start gap-1.5">
                <Check className="h-3 w-3 mt-0.5 text-success shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
