/**
 * Standardized StyleBox Template Type Definitions
 * For Fashion / Textile / Jewelry — All Difficulty Levels
 */

// ============================================
// COLOR SYSTEM TYPES
// ============================================

export interface LABColor {
  l: number;
  a: number;
  b: number;
}

export interface ColorEntry {
  pantone?: string;
  hex: string;
  lab?: LABColor;
  name: string;
  type: 'core' | 'accent' | 'optional';
  usage_ratio?: number; // percentage 0-100
}

// ============================================
// VISUAL DIRECTION TYPES
// ============================================

export interface MoodboardImage {
  url: string;
  theme_tag: string;
  alt_text?: string;
  keywords?: string[];
}

// ============================================
// MATERIAL DIRECTION TYPES (Category-Specific)
// ============================================

export interface FabricEntry {
  name: string;
  type: 'woven' | 'knit' | 'non-woven';
  description?: string;
}

export interface MetalEntry {
  name: string;
  plating?: string;
}

export interface MaterialDirection {
  // Fashion-specific
  fabrics?: FabricEntry[];
  trims?: string[];
  closures?: string[];
  accessories?: string[];
  silhouette_guidance?: string;
  layering_rules?: string;
  fabric_interplay?: string;
  construction_suggestions?: string;
  
  // Textile-specific
  print_styles?: string[];
  weave_direction?: string;
  repeat_formats?: string[];
  surface_techniques?: string[];
  pattern_scales?: string[];
  repeat_structure?: string;
  print_story?: string;
  texture_suggestions?: string;
  
  // Jewelry-specific
  metals?: MetalEntry[];
  stones?: string[];
  crystals?: string[];
  finishing_types?: string[];
  casting_methods?: string[];
  texturing_methods?: string[];
  metal_hierarchy?: string;
  stone_setting_concepts?: string;
  scale_proportion?: string;
  hardware_mechanics?: string;
}

// ============================================
// TECHNICAL REQUIREMENTS TYPES
// ============================================

export interface RepeatDimensions {
  width: number;
  height: number;
  unit: 'cm' | 'in' | 'px';
}

export interface WeightLimits {
  min?: number;
  max?: number;
  unit: string;
}

export interface TechnicalRequirements {
  file_formats: string[];
  required_views?: string[]; // front, back, detail, side, etc.
  measurement_requirements?: string;
  scale_requirements?: string;
  image_resolution?: string;
  
  // Textile-specific
  repeat_dimensions?: RepeatDimensions;
  color_separations?: boolean;
  
  // Jewelry-specific
  weight_limits?: WeightLimits;
  cad_requirements?: string;
  scale_drawings?: boolean;
  
  // General
  naming_conventions?: string;
  additional_notes?: string;
}

// ============================================
// DESIGN GUIDELINES TYPES (Difficulty-Based)
// ============================================

export type DifficultyLevel = 'free' | 'easy' | 'medium' | 'hard' | 'insane';

export interface DesignGuidelines {
  difficulty_level: DifficultyLevel;
  complexity_notes: string;
  piece_count?: { min: number; max: number };
  
  // Fashion-specific
  construction_guidance?: string;
  layering_rules?: string;
  silhouette_guidance?: string;
  category_build?: string; // tops, bottoms, outerwear, etc.
  
  // Textile-specific
  repeat_structure_guidance?: string;
  print_complexity?: string;
  
  // Jewelry-specific
  engineering_level?: string;
  hardware_complexity?: string;
  
  // General
  reference_notes?: string;
}

// ============================================
// EVALUATION & DELIVERABLES TYPES
// ============================================

export interface EvaluationCriterion {
  name: string;
  weight: number; // percentage, all should sum to 100
  description: string;
}

export interface DeliverableItem {
  id: string;
  name: string;
  required: boolean;
  description?: string;
  naming_convention?: string;
  file_format?: string;
}

// ============================================
// MAIN STYLEBOX TEMPLATE INTERFACE
// ============================================

