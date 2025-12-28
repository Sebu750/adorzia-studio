import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, ChevronRight } from "lucide-react";
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
  'elite': 'text-admin-foreground bg-admin-foreground/10 border-admin-foreground/20',
  'lead': 'text-admin-foreground/80 bg-admin-foreground/5 border-admin-foreground/10',
  'senior': 'text-admin-foreground/70 bg-admin-muted border-admin-border',
  'designer': 'text-admin-muted-foreground bg-admin-muted border-admin-border',
  'f1': 'text-admin-foreground bg-admin-foreground/10 border-admin-foreground/30',
  'f2': 'text-admin-foreground/90 bg-admin-foreground/5 border-admin-foreground/20',
};

export function TopDesignersCard({ designers }: TopDesignersCardProps) {
  return (
    <Card className="overflow-hidden bg-admin-card border-admin-border" role="region" aria-labelledby="designers-title">
      <CardHeader className="pb-4 border-b border-admin-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-admin-muted flex items-center justify-center">
            <Crown className="h-5 w-5 text-admin-foreground/70" />
          </div>
          <div>
            <CardTitle id="designers-title" className="text-lg font-semibold text-admin-foreground">Top Designers</CardTitle>
            <p className="text-caption text-xs text-admin-muted-foreground">By revenue this month</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-admin-border" role="list">
          {designers.map((designer, index) => (
            <div 
              key={designer.id}
              className="flex items-center gap-3 sm:gap-4 p-4 hover:bg-admin-muted/50 transition-all cursor-pointer group"
              role="listitem"
              tabIndex={0}
            >
              {/* Rank Position */}
              <div className={cn(
                "h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-transform duration-300 group-hover:scale-105",
                index === 0 && "bg-admin-foreground text-admin-background",
                index === 1 && "bg-admin-foreground/20 text-admin-foreground",
                index === 2 && "bg-admin-foreground/10 text-admin-foreground/80",
                index > 2 && "bg-admin-muted text-admin-muted-foreground"
              )}>
                {index + 1}
              </div>

              <Avatar className="h-10 w-10 sm:h-11 sm:w-11 ring-2 ring-admin-border">
                <AvatarImage src={designer.avatar} alt={designer.name} />
                <AvatarFallback className="text-sm font-medium bg-admin-muted text-admin-foreground">
                  {designer.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-medium truncate text-admin-foreground">{designer.name}</p>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[10px] sm:text-xs capitalize font-medium",
                      rankColors[designer.rank.toLowerCase()] || "text-admin-muted-foreground"
                    )}
                  >
                    {designer.rank}
                  </Badge>
                  <span className="text-xs text-admin-muted-foreground hidden sm:inline">
                    {designer.publishedItems} published
                  </span>
                </div>
              </div>

              <div className="text-right flex items-center gap-2 sm:gap-3">
                <div>
                  <p className="font-display font-bold text-base sm:text-lg text-success tabular-nums">
                    ${designer.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-admin-muted-foreground hidden sm:block">
                    {designer.completedStyleboxes} completed
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-admin-muted-foreground/50 group-hover:text-admin-foreground/50 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}