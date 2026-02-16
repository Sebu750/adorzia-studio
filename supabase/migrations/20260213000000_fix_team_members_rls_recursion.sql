-- Fix infinite recursion in team_members RLS policies
-- The issue: The "Members can view team members" policy was querying team_members
-- within its own USING clause, causing infinite recursion

-- Drop the problematic policies first
DROP POLICY IF EXISTS "Members can view team members" ON public.team_members;
DROP POLICY IF EXISTS "Team leads can manage members" ON public.team_members;
DROP POLICY IF EXISTS "Users can view own membership" ON public.team_members;

-- Create a fixed policy that doesn't cause recursion
-- Users can view team members if they are a member of the same team
-- We use a security definer function to avoid the recursion
CREATE OR REPLACE FUNCTION public.is_team_member(team_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = team_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public', 'pg_temp';

-- Create the fixed policy using the security definer function
CREATE POLICY "Members can view team members" ON public.team_members
  FOR SELECT TO authenticated
  USING (public.is_team_member(team_id, auth.uid()));

-- Create function to check if user is team lead
CREATE OR REPLACE FUNCTION public.is_team_lead(team_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = team_uuid AND user_id = user_uuid AND role = 'lead'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public', 'pg_temp';

CREATE POLICY "Team leads can manage members" ON public.team_members
  FOR ALL TO authenticated
  USING (public.is_team_lead(team_id, auth.uid()));

-- Ensure users can view their own membership record (fallback)
CREATE POLICY "Users can view own membership" ON public.team_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