export type StyleBoxCategory = 'fashion' | 'textile' | 'jewelry';

export interface StyleBoxTemplate {
  // === Basic Setup ===
  id?: string;
  title: string;
  season?: string; // SS25, FW25, etc.
  category: StyleBoxCategory;
  difficulty: DifficultyLevel;
  collection_size?: number;
  is_featured?: boolean;
  is_walkthrough?: boolean;
  
  // === Trend Direction ===
  description?: string; // Short description
  trend_narrative?: string; // 300-600 words
  global_drivers?: string;
  local_relevance?: string; // Pakistan/South Asia adaptation
  
  // === Visual Direction ===
  thumbnail_url?: string;
  moodboard_images: MoodboardImage[];
  visual_keywords: string[];
  
  // === Color System ===
  color_system: ColorEntry[];
  
  // === Material Direction (Category-Specific) ===
  material_direction: MaterialDirection;
  
  // === Design Guidelines (Difficulty-Based) ===
  design_guidelines: DesignGuidelines;
  
  // === Technical Requirements ===
  technical_requirements: TechnicalRequirements;
  
  // === Deliverables ===
  deliverables: DeliverableItem[];
  
  // === Evaluation ===
  evaluation_criteria: EvaluationCriterion[];
  
  // === Timeline ===
  submission_deadline?: Date | string;
  release_date?: Date | string;
  archive_date?: Date | string;
  
  // === XP & Rewards ===
  xp_reward?: number;
  required_rank_order?: number;
  required_subscription_tier?: 'basic' | 'pro' | 'elite';
  
  // === Generated Assets ===
  pdf_url?: string;
  
