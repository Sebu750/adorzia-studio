import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        outline: "text-foreground border-border hover:bg-secondary/50",
        success: "border-transparent bg-success text-success-foreground shadow-sm",
        warning: "border-transparent bg-warning text-warning-foreground shadow-sm",
        accent: "border-transparent bg-accent text-accent-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        easy: "border-success/30 bg-success/10 text-success",
        medium: "border-warning/30 bg-warning/10 text-warning",
        hard: "border-destructive/30 bg-destructive/10 text-destructive",
        insane: "border-transparent bg-accent text-accent-foreground",
        bronze: "border-transparent bg-rank-bronze/10 text-rank-bronze",
        silver: "border-transparent bg-rank-silver/10 text-rank-silver",
        gold: "border-transparent bg-rank-gold/10 text-rank-gold",
        platinum: "border-transparent bg-rank-platinum/10 text-rank-platinum",
        diamond: "border-transparent bg-rank-diamond/10 text-rank-diamond",
        free: "border-accent/30 bg-accent/5 text-accent",
        paid: "border-primary/30 bg-primary/5 text-primary",
        locked: "border-muted-foreground/30 bg-muted text-muted-foreground",
        pending: "border-warning/30 bg-warning/10 text-warning",
        active: "border-success/30 bg-success/10 text-success",
        completed: "border-primary/30 bg-primary/10 text-primary",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
