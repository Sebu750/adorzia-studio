import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  deadline: Date | string;
  className?: string;
  compact?: boolean;
  showIcon?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeRemaining(deadline: Date): TimeRemaining {
  const total = deadline.getTime() - Date.now();
  
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, total };
}

function getUrgencyLevel(time: TimeRemaining): "safe" | "warning" | "urgent" | "critical" | "expired" {
  if (time.total <= 0) return "expired";
  if (time.days >= 7) return "safe";
  if (time.days >= 3) return "warning";
  if (time.days >= 1) return "urgent";
  return "critical";
}

const urgencyStyles = {
  safe: "text-success bg-success/10 border-success/20",
  warning: "text-warning bg-warning/10 border-warning/20",
  urgent: "text-destructive bg-destructive/10 border-destructive/20",
  critical: "text-destructive bg-destructive/10 border-destructive/20 animate-pulse",
  expired: "text-muted-foreground bg-muted border-muted",
};

export function CountdownTimer({ 
  deadline, 
  className, 
  compact = false,
  showIcon = true 
}: CountdownTimerProps) {
  const deadlineDate = typeof deadline === "string" ? new Date(deadline) : deadline;
  const [time, setTime] = useState<TimeRemaining>(() => getTimeRemaining(deadlineDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeRemaining(deadlineDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [deadlineDate]);

  const urgency = getUrgencyLevel(time);

  if (urgency === "expired") {
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border",
        urgencyStyles.expired,
        className
      )}>
        {showIcon && <AlertTriangle className="h-3 w-3" />}
        <span>Deadline Passed</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border",
        urgencyStyles[urgency],
        className
      )}>
        {showIcon && <Clock className="h-3 w-3" />}
        <span className="tabular-nums">
          {time.days > 0 ? `${time.days}d ${time.hours}h` : `${time.hours}h ${time.minutes}m`}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border",
      urgencyStyles[urgency],
      className
    )}>
      {showIcon && <Clock className="h-4 w-4" />}
      <div className="flex items-center gap-1 tabular-nums">
        {time.days > 0 && (
          <>
            <span className="font-semibold">{time.days}</span>
            <span className="text-xs opacity-70">d</span>
          </>
        )}
        <span className="font-semibold">{String(time.hours).padStart(2, '0')}</span>
        <span className="text-xs opacity-70">h</span>
        <span className="font-semibold">{String(time.minutes).padStart(2, '0')}</span>
        <span className="text-xs opacity-70">m</span>
        {time.days === 0 && (
          <>
            <span className="font-semibold">{String(time.seconds).padStart(2, '0')}</span>
            <span className="text-xs opacity-70">s</span>
          </>
        )}
      </div>
    </div>
  );
}
