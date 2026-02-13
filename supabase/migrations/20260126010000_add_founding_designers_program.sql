-- Add founding_designers_submissions table
CREATE TABLE IF NOT EXISTS public.founding_designers_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Section 1: Collection Identity
  collection_name TEXT NOT NULL,
  design_philosophy TEXT NOT NULL,
  primary_category TEXT NOT NULL CHECK (primary_category IN ('menswear', 'womenswear', 'unisex', 'accessories')),
  
  -- Section 2: Technical & Visual Assets
  moodboard_files JSONB DEFAULT '[]'::jsonb,
  tech_pack_files JSONB DEFAULT '[]'::jsonb,
  estimated_articles INTEGER NOT NULL CHECK (estimated_articles BETWEEN 5 AND 15),
  
  -- Section 3: Production Strategy
  proposed_materials TEXT NOT NULL,
  target_seasonal_launch TEXT NOT NULL CHECK (target_seasonal_launch IN ('spring_summer', 'fall_winter', 'festive_eid')),
  
  -- Section 4: Declaration
  originality_certified BOOLEAN NOT NULL DEFAULT false,
  program_terms_accepted BOOLEAN NOT NULL DEFAULT false,
  
  -- Submission metadata
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'revisions_required')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  admin_feedback TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.founding_designers_submissions ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_founding_submissions_designer ON public.founding_designers_submissions(designer_id);
CREATE INDEX IF NOT EXISTS idx_founding_submissions_status ON public.founding_designers_submissions(status);
CREATE INDEX IF NOT EXISTS idx_founding_submissions_submitted ON public.founding_designers_submissions(submitted_at DESC);

-- RLS Policies
CREATE POLICY "Designers can view their own submissions"
  ON public.founding_designers_submissions FOR SELECT
  USING ((select auth.uid()) = designer_id);

CREATE POLICY "Designers can create submissions"
  ON public.founding_designers_submissions FOR INSERT
  WITH CHECK ((select auth.uid()) = designer_id);

CREATE POLICY "Designers can update their pending submissions"
  ON public.founding_designers_submissions FOR UPDATE
  USING ((select auth.uid()) = designer_id AND status = 'pending');

CREATE POLICY "Admins can view all submissions"
  ON public.founding_designers_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can update all submissions"
  ON public.founding_designers_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_founding_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = 'public', 'pg_temp';

CREATE TRIGGER update_founding_submissions_updated_at
  BEFORE UPDATE ON public.founding_designers_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_founding_submissions_updated_at();

-- Create storage bucket for founding designers submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('founding-submissions', 'founding-submissions', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for founding submissions
CREATE POLICY "Designers can upload their submission files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'founding-submissions'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  );

CREATE POLICY "Designers can view their submission files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'founding-submissions'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  );

CREATE POLICY "Admins can view all submission files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'founding-submissions'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (select auth.uid())
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Designers can delete their submission files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'founding-submissions'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Add notification when submission is reviewed
CREATE OR REPLACE FUNCTION public.notify_submission_reviewed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status AND NEW.status IN ('approved', 'rejected', 'revisions_required') THEN
    INSERT INTO public.notifications (user_id, type, title, message, metadata)
    VALUES (
      NEW.designer_id,
      'submission',
      'Founding Designers Submission ' || 
        CASE 
          WHEN NEW.status = 'approved' THEN 'Approved'
          WHEN NEW.status = 'rejected' THEN 'Rejected'
          WHEN NEW.status = 'revisions_required' THEN 'Needs Revisions'
        END,
      'Your collection "' || NEW.collection_name || '" has been reviewed. ' ||
        CASE
          WHEN NEW.status = 'approved' THEN 'Congratulations! Your submission has been approved.'
          WHEN NEW.status = 'rejected' THEN 'Unfortunately, your submission was not approved at this time.'
          WHEN NEW.status = 'revisions_required' THEN 'Please review the feedback and resubmit.'
        END,
      jsonb_build_object(
        'submission_id', NEW.id,
        'collection_name', NEW.collection_name,
        'status', NEW.status,
        'admin_feedback', NEW.admin_feedback
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = 'public', 'pg_temp';

CREATE TRIGGER notify_on_founding_submission_review
  AFTER UPDATE ON public.founding_designers_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_submission_reviewed();
