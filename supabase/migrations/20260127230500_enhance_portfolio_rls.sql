-- =====================================================
-- PORTFOLIO OPTIMIZATIONS
-- Add RLS policies and performance indexes
-- =====================================================

-- =====================================================
-- RLS POLICIES FOR PORTFOLIO PROJECTS
-- =====================================================

-- Enable RLS if not already enabled
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_assets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Designers can view own portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Designers can insert own portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Designers can update own portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Designers can delete own portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Public can view published portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admins can manage all portfolio projects" ON public.portfolio_projects;

DROP POLICY IF EXISTS "Designers can view own portfolio assets" ON public.portfolio_assets;
DROP POLICY IF EXISTS "Designers can insert own portfolio assets" ON public.portfolio_assets;
DROP POLICY IF EXISTS "Designers can update own portfolio assets" ON public.portfolio_assets;
DROP POLICY IF EXISTS "Designers can delete own portfolio assets" ON public.portfolio_assets;
DROP POLICY IF EXISTS "Public can view published portfolio assets" ON public.portfolio_assets;
DROP POLICY IF EXISTS "Admins can manage all portfolio assets" ON public.portfolio_assets;

-- Portfolio Projects Policies

-- Designers can view their own projects
CREATE POLICY "Designers can view own portfolio projects"
ON public.portfolio_projects
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios
    WHERE portfolios.id = portfolio_projects.portfolio_id
    AND portfolios.designer_id = (select auth.uid())
  )
);

-- Designers can insert their own projects
CREATE POLICY "Designers can insert own portfolio projects"
ON public.portfolio_projects
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.portfolios
    WHERE portfolios.id = portfolio_projects.portfolio_id
    AND portfolios.designer_id = (select auth.uid())
  )
);

-- Designers can update their own projects
CREATE POLICY "Designers can update own portfolio projects"
ON public.portfolio_projects
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios
    WHERE portfolios.id = portfolio_projects.portfolio_id
    AND portfolios.designer_id = (select auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.portfolios
    WHERE portfolios.id = portfolio_projects.portfolio_id
    AND portfolios.designer_id = (select auth.uid())
  )
);

-- Designers can delete their own projects
CREATE POLICY "Designers can delete own portfolio projects"
ON public.portfolio_projects
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios
    WHERE portfolios.id = portfolio_projects.portfolio_id
    AND portfolios.designer_id = (select auth.uid())
  )
);

-- Public can view published projects (disabled for now - add when public portfolios feature is ready)
-- Commented out until portfolios table has proper visibility column
/*
CREATE POLICY "Public can view published portfolio projects"
ON public.portfolio_projects
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios
    WHERE portfolios.id = portfolio_projects.portfolio_id
    AND portfolios.visibility IN ('public', 'marketplace_only')
  )
);
*/

-- Admins can manage all projects
CREATE POLICY "Admins can manage all portfolio projects"
ON public.portfolio_projects
FOR ALL
TO authenticated
USING (
  public.has_role((select auth.uid()), 'admin') OR public.has_role((select auth.uid()), 'superadmin')
);

-- Portfolio Assets Policies

-- Designers can view their own assets
CREATE POLICY "Designers can view own portfolio assets"
ON public.portfolio_assets
FOR SELECT
TO authenticated
USING (designer_id = (select auth.uid()));

-- Designers can insert their own assets
CREATE POLICY "Designers can insert own portfolio assets"
ON public.portfolio_assets
FOR INSERT
TO authenticated
WITH CHECK (designer_id = (select auth.uid()));

-- Designers can update their own assets
CREATE POLICY "Designers can update own portfolio assets"
ON public.portfolio_assets
FOR UPDATE
TO authenticated
USING (designer_id = (select auth.uid()))
WITH CHECK (designer_id = (select auth.uid()));

-- Designers can delete their own assets
CREATE POLICY "Designers can delete own portfolio assets"
ON public.portfolio_assets
FOR DELETE
TO authenticated
USING (designer_id = (select auth.uid()));

