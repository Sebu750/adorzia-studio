// Adorzia Marketplace Profit Calculation
// Ensures Adorzia recovers investment costs before splitting profit

/**
 * Markup multiplier for retail pricing
 * Retail Price = Production Cost × 2.3
 */
export const MARKUP_MULTIPLIER = 2.3;

export interface MarketplaceProfit {
  productionCost: number;
  retailPrice: number;
  totalProfit: number;
}

export interface ProfitSplit {
  designerPayout: number;
  adorziaPayout: number;
  commissionPercent: number;
}

export interface FullProfitBreakdown extends MarketplaceProfit, ProfitSplit {}

/**
 * Calculate marketplace profit from production cost
 */
export function calculateMarketplaceProfit(productionCost: number): MarketplaceProfit {
  const retailPrice = productionCost * MARKUP_MULTIPLIER;
  const totalProfit = retailPrice - productionCost;
  
  return {
    productionCost,
    retailPrice: Math.round(retailPrice * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
  };
}

/**
 * Calculate designer payout based on commission percentage
 */
export function calculateDesignerPayout(
  totalProfit: number,
  commissionPercent: number
): ProfitSplit {
  const designerPayout = totalProfit * (commissionPercent / 100);
  const adorziaPayout = totalProfit - designerPayout;
  
  return {
    designerPayout: Math.round(designerPayout * 100) / 100,
    adorziaPayout: Math.round(adorziaPayout * 100) / 100,
    commissionPercent,
  };
}

/**
 * Calculate full profit breakdown from production cost and commission
 */
export function calculateFullProfitBreakdown(
  productionCost: number,
  commissionPercent: number
): FullProfitBreakdown {
  const profit = calculateMarketplaceProfit(productionCost);
  const split = calculateDesignerPayout(profit.totalProfit, commissionPercent);
  
  return {
    ...profit,
    ...split,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Calculate retail price from production cost
 */
export function getRetailPrice(productionCost: number): number {
  return Math.round(productionCost * MARKUP_MULTIPLIER * 100) / 100;
}

/**
 * Calculate production cost from retail price (reverse)
 */
export function getProductionCost(retailPrice: number): number {
  return Math.round((retailPrice / MARKUP_MULTIPLIER) * 100) / 100;
}
