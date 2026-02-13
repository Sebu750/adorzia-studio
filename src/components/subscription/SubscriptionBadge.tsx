import { Crown, Sparkles, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';
import { SubscriptionTier } from '@/lib/subscription';

interface SubscriptionBadgeProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const tierConfig: Record<SubscriptionTier, { icon: typeof Zap; label: string; className: string }> = {
  basic: {
    icon: Zap,
    label: 'Basic',
    className: 'bg-secondary text-secondary-foreground',
  },
  pro: {
    icon: Sparkles,
    label: 'Pro',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  elite: {
    icon: Crown,
    label: 'Elite',
    className: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700',
  },
};

export function SubscriptionBadge({ showLabel = true, size = 'md' }: SubscriptionBadgeProps) {
  const { tier } = useSubscription();

  if (!tier) return null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  // Safe access with fallback to basic
  const config = tierConfig[tier] ?? tierConfig.basic;
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center gap-1 font-medium',
        sizeClasses[size],
        config.className
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
    </Badge>
  );
}
