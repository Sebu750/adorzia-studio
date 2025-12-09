import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, TrendingUp } from "lucide-react";
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
  'elite': 'text-rank-elite',
  'lead': 'text-rank-lead',
  'senior': 'text-rank-senior',
  'designer': 'text-rank-designer',
  'f1': 'text-rank-f1',
  'f2': 'text-rank-f2',
};

export function TopDesignersCard({ designers }: TopDesignersCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Crown className="h-5 w-5 text-admin-camel" />
          Top Designers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {designers.map((designer, index) => (
            <div 
              key={designer.id}
              className="flex items-center gap-3"
            >
              {/* Rank Position */}
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold",
                index === 0 && "bg-admin-camel/20 text-admin-camel",
                index === 1 && "bg-rank-silver/20 text-rank-silver",
                index === 2 && "bg-rank-bronze/20 text-rank-bronze",
                index > 2 && "bg-secondary text-muted-foreground"
              )}>
                {index + 1}
              </div>

              <Avatar className="h-10 w-10">
                <AvatarImage src={designer.avatar} />
                <AvatarFallback>{designer.name.slice(0, 2)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{designer.name}</p>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs capitalize",
                      rankColors[designer.rank.toLowerCase()] || "text-muted-foreground"
                    )}
                  >
                    {designer.rank}
                  </Badge>
                </div>
              </div>

              <div className="text-right">
                <p className="font-display font-semibold text-success">
                  ${designer.revenue.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {designer.publishedItems} published
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
