import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Clock, Sparkles, Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StyleboxCardProps {
  title: string;
  description: string;
  category: string;
  difficulty: "free" | "easy" | "medium" | "hard" | "insane";
  isPaid: boolean;
  isLocked: boolean;
  duration: string;
  thumbnail: string;
  participants?: number;
  rating?: number;
  isNew?: boolean;
  isTeam?: boolean;
}

export function StyleboxCard({
  title,
  description,
  category,
  difficulty,
  isPaid,
  isLocked,
  duration,
  thumbnail,
  participants,
  rating,
  isNew,
  isTeam,
}: StyleboxCardProps) {
  return (
    <Card hover className={cn(
      "overflow-hidden group relative",
      isLocked && "opacity-75"
    )}>
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            !isLocked && "group-hover:scale-105"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />
        
        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-wrap gap-1.5">
            {isNew && (
              <Badge variant="accent" className="gap-1">
                <Sparkles className="h-3 w-3" />
                New
              </Badge>
            )}
            {isTeam && (
              <Badge variant="secondary" className="gap-1 bg-background/90 border-0">
                <Users className="h-3 w-3" />
                Team
              </Badge>
            )}
          </div>
          <Badge variant={isPaid ? "paid" : "free"}>
            {isPaid ? "Paid" : "Free"}
          </Badge>
        </div>

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-primary-foreground">
              <div className="h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Lock className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Reach Gold to unlock</span>
            </div>
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={difficulty}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
            <Badge variant="outline" className="bg-background/20 text-primary-foreground border-primary-foreground/30">
              {category}
            </Badge>
          </div>
          <h3 className="font-display text-lg font-semibold text-primary-foreground line-clamp-1">
            {title}
          </h3>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            {participants && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{participants.toLocaleString()}</span>
              </div>
            )}
          </div>
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <Button 
          variant={isLocked ? "secondary" : "default"} 
          className="w-full"
          disabled={isLocked}
        >
          {isLocked ? "Locked" : isPaid ? "Purchase & Start" : "Start Challenge"}
        </Button>
      </CardContent>
    </Card>
  );
}
