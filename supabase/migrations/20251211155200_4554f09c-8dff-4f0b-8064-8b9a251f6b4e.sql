-- Create collection_submissions table for Initial Collection Submission module
CREATE TABLE public.collection_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  designer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'fashion',
  inspiration TEXT,
  concept_notes TEXT,
  files JSONB DEFAULT '[]'::jsonb,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'revisions_required', 'rejected')),
  admin_feedback TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collection_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Designers can view own submissions"
ON public.collection_submissions
FOR SELECT
USING (designer_id = auth.uid());

CREATE POLICY "Designers can create own submissions"
ON public.collection_submissions
FOR INSERT
WITH CHECK (designer_id = auth.uid());

CREATE POLICY "Designers can update own draft/revisions_required submissions"
ON public.collection_submissions
FOR UPDATE
USING (designer_id = auth.uid() AND status IN ('draft', 'revisions_required'));

CREATE POLICY "Designers can delete own draft submissions"
ON public.collection_submissions
FOR DELETE
USING (designer_id = auth.uid() AND status = 'draft');

CREATE POLICY "Admins can view all submissions"
ON public.collection_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Admins can update all submissions"
ON public.collection_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Create storage bucket for collection files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('collection-files', 'collection-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for collection files
CREATE POLICY "Designers can upload collection files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'collection-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view collection files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'collection-files');

CREATE POLICY "Designers can update own collection files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'collection-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Designers can delete own collection files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'collection-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger for updated_at
CREATE TRIGGER update_collection_submissions_updated_at
BEFORE UPDATE ON public.collection_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();