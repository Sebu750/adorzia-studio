-- Migration: Fix automatic role assignment to respect signup context
-- Date: 2026-02-15
-- Issue: All new users were being assigned 'designer' role regardless of signup type
-- Solution: Check user metadata to determine correct role assignment

-- Drop the existing trigger that auto-assigns designer role
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;

-- Drop the old function
DROP FUNCTION IF EXISTS public.assign_designer_role_on_signup();

-- Create new smart role assignment function
CREATE OR REPLACE FUNCTION public.assign_role_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  signup_type TEXT;
BEGIN
  -- Get signup type from user metadata
  signup_type := NEW.raw_user_meta_data->>'signup_type';
  
  -- If explicitly marked as customer, assign customer role
  IF signup_type = 'customer' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'customer')
    ON CONFLICT (user_id, role) DO NOTHING;
  
  -- If explicitly marked as designer or no signup_type (default to designer for backwards compatibility)
  ELSIF signup_type = 'designer' OR signup_type IS NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'designer')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create new trigger with smart role assignment
CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_role_on_signup();

-- Comment for documentation
COMMENT ON FUNCTION public.assign_role_on_signup() IS 
'Assigns role based on signup_type in user metadata. 
Looks for raw_user_meta_data->signup_type:
- "customer" assigns customer role
- "designer" or null assigns designer role (default)';
