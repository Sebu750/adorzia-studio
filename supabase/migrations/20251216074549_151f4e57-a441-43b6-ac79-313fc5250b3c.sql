-- Add new columns to ranks table
ALTER TABLE public.ranks 
ADD COLUMN IF NOT EXISTS min_weighted_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_time_in_rank_days integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_foundation boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS bonus_percentage integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_usd integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS max_slots integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS description text DEFAULT NULL;

-- Update existing ranks with new values
UPDATE public.ranks SET 
  revenue_share_percent = 50,
  is_foundation = true,
  bonus_percentage = 5,
  price_usd = 299,
  max_slots = 1000,
  min_weighted_score = 0,
  description = 'Exclusive founding members with lifetime premium benefits'
WHERE rank_order = 0;

UPDATE public.ranks SET 
  revenue_share_percent = 45,
  is_foundation = true,
  bonus_percentage = 10,
  price_usd = 499,
  max_slots = 500,
  min_weighted_score = 0,
  description = 'Early adopters who shaped the platform'
WHERE rank_order = 1;

UPDATE public.ranks SET 
  revenue_share_percent = 10,
  min_weighted_score = 30,
  min_time_in_rank_days = 0,
  description = 'Entry-level designers; basic skill demonstration'
WHERE rank_order = 2;

UPDATE public.ranks SET 
  revenue_share_percent = 15,
  min_weighted_score = 46.5,
  min_time_in_rank_days = 30,
  description = 'Requires multiple Medium/Hard Styleboxes completed'
WHERE rank_order = 3;

UPDATE public.ranks SET 
  revenue_share_percent = 20,
  min_weighted_score = 72.5,
  min_time_in_rank_days = 60,
  description = 'Must show portfolio growth and consistent quality'
WHERE rank_order = 4;

UPDATE public.ranks SET 
  revenue_share_percent = 28,
  min_weighted_score = 108.75,
  min_time_in_rank_days = 90,
  description = 'At least 1 publication + sustained selling performance'
WHERE rank_order = 5;

UPDATE public.ranks SET 
  revenue_share_percent = 34,
  min_weighted_score = 145.5,
  min_time_in_rank_days = 180,
  description = '≥2 publications + 1 year of consistent sales growth'
WHERE rank_order = 6;

UPDATE public.ranks SET 
  revenue_share_percent = 40,
  min_weighted_score = 190.5,
  min_time_in_rank_days = 365,
  description = '≥3 publications + 2+ years sustained high-quality performance'
WHERE rank_order = 7;

-- Create designer_scores table
CREATE TABLE public.designer_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  designer_id UUID NOT NULL UNIQUE,
  stylebox_score numeric NOT NULL DEFAULT 0,
  portfolio_score numeric NOT NULL DEFAULT 0,
  publication_score numeric NOT NULL DEFAULT 0,
  selling_score numeric NOT NULL DEFAULT 0,
  weighted_total numeric GENERATED ALWAYS AS (
    (stylebox_score * 0.30) + 
    (portfolio_score * 0.35) + 
    (publication_score * 0.15) + 
    (selling_score * 0.20)
  ) STORED,
  last_calculated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on designer_scores
ALTER TABLE public.designer_scores ENABLE ROW LEVEL SECURITY;

-- RLS policies for designer_scores
CREATE POLICY "Designers can view own scores"
ON public.designer_scores
FOR SELECT
USING (designer_id = auth.uid());

CREATE POLICY "Admins can manage all scores"
ON public.designer_scores
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Create foundation_purchases table
CREATE TABLE public.foundation_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  designer_id UUID NOT NULL,
  rank_id UUID NOT NULL REFERENCES public.ranks(id),
  stripe_payment_id text,
  amount_usd integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  purchased_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(designer_id, rank_id)
);

-- Enable RLS on foundation_purchases
ALTER TABLE public.foundation_purchases ENABLE ROW LEVEL SECURITY;

-- RLS policies for foundation_purchases
CREATE POLICY "Designers can view own purchases"
ON public.foundation_purchases
FOR SELECT
USING (designer_id = auth.uid());

CREATE POLICY "Designers can create own purchases"
ON public.foundation_purchases
FOR INSERT
WITH CHECK (designer_id = auth.uid());

CREATE POLICY "Admins can manage all purchases"
ON public.foundation_purchases
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Create stylebox_evaluation_scores table
CREATE TABLE public.stylebox_evaluation_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.stylebox_submissions(id) ON DELETE CASCADE,
  trend_alignment_score integer NOT NULL DEFAULT 0,
  creative_innovation_score integer NOT NULL DEFAULT 0,
  technical_execution_score integer NOT NULL DEFAULT 0,
  craftsmanship_score integer NOT NULL DEFAULT 0,
  quality_multiplier numeric NOT NULL DEFAULT 1.0,
  timeliness_bonus numeric NOT NULL DEFAULT 0,
  difficulty_points integer NOT NULL DEFAULT 10,
  final_weighted_score numeric GENERATED ALWAYS AS (
    difficulty_points * quality_multiplier * (1 + timeliness_bonus)
  ) STORED,
  evaluated_by UUID,
  evaluated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(submission_id)
);

-- Enable RLS on stylebox_evaluation_scores
ALTER TABLE public.stylebox_evaluation_scores ENABLE ROW LEVEL SECURITY;

-- RLS policies for stylebox_evaluation_scores
CREATE POLICY "Designers can view own evaluation scores"
ON public.stylebox_evaluation_scores
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.stylebox_submissions s
  WHERE s.id = stylebox_evaluation_scores.submission_id
  AND s.designer_id = auth.uid()
));

CREATE POLICY "Admins can manage evaluation scores"
ON public.stylebox_evaluation_scores
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Create trigger for updated_at on designer_scores
CREATE TRIGGER update_designer_scores_updated_at
BEFORE UPDATE ON public.designer_scores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_designer_scores_designer_id ON public.designer_scores(designer_id);
CREATE INDEX idx_foundation_purchases_designer_id ON public.foundation_purchases(designer_id);
CREATE INDEX idx_stylebox_evaluation_scores_submission_id ON public.stylebox_evaluation_scores(submission_id);