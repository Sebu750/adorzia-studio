import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Box, 
  Upload, 
  AlertCircle,
  ArrowRight,
  Activity,
  ChevronRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: 'registration' | 'stylebox_completion' | 'publish_request' | 'revision_needed';
  title: string;
  description: string;
  timestamp: Date;
  actionUrl?: string;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

const activityConfig = {
  registration: {
    icon: UserPlus,
    color: "text-success",
    bgColor: "bg-success/10",
    label: "New",
  },
  stylebox_completion: {
    icon: Box,
    color: "text-admin-foreground",
    bgColor: "bg-admin-muted",
    label: "Complete",
  },
  publish_request: {
    icon: Upload,
    color: "text-warning",
    bgColor: "bg-warning/10",
    label: "Request",
  },
  revision_needed: {
    icon: AlertCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    label: "Action",
  },
};

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  return (
    <Card className="overflow-hidden bg-admin-card border-admin-border" role="region" aria-labelledby="activity-title">
      <CardHeader className="pb-4 border-b border-admin-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-admin-muted flex items-center justify-center">
              <Activity className="h-5 w-5 text-admin-foreground/70" />
            </div>
            <div>
              <CardTitle id="activity-title" className="text-lg font-semibold text-admin-foreground">Recent Activity</CardTitle>
              <p className="text-caption text-xs text-admin-muted-foreground">Latest platform events</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-admin-muted-foreground hover:text-admin-foreground btn-press">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-admin-border" role="list">
        {activities.map((activity) => {
            // Safe access with fallback to registration
            const config = activityConfig[activity.type as keyof typeof activityConfig] ?? activityConfig.registration;
            const Icon = config.icon;
            
            return (
              <div 
                key={activity.id}
                className="flex items-start gap-3 sm:gap-4 p-4 hover:bg-admin-muted/50 transition-all cursor-pointer group"
                role="listitem"
                tabIndex={0}
              >
                <div className={cn(
                  "h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
                  config.bgColor
                )}>
                  <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", config.color)} />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-admin-foreground">{activity.title}</p>
                    <span className={cn(
                      "text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded",
                      config.bgColor,
                      config.color
                    )}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-admin-muted-foreground line-clamp-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-admin-muted-foreground/70">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>

                {activity.actionUrl && (
                  <ChevronRight className="h-5 w-5 text-admin-muted-foreground/50 group-hover:text-admin-foreground/50 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                )}
              </div>
            );
          })}

          {activities.length === 0 && (
            <div className="text-center py-12 text-admin-muted-foreground">
              <div className="h-16 w-16 rounded-2xl bg-admin-muted flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 opacity-50" />
              </div>
              <p className="font-medium">No recent activity</p>
              <p className="text-sm mt-1">Activity will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}