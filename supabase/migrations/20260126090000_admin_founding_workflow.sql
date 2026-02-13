-- Enhance founding_designers_submissions for Admin Workflow
ALTER TABLE public.founding_designers_submissions 
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;

-- Ensure profiles has brand_name if not present
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS brand_name TEXT;

-- Create a function to log status changes automatically
CREATE OR REPLACE FUNCTION public.log_founding_submission_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) THEN
    NEW.status_history = NEW.status_history || jsonb_build_object(
      'from', OLD.status,
      'to', NEW.status,
      'timestamp', now(),
      'changed_by', auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_founding_submission_status ON public.founding_designers_submissions;
CREATE TRIGGER trigger_log_founding_submission_status
  BEFORE UPDATE ON public.founding_designers_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_founding_submission_status_change();
