-- =====================================================
-- SECURITY FIX: newsletter_subscribers RLS Policy
-- Generated: 2026-02-01
-- Purpose: Fix overly permissive INSERT policy that used WITH CHECK (true)
-- =====================================================

BEGIN;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

-- Create the secure policy with proper validation
CREATE POLICY "Public can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Validate email format
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    -- Ensure email is not empty
    AND LENGTH(TRIM(email)) > 0
    -- Prevent duplicate subscriptions (same email in same hour to allow for testing)
    AND NOT EXISTS (
      SELECT 1 FROM public.newsletter_subscribers 
      WHERE LOWER(TRIM(public.newsletter_subscribers.email)) = LOWER(TRIM(NEW.email))
      AND created_at > NOW() - INTERVAL '1 hour'
    )
    -- Validate source if provided
    AND (source IS NULL OR LENGTH(source) <= 50)
    -- Ensure status is valid
    AND (status IS NULL OR status IN ('active', 'pending', 'unsubscribed'))
  );

-- Add a trigger for additional validation and security measures
CREATE OR REPLACE FUNCTION validate_newsletter_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Additional email validation
  IF NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Prevent bulk disposable email addresses
  IF NEW.email ~* '@(tempmail\.|guerrillamail\.|mailinator\.|10minutemail\.|disposable\.|throwaway)' THEN
    RAISE EXCEPTION 'Disposable email addresses are not allowed';
  END IF;
  
  -- Set default values if not provided
  IF NEW.source IS NULL OR LENGTH(TRIM(NEW.source)) = 0 THEN
    NEW.source := 'unknown';
  END IF;
  
  IF NEW.ip_address IS NULL AND TG_OP = 'INSERT' THEN
    -- Attempt to capture IP if available (this would typically be set by the calling application)
    -- In practice, the IP should be passed from the frontend or captured by the edge function
    NEW.ip_address := NULL; -- Will be set by application layer
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_newsletter_subscription_trigger 
  ON public.newsletter_subscribers;
  
CREATE TRIGGER validate_newsletter_subscription_trigger
  BEFORE INSERT ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION validate_newsletter_subscription();

-- Add indexes for better performance and monitoring
CREATE INDEX IF NOT EXISTS idx_newsletter_email_lower 
  ON public.newsletter_subscribers(LOWER(email));
  
CREATE INDEX IF NOT EXISTS idx_newsletter_created_at 
  ON public.newsletter_subscribers(created_at DESC);
  
CREATE INDEX IF NOT EXISTS idx_newsletter_ip_address 
  ON public.newsletter_subscribers(ip_address) 
  WHERE ip_address IS NOT NULL;

-- Add comments for documentation
COMMENT ON TABLE public.newsletter_subscribers IS 
  'Stores newsletter subscriber information with security measures to prevent abuse and spam.';

COMMENT ON POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers IS 
  'SECURITY: Allows public newsletter subscription with email validation and duplicate prevention.';

-- Add monitoring view for suspicious subscription patterns
CREATE OR REPLACE VIEW public.suspicious_newsletter_activity AS
SELECT 
  ip_address,
  COUNT(*) as subscription_count,
  MIN(created_at) as first_subscription,
  MAX(created_at) as last_subscription,
  EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as time_span_seconds
FROM public.newsletter_subscribers
WHERE created_at > NOW() - INTERVAL '1 hour'
  AND ip_address IS NOT NULL
GROUP BY ip_address
HAVING COUNT(*) > 10  -- More than 10 subscriptions per hour from same IP
ORDER BY subscription_count DESC;

COMMENT ON VIEW public.suspicious_newsletter_activity IS 
  'Identifies potentially abusive subscription patterns by IP address for monitoring and abuse prevention.';

-- Add function to check if an IP is rate-limited
CREATE OR REPLACE FUNCTION is_newsletter_rate_limited(p_ip_address TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  count INT;
BEGIN
  IF p_ip_address IS NULL THEN
    RETURN FALSE;
  END IF;
  
  SELECT COUNT(*) INTO count
  FROM public.newsletter_subscribers
  WHERE ip_address = p_ip_address
    AND created_at > NOW() - INTERVAL '1 minute';
    
  RETURN count >= 3; -- Limit to 3 per minute per IP
END;
$$ LANGUAGE plpgsql;

-- Add function to check if an email is rate-limited (prevent rapid resubmissions)
CREATE OR REPLACE FUNCTION is_email_rate_limited(p_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  count INT;
BEGIN
  IF p_email IS NULL THEN
    RETURN FALSE;
  END IF;
  
  SELECT COUNT(*) INTO count
  FROM public.newsletter_subscribers
  WHERE LOWER(TRIM(email)) = LOWER(TRIM(p_email))
    AND created_at > NOW() - INTERVAL '1 minute';
    
  RETURN count >= 1; -- Only allow one subscription per minute per email
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- =====================================================
-- POST-DEPLOYMENT VERIFICATION
-- =====================================================
-- Run these queries to verify the fix:
-- 
-- 1. Check that the new policy exists:
-- SELECT policyname, tablename, permissiveness, roles, cmd, qual, with_check 
-- FROM pg_policy 
-- WHERE tablename = 'newsletter_subscribers';
--
-- 2. Test valid insert:
-- INSERT INTO public.newsletter_subscribers (email, source) 
-- VALUES ('test@example.com', 'homepage');
--
-- 3. Test invalid cases (should fail):
-- INSERT INTO public.newsletter_subscribers (email, source) VALUES ('invalid-email', 'homepage');
-- INSERT INTO public.newsletter_subscribers (email, source) VALUES ('', 'homepage');
-- INSERT INTO public.newsletter_subscribers (email, source) VALUES (NULL, 'homepage');