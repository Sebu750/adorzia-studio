-- =====================================================
-- SECURITY FIX: user_product_interactions RLS Policy
-- Generated: 2026-02-01
-- Purpose: Fix overly permissive INSERT policy that used WITH CHECK (true)
-- =====================================================

BEGIN;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can insert interactions" ON public.user_product_interactions;

-- Create the secure policy with proper validation
CREATE POLICY "Users can log product interactions"
  ON public.user_product_interactions FOR INSERT
  WITH CHECK (
    -- Must have either authenticated user_id or anonymous session_id
    (user_id IS NOT NULL AND user_id = auth.uid()) 
    OR (user_id IS NULL AND session_id IS NOT NULL AND LENGTH(session_id) > 0)
    -- Validate required fields
    AND product_id IS NOT NULL
    AND interaction_type IS NOT NULL
    AND interaction_type IN ('view', 'like', 'cart_add', 'purchase', 'wishlist')
    -- Validate duration if provided
    AND (duration_seconds IS NULL OR duration_seconds > 0)
  );

-- Add indexes for better performance and monitoring
CREATE INDEX IF NOT EXISTS idx_user_product_interactions_user_id 
  ON public.user_product_interactions(user_id);
  
CREATE INDEX IF NOT EXISTS idx_user_product_interactions_session_id 
  ON public.user_product_interactions(session_id) 
  WHERE session_id IS NOT NULL;
  
CREATE INDEX IF NOT EXISTS idx_user_product_interactions_product_id 
  ON public.user_product_interactions(product_id);
  
CREATE INDEX IF NOT EXISTS idx_user_product_interactions_created_at 
  ON public.user_product_interactions(created_at);

-- Add comments for documentation
COMMENT ON TABLE public.user_product_interactions IS 
  'Tracks user interactions with products for analytics and recommendation engine. RLS ensures only valid interactions are logged.';

COMMENT ON POLICY "Users can log product interactions" ON public.user_product_interactions IS 
  'SECURITY: Restricts INSERT to authenticated users or anonymous sessions with validation. Prevents data spoofing and abuse.';

-- Validation function to ensure data integrity
CREATE OR REPLACE FUNCTION validate_user_product_interaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure we have either user_id or session_id (but not both NULL)
  IF NEW.user_id IS NULL AND (NEW.session_id IS NULL OR LENGTH(NEW.session_id) = 0) THEN
    RAISE EXCEPTION 'Either user_id or valid session_id must be provided';
  END IF;
  
  -- Validate interaction type
  IF NEW.interaction_type NOT IN ('view', 'like', 'cart_add', 'purchase', 'wishlist') THEN
    RAISE EXCEPTION 'Invalid interaction_type: %', NEW.interaction_type;
  END IF;
  
  -- Validate duration
  IF NEW.duration_seconds IS NOT NULL AND NEW.duration_seconds <= 0 THEN
    RAISE EXCEPTION 'duration_seconds must be positive when provided';
  END IF;
  
  -- Set created_at if not provided
  IF NEW.created_at IS NULL THEN
    NEW.created_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_user_product_interaction_trigger 
  ON public.user_product_interactions;
  
CREATE TRIGGER validate_user_product_interaction_trigger
  BEFORE INSERT ON public.user_product_interactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_user_product_interaction();

-- Add monitoring view for suspicious patterns
CREATE OR REPLACE VIEW public.suspicious_interactions AS
SELECT 
  user_id,
  session_id,
  product_id,
  interaction_type,
  COUNT(*) as interaction_count,
  MIN(created_at) as first_interaction,
  MAX(created_at) as last_interaction,
  EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as time_span_seconds
FROM public.user_product_interactions
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY user_id, session_id, product_id, interaction_type
HAVING COUNT(*) > 100  -- More than 100 interactions per hour per user/session
   OR EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) < 60;  -- All interactions within 1 minute

COMMENT ON VIEW public.suspicious_interactions IS 
  'Identifies potentially abusive interaction patterns for monitoring and abuse prevention.';

COMMIT;

-- =====================================================
-- POST-DEPLOYMENT VERIFICATION
-- =====================================================
-- Run these queries to verify the fix:
-- 
-- 1. Check that the new policy exists:
-- SELECT policyname, tablename, permissiveness, roles, cmd, qual, with_check 
-- FROM pg_policy 
-- WHERE tablename = 'user_product_interactions';
--
-- 2. Test valid authenticated insert:
-- INSERT INTO public.user_product_interactions (user_id, product_id, interaction_type) 
-- VALUES (auth.uid(), 'some-uuid', 'view');
--
-- 3. Test valid anonymous insert:
-- INSERT INTO public.user_product_interactions (session_id, product_id, interaction_type) 
-- VALUES ('session-123', 'some-uuid', 'view');
--
-- 4. Test invalid cases (should fail):
-- INSERT INTO public.user_product_interactions (product_id, interaction_type) VALUES ('some-uuid', 'view');
-- INSERT INTO public.user_product_interactions (user_id, product_id, interaction_type) VALUES (gen_random_uuid(), 'some-uuid', 'view');
-- INSERT INTO public.user_product_interactions (session_id, product_id, interaction_type) VALUES ('', 'some-uuid', 'view');