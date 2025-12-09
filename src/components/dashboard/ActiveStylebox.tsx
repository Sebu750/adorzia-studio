import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ArrowRight } from "lucide-react";

interface ActiveStyleboxProps {
  title: string;
  category: string;
  difficulty: "easy" | "medium" | "hard" | "insane";
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
    <Card hover className="overflow-hidden group">
      <div className="aspect-[16/9] relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={difficulty} className="text-xs">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-background/20 text-primary-foreground border-0">
              {category}
            </Badge>
          </div>
          <h3 className="font-display text-lg font-semibold text-primary-foreground">
            {title}
          </h3>
        </div>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Due {dueDate}</span>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5 group/btn">
            Continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
