import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Check, Crown, Sparkles, Zap, Star, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { SUBSCRIPTION_TIERS, SubscriptionTier } from '@/lib/subscription';
import { cn } from '@/lib/utils';

const tierIcons: Record<SubscriptionTier, React.ReactNode> = {
  cadet: <Star className="h-6 w-6" />,
  pro: <Sparkles className="h-6 w-6" />,
  elite: <Crown className="h-6 w-6" />,
};

const tierColors: Record<SubscriptionTier, string> = {
  cadet: 'bg-secondary',
  pro: 'bg-primary/10 text-primary',
  elite: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30',
};

export default function Subscription() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { tier: currentTier, isSubscribed, subscriptionEnd, loading, startCheckout, openCustomerPortal, refreshSubscription } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: 'Subscription successful!',
        description: 'Welcome to your new plan. Enjoy the features!',
      });
      refreshSubscription();
    } else if (searchParams.get('canceled') === 'true') {
      toast({
        title: 'Subscription canceled',
        description: 'You can subscribe anytime.',
        variant: 'destructive',
      });
    }
  }, [searchParams, toast, refreshSubscription]);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to subscribe.',
        variant: 'destructive',
      });
      return;
    }

    // Cadet is free - no checkout needed
    if (tier === 'cadet') {
      toast({
        title: 'Free tier',
        description: 'You already have access to Cadet features!',
      });
      return;
    }

    try {
      await startCheckout(tier);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to start checkout',
        variant: 'destructive',
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to open customer portal',
        variant: 'destructive',
      });
    }
  };

  // Check if subscriptions are open (for now they're coming soon)
  const subscriptionsOpen = false;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {subscriptionsOpen ? 'Choose Your Plan' : 'Coming Soon'}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Studio Subscriptions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subscriptionsOpen 
              ? 'Unlock your creative potential with the right subscription tier. Upgrade anytime to access more features and grow your design career.'
              : 'Subscriptions are launching soon. Explore the tiers and consider becoming a Founder to lock in lifetime profit bonuses before launch.'}
          </p>
        </div>

        {!subscriptionsOpen && (
          <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl text-center border border-primary/20">
            <h3 className="font-semibold text-lg mb-2">🚀 Pre-Launch Access</h3>
            <p className="text-muted-foreground mb-4">
              Want to lock in lifetime profit bonuses before subscriptions go live?
            </p>
            <Link to="/pricing">
              <Button className="group">
                View Founder Tiers
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}

        {isSubscribed && subscriptionEnd && (
          <div className="mb-8 p-4 bg-secondary/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Your current plan: <span className="font-semibold text-foreground">{SUBSCRIPTION_TIERS[currentTier || 'cadet'].name}</span>
              {' · '}
              Renews on {new Date(subscriptionEnd).toLocaleDateString()}
            </p>
            <Button variant="outline" size="sm" className="mt-2" onClick={handleManageSubscription}>
              Manage Subscription
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {(Object.keys(SUBSCRIPTION_TIERS) as SubscriptionTier[]).map((tierKey) => {
            const tierConfig = SUBSCRIPTION_TIERS[tierKey];
            const isCurrentPlan = currentTier === tierKey && isSubscribed;
            const isPopular = tierKey === 'pro';
            const isFree = tierKey === 'cadet';

            return (
              <Card
                key={tierKey}
                className={cn(
                  'relative flex flex-col transition-all duration-300 hover:shadow-lg',
                  isPopular && 'border-primary shadow-md scale-[1.02]',
                  isCurrentPlan && 'ring-2 ring-primary'
                )}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                {isCurrentPlan && (
                  <Badge variant="secondary" className="absolute -top-3 right-4">
                    Current Plan
                  </Badge>
                )}
                {!subscriptionsOpen && !isFree && (
                  <div className="absolute top-4 right-4">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={cn('mx-auto mb-4 p-3 rounded-full', tierColors[tierKey])}>
                    {tierIcons[tierKey]}
                  </div>
                  <CardTitle className="text-xl">{tierConfig.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tierConfig.subtitle}</p>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">
                      {isFree ? 'FREE' : tierConfig.priceFormatted.replace('/mo', '')}
                    </span>
                    {!isFree && <span className="text-muted-foreground">/month</span>}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {tierConfig.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isPopular ? 'default' : 'outline'}
                    disabled={loading || isCurrentPlan || (!subscriptionsOpen && !isFree)}
                    onClick={() => handleSubscribe(tierKey)}
                  >
                    {loading 
                      ? 'Loading...' 
                      : isCurrentPlan 
                        ? 'Current Plan' 
                        : !subscriptionsOpen && !isFree
                          ? 'Coming Soon'
                          : isFree 
                            ? 'Free Access' 
                            : `Subscribe to ${tierConfig.name}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>All paid plans include a 7-day money-back guarantee.</p>
          <p className="mt-1">Need help choosing? Contact us at <a href="mailto:hello@adorzia.com" className="text-primary hover:underline">hello@adorzia.com</a></p>
        </div>
      </div>
    </div>
  );
}
