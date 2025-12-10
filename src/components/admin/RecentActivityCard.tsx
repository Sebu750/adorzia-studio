import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Box, 
  Upload, 
  AlertCircle,
  ArrowRight,
  Activity
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

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
    color: "text-success",
    bgColor: "bg-success/10",
    lineColor: "bg-success/30",
  },
  stylebox_completion: {
    icon: Box,
    color: "text-foreground",
    bgColor: "bg-foreground/10",
    lineColor: "bg-foreground/20",
  },
  publish_request: {
    icon: Upload,
    color: "text-warning",
    bgColor: "bg-warning/10",
    lineColor: "bg-warning/30",
  },
  revision_needed: {
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    lineColor: "bg-destructive/30",
  },
};

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground">Latest platform events</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
          
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;
              const isLast = index === activities.length - 1;
              
              return (
                <div 
                  key={activity.id}
                  className="group relative flex items-start gap-4 pl-10"
                >
                  {/* Timeline dot */}
                  <div className={cn(
                    "absolute left-0 h-8 w-8 rounded-full flex items-center justify-center z-10",
                    "ring-4 ring-background transition-transform group-hover:scale-110",
                    config.bgColor
                  )}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {activity.description}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {activity.actionUrl && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}

            {activities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}