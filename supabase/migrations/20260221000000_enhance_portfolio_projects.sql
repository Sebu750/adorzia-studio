-- Migration: Enhance portfolio_projects table with manual project fields
-- Created: 2026-02-21
-- Purpose: Add fields for enhanced manual project uploads (collection, year, fabric, inspiration)

-- Add new columns to portfolio_projects table
ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS collection_name TEXT,
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS fabric_details TEXT,
  ADD COLUMN IF NOT EXISTS inspiration TEXT,
  ADD COLUMN IF NOT EXISTS marketplace_status TEXT DEFAULT 'not_submitted',
  ADD COLUMN IF NOT EXISTS is_stylebox_certified BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.portfolio_projects.collection_name IS 'Collection name for manual projects (e.g., Spring 2026)';
COMMENT ON COLUMN public.portfolio_projects.year IS 'Year of the project/collection';
COMMENT ON COLUMN public.portfolio_projects.fabric_details IS 'Description of fabrics and materials used';
COMMENT ON COLUMN public.portfolio_projects.inspiration IS 'Inspiration behind the design';
COMMENT ON COLUMN public.portfolio_projects.marketplace_status IS 'Marketplace eligibility status: not_submitted, pending, approved, rejected';
COMMENT ON COLUMN public.portfolio_projects.is_stylebox_certified IS 'Whether this project is StyleBox certified';

-- Create index for marketplace status queries
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_marketplace_status 
  ON public.portfolio_projects(marketplace_status) 
  WHERE marketplace_status = 'approved';

-- Create index for year queries
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_year 
  ON public.portfolio_projects(year DESC);

-- Create index for collection name searches
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_collection 
  ON public.portfolio_projects(collection_name);

-- Refresh grants
GRANT ALL ON public.portfolio_projects TO authenticated;
GRANT SELECT ON public.portfolio_projects TO anon;

-- Add comment
DO $$
BEGIN
  RAISE NOTICE 'Enhanced portfolio_projects table with manual project fields and marketplace status';
END $$;
