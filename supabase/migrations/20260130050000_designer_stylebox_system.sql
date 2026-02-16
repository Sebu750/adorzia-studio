-- =====================================================
-- Designer-Side StyleBox System - Complete Database Schema
-- Migration: 20260130050000
-- Description: Tables, storage, and RLS for designer submissions
-- =====================================================

-- =====================================================
-- 1. ENUMS
-- =====================================================

-- Create all enum types in a single DO block to avoid multiple transactions
DO $$
BEGIN
  -- Submission status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
    CREATE TYPE submission_status AS ENUM (
      'draft',
      'submitted',
      'under_review',
      'approved',
      'rejected',
      'revision_requested'
    );
  END IF;

  -- Deliverable status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deliverable_status') THEN
    CREATE TYPE deliverable_status AS ENUM (
      'pending',
      'uploaded',
      'approved',
      'rejected'
    );
  END IF;

  -- File type enum for designer uploads
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'designer_file_type') THEN
    CREATE TYPE designer_file_type AS ENUM (
      'image_2d',
      'technical_pack',
      'model_3d',
      'video',
      'document'
    );
  END IF;
END$$;

-- =====================================================
-- 2. CORE TABLES
-- =====================================================

-- Designer Submissions Table
CREATE TABLE IF NOT EXISTS public.stylebox_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stylebox_id UUID NOT NULL REFERENCES public.styleboxes(id) ON DELETE CASCADE,
  designer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Version control
  version_number INTEGER DEFAULT 1,
  is_final BOOLEAN DEFAULT false,
  
  -- Content
  manifestation_rationale TEXT,
  
  -- Status tracking
  status submission_status DEFAULT 'draft',
  submission_date TIMESTAMPTZ,
  review_date TIMESTAMPTZ,
  
  -- Metadata
  total_deliverables INTEGER DEFAULT 0,
  completed_deliverables INTEGER DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  UNIQUE(stylebox_id, designer_id, version_number),
  CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  CHECK (completed_deliverables <= total_deliverables)
);

-- Submission Files Table (links uploaded assets to submissions)
CREATE TABLE IF NOT EXISTS public.submission_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.stylebox_submissions(id) ON DELETE CASCADE,
  deliverable_id TEXT NOT NULL, -- References adorzia_deliverables JSON from styleboxes
  
  -- File details
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type designer_file_type NOT NULL,
  mime_type TEXT NOT NULL,
  
  -- Status
  status deliverable_status DEFAULT 'uploaded',
  
  -- Preview/Thumbnail
  thumbnail_url TEXT,
  preview_url TEXT,
  
  -- Watermarking
  is_watermarked BOOLEAN DEFAULT false,
  watermark_text TEXT DEFAULT 'ADORZIA STUDIO - DRAFT',
  
  -- Metadata
  upload_metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  UNIQUE(submission_id, deliverable_id)
);

-- Critique Comments Table (pin-marker feedback system)
CREATE TABLE IF NOT EXISTS public.critique_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.stylebox_submissions(id) ON DELETE CASCADE,
  file_id UUID REFERENCES public.submission_files(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Pin marker coordinates (percentage-based for responsive positioning)
  pin_x DECIMAL(5,2), -- 0-100 (percentage from left)
  pin_y DECIMAL(5,2), -- 0-100 (percentage from top)
  
  -- Comment content
  comment_text TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('info', 'suggestion', 'issue', 'critical')),
  
  -- Status
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CHECK (pin_x IS NULL OR (pin_x >= 0 AND pin_x <= 100)),
  CHECK (pin_y IS NULL OR (pin_y >= 0 AND pin_y <= 100))
);

-- Designer Drafts Table (auto-save and version control)
CREATE TABLE IF NOT EXISTS public.designer_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.stylebox_submissions(id) ON DELETE CASCADE,
  designer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Draft data (stores form state)
  draft_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Auto-save metadata
  is_auto_saved BOOLEAN DEFAULT true,
  last_saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Team Share Links Table (view-only access for collaborators)
CREATE TABLE IF NOT EXISTS public.stylebox_share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.stylebox_submissions(id) ON DELETE CASCADE,
  designer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Link details
  share_token TEXT NOT NULL UNIQUE,
  share_url TEXT NOT NULL,
  
  -- Access control
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  max_views INTEGER,
  
  -- Permissions
  allow_comments BOOLEAN DEFAULT true,
  allow_download BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMPTZ
);

