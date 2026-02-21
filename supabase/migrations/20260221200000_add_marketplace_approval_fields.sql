-- Add marketplace approval fields to profiles table
-- These fields control which designers appear in the public marketplace

-- Add role field for user type identification
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'designer';

-- Add marketplace approval fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS featured_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS featured_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Create profile approval logs table for audit trail
CREATE TABLE IF NOT EXISTS public.profile_approval_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON public.profiles(is_approved);
CREATE INDEX IF NOT EXISTS idx_profiles_is_featured ON public.profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profile_approval_logs_user_id ON public.profile_approval_logs(user_id);

-- Enable RLS on profile_approval_logs
ALTER TABLE public.profile_approval_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage approval logs
CREATE POLICY "Admins can view approval logs" ON public.profile_approval_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert approval logs" ON public.profile_approval_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Update existing profiles: auto-approve profiles that have products in the marketplace
UPDATE public.profiles
SET is_approved = true, approved_at = now()
WHERE user_id IN (
  SELECT DISTINCT designer_id FROM public.marketplace_products WHERE status = 'live'
);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.is_approved IS 'Whether the designer profile is approved to appear in the public marketplace';
COMMENT ON COLUMN public.profiles.is_featured IS 'Whether the designer profile is featured on the marketplace homepage';
COMMENT ON COLUMN public.profiles.role IS 'User role: designer, admin, customer';
