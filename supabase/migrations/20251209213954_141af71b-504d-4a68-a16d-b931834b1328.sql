
-- Create enums
CREATE TYPE public.app_role AS ENUM ('admin', 'superadmin');
CREATE TYPE public.designer_category AS ENUM ('fashion', 'textile', 'jewelry');
CREATE TYPE public.subscription_tier AS ENUM ('basic', 'pro', 'elite');
CREATE TYPE public.user_status AS ENUM ('active', 'suspended', 'inactive');
CREATE TYPE public.stylebox_difficulty AS ENUM ('free', 'easy', 'medium', 'hard', 'insane');
CREATE TYPE public.content_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE public.submission_status AS ENUM ('submitted', 'approved', 'rejected');
CREATE TYPE public.publication_status AS ENUM ('pending', 'approved', 'rejected', 'published');
CREATE TYPE public.product_status AS ENUM ('draft', 'live', 'archived');
CREATE TYPE public.payout_status AS ENUM ('pending', 'processed', 'paid');
CREATE TYPE public.job_application_status AS ENUM ('applied', 'shortlisted', 'rejected', 'hired');
CREATE TYPE public.notification_type AS ENUM ('submission', 'earnings', 'portfolio', 'marketplace');
CREATE TYPE public.notification_status AS ENUM ('unread', 'read');
CREATE TYPE public.team_role AS ENUM ('member', 'lead');

-- User Roles table (for admin access - security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Ranks table
CREATE TABLE public.ranks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  revenue_share_percent INTEGER NOT NULL DEFAULT 10,
  requirements JSONB,
  priority_queue BOOLEAN NOT NULL DEFAULT false,
  rank_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  category designer_category DEFAULT 'fashion',
  subscription_tier subscription_tier DEFAULT 'basic',
  rank_id UUID REFERENCES public.ranks(id),
  status user_status DEFAULT 'active',
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User badges
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- StyleBoxes
CREATE TABLE public.styleboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty stylebox_difficulty NOT NULL DEFAULT 'easy',
  category designer_category NOT NULL DEFAULT 'fashion',
  created_by UUID REFERENCES auth.users(id),
  status content_status NOT NULL DEFAULT 'draft',
  brief JSONB,
  deliverables JSONB,
  xp_reward INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.styleboxes ENABLE ROW LEVEL SECURITY;

-- StyleBox submissions
CREATE TABLE public.stylebox_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stylebox_id UUID REFERENCES public.styleboxes(id) ON DELETE CASCADE NOT NULL,
  designer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  submission_files JSONB,
  description TEXT,
  status submission_status NOT NULL DEFAULT 'submitted',
  score INTEGER,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

ALTER TABLE public.stylebox_submissions ENABLE ROW LEVEL SECURITY;

-- Portfolios
CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  items JSONB,
  pdf_exported BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Portfolio publications
CREATE TABLE public.portfolio_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  status publication_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewer_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

ALTER TABLE public.portfolio_publications ENABLE ROW LEVEL SECURITY;

-- Marketplace products
CREATE TABLE public.marketplace_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_publication_id UUID REFERENCES public.portfolio_publications(id),
  title TEXT NOT NULL,
  description TEXT,
  images JSONB,
  variants JSONB,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  inventory_count INTEGER DEFAULT 0,
  designer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rank_visibility_score INTEGER DEFAULT 0,
  status product_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;

-- Product sales
CREATE TABLE public.product_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.marketplace_products(id) ON DELETE CASCADE NOT NULL,
  quantity_sold INTEGER NOT NULL DEFAULT 1,
  total_revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
  designer_share DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sale_date TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_sales ENABLE ROW LEVEL SECURITY;

-- Teams
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category designer_category DEFAULT 'fashion',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Team members
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role team_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Earnings
CREATE TABLE public.earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.marketplace_products(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  revenue_share_percent INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;

-- Payouts
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status payout_status NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMPTZ
);

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Jobs
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category designer_category DEFAULT 'fashion',
  posted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Job applications
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  designer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status job_application_status NOT NULL DEFAULT 'applied',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, designer_id)
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Admin logs
CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  message TEXT NOT NULL,
  status notification_status NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Roles: Only admins can manage
CREATE POLICY "Admins can manage user_roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Ranks: Public read, admin write
CREATE POLICY "Anyone can view ranks" ON public.ranks FOR SELECT USING (true);
CREATE POLICY "Admins can manage ranks" ON public.ranks
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Profiles: Users can manage own, admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- User Badges
CREATE POLICY "Users can view own badges" ON public.user_badges
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage badges" ON public.user_badges
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- StyleBoxes: Active ones public, admins manage all
CREATE POLICY "Anyone can view active styleboxes" ON public.styleboxes
  FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage styleboxes" ON public.styleboxes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- StyleBox Submissions
