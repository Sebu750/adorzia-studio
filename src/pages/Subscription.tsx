import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Check, Crown, Sparkles, Zap, Star, Lock, ArrowRight, Award, Trophy, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useFounderPurchase } from '@/hooks/useFounderPurchase';
import { FOUNDER_TIERS, FounderTier } from '@/lib/founder-tiers';
import { cn } from '@/lib/utils';

export default function Subscription() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { tier: currentTier, isSubscribed, subscriptionEnd, loading, startCheckout, openCustomerPortal, refreshSubscription } = useSubscription();
  const { purchaseFounderTier, loading: founderPurchaseLoading } = useFounderPurchase();
  const { toast } = useToast();
  const [founderTierLoading, setFounderTierLoading] = useState<Record<string, boolean>>({});

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

  const handleFounderTierPurchase = async (tierId: string) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to purchase a founder tier.',
        variant: 'destructive',
      });
      return;
    }

    setFounderTierLoading(prev => ({ ...prev, [tierId]: true }));

    try {
      const result = await purchaseFounderTier(tierId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to initiate purchase');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to start checkout',
        variant: 'destructive',
      });
    } finally {
      setFounderTierLoading(prev => ({ ...prev, [tierId]: false }));
    }
  };

  // Get founder tier from profile if available
  const [founderTier, setFounderTier] = useState<string | null>(null);
  useEffect(() => {
    // This would typically come from useProfile hook
    // For now we'll just mock it or get it from somewhere
    // In a real implementation, you'd use the useProfile hook
  }, []);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            One-Time Payment
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Founder Tiers</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Secure your lifetime profit bonuses with a one-time payment. Founder tiers offer permanent benefits and exclusive access to the platform.
          </p>
        </div>

        {/* Founder Tiers Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Lifetime Access Tiers</h2>
            <p className="text-muted-foreground">One-time payment, lifetime benefits</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {(Object.keys(FOUNDER_TIERS) as (keyof typeof FOUNDER_TIERS)[]).map((tierKey) => {
              const tierConfig = FOUNDER_TIERS[tierKey];
              const isHighlighted = tierConfig.highlighted;
              const isLoading = founderTierLoading[tierKey];

              return (
                <Card
                  key={tierKey}
                  className={cn(
                    'relative flex flex-col transition-all duration-300 hover:shadow-lg',
                    isHighlighted && 'border-2 border-primary ring-2 ring-primary/20 transform scale-105',
                    founderTier === tierKey && 'ring-2 ring-primary'
                  )}
                >
                  {isHighlighted && tierConfig.highlightLabel && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      {tierConfig.highlightLabel}
                    </Badge>
                  )}
                  {founderTier === tierKey && (
                    <Badge variant="secondary" className="absolute -top-3 right-4">
                      Your Tier
                    </Badge>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={cn(
                      'mx-auto mb-4 p-3 rounded-full',
                      tierConfig.badgeColor === 'gold' ? 'bg-amber-100 text-amber-600' : 
                      tierConfig.badgeColor === 'silver' ? 'bg-gray-200 text-gray-600' : 
                      'bg-secondary'
                    )}>
                      {tierConfig.badgeColor === 'gold' ? <Gem className="h-6 w-6" /> : 
                       tierConfig.badgeColor === 'silver' ? <Trophy className="h-6 w-6" /> : 
                       <Award className="h-6 w-6" />}
                    </div>
                    <CardTitle className="text-xl">{tierConfig.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{tierConfig.subtitle}</p>
                    <CardDescription>
                      <span className="text-3xl font-bold text-foreground">
                        {tierConfig.priceFormatted}
                      </span>
                      {tierConfig.isOneTime && <span className="text-muted-foreground text-sm ml-1">one-time</span>}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mt-1">{tierConfig.targetAudience}</p>
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
                    
                    {tierConfig.perks.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold text-sm mb-2">Perks:</h4>
                        <ul className="text-xs space-y-1">
                          {tierConfig.perks.map((perk, idx) => (
                            <li key={idx} className="flex items-start">
                              <Star className="h-3 w-3 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={isHighlighted ? 'default' : 'outline'}
                      disabled={isLoading || founderPurchaseLoading}
                      onClick={() => handleFounderTierPurchase(tierKey)}
                    >
                      {isLoading || (founderPurchaseLoading && founderTierLoading[tierKey] !== false)
                        ? 'Processing...' 
                        : tierConfig.ctaText}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>All founder tiers offer lifetime profit bonuses and are limited edition. Secure your spot before slots run out!</p>
          <p className="mt-1">Need help choosing? Contact us at <a href="mailto:hello@adorzia.com" className="text-primary hover:underline">hello@adorzia.com</a></p>
        </div>
      </div>
    </div>
  );
}
