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
  AlertCircle
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileSearch className="h-5 w-5 text-warning" />
          {title}
          <Badge variant="warning" className="ml-1">{items.length}</Badge>
        </CardTitle>
        <Link to={viewAllLink}>
          <Button variant="ghost" size="sm" className="gap-1.5">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.slice(0, 5).map((item) => (
            <div 
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.designer.avatar} />
                <AvatarFallback>{item.designer.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.designer.name}</span>
                  <span>•</span>
                  <span>{item.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <Badge 
                    variant={item.status === 'pending_review' ? 'warning' : 'secondary'}
                    className="text-xs"
                  >
                    {item.status === 'pending_review' ? 'Pending' : 'Revision'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.submittedAt}
                  </p>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:text-success hover:bg-success/10">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-warning hover:text-warning hover:bg-warning/10">
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No pending items</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
