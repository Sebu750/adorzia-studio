-- Migration: 20260130070000_complete_stylebox_schema.sql
-- Description: Adds all missing Adorzia Protocol columns to the styleboxes table

ALTER TABLE public.styleboxes 
-- Core metadata
ADD COLUMN IF NOT EXISTS season TEXT,
ADD COLUMN IF NOT EXISTS collection_size TEXT,
ADD COLUMN IF NOT EXISTS collection_line TEXT,
ADD COLUMN IF NOT EXISTS market_context TEXT,
ADD COLUMN IF NOT EXISTS visibility_tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS display_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,

-- Adorzia Protocol Quadrants
ADD COLUMN IF NOT EXISTS archetype JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS mutation JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS restrictions JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS manifestation JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS adorzia_deliverables JSONB DEFAULT '[]'::jsonb,

-- Trend & Context
ADD COLUMN IF NOT EXISTS trend_narrative TEXT,
ADD COLUMN IF NOT EXISTS global_drivers TEXT,
ADD COLUMN IF NOT EXISTS local_relevance TEXT,
ADD COLUMN IF NOT EXISTS visual_keywords JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS moodboard_images JSONB DEFAULT '[]'::jsonb,

-- Technical & Guidelines
ADD COLUMN IF NOT EXISTS color_system JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS material_direction JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS technical_requirements JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS design_guidelines JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS evaluation_criteria JSONB DEFAULT '[]'::jsonb,

-- Assets
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Update existing records to have empty JSON instead of NULL where appropriate
UPDATE public.styleboxes SET visibility_tags = '[]'::jsonb WHERE visibility_tags IS NULL;
UPDATE public.styleboxes SET archetype = '{}'::jsonb WHERE archetype IS NULL;
UPDATE public.styleboxes SET mutation = '{}'::jsonb WHERE mutation IS NULL;
UPDATE public.styleboxes SET restrictions = '{}'::jsonb WHERE restrictions IS NULL;
UPDATE public.styleboxes SET manifestation = '{}'::jsonb WHERE manifestation IS NULL;
UPDATE public.styleboxes SET adorzia_deliverables = '[]'::jsonb WHERE adorzia_deliverables IS NULL;
UPDATE public.styleboxes SET visual_keywords = '[]'::jsonb WHERE visual_keywords IS NULL;
UPDATE public.styleboxes SET moodboard_images = '[]'::jsonb WHERE moodboard_images IS NULL;
UPDATE public.styleboxes SET technical_requirements = '[]'::jsonb WHERE technical_requirements IS NULL;
UPDATE public.styleboxes SET design_guidelines = '[]'::jsonb WHERE design_guidelines IS NULL;
UPDATE public.styleboxes SET evaluation_criteria = '[]'::jsonb WHERE evaluation_criteria IS NULL;
