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
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  className,
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
      
      <CardContent className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="text-label">{title}</p>
            <p className="stat-value text-3xl sm:text-4xl truncate">
              {value}
            </p>
            {subtitle && (
              <p className="text-caption text-xs truncate">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1.5 pt-1">
                {trend.isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-secondary border border-border/50 transition-all duration-300 group-hover:bg-foreground group-hover:border-foreground">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground transition-colors duration-300 group-hover:text-background" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}