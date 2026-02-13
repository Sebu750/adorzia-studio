-- Update seed products to include made-to-order and limited edition features

-- Update some sample products to demonstrate the new features
UPDATE public.marketplace_products 
SET 
  is_made_to_order = true,
  is_limited_edition = false
WHERE id = 'e1111111-1111-1111-1111-111111111111'; -- Embroidered Silk Kaftan

UPDATE public.marketplace_products 
SET 
  is_made_to_order = false,
  is_limited_edition = true,
  edition_size = 50
WHERE id = 'e1111111-1111-1111-1111-111111111115'; -- Bridal Lehenga - Rose Gold

UPDATE public.marketplace_products 
SET 
  is_made_to_order = true,
  is_limited_edition = true,
  edition_size = 25
WHERE id = 'e1111111-1111-1111-1111-111111111113'; -- Velvet Shawl with Zardozi

-- Ensure the constraint works properly by updating any limited edition items without edition_size
UPDATE public.marketplace_products 
SET edition_size = 100
WHERE is_limited_edition = true AND edition_size IS NULL;