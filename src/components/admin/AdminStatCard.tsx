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
  default: "bg-secondary",
  wine: "bg-foreground/5",
  camel: "bg-foreground/5",
  success: "bg-success/8",
  warning: "bg-warning/8",
};

const iconVariantStyles = {
  default: "text-muted-foreground",
  wine: "text-foreground",
  camel: "text-foreground/70",
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
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-foreground/10">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
              {title}
            </p>
            <p className="text-3xl font-display font-bold tracking-tight">
              {value}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {subtitle && (
                <span className="text-sm text-muted-foreground">{subtitle}</span>
              )}
              {trend && (
                <span className={cn(
                  "inline-flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full",
                  trend.isPositive 
                    ? "text-success bg-success/10" 
                    : "text-destructive bg-destructive/10"
                )}>
                  {trend.isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
          </div>
          <div className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
            variantStyles[variant]
          )}>
            <Icon className={cn("h-6 w-6", iconVariantStyles[variant])} />
          </div>
        </div>
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-foreground/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </CardContent>
    </Card>
  );
}
