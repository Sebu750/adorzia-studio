-- Final Backend Enhancements for Founding Review Workflow
-- 1. Ensure branding fields exist on profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS brand_name TEXT,
ADD COLUMN IF NOT EXISTS founding_title_assigned BOOLEAN DEFAULT false;

-- 2. Add detailed audit fields to submissions
ALTER TABLE public.founding_designers_submissions 
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;

-- 3. Fix foreign key name for cleaner joins if needed
-- (The existing founding_designers_submissions_designer_id_fkey is fine)

-- 4. Set up a secure definer function for edge functions to use if they need to bypass complex RLS
-- But for now, since we use SERVICE_ROLE_KEY in the edge function, we are good.

-- 5. Add a comment for documentation
COMMENT ON COLUMN public.founding_designers_submissions.status_history IS 'Audit log of state transitions for administrative tracking.';
