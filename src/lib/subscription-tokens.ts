// Adorzia Subscription Token System
// Tokens are earned via subscription and used for marketplace submissions

export type SubscriptionPlan = 'basic' | 'premium';

export interface TokenGrant {
  requestTokens: number;
  styleboxTokens: number;
  uploadTokens: number;
  monthlyPrice: number;
}

/**
 * Subscription token grants per plan
 */
export const SUBSCRIPTION_TOKEN_GRANTS: Record<SubscriptionPlan, TokenGrant> = {
  basic: {
    requestTokens: 1,
    styleboxTokens: 0,
    uploadTokens: 0,
    monthlyPrice: 15,
  },
  premium: {
    requestTokens: 0,
    styleboxTokens: 3,
    uploadTokens: 1,
    monthlyPrice: 40,
  },
};

/**
 * Get token grant for a subscription plan
 */
export function getTokenGrant(plan: SubscriptionPlan): TokenGrant {
  return SUBSCRIPTION_TOKEN_GRANTS[plan];
}

/**
 * Check if user has enough stylebox tokens
 */
export function hasStyleboxTokens(currentTokens: number): boolean {
  return currentTokens > 0;
}

/**
 * Check if user has enough upload tokens
 */
export function hasUploadTokens(currentTokens: number): boolean {
  return currentTokens > 0;
}

/**
 * Check if user has enough request tokens
 */
export function hasRequestTokens(currentTokens: number): boolean {
  return currentTokens > 0;
}

/**
 * Calculate remaining tokens after consumption
 */
export function consumeToken(currentTokens: number, amount: number = 1): number {
  return Math.max(0, currentTokens - amount);
}

/**
 * Get plan from price ID (Stripe integration)
 * This should be updated with actual Stripe price IDs
 */
export function getPlanFromPriceId(priceId: string): SubscriptionPlan | null {
  const PRICE_TO_PLAN: Record<string, SubscriptionPlan> = {
    // Add your Stripe price IDs here
    // 'price_basic_monthly': 'basic',
    // 'price_premium_monthly': 'premium',
  };
  
  return PRICE_TO_PLAN[priceId] || null;
}

/**
 * Format token display
 */
export function formatTokenCount(count: number, type: 'stylebox' | 'upload' | 'request'): string {
  const labels = {
    stylebox: 'StyleBox Token',
    upload: 'Upload Token',
    request: 'Request Token',
  };
  
  const label = labels[type];
  return `${count} ${label}${count !== 1 ? 's' : ''}`;
}

/**
 * Check if tokens should be reset (first of month)
 */
export function shouldResetTokens(lastResetDate: Date): boolean {
  const now = new Date();
  const lastReset = new Date(lastResetDate);
  
  // Reset if we're in a different month
  return now.getMonth() !== lastReset.getMonth() || 
         now.getFullYear() !== lastReset.getFullYear();
}

/**
 * Get next reset date (first of next month)
 */
export function getNextResetDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

/**
 * Calculate days until next reset
 */
export function getDaysUntilReset(): number {
  const now = new Date();
  const nextReset = getNextResetDate();
  const diffTime = nextReset.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
