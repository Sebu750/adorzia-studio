-- Update RLS policies to properly handle profile approval and feature flags

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can view active and approved profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create a comprehensive policy for selecting profiles
CREATE POLICY "Users can view active and approved profiles" 
  ON public.profiles FOR SELECT
  USING (
    status = 'active' 
    AND is_approved = true
  );

-- Policy for users to view their own profile regardless of approval status
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for admins to manage profile approvals
CREATE POLICY "Admins can manage profile approvals" 
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy for admins to feature/unfeature profiles
CREATE POLICY "Admins can feature profiles" 
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow users to update their own profile information (excluding approval fields)
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND is_approved IS NOT DISTINCT FROM (SELECT is_approved FROM profiles WHERE user_id = auth.uid())  -- Prevent users from changing approval status
    AND is_featured IS NOT DISTINCT FROM (SELECT is_featured FROM profiles WHERE user_id = auth.uid()) -- Prevent users from changing feature status
  );

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add trigger function to update approval metadata
CREATE OR REPLACE FUNCTION update_profile_approval_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Update approval metadata when is_approved changes from false to true
  IF NEW.is_approved = true AND OLD.is_approved = false THEN
    NEW.approved_at = NOW();
    NEW.approved_by = auth.uid();
  END IF;
  
  -- Update feature metadata when is_featured changes
  IF NEW.is_featured != OLD.is_featured THEN
    IF NEW.is_featured = true THEN
      NEW.featured_at = NOW();
      NEW.featured_by = auth.uid();
    ELSE
      -- When unfeaturing, keep the original featured_at timestamp
      NULL; -- Do nothing to preserve featured_at
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update approval metadata
DROP TRIGGER IF EXISTS trigger_profile_approval_metadata ON public.profiles;
CREATE TRIGGER trigger_profile_approval_metadata
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_approval_metadata();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON TABLE public.profiles TO authenticated, anon;