-- Create user_feedback table for tracking feedback submissions
CREATE TABLE public.user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_name text NOT NULL,
  user_role text NOT NULL CHECK (user_role IN ('designer', 'founder')),
  category text NOT NULL CHECK (category IN ('bug', 'ux', 'feature', 'other')),
  message text NOT NULL,
  email_sent boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Users can insert their own feedback
CREATE POLICY "Users can insert own feedback"
ON public.user_feedback
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback"
ON public.user_feedback
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
ON public.user_feedback
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Admins can update feedback (e.g., mark email_sent)
CREATE POLICY "Admins can update feedback"
ON public.user_feedback
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));