import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Box, 
  Upload, 
  AlertCircle,
  ArrowRight,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: 'registration' | 'stylebox_completion' | 'publish_request' | 'revision_needed';
  title: string;
  description: string;
  timestamp: Date;
  actionUrl?: string;
}

interface RecentActivityCardProps {
  activities: Activity[];
}

const activityConfig = {
  registration: {
    icon: UserPlus,
    color: "text-success bg-success/10",
  },
  stylebox_completion: {
    icon: Box,
    color: "text-accent bg-accent/10",
  },
  publish_request: {
    icon: Upload,
    color: "text-warning bg-warning/10",
  },
  revision_needed: {
    icon: AlertCircle,
    color: "text-orange-500 bg-orange-500/10",
  },
};

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;
            
            return (
              <div 
                key={activity.id}
                className="flex items-start gap-3"
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>

                {activity.actionUrl && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}

          {activities.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No recent activity
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
