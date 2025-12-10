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
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <FileSearch className="h-5 w-5 text-warning" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{items.length} items awaiting action</p>
          </div>
        </div>
        <Link to={viewAllLink}>
          <Button variant="outline" size="sm" className="gap-2 hover:bg-foreground hover:text-background transition-colors">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {items.slice(0, 5).map((item, index) => (
            <div 
              key={item.id}
              className={cn(
                "flex items-center gap-4 p-4 hover:bg-secondary/50 transition-all cursor-pointer group",
                "animate-in fade-in slide-in-from-bottom-2",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Avatar className="h-11 w-11 ring-2 ring-border">
                <AvatarImage src={item.designer.avatar} />
                <AvatarFallback className="text-sm font-medium">
                  {item.designer.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-medium truncate group-hover:text-foreground/80 transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/70">{item.designer.name}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{item.category}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{item.submittedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge 
                  variant={item.status === 'pending_review' ? 'warning' : 'secondary'}
                  className={cn(
                    "text-xs font-medium px-2.5 py-1",
                    item.status === 'pending_review' && "bg-warning/10 text-warning border-warning/20"
                  )}
                >
                  {item.status === 'pending_review' ? 'Pending Review' : 'Revision Needed'}
                </Badge>
                
                {/* Quick Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-9 w-9 rounded-lg text-success hover:text-success hover:bg-success/10 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-9 w-9 rounded-lg text-warning hover:text-warning hover:bg-warning/10 transition-colors"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-9 w-9 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
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
