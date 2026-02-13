-- 1. Drop existing constraint first to allow data cleanup
ALTER TABLE public.founding_designers_submissions 
DROP CONSTRAINT IF EXISTS founding_designers_submissions_estimated_articles_check;

-- 2. Data Cleanup: Update any existing rows that violate the new 2-3 article rule
UPDATE public.founding_designers_submissions
SET estimated_articles = 3
WHERE estimated_articles > 3 OR estimated_articles < 2;

-- 3. Update profiles table to support Founding Designers Program
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_founding_designer BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS founder_tier TEXT CHECK (founder_tier IN ('standard', 'f1', 'f2')),
ADD COLUMN IF NOT EXISTS founding_date TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.is_founding_designer IS 'Flag indicating if the designer is part of the launch founding cohort.';
COMMENT ON COLUMN public.profiles.founder_tier IS 'The specific founding tier assigned to the designer (f1, f2, or standard).';

-- 4. Apply the new article count constraint
ALTER TABLE public.founding_designers_submissions
ADD CONSTRAINT founding_designers_submissions_estimated_articles_check 
CHECK (estimated_articles BETWEEN 2 AND 3);

-- 4. Create index for Admin Dashboard filtering
CREATE INDEX IF NOT EXISTS idx_profiles_founding_status ON public.profiles(is_founding_designer) WHERE is_founding_designer = true;

-- 5. Create the auto-promotion trigger logic
CREATE OR REPLACE FUNCTION public.sync_founding_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE public.profiles
    SET 
      is_founding_designer = true,
      founding_date = now()
    WHERE user_id = NEW.designer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public', 'pg_temp';

DROP TRIGGER IF EXISTS trigger_sync_founding_status ON public.founding_designers_submissions;
CREATE TRIGGER trigger_sync_founding_status
  AFTER UPDATE ON public.founding_designers_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_founding_status();