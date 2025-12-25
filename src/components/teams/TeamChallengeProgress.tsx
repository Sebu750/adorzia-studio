import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Upload,
  AlertTriangle,
  Trophy,
  FileText
} from "lucide-react";
import { 
  ROLE_ICONS, 
  ROLE_COLORS,
  type TeamRole,
  getRemainingTime,
  calculateTeamProgress 
} from "@/lib/team-challenges";

interface RoleSubmission {
  files: string[];
  submitted_at?: string;
  status: 'pending' | 'submitted' | 'approved' | 'revision_required';
}

interface TeamMember {
  id: string;
  name: string;
  avatar_url?: string;
}

interface TeamChallengeProgressProps {
  challengeTitle: string;
  deadline: string;
  roles: TeamRole[];
  roleAssignments: Record<string, string>; // role_id -> user_id
  roleSubmissions: Record<string, RoleSubmission>;
  teamMembers: TeamMember[];
  currentUserId: string;
  onUploadSubmission?: (roleId: string) => void;
  onViewSubmission?: (roleId: string) => void;
  totalScore?: number;
  status: 'in_progress' | 'submitted' | 'under_review' | 'completed' | 'failed';
}

export function TeamChallengeProgress({
  challengeTitle,
  deadline,
  roles,
  roleAssignments,
  roleSubmissions,
  teamMembers,
  currentUserId,
  onUploadSubmission,
  onViewSubmission,
  totalScore,
  status
}: TeamChallengeProgressProps) {
  const timeRemaining = getRemainingTime(deadline);
  const progress = calculateTeamProgress(roles, roleSubmissions);
  
  const getMemberById = (userId: string) => 
    teamMembers.find(m => m.id === userId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-emerald-500 bg-emerald-500/10';
      case 'submitted': return 'text-blue-500 bg-blue-500/10';
      case 'revision_required': return 'text-amber-500 bg-amber-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-4 w-4" />;
      case 'submitted': return <Clock className="h-4 w-4" />;
      case 'revision_required': return <AlertTriangle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{challengeTitle}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Team Challenge Progress</p>
          </div>
          <Badge 
            variant={status === 'completed' ? 'default' : 'secondary'}
            className={status === 'completed' ? 'bg-emerald-500' : ''}
          >
            {status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Timer and progress */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${timeRemaining.isExpired ? 'text-destructive' : 'text-amber-500'}`} />
              <span className={`text-sm font-medium ${timeRemaining.isExpired ? 'text-destructive' : ''}`}>
                {timeRemaining.display}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{progress}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {totalScore !== undefined && (
          <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-amber-500/10">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span className="font-bold text-amber-500">{totalScore} SC Awarded</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {roles.map((role) => {
          const assignedUserId = roleAssignments[role.role_id];
          const member = getMemberById(assignedUserId);
          const submission = roleSubmissions[role.role_id];
          const isCurrentUser = assignedUserId === currentUserId;
          const submissionStatus = submission?.status || 'pending';

          return (
            <div 
              key={role.role_id}
              className={`p-3 rounded-lg border ${isCurrentUser ? 'border-primary bg-primary/5' : 'bg-muted/30'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Role icon */}
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${ROLE_COLORS[role.role_id] || 'from-gray-500 to-gray-600'}`}>
                    <span className="text-white text-lg">{ROLE_ICONS[role.role_id]}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm">{role.role_name.split('(')[0].trim()}</h4>
                      {isCurrentUser && (
                        <Badge variant="outline" className="text-xs">Your Role</Badge>
                      )}
                    </div>
                    
                    {/* Assigned member */}
                    {member && (
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {member.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{member.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and actions */}
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getStatusColor(submissionStatus)}`}
                  >
                    {getStatusIcon(submissionStatus)}
                    <span className="ml-1 capitalize">{submissionStatus.replace('_', ' ')}</span>
                  </Badge>

                  {isCurrentUser && submissionStatus === 'pending' && status === 'in_progress' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onUploadSubmission?.(role.role_id)}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Upload
                    </Button>
                  )}

                  {submission?.files?.length > 0 && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onViewSubmission?.(role.role_id)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              </div>

              {/* Revision feedback if applicable */}
              {submissionStatus === 'revision_required' && isCurrentUser && (
                <div className="mt-2 p-2 rounded bg-amber-500/10 text-xs text-amber-600">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  Revisions requested. Please check feedback and resubmit.
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
