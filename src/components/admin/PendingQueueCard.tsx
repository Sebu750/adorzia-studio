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
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <FileSearch className="h-5 w-5 text-warning" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {items.length} items awaiting action
            </p>
          </div>
        </div>
        <Link to={viewAllLink}>
          <Button variant="outline" size="sm" className="gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {items.slice(0, 5).map((item, index) => (
            <div 
              key={item.id}
              className={cn(
                "group flex items-center gap-4 p-4 rounded-xl transition-all duration-200",
                "bg-muted/30 hover:bg-muted/60 cursor-pointer",
                "border border-transparent hover:border-border"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Avatar className="h-11 w-11 ring-2 ring-background shadow-sm">
                <AvatarImage src={item.designer.avatar} />
                <AvatarFallback className="text-xs font-medium">
                  {item.designer.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-medium truncate group-hover:text-foreground transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">{item.designer.name}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                  <span>{item.category}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.submittedAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge 
                  variant={item.status === 'pending_review' ? 'warning' : 'secondary'}
                  className="text-xs font-medium"
                >
                  {item.status === 'pending_review' ? 'Pending' : 'Revision'}
                </Badge>
                
                {/* Quick Actions */}
                <TooltipProvider delayDuration={0}>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Approve</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-warning hover:text-warning hover:bg-warning/10"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Request Revision</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reject</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 opacity-50" />
              </div>
              <p className="font-medium">No pending items</p>
              <p className="text-sm">All caught up!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}