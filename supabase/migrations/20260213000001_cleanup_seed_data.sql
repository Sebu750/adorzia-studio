-- ============================================================================
-- PRODUCTION CLEANUP MIGRATION
-- Removes all seed/mock data before production deployment
-- Run this migration after removing seed files and before going live
-- ============================================================================

-- 1. Clean up seed products from marketplace
DELETE FROM public.marketplace_collection_products 
WHERE product_id LIKE 'e1111111-1111-1111-1111-%' 
   OR product_id LIKE 'prod-seed-%';

-- 2. Clean up seed visual attributes
DELETE FROM public.product_visual_attributes 
WHERE product_id LIKE 'prod-seed-%';

-- 3. Clean up seed authenticity certificates
DELETE FROM public.product_authenticity_certificates 
WHERE id LIKE 'cert-seed-%' 
   OR product_id LIKE 'prod-seed-%';

-- 4. Clean up seed products
DELETE FROM public.marketplace_products 
WHERE id LIKE 'e1111111-1111-1111-1111-%' 
   OR id LIKE 'prod-seed-%';

-- 5. Clean up seed collections
DELETE FROM public.marketplace_collections 
WHERE id LIKE 'b1111111-1111-1111-1111-%';

-- 6. Clean up seed categories (only if no real products reference them)
-- Note: Only delete if they have no real products linked
DELETE FROM public.marketplace_categories 
WHERE id LIKE 'a1111111-1111-1111-1111-%'
  AND NOT EXISTS (
    SELECT 1 FROM public.marketplace_products p 
    WHERE p.category_id = marketplace_categories.id 
      AND p.id NOT LIKE 'e1111111-1111-1111-1111-%'
      AND p.id NOT LIKE 'prod-seed-%'
  );

-- 7. Clean up preview teams and their members
-- Preview teams have IDs starting with 00000000-0000-0000-0000-0000000000
DELETE FROM public.team_members 
WHERE team_id LIKE '00000000-0000-0000-0000-00000000000%';

DELETE FROM public.teams 
WHERE id LIKE '00000000-0000-0000-0000-00000000000%';

-- 8. Remove example styleboxes (seeded examples)
-- These are identifiable by their specific titles or if needed, by created_at check
-- Note: Only remove if they are clearly marked as examples
DELETE FROM public.styleboxes 
WHERE title IN (
  'Cyber-Kimono Reconstruction',
  'Exoskeletal Evening Wear', 
  'Kinetic Streetwear V1'
);

-- 9. Clean up any orphaned records
-- Remove product images that reference seed products
DELETE FROM public.product_images 
WHERE product_id LIKE 'prod-seed-%';

-- 10. Reset comments on tables
COMMENT ON TABLE public.marketplace_products IS NULL;
COMMENT ON TABLE public.teams IS 'Teams table for collaborative designer groups';

-- ============================================================================
-- VERIFICATION QUERIES (Run these after to confirm cleanup):
-- 
-- -- Check for remaining seed products
-- SELECT COUNT(*) FROM public.marketplace_products WHERE id LIKE 'prod-seed-%';
-- 
-- -- Check for remaining preview teams
-- SELECT COUNT(*) FROM public.teams WHERE id LIKE '00000000-0000-0000-0000-00000000000%';
--
-- -- Check for remaining seed styleboxes
-- SELECT title FROM public.styleboxes WHERE title LIKE '%Cyber-Kimono%' OR title LIKE '%Exoskeletal%' OR title LIKE '%Kinetic%';
-- ============================================================================
