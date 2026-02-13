// Sovereign Atelier - The Legacy Collection Team Challenge

import type { TeamRole } from './team-challenges';

export const SOVEREIGN_ATELIER_ROLES: TeamRole[] = [
  {
    role_id: 'master_cutter',
    role_name: 'Master Cutter (Pattern & Silhouette)',
    requirements: [
      'Pattern accuracy with grain respect',
      'Drape simulation for fabric types',
      'Internal architecture modeling',
      'Realistic tension creases'
    ],
    deliverables: [
      '14-panel Jamawar lehenga pattern',
      'Drape properties distinguishing silk stiffness vs flow',
      'Patti (hem-border) reinforcement',
      'Stay-stitched armholes',
      'Tension creases at bust and waist'
    ],
    badge: {
      name: 'Golden Scissors',
      icon: '✂️',
      meaning: 'Your patterns are production-ready.'
    }
  },
  {
    role_id: 'artisan_weaver',
    role_name: 'Artisan Weaver (Textile & Surface)',
    requirements: [
      'Zardozi stack layering technique',
      'Sheen variance simulation',
      'Transparency and moiré management'
    ],
    deliverables: [
      'Gold thread-work (Dabka) layer',
      'Sequins (Sitara) placement',
      'Stone embellishments',
      'Sheen variance showing hand-touch',
      'Double-tone net Dupatta with moiré control'
    ],
    badge: {
      name: 'Needle-Master',
      icon: '🧵',
      meaning: 'Your embroidery looks 100% hand-touched.'
    }
  },
  {
    role_id: 'draping_specialist',
    role_name: 'Draping Specialist (Styling & Flow)',
    requirements: [
      'Multi-point draping technique',
      'Collision physics for jewelry',
      'Motion inertia simulation'
    ],
    deliverables: [
      'Signature multi-point Dupatta drape',
      'Jewelry collision with fabric indent',
      'Delayed swing physics for heavy hem',
      'Nath (nose ring) chain draping'
    ],
    badge: {
      name: 'Sultan of Sway',
      icon: '💫',
      meaning: 'Your fabric physics are poetic.'
    }
  },
  {
    role_id: 'creative_director',
    role_name: 'Creative Director (Merchandising & Presentation)',
    requirements: [
      'Heritage narrative development',
      'Quality control expertise',
      'Market positioning analysis'
    ],
    deliverables: [
      'Collection Moodbook with motif explanation',
      'QC review of all seams and finishes',
      'Man-hours production estimate',
      'Era and cultural context documentation'
    ],
    badge: {
      name: 'Couture Visionary',
      icon: '👁️',
      meaning: 'Your brand storytelling is world-class.'
    }
  }
];

export const SOVEREIGN_ATELIER_EVALUATION = [
  { 
    name: 'Seam Alignment', 
    weight: 20, 
    description: 'Embroidery motifs must align at under-arm and side seams' 
  },
  { 
    name: 'Lining Logic', 
    weight: 15, 
    description: 'Correct lining color and ease without pulling outer fabric' 
  },
  { 
    name: 'Jewelry Interaction', 
    weight: 15, 
    description: 'Nath chain drapes realistically across cheek without clipping' 
  },
  { 
    name: 'Movement Soul', 
    weight: 25, 
    description: 'Does it move like a $15,000 bridal ensemble?' 
  },
  { 
    name: 'Color Harmony', 
    weight: 15, 
    description: 'Do colors bleed together like real silk dyes?' 
  },
  { 
    name: 'Jewelry Integration', 
    weight: 10, 
    description: 'Does jewelry feel like an extension of the woman?' 
  }
];

export const SOVEREIGN_ATELIER_FAIL_POINTS = [
  'Seam Stress: Motifs don\'t align at seams',
  'Lining Logic: Wrong color or insufficient ease',
  'Jewelry Clipping: Nath chain clips through skin or veil',
  'Plastic Look: Fabric lacks realistic tension creases',
  'Missing Hand-Touch: Embroidery lacks sheen variance'
];

export const SOVEREIGN_ATELIER_CHALLENGE = {
  title: "Session 1000 | The Legacy Collection: 1:1 Couture Masterpiece",
  studio_name: 'sovereign-atelier',
  client_name: 'Royal Atelier',
  category: 'fashion' as const,
  difficulty: 'insane' as const,
  is_team_challenge: true,
  team_size: 4,
  minimum_team_rank_order: 4, // Stylist rank
  time_limit_hours: 168, // 7 days
  xp_reward: 100,
  target_role: 'Senior Fashion Designer Team',
  description: `As a team of 4 Senior Designers, you are tasked with creating the "Inaugural Royal Ensemble." This isn't just a 3D model; it is a digital garment that must be "sewn" exactly as it would be in a high-end Lahore atelier. You must respect the grain of the silk, the weight of the hand-work, and the delicate balance of a bridal silhouette.`,
  scenario: {
    context: 'Royal Atelier Couture House',
    challenge: 'Create a museum-quality digital bridal ensemble',
    goal: 'Demonstrate mastery of couture construction in digital form'
  },
  team_role_requirements: SOVEREIGN_ATELIER_ROLES,
  evaluation_criteria: SOVEREIGN_ATELIER_EVALUATION,
  constraints: [
    'All team members must be Stylist rank (801+ SC) or higher',
    'Each role must be assigned to a different team member',
    'All deliverables must be submitted within 168 hours',
    'Team Lead must approve final submission'
  ],
  detailed_deliverables: [
    {
      category: 'Pattern & Structure',
      items: ['14-panel lehenga pattern', 'Choli with internal architecture', 'Stay-stitched armholes']
    },
    {
      category: 'Surface & Texture',
      items: ['Zardozi stack (Dabka + Sitara + Stones)', 'Sheen variance map', 'Double-tone net Dupatta']
    },
    {
      category: 'Styling & Physics',
      items: ['Multi-point Dupatta drape', 'Jewelry collision maps', 'Heavy hem swing physics']
    },
    {
      category: 'Presentation',
      items: ['Heritage Moodbook', 'QC Report', 'Man-hours estimate', 'Cultural context document']
    }
  ]
};
