import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, TrendingUp, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopDesigner {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  revenue: number;
  completedStyleboxes: number;
  publishedItems: number;
}

interface TopDesignersCardProps {
  designers: TopDesigner[];
}

const rankColors: Record<string, string> = {
  'elite': 'text-foreground bg-foreground/10 border-foreground/20',
  'lead': 'text-foreground/80 bg-foreground/5 border-foreground/10',
  'senior': 'text-foreground/70 bg-secondary border-border',
  'designer': 'text-muted-foreground bg-secondary border-border',
  'f1': 'text-foreground bg-foreground/10 border-foreground/30',
  'f2': 'text-foreground/90 bg-foreground/5 border-foreground/20',
};

export function TopDesignersCard({ designers }: TopDesignersCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4 border-b bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-foreground/5 flex items-center justify-center">
            <Crown className="h-5 w-5 text-foreground/70" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Top Designers</CardTitle>
            <p className="text-sm text-muted-foreground">By revenue this month</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {designers.map((designer, index) => (
            <div 
              key={designer.id}
              className={cn(
                "flex items-center gap-4 p-4 hover:bg-secondary/50 transition-all cursor-pointer group",
                "animate-in fade-in slide-in-from-bottom-2"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Rank Position */}
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-105",
                index === 0 && "bg-foreground text-background",
                index === 1 && "bg-foreground/20 text-foreground",
                index === 2 && "bg-foreground/10 text-foreground/80",
                index > 2 && "bg-secondary text-muted-foreground"
              )}>
                {index + 1}
              </div>

              <Avatar className="h-11 w-11 ring-2 ring-border">
                <AvatarImage src={designer.avatar} />
                <AvatarFallback className="text-sm font-medium">
                  {designer.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-medium truncate">{designer.name}</p>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs capitalize font-medium",
                      rankColors[designer.rank.toLowerCase()] || "text-muted-foreground"
                    )}
                  >
                    {designer.rank}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {designer.publishedItems} published
                  </span>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="font-display font-bold text-lg text-success">
                    ${designer.revenue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-success justify-end">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12%</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-foreground/50 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
