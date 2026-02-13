-- Migration: Add delete_user_account function for designers
-- Allows authenticated users to delete their own account

CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp', 'auth'
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete user data in cascading order (foreign keys handle most cleanup)
  -- Additional manual cleanup if needed for tables without proper cascade
  
  -- Delete from profiles (this should cascade to related data)
  DELETE FROM public.profiles WHERE user_id = current_user_id;
  
  -- Delete from portfolios (should cascade to portfolio_projects, portfolio_assets, portfolio_publications)
  DELETE FROM public.portfolios WHERE designer_id = current_user_id;
  
  -- Delete stylebox submissions
  DELETE FROM public.stylebox_submissions WHERE designer_id = current_user_id;
  
  -- Delete notifications
  DELETE FROM public.notifications WHERE user_id = current_user_id;
  
  -- Delete team memberships
  DELETE FROM public.team_members WHERE user_id = current_user_id;
  
  -- Delete marketplace customer data
  DELETE FROM public.marketplace_customers WHERE user_id = current_user_id;
  
  -- Delete user roles
  DELETE FROM public.user_roles WHERE user_id = current_user_id;
  
  -- Delete founding submissions
  DELETE FROM public.founding_submissions WHERE designer_id = current_user_id;
  
  -- Delete designer IP registry
  DELETE FROM public.designer_ip_registry WHERE designer_id = current_user_id;
  
  -- Delete user visual preferences
  DELETE FROM public.user_visual_preferences WHERE user_id = current_user_id;
  
  -- Delete user product interactions
  DELETE FROM public.user_product_interactions WHERE user_id = current_user_id;
  
  -- Finally, delete the auth user (this will cascade to remaining references)
  DELETE FROM auth.users WHERE id = current_user_id;
  
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;

COMMENT ON FUNCTION delete_user_account() IS 
  'Allows authenticated users to permanently delete their own account and all associated data. This action is irreversible.';