-- Public can view published portfolio assets (disabled for now)
/*
CREATE POLICY "Public can view published portfolio assets"
ON public.portfolio_assets
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios
    WHERE portfolios.id = portfolio_assets.portfolio_id
    AND portfolios.visibility IN ('public', 'marketplace_only')
  )
);
*/

-- Admins can manage all assets
CREATE POLICY "Admins can manage all portfolio assets"
ON public.portfolio_assets
FOR ALL
TO authenticated
USING (
  public.has_role((select auth.uid()), 'admin') OR public.has_role((select auth.uid()), 'superadmin')
);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Portfolio projects indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_portfolio_created 
ON public.portfolio_projects(portfolio_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_featured 
ON public.portfolio_projects(is_featured, created_at DESC) 
WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_source 
ON public.portfolio_projects(source_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_category 
ON public.portfolio_projects(category) 
WHERE category IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_tags 
ON public.portfolio_projects USING gin(tags);

-- Portfolio assets indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_assets_project_order 
ON public.portfolio_assets(project_id, display_order);

CREATE INDEX IF NOT EXISTS idx_portfolio_assets_portfolio 
ON public.portfolio_assets(portfolio_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_portfolio_assets_designer 
ON public.portfolio_assets(designer_id, created_at DESC);

-- Portfolio publications indexes (if not already exist)
CREATE INDEX IF NOT EXISTS idx_portfolio_publications_portfolio 
ON public.portfolio_publications(portfolio_id, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_portfolio_publications_status 
ON public.portfolio_publications(status, submitted_at DESC);

-- Portfolio analytics indexes (skip if table doesn't exist)
-- CREATE INDEX IF NOT EXISTS idx_portfolio_analytics_portfolio 
-- ON public.portfolio_analytics(portfolio_id, created_at DESC);

-- =====================================================
-- MATERIALIZED VIEW FOR PORTFOLIO STATS (Optional optimization)
-- =====================================================

-- Drop view if exists
DROP MATERIALIZED VIEW IF EXISTS portfolio_project_stats;

-- Create materialized view for quick stats
CREATE MATERIALIZED VIEW portfolio_project_stats AS
SELECT
  p.designer_id,
  p.id as portfolio_id,
  COUNT(DISTINCT pp.id) as total_projects,
  COUNT(DISTINCT pp.id) FILTER (WHERE pp.is_featured = true) as featured_projects,
  COUNT(DISTINCT pa.id) as total_assets,
  COUNT(DISTINCT pub.id) FILTER (WHERE pub.status = 'published') as published_projects,
  COUNT(DISTINCT pub.id) FILTER (WHERE pub.status IN ('pending', 'approved')) as pipeline_projects,
  MAX(pp.created_at) as last_project_date
FROM public.portfolios p
LEFT JOIN public.portfolio_projects pp ON pp.portfolio_id = p.id
LEFT JOIN public.portfolio_assets pa ON pa.portfolio_id = p.id
LEFT JOIN public.portfolio_publications pub ON pub.portfolio_id = p.id
GROUP BY p.designer_id, p.id;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_portfolio_stats_designer ON portfolio_project_stats(designer_id, portfolio_id);

-- Grant access
GRANT SELECT ON portfolio_project_stats TO authenticated;

-- Add comment
COMMENT ON MATERIALIZED VIEW portfolio_project_stats IS 'Pre-computed portfolio statistics for performance. Refresh periodically with: REFRESH MATERIALIZED VIEW CONCURRENTLY portfolio_project_stats;';

-- =====================================================
-- COMPLETION LOG
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Portfolio RLS policies and indexes created successfully';
  RAISE NOTICE 'Performance indexes added for faster queries';
  RAISE NOTICE 'Materialized view portfolio_project_stats created for dashboard stats';
  RAISE NOTICE 'Remember to refresh materialized view periodically: REFRESH MATERIALIZED VIEW CONCURRENTLY portfolio_project_stats;';
END $$;
