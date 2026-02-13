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
      hover
      className="group relative overflow-hidden card-interactive bg-admin-card border-admin-border"
      tabIndex={0}
      role="article"
      aria-label={`${title}: ${value}`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-admin-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <CardContent className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-admin-foreground">{value}</p>
            <div className="flex items-center gap-3 flex-wrap">
              {subtitle && (
                <span className="text-sm text-admin-muted-foreground">{subtitle}</span>
              )}
              {trend && (
                <span className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
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
            "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 border border-admin-border",
            variantStyles[variant]
          )}>
            <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", iconVariantStyles[variant])} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}