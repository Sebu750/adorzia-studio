-- System Optimization Migration
-- Focus: Performance (RPCs), Data Integrity (Triggers), and Schema Completeness

-- 1. Enhance profiles with missing fields from mockups
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS manufacturing_countries TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sustainability_practices TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS artist_statement TEXT;

-- 2. Generic updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = 'public', 'pg_temp';

-- 3. Apply updated_at triggers to all tables that have the column
DO $$ 
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND column_name = 'updated_at'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t);
  END LOOP;
END $$;

-- 4. Optimized RPC for Designer Analytics
-- Consolidates multiple queries into a single call
CREATE OR REPLACE FUNCTION public.get_designer_stats(designer_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_earn NUMERIC;
  monthly_earn NUMERIC;
  total_sales_count BIGINT;
  total_views BIGINT;
  month_start TIMESTAMPTZ := date_trunc('month', now());
BEGIN
  -- Total Earnings
  SELECT COALESCE(SUM(amount), 0) INTO total_earn FROM public.earnings WHERE designer_id = designer_uuid;
  
  -- Monthly Earnings
  SELECT COALESCE(SUM(amount), 0) INTO monthly_earn FROM public.earnings 
  WHERE designer_id = designer_uuid AND created_at >= month_start;
  
  -- Products Sold (sum of quantity_sold)
  SELECT COALESCE(SUM(quantity_sold), 0) INTO total_sales_count 
  FROM public.product_sales s
  JOIN public.marketplace_products p ON s.product_id = p.id
  WHERE p.designer_id = designer_uuid;
  
  -- Portfolio Views
  SELECT COUNT(*) INTO total_views 
  FROM public.portfolio_analytics a
  JOIN public.portfolios p ON a.portfolio_id = p.id
  WHERE p.designer_id = designer_uuid AND a.event_type = 'view';

  result := jsonb_build_object(
    'total_earnings', total_earn,
    'monthly_earnings', monthly_earn,
    'products_sold', total_sales_count,
    'product_views', total_views
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = 'public', 'pg_temp';

-- 5. Optimized RPC for Admin Dashboard
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  now_time TIMESTAMPTZ := now();
  day_start TIMESTAMPTZ := date_trunc('day', now_time);
  week_start TIMESTAMPTZ := date_trunc('week', now_time);
  month_start TIMESTAMPTZ := date_trunc('month', now_time);
BEGIN
  result := jsonb_build_object(
    'total_designers', (SELECT COUNT(*) FROM public.profiles),
    'new_signups_today', (SELECT COUNT(*) FROM public.profiles WHERE created_at >= day_start),
    'new_signups_week', (SELECT COUNT(*) FROM public.profiles WHERE created_at >= week_start),
    'new_signups_month', (SELECT COUNT(*) FROM public.profiles WHERE created_at >= month_start),
    'pending_submissions', (SELECT COUNT(*) FROM public.stylebox_submissions WHERE status = 'submitted'),
    'pending_publications', (SELECT COUNT(*) FROM public.portfolio_publications WHERE status = 'pending'),
    'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM public.earnings),
    'revenue_this_month', (SELECT COALESCE(SUM(amount), 0) FROM public.earnings WHERE created_at >= month_start)
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
