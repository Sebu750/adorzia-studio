-- Add team challenge columns to styleboxes
ALTER TABLE styleboxes ADD COLUMN IF NOT EXISTS is_team_challenge boolean DEFAULT false;
ALTER TABLE styleboxes ADD COLUMN IF NOT EXISTS team_size integer DEFAULT null;
ALTER TABLE styleboxes ADD COLUMN IF NOT EXISTS team_role_requirements jsonb DEFAULT '[]'::jsonb;
ALTER TABLE styleboxes ADD COLUMN IF NOT EXISTS minimum_team_rank_order integer DEFAULT null;

-- Create team stylebox submissions table
CREATE TABLE public.team_stylebox_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stylebox_id uuid REFERENCES styleboxes(id) ON DELETE CASCADE NOT NULL,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'forming',
  started_at timestamptz,
  submitted_at timestamptz,
  deadline timestamptz,
  role_assignments jsonb DEFAULT '{}'::jsonb,
  role_submissions jsonb DEFAULT '{}'::jsonb,
  admin_feedback jsonb DEFAULT '{}'::jsonb,
  total_score integer,
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(stylebox_id, team_id)
);

-- Create achievement badges table
CREATE TABLE public.achievement_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text DEFAULT '🎖️',
  category text,
  criteria jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create user achievement badges junction table
CREATE TABLE public.user_achievement_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid REFERENCES achievement_badges(id) ON DELETE CASCADE NOT NULL,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  awarded_by uuid,
  team_submission_id uuid REFERENCES team_stylebox_submissions(id) ON DELETE SET NULL,
  notes text,
  UNIQUE(user_id, badge_id, team_submission_id)
);

-- Enable RLS
ALTER TABLE team_stylebox_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievement_badges ENABLE ROW LEVEL SECURITY;

-- RLS for team_stylebox_submissions
CREATE POLICY "Team members can view their submissions"
ON team_stylebox_submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = team_stylebox_submissions.team_id
    AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Team leads can create submissions"
ON team_stylebox_submissions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = team_stylebox_submissions.team_id
    AND tm.user_id = auth.uid()
    AND tm.role = 'lead'
  )
);

CREATE POLICY "Team leads can update submissions"
ON team_stylebox_submissions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = team_stylebox_submissions.team_id
    AND tm.user_id = auth.uid()
    AND tm.role = 'lead'
  )
);

CREATE POLICY "Admins can manage team submissions"
ON team_stylebox_submissions FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'superadmin'));

-- RLS for achievement_badges
CREATE POLICY "Anyone can view badges"
ON achievement_badges FOR SELECT
USING (true);

CREATE POLICY "Admins can manage badges"
ON achievement_badges FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'superadmin'));

-- RLS for user_achievement_badges
CREATE POLICY "Users can view own badges"
ON user_achievement_badges FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can view team member badges"
ON user_achievement_badges FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_stylebox_submissions tss
    JOIN team_members tm ON tm.team_id = tss.team_id
    WHERE tss.id = user_achievement_badges.team_submission_id
    AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage user badges"
ON user_achievement_badges FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'superadmin'));

-- Insert default achievement badges
INSERT INTO achievement_badges (name, description, icon, category) VALUES
('Golden Scissors', 'Your patterns are production-ready.', '✂️', 'master_cutter'),
('Needle-Master', 'Your embroidery looks 100% hand-touched.', '🧵', 'artisan_weaver'),
('Sultan of Sway', 'Your fabric physics are poetic.', '💫', 'draping_specialist'),
('Couture Visionary', 'Your brand storytelling is world-class.', '👁️', 'creative_director'),
('LEGACY ATELIER', 'Your team is now a Rank 4 candidate.', '👑', 'team');

-- Add updated_at trigger
CREATE TRIGGER update_team_submissions_updated_at
BEFORE UPDATE ON team_stylebox_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();