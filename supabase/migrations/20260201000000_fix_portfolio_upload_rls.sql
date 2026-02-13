-- Fix RLS policies for portfolio management to resolve unauthorized issues during upload

-- Ensure portfolios table has proper RLS policies
-- Drop existing policies to refresh them
DROP POLICY IF EXISTS "Designers can manage own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Admins can view all portfolios" ON public.portfolios;

-- Recreate portfolios policies
CREATE POLICY "Designers can manage own portfolios" ON public.portfolios
  FOR ALL TO authenticated USING (designer_id = auth.uid());

CREATE POLICY "Admins can view all portfolios" ON public.portfolios
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Ensure portfolio_projects table has proper RLS policies
-- The issue might be that when creating a new portfolio and project simultaneously,
-- there's a timing issue with the RLS check
DROP POLICY IF EXISTS "Designers can insert own portfolio projects" ON public.portfolio_projects;

-- Recreate with simpler check that should work during creation
CREATE POLICY "Designers can insert own portfolio projects"
ON public.portfolio_projects
FOR INSERT
TO authenticated
WITH CHECK (
  portfolio_id IN (
    SELECT id FROM public.portfolios 
    WHERE designer_id = auth.uid()
  )
);

-- Also recreate the other policies for consistency
DROP POLICY IF EXISTS "Designers can view own portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Designers can update own portfolio projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Designers can delete own portfolio projects" ON public.portfolio_projects;

CREATE POLICY "Designers can view own portfolio projects"
ON public.portfolio_projects
FOR SELECT
TO authenticated
USING (
  portfolio_id IN (
    SELECT id FROM public.portfolios 
    WHERE designer_id = auth.uid()
  )
);

CREATE POLICY "Designers can update own portfolio projects"
ON public.portfolio_projects
FOR UPDATE
TO authenticated
USING (
  portfolio_id IN (
    SELECT id FROM public.portfolios 
    WHERE designer_id = auth.uid()
  )
)
WITH CHECK (
  portfolio_id IN (
    SELECT id FROM public.portfolios 
    WHERE designer_id = auth.uid()
  )
);

CREATE POLICY "Designers can delete own portfolio projects"
ON public.portfolio_projects
FOR DELETE
TO authenticated
USING (
  portfolio_id IN (
    SELECT id FROM public.portfolios 
    WHERE designer_id = auth.uid()
  )
);

-- Ensure portfolio_assets table has proper RLS policies
DROP POLICY IF EXISTS "Designers can insert own portfolio assets" ON public.portfolio_assets;

CREATE POLICY "Designers can insert own portfolio assets"
ON public.portfolio_assets
FOR INSERT
TO authenticated
WITH CHECK (designer_id = auth.uid());

-- Refresh grants
GRANT ALL ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_assets TO authenticated;
GRANT SELECT ON public.portfolio_projects TO anon;
GRANT SELECT ON public.portfolio_assets TO anon;

-- Add comment
DO $$
BEGIN
  RAISE NOTICE 'Fixed RLS policies for portfolio management to resolve unauthorized issues';
  RAISE NOTICE 'Users can now properly create projects in their own portfolios';
END $$;