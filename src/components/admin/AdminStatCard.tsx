import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'wine' | 'camel' | 'success' | 'warning';
}

const variantStyles = {
  default: "bg-admin-muted/60 text-admin-muted-foreground",
  wine: "bg-admin-foreground/10 text-admin-foreground",
  camel: "bg-admin-muted/60 text-admin-muted-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

const iconContainerStyles = {
  default: "bg-admin-muted border-admin-border/50",
  wine: "bg-admin-foreground/10 border-admin-foreground/20",
  camel: "bg-admin-muted border-admin-border/50",
  success: "bg-success/10 border-success/30",
  warning: "bg-warning/10 border-warning/30",
};

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: AdminStatCardProps) {
  return (
    <Card 
      className="group relative overflow-hidden bg-admin-card border-admin-border/60 rounded-xl shadow-sm hover:shadow-md hover:border-admin-border transition-all duration-300 hover:-translate-y-0.5"
      tabIndex={0}
      role="article"
      aria-label={`${title}: ${value}`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-admin-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <CardContent className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-admin-foreground">{value}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {subtitle && (
                <span className="text-xs text-admin-muted-foreground/80">{subtitle}</span>
              )}
              {trend && (
                <span className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
                  trend.isPositive 
                    ? "text-success bg-success/10" 
                    : "text-destructive bg-destructive/10"
                )}>
                  {trend.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
          </div>
          <div className={cn(
            "h-11 w-11 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 border",
            iconContainerStyles[variant]
          )}>
            <Icon className={cn("h-5 w-5", variantStyles[variant])} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}