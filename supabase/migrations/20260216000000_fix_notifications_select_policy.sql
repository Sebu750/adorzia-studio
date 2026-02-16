-- Fix notifications SELECT policy for superadmin history view

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Superadmins can view all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Superadmins can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

-- Create policy for users to view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create policy for superadmins to view all notifications (for history)
CREATE POLICY "Superadmins can view all notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (public.is_superadmin(auth.uid()));

-- Create policy for superadmins to create notifications
CREATE POLICY "Superadmins can create notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_superadmin(auth.uid()));

-- Create policy for users to update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());
