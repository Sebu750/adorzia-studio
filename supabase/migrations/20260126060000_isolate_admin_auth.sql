-- Migration to isolate Administrative users from Designers
-- 1. Create a dedicated table for Admin profiles
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  role_id UUID REFERENCES public.ranks(id), -- Reuse ranks or create admin_roles? Let's stick to user_roles for logic
  status user_status DEFAULT 'active',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid recursion in RLS policies
CREATE OR REPLACE FUNCTION public.is_admin_or_superadmin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_superadmin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 2. RLS Policies for admin_profiles
CREATE POLICY "Admins can view all admin profiles" ON public.admin_profiles
  FOR SELECT TO authenticated
  USING (public.is_admin_or_superadmin(auth.uid()));

CREATE POLICY "Superadmins can manage admin profiles" ON public.admin_profiles
  FOR ALL TO authenticated
  USING (public.is_superadmin(auth.uid()));

CREATE POLICY "Admins can update own profile" ON public.admin_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Migrate existing admins from profiles to admin_profiles
INSERT INTO public.admin_profiles (user_id, name, email, avatar_url, status, created_at)
SELECT p.user_id, p.name, p.email, p.avatar_url, p.status, p.created_at
FROM public.profiles p
JOIN public.user_roles ur ON p.user_id = ur.user_id
WHERE ur.role IN ('admin', 'superadmin')
ON CONFLICT (user_id) DO NOTHING;

-- 4. Clean up: Optional - remove admin records from the designer profiles table
DELETE FROM public.profiles 
WHERE user_id IN (SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'superadmin'));

-- 5. Update bootstrap function to use the new isolated table
CREATE OR REPLACE FUNCTION public.bootstrap_superadmin(admin_email TEXT, admin_password TEXT)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- 1. Create the user in auth.users if they don't exist
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, recovery_sent_at, last_sign_in_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new,
    recovery_token, is_super_admin
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    extensions.crypt(admin_password, extensions.gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"System Superadmin"}',
    now(), now(), '', '', '', '', false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = admin_email
  )
  RETURNING id INTO new_user_id;

  IF new_user_id IS NULL THEN
    SELECT id INTO new_user_id FROM auth.users WHERE email = admin_email;
  END IF;

  -- 2. Assign superadmin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'superadmin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- 3. Ensure an isolated ADMIN profile exists
  INSERT INTO public.admin_profiles (user_id, name, email)
  VALUES (new_user_id, 'System Superadmin', admin_email)
  ON CONFLICT (user_id) DO UPDATE SET 
    email = EXCLUDED.email,
    name = EXCLUDED.name;

  -- Remove from standard designer profiles if they were there
  DELETE FROM public.profiles WHERE user_id = new_user_id;

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public', 'pg_temp';
