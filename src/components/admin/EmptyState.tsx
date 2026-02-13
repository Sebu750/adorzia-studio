import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;  // Changed to accept ReactNode for flexibility
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "error";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  variant = "default"
}: EmptyStateProps) {
  const bgColor = variant === "error" ? "bg-destructive/10" : "bg-admin-muted/50";
  const iconColor = variant === "error" ? "text-destructive" : "text-admin-muted-foreground";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className={`h-24 w-24 rounded-full ${bgColor} flex items-center justify-center mb-4`}>
          <Icon className={`h-12 w-12 ${iconColor}`} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-admin-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-admin-muted-foreground text-center max-w-md mb-6">
        {description}
      </p>
      {action ? (
        <div>
          {action}
        </div>
      ) : actionLabel && onAction ? (
        <Button onClick={onAction} className="gap-2">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default EmptyState;