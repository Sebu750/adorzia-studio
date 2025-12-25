// Founder Tiers Configuration for Adorzia Platform
// One-time lifetime license purchases with permanent profit share bonuses
// F1 = Founding Legacy (50k, +10%), F2 = The Pioneer (25k, +5%)

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
  badge: string | null;
  badgeColor: 'gold' | 'silver' | null;
  ctaText: string;
  highlighted: boolean;
  highlightLabel?: string;
  perks: string[];
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
      'Scales up to 40% with skill',
      'Access to community features',
      'Basic portfolio tools',
    ],
    badge: null,
    badgeColor: null,
    ctaText: 'Join for Free',
    highlighted: false,
    perks: [
      'Publishing: Standard Lottery System',
      'StyleBox: Easy Level Only',
      'Manufacturing: Limited Slots',
    ],
  },
  f2: {
    id: 'f2',
    name: 'F2 — The Pioneer',
    subtitle: 'Early Supporter',
    targetAudience: 'Designers building a side income',
    price: 25000,
    priceFormatted: 'PKR 25,000',
    isOneTime: true,
    maxSlots: 100,
    lifetimeBonus: 5,
    startingShare: 13,
    features: [
      '+5% Lifetime Profit Bonus on every sale',
      'Starting share: 13% (5% boost over free)',
      'Unlock Medium & Hard StyleBoxes',
      'Access to founder community',
      '"Pioneer" Silver Badge on profile',
    ],
    badge: 'Pioneer',
    badgeColor: 'silver',
    ctaText: 'Become a Pioneer',
    highlighted: false,
    perks: [
      'Publishing: Priority Queue',
      'StyleBox: Unlocks Medium & Hard Levels',
      'Private Discord/WhatsApp access',
    ],
  },
  f1: {
    id: 'f1',
    name: 'F1 — Founding Legacy',
    subtitle: 'Industry Leader',
    targetAudience: 'Professionals & Brands ready to lead',
    price: 50000,
    priceFormatted: 'PKR 50,000',
    isOneTime: true,
    maxSlots: 50,
    lifetimeBonus: 10,
    startingShare: 18,
    features: [
      '+10% Lifetime Profit Bonus on every sale',
      'Starting share: 18% (2x+ the free rate)',
      'Can earn up to 50% Profit Share (Platform Max)',
      'All StyleBox levels including Team Challenges',
      '"Founding Legacy" Gold Badge (Verified)',
      'First-in-Line Production Queue',
    ],
    badge: 'Founding Legacy',
    badgeColor: 'gold',
    ctaText: 'Secure F1 Rank',
    highlighted: true,
    highlightLabel: 'Best Value',
    perks: [
      'Publishing: TOP PRIORITY (First Review)',
      'StyleBox: All Levels (Including Team)',
      'Manufacturing: Guaranteed Slots',
    ],
  },
};

// Earning ladder showing profit share progression with new rank names
export interface EarningTier {
  rank: string;
  scRange: string;
  baseShare: number; // Free user share
  f2Share: number;   // With F2 bonus (+5%)
  f1Share: number;   // With F1 bonus (+10%)
}

export const EARNING_LADDER: EarningTier[] = [
  { rank: 'Apprentice', scRange: '0-300', baseShare: 8, f2Share: 13, f1Share: 18 },
  { rank: 'Patternist', scRange: '301-800', baseShare: 12, f2Share: 17, f1Share: 22 },
  { rank: 'Stylist', scRange: '801-2,000', baseShare: 18, f2Share: 23, f1Share: 28 },
  { rank: 'Couturier', scRange: '2,001-3,200', baseShare: 25, f2Share: 30, f1Share: 35 },
  { rank: 'Visionary', scRange: '3,201-5,000', baseShare: 32, f2Share: 37, f1Share: 42 },
  { rank: 'Creative Director', scRange: '5,000+', baseShare: 40, f2Share: 45, f1Share: 50 },
];

// FAQ content for pricing page
export interface FAQ {
  question: string;
  answer: string;
}

export const PRICING_FAQS: FAQ[] = [
  {
    question: 'Can I upgrade from Free to F1 later?',
    answer: 'Only if slots are remaining. There are strictly 50 F1 Founding Legacy slots. Once they are sold out, they will never be created again.',
  },
  {
    question: 'What\'s the difference between F1 and F2?',
    answer: 'F1 gives you +10% lifetime bonus, gold badge, and first-in-line production. F2 gives you +5% lifetime bonus, silver badge, and priority queue access. F1 is for serious professionals who want maximum earnings.',
  },
  {
    question: 'Do I need a subscription AND a founder title?',
    answer: 'The subscription (when launched) gives you ACCESS to tools and challenges. The founder title gives you PROFITABILITY through permanent bonus commission. Serious designers will want both.',
  },
  {
    question: 'What does "First-in-Line Production" mean?',
    answer: 'We have limited manufacturing capacity per season. F1 members\' designs are reviewed and sent to the factory first, before anyone else. This guarantees your designs get produced.',
  },
  {
    question: 'Is the founder payment refundable?',
    answer: 'No. The F1/F2 fee is a license purchase that immediately unlocks digital assets, higher access levels, and permanent account upgrades. All sales are final.',
  },
  {
    question: 'When will subscriptions launch?',
    answer: 'Monthly subscriptions (Cadet, Pro Artisan, Elite Studio) are coming soon. Current founder purchases lock in your lifetime bonus before subscriptions go live.',
  },
  {
    question: 'How do I pay?',
    answer: 'We accept Credit/Debit Cards and Bank Transfers. All prices are in PKR (Pakistani Rupee). Contact hello@adorzia.com for bank transfer details.',
  },
];
