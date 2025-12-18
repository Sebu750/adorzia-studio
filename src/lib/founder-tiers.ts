// Founder Tiers Configuration for Adorzia Platform
// One-time lifetime license purchases with permanent profit share bonuses

export interface FounderTier {
  id: 'standard' | 'f1' | 'f2';
  name: string;
  subtitle: string;
  targetAudience: string;
  price: number; // PKR
  priceFormatted: string;
  isOneTime: boolean;
  maxSlots: number | null; // null = unlimited
  lifetimeBonus: number; // percentage bonus added to base rank share
  startingShare: number; // base + bonus for new users
  features: string[];
  publishingPriority: string;
  styleboxAccess: string;
  manufacturingAccess: string;
  badge: string | null;
  ctaText: string;
  highlighted: boolean;
  highlightLabel?: string;
}

export const FOUNDER_TIERS: Record<string, FounderTier> = {
  standard: {
    id: 'standard',
    name: 'Standard',
    subtitle: 'Start Your Journey',
    targetAudience: 'Aspiring Designers & Students',
    price: 0,
    priceFormatted: 'FREE',
    isOneTime: false,
    maxSlots: null,
    lifetimeBonus: 0,
    startingShare: 8,
    features: [
      'Base Profit Share starts at 8%',
      'Scales up to 40% with XP',
      'Access to community features',
      'Basic portfolio tools',
    ],
    publishingPriority: 'Standard (Lottery System)',
    styleboxAccess: 'Level 1 (Easy) Only',
    manufacturingAccess: 'Limited Slots',
    badge: null,
    ctaText: 'Join for Free',
    highlighted: false,
  },
  f1: {
    id: 'f1',
    name: 'F1 — Founder Circle',
    subtitle: 'Early Supporter',
    targetAudience: 'Serious Designers building a side income',
    price: 25000,
    priceFormatted: 'PKR 25,000',
    isOneTime: true,
    maxSlots: 1000,
    lifetimeBonus: 5,
    startingShare: 13,
    features: [
      '+5% Lifetime Profit Bonus on every sale',
      'Starting share: 13% (5% boost over free)',
      'Unlock Medium & Hard StyleBoxes',
      'Priority manufacturing queue',
      '"Founder Circle" Profile Badge',
    ],
    publishingPriority: 'High Priority Queue',
    styleboxAccess: 'Unlocks Medium & Hard Levels',
    manufacturingAccess: 'Priority Access',
    badge: 'Founder Circle',
    ctaText: 'Secure F1 Rank',
    highlighted: false,
  },
  f2: {
    id: 'f2',
    name: 'F2 — Pioneer Designer',
    subtitle: 'Industry Leader',
    targetAudience: 'Professionals & Brands ready to lead',
    price: 50000,
    priceFormatted: 'PKR 50,000',
    isOneTime: true,
    maxSlots: 500,
    lifetimeBonus: 10,
    startingShare: 18,
    features: [
      '+10% Lifetime Profit Bonus on every sale',
      'Starting share: 18% (more than 2x free rate)',
      'Can earn up to 50% Profit Share (Platform Max)',
      'All StyleBox levels including Team Challenges',
      'Guaranteed First Review (TOP PRIORITY)',
      'Gold "Pioneer" Profile Badge',
    ],
    publishingPriority: 'TOP PRIORITY (Guaranteed First Review)',
    styleboxAccess: 'All Levels (Including Squad/Team Challenges)',
    manufacturingAccess: 'Guaranteed Slots',
    badge: 'Pioneer',
    ctaText: 'Become a Pioneer',
    highlighted: true,
    highlightLabel: 'Best Value',
  },
};

// Earning ladder showing profit share progression
export interface EarningTier {
  rank: string;
  baseShare: number; // Free user share
  f1Share: number;   // With F1 bonus
  f2Share: number;   // With F2 bonus
}

export const EARNING_LADDER: EarningTier[] = [
  { rank: 'New User', baseShare: 8, f1Share: 13, f2Share: 18 },
  { rank: 'Novice', baseShare: 10, f1Share: 15, f2Share: 20 },
  { rank: 'Apprentice', baseShare: 15, f1Share: 20, f2Share: 25 },
  { rank: 'Designer', baseShare: 20, f1Share: 25, f2Share: 30 },
  { rank: 'Senior', baseShare: 28, f1Share: 33, f2Share: 38 },
  { rank: 'Lead', baseShare: 34, f1Share: 39, f2Share: 44 },
  { rank: 'Elite', baseShare: 40, f1Share: 45, f2Share: 50 },
];

// FAQ content for pricing page
export interface FAQ {
  question: string;
  answer: string;
}

export const PRICING_FAQS: FAQ[] = [
  {
    question: 'Can I upgrade from Free to F2 later?',
    answer: 'Only if slots are remaining. There are strictly 500 F2 Pioneer slots. Once they are sold out, they will never be created again.',
  },
  {
    question: 'What does "Publishing Priority" mean?',
    answer: 'We have limited manufacturing capacity per season. F2 Projects are reviewed and sent to the factory first. F1 Projects are reviewed second. Free Projects enter a lottery system (approx. 3-4 slots per batch). If you want a guaranteed launch for your brand, F2 is the best path.',
  },
  {
    question: 'Is the cost refundable?',
    answer: 'No. The F1/F2 fee is a license purchase that immediately unlocks digital assets, higher access levels, and permanent account upgrades.',
  },
  {
    question: 'How do I pay?',
    answer: 'We accept Credit/Debit Cards and Bank Transfers. Prices are listed in PKR.',
  },
  {
    question: 'What happens when subscriptions launch?',
    answer: 'When we introduce the monthly Studio Subscription in the future, F1 and F2 members will still need to subscribe to access the tools, BUT you retain your Lifetime Profit Boost (+5% / +10%) forever. Future users will pay the subscription without getting the bonus profit margins.',
  },
];
