import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Trophy, Medal, Award } from "lucide-react";
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
  'elite': 'text-foreground border-foreground/30 bg-foreground/5',
  'lead': 'text-muted-foreground border-muted-foreground/30 bg-muted-foreground/5',
  'senior': 'text-muted-foreground border-muted-foreground/20',
  'designer': 'text-muted-foreground/80 border-muted-foreground/20',
  'f1': 'text-foreground border-foreground/30 bg-foreground/5',
  'f2': 'text-foreground border-foreground/20 bg-foreground/5',
};

const positionIcons = [Trophy, Medal, Award];

export function TopDesignersCard({ designers }: TopDesignersCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
            <Crown className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Top Designers</CardTitle>
            <p className="text-sm text-muted-foreground">By revenue this month</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {designers.map((designer, index) => {
            const PositionIcon = positionIcons[index] || null;
            const isTopThree = index < 3;
            
            return (
              <div 
                key={designer.id}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                  "hover:bg-muted/50 cursor-pointer",
                  isTopThree && "bg-muted/30"
                )}
              >
                {/* Rank Position */}
                <div className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm",
                  index === 0 && "bg-foreground text-background",
                  index === 1 && "bg-muted-foreground/20 text-muted-foreground",
                  index === 2 && "bg-muted text-muted-foreground",
                  index > 2 && "bg-transparent text-muted-foreground/60"
                )}>
                  {PositionIcon ? (
                    <PositionIcon className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                  <AvatarImage src={designer.avatar} />
                  <AvatarFallback className="text-xs font-medium">
                    {designer.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{designer.name}</p>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[10px] capitalize px-1.5 py-0 font-medium",
                      rankColors[designer.rank.toLowerCase()] || "text-muted-foreground"
                    )}
                  >
                    {designer.rank}
                  </Badge>
                </div>

                <div className="text-right">
                  <p className="font-display font-bold text-success">
                    ${designer.revenue.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {designer.publishedItems} published
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}