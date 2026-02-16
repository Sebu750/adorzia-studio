-- Fix auth_logs and role enum issues for MVP

-- 1. Update auth_logs table to allow admin portal actions
ALTER TABLE public.auth_logs DROP CONSTRAINT IF EXISTS auth_logs_action_check;

-- Add new constraint with admin portal actions included
ALTER TABLE public.auth_logs ADD CONSTRAINT auth_logs_action_check 
  CHECK (action IN (
    'login_success', 
    'login_failed', 
    'logout', 
    'password_reset', 
    'signup',
    'admin_login_success',
    'admin_login_failed',
    'admin_logout'
  ));

-- 2. Update app_role enum to include only superadmin for MVP
-- First, we need to update any existing 'admin' roles to 'superadmin'
UPDATE public.user_roles SET role = 'superadmin' WHERE role = 'admin';

-- Note: PostgreSQL doesn't allow removing enum values easily
-- For MVP, we'll keep the enum as is but only use 'superadmin' in the application

-- 3. Fix auth_logs RLS policies for MVP superadmin-only
DROP POLICY IF EXISTS "Admins can view all auth_logs" ON public.auth_logs;
DROP POLICY IF EXISTS "System can insert auth logs" ON public.auth_logs;
DROP POLICY IF EXISTS "Superadmins can view all auth_logs" ON public.auth_logs;
DROP POLICY IF EXISTS "Users can insert own auth logs" ON public.auth_logs;

-- Allow any authenticated user to insert logs (needed for login flow before role check)
CREATE POLICY "Anyone can insert auth logs"
  ON public.auth_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to view their own logs
CREATE POLICY "Users can view own auth logs"
  ON public.auth_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Superadmins can view all logs (using security definer function to avoid recursion)
CREATE POLICY "Superadmins can view all auth_logs"
  ON public.auth_logs
  FOR SELECT
  TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- 4. Fix user_roles policies - remove has_role function dependency
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Superadmins can manage user_roles" ON public.user_roles;

-- Create security definer function to check superadmin role (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_superadmin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Simple policies using the security definer function
CREATE POLICY "Users can view own roles"
  ON public.user_roles
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Superadmins can manage user_roles"
  ON public.user_roles
  FOR ALL
  USING (public.is_superadmin(auth.uid()));

-- 5. Add comment
COMMENT ON TABLE public.auth_logs IS 'Authentication logs including admin portal activity';
