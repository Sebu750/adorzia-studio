-- Add standardized StyleBox template columns to styleboxes table
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS season text;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS collection_size integer;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS trend_narrative text;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS global_drivers text;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS local_relevance text;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS visual_keywords jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS moodboard_images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS color_system jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS material_direction jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS technical_requirements jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS design_guidelines jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS evaluation_criteria jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS submission_deadline timestamp with time zone;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS pdf_url text;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- Add comments for documentation
COMMENT ON COLUMN public.styleboxes.season IS 'Season identifier (e.g., SS25, FW25)';
COMMENT ON COLUMN public.styleboxes.collection_size IS 'Required number of pieces in collection';
COMMENT ON COLUMN public.styleboxes.trend_narrative IS 'Full trend narrative (300-600 words)';
COMMENT ON COLUMN public.styleboxes.global_drivers IS 'Global macro drivers (culture, behavior, markets)';
COMMENT ON COLUMN public.styleboxes.local_relevance IS 'Pakistan/South Asia market adaptation';
COMMENT ON COLUMN public.styleboxes.visual_keywords IS 'Array of visual theme keywords';
COMMENT ON COLUMN public.styleboxes.moodboard_images IS 'Array of {url, theme_tag, alt_text, keywords}';
COMMENT ON COLUMN public.styleboxes.color_system IS 'Array of {pantone, hex, lab, name, type, usage_ratio}';
COMMENT ON COLUMN public.styleboxes.material_direction IS 'Category-specific material guidance object';
COMMENT ON COLUMN public.styleboxes.technical_requirements IS 'File formats, views, measurements, etc.';
COMMENT ON COLUMN public.styleboxes.design_guidelines IS 'Difficulty-based design guidelines';
COMMENT ON COLUMN public.styleboxes.evaluation_criteria IS 'Array of {name, weight, description}';
COMMENT ON COLUMN public.styleboxes.submission_deadline IS 'Deadline for designer submissions';
COMMENT ON COLUMN public.styleboxes.pdf_url IS 'URL to generated PDF brief';
COMMENT ON COLUMN public.styleboxes.thumbnail_url IS 'Preview thumbnail image URL';