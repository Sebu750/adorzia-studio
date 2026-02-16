import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Trophy,
  Award,
  FileText
} from "lucide-react";
import { ROLE_ICONS, type TeamRole } from "@/lib/team-challenges";

interface EvaluationCriteria {
  name: string;
  weight: number;
  description: string;
}

interface RoleSubmission {
  files: string[];
  submitted_at?: string;
  status: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar_url?: string;
}

interface TeamSubmissionReviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId: string;
  challengeTitle: string;
  roles: TeamRole[];
  roleAssignments: Record<string, string>;
  roleSubmissions: Record<string, RoleSubmission>;
  teamMembers: TeamMember[];
  evaluationCriteria: EvaluationCriteria[];
  onApprove: (feedback: ReviewFeedback) => void;
  onRequestRevision: (feedback: ReviewFeedback) => void;
  onReject: (feedback: ReviewFeedback) => void;
  isLoading?: boolean;
}

interface RoleScore {
  score: number;
  notes: string;
  awardBadge: boolean;
}

interface ReviewFeedback {
  roleScores: Record<string, RoleScore>;
  criteriaScores: Record<string, number>;
  overallNotes: string;
  totalScore: number;
  awardTeamBadge: boolean;
}

export function TeamSubmissionReview({
  open,
  onOpenChange,
  submissionId,
  challengeTitle,
  roles,
  roleAssignments,
  roleSubmissions,
  teamMembers,
  evaluationCriteria,
  onApprove,
  onRequestRevision,
  onReject,
  isLoading
}: TeamSubmissionReviewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [roleScores, setRoleScores] = useState<Record<string, RoleScore>>(() => {
    const initial: Record<string, RoleScore> = {};
    roles.forEach(role => {
      initial[role.role_id] = { score: 50, notes: '', awardBadge: false };
    });
    return initial;
  });
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    evaluationCriteria.forEach(c => {
      initial[c.name] = 50;
    });
    return initial;
  });
  const [overallNotes, setOverallNotes] = useState('');
  const [awardTeamBadge, setAwardTeamBadge] = useState(false);

  const getMemberById = (userId: string) => 
    teamMembers.find(m => m.id === userId);

  // Calculate total weighted score
  const calculateTotalScore = () => {
    const criteriaTotal = evaluationCriteria.reduce((sum, c) => {
      return sum + (criteriaScores[c.name] * (c.weight / 100));
    }, 0);
    return Math.round(criteriaTotal);
  };

  const buildFeedback = (): ReviewFeedback => ({
    roleScores,
    criteriaScores,
    overallNotes,
    totalScore: calculateTotalScore(),
    awardTeamBadge
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Review Team Submission
          </DialogTitle>
          <DialogDescription>
            {challengeTitle}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roles">Role Scores</TabsTrigger>
            <TabsTrigger value="criteria">Criteria</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[50vh] mt-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Team Submissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {roles.map(role => {
                    const member = getMemberById(roleAssignments[role.role_id]);
                    const submission = roleSubmissions[role.role_id];
                    
                    return (
                      <div key={role.role_id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{ROLE_ICONS[role.role_id]}</span>
                          <div>
                            <p className="font-medium text-sm">{role.role_name.split('(')[0].trim()}</p>
                            {member && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={member.avatar_url} />
                                  <AvatarFallback className="text-[10px]">{member.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{member.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {submission?.files?.length > 0 && (
                            <Badge variant="secondary">{submission.files.length} files</Badge>
                          )}
                          <Badge variant={submission?.status === 'submitted' ? 'default' : 'outline'}>
                            {submission?.status || 'pending'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label>Overall Feedback</Label>
                <Textarea
                  value={overallNotes}
                  onChange={(e) => setOverallNotes(e.target.value)}
                  placeholder="Provide overall feedback for the team..."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="team-badge"
                  checked={awardTeamBadge}
                  onCheckedChange={(checked) => setAwardTeamBadge(checked as boolean)}
                />
                <Label htmlFor="team-badge" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Award "LEGACY ATELIER" Team Badge
                </Label>
              </div>
            </TabsContent>

            {/* Role Scores Tab */}
            <TabsContent value="roles" className="space-y-4">
              {roles.map(role => {
                const member = getMemberById(roleAssignments[role.role_id]);
                const score = roleScores[role.role_id];
                
                return (
                  <Card key={role.role_id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{ROLE_ICONS[role.role_id]}</span>
                          <CardTitle className="text-sm">{role.role_name}</CardTitle>
                        </div>
                        {member && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar_url} />
                              <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{member.name}</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Score</Label>
                          <span className="font-bold">{score.score}/100</span>
                        </div>
                        <Slider
                          value={[score.score]}
                          onValueChange={([value]) => setRoleScores(prev => ({
                            ...prev,
                            [role.role_id]: { ...prev[role.role_id], score: value }
                          }))}
                          max={100}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                          value={score.notes}
                          onChange={(e) => setRoleScores(prev => ({
                            ...prev,
                            [role.role_id]: { ...prev[role.role_id], notes: e.target.value }
                          }))}
                          placeholder={`Feedback for ${role.role_name.split('(')[0].trim()}...`}
                          rows={2}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`badge-${role.role_id}`}
                          checked={score.awardBadge}
                          onCheckedChange={(checked) => setRoleScores(prev => ({
                            ...prev,
                            [role.role_id]: { ...prev[role.role_id], awardBadge: checked as boolean }
                          }))}
                        />
                        <Label htmlFor={`badge-${role.role_id}`} className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          Award "{role.badge.name}" Badge
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            {/* Criteria Tab */}
            <TabsContent value="criteria" className="space-y-4">
              {evaluationCriteria.map(criterion => (
                <Card key={criterion.name}>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{criterion.name}</p>
                        <p className="text-xs text-muted-foreground">{criterion.description}</p>
                      </div>
                      <Badge variant="outline">{criterion.weight}% weight</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score</span>
                        <span className="font-bold">{criteriaScores[criterion.name]}/100</span>
                      </div>
                      <Slider
                        value={[criteriaScores[criterion.name]]}
                        onValueChange={([value]) => setCriteriaScores(prev => ({
                          ...prev,
                          [criterion.name]: value
                        }))}
                        max={100}
                        step={1}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Weighted Total Score</span>
                    <span className="text-2xl font-bold text-primary">{calculateTotalScore()}/100</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button 
            variant="destructive" 
            onClick={() => onReject(buildFeedback())}
            disabled={isLoading}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button 
            variant="outline"
            onClick={() => onRequestRevision(buildFeedback())}
            disabled={isLoading}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Request Revision
          </Button>
          <Button 
            onClick={() => onApprove(buildFeedback())}
            disabled={isLoading}
<<<<<<< HEAD
            className="bg-success hover:bg-success/90"
=======
            className="bg-emerald-600 hover:bg-emerald-700"
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve & Award
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