CREATE POLICY "Designers can view own submissions" ON public.stylebox_submissions
  FOR SELECT TO authenticated USING (designer_id = auth.uid());
CREATE POLICY "Designers can create submissions" ON public.stylebox_submissions
  FOR INSERT TO authenticated WITH CHECK (designer_id = auth.uid());
CREATE POLICY "Admins can manage submissions" ON public.stylebox_submissions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Portfolios
CREATE POLICY "Designers can manage own portfolios" ON public.portfolios
  FOR ALL TO authenticated USING (designer_id = auth.uid());
CREATE POLICY "Admins can view all portfolios" ON public.portfolios
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Portfolio Publications
CREATE POLICY "Designers can view own publications" ON public.portfolio_publications
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios WHERE id = portfolio_id AND designer_id = auth.uid()));
CREATE POLICY "Designers can create publications" ON public.portfolio_publications
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios WHERE id = portfolio_id AND designer_id = auth.uid()));
CREATE POLICY "Admins can manage publications" ON public.portfolio_publications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Marketplace Products: Published ones public
CREATE POLICY "Anyone can view live products" ON public.marketplace_products
  FOR SELECT USING (status = 'live');
CREATE POLICY "Designers can manage own products" ON public.marketplace_products
  FOR ALL TO authenticated USING (designer_id = auth.uid());
CREATE POLICY "Admins can manage all products" ON public.marketplace_products
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Product Sales: Designers see own, admins see all
CREATE POLICY "Designers can view own sales" ON public.product_sales
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.marketplace_products WHERE id = product_id AND designer_id = auth.uid()));
CREATE POLICY "Admins can manage sales" ON public.product_sales
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Teams
CREATE POLICY "Team members can view their teams" ON public.teams
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.team_members WHERE team_id = id AND user_id = auth.uid()) OR created_by = auth.uid());
CREATE POLICY "Users can create teams" ON public.teams
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Team creators can update" ON public.teams
  FOR UPDATE TO authenticated USING (created_by = auth.uid());

-- Team Members
CREATE POLICY "Members can view team members" ON public.team_members
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.team_id = team_id AND tm.user_id = auth.uid()));
CREATE POLICY "Team leads can manage members" ON public.team_members
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.team_id = team_id AND tm.user_id = auth.uid() AND tm.role = 'lead'));

-- Earnings
CREATE POLICY "Designers can view own earnings" ON public.earnings
  FOR SELECT TO authenticated USING (designer_id = auth.uid());
CREATE POLICY "Admins can manage earnings" ON public.earnings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Payouts
CREATE POLICY "Designers can view own payouts" ON public.payouts
  FOR SELECT TO authenticated USING (designer_id = auth.uid());
CREATE POLICY "Admins can manage payouts" ON public.payouts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Jobs: Public read
CREATE POLICY "Anyone can view jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Admins can manage jobs" ON public.jobs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Job Applications
CREATE POLICY "Designers can manage own applications" ON public.job_applications
  FOR ALL TO authenticated USING (designer_id = auth.uid());
CREATE POLICY "Admins can view all applications" ON public.job_applications
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Admin Logs: Only admins
CREATE POLICY "Admins can view logs" ON public.admin_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Admins can create logs" ON public.admin_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_ranks_updated_at BEFORE UPDATE ON public.ranks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_styleboxes_updated_at BEFORE UPDATE ON public.styleboxes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_marketplace_products_updated_at BEFORE UPDATE ON public.marketplace_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed default ranks
INSERT INTO public.ranks (name, revenue_share_percent, priority_queue, rank_order, requirements) VALUES
  ('F1', 75, true, 0, '{"type": "founder", "description": "Early founder rank"}'),
  ('F2', 65, true, 1, '{"type": "founder", "description": "Founder rank"}'),
  ('Novice', 10, false, 2, '{"xp": 0, "description": "Starting rank"}'),
  ('Apprentice', 15, false, 3, '{"xp": 500, "description": "Complete 5 styleboxes"}'),
  ('Designer', 20, false, 4, '{"xp": 1500, "description": "Complete 15 styleboxes"}'),
  ('Senior', 30, false, 5, '{"xp": 5000, "description": "Complete 50 styleboxes"}'),
  ('Lead', 40, false, 6, '{"xp": 15000, "description": "Complete 100 styleboxes"}'),
  ('Elite', 50, false, 7, '{"xp": 50000, "description": "Top tier designer"}');
