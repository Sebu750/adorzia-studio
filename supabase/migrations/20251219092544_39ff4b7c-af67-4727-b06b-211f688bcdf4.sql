-- Add new columns for production-grade styleboxes
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS studio_name TEXT;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS scenario JSONB DEFAULT '{}';
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS target_role TEXT;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS time_limit_hours INTEGER;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS level_number INTEGER DEFAULT 1;
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS constraints JSONB DEFAULT '[]';
ALTER TABLE public.styleboxes ADD COLUMN IF NOT EXISTS detailed_deliverables JSONB DEFAULT '[]';

-- Add check constraint for level_number
ALTER TABLE public.styleboxes ADD CONSTRAINT check_level_number CHECK (level_number >= 1 AND level_number <= 4);

-- Create index for studio filtering
CREATE INDEX IF NOT EXISTS idx_styleboxes_studio_name ON public.styleboxes(studio_name);
CREATE INDEX IF NOT EXISTS idx_styleboxes_level_number ON public.styleboxes(level_number);