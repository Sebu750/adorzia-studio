-- Fix RLS policy to allow viewing preview teams
-- Preview teams have is_open = false but should be visible to all authenticated users

DROP POLICY IF EXISTS "Users can view open teams or their own teams" ON public.teams;

CREATE POLICY "Users can view open teams or their own teams" ON public.teams
  FOR SELECT TO authenticated
  USING (
    is_open = true
    OR id::text LIKE '00000000-%'  -- Allow viewing preview teams (UUID starts with 00000000-)
    OR EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = teams.id
      AND user_id = auth.uid()
    )
    OR created_by = auth.uid()
  );
