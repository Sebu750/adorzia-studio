import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, CrownIcon, StarIcon } from 'lucide-react';
import { FOUNDER_TIERS, FounderTier } from '@/lib/founder-tiers';

interface FounderTierSelectorProps {
  selectedTier: string;
  onSelectTier: (tierId: string) => void;
  onPurchase: (tierId: string) => void;
  loading?: boolean;
}

const FounderTierSelector: React.FC<FounderTierSelectorProps> = ({
  selectedTier,
  onSelectTier,
  onPurchase,
  loading = false,
}) => {
  const handlePurchase = (tierId: string) => {
    onPurchase(tierId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {Object.values(FOUNDER_TIERS).map((tier: FounderTier) => (
        <Card 
          key={tier.id} 
          className={`flex flex-col ${
            tier.highlighted 
              ? 'border-2 border-primary ring-2 ring-primary/20 transform scale-105' 
              : 'border'
          } ${selectedTier === tier.id ? 'ring-2 ring-primary' : ''}`}
        >
          {tier.highlighted && (
            <div className="bg-primary text-primary-foreground text-center py-1 rounded-t-lg">
              <span className="text-sm font-medium">{tier.highlightLabel}</span>
            </div>
          )}
          
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription>{tier.subtitle}</CardDescription>
              </div>
              {tier.badge && (
                <Badge variant={tier.badgeColor === 'gold' ? 'default' : 'secondary'}>
                  {tier.badge}
                </Badge>
              )}
            </div>
            
            <div className="mt-4">
              <span className="text-3xl font-bold">{tier.priceFormatted}</span>
              {tier.isOneTime && (
                <span className="text-sm text-muted-foreground ml-2">one-time</span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-2">{tier.targetAudience}</p>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full"
              variant={tier.highlighted ? 'default' : 'outline'}
              onClick={() => handlePurchase(tier.id)}
              disabled={loading}
            >
              {loading ? 'Processing...' : tier.ctaText}
            </Button>
            
            {tier.perks.length > 0 && (
              <div className="w-full pt-2 border-t">
                <h4 className="font-semibold text-sm mb-2">Perks:</h4>
                <ul className="text-xs space-y-1">
                  {tier.perks.map((perk, index) => (
                    <li key={index} className="flex items-start">
                      <StarIcon className="h-3 w-3 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FounderTierSelector;