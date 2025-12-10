// Subscription tier configuration
export type SubscriptionTier = 'basic' | 'pro' | 'elite';

export interface TierConfig {
  id: SubscriptionTier;
  name: string;
  price: number;
  priceId: string;
  productId: string;
  features: string[];
  limits: {
    styleboxes: number | 'unlimited';
    portfolioProjects: number | 'unlimited';
    canPublish: boolean;
    prioritySupport: boolean;
    mentorship: boolean;
    earlyAccess: boolean;
  };
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierConfig> = {
  basic: {
    id: 'basic',
    name: 'Designer Basic',
    price: 19,
    priceId: 'price_1ScpN2K03OkAk5KYe1LSlOVt',
    productId: 'prod_TZzLhzjouHHnzj',
    features: [
      '5 StyleBox challenges per month',
      '10 Portfolio projects',
      'Basic design tools',
      'Community access',
      'Email support',
    ],
    limits: {
      styleboxes: 5,
      portfolioProjects: 10,
      canPublish: false,
      prioritySupport: false,
      mentorship: false,
      earlyAccess: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro Creator',
    price: 49,
    priceId: 'price_1ScpNJK03OkAk5KYLuMBjFeW',
    productId: 'prod_TZzMUrCNQhoSkG',
    features: [
      'Unlimited StyleBox challenges',
      'Unlimited Portfolio projects',
      'Request Publish to marketplace',
      'Styleathon participation',
      'Revenue dashboard',
      'Priority support',
    ],
    limits: {
      styleboxes: 'unlimited',
      portfolioProjects: 'unlimited',
      canPublish: true,
      prioritySupport: true,
      mentorship: false,
      earlyAccess: false,
    },
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price: 99,
    priceId: 'price_1ScpNcK03OkAk5KY6O0YcXzZ',
    productId: 'prod_TZzMnU22Ntmp89',
    features: [
      'Everything in Pro Creator',
      'Priority publishing queue',
      'Monthly mentorship calls',
      'Early access to events',
      'Higher revenue share',
      'Exclusive Elite badge',
    ],
    limits: {
      styleboxes: 'unlimited',
      portfolioProjects: 'unlimited',
      canPublish: true,
      prioritySupport: true,
      mentorship: true,
      earlyAccess: true,
    },
  },
};

// Map product IDs to tier IDs
export const PRODUCT_TO_TIER: Record<string, SubscriptionTier> = {
  'prod_TZzLhzjouHHnzj': 'basic',
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
