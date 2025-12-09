import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        accent: "border-transparent bg-accent text-accent-foreground",
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
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
