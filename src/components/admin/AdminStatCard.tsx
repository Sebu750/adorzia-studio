import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

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
  default: "bg-secondary/50",
  wine: "bg-admin-wine/10",
  camel: "bg-admin-camel/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
};

const iconVariantStyles = {
  default: "text-muted-foreground",
  wine: "text-admin-wine",
  camel: "text-admin-camel",
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
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-display font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <p className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}% from last week
              </p>
            )}
          </div>
          <div className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center",
            variantStyles[variant]
          )}>
            <Icon className={cn("h-5 w-5", iconVariantStyles[variant])} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
