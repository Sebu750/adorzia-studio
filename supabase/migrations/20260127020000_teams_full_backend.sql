-- =====================================================
-- TEAMS FULL BACKEND IMPLEMENTATION
-- =====================================================

-- Add missing columns to teams table
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS max_members INTEGER DEFAULT 5;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT true;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS completed_challenges INTEGER DEFAULT 0;

-- Create team_invitations table
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invitee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  UNIQUE(team_id, invitee_id, status)
);

ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Create team_join_requests table (for open teams)
CREATE TABLE IF NOT EXISTS public.team_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES auth.users(id),
  UNIQUE(team_id, user_id, status)
);

ALTER TABLE public.team_join_requests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Team Invitations Policies
CREATE POLICY "Users can view own invitations" ON public.team_invitations
  FOR SELECT TO authenticated
  USING (invitee_id = (select auth.uid()) OR inviter_id = (select auth.uid()));

CREATE POLICY "Team leads can create invitations" ON public.team_invitations
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = team_invitations.team_id
      AND user_id = (select auth.uid())
      AND role = 'lead'
    )
  );

CREATE POLICY "Invitees can update their invitations" ON public.team_invitations
  FOR UPDATE TO authenticated
  USING (invitee_id = (select auth.uid()))
  WITH CHECK (invitee_id = (select auth.uid()));

CREATE POLICY "Inviters can cancel invitations" ON public.team_invitations
  FOR UPDATE TO authenticated
  USING (inviter_id = (select auth.uid()) AND status = 'pending')
  WITH CHECK (inviter_id = (select auth.uid()));

-- Team Join Requests Policies
CREATE POLICY "Users can view own join requests" ON public.team_join_requests
  FOR SELECT TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = team_join_requests.team_id
      AND user_id = (select auth.uid())
      AND role = 'lead'
    )
  );

CREATE POLICY "Users can create join requests" ON public.team_join_requests
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Team leads can manage join requests" ON public.team_join_requests
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = team_join_requests.team_id
      AND user_id = (select auth.uid())
      AND role = 'lead'
    )
  );

-- Update teams policies to allow public viewing of open teams
DROP POLICY IF EXISTS "Team members can view their teams" ON public.teams;

CREATE POLICY "Users can view open teams or their own teams" ON public.teams
  FOR SELECT TO authenticated
  USING (
    is_open = true
    OR id::text LIKE '00000000-%'  -- Allow viewing preview teams
    OR EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = teams.id
      AND user_id = (select auth.uid())
    )
    OR created_by = (select auth.uid())
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to get team stats
CREATE OR REPLACE FUNCTION get_team_stats(team_uuid UUID)
RETURNS TABLE (
  member_count BIGINT,
  pending_invitations BIGINT,
  pending_requests BIGINT,
  completed_challenges INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM team_members WHERE team_id = team_uuid),
    (SELECT COUNT(*) FROM team_invitations WHERE team_id = team_uuid AND status = 'pending'),
    (SELECT COUNT(*) FROM team_join_requests WHERE team_id = team_uuid AND status = 'pending'),
    COALESCE(t.completed_challenges, 0)
  FROM teams t
  WHERE t.id = team_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public', 'pg_temp';

-- Function to check if user can join team
CREATE OR REPLACE FUNCTION can_join_team(team_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  team_full BOOLEAN;
  already_member BOOLEAN;
  already_in_team BOOLEAN;
BEGIN
  -- Check if team is full
  SELECT (SELECT COUNT(*) FROM team_members WHERE team_id = team_uuid) >= max_members
  INTO team_full
  FROM teams WHERE id = team_uuid;
  
  -- Check if already a member
  SELECT EXISTS(
    SELECT 1 FROM team_members 
    WHERE team_id = team_uuid AND user_id = user_uuid
  ) INTO already_member;
  
  -- Check if user is in any team
  SELECT EXISTS(
    SELECT 1 FROM team_members 
    WHERE user_id = user_uuid
  ) INTO already_in_team;
  
  RETURN NOT team_full AND NOT already_member AND NOT already_in_team;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public', 'pg_temp';

-- Trigger to update team completed_challenges
CREATE OR REPLACE FUNCTION increment_team_completed_challenges()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE teams 
    SET completed_challenges = completed_challenges + 1
    WHERE id = NEW.team_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = 'public', 'pg_temp';

DROP TRIGGER IF EXISTS trigger_increment_team_challenges ON team_stylebox_submissions;
CREATE TRIGGER trigger_increment_team_challenges
  AFTER UPDATE ON team_stylebox_submissions
  FOR EACH ROW
  EXECUTE FUNCTION increment_team_completed_challenges();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_team_invitations_invitee ON team_invitations(invitee_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_team_invitations_team ON team_invitations(team_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_team_join_requests_team ON team_join_requests(team_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_team_join_requests_user ON team_join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_teams_open ON teams(is_open) WHERE is_open = true;
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);

-- =====================================================
-- ADMIN POLICIES
-- =====================================================

CREATE POLICY "Admins can view all invitations" ON public.team_invitations
  FOR SELECT TO authenticated
  USING (has_role((select auth.uid()), 'admin') OR has_role((select auth.uid()), 'superadmin'));

CREATE POLICY "Admins can manage all join requests" ON public.team_join_requests
  FOR ALL TO authenticated
  USING (has_role((select auth.uid()), 'admin') OR has_role((select auth.uid()), 'superadmin'));

COMMENT ON TABLE team_invitations IS 'Stores team invitations sent by team leads to specific users';
COMMENT ON TABLE team_join_requests IS 'Stores join requests from users wanting to join open teams';
