import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowRight, 
  Clock,
  FileSearch,
  Check,
  X,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface PendingItem {
  id: string;
  title: string;
  designer: {
    name: string;
    avatar: string;
    rank: string;
  };
  category: string;
  submittedAt: string;
  status: 'pending_review' | 'revision_requested';
}

interface PendingQueueCardProps {
  items: PendingItem[];
  title: string;
  viewAllLink: string;
}

export function PendingQueueCard({ items, title, viewAllLink }: PendingQueueCardProps) {
  return (
    <Card className="overflow-hidden" role="region" aria-labelledby="queue-title">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <FileSearch className="h-5 w-5 text-warning" />
          </div>
          <div>
            <CardTitle id="queue-title" className="text-lg font-semibold">{title}</CardTitle>
            <p className="text-caption text-xs">{items.length} items awaiting action</p>
          </div>
        </div>
        <Link to={viewAllLink}>
          <Button variant="outline" size="sm" className="gap-2 btn-press hover:bg-foreground hover:text-background hover:border-foreground transition-colors">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border" role="list">
          {items.slice(0, 5).map((item) => (
            <div 
              key={item.id}
              className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-all cursor-pointer group"
              role="listitem"
              tabIndex={0}
            >
              <Avatar className="h-10 w-10 sm:h-11 sm:w-11 ring-2 ring-border/50">
                <AvatarImage src={item.designer.avatar} alt={item.designer.name} />
                <AvatarFallback className="text-sm font-medium bg-secondary">
                  {item.designer.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-medium truncate group-hover:text-foreground/80 transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                  <span className="font-medium text-foreground/70">{item.designer.name}</span>
                  <span className="h-1 w-1 rounded-full bg-border hidden sm:block" />
                  <span className="hidden sm:inline">{item.category}</span>
                  <span className="h-1 w-1 rounded-full bg-border hidden sm:block" />
                  <span>{item.submittedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Badge 
                  variant={item.status === 'pending_review' ? 'warning' : 'secondary'}
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 hidden sm:flex",
                    item.status === 'pending_review' && "bg-warning/10 text-warning border-warning/20"
                  )}
                >
                  {item.status === 'pending_review' ? 'Pending' : 'Revision'}
                </Badge>
                
                {/* Quick Actions */}
                <div className="hidden sm:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-lg text-success hover:text-success hover:bg-success/10 transition-colors"
                    aria-label="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-lg text-warning hover:text-warning hover:bg-warning/10 transition-colors"
                    aria-label="Request revision"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="Reject"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-foreground/50 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 opacity-50" />
              </div>
              <p className="font-medium">No pending items</p>
              <p className="text-sm mt-1">All caught up!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}