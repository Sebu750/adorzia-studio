// Adorzia Designer Rank System v2
// 2 Foundation Ranks (F1, F2) + 6 Standard Ranks
// Foundation ranks provide bonus percentage on top of standard rank profit share

export type RankTier = 
  | 'f1' 
  | 'f2' 
  | 'novice' 
  | 'apprentice' 
  | 'designer' 
  | 'senior' 
  | 'lead' 
  | 'elite';

export interface RankDefinition {
  id: RankTier;
  name: string;
  title: string;
  revenueShare: number;
  bonusPercentage: number; // Foundation bonus (+5% for F1, +10% for F2)
  minWeightedScore: number;
  minTimeInRankDays: number;
  description: string;
  requirements: string[];
  perks: string[];
  isFoundation: boolean;
  priceUsd?: number; // For foundation ranks
  maxSlots?: number; // For foundation ranks
  order: number;
}

export const RANKS: Record<RankTier, RankDefinition> = {
  f1: {
    id: 'f1',
    name: 'Founder Circle',
    title: 'F1',
    revenueShare: 50, // Max possible with F1 bonus on Elite
    bonusPercentage: 5,
    minWeightedScore: 0,
    minTimeInRankDays: 0,
    description: 'Exclusive founding members with lifetime premium benefits',
    requirements: ['One-time $299 payment', 'Limited to first 1,000 designers'],
    perks: [
      '+5% bonus on all revenue share',
      'Priority production queue',
      'Auto-publish pathway',
      'Founding badge',
      'Early access to new tools & StyleBoxes',
    ],
    isFoundation: true,
    priceUsd: 299,
    maxSlots: 1000,
    order: 0,
  },
  f2: {
    id: 'f2',
    name: 'Pioneer Designer',
    title: 'F2',
    revenueShare: 50, // Max possible with F2 bonus on Elite
    bonusPercentage: 10,
    minWeightedScore: 0,
    minTimeInRankDays: 0,
    description: 'Early adopters who shaped the platform',
    requirements: ['One-time $499 payment', 'Limited to first 500 designers'],
    perks: [
      '+10% bonus on all revenue share',
      'Priority support',
      'Faster sampling',
      'Early access to Academy modules',
      'Exclusive events access',
    ],
    isFoundation: true,
    priceUsd: 499,
    maxSlots: 500,
    order: 1,
  },
  novice: {
    id: 'novice',
    name: 'Novice',
    title: 'Rank 1',
    revenueShare: 10,
    bonusPercentage: 0,
    minWeightedScore: 30,
    minTimeInRankDays: 0,
    description: 'Entry-level designers; basic skill demonstration',
    requirements: [
      'Complete first StyleBox',
      'Weighted score ≥30',
    ],
    perks: [
      '10% base revenue share',
      'Access to Easy StyleBoxes',
      'Basic portfolio features',
    ],
    isFoundation: false,
    order: 2,
  },
  apprentice: {
    id: 'apprentice',
    name: 'Apprentice',
    title: 'Rank 2',
    revenueShare: 15,
    bonusPercentage: 0,
    minWeightedScore: 46.5,
    minTimeInRankDays: 30,
    description: 'Requires multiple Medium/Hard Styleboxes completed',
    requirements: [
      'Weighted score ≥46.5',
      'At least 30 days at Novice rank',
      'Multiple Medium/Hard Styleboxes',
    ],
    perks: [
      '15% base revenue share',
      'Access to Medium StyleBoxes',
      'Team collaboration unlocked',
    ],
    isFoundation: false,
    order: 3,
  },
  designer: {
    id: 'designer',
    name: 'Designer',
    title: 'Rank 3',
    revenueShare: 20,
    bonusPercentage: 0,
    minWeightedScore: 72.5,
    minTimeInRankDays: 60,
    description: 'Must show portfolio growth and consistent quality',
    requirements: [
      'Weighted score ≥72.5',
      'At least 60 days at Apprentice rank',
      'Consistent portfolio quality',
    ],
    perks: [
      '20% base revenue share',
      'Access to Hard StyleBoxes',
      'Featured in category listings',
    ],
    isFoundation: false,
    order: 4,
  },
  senior: {
    id: 'senior',
    name: 'Senior Designer',
    title: 'Rank 4',
    revenueShare: 28,
    bonusPercentage: 0,
    minWeightedScore: 108.75,
    minTimeInRankDays: 90,
    description: 'At least 1 publication + sustained selling performance',
    requirements: [
      'Weighted score ≥108.75',
      'At least 90 days at Designer rank',
      '≥1 marketplace publication',
      'Sustained selling performance',
    ],
    perks: [
      '28% base revenue share',
      'Homepage rotation visibility',
      'Access to Insane StyleBoxes',
    ],
    isFoundation: false,
    order: 5,
  },
  lead: {
    id: 'lead',
    name: 'Lead Designer',
    title: 'Rank 5',
    revenueShare: 34,
    bonusPercentage: 0,
    minWeightedScore: 145.5,
    minTimeInRankDays: 180,
    description: '≥2 publications + 1 year of consistent sales growth',
    requirements: [
      'Weighted score ≥145.5',
      'At least 180 days at Senior rank',
      '≥2 marketplace publications',
      '1 year consistent sales growth',
    ],
    perks: [
      '34% base revenue share',
      'Priority production',
      'Mentorship opportunities',
    ],
    isFoundation: false,
    order: 6,
  },
  elite: {
    id: 'elite',
    name: 'Elite Designer',
    title: 'Rank 6',
    revenueShare: 40,
    bonusPercentage: 0,
    minWeightedScore: 190.5,
    minTimeInRankDays: 365,
    description: '≥3 publications + 2+ years sustained high-quality performance',
    requirements: [
      'Weighted score ≥190.5',
      'At least 365 days at Lead rank',
      '≥3 marketplace publications',
      '2+ years sustained performance',
    ],
    perks: [
      '40% base revenue share (up to 50% with F2)',
      'Algorithm priority',
      'Priority launch access',
      'Exclusive events & opportunities',
    ],
    isFoundation: false,
    order: 7,
  },
};

