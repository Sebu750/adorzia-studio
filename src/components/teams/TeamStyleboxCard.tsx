import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Clock, 
  Trophy, 
  Crown, 
  Lock,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import { ROLE_COLORS, ROLE_ICONS, type TeamRole } from "@/lib/team-challenges";
import { RANKS, getRankByOrder } from "@/lib/ranks";

interface TeamStyleboxCardProps {
  title: string;
  description: string;
  difficulty: 'insane';
  teamSize: number;
  minimumRankOrder: number;
  timeLimit: number;
  xpReward: number;
  roles: TeamRole[];
  isTeamEligible: boolean;
  currentTeamSize?: number;
  onStartChallenge?: () => void;
  onViewDetails?: () => void;
}

export function TeamStyleboxCard({
  title,
  description,
  difficulty,
  teamSize,
  minimumRankOrder,
  timeLimit,
  xpReward,
  roles,
  isTeamEligible,
  currentTeamSize = 0,
  onStartChallenge,
  onViewDetails
}: TeamStyleboxCardProps) {
  const requiredRank = getRankByOrder(minimumRankOrder);
  const hasFullTeam = currentTeamSize >= teamSize;
  const canStart = isTeamEligible && hasFullTeam;

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header with crown badge */}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                🟣 INSANE - Team Challenge
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Trophy className="h-4 w-4" />
            <span className="font-bold">{xpReward} SC</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold mt-3 leading-tight">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Team requirements */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Team of {teamSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{timeLimit}h limit</span>
          </div>
        </div>

        {/* Minimum rank requirement */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          {isTeamEligible ? (
            <Sparkles className="h-4 w-4 text-emerald-500" />
          ) : (
            <Lock className="h-4 w-4 text-amber-500" />
          )}
          <span className="text-sm">
            Requires: <strong>{requiredRank?.name || 'Unknown'}</strong> rank (all members)
          </span>
        </div>

        {/* Role preview */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Team Roles
          </p>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((role) => (
              <div 
                key={role.role_id}
                className="flex items-center gap-2 p-2 rounded-md bg-muted/30 text-xs"
              >
                <span className="text-lg">{ROLE_ICONS[role.role_id] || '👤'}</span>
                <span className="truncate">{role.role_name.split('(')[0].trim()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team status */}
        {currentTeamSize > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Team Formation</span>
              <span>{currentTeamSize}/{teamSize} members</span>
            </div>
            <Progress value={(currentTeamSize / teamSize) * 100} className="h-2" />
          </div>
        )}

        {/* Eligibility warning */}
        {!isTeamEligible && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-500/90">
              Not all team members meet the {requiredRank?.name} rank requirement ({requiredRank?.minSC}+ SC)
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onViewDetails}
        >
          View Details
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          disabled={!canStart}
          onClick={onStartChallenge}
        >
          {canStart ? 'Start Challenge' : 'Not Eligible'}
        </Button>
      </CardFooter>
    </Card>
  );
}
