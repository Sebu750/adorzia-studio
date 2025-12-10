import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  MoreHorizontal,
  Eye,
  Award,
  RotateCcw,
  MessageSquare,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type Stylebox = Database["public"]["Tables"]["styleboxes"]["Row"];
type WalkthroughProgress = Database["public"]["Tables"]["walkthrough_progress"]["Row"];

interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface ProgressWithProfile extends WalkthroughProgress {
  profile?: Profile;
}

interface WalkthroughProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walkthrough: Stylebox;
}

export function WalkthroughProgressModal({ 
  open, 
  onOpenChange, 
  walkthrough 
}: WalkthroughProgressModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgress, setSelectedProgress] = useState<ProgressWithProfile | null>(null);
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [overrideXp, setOverrideXp] = useState<number>(0);
  const [reviewerNotes, setReviewerNotes] = useState("");

  const steps = Array.isArray(walkthrough.steps) ? walkthrough.steps : [];

  // Fetch all progress for this walkthrough with user profiles
  const { data: progressList, isLoading } = useQuery({
    queryKey: ["walkthrough-progress-detail", walkthrough.id],
    queryFn: async () => {
      const { data: progressData, error } = await supabase
        .from("walkthrough_progress")
        .select("*")
        .eq("stylebox_id", walkthrough.id)
        .order("started_at", { ascending: false });
      
      if (error) throw error;

      // Fetch profiles for each progress entry
      const designerIds = progressData.map(p => p.designer_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, user_id, name, email, avatar_url")
        .in("user_id", designerIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return progressData.map(p => ({
        ...p,
        profile: profileMap.get(p.designer_id),
      })) as ProgressWithProfile[];
    },
    enabled: open,
  });

  // Override completion mutation
  const overrideCompletionMutation = useMutation({
    mutationFn: async ({ progressId, complete }: { progressId: string; complete: boolean }) => {
      const { error } = await supabase
        .from("walkthrough_progress")
        .update({
          completed_at: complete ? new Date().toISOString() : null,
          completion_override: true,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewerNotes || null,
        })
        .eq("id", progressId);
      
      if (error) throw error;
    },
    onSuccess: (_, { complete }) => {
      queryClient.invalidateQueries({ queryKey: ["walkthrough-progress-detail"] });
      queryClient.invalidateQueries({ queryKey: ["admin-walkthrough-stats"] });
      toast({
        title: complete ? "Marked as complete" : "Completion reset",
        description: complete 
          ? "User has been marked as completing this walkthrough."
          : "User completion status has been reset.",
      });
      setSelectedProgress(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update completion status.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Override XP mutation
  const overrideXpMutation = useMutation({
    mutationFn: async ({ progressId, xp }: { progressId: string; xp: number }) => {
      const { error } = await supabase
        .from("walkthrough_progress")
        .update({
          xp_awarded: xp,
          xp_override: true,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewerNotes || null,
        })
        .eq("id", progressId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walkthrough-progress-detail"] });
      toast({
        title: "XP updated",
        description: `XP has been set to ${overrideXp}.`,
      });
      setShowOverrideDialog(false);
      setSelectedProgress(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update XP.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Reset progress mutation
  const resetProgressMutation = useMutation({
    mutationFn: async (progressId: string) => {
      const { error } = await supabase
        .from("walkthrough_progress")
        .update({
          current_step: 0,
          completed_steps: [],
          completed_at: null,
          xp_awarded: null,
          xp_override: false,
          completion_override: false,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: "Progress reset by admin",
        })
        .eq("id", progressId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walkthrough-progress-detail"] });
      queryClient.invalidateQueries({ queryKey: ["admin-walkthrough-stats"] });
      toast({
        title: "Progress reset",
        description: "User progress has been reset to the beginning.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reset progress.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const filteredProgress = progressList?.filter(p => {
    const name = p.profile?.name?.toLowerCase() || "";
    const email = p.profile?.email?.toLowerCase() || "";
    return name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
  });

  const completedCount = progressList?.filter(p => p.completed_at).length || 0;
  const inProgressCount = (progressList?.length || 0) - completedCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-admin-wine" />
            Progress: {walkthrough.title}
          </DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{progressList?.length || 0}</span>
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-2xl font-bold">{inProgressCount}</span>
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-2xl font-bold">{completedCount}</span>
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Progress Table */}
        <ScrollArea className="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Designer</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>XP</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <div className="h-12 bg-muted/50 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredProgress?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Users className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-muted-foreground">No participants yet</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProgress?.map((progress) => {
                  const completedSteps = Array.isArray(progress.completed_steps) 
                    ? (progress.completed_steps as number[]).length 
                    : 0;
                  const progressPercent = steps.length > 0 
                    ? (completedSteps / steps.length) * 100 
                    : 0;

                  return (
                    <TableRow key={progress.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={progress.profile?.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">
                              {progress.profile?.name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {progress.profile?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {progress.profile?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-32 space-y-1">
                          <Progress value={progressPercent} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {completedSteps}/{steps.length} steps
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(progress.started_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {progress.completed_at ? (
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "gap-1 bg-success/10 text-success border-success/30",
                              progress.completion_override && "border-amber-500/30"
                            )}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                            {progress.completion_override && (
                              <span className="text-amber-500 text-[10px]">(override)</span>
                            )}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            In Progress
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {progress.xp_awarded !== null ? (
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-amber-500" />
                            <span className="font-medium">{progress.xp_awarded}</span>
                            {progress.xp_override && (
                              <span className="text-amber-500 text-xs">(manual)</span>
                            )}
                          </div>
                        ) : progress.completed_at ? (
                          <span className="text-sm text-muted-foreground">
                            +{walkthrough.xp_reward || 0}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {!progress.completed_at && (
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedProgress(progress);
                                  overrideCompletionMutation.mutate({ 
                                    progressId: progress.id, 
                                    complete: true 
                                  });
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                            )}
                            {progress.completed_at && (
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedProgress(progress);
                                  overrideCompletionMutation.mutate({ 
                                    progressId: progress.id, 
                                    complete: false 
                                  });
                                }}
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset Completion
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedProgress(progress);
                                setOverrideXp(progress.xp_awarded || walkthrough.xp_reward || 0);
                                setShowOverrideDialog(true);
                              }}
                            >
                              <Award className="h-4 w-4 mr-2" />
                              Override XP
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => resetProgressMutation.mutate(progress.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Reset All Progress
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* XP Override Dialog */}
        <AlertDialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Override XP Award</AlertDialogTitle>
              <AlertDialogDescription>
                Set a custom XP amount for this user. This will override the default {walkthrough.xp_reward || 0} XP.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>XP Amount</Label>
                <Input
                  type="number"
                  min={0}
                  max={500}
                  value={overrideXp}
                  onChange={(e) => setOverrideXp(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="Reason for XP adjustment..."
                  rows={2}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowOverrideDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedProgress) {
                    overrideXpMutation.mutate({ 
                      progressId: selectedProgress.id, 
                      xp: overrideXp 
                    });
                  }
                }}
              >
                Apply Override
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
