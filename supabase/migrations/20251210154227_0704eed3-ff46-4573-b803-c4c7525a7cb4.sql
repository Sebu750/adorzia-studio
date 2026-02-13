-- Fix 1: Replace overly permissive INSERT policies

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "System can insert auth logs" ON public.auth_logs;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'portfolio_analytics') THEN
    DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.portfolio_analytics;
  END IF;
END $$;

-- Create more restrictive auth_logs INSERT policy (only authenticated users for their own logs)
CREATE POLICY "Users can insert own auth logs"
ON public.auth_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Create more restrictive notifications INSERT policy (only admins can create notifications)
CREATE POLICY "Admins can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Create more restrictive portfolio_analytics INSERT policy (only for public portfolios or own portfolios)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'portfolio_analytics') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can insert analytics for accessible portfolios"
    ON public.portfolio_analytics
    FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM portfolios p
        WHERE p.id = portfolio_analytics.portfolio_id
        AND (
          p.designer_id = auth.uid()
          OR (p.status = ''published'' AND p.visibility IN (''public'', ''marketplace_only''))
        )
      )
    )';
  END IF;
END $$;

-- Fix 2: Fix team_members and teams self-referencing policy bugs

-- Drop existing buggy policies
DROP POLICY IF EXISTS "Members can view team members" ON public.team_members;
DROP POLICY IF EXISTS "Team leads can manage members" ON public.team_members;
DROP POLICY IF EXISTS "Team members can view their teams" ON public.teams;

-- Create corrected team_members SELECT policy
CREATE POLICY "Members can view team members"
ON public.team_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members tm2
    WHERE tm2.team_id = team_members.team_id
    AND tm2.user_id = auth.uid()
  )
);

-- Create corrected team_members ALL policy for leads
CREATE POLICY "Team leads can manage members"
ON public.team_members
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM team_members tm2
    WHERE tm2.team_id = team_members.team_id
    AND tm2.user_id = auth.uid()
    AND tm2.role = 'lead'::team_role
  )
);

-- Create corrected teams SELECT policy
CREATE POLICY "Team members can view their teams"
ON public.teams
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = teams.id
    AND tm.user_id = auth.uid()
  )
  OR created_by = auth.uid()
);