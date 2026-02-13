-- Add unsubscribed_at timestamp column to newsletter_subscribers
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;

-- Add resend_contact_id to track Resend contact list membership
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN IF NOT EXISTS resend_contact_id TEXT;

-- Add index for unsubscribed_at
CREATE INDEX IF NOT EXISTS idx_newsletter_unsubscribed_at 
ON public.newsletter_subscribers(unsubscribed_at);

-- Add index for resend_contact_id
CREATE INDEX IF NOT EXISTS idx_newsletter_resend_contact_id 
ON public.newsletter_subscribers(resend_contact_id);

COMMENT ON COLUMN public.newsletter_subscribers.unsubscribed_at IS 
  'Timestamp when the subscriber unsubscribed from the newsletter';

COMMENT ON COLUMN public.newsletter_subscribers.resend_contact_id IS 
  'Resend contact ID for syncing with Resend contact list (general segment)';
