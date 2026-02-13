-- Create a function to check if a user has admin privileges
CREATE OR REPLACE FUNCTION public.check_admin_privileges(admin_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT role = 'admin' INTO is_admin
  FROM public.profiles
  WHERE user_id = admin_user_id;
  
  RETURN COALESCE(is_admin, FALSE);
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.check_admin_privileges TO authenticated, anon;