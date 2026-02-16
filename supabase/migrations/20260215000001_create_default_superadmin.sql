-- Create default superadmin account
-- Run this migration to create an initial superadmin user for MVP access

DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  admin_email TEXT := 'superadmin@adorzia.com';
  admin_password TEXT := 'Adorzia2025!Secure';
BEGIN
  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    RAISE NOTICE 'Superadmin user already exists with email: %', admin_email;
    
    -- Ensure existing user has superadmin role
    UPDATE public.user_roles 
    SET role = 'superadmin' 
    WHERE user_id = (SELECT id FROM auth.users WHERE email = admin_email);
    
    -- Ensure admin_profiles entry exists
    INSERT INTO public.admin_profiles (user_id, name, email, status)
    SELECT id, 'System Superadmin', email, 'active'
    FROM auth.users 
    WHERE email = admin_email
    ON CONFLICT (user_id) DO NOTHING;
    
  ELSE
    -- Create auth user
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"System Superadmin","role":"superadmin"}',
      NOW(),
      NOW(),
      'authenticated',
      '',
      '',
      '',
      ''
    );

    -- Create user_roles entry
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new_user_id, 'superadmin');

    -- Create admin_profiles entry
    INSERT INTO public.admin_profiles (
      user_id,
      name,
      email,
      status,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      'System Superadmin',
      admin_email,
      'active',
      NOW(),
      NOW()
    );

    RAISE NOTICE 'Default superadmin created successfully!';
    RAISE NOTICE 'Email: %', admin_email;
    RAISE NOTICE 'Password: %', admin_password;
    RAISE NOTICE 'User ID: %', new_user_id;
  END IF;
END $$;

-- Log the action
INSERT INTO public.admin_logs (action, target_type, details)
VALUES (
  'default_superadmin_created',
  'system',
  '{"email": "superadmin@adorzia.com", "note": "MVP default superadmin account"}'
)
ON CONFLICT DO NOTHING;
