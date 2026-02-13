-- Add approval and feature flags to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS featured_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS featured_by UUID REFERENCES auth.users(id);

-- Create indexes for better performance on approval and feature flags
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON public.profiles(is_approved);
CREATE INDEX IF NOT EXISTS idx_profiles_is_featured ON public.profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_profiles_approved_at ON public.profiles(approved_at);

-- Update RLS policies to control access based on approval status
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
CREATE POLICY "Users can view active and approved profiles" 
  ON public.profiles FOR SELECT
  USING (
    status = 'active' 
    AND is_approved = true
  );

-- Create policy for admins to manage profile approvals
CREATE POLICY "Admins can manage profile approvals" 
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy for admins to feature/unfeature profiles
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
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to select from profiles
CREATE POLICY "Authenticated users can view profiles" 
  ON public.profiles FOR SELECT
  USING (
    auth.role() = 'authenticated' 
    AND (
      status = 'active' 
      AND is_approved = true
    )
  );