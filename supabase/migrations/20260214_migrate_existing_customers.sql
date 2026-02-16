-- Migration: Assign customer role to existing marketplace_customers
-- Date: 2026-02-14
-- Purpose: Ensure all existing marketplace_customers have the 'customer' role in user_roles

-- Insert customer role for existing marketplace_customers who don't have any role
INSERT INTO public.user_roles (user_id, role)
SELECT mc.user_id, 'customer'::public.app_role
FROM public.marketplace_customers mc
LEFT JOIN public.user_roles ur ON mc.user_id = ur.user_id
WHERE ur.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Log the migration
DO $$
DECLARE
  inserted_count INTEGER;
BEGIN
  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RAISE NOTICE 'Migration complete: % existing customers were assigned the customer role', inserted_count;
END $$;

-- Verify: Show count of marketplace_customers without roles (should be 0 after migration)
-- SELECT COUNT(*) as customers_without_role
-- FROM public.marketplace_customers mc
-- LEFT JOIN public.user_roles ur ON mc.user_id = ur.user_id
-- WHERE ur.user_id IS NULL;
