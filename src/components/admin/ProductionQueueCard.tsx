import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  User, 
  ChevronRight, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface QueueItem {
  id: string;
  title: string;
  designer: {
    name: string;
    avatar?: string;
    rank?: string;
  };
  status: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  submittedAt: string;
  category?: string;
  thumbnailUrl?: string;
}

interface ProductionQueueCardProps {
  item: QueueItem;
  queueType: 'submission' | 'sampling' | 'techpack' | 'preproduction' | 'marketplace';
  onAction?: (id: string, action: string) => void;
  onView?: (id: string) => void;
}

const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  normal: "bg-admin-apricot/20 text-admin-apricot",
  high: "bg-amber-500/20 text-amber-400",
  urgent: "bg-red-500/20 text-red-400",
};

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
  pending: { color: "text-amber-400", icon: Clock },
  in_progress: { color: "text-blue-400", icon: Clock },
  completed: { color: "text-green-400", icon: CheckCircle },
  rejected: { color: "text-red-400", icon: XCircle },
  needs_attention: { color: "text-orange-400", icon: AlertCircle },
};

const queueActions: Record<string, { primary: string; secondary?: string }> = {
  submission: { primary: "Review", secondary: "Quick Reject" },
  sampling: { primary: "Start Sampling", secondary: "Request Info" },
  techpack: { primary: "Generate Tech Pack", secondary: "Manual Edit" },
  preproduction: { primary: "Approve Production", secondary: "Hold" },
  marketplace: { primary: "Create Listing", secondary: "Preview" },
};

export function ProductionQueueCard({ 
  item, 
  queueType, 
  onAction, 
  onView 
}: ProductionQueueCardProps) {
  const status = statusConfig[item.status] || statusConfig.pending;
  const actions = queueActions[queueType];
  const StatusIcon = status.icon;

  return (
    <Card className="border-admin-chocolate bg-admin-coffee/50 hover:bg-admin-coffee transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Thumbnail */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-admin-chocolate shrink-0">
            {item.thumbnailUrl ? (
              <img 
                src={item.thumbnailUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-admin-apricot/30">
                <Eye className="w-6 h-6" />
              </div>
            )}
            <Badge 
              className={cn(
                "absolute -top-1 -right-1 text-[10px] px-1.5",
                priorityColors[item.priority]
              )}
            >
              {item.priority}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium text-admin-wine-foreground truncate">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={item.designer.avatar} />
                    <AvatarFallback className="bg-admin-wine text-[10px] text-admin-wine-foreground">
                      {item.designer.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-admin-apricot/70 truncate">
                    {item.designer.name}
                  </span>
                  {item.designer.rank && (
                    <Badge variant="outline" className="text-[10px] border-admin-camel/30 text-admin-camel">
                      {item.designer.rank}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <StatusIcon className={cn("w-3.5 h-3.5", status.color)} />
                <span className={status.color}>{item.status.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3 text-xs text-admin-apricot/50">
                {item.category && (
                  <Badge variant="outline" className="text-[10px] border-admin-chocolate">
                    {item.category}
                  </Badge>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(item.submittedAt), { addSuffix: true })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {actions.secondary && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-admin-apricot/70 hover:text-admin-wine-foreground hover:bg-admin-chocolate"
                    onClick={() => onAction?.(item.id, actions.secondary!)}
                  >
                    {actions.secondary}
                  </Button>
                )}
                <Button
                  size="sm"
                  className="h-7 text-xs bg-admin-wine text-admin-wine-foreground hover:bg-admin-wine/90"
                  onClick={() => onAction?.(item.id, actions.primary)}
                >
                  {actions.primary}
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
