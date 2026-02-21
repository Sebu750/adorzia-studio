import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MarketplaceStatus = "approved" | "pending" | "rejected" | "not_submitted" | null;

interface MarketplaceEligibilityBadgeProps {
  status: MarketplaceStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<string, {
  label: string;
  icon: typeof ShoppingBag;
  variant: "default" | "secondary" | "destructive" | "outline";
  color: string;
  bgColor: string;
  tooltip: string;
}> = {
  approved: {
    label: "Available for Order",
    icon: CheckCircle,
    variant: "default",
    color: "text-green-600",
    bgColor: "bg-green-500",
    tooltip: "This project is approved for sale on the marketplace"
  },
  pending: {
    label: "Review Pending",
    icon: Clock,
    variant: "secondary",
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10",
    tooltip: "This project is under review for marketplace eligibility"
  },
  rejected: {
    label: "Not Eligible",
    icon: XCircle,
    variant: "destructive",
    color: "text-red-600",
    bgColor: "bg-red-500/10",
    tooltip: "This project was not approved for marketplace sale"
  },
  not_submitted: {
    label: "Not Submitted",
    icon: AlertCircle,
    variant: "outline",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    tooltip: "This project hasn't been submitted for marketplace review"
  }
};

export function MarketplaceEligibilityBadge({ 
  status, 
  size = "md", 
  showLabel = true,
  className 
}: MarketplaceEligibilityBadgeProps) {
  const config = STATUS_CONFIG[status || "not_submitted"];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const badgeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  };

  if (status === "approved") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              className={cn(
                "gap-1.5 bg-green-500 text-white hover:bg-green-600",
                badgeClasses[size],
                className
              )}
            >
              <ShoppingBag className={sizeClasses[size]} />
              {showLabel && config.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{config.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={config.variant}
            className={cn(
              "gap-1.5",
              badgeClasses[size],
              className
            )}
          >
            <Icon className={cn(sizeClasses[size], config.color)} />
            {showLabel && config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Compact version for grid views
interface MarketplaceStatusIndicatorProps {
  status: MarketplaceStatus;
  className?: string;
}

export function MarketplaceStatusIndicator({ status, className }: MarketplaceStatusIndicatorProps) {
  if (status !== "approved") return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg",
            className
          )}>
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Available for Order</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Full status display for project details
interface MarketplaceEligibilityStatusProps {
  status: MarketplaceStatus;
  isMadeToOrder?: boolean;
  productId?: string;
}

export function MarketplaceEligibilityStatus({ 
  status, 
  isMadeToOrder,
  productId 
}: MarketplaceEligibilityStatusProps) {
  const config = STATUS_CONFIG[status || "not_submitted"];
  const Icon = config.icon;

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      status === "approved" ? "border-green-500/30 bg-green-500/5" : "border-border bg-muted/30"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            status === "approved" ? "bg-green-500/20" : config.bgColor
          )}>
            <Icon className={cn("h-5 w-5", config.color)} />
          </div>
          <div>
            <h4 className="font-medium">Marketplace Status</h4>
            <p className={cn("text-sm", config.color)}>{config.label}</p>
          </div>
        </div>

        {status === "approved" && (
          <div className="flex items-center gap-2">
            {isMadeToOrder && (
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Made to Order
              </Badge>
            )}
            <Badge className="bg-green-500 text-white gap-1">
              <ShoppingBag className="h-3 w-3" />
              Shop Now
            </Badge>
          </div>
        )}
      </div>

      {status === "pending" && (
        <p className="text-xs text-muted-foreground mt-3 pl-13">
          Your project is being reviewed by our team. This usually takes 2-3 business days.
        </p>
      )}

      {status === "rejected" && (
        <p className="text-xs text-muted-foreground mt-3 pl-13">
          Your project didn't meet our marketplace criteria. Review the feedback and resubmit.
        </p>
      )}

      {status === "not_submitted" && (
        <p className="text-xs text-muted-foreground mt-3 pl-13">
          Submit your project for marketplace review to start selling.
        </p>
      )}
    </div>
  );
}
