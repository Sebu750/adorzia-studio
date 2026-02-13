-- Update publication_status enum to support full workflow
-- First, we need to create a new enum with all statuses and migrate the data

-- Create the new comprehensive publication status enum
CREATE TYPE public.publication_status_v2 AS ENUM (
  'draft',
  'pending_review',
  'revision_requested',
  'approved',
  'sampling',
  'sample_ready',
  'costing_ready',
  'pre_production',
  'marketplace_pending',
  'listing_preview',
  'published',
  'rejected'
);

-- Add new columns to portfolio_publications for full workflow support
ALTER TABLE public.portfolio_publications
ADD COLUMN IF NOT EXISTS status_v2 publication_status_v2 DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS production_stage TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sampling_status TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS techpack_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS costing_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS listing_preview_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS auto_approve_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS designer_approved_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS assigned_team TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS priority_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS designer_notes TEXT DEFAULT NULL;

-- Migrate existing data to new status column
UPDATE public.portfolio_publications
SET status_v2 = CASE 
  WHEN status = 'pending' THEN 'pending_review'::publication_status_v2
  WHEN status = 'approved' THEN 'approved'::publication_status_v2
  WHEN status = 'rejected' THEN 'rejected'::publication_status_v2
  WHEN status = 'published' THEN 'published'::publication_status_v2
  ELSE 'draft'::publication_status_v2
END;

-- Create production_queue table for tracking items through stages
CREATE TABLE IF NOT EXISTS public.production_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES public.portfolio_publications(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'submission',
  assigned_to UUID REFERENCES auth.users(id),
  assigned_team TEXT,
  priority INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create marketplace_handoffs table for tracking marketplace integration
CREATE TABLE IF NOT EXISTS public.marketplace_handoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES public.portfolio_publications(id) ON DELETE CASCADE,
  marketplace_product_id UUID REFERENCES public.marketplace_products(id),
  handoff_package JSONB NOT NULL DEFAULT '{}'::jsonb,
  listing_title TEXT,
  listing_description TEXT,
  listing_images JSONB DEFAULT '[]'::jsonb,
  listing_variants JSONB DEFAULT '[]'::jsonb,
  final_price NUMERIC DEFAULT 0,
  designer_revenue_share INTEGER,
  designer_approved BOOLEAN DEFAULT false,
  designer_approved_at TIMESTAMP WITH TIME ZONE,
  auto_approved BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create production_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.production_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES public.portfolio_publications(id) ON DELETE CASCADE,
  queue_id UUID REFERENCES public.production_queue(id),
  action TEXT NOT NULL,
  from_stage TEXT,
  to_stage TEXT,
  performed_by UUID NOT NULL,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.production_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_handoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for production_queue
CREATE POLICY "Admins can manage production queue"
ON public.production_queue FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Designers can view own queue items"
ON public.production_queue FOR SELECT
USING (EXISTS (
  SELECT 1 FROM portfolio_publications pp
  JOIN portfolios p ON p.id = pp.portfolio_id
  WHERE pp.id = production_queue.publication_id AND p.designer_id = auth.uid()
));

-- RLS policies for marketplace_handoffs
CREATE POLICY "Admins can manage marketplace handoffs"
ON public.marketplace_handoffs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Designers can view own handoffs"
ON public.marketplace_handoffs FOR SELECT
USING (EXISTS (
  SELECT 1 FROM portfolio_publications pp
  JOIN portfolios p ON p.id = pp.portfolio_id
  WHERE pp.id = marketplace_handoffs.publication_id AND p.designer_id = auth.uid()
));

CREATE POLICY "Designers can update own handoffs for approval"
ON public.marketplace_handoffs FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM portfolio_publications pp
  JOIN portfolios p ON p.id = pp.portfolio_id
  WHERE pp.id = marketplace_handoffs.publication_id AND p.designer_id = auth.uid()
));

-- RLS policies for production_logs
CREATE POLICY "Admins can manage production logs"
ON public.production_logs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Designers can view own production logs"
ON public.production_logs FOR SELECT
USING (EXISTS (
  SELECT 1 FROM portfolio_publications pp
  JOIN portfolios p ON p.id = pp.portfolio_id
  WHERE pp.id = production_logs.publication_id AND p.designer_id = auth.uid()
));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_production_queue_publication ON public.production_queue(publication_id);
CREATE INDEX IF NOT EXISTS idx_production_queue_stage ON public.production_queue(stage);
CREATE INDEX IF NOT EXISTS idx_marketplace_handoffs_publication ON public.marketplace_handoffs(publication_id);
CREATE INDEX IF NOT EXISTS idx_production_logs_publication ON public.production_logs(publication_id);

-- Add trigger for updated_at on new tables
CREATE TRIGGER update_production_queue_updated_at
BEFORE UPDATE ON public.production_queue
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_handoffs_updated_at
BEFORE UPDATE ON public.marketplace_handoffs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();