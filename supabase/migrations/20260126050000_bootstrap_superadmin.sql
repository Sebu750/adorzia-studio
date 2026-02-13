-- Migration to create a bootstrap function for the initial Superadmin
-- This allows creating the first admin account directly from the SQL editor safely.

CREATE OR REPLACE FUNCTION public.bootstrap_superadmin(admin_email TEXT, admin_password TEXT)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- 1. Create the user in auth.users if they don't exist
  -- Note: Supabase uses pgcrypto for password hashing.
  -- The password will be hashed using bcrypt (standard for Supabase Auth)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    is_super_admin
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    extensions.crypt(admin_password, extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"System Superadmin"}',
    now(),
    now(),
    '',
    '',
    '',
    '',
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = admin_email
  )
  RETURNING id INTO new_user_id;

  -- If user already existed, get their ID
  IF new_user_id IS NULL THEN
    SELECT id INTO new_user_id FROM auth.users WHERE email = admin_email;
  END IF;

  -- 2. Assign superadmin role in the user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'superadmin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- 3. Ensure a profile exists for this user
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (new_user_id, 'System Superadmin', admin_email)
  ON CONFLICT (user_id) DO UPDATE SET 
    email = EXCLUDED.email,
    name = EXCLUDED.name;

  -- 4. Log the initialization
  INSERT INTO public.admin_logs (admin_id, action, target_type, details)
  VALUES (new_user_id, 'bootstrap_superadmin', 'system', jsonb_build_object('email', admin_email));

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public', 'pg_temp';

-- INSTRUCTIONS:
-- To create or promote your superadmin, run the following SQL command in your Supabase SQL Editor:
-- SELECT public.bootstrap_superadmin('admin@adorzia.com', 'your-secure-password-here');
