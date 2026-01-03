import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ArrowRight } from "lucide-react";

interface ActiveStyleboxProps {
  title: string;
  category: string;
  difficulty: "free" | "easy" | "medium" | "hard" | "insane";
  progress: number;
  dueDate: string;
  thumbnail: string;
}

export function ActiveStylebox({
  title,
  category,
  difficulty,
  progress,
  dueDate,
  thumbnail,
}: ActiveStyleboxProps) {
  return (
    <Card 
      hover 
      className="overflow-hidden group card-interactive"
      tabIndex={0}
      role="article"
      aria-label={`${title} - ${progress}% complete`}
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={difficulty} className="text-xs shadow-sm">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-background/90 text-foreground border-0 shadow-sm">
              {category}
            </Badge>
          </div>
          <h3 className="font-display text-lg font-semibold text-primary-foreground leading-tight">
            {title}
          </h3>
        </div>
      </div>
      
      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Progress</span>
            <span className="font-semibold tabular-nums">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" animated />
        </div>
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Due {dueDate}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1.5 btn-press font-medium hover:bg-foreground hover:text-background"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}