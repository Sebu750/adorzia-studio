// Adorzia Designer Scoring System
// Weighted Score = 30% Stylebox + 35% Portfolio + 15% Publications + 20% Selling

export type StyleboxDifficulty = 'free' | 'easy' | 'medium' | 'hard' | 'insane';

// Difficulty base points
export const DIFFICULTY_POINTS: Record<StyleboxDifficulty, number> = {
  free: 5,
  easy: 10,
  medium: 25,
  hard: 50,
  insane: 100,
};

// Quality multipliers based on average score percentage
export const QUALITY_MULTIPLIERS: { min: number; max: number; multiplier: number }[] = [
  { min: 0, max: 69, multiplier: 0.5 },
  { min: 70, max: 79, multiplier: 0.7 },
  { min: 80, max: 89, multiplier: 0.85 },
  { min: 90, max: 94, multiplier: 1.0 },
  { min: 95, max: 100, multiplier: 1.1 },
];

// Timeliness bonus/penalty
export const TIMELINESS_BONUS = {
  early: 0.05,  // +5% if completed before deadline
  onTime: 0,     // No adjustment
  late: -0.05,   // -5% if late
};

// Evaluation criteria weights by difficulty
export const EVALUATION_WEIGHTS: Record<StyleboxDifficulty, {
  trendAlignment: number;
  creativeInnovation: number;
  technicalExecution: number;
  craftsmanship: number;
}> = {
  free: {
    trendAlignment: 50,
    creativeInnovation: 30,
    technicalExecution: 10,
    craftsmanship: 10,
  },
  easy: {
    trendAlignment: 50,
    creativeInnovation: 30,
    technicalExecution: 10,
    craftsmanship: 10,
  },
  medium: {
    trendAlignment: 40,
    creativeInnovation: 35,
    technicalExecution: 15,
    craftsmanship: 10,
  },
  hard: {
    trendAlignment: 30,
    creativeInnovation: 40,
    technicalExecution: 20,
    craftsmanship: 10,
  },
  insane: {
    trendAlignment: 20,
    creativeInnovation: 50,
    technicalExecution: 20,
    craftsmanship: 10,
  },
};

// Score component weights
export const SCORE_WEIGHTS = {
  stylebox: 0.30,
  portfolio: 0.35,
  publication: 0.15,
  selling: 0.20,
};

export interface EvaluationScores {
  trendAlignment: number; // 0-100
  creativeInnovation: number; // 0-100
  technicalExecution: number; // 0-100
  craftsmanship: number; // 0-100
}

export interface StyleboxScoreInput {
  difficulty: StyleboxDifficulty;
  evaluationScores: EvaluationScores;
  timeliness: 'early' | 'onTime' | 'late';
}

export interface DesignerScores {
  styleboxScore: number;
  portfolioScore: number;
  publicationScore: number;
  sellingScore: number;
  weightedTotal: number;
}

/**
 * Get quality multiplier based on average score
 */
export function getQualityMultiplier(averageScore: number): number {
  const tier = QUALITY_MULTIPLIERS.find(
    t => averageScore >= t.min && averageScore <= t.max
  );
  return tier?.multiplier ?? 0.5;
}

/**
 * Calculate weighted evaluation score based on difficulty
 */
export function calculateWeightedEvaluationScore(
  scores: EvaluationScores,
  difficulty: StyleboxDifficulty
): number {
  const weights = EVALUATION_WEIGHTS[difficulty];
  const weightedScore = 
    (scores.trendAlignment * weights.trendAlignment / 100) +
    (scores.creativeInnovation * weights.creativeInnovation / 100) +
    (scores.technicalExecution * weights.technicalExecution / 100) +
    (scores.craftsmanship * weights.craftsmanship / 100);
  
  return weightedScore;
}

/**
 * Calculate single stylebox score contribution
 */
export function calculateStyleboxScore(input: StyleboxScoreInput): number {
  const basePoints = DIFFICULTY_POINTS[input.difficulty];
  
  // Calculate weighted evaluation score (0-100)
  const evaluationScore = calculateWeightedEvaluationScore(
    input.evaluationScores,
    input.difficulty
  );
  
  // Get quality multiplier
  const qualityMultiplier = getQualityMultiplier(evaluationScore);
  
  // Get timeliness bonus
  const timelinessBonus = TIMELINESS_BONUS[input.timeliness];
  
  // Final score = basePoints × qualityMultiplier × (1 + timelinessBonus)
  const finalScore = basePoints * qualityMultiplier * (1 + timelinessBonus);
  
  return Math.round(finalScore * 100) / 100;
}

/**
 * Calculate weighted stylebox contribution (30% of total)
 */
export function calculateStyleboxContribution(styleboxScore: number): number {
  return Math.round(styleboxScore * SCORE_WEIGHTS.stylebox * 100) / 100;
}

/**
 * Calculate total weighted score from all components
 */
export function calculateWeightedTotal(scores: Omit<DesignerScores, 'weightedTotal'>): number {
  const total = 
    (scores.styleboxScore * SCORE_WEIGHTS.stylebox) +
    (scores.portfolioScore * SCORE_WEIGHTS.portfolio) +
    (scores.publicationScore * SCORE_WEIGHTS.publication) +
    (scores.sellingScore * SCORE_WEIGHTS.selling);
  
  return Math.round(total * 100) / 100;
}

/**
 * Format score for display
 */
export function formatScore(score: number): string {
  return score.toFixed(1);
}

/**
 * Get score breakdown for display
 */
export function getScoreBreakdown(scores: DesignerScores): {
  component: string;
  weight: string;
  rawScore: number;
  contribution: number;
}[] {
  return [
    {
      component: 'Stylebox (Learning & Skill)',
      weight: '30%',
      rawScore: scores.styleboxScore,
      contribution: Math.round(scores.styleboxScore * SCORE_WEIGHTS.stylebox * 100) / 100,
    },
    {
      component: 'Portfolio (Creating & Consistency)',
      weight: '35%',
      rawScore: scores.portfolioScore,
      contribution: Math.round(scores.portfolioScore * SCORE_WEIGHTS.portfolio * 100) / 100,
    },
    {
      component: 'Publications (Impact & Recognition)',
      weight: '15%',
      rawScore: scores.publicationScore,
      contribution: Math.round(scores.publicationScore * SCORE_WEIGHTS.publication * 100) / 100,
    },
    {
      component: 'Selling (Market Validation)',
      weight: '20%',
      rawScore: scores.sellingScore,
      contribution: Math.round(scores.sellingScore * SCORE_WEIGHTS.selling * 100) / 100,
    },
  ];
}

/**
 * Get difficulty label for display
 */
export function getDifficultyLabel(difficulty: StyleboxDifficulty): string {
  const labels: Record<StyleboxDifficulty, string> = {
    free: 'Free',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    insane: 'Insane',
  };
  return labels[difficulty];
}

/**
 * Get timeliness label
 */
export function getTimelinessLabel(timeliness: 'early' | 'onTime' | 'late'): string {
  const labels = {
    early: 'Early (+5%)',
    onTime: 'On Time',
    late: 'Late (-5%)',
  };
  return labels[timeliness];
}