export const RANK_ORDER: RankTier[] = [
  'f1', 'f2', 'novice', 'apprentice', 'designer', 'senior', 'lead', 'elite'
];

export const STANDARD_RANKS: RankTier[] = [
  'novice', 'apprentice', 'designer', 'senior', 'lead', 'elite'
];

export const FOUNDATION_RANKS: RankTier[] = ['f1', 'f2'];

export function getRankByOrder(order: number): RankDefinition | undefined {
  return Object.values(RANKS).find(r => r.order === order);
}

export function getNextRank(currentRank: RankTier): RankDefinition | undefined {
  const current = RANKS[currentRank];
  // Foundation ranks don't progress to standard ranks via this function
  if (current.isFoundation) return undefined;
  return getRankByOrder(current.order + 1);
}

export function getNextStandardRank(currentRank: RankTier): RankDefinition | undefined {
  const currentIndex = STANDARD_RANKS.indexOf(currentRank);
  if (currentIndex === -1 || currentIndex === STANDARD_RANKS.length - 1) return undefined;
  return RANKS[STANDARD_RANKS[currentIndex + 1]];
}

export function getRankProgress(
  currentRank: RankTier,
  currentScore: number,
  nextScoreThreshold: number
): number {
  const currentThreshold = RANKS[currentRank].minWeightedScore;
  const range = nextScoreThreshold - currentThreshold;
  if (range <= 0) return 100;
  const progress = ((currentScore - currentThreshold) / range) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
}

/**
 * Calculate effective revenue share including foundation bonus
 */
export function calculateEffectiveRevenueShare(
  standardRank: RankTier,
  foundationRank?: 'f1' | 'f2' | null
): number {
  const standardShare = RANKS[standardRank].revenueShare;
  if (!foundationRank) return standardShare;
  const bonus = RANKS[foundationRank].bonusPercentage;
  return Math.min(50, standardShare + bonus); // Cap at 50%
}

/**
 * Get rank from weighted score
 */
export function getRankFromScore(weightedScore: number): RankTier {
  // Check from highest to lowest
  const orderedRanks = [...STANDARD_RANKS].reverse();
  for (const rank of orderedRanks) {
    if (weightedScore >= RANKS[rank].minWeightedScore) {
      return rank;
    }
  }
  return 'novice';
}