-- Share Link Comments Table
CREATE TABLE IF NOT EXISTS public.share_link_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_link_id UUID NOT NULL REFERENCES public.stylebox_share_links(id) ON DELETE CASCADE,
  
  -- Commenter details
  commenter_name TEXT NOT NULL,
  commenter_email TEXT,
  
  -- Comment
  comment_text TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- 3. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_submissions_designer ON public.stylebox_submissions(designer_id);
CREATE INDEX IF NOT EXISTS idx_submissions_stylebox ON public.stylebox_submissions(stylebox_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.stylebox_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON public.stylebox_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submission_files_submission ON public.submission_files(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_files_deliverable ON public.submission_files(deliverable_id);
CREATE INDEX IF NOT EXISTS idx_submission_files_status ON public.submission_files(status);

CREATE INDEX IF NOT EXISTS idx_critique_comments_submission ON public.critique_comments(submission_id);
CREATE INDEX IF NOT EXISTS idx_critique_comments_file ON public.critique_comments(file_id);
CREATE INDEX IF NOT EXISTS idx_critique_comments_admin ON public.critique_comments(admin_id);

CREATE INDEX IF NOT EXISTS idx_designer_drafts_submission ON public.designer_drafts(submission_id);
CREATE INDEX IF NOT EXISTS idx_designer_drafts_designer ON public.designer_drafts(designer_id);

CREATE INDEX IF NOT EXISTS idx_share_links_token ON public.stylebox_share_links(share_token);
CREATE INDEX IF NOT EXISTS idx_share_links_submission ON public.stylebox_share_links(submission_id);

-- =====================================================
-- 4. STORAGE BUCKET
-- =====================================================

-- Create storage bucket for designer submissions with 500MB limit
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'stylebox-designer-submissions',
  'stylebox-designer-submissions',
  false,
  524288000, -- 500MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'application/pdf',
    'video/mp4',
    'video/quicktime',
    'model/obj',
    'model/gltf-binary',
    'model/gltf+json',
    'application/octet-stream',
    'application/x-tgif'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 524288000,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'application/pdf',
    'video/mp4',
    'video/quicktime',
    'model/obj',
    'model/gltf-binary',
    'model/gltf+json',
    'application/octet-stream',
    'application/x-tgif'
  ]::text[];

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.stylebox_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.critique_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designer_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylebox_share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_link_comments ENABLE ROW LEVEL SECURITY;

-- RLS: Submissions - Designers can only view/edit their own
CREATE POLICY "Designers can view own submissions"
ON public.stylebox_submissions
FOR SELECT
TO authenticated
USING (designer_id = auth.uid());

CREATE POLICY "Designers can create own submissions"
ON public.stylebox_submissions
FOR INSERT
TO authenticated
WITH CHECK (designer_id = auth.uid());

CREATE POLICY "Designers can update own submissions"
ON public.stylebox_submissions
FOR UPDATE
TO authenticated
USING (designer_id = auth.uid())
WITH CHECK (designer_id = auth.uid());

CREATE POLICY "Designers can delete own submissions"
ON public.stylebox_submissions
FOR DELETE
TO authenticated
USING (designer_id = auth.uid());

-- RLS: Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
ON public.stylebox_submissions
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'superadmin') OR 
  public.has_role(auth.uid(), 'lead_curator')
);

-- RLS: Submission Files - Designers can manage their own files
CREATE POLICY "Designers can manage own submission files"
ON public.submission_files
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.stylebox_submissions
    WHERE id = submission_files.submission_id
    AND designer_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all submission files"
ON public.submission_files
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'superadmin') OR 
  public.has_role(auth.uid(), 'lead_curator')
);

-- RLS: Critique Comments - Designers can view comments on their work
CREATE POLICY "Designers can view critique on own submissions"
ON public.critique_comments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.stylebox_submissions
    WHERE id = critique_comments.submission_id
    AND designer_id = auth.uid()
  )
);

-- RLS: Admins can manage all critique comments
CREATE POLICY "Admins can manage critique comments"
ON public.critique_comments
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'superadmin') OR 
  public.has_role(auth.uid(), 'lead_curator')
);

