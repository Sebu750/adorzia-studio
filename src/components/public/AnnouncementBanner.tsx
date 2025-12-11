import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementBannerProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
}

export default function AnnouncementBanner({
  message = "Join 2,500+ designers building their fashion brands",
  linkText = "Get Started Free",
  linkHref = "/auth",
  className,
}: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div 
      className={cn(
        "bg-primary text-primary-foreground py-2 px-4 relative",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
        <Sparkles className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">{message}</span>
        <span className="sm:hidden">Join 2,500+ designers</span>
        <Link 
          to={linkHref}
          className="font-medium underline underline-offset-4 hover:no-underline inline-flex items-center gap-1"
        >
          {linkText}
          <ArrowRight className="h-3 w-3" />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-2 sm:right-4 p-1 hover:bg-primary-foreground/10 rounded transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
