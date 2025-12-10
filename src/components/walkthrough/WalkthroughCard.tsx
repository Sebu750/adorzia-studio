import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  PlayCircle,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";

type Stylebox = Database['public']['Tables']['styleboxes']['Row'];
type WalkthroughProgress = Database['public']['Tables']['walkthrough_progress']['Row'];

interface WalkthroughCardProps {
  walkthrough: Stylebox;
  progress?: WalkthroughProgress;
  userRank?: string | null;
  userSubscription?: Database['public']['Enums']['subscription_tier'] | null;
}

const difficultyColors: Record<string, string> = {
  easy: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  hard: "bg-destructive/10 text-destructive border-destructive/20",
  insane: "bg-accent/10 text-accent border-accent/20",
};

const categoryIcons: Record<string, string> = {
  fashion: "👗",
  textile: "🧵",
  jewelry: "💎",
};

export function WalkthroughCard({ 
  walkthrough, 
  progress,
  userRank,
  userSubscription 
}: WalkthroughCardProps) {
  const navigate = useNavigate();
  
  // Parse steps from walkthrough
  const steps = Array.isArray(walkthrough.steps) ? walkthrough.steps : [];
  const totalSteps = steps.length || 1;
  const completedSteps = Array.isArray(progress?.completed_steps) 
    ? (progress.completed_steps as unknown[]).length 
    : 0;
  const progressPercent = (completedSteps / totalSteps) * 100;

  const isCompleted = !!progress?.completed_at;
  const isInProgress = !!progress && !progress.completed_at;
  const isLocked = false; // TODO: Implement rank/subscription checking logic

  const handleClick = () => {
    if (isLocked) return;
    navigate(`/walkthroughs/${walkthrough.id}`);
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        isLocked && "opacity-75",
        isCompleted && "border-success/30 bg-success/5"
      )}
    >
      {/* Status Badge */}
      {isCompleted && (
        <div className="absolute right-3 top-3 z-10">
          <Badge variant="outline" className="gap-1 border-success/30 bg-success/10 text-success">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        </div>
      )}
      {isInProgress && !isCompleted && (
        <div className="absolute right-3 top-3 z-10">
          <Badge variant="outline" className="gap-1 border-accent/30 bg-accent/10 text-accent">
            <PlayCircle className="h-3 w-3" />
            In Progress
          </Badge>
        </div>
      )}
      {isLocked && (
        <div className="absolute right-3 top-3 z-10">
          <Badge variant="outline" className="gap-1 border-muted-foreground/30 bg-muted text-muted-foreground">
            <Lock className="h-3 w-3" />
            Locked
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent text-xl">
            {categoryIcons[walkthrough.category] || "📚"}
          </div>
          <div className="flex-1 space-y-1.5">
            <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
              {walkthrough.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs capitalize">
                {walkthrough.category}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn("text-xs capitalize", difficultyColors[walkthrough.difficulty])}
              >
                {walkthrough.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {walkthrough.description || "Master essential design skills through guided practice."}
        </p>

        {/* Progress Bar (for in-progress walkthroughs) */}
        {isInProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {completedSteps}/{totalSteps} steps
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{totalSteps} steps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>+{walkthrough.xp_reward || 100} XP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>~{Math.ceil(totalSteps * 10)} min</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant={isCompleted ? "outline" : isInProgress ? "default" : "outline"}
          className="w-full gap-2"
          onClick={handleClick}
          disabled={isLocked}
        >
          {isLocked ? (
            <>
              <Lock className="h-4 w-4" />
              Unlock Required
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Review
            </>
          ) : isInProgress ? (
            <>
              <PlayCircle className="h-4 w-4" />
              Continue
            </>
          ) : (
            <>
              Start Walkthrough
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
