-- =====================================================
-- CREATE PORTFOLIO TABLES
-- Create portfolio_projects and portfolio_assets tables
-- =====================================================

-- Create portfolio_projects table
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[],
  thumbnail_url TEXT,
  source_type TEXT DEFAULT 'upload', -- 'upload', 'stylebox', 'migrated_collection'
  source_id UUID, -- Reference to source (stylebox_id, etc)
  migration_source TEXT, -- Tracks data origin for migrated records
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create portfolio_assets table
CREATE TABLE IF NOT EXISTS public.portfolio_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  designer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'video', 'document'
  file_size BIGINT,
  mime_type TEXT,
  dimensions JSONB, -- {width: 1920, height: 1080}
  alt_text TEXT,
  caption TEXT,
  asset_category TEXT, -- 'thumbnail', 'detail', 'process', etc
  display_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_portfolio ON public.portfolio_projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_created ON public.portfolio_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_assets_project ON public.portfolio_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_assets_portfolio ON public.portfolio_assets(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_assets_designer ON public.portfolio_assets(designer_id);

-- Add updated_at trigger for portfolio_projects
CREATE OR REPLACE FUNCTION public.update_portfolio_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_portfolio_projects_updated_at();

-- Enable RLS
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_assets ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_assets TO authenticated;
GRANT SELECT ON public.portfolio_projects TO anon;
GRANT SELECT ON public.portfolio_assets TO anon;

-- Add comments
COMMENT ON TABLE public.portfolio_projects IS 'Individual projects within a designers portfolio';
COMMENT ON TABLE public.portfolio_assets IS 'Images and files associated with portfolio projects';
COMMENT ON COLUMN public.portfolio_projects.migration_source IS 'Tracks data origin for migrated records (e.g., collection_submissions)';

DO $$
BEGIN
  RAISE NOTICE 'Portfolio tables created successfully';
  RAISE NOTICE 'Tables: portfolio_projects, portfolio_assets';
END $$;
