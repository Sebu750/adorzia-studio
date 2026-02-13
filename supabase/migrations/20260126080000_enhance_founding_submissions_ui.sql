-- Enhance founding_designers_submissions table for detailed collection submissions
ALTER TABLE public.founding_designers_submissions 
ADD COLUMN IF NOT EXISTS designer_vision_statement TEXT,
ADD COLUMN IF NOT EXISTS articles JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT true;

-- Update submitted_at to be nullable (only set when is_draft becomes false)
ALTER TABLE public.founding_designers_submissions 
ALTER COLUMN submitted_at DROP NOT NULL,
ALTER COLUMN submitted_at SET DEFAULT NULL;

-- If there are existing records, mark them as not drafts for safety
UPDATE public.founding_designers_submissions SET is_draft = false WHERE submitted_at IS NOT NULL;