-- RLS: Designer Drafts - Designers can only access their own drafts
CREATE POLICY "Designers can manage own drafts"
ON public.designer_drafts
FOR ALL
TO authenticated
USING (designer_id = auth.uid())
WITH CHECK (designer_id = auth.uid());

-- RLS: Share Links - Designers can manage their own share links
CREATE POLICY "Designers can manage own share links"
ON public.stylebox_share_links
FOR ALL
TO authenticated
USING (designer_id = auth.uid())
WITH CHECK (designer_id = auth.uid());

-- RLS: Share Link Comments - Public read for active links
CREATE POLICY "Anyone can view comments on active share links"
ON public.share_link_comments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.stylebox_share_links
    WHERE id = share_link_comments.share_link_id
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  )
);

CREATE POLICY "Anyone can create comments on active share links"
ON public.share_link_comments
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.stylebox_share_links
    WHERE id = share_link_id
    AND is_active = true
    AND allow_comments = true
    AND (expires_at IS NULL OR expires_at > now())
  )
);

-- RLS: Storage bucket policies for designer submissions
CREATE POLICY "Designers can upload to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'stylebox-designer-submissions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Designers can view own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'stylebox-designer-submissions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Designers can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'stylebox-designer-submissions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Designers can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'stylebox-designer-submissions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can access all designer submissions"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'stylebox-designer-submissions'
  AND (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'superadmin') OR 
    public.has_role(auth.uid(), 'lead_curator')
  )
);

-- =====================================================
-- 6. TRIGGERS & FUNCTIONS
-- =====================================================

-- Function to update progress percentage
CREATE OR REPLACE FUNCTION update_submission_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.stylebox_submissions
  SET 
    completed_deliverables = (
      SELECT COUNT(*)
      FROM public.submission_files
      WHERE submission_id = NEW.submission_id
      AND status IN ('uploaded', 'approved')
    ),
    progress_percentage = (
      SELECT 
        CASE 
          WHEN total_deliverables > 0 THEN
            (COUNT(*)::decimal / total_deliverables * 100)
          ELSE 0
        END
      FROM public.submission_files
      WHERE submission_id = NEW.submission_id
      AND status IN ('uploaded', 'approved')
    ),
    updated_at = now()
  WHERE id = NEW.submission_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update progress when files are uploaded
CREATE TRIGGER tr_update_submission_progress
AFTER INSERT OR UPDATE OR DELETE ON public.submission_files
FOR EACH ROW
EXECUTE FUNCTION update_submission_progress();

-- Function to generate unique share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_token IS NULL THEN
    NEW.share_token := encode(gen_random_bytes(16), 'hex');
    NEW.share_url := 'https://studio.adorzia.com/share/' || NEW.share_token;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate share token on insert
CREATE TRIGGER tr_generate_share_token
BEFORE INSERT ON public.stylebox_share_links
FOR EACH ROW
EXECUTE FUNCTION generate_share_token();

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Function to check if all deliverables are completed
CREATE OR REPLACE FUNCTION check_submission_complete(submission_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  result BOOLEAN;
BEGIN
  SELECT 
    (completed_deliverables >= total_deliverables AND total_deliverables > 0)
  INTO result
  FROM public.stylebox_submissions
  WHERE id = submission_id_param;
  
  RETURN COALESCE(result, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment share link view count
CREATE OR REPLACE FUNCTION increment_share_view(token_param TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.stylebox_share_links
  SET 
    view_count = view_count + 1,
    last_accessed_at = now()
  WHERE share_token = token_param
  AND is_active = true
  AND (expires_at IS NULL OR expires_at > now())
  AND (max_views IS NULL OR view_count < max_views);
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Add comment to track migration
COMMENT ON TABLE public.stylebox_submissions IS 'Designer submissions for StyleBox challenges with version control';
COMMENT ON TABLE public.submission_files IS 'Files uploaded by designers for each deliverable';
COMMENT ON TABLE public.critique_comments IS 'Pin-marker feedback system for admin critique on designer submissions';
COMMENT ON TABLE public.designer_drafts IS 'Auto-save and version control for designer work in progress';
COMMENT ON TABLE public.stylebox_share_links IS 'View-only share links for team collaboration';
