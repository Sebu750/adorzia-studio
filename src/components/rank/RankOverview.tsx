import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RANK_ORDER, RankTier } from "@/lib/ranks";
import { RankTierCard } from "./RankTierCard";
import { Crown } from "lucide-react";

interface RankOverviewProps {
  currentRank: RankTier;
}

export function RankOverview({ currentRank }: RankOverviewProps) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Foundation Ranks */}
          <div className="md:col-span-2 mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Foundation Ranks (Limited)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RANK_ORDER.filter(r => r === 'f1' || r === 'f2').map((rank) => (
                <RankTierCard
                  key={rank}
                  rank={rank}
                  isCurrentRank={rank === currentRank}
                  isUnlocked={isUnlocked(rank)}
                />
              ))}
            </div>
          </div>

          {/* Standard Ranks */}
          <div className="md:col-span-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Standard Ranks
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {RANK_ORDER.filter(r => r !== 'f1' && r !== 'f2').map((rank) => (
                <RankTierCard
                  key={rank}
                  rank={rank}
                  isCurrentRank={rank === currentRank}
                  isUnlocked={isUnlocked(rank)}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
