import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CountdownTimer } from "./CountdownTimer";
import { LevelBadge } from "./LevelBadge";
import { SCRewardBadge } from "./SCRewardBadge";
import { StatusBadge, type StyleboxStatus } from "./StatusBadge";
import { UnlockTooltip } from "./UnlockTooltip";
import { ProgressRing } from "@/components/ui/progress-ring";
import type { SCDifficulty } from "@/lib/style-credits";

interface StyleboxDashboardCardProps {
  id: string;
  title: string;
  category: string;
  difficulty: SCDifficulty;
  season?: string;
  levelNumber: number;
  xpReward: number;
  deadline?: Date | string;
  thumbnail?: string;
  studioName?: string;
  progress?: number;
  status?: StyleboxStatus;
  isLocked?: boolean;
  requiredRank?: string;
}

export function StyleboxDashboardCard({
  id,
  title,
  category,
  difficulty,
  season,
  levelNumber,
  xpReward,
  deadline,
  thumbnail,
  studioName,
  progress = 0,
  status = "not_started",
  isLocked = false,
  requiredRank,
}: StyleboxDashboardCardProps) {
  const navigate = useNavigate();

  const formatCategory = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  const handleClick = () => {
    if (!isLocked) {
      navigate(`/styleboxes/${id}`);
    }
  };

  const cardContent = (
    <Card 
      hover={!isLocked}
      className="overflow-hidden group card-interactive cursor-pointer"
      onClick={handleClick}
      tabIndex={0}
      role="article"
      aria-label={`${title} - ${status === "active" ? `${progress}% complete` : status}`}
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <img
          src={thumbnail || "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
        
        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LevelBadge level={levelNumber} size="sm" />
            {season && (
              <Badge variant="secondary" className="text-xs bg-background/90 backdrop-blur-sm border-0">
                {season}
              </Badge>
            )}
          </div>
          {status !== "not_started" && (
            <StatusBadge status={status} showIcon={false} />
          )}
        </div>
        
        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={difficulty} className="text-xs shadow-sm">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-background/90 backdrop-blur-sm border-0">
              {formatCategory(category)}
            </Badge>
          </div>
          <h3 className="font-display text-lg font-semibold text-primary-foreground leading-tight line-clamp-2">
            {title}
          </h3>
          {studioName && (
            <p className="text-xs text-primary-foreground/70 mt-1">
              Curated by {studioName}
            </p>
          )}
        </div>
      </div>
      
      <CardContent className="p-4 space-y-4">
        {/* SC Reward and Progress */}
        <div className="flex items-center justify-between">
          <SCRewardBadge difficulty={difficulty} compact />
          {status === "active" && progress > 0 && (
            <ProgressRing value={progress} size={36} strokeWidth={3} />
          )}
        </div>
        
        {/* Deadline and CTA */}
        <div className="flex items-center justify-between pt-1">
          {deadline ? (
            <CountdownTimer deadline={deadline} compact showIcon />
          ) : (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>No deadline</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1.5 btn-press font-medium hover:bg-foreground hover:text-background"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {status === "not_started" ? "Enter" : "Continue"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLocked) {
    return (
      <UnlockTooltip 
        isLocked={isLocked} 
        requiredRank={requiredRank}
        requiredLevel={levelNumber > 1 ? levelNumber - 1 : undefined}
      >
        {cardContent}
      </UnlockTooltip>
    );
  }

  return cardContent;
}
