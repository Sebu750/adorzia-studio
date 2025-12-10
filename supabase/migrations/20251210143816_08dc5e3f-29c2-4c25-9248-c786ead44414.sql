-- Portfolio System Enhancement Migration

-- Add visibility enum
CREATE TYPE public.portfolio_visibility AS ENUM ('private', 'public', 'marketplace_only');

-- Add portfolio status enum for workflow
CREATE TYPE public.portfolio_status AS ENUM ('draft', 'review', 'approved', 'published', 'rejected');

-- Extend portfolios table with new fields
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS status portfolio_status DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS visibility portfolio_visibility DEFAULT 'private',
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'fashion',
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by UUID,
ADD COLUMN IF NOT EXISTS reviewer_notes TEXT,
ADD COLUMN IF NOT EXISTS quality_score INTEGER,
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS locked_by UUID,
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- Create portfolio_projects table for individual projects within a portfolio
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[],
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  source_type TEXT, -- stylebox, walkthrough, independent
  source_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create portfolio_assets table for all uploaded files
CREATE TABLE IF NOT EXISTS public.portfolio_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  designer_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- image, video, document
  asset_category TEXT, -- sketch, moodboard, mockup, final, process
  file_size INTEGER,
  mime_type TEXT,
  dimensions JSONB, -- {width, height}
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  caption TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create portfolio_sections table for custom layout sections
CREATE TABLE IF NOT EXISTS public.portfolio_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  section_type TEXT DEFAULT 'gallery', -- gallery, text, hero, about, contact
  content JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create portfolio_versions table for version history
CREATE TABLE IF NOT EXISTS public.portfolio_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL, -- Full portfolio data snapshot
  change_summary TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create portfolio_reviews table for admin review workflow
CREATE TABLE IF NOT EXISTS public.portfolio_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  action TEXT NOT NULL, -- submitted, approved, rejected, revision_requested, published
  notes TEXT,
  quality_score INTEGER,
  feedback JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create portfolio_analytics table for tracking
CREATE TABLE IF NOT EXISTS public.portfolio_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- view, project_click, asset_view, share, download
  visitor_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolio_projects
CREATE POLICY "Designers can manage own projects"
ON public.portfolio_projects FOR ALL
USING (EXISTS (
  SELECT 1 FROM portfolios WHERE portfolios.id = portfolio_projects.portfolio_id AND portfolios.designer_id = auth.uid()
));

CREATE POLICY "Admins can manage all projects"
ON public.portfolio_projects FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Public can view published portfolio projects"
ON public.portfolio_projects FOR SELECT
USING (EXISTS (
  SELECT 1 FROM portfolios 
  WHERE portfolios.id = portfolio_projects.portfolio_id 
  AND portfolios.status = 'published' 
  AND portfolios.visibility IN ('public', 'marketplace_only')
));

-- RLS Policies for portfolio_assets
CREATE POLICY "Designers can manage own assets"
ON public.portfolio_assets FOR ALL
USING (designer_id = auth.uid());

CREATE POLICY "Admins can manage all assets"
ON public.portfolio_assets FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Public can view published portfolio assets"
ON public.portfolio_assets FOR SELECT
USING (EXISTS (
  SELECT 1 FROM portfolios 
  WHERE portfolios.id = portfolio_assets.portfolio_id 
  AND portfolios.status = 'published' 
  AND portfolios.visibility IN ('public', 'marketplace_only')
));

-- RLS Policies for portfolio_sections
CREATE POLICY "Designers can manage own sections"
ON public.portfolio_sections FOR ALL
USING (EXISTS (
  SELECT 1 FROM portfolios WHERE portfolios.id = portfolio_sections.portfolio_id AND portfolios.designer_id = auth.uid()
));

CREATE POLICY "Admins can manage all sections"
ON public.portfolio_sections FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Public can view published sections"
ON public.portfolio_sections FOR SELECT
USING (EXISTS (
  SELECT 1 FROM portfolios 
  WHERE portfolios.id = portfolio_sections.portfolio_id 
  AND portfolios.status = 'published' 
  AND portfolios.visibility IN ('public', 'marketplace_only')
) AND is_visible = true);

-- RLS Policies for portfolio_versions
CREATE POLICY "Designers can view own versions"
ON public.portfolio_versions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM portfolios WHERE portfolios.id = portfolio_versions.portfolio_id AND portfolios.designer_id = auth.uid()
));

CREATE POLICY "Designers can create versions"
ON public.portfolio_versions FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM portfolios WHERE portfolios.id = portfolio_versions.portfolio_id AND portfolios.designer_id = auth.uid()
));

CREATE POLICY "Admins can manage all versions"
ON public.portfolio_versions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- RLS Policies for portfolio_reviews
CREATE POLICY "Admins can manage reviews"
ON public.portfolio_reviews FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Designers can view own portfolio reviews"
ON public.portfolio_reviews FOR SELECT
USING (EXISTS (
  SELECT 1 FROM portfolios WHERE portfolios.id = portfolio_reviews.portfolio_id AND portfolios.designer_id = auth.uid()
));

-- RLS Policies for portfolio_analytics
CREATE POLICY "Anyone can insert analytics"
ON public.portfolio_analytics FOR INSERT
WITH CHECK (true);

CREATE POLICY "Designers can view own analytics"
ON public.portfolio_analytics FOR SELECT
USING (EXISTS (
  SELECT 1 FROM portfolios WHERE portfolios.id = portfolio_analytics.portfolio_id AND portfolios.designer_id = auth.uid()
));

CREATE POLICY "Admins can view all analytics"
ON public.portfolio_analytics FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Update existing portfolios RLS to include public viewing
CREATE POLICY "Public can view published portfolios"
ON public.portfolios FOR SELECT
USING (status = 'published' AND visibility IN ('public', 'marketplace_only'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_portfolio ON public.portfolio_projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_order ON public.portfolio_projects(portfolio_id, display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_assets_portfolio ON public.portfolio_assets(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_assets_project ON public.portfolio_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_portfolio ON public.portfolio_sections(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_versions_portfolio ON public.portfolio_versions(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON public.portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON public.portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_visibility ON public.portfolios(visibility);

-- Create storage bucket for portfolio assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets', 
  'portfolio-assets', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for portfolio-assets bucket
CREATE POLICY "Designers can upload own assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-assets' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Designers can update own assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio-assets' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Designers can delete own assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio-assets' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view portfolio assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

-- Add triggers for updated_at
CREATE TRIGGER update_portfolio_projects_updated_at
BEFORE UPDATE ON public.portfolio_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_sections_updated_at
BEFORE UPDATE ON public.portfolio_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();