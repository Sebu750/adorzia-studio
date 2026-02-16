import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Star, 
  Briefcase,
  Clock
} from "lucide-react";
import { JobApplication } from "@/hooks/useJobs";

interface JobActivityFeedProps {
  applications: JobApplication[];
}

type ActivityType = 'applied' | 'shortlisted' | 'rejected' | 'hired';

interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
  applicantName: string;
  applicantAvatar?: string;
  jobTitle: string;
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'applied':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'shortlisted':
      return <Star className="h-4 w-4 text-yellow-500" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'hired':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Briefcase className="h-4 w-4 text-gray-500" />;
  }
};

const getActivityBadge = (type: ActivityType) => {
  const configs = {
    applied: { label: 'Applied', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    shortlisted: { label: 'Shortlisted', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200' },
    hired: { label: 'Hired', className: 'bg-green-100 text-green-700 border-green-200' },
  };
  
  const config = configs[type];
  return (
    <Badge variant="outline" className={`text-xs ${config.className}`}>
      {config.label}
    </Badge>
  );
};

const getTimeAgo = (date: string) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function JobActivityFeed({ applications }: JobActivityFeedProps) {
  // Convert applications to activity items
  const activities: ActivityItem[] = applications.map(app => ({
    id: app.id,
    type: app.status as ActivityType,
    message: `${app.profiles?.name || 'Someone'} ${getActionText(app.status)} for ${app.jobs?.title || 'a position'}`,
    timestamp: app.applied_at,
    applicantName: app.profiles?.name || 'Unknown',
    applicantAvatar: app.profiles?.avatar_url || undefined,
    jobTitle: app.jobs?.title || 'Unknown Job',
  }));

  if (activities.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground text-sm">
            <p>No recent activity</p>
            <p className="text-xs mt-1">Application updates will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Recent Activity
          <Badge variant="secondary" className="ml-auto text-xs">
            {activities.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          <div className="space-y-0">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors ${
                  index !== activities.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.applicantAvatar} />
                      <AvatarFallback className="text-xs">
                        {activity.applicantName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate">
                      {activity.applicantName}
                    </span>
                    {getActivityBadge(activity.type)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    for {activity.jobTitle}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {getTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function getActionText(status: string): string {
  switch (status) {
    case 'applied':
      return 'applied';
    case 'shortlisted':
      return 'was shortlisted';
    case 'rejected':
      return 'was rejected';
    case 'hired':
      return 'was hired';
    default:
      return 'applied';
  }
}
