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

// FAQ Categories
export type FAQCategory = 
  | 'general'
  | 'styleboxes'
  | 'ip-ranks'
  | 'teaming'
  | 'financials'
  | 'founders';

export interface FAQItem {
  question: string;
  answer: string;
  category: FAQCategory;
}

export const FAQ_CATEGORIES: Record<FAQCategory, { label: string; icon: string }> = {
  general: { label: 'General Concept', icon: 'HelpCircle' },
  styleboxes: { label: 'StyleBoxes & Challenges', icon: 'Box' },
  'ip-ranks': { label: 'IP, Ranks & Profit Sharing', icon: 'Crown' },
  teaming: { label: 'Teaming & Collaboration', icon: 'Users' },
  financials: { label: 'Financials & Career', icon: 'Wallet' },
  founders: { label: 'The Foundational Ranks', icon: 'Award' },
};

// Comprehensive Designer's FAQ
export const DESIGNER_FAQS: FAQItem[] = [
  // General Concept
  {
    category: 'general',
    question: 'Is Adorzia a design agency or a software company?',
    answer: 'Neither. Adorzia is a decentralized Fashion R&D Lab. We provide the infrastructure (briefs, assets, and technical constraints) for designers to solve high-level fashion challenges. Think of us as the "Intel" inside the fashion industry—we create the logic that brands then use to manufacture physical products.',
  },
  {
    category: 'general',
    question: 'Do I have to use specific software like CLO3D or Browzwear?',
    answer: 'No. Adorzia is tool-agnostic. Whether you use industry-standard tools, Blender, or custom-coded engines, we only care about the Final Result (the render) and your Proof of Logic (the technical exploded view and Hack Log).',
  },
  // StyleBoxes & Challenges
  {
    category: 'styleboxes',
    question: 'What is a "StyleBox"?',
    answer: 'A StyleBox is a technical mission briefing. It includes a trend direction, a standardized 3D avatar, fabric PBR maps, and a set of "Hard Constraints" (e.g., specific pattern limits or physics requirements). Your goal is to "hack" the brief to create the best variation.',
  },
  {
    category: 'styleboxes',
    question: 'What is the "Hack Log"?',
    answer: 'The Hack Log is a short text submission where you explain the technical math and logic behind your design. It\'s where you prove how you solved the challenge (e.g., "I used a double-bonded heat seal to handle the weight of the digital velvet"). This is often more important than the visual render.',
  },
  // IP, Ranks & Profit Sharing
  {
    category: 'ip-ranks',
    question: 'Who owns the Intellectual Property (IP) of my designs?',
    answer: 'It depends on the StyleBox type:\n\n• Seasonal/Core Briefs: You own the IP. If Adorzia chooses to manufacture your design, we pay you a royalty based on your rank.\n\n• Sponsored/Branded Briefs: The Sponsoring Brand owns the IP. In exchange, these boxes offer high Cash Bounties paid out immediately upon winning.',
  },
  {
    category: 'ip-ranks',
    question: 'How does the "Profit Share" system work?',
    answer: 'Adorzia rewards experience. Your base profit share starts at 8% (Apprentice) and increases as you Rank Up by earning Style Credits (SC):\n\n• Apprentice: 8%\n• Patternist: 12%\n• Stylist: 18%\n• Couturier: 25%\n• Visionary: 32%\n• Creative Director: 40%\n\nFounder bonuses stack on top: F2 Pioneer adds +5% (max 45%), F1 Founding Legacy adds +10% (max 50% platform cap).',
  },
  // Teaming & Collaboration
  {
    category: 'teaming',
    question: 'Can I work with other designers on a StyleBox?',
    answer: 'Yes! We encourage Teaming. You can form a "House" (team) with specialists—for example, one Pattern Architect, one Material Alchemist, and one Creative Lead. Teams receive a +15% Synergy Bonus on all SC earned.',
  },
  {
    category: 'teaming',
    question: 'How do we split the rewards if we work in a team?',
    answer: 'The SC and profit share are split equally among tagged members, or according to the "Team Contract" set by the Lead Designer. Every member\'s individual rank will progress based on their contribution.',
  },
  // Financials & Career
  {
    category: 'financials',
    question: 'What are Style Credits (SC), and can I cash them out?',
    answer: 'SC is your Reputation Currency. It cannot be cashed out directly, but it is the only way to unlock higher Profit Share tiers and access to "Insane" difficulty StyleBoxes with larger cash bounties.',
  },
  {
    category: 'financials',
    question: 'How do I get paid?',
    answer: 'Payouts are triggered in two ways:\n\n• Winning a Bounty: Immediate payment for Sponsored StyleBoxes.\n\n• Marketplace Sales: Quarterly royalty payouts for any of your designs that Adorzia produces and sells.',
  },
  // Foundational Ranks
  {
    category: 'founders',
    question: 'Why should I pay PKR 50,000 for an F1 "Founding Legacy" rank?',
    answer: 'The F1 and F2 ranks are limited-edition "Stakeholder" positions:\n\n• F1 — Founding Legacy (PKR 50,000): Permanent +10% profit bonus for life, "Founding Legacy" Gold Badge, first-in-line production queue, only 50 slots available.\n\n• F2 — The Pioneer (PKR 25,000): Permanent +5% profit bonus, "Pioneer" Silver Badge, priority queue access, 100 slots available.\n\nThese give you higher visibility in the Discover directory and guaranteed production priority.',
  },
  {
    category: 'founders',
    question: 'Can I upgrade from Free to F1 later?',
    answer: 'Only if slots are remaining. There are strictly 50 F1 Founding Legacy slots. Once they are sold out, they will never be created again.',
  },
  {
    category: 'founders',
    question: "What's the difference between F1 and F2?",
    answer: 'F1 gives you +10% lifetime bonus, gold badge, and first-in-line production. F2 gives you +5% lifetime bonus, silver badge, and priority queue access. F1 is for serious professionals who want maximum earnings.',
  },
  {
    category: 'founders',
    question: 'Do I need a subscription AND a founder title?',
    answer: 'The subscription (when launched) gives you ACCESS to tools and challenges. The founder title gives you PROFITABILITY through permanent bonus commission. Serious designers will want both.',
  },
  {
    category: 'founders',
    question: 'Is the founder payment refundable?',
    answer: 'No. The F1/F2 fee is a license purchase that immediately unlocks digital assets, higher access levels, and permanent account upgrades. All sales are final.',
  },
  {
    category: 'founders',
    question: 'How do I pay?',
    answer: 'We accept Credit/Debit Cards and Bank Transfers. All prices are in PKR (Pakistani Rupee). Contact hello@adorzia.com for bank transfer details.',
  },
];

// Legacy export for backwards compatibility
export const PRICING_FAQS = DESIGNER_FAQS.filter(faq => faq.category === 'founders');
