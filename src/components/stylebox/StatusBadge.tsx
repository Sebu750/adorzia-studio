import { 
  Clock, 
  FileEdit, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Eye 
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StyleboxStatus = 
  | "not_started" 
  | "draft" 
  | "active" 
  | "submitted" 
  | "under_review" 
  | "approved" 
  | "rejected" 
  | "completed";

interface StatusBadgeProps {
  status: StyleboxStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<StyleboxStatus, {
  label: string;
  icon: typeof Clock;
  className: string;
}> = {
  not_started: {
    label: "Not Started",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-muted",
  },
  draft: {
    label: "Draft",
    icon: FileEdit,
    className: "bg-secondary text-secondary-foreground border-secondary",
  },
  active: {
    label: "In Progress",
    icon: Clock,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  submitted: {
    label: "Submitted",
    icon: Send,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  under_review: {
    label: "Under Review",
    icon: Eye,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
  },
};

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border",
      config.className,
      className
    )}>
      {showIcon && <Icon className="h-3 w-3" />}
      <span>{config.label}</span>
    </div>
  );
}
