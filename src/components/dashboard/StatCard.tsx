import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  compact?: boolean;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  className,
  compact = false,
}: StatCardProps) {
  return (
    <Card 
      hover 
      className={cn(
        "group relative overflow-hidden card-interactive",
        className
      )}
      tabIndex={0}
      role="article"
      aria-label={`${title}: ${value}`}
    >
      {/* Subtle hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="relative p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-label text-sm truncate">{title}</p>
            <p className="stat-value text-xl sm:text-2xl font-semibold truncate">
              {value}
            </p>
            {subtitle && (
              <p className="text-caption text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 pt-0.5">
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              </div>
            )}
          </div>
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-secondary border border-border/50 transition-all duration-300 group-hover:bg-foreground group-hover:border-foreground">
            <Icon className="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-background" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}