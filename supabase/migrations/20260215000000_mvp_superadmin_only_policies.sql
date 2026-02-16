-- MVP: Simplify to single superadmin role
-- This migration updates all RLS policies to only accept 'superadmin' role
-- Admin and Curator roles are deprecated for MVP

-- Create security definer function to avoid recursion in RLS policies
CREATE OR REPLACE FUNCTION public.is_superadmin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Update admin_profiles policies
DROP POLICY IF EXISTS "Admins can view all admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Superadmins can manage admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admins can update own profile" ON public.admin_profiles;

CREATE POLICY "Superadmins can view all admin profiles" ON public.admin_profiles
  FOR SELECT TO authenticated
  USING (public.is_superadmin(auth.uid()));

CREATE POLICY "Superadmins can manage admin profiles" ON public.admin_profiles
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update user_roles policies
DROP POLICY IF EXISTS "Admins can manage user_roles" ON public.user_roles;

CREATE POLICY "Superadmins can manage user_roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update marketplace_products policies
DROP POLICY IF EXISTS "Admins can manage marketplace_products" ON public.marketplace_products;

CREATE POLICY "Superadmins can manage marketplace_products" ON public.marketplace_products
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update marketplace_collections policies
DROP POLICY IF EXISTS "Admins can manage marketplace_collections" ON public.marketplace_collections;

CREATE POLICY "Superadmins can manage marketplace_collections" ON public.marketplace_collections
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update marketplace_categories policies
DROP POLICY IF EXISTS "Admins can manage marketplace_categories" ON public.marketplace_categories;

CREATE POLICY "Superadmins can manage marketplace_categories" ON public.marketplace_categories
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update marketplace_orders policies
DROP POLICY IF EXISTS "Admins can manage marketplace_orders" ON public.marketplace_orders;

CREATE POLICY "Superadmins can manage marketplace_orders" ON public.marketplace_orders
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update styleboxes policies
DROP POLICY IF EXISTS "Admins can manage styleboxes" ON public.styleboxes;

CREATE POLICY "Superadmins can manage styleboxes" ON public.styleboxes
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update stylebox_submissions policies
DROP POLICY IF EXISTS "Admins can manage submissions" ON public.stylebox_submissions;

CREATE POLICY "Superadmins can manage submissions" ON public.stylebox_submissions
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update portfolios policies
DROP POLICY IF EXISTS "Admins can view all portfolios" ON public.portfolios;

CREATE POLICY "Superadmins can view all portfolios" ON public.portfolios
  FOR SELECT TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update portfolio_publications policies
DROP POLICY IF EXISTS "Admins can manage publications" ON public.portfolio_publications;

CREATE POLICY "Superadmins can manage publications" ON public.portfolio_publications
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update ranks policies
DROP POLICY IF EXISTS "Admins can manage ranks" ON public.ranks;

CREATE POLICY "Superadmins can manage ranks" ON public.ranks
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update user_badges policies
DROP POLICY IF EXISTS "Admins can manage badges" ON public.user_badges;

CREATE POLICY "Superadmins can manage badges" ON public.user_badges
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update profiles policies for admin access
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Superadmins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update founding_designers_submissions policies
DROP POLICY IF EXISTS "Admins can manage founding submissions" ON public.founding_designers_submissions;

CREATE POLICY "Superadmins can manage founding submissions" ON public.founding_designers_submissions
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update articles/blog policies
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;

CREATE POLICY "Superadmins can manage articles" ON public.articles
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update jobs policies
DROP POLICY IF EXISTS "Admins can manage jobs" ON public.jobs;

CREATE POLICY "Superadmins can manage jobs" ON public.jobs
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update notifications policies
DROP POLICY IF EXISTS "Admins can send notifications" ON public.notifications;

CREATE POLICY "Superadmins can send notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (public.is_superadmin(auth.uid()));

-- Update admin_logs policies
DROP POLICY IF EXISTS "Admins can view logs" ON public.admin_logs;

CREATE POLICY "Superadmins can view logs" ON public.admin_logs
  FOR SELECT TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Update storage policies for admin-assets bucket
DROP POLICY IF EXISTS "Admins can upload to admin-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update admin-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete admin-assets" ON storage.objects;

CREATE POLICY "Superadmins can manage admin-assets" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'admin-assets' AND
    public.is_superadmin(auth.uid())
  );

-- Update storage policies for marketplace-products bucket
DROP POLICY IF EXISTS "Admins can upload marketplace images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update marketplace images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete marketplace images" ON storage.objects;

CREATE POLICY "Superadmins can manage marketplace images" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'marketplace-products' AND
    public.is_superadmin(auth.uid())
  );

-- Add comment documenting the MVP simplification
COMMENT ON TABLE public.user_roles IS 'MVP: Only superadmin role is used. Admin and curator roles deprecated.';
