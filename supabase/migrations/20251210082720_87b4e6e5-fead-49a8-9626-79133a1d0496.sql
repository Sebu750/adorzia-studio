-- Create publication source type enum (drop first if exists to avoid conflicts)
DO $$ BEGIN
  CREATE TYPE publication_source AS ENUM ('stylebox', 'walkthrough', 'independent', 'portfolio');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create publication decision enum
DO $$ BEGIN
  CREATE TYPE publication_decision AS ENUM ('pending', 'approved', 'rejected', 'revision_requested');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create marketplace status enum
DO $$ BEGIN
  CREATE TYPE marketplace_status AS ENUM (
    'pending_handoff',
    'awaiting_sampling',
    'sampling_approved',
    'production_started',
    'listing_scheduled',
    'published',
    'discontinued'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update portfolio_publications with new fields
ALTER TABLE public.portfolio_publications
ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'portfolio',
ADD COLUMN IF NOT EXISTS source_id uuid DEFAULT NULL,
ADD COLUMN IF NOT EXISTS decision text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS decision_notes text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS marketplace_status text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS marketplace_package jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS marketplace_id uuid DEFAULT NULL,
ADD COLUMN IF NOT EXISTS quality_rating integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS locked_at timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS designer_revenue_share integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS revenue_override boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS submission_files jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS design_metadata jsonb DEFAULT '{}'::jsonb;

-- Create publication_reviews table for audit trail
CREATE TABLE IF NOT EXISTS public.publication_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  publication_id uuid NOT NULL REFERENCES public.portfolio_publications(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL,
  action text NOT NULL,
  notes text DEFAULT NULL,
  quality_rating integer DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on publication_reviews
ALTER TABLE public.publication_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for publication_reviews (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Admins can manage publication reviews" ON public.publication_reviews;
CREATE POLICY "Admins can manage publication reviews"
ON public.publication_reviews
FOR ALL
USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'superadmin'::app_role));

DROP POLICY IF EXISTS "Designers can view reviews of their publications" ON public.publication_reviews;
CREATE POLICY "Designers can view reviews of their publications"
ON public.publication_reviews
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM portfolio_publications pp
  JOIN portfolios p ON p.id = pp.portfolio_id
  WHERE pp.id = publication_reviews.publication_id
  AND p.designer_id = (select auth.uid())
));

-- Create indexes for faster publication queries
CREATE INDEX IF NOT EXISTS idx_publications_decision ON portfolio_publications(decision);
CREATE INDEX IF NOT EXISTS idx_publications_marketplace_status ON portfolio_publications(marketplace_status);
CREATE INDEX IF NOT EXISTS idx_publication_reviews_publication ON publication_reviews(publication_id);