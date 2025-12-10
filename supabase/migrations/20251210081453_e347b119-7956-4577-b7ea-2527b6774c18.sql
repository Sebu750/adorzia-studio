-- Add walkthrough management fields to styleboxes
ALTER TABLE public.styleboxes 
ADD COLUMN IF NOT EXISTS required_subscription_tier subscription_tier DEFAULT NULL,
ADD COLUMN IF NOT EXISTS required_rank_order integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS release_date timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS archive_date timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS version integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS reference_files jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Add review and override fields to walkthrough_progress
ALTER TABLE public.walkthrough_progress
ADD COLUMN IF NOT EXISTS submission_notes text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS submission_files jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS reviewed_by uuid DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reviewer_notes text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS xp_awarded integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS xp_override boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS completion_override boolean DEFAULT false;

-- Create storage bucket for walkthrough reference files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'walkthrough-files',
  'walkthrough-files',
  false,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for walkthrough files
CREATE POLICY "Admins can manage walkthrough files"
ON storage.objects FOR ALL
USING (bucket_id = 'walkthrough-files' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role)));

CREATE POLICY "Authenticated users can view walkthrough files"
ON storage.objects FOR SELECT
USING (bucket_id = 'walkthrough-files' AND auth.role() = 'authenticated');

-- Admin policies for walkthrough_progress management
CREATE POLICY "Admins can view all walkthrough progress"
ON public.walkthrough_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Admins can update walkthrough progress"
ON public.walkthrough_progress
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));