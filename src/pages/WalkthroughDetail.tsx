import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  FolderPlus,
  Clock,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type WalkthroughProgress = Database['public']['Tables']['walkthrough_progress']['Row'];

interface WalkthroughStep {
  title: string;
  description: string;
  instructions?: string[];
  tips?: string[];
  deliverable?: string;
}

export default function WalkthroughDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [submission, setSubmission] = useState("");

  // Fetch walkthrough details
  const { data: walkthrough, isLoading: walkthroughLoading } = useQuery({
    queryKey: ['walkthrough', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('styleboxes')
        .select('*')
        .eq('id', id)
        .eq('is_walkthrough', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch or create progress
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['walkthrough-progress', id, user?.id],
    queryFn: async () => {
      if (!user?.id || !id) return null;
      
      const { data, error } = await supabase
        .from('walkthrough_progress')
        .select('*')
        .eq('designer_id', user.id)
        .eq('stylebox_id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as WalkthroughProgress | null;
    },
    enabled: !!user?.id && !!id,
  });

  // Start walkthrough mutation
  const startMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !id) throw new Error('Missing user or walkthrough ID');
      
      const { data, error } = await supabase
        .from('walkthrough_progress')
        .insert({
          designer_id: user.id,
          stylebox_id: id,
          current_step: 0,
          completed_steps: [],
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walkthrough-progress'] });
      toast.success('Walkthrough started!');
    },
    onError: (error) => {
      toast.error('Failed to start walkthrough');
      console.error(error);
    },
  });

  // Complete step mutation
  const completeStepMutation = useMutation({
    mutationFn: async (stepIndex: number) => {
      if (!user?.id || !id || !progress) throw new Error('Missing data');
      
      const completedSteps = Array.isArray(progress.completed_steps) 
        ? [...(progress.completed_steps as number[])]
        : [];
      
      if (!completedSteps.includes(stepIndex)) {
        completedSteps.push(stepIndex);
      }

      const steps = Array.isArray(walkthrough?.steps) ? walkthrough.steps : [];
      const isLastStep = stepIndex === steps.length - 1;
      const allCompleted = completedSteps.length === steps.length;

      const { data, error } = await supabase
        .from('walkthrough_progress')
        .update({
          current_step: Math.min(stepIndex + 1, steps.length - 1),
          completed_steps: completedSteps,
          completed_at: allCompleted ? new Date().toISOString() : null,
        })
        .eq('id', progress.id)
        .select()
        .single();
      
      if (error) throw error;
      return { data, allCompleted };
    },
    onSuccess: ({ allCompleted }) => {
      queryClient.invalidateQueries({ queryKey: ['walkthrough-progress'] });
      if (allCompleted) {
        toast.success(`Walkthrough completed! +${walkthrough?.xp_reward || 100} XP`);
      } else {
        toast.success('Step completed!');
      }
    },
    onError: (error) => {
      toast.error('Failed to complete step');
      console.error(error);
    },
  });

  // Add to portfolio mutation
  const addToPortfolioMutation = useMutation({
    mutationFn: async () => {
      if (!progress) throw new Error('No progress found');
      
      const { error } = await supabase
        .from('walkthrough_progress')
        .update({ added_to_portfolio: true })
        .eq('id', progress.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walkthrough-progress'] });
      toast.success('Added to portfolio!');
    },
    onError: (error) => {
      toast.error('Failed to add to portfolio');
      console.error(error);
    },
  });

  if (walkthroughLoading || progressLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (!walkthrough) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 font-display text-xl font-semibold">Walkthrough Not Found</h2>
          <p className="mt-2 text-muted-foreground">This walkthrough doesn't exist or is no longer available.</p>
          <Button className="mt-6" onClick={() => navigate('/walkthroughs')}>
            Back to Walkthroughs
          </Button>
        </div>
      </AppLayout>
    );
  }

  const steps: WalkthroughStep[] = Array.isArray(walkthrough.steps) 
    ? (walkthrough.steps as unknown as WalkthroughStep[])
    : [];
  const currentStepIndex = progress?.current_step || 0;
  const completedSteps = Array.isArray(progress?.completed_steps) 
    ? (progress.completed_steps as number[])
    : [];
  const isCompleted = !!progress?.completed_at;
  const hasStarted = !!progress;
  const progressPercent = steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0;

  const currentStep = steps[currentStepIndex];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/walkthroughs')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Walkthroughs
        </Button>

        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {walkthrough.category}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {walkthrough.difficulty}
              </Badge>
              {isCompleted && (
                <Badge variant="outline" className="gap-1 border-success/30 bg-success/10 text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              {walkthrough.title}
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              {walkthrough.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{steps.length} steps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span>+{walkthrough.xp_reward || 100} XP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>~{Math.ceil(steps.length * 10)} min</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {hasStarted && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="font-medium">
                  {completedSteps.length}/{steps.length} steps completed
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </CardContent>
          </Card>
        )}

        {/* Start Button (if not started) */}
        {!hasStarted && (
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Target className="h-12 w-12 text-accent" />
              <h3 className="mt-4 font-display text-xl font-semibold">Ready to Begin?</h3>
              <p className="mt-2 max-w-md text-muted-foreground">
                This guided walkthrough will help you build essential design skills step by step.
              </p>
              <Button 
                className="mt-6 gap-2" 
                onClick={() => startMutation.mutate()}
                disabled={startMutation.isPending}
              >
                Start Walkthrough
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Steps Navigation */}
        {hasStarted && steps.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Step List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 p-2">
                  {steps.map((step, index) => {
                    const isStepCompleted = completedSteps.includes(index);
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (progress) {
                            supabase
                              .from('walkthrough_progress')
                              .update({ current_step: index })
                              .eq('id', progress.id)
                              .then(() => {
                                queryClient.invalidateQueries({ queryKey: ['walkthrough-progress'] });
                              });
                          }
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                          isCurrent 
                            ? "bg-accent/10 text-accent" 
                            : "hover:bg-muted",
                          isStepCompleted && "text-success"
                        )}
                      >
                        <div className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                          isStepCompleted 
                            ? "bg-success text-success-foreground"
                            : isCurrent
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {isStepCompleted ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className="truncate">{step.title || `Step ${index + 1}`}</span>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Current Step Content */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Step {currentStepIndex + 1} of {steps.length}</Badge>
                    {completedSteps.includes(currentStepIndex) && (
                      <Badge variant="outline" className="gap-1 border-success/30 text-success">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="font-display text-xl">
                    {currentStep?.title || `Step ${currentStepIndex + 1}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    {currentStep?.description || "Complete this step to continue."}
                  </p>

                  {currentStep?.instructions && currentStep.instructions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Instructions</h4>
                      <ol className="space-y-2 pl-4">
                        {currentStep.instructions.map((instruction, i) => (
                          <li key={i} className="list-decimal text-sm text-muted-foreground">
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {currentStep?.tips && currentStep.tips.length > 0 && (
                    <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                      <h4 className="mb-2 flex items-center gap-2 font-medium text-accent">
                        <Sparkles className="h-4 w-4" />
                        Pro Tips
                      </h4>
                      <ul className="space-y-1">
                        {currentStep.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentStep?.deliverable && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Deliverable</h4>
                      <p className="text-sm text-muted-foreground">{currentStep.deliverable}</p>
                      <Textarea
                        placeholder="Describe your work or paste a link to your submission..."
                        value={submission}
                        onChange={(e) => setSubmission(e.target.value)}
                        rows={4}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (progress && currentStepIndex > 0) {
                      supabase
                        .from('walkthrough_progress')
                        .update({ current_step: currentStepIndex - 1 })
                        .eq('id', progress.id)
                        .then(() => {
                          queryClient.invalidateQueries({ queryKey: ['walkthrough-progress'] });
                        });
                    }
                  }}
                  disabled={currentStepIndex === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                {!completedSteps.includes(currentStepIndex) ? (
                  <Button
                    onClick={() => completeStepMutation.mutate(currentStepIndex)}
                    disabled={completeStepMutation.isPending}
                    className="gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark as Complete
                  </Button>
                ) : currentStepIndex < steps.length - 1 ? (
                  <Button
                    onClick={() => {
                      if (progress) {
                        supabase
                          .from('walkthrough_progress')
                          .update({ current_step: currentStepIndex + 1 })
                          .eq('id', progress.id)
                          .then(() => {
                            queryClient.invalidateQueries({ queryKey: ['walkthrough-progress'] });
                          });
                      }
                    }}
                    className="gap-2"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Completion Card */}
        {isCompleted && (
          <Card className="border-success/30 bg-success/5">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
              <h3 className="mt-4 font-display text-xl font-semibold text-success">
                Walkthrough Complete!
              </h3>
              <p className="mt-2 max-w-md text-muted-foreground">
                Congratulations! You've earned +{walkthrough.xp_reward || 100} XP for completing this walkthrough.
              </p>
              {!progress?.added_to_portfolio && (
                <Button 
                  className="mt-6 gap-2" 
                  onClick={() => addToPortfolioMutation.mutate()}
                  disabled={addToPortfolioMutation.isPending}
                >
                  <FolderPlus className="h-4 w-4" />
                  Add to Portfolio
                </Button>
              )}
              {progress?.added_to_portfolio && (
                <Badge variant="outline" className="mt-6 gap-1 border-success/30 text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  Added to Portfolio
                </Badge>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
