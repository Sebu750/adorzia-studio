import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const levelConfig = {
  1: { label: "I", name: "Foundation", bg: "bg-muted", text: "text-muted-foreground" },
  2: { label: "II", name: "Intermediate", bg: "bg-secondary", text: "text-secondary-foreground" },
  3: { label: "III", name: "Advanced", bg: "bg-primary/10", text: "text-primary" },
  4: { label: "IV", name: "Master", bg: "bg-primary", text: "text-primary-foreground" },
};

const sizeStyles = {
  sm: "h-5 w-5 text-[10px]",
  md: "h-6 w-6 text-xs",
  lg: "h-8 w-8 text-sm",
};

export function LevelBadge({ level, className, size = "md" }: LevelBadgeProps) {
  const config = levelConfig[level as keyof typeof levelConfig] || levelConfig[1];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-display font-bold",
        config.bg,
        config.text,
        sizeStyles[size],
        className
      )}
      title={`Level ${level} - ${config.name}`}
    >
      {config.label}
    </div>
  );
}
