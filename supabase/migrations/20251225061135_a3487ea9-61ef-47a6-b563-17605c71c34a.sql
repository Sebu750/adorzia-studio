-- Add first_login flag to track if user has been welcomed
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_login boolean DEFAULT true;

-- Add notification_preferences for user settings
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"email": true, "push": true, "stylebox_updates": true, "earnings": true, "team": true}'::jsonb;

-- Create index for faster notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_status 
ON public.notifications(user_id, status);

-- Create index for faster notification count queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
ON public.notifications(user_id) 
WHERE status = 'unread';

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.first_login IS 'Track if this is the user first login for welcome flow';
COMMENT ON COLUMN public.profiles.notification_preferences IS 'User notification preference settings';