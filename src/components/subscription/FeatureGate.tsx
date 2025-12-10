import { ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionTier, canAccessStylebox } from '@/lib/subscription';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FeatureGateProps {
  requiredTier: SubscriptionTier;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

export function FeatureGate({ 
  requiredTier, 
  children, 
  fallback,
  showUpgradePrompt = true 
}: FeatureGateProps) {
  const { tier } = useSubscription();
  const navigate = useNavigate();

  const hasAccess = canAccessStylebox(tier, requiredTier);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUpgradePrompt) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-secondary/30 rounded-lg border border-dashed border-border">
        <Lock className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground text-center mb-4">
          This feature requires a {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} subscription or higher.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate('/subscription')}>
          Upgrade Plan
        </Button>
      </div>
    );
  }

  return null;
}
