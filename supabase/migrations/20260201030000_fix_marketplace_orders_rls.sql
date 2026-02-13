-- =====================================================
-- SECURITY FIX: marketplace_orders RLS Policy
-- Generated: 2026-02-01
-- Purpose: Fix overly permissive INSERT policy that used WITH CHECK (true)
-- =====================================================

BEGIN;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can create orders" ON public.marketplace_orders;

-- Create the secure policy with proper authorization and validation
CREATE POLICY "Service role can create orders"
  ON public.marketplace_orders FOR INSERT
  TO service_role
  WITH CHECK (
    -- Only service role can create orders (payment processing via edge functions)
    -- Validate required fields are present
    customer_id IS NOT NULL
    AND status IS NOT NULL
    AND status IN ('pending', 'processing', 'confirmed', 'cancelled', 'delivered', 'refunded')
    AND total IS NOT NULL
    AND total >= 0
    AND subtotal IS NOT NULL
    AND subtotal >= 0
    AND order_number IS NOT NULL
    AND LENGTH(order_number) > 0
    -- Validate currency if provided
    AND (currency IS NULL OR LENGTH(currency) = 3)
    -- Validate payment status if provided
    AND (payment_status IS NULL OR payment_status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled'))
    -- Validate addresses if provided
    AND (billing_address IS NULL OR json_typeof(billing_address) = 'object')
    AND (shipping_address IS NULL OR json_typeof(shipping_address) = 'object')
    -- Ensure customer exists
    AND EXISTS (
      SELECT 1 FROM public.marketplace_customers 
      WHERE id = NEW.customer_id
    )
  );

-- Add a trigger for additional validation to ensure data integrity
CREATE OR REPLACE FUNCTION validate_marketplace_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure order number is unique
  IF EXISTS (
    SELECT 1 FROM public.marketplace_orders 
    WHERE order_number = NEW.order_number
  ) THEN
    RAISE EXCEPTION 'Order number % already exists', NEW.order_number;
  END IF;
  
  -- Validate financial amounts
  IF NEW.total < NEW.subtotal THEN
    RAISE EXCEPTION 'Total amount cannot be less than subtotal';
  END IF;
  
  -- Validate tax amount if present
  IF NEW.tax_amount IS NOT NULL AND NEW.tax_amount < 0 THEN
    RAISE EXCEPTION 'Tax amount cannot be negative';
  END IF;
  
  -- Validate shipping cost if present
  IF NEW.shipping_cost IS NOT NULL AND NEW.shipping_cost < 0 THEN
    RAISE EXCEPTION 'Shipping cost cannot be negative';
  END IF;
  
  -- Validate discount amount if present
  IF NEW.discount_amount IS NOT NULL AND NEW.discount_amount < 0 THEN
    RAISE EXCEPTION 'Discount amount cannot be negative';
  END IF;
  
  -- Validate payment intent ID format if present
  IF NEW.payment_intent_id IS NOT NULL AND LENGTH(NEW.payment_intent_id) < 10 THEN
    RAISE EXCEPTION 'Invalid payment intent ID format';
  END IF;
  
  -- Ensure customer exists and belongs to a valid user
  IF NOT EXISTS (
    SELECT 1 FROM public.marketplace_customers mc
    LEFT JOIN auth.users au ON mc.user_id = au.id
    WHERE mc.id = NEW.customer_id
    AND (mc.user_id IS NULL OR au.id IS NOT NULL)  -- Either guest (NULL) or valid user
  ) THEN
    RAISE EXCEPTION 'Customer ID % does not exist or is invalid', NEW.customer_id;
  END IF;
  
  -- Set timestamps if not provided
  IF NEW.created_at IS NULL THEN
    NEW.created_at = NOW();
  END IF;
  
  IF NEW.updated_at IS NULL THEN
    NEW.updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_marketplace_order_trigger 
  ON public.marketplace_orders;
  
CREATE TRIGGER validate_marketplace_order_trigger
  BEFORE INSERT ON public.marketplace_orders
  FOR EACH ROW
  EXECUTE FUNCTION validate_marketplace_order();

-- Add indexes for better performance and monitoring
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_customer_id 
  ON public.marketplace_orders(customer_id);
  
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_status 
  ON public.marketplace_orders(status);
  
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_payment_status 
  ON public.marketplace_orders(payment_status);
  
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_order_number 
  ON public.marketplace_orders(order_number);
  
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_created_at 
  ON public.marketplace_orders(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE public.marketplace_orders IS 
  'Stores marketplace order information with proper security measures. Only service role can create orders via payment processing edge functions.';

COMMENT ON POLICY "Service role can create orders" ON public.marketplace_orders IS 
  'SECURITY: Restricts order creation to service role only (payment processing via edge functions). Includes validation for data integrity.';

-- Add function to verify if a customer can access an order
CREATE OR REPLACE FUNCTION can_access_order(p_user_id UUID, p_order_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  order_customer_id UUID;
  user_id UUID;
BEGIN
  -- Get the customer ID for the order
  SELECT customer_id INTO order_customer_id
  FROM public.marketplace_orders
  WHERE id = p_order_id;
  
  IF order_customer_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get the marketplace customer ID for the authenticated user
  SELECT id INTO user_id
  FROM public.marketplace_customers
  WHERE user_id = p_user_id;
  
  RETURN order_customer_id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Add monitoring view for order creation anomalies
CREATE OR REPLACE VIEW public.anomalous_order_patterns AS
SELECT 
  customer_id,
  COUNT(*) as order_count,
  SUM(total) as total_value,
  MIN(created_at) as first_order,
  MAX(created_at) as last_order,
  EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as time_span_seconds
FROM public.marketplace_orders
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY customer_id
HAVING COUNT(*) > 10  -- More than 10 orders per hour from same customer
   OR SUM(total) > 10000;  -- Total value exceeds threshold

COMMENT ON VIEW public.anomalous_order_patterns IS 
  'Identifies potentially fraudulent order patterns for monitoring and fraud prevention.';

COMMIT;

-- =====================================================
-- POST-DEPLOYMENT VERIFICATION
-- =====================================================
-- Run these queries to verify the fix:
-- 
-- 1. Check that the new policy exists:
-- SELECT policyname, tablename, permissiveness, roles, cmd, qual, with_check 
-- FROM pg_policy 
-- WHERE tablename = 'marketplace_orders';
--
-- 2. The old overly permissive policy should be gone:
-- SELECT policyname FROM pg_policy 
-- WHERE tablename = 'marketplace_orders' AND with_check IS NOT NULL AND with_check::text = '(true)';
--
-- 3. Test that service role can still create orders (in edge function context):
-- -- This would be tested in the marketplace-checkout edge function
--
-- 4. Test that regular users cannot insert (should fail):
-- INSERT INTO public.marketplace_orders (customer_id, status, total, subtotal, order_number) 
-- VALUES ('some-uuid', 'pending', 100.00, 90.00, 'ORD-TEST-001');