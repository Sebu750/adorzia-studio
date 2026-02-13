
-- Auth Logs for audit tracking
CREATE TABLE IF NOT EXISTS public.auth_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('login_success', 'login_failed', 'logout', 'password_reset', 'signup')),
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own auth logs
CREATE POLICY "Users can view own auth logs"
  ON public.auth_logs
  FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all auth logs
CREATE POLICY "Admins can view all auth logs"
  ON public.auth_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'superadmin'));

-- System can insert auth logs (via service role or triggers)
CREATE POLICY "System can insert auth logs"
  ON public.auth_logs
  FOR INSERT
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX idx_auth_logs_user_id ON public.auth_logs(user_id);
CREATE INDEX idx_auth_logs_created_at ON public.auth_logs(created_at DESC);
