import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RANK_ORDER, RankTier, STANDARD_RANKS, FOUNDATION_RANKS } from "@/lib/ranks";
import { RankTierCard } from "./RankTierCard";
import { Crown } from "lucide-react";

interface RankOverviewProps {
  currentRank: RankTier;
  foundationRank?: 'f1' | 'f2' | null;
}

export function RankOverview({ currentRank, foundationRank }: RankOverviewProps) {
  // Determine which ranks are unlocked based on current rank
  const currentOrder = RANK_ORDER.indexOf(currentRank);
  
  const isUnlocked = (rank: RankTier) => {
    const order = RANK_ORDER.indexOf(rank);
    return order <= currentOrder;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-accent" />
          Rank Progression
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Foundation Ranks */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Foundation Ranks (Limited Time)
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              One-time payment for lifetime bonus on all revenue share
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FOUNDATION_RANKS.map((rank) => (
                <RankTierCard
                  key={rank}
                  rank={rank}
                  isCurrentRank={foundationRank === rank}
                  isUnlocked={foundationRank === rank}
                />
              ))}
            </div>
          </div>

          {/* Standard Ranks */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Standard Ranks (Merit-Based Progression)
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Progress through ranks by improving your weighted score
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {STANDARD_RANKS.map((rank) => (
                <RankTierCard
                  key={rank}
                  rank={rank}
                  isCurrentRank={!['f1', 'f2'].includes(currentRank) && rank === currentRank}
                  isUnlocked={isUnlocked(rank)}
                  foundationRank={foundationRank}
                  showEffectiveShare={!!foundationRank}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