  // === Meta ===
  status?: 'draft' | 'active' | 'archived';
  version?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

// ============================================
// DEFAULT VALUES & PRESETS
// ============================================

export const DEFAULT_FILE_FORMATS = [
  'PNG',
  'JPEG',
  'PDF',
  'AI',
  'PSD',
  'TIFF',
];

export const DEFAULT_REQUIRED_VIEWS = [
  'Front',
  'Back',
  'Detail',
  'Side',
  'Flat/Technical',
];

export const DEFAULT_EVALUATION_CRITERIA: EvaluationCriterion[] = [
  { name: 'Creativity', weight: 25, description: 'Originality and innovative approach' },
  { name: 'On-Trend Alignment', weight: 25, description: 'Adherence to trend direction and narrative' },
  { name: 'Technical Accuracy', weight: 25, description: 'Quality of execution and specifications' },
  { name: 'Market Relevance', weight: 25, description: 'Commercial viability and target market fit' },
];

export const DIFFICULTY_PRESETS: Record<DifficultyLevel, Partial<DesignGuidelines>> = {
  free: {
    difficulty_level: 'free',
    complexity_notes: 'Introductory challenge with minimal requirements. Focus on exploring the trend direction.',
    piece_count: { min: 1, max: 2 },
  },
  easy: {
    difficulty_level: 'easy',
    complexity_notes: 'Simple shapes and low complexity. Great for building foundational skills.',
    piece_count: { min: 1, max: 3 },
  },
  medium: {
    difficulty_level: 'medium',
    complexity_notes: 'Multi-element concepts with coordinated looks. Moderate technical requirements.',
    piece_count: { min: 3, max: 5 },
  },
  hard: {
    difficulty_level: 'hard',
    complexity_notes: 'Advanced construction with detail layering. High technical precision expected.',
    piece_count: { min: 6, max: 10 },
  },
  insane: {
    difficulty_level: 'insane',
    complexity_notes: 'High-concept, couture-level engineering. Maximum creativity and technical mastery required.',
    piece_count: { min: 10, max: 20 },
  },
};

export const STANDARD_DELIVERABLES: DeliverableItem[] = [
  { id: 'sketches', name: 'Design Sketches', required: true, description: 'Hand or digital sketches of all designs' },
  { id: 'flats', name: 'Flat Drawings', required: true, description: 'Technical flat drawings with construction details' },
  { id: 'moodboard', name: 'Moodboard', required: true, description: 'Visual inspiration board for collection' },
  { id: 'colorboard', name: 'Color Board', required: false, description: 'Color palette presentation' },
  { id: 'fabricboard', name: 'Fabric Board', required: false, description: 'Material and texture selections' },
  { id: 'patterns', name: 'Patterns', required: false, description: 'Pattern pieces or templates' },
  { id: 'repeats', name: 'Print Repeats', required: false, description: 'Seamless repeat patterns (textile)' },
  { id: 'mockups', name: '3D Mockups', required: false, description: 'Digital 3D product mockups' },
  { id: 'techpack', name: 'Tech Pack', required: false, description: 'Full technical specification package' },
  { id: 'specs', name: 'Specifications', required: false, description: 'Measurements and sizing details' },
  { id: 'cad', name: 'CAD Files', required: false, description: '3D CAD files (jewelry)' },
];

export const SEASON_OPTIONS = [
  'SS24', 'FW24', 'SS25', 'FW25', 'SS26', 'FW26',
  'Resort 24', 'Resort 25', 'Resort 26',
  'Pre-Fall 24', 'Pre-Fall 25', 'Pre-Fall 26',
  'Capsule', 'Timeless',
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Creates an empty StyleBox template with defaults
 */
export function createEmptyStyleBoxTemplate(category: StyleBoxCategory = 'fashion'): StyleBoxTemplate {
  return {
    title: '',
    category,
    difficulty: 'easy',
    moodboard_images: [],
    visual_keywords: [],
    color_system: [],
    material_direction: {},
    design_guidelines: {
      ...DIFFICULTY_PRESETS.easy,
      difficulty_level: 'easy',
      complexity_notes: DIFFICULTY_PRESETS.easy.complexity_notes || '',
    },
    technical_requirements: {
      file_formats: [...DEFAULT_FILE_FORMATS],
      required_views: [...DEFAULT_REQUIRED_VIEWS],
    },
    deliverables: STANDARD_DELIVERABLES.filter(d => d.required),
    evaluation_criteria: [...DEFAULT_EVALUATION_CRITERIA],
    xp_reward: 100,
    status: 'draft',
    version: 1,
  };
}

/**
 * Validates that evaluation criteria weights sum to 100
 */
export function validateEvaluationCriteria(criteria: EvaluationCriterion[]): boolean {
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  return totalWeight === 100;
}

/**
 * Gets category-specific deliverables
 */
export function getCategoryDeliverables(category: StyleBoxCategory): DeliverableItem[] {
  const baseDeliverables = STANDARD_DELIVERABLES.filter(d => 
    !['repeats', 'cad'].includes(d.id)
  );
  
  switch (category) {
    case 'textile':
      return [
        ...baseDeliverables,
        STANDARD_DELIVERABLES.find(d => d.id === 'repeats')!,
      ].filter(Boolean);
    case 'jewelry':
      return [
        ...baseDeliverables,
        STANDARD_DELIVERABLES.find(d => d.id === 'cad')!,
      ].filter(Boolean);
    default:
      return baseDeliverables;
  }
}

/**
 * Maps database difficulty to template difficulty
 */
export function mapDatabaseDifficulty(dbDifficulty: string): DifficultyLevel {
  const map: Record<string, DifficultyLevel> = {
    'free': 'free',
    'easy': 'easy',
    'medium': 'medium',
    'hard': 'hard',
    'insane': 'insane',
  };
  return map[dbDifficulty.toLowerCase()] || 'easy';
}

/**
 * Maps database category to template category
 */
export function mapDatabaseCategory(dbCategory: string): StyleBoxCategory {
  const map: Record<string, StyleBoxCategory> = {
    'fashion': 'fashion',
    'textile': 'textile',
    'jewelry': 'jewelry',
  };
  return map[dbCategory.toLowerCase()] || 'fashion';
}
