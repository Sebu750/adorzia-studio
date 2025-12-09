// Adorzia Designer Rank System
// 2 Foundation Ranks (F1, F2) + 6 Standard Ranks

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
  description: string;
  requirements: string[];
  perks: string[];
  isFoundation: boolean;
  order: number;
}

export const RANKS: Record<RankTier, RankDefinition> = {
  f1: {
    id: 'f1',
    name: 'Founder Circle',
    title: 'F1',
    revenueShare: 50,
    description: 'Exclusive founding members with lifetime premium benefits',
    requirements: ['Early platform joiner (first 500 signups)'],
    perks: [
      '50% revenue share (lifetime)',
      'Priority production queue',
      'Auto-publish pathway',
      'Founding badge',
      'Early access to new tools & StyleBoxes',
    ],
    isFoundation: true,
    order: 0,
  },
  f2: {
    id: 'f2',
    name: 'Pioneer Designer',
    title: 'F2',
    revenueShare: 45,
    description: 'Early adopters who shaped the platform',
    requirements: ['Early platform joiner (first 1,000 signups)'],
    perks: [
      '45% revenue share',
      'Priority support',
      'Faster sampling',
      'Early access to Academy modules',
    ],
    isFoundation: true,
    order: 1,
  },
  novice: {
    id: 'novice',
    name: 'Novice',
    title: 'Rank 1',
    revenueShare: 20,
    description: 'Beginning your creative journey',
    requirements: [
      'Complete first StyleBox',
      '1 approved portfolio project',
    ],
    perks: [
      '20% revenue share',
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
    revenueShare: 25,
    description: 'Developing your unique style',
    requirements: [
      'Complete 3 StyleBoxes',
      '1 published marketplace item',
    ],
    perks: [
      '25% revenue share',
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
    revenueShare: 30,
    description: 'Established creative with growing portfolio',
    requirements: [
      '5 published marketplace items',
      'OR Styleathon top 30%',
    ],
    perks: [
      '30% revenue share',
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
    revenueShare: 35,
    description: 'Proven track record with consistent quality',
    requirements: [
      '$1,000+ marketplace sales',
      'OR Styleathon top 10%',
    ],
    perks: [
      '35% revenue share',
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
    revenueShare: 40,
    description: 'Industry-level expertise and reliability',
    requirements: [
      '$5,000+ marketplace sales',
      'Zero QC failures',
    ],
    perks: [
      '40% revenue share',
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
    revenueShare: 50,
    description: 'Top-tier creative with exceptional performance',
    requirements: [
      '$10,000+ marketplace sales',
      'OR repeated Styleathon wins',
    ],
    perks: [
      '50% revenue share',
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

export function getRankByOrder(order: number): RankDefinition | undefined {
  return Object.values(RANKS).find(r => r.order === order);
}

export function getNextRank(currentRank: RankTier): RankDefinition | undefined {
  const current = RANKS[currentRank];
  // Foundation ranks don't progress to standard ranks
  if (current.isFoundation) return undefined;
  return getRankByOrder(current.order + 1);
}

export function getRankProgress(
  currentRank: RankTier,
  xp: number,
  xpToNext: number
): number {
  return Math.min(100, Math.round((xp / xpToNext) * 100));
}
