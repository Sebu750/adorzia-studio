// Adorzia Style Credits (SC) System
// SC is the primary scoring mechanism for designer progression

export type SCDifficulty = 'easy' | 'medium' | 'hard' | 'insane' | 'free';

export interface SCRange {
  min: number;
  max: number;
}

// SC Difficulty Ranges (random award on approval)
export const SC_DIFFICULTY_RANGES: Record<SCDifficulty, SCRange> = {
  free: { min: 5, max: 10 },
  easy: { min: 10, max: 20 },
  medium: { min: 20, max: 30 },
  hard: { min: 30, max: 50 },
  insane: { min: 50, max: 100 },
};

// Sold Out Bonus Range
export const SOLD_OUT_BONUS: SCRange = { min: 50, max: 500 };

// SC-based Rank Tiers
export type SCRankTier = 
  | 'f1' 
  | 'f2' 
  | 'apprentice' 
  | 'patternist' 
  | 'stylist' 
  | 'couturier' 
  | 'visionary' 
  | 'creative_director';

export interface SCRankThreshold {
  rank: SCRankTier;
  name: string;
  minSC: number;
  maxSC: number;
  commission: number;
  description: string;
  rankOrder: number;
}

// Rank thresholds based on SC
export const SC_RANK_THRESHOLDS: SCRankThreshold[] = [
  { 
    rank: 'apprentice', 
    name: 'Apprentice',
    minSC: 0, 
    maxSC: 300, 
    commission: 8,
    description: 'Learning the software and basic garment construction',
    rankOrder: 2
  },
  { 
    rank: 'patternist', 
    name: 'Patternist',
    minSC: 301, 
    maxSC: 800, 
    commission: 12,
    description: 'Able to handle Medium difficulty (Complex patterns)',
    rankOrder: 3
  },
  { 
    rank: 'stylist', 
    name: 'Stylist',
    minSC: 801, 
    maxSC: 2000, 
    commission: 18,
    description: 'Proven ability to handle Hard/Insane briefs',
    rankOrder: 4
  },
  { 
    rank: 'couturier', 
    name: 'Couturier',
    minSC: 2001, 
    maxSC: 3200, 
    commission: 25,
    description: 'Expert level; focus on luxury and high-detail designs',
    rankOrder: 5
  },
  { 
    rank: 'visionary', 
    name: 'Visionary',
    minSC: 3201, 
    maxSC: 5000, 
    commission: 32,
    description: 'Trend-setter; designs have high artistic value',
    rankOrder: 6
  },
  { 
    rank: 'creative_director', 
    name: 'Creative Director',
    minSC: 5001, 
    maxSC: Infinity, 
    commission: 40,
    description: 'The Master level; leading the Adorzia aesthetic',
    rankOrder: 7
  },
];

// Founder bonuses (applied on top of rank commission)
export const FOUNDER_BONUSES: Record<'f1' | 'f2', number> = {
  f1: 10,  // +10%
  f2: 5,   // +5%
};

/**
 * Get rank from Style Credits
 */
export function getRankFromSC(sc: number): SCRankThreshold {
  // Find the highest rank the SC qualifies for
  for (let i = SC_RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (sc >= SC_RANK_THRESHOLDS[i].minSC) {
      return SC_RANK_THRESHOLDS[i];
    }
  }
  return SC_RANK_THRESHOLDS[0]; // Default to Apprentice
}

/**
 * Get commission rate including founder bonus
 */
export function getCommissionRate(sc: number, founderRank?: 'f1' | 'f2' | null): number {
  const rank = getRankFromSC(sc);
  const baseCommission = rank.commission;
  const founderBonus = founderRank ? FOUNDER_BONUSES[founderRank] : 0;
  return Math.min(50, baseCommission + founderBonus); // Cap at 50%
}

/**
 * Get progress to next rank
 */
export function getProgressToNextRank(sc: number): {
  current: SCRankThreshold;
  next: SCRankThreshold | null;
  percent: number;
  scNeeded: number;
} {
  const current = getRankFromSC(sc);
  const currentIndex = SC_RANK_THRESHOLDS.findIndex(r => r.rank === current.rank);
  const next = currentIndex < SC_RANK_THRESHOLDS.length - 1 
    ? SC_RANK_THRESHOLDS[currentIndex + 1] 
    : null;

  if (!next) {
    return { current, next: null, percent: 100, scNeeded: 0 };
  }

  const rangeStart = current.minSC;
  const rangeEnd = next.minSC;
  const progressInRange = sc - rangeStart;
  const totalRange = rangeEnd - rangeStart;
  const percent = Math.min(100, Math.max(0, (progressInRange / totalRange) * 100));
  const scNeeded = next.minSC - sc;

  return { current, next, percent, scNeeded };
}

/**
 * Generate random SC award based on difficulty
 */
export function generateRandomSC(difficulty: SCDifficulty): number {
  const range = SC_DIFFICULTY_RANGES[difficulty] || SC_DIFFICULTY_RANGES.easy;
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

/**
 * Generate random sold out bonus
 */
export function generateSoldOutBonus(): number {
  return Math.floor(Math.random() * (SOLD_OUT_BONUS.max - SOLD_OUT_BONUS.min + 1)) + SOLD_OUT_BONUS.min;
}

/**
 * Get all ranks for display
 */
export function getAllRanks(): SCRankThreshold[] {
  return [...SC_RANK_THRESHOLDS];
}

/**
 * Format SC number with commas
 */
export function formatSC(sc: number): string {
  return sc.toLocaleString();
}
