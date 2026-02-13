// Subscription tier configuration - Adorzia Studio Access
export type SubscriptionTier = 'basic' | 'pro' | 'elite';

export interface TierConfig {
  id: SubscriptionTier;
  name: string;
  subtitle: string;
  price: number; // PKR
  priceFormatted: string;
  priceId: string;
  productId: string;
  features: string[];
  limits: {
    styleboxes: number | 'unlimited';
    portfolioProjects: number | 'unlimited';
    productionRequests: number;
    canPublish: boolean;
    prioritySupport: boolean;
    curatorReview: boolean;
    earnFromSales: boolean;
  };
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierConfig> = {
  basic: {
    id: 'basic',
    name: 'Basic',
    subtitle: 'Start Learning',
    price: 0,
    priceFormatted: 'FREE',
    priceId: '', // Free tier, no price ID
    productId: '',
    features: [
      'Basic StyleBox challenges only',
      '3 portfolio designs max',
      'Community forum access',
      'Learn design fundamentals',
      'No marketplace earnings',
    ],
    limits: {
      styleboxes: 3,
      portfolioProjects: 3,
      productionRequests: 0,
      canPublish: false,
      prioritySupport: false,
      curatorReview: false,
      earnFromSales: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro Artisan',
    subtitle: 'Build Your Career',
    price: 4200,
    priceFormatted: 'PKR 4,200/mo',
    priceId: 'price_1ScpNJK03OkAk5KYLuMBjFeW', // Update with actual Stripe price ID
    productId: 'prod_TZzMUrCNQhoSkG',
    features: [
      'Full StyleBox challenge access',
      'Up to 20 portfolio designs',
      '1 production request/month',
      'Revenue dashboard access',
      'Earn from marketplace sales',
      'Priority email support',
    ],
    limits: {
      styleboxes: 'unlimited',
      portfolioProjects: 20,
      productionRequests: 1,
      canPublish: true,
      prioritySupport: true,
      curatorReview: false,
      earnFromSales: true,
    },
  },
  elite: {
    id: 'elite',
    name: 'Elite Studio',
    subtitle: 'Lead the Industry',
    price: 11000,
    priceFormatted: 'PKR 11,000/mo',
    priceId: 'price_1ScpNcK03OkAk5KY6O0YcXzZ', // Update with actual Stripe price ID
    productId: 'prod_TZzMnU22Ntmp89',
    features: [
      'All StyleBox challenges (incl. Team)',
      'Unlimited portfolio designs',
      '5 production requests/month',
      'Dedicated curator review',
      'Priority production queue',
      'Early access to new features',
      'Higher algorithm visibility',
    ],
    limits: {
      styleboxes: 'unlimited',
      portfolioProjects: 'unlimited',
      productionRequests: 5,
      canPublish: true,
      prioritySupport: true,
      curatorReview: true,
      earnFromSales: true,
    },
  },
};

// Map product IDs to tier IDs
export const PRODUCT_TO_TIER: Record<string, SubscriptionTier> = {
  'prod_TZzMUrCNQhoSkG': 'pro',
  'prod_TZzMnU22Ntmp89': 'elite',
};

// Check if a tier can access a feature
export function canAccessFeature(
  userTier: SubscriptionTier | null,
  feature: keyof TierConfig['limits']
): boolean {
  if (!userTier) return false;
  const tier = SUBSCRIPTION_TIERS[userTier];
  if (!tier) return false;
  
  const value = tier.limits[feature];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  return value === 'unlimited';
}

// Check if user can access a stylebox based on difficulty and tier
export function canAccessStylebox(
  userTier: SubscriptionTier | null,
  requiredTier: SubscriptionTier | null
): boolean {
  if (!requiredTier) return true; // No restriction
  if (!userTier) return false;
  
  const tierOrder: SubscriptionTier[] = ['basic', 'pro', 'elite'];
  const userTierIndex = tierOrder.indexOf(userTier);
  const requiredTierIndex = tierOrder.indexOf(requiredTier);
  
  return userTierIndex >= requiredTierIndex;
}

// Get the number of styleboxes remaining for the month
export function getStyleboxLimit(userTier: SubscriptionTier | null): number | 'unlimited' {
  if (!userTier) return 0;
  return SUBSCRIPTION_TIERS[userTier]?.limits.styleboxes ?? 0;
}

// Format price for display
export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString()}`;
}
