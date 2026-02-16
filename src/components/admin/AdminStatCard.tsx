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
<<<<<<< HEAD
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
=======
  default: "bg-admin-muted",
  wine: "bg-admin-foreground/5",
  camel: "bg-admin-muted",
  success: "bg-success/10",
  warning: "bg-warning/10",
};

const iconVariantStyles = {
  default: "text-admin-muted-foreground",
  wine: "text-admin-foreground",
  camel: "text-admin-muted-foreground",
  success: "text-success",
  warning: "text-warning",
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
      className="group relative overflow-hidden bg-admin-card border-admin-border/60 rounded-xl shadow-sm hover:shadow-md hover:border-admin-border transition-all duration-300 hover:-translate-y-0.5"
=======
      hover
      className="group relative overflow-hidden card-interactive bg-admin-card border-admin-border"
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      tabIndex={0}
      role="article"
      aria-label={`${title}: ${value}`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-admin-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <CardContent className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
<<<<<<< HEAD
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
=======
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="text-label text-admin-muted-foreground">{title}</p>
            <p className="stat-value text-3xl sm:text-4xl truncate text-admin-foreground">{value}</p>
            <div className="flex items-center gap-3 flex-wrap">
              {subtitle && (
                <span className="text-caption text-xs text-admin-muted-foreground">{subtitle}</span>
              )}
              {trend && (
                <span className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
            "h-11 w-11 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 border",
            iconContainerStyles[variant]
          )}>
            <Icon className={cn("h-5 w-5", variantStyles[variant])} />
=======
            "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 border border-admin-border",
            variantStyles[variant]
          )}>
            <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", iconVariantStyles[variant])} />
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          </div>
        </div>
      </CardContent>
    </Card>
  );
}