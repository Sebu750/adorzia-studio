-- Create a table to log profile approval and feature actions
CREATE TABLE IF NOT EXISTS public.profile_approval_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approve', 'unapprove', 'feature', 'unfeature')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profile_approval_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_profile_approval_logs_user_id ON public.profile_approval_logs(user_id);
CREATE INDEX idx_profile_approval_logs_admin_id ON public.profile_approval_logs(admin_id);
CREATE INDEX idx_profile_approval_logs_action ON public.profile_approval_logs(action);
CREATE INDEX idx_profile_approval_logs_timestamp ON public.profile_approval_logs(timestamp);

-- RLS policies for admin logs
CREATE POLICY "Admins can view approval logs" 
  ON public.profile_approval_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert approval logs" 
  ON public.profile_approval_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );