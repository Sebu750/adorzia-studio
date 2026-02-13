-- Add title and metadata fields to notifications table for enhanced admin notifications

ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_notifications_user_status ON public.notifications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

COMMENT ON COLUMN public.notifications.title IS 'Optional notification title for enhanced UI display';
COMMENT ON COLUMN public.notifications.metadata IS 'Additional metadata for notifications (sender info, broadcast flag, etc.)';
