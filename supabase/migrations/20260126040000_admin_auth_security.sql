-- Secure admin dashboard stats function
ALTER FUNCTION public.get_admin_dashboard_stats() OWNER TO postgres;
REVOKE ALL ON FUNCTION public.get_admin_dashboard_stats() FROM public;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_stats() TO authenticated;

-- Add check for admin role inside the function for defense in depth
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  now_time TIMESTAMPTZ := now();
  day_start TIMESTAMPTZ := date_trunc('day', now_time);
  week_start TIMESTAMPTZ := date_trunc('week', now_time);
  month_start TIMESTAMPTZ := date_trunc('month', now_time);
  is_admin BOOLEAN;
BEGIN
  -- Check if caller is admin or superadmin
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  ) INTO is_admin;

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

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

-- Enable realtime for tables used in admin dashboard
BEGIN;
  -- Add to supabase_realtime publication if not already there
  -- Note: These tables might already be added, but adding them again doesn't hurt or we can check
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
      ALTER PUBLICATION supabase_realtime ADD TABLE public.stylebox_submissions;
      ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_publications;
      ALTER PUBLICATION supabase_realtime ADD TABLE public.earnings;
    END IF;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL; -- Ignore if already added
  END $$;
COMMIT;

-- Ensure auth_logs and admin_logs have correct RLS for isolated admin client
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin roles (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_admin_or_superadmin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

DROP POLICY IF EXISTS "Admins can view all auth logs" ON public.auth_logs;
CREATE POLICY "Admins can view all auth logs" ON public.auth_logs
  FOR SELECT TO authenticated
  USING (public.is_admin_or_superadmin(auth.uid()));

DROP POLICY IF EXISTS "Anyone can insert auth logs" ON public.auth_logs;
CREATE POLICY "Anyone can insert auth logs" ON public.auth_logs
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage admin_logs" ON public.admin_logs;
CREATE POLICY "Admins can manage admin_logs" ON public.admin_logs
  FOR ALL TO authenticated
  USING (public.is_admin_or_superadmin(auth.uid()));
