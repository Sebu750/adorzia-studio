// Adorzia Designer Rank System v3 - SC-based

export type RankTier = 'f1' | 'f2' | 'apprentice' | 'patternist' | 'stylist' | 'couturier' | 'visionary' | 'creative_director';

export interface RankDefinition {
  id: RankTier;
  name: string;
  title: string;
  commission: number;
  revenueShare: number;
  bonusPercentage: number;
  minSC: number;
  maxSC: number;
  minWeightedScore: number;
  description: string;
  requirements: string[];
  perks: string[];
  isFoundation: boolean;
  priceUsd?: number;
  maxSlots?: number;
  order: number;
}

const createRank = (id: RankTier, name: string, title: string, commission: number, bonus: number, minSC: number, maxSC: number, desc: string, reqs: string[], perks: string[], isFoundation: boolean, order: number, priceUsd?: number, maxSlots?: number): RankDefinition => ({
  id, name, title, commission, revenueShare: commission, bonusPercentage: bonus, minSC, maxSC, minWeightedScore: minSC, description: desc, requirements: reqs, perks, isFoundation, order, priceUsd, maxSlots
});

export const RANKS: Record<RankTier, RankDefinition> = {
  f1: createRank('f1', 'Founder Circle', 'F1', 10, 10, 0, Infinity, 'Exclusive founding members with +10% lifetime commission bonus', ['One-time $299 payment', 'Limited to first 1,000 designers'], ['+10% bonus on all commissions', 'Priority production queue', 'Founding badge'], true, 0, 299, 1000),
  f2: createRank('f2', 'Pioneer Designer', 'F2', 5, 5, 0, Infinity, 'Pioneer designers with +5% lifetime commission bonus', ['One-time $499 payment', 'Limited to first 500 designers'], ['+5% bonus on all commissions', 'Priority support', 'Early access'], true, 1, 499, 500),
  apprentice: createRank('apprentice', 'Apprentice', 'SC 0-300', 8, 0, 0, 300, 'Learning the software and basic garment construction', ['SC Range: 0-300'], ['8% base commission', 'Access to Free & Easy StyleBoxes'], false, 2),
  patternist: createRank('patternist', 'Patternist', 'SC 301-800', 12, 0, 301, 800, 'Able to handle Medium difficulty (Complex patterns)', ['SC Range: 301-800'], ['12% base commission', 'Access to Medium StyleBoxes'], false, 3),
  stylist: createRank('stylist', 'Stylist', 'SC 801-2,000', 18, 0, 801, 2000, 'Proven ability to handle Hard/Insane briefs', ['SC Range: 801-2,000'], ['18% base commission', 'Access to Hard StyleBoxes'], false, 4),
  couturier: createRank('couturier', 'Couturier', 'SC 2,001-3,200', 25, 0, 2001, 3200, 'Expert level; focus on luxury and high-detail designs', ['SC Range: 2,001-3,200'], ['25% base commission', 'Priority production queue'], false, 5),
  visionary: createRank('visionary', 'Visionary', 'SC 3,201-5,000', 32, 0, 3201, 5000, 'Trend-setter; designs have high artistic value', ['SC Range: 3,201-5,000'], ['32% base commission', 'Algorithm priority'], false, 6),
  creative_director: createRank('creative_director', 'Creative Director', 'SC 5,000+', 40, 0, 5001, Infinity, 'The Master level; leading the Adorzia aesthetic', ['SC Range: 5,000+'], ['40% base commission (up to 50% with F1)'], false, 7),
};

export const RANK_ORDER: RankTier[] = ['f1', 'f2', 'apprentice', 'patternist', 'stylist', 'couturier', 'visionary', 'creative_director'];
export const STANDARD_RANKS: RankTier[] = ['apprentice', 'patternist', 'stylist', 'couturier', 'visionary', 'creative_director'];
export const FOUNDATION_RANKS: RankTier[] = ['f1', 'f2'];

export function getRankByOrder(order: number): RankDefinition | undefined {
  return Object.values(RANKS).find(r => r.order === order);
}

export function getNextRank(currentRank: RankTier): RankDefinition | undefined {
  const current = RANKS[currentRank];
  if (current.isFoundation) return undefined;
  return getRankByOrder(current.order + 1);
}

export function getNextStandardRank(currentRank: RankTier): RankDefinition | undefined {
  const currentIndex = STANDARD_RANKS.indexOf(currentRank);
  if (currentIndex === -1 || currentIndex === STANDARD_RANKS.length - 1) return undefined;
  return RANKS[STANDARD_RANKS[currentIndex + 1]];
}

export function getRankFromSC(sc: number): RankTier {
  const orderedRanks = [...STANDARD_RANKS].reverse();
  for (const rank of orderedRanks) {
    if (sc >= RANKS[rank].minSC) return rank;
  }
  return 'apprentice';
}

export function getRankProgress(currentRank: RankTier, currentSC: number): number {
  const current = RANKS[currentRank];
  if (current.isFoundation) return 100;
  const next = getNextStandardRank(currentRank);
  if (!next) return 100;
  const range = next.minSC - current.minSC;
  if (range <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round(((currentSC - current.minSC) / range) * 100)));
}

export function calculateEffectiveCommission(standardRank: RankTier, foundationRank?: 'f1' | 'f2' | null): number {
  const standardCommission = RANKS[standardRank].commission;
  if (!foundationRank) return standardCommission;
  return Math.min(50, standardCommission + RANKS[foundationRank].bonusPercentage);
}

export const calculateEffectiveRevenueShare = calculateEffectiveCommission;
export function formatSC(sc: number): string { return sc.toLocaleString(); }
export function getSCNeededForNextRank(currentRank: RankTier, currentSC: number): number {
  const next = getNextStandardRank(currentRank);
  return next ? Math.max(0, next.minSC - currentSC) : 0;
}
