-- ============================================================================
-- SEED DATA FOR MARKETPLACE PREVIEW - REMOVE BEFORE PRODUCTION LAUNCH
-- ============================================================================
-- This migration adds sample data to preview marketplace functionality
-- Comment out or delete this entire file before production deployment
-- ============================================================================

-- 1. Create sample marketplace categories (if not exists)
INSERT INTO public.marketplace_categories (id, name, slug, description, is_active, display_order)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Women''s Wear', 'womens-wear', 'Elegant and contemporary fashion for women', true, 1),
  ('a1111111-1111-1111-1111-111111111112', 'Men''s Wear', 'mens-wear', 'Sophisticated menswear collections', true, 2),
  ('a1111111-1111-1111-1111-111111111113', 'Accessories', 'accessories', 'Handcrafted accessories and jewelry', true, 3),
  ('a1111111-1111-1111-1111-111111111114', 'Bridal', 'bridal', 'Exquisite bridal and formal wear', true, 4)
ON CONFLICT (id) DO NOTHING;

-- 2. Create sample collections
INSERT INTO public.marketplace_collections (id, name, slug, description, image_url, is_featured, is_active)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Spring/Summer 2026', 'spring-summer-2026', 'Fresh silhouettes for the new season', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d', true, true),
  ('b1111111-1111-1111-1111-111111111112', 'Heritage Collection', 'heritage', 'Traditional craftsmanship meets modern design', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2', true, true),
  ('b1111111-1111-1111-1111-111111111113', 'Minimalist Essentials', 'minimalist', 'Clean lines and timeless elegance', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c', false, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Get or create sample designer profiles
-- Note: This assumes some designer profiles already exist from the main app
-- We'll just link products to existing designers or create placeholder if needed

DO $$
DECLARE
  designer_id_1 UUID;
  designer_id_2 UUID;
  designer_id_3 UUID;
BEGIN
  -- Try to get existing designers, or note that products will need real designer_id
  SELECT id INTO designer_id_1 FROM public.profiles WHERE name IS NOT NULL LIMIT 1 OFFSET 0;
  SELECT id INTO designer_id_2 FROM public.profiles WHERE name IS NOT NULL LIMIT 1 OFFSET 1;
  SELECT id INTO designer_id_3 FROM public.profiles WHERE name IS NOT NULL LIMIT 1 OFFSET 2;

  -- 4. Insert sample products (PREVIEW DATA - REMOVE BEFORE LAUNCH)
  IF designer_id_1 IS NOT NULL THEN
    INSERT INTO public.marketplace_products (
      id, title, description, price, sale_price, images, category_id, designer_id,
      status, materials, sku, is_bestseller, inventory_count, slug, tags
    )
    VALUES
      (
        'e1111111-1111-1111-1111-111111111111'
        'Embroidered Silk Kaftan',
        'Luxurious silk kaftan with intricate hand embroidery. This piece celebrates traditional Pakistani craftsmanship with a contemporary silhouette.',
        15000,
        NULL,
        '["https://images.unsplash.com/photo-1595777457583-95e059d581b8", "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd"]'::jsonb,
        'a1111111-1111-1111-1111-111111111111',
        designer_id_1,
        'live',
        ARRAY['Silk', 'Cotton lining'],
        'SKU-KAFTAN-001',
        true,
        5,
        'embroidered-silk-kaftan',
        ARRAY['luxury', 'formal', 'silk', 'embroidery']
      ),
      (
        'e1111111-1111-1111-1111-111111111112'
        'Block Print Cotton Kurta',
        'Handcrafted block print kurta in premium cotton. Perfect for casual elegance.',
        4500,
        3800,
        '["https://images.unsplash.com/photo-1610652492743-21d40362e52e", "https://images.unsplash.com/photo-1622445275463-afa2ab738c34"]'::jsonb,
        'a1111111-1111-1111-1111-111111111112',
        designer_id_1,
        'live',
        ARRAY['Cotton'],
        'SKU-KURTA-002',
        false,
        12,
        'block-print-cotton-kurta',
        ARRAY['casual', 'cotton', 'block-print']
      ),
      (
        'e1111111-1111-1111-1111-111111111113'
        'Velvet Shawl with Zardozi',
        'Luxurious velvet shawl adorned with traditional zardozi work.',
        8900,
        NULL,
        '["https://images.unsplash.com/photo-1591047139829-d91aecb6caea", "https://images.unsplash.com/photo-1610652492485-d72486c9f2d1"]'::jsonb,
        'a1111111-1111-1111-1111-111111111113',
        designer_id_2,
        'live',
        ARRAY['Velvet', 'Gold thread'],
        'SKU-SHAWL-003',
        true,
        8,
        'velvet-shawl-zardozi',
        ARRAY['luxury', 'accessories', 'velvet', 'zardozi']
      ),
      (
        'e1111111-1111-1111-1111-111111111114'
        'Contemporary Angrakha',
        'Modern interpretation of the classic angrakha in breathable lawn fabric.',
        5200,
        NULL,
        '["https://images.unsplash.com/photo-1612722432474-b971cdcea546", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"]'::jsonb,
        'a1111111-1111-1111-1111-111111111111',
        designer_id_2,
        'live',
        ARRAY['Lawn', 'Cotton'],
        'SKU-ANGRAKHA-004',
        false,
        10,
        'contemporary-angrakha',
        ARRAY['contemporary', 'casual', 'lawn']
      ),
      (
        'e1111111-1111-1111-1111-111111111115'
        'Bridal Lehenga - Rose Gold',
        'Stunning bridal lehenga with intricate embellishment in rose gold.',
        85000,
        NULL,
        '["https://images.unsplash.com/photo-1617038220319-276d3cfab638", "https://images.unsplash.com/photo-1583939003579-730e3918a45a"]'::jsonb,
        'a1111111-1111-1111-1111-111111111114',
        designer_id_3,
        'live',
        ARRAY['Silk', 'Organza', 'Metallic thread'],
        'SKU-LEHENGA-005',
        true,
        2,
        'bridal-lehenga-rose-gold',
        ARRAY['bridal', 'luxury', 'lehenga', 'embellished']
      ),
      (
        'e1111111-1111-1111-1111-111111111116'
        'Handwoven Pashmina Stole',
        'Pure pashmina stole handwoven by master artisans.',
        12000,
        10200,
        '["https://images.unsplash.com/photo-1601924994987-69e26d50dc26", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea"]'::jsonb,
        'a1111111-1111-1111-1111-111111111113',
        designer_id_3,
        'live',
        ARRAY['Pashmina'],
        'SKU-STOLE-006',
        false,
        6,
        'handwoven-pashmina-stole',
        ARRAY['accessories', 'pashmina', 'handwoven', 'luxury']
      ),
      (
        'e1111111-1111-1111-1111-111111111117'
        'Chikankari White Kurta Set',
        'Elegant white kurta with delicate chikankari embroidery.',
        6800,
        NULL,
        '["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a", "https://images.unsplash.com/photo-1622445275463-afa2ab738c34"]'::jsonb,
        'a1111111-1111-1111-1111-111111111111',
        designer_id_1,
        'live',
        ARRAY['Cotton', 'Chikan'],
        'SKU-CHIKAN-007',
        false,
        15,
        'chikankari-white-kurta-set',
        ARRAY['formal', 'chikankari', 'white', 'embroidery']
      ),
      (
        'e1111111-1111-1111-1111-111111111118'
        'Geometric Print Palazzo Set',
        'Contemporary palazzo set with bold geometric patterns.',
        4200,
        3600,
        '["https://images.unsplash.com/photo-1617019114583-affb34d1b3cd", "https://images.unsplash.com/photo-1490481651871-ab68de25d43d"]'::jsonb,
        'a1111111-1111-1111-1111-111111111111',
        designer_id_2,
        'live',
        ARRAY['Crepe', 'Poly blend'],
        'SKU-PALAZZO-008',
        false,
        20,
        'geometric-print-palazzo-set',
        ARRAY['contemporary', 'casual', 'print', 'palazzo']
      )
    ON CONFLICT (id) DO NOTHING;

    -- 5. Add sample visual attributes for Vibe-Match (PREVIEW DATA)
    INSERT INTO public.product_visual_attributes (
      product_id, silhouette_type, fabric_texture, aesthetic_tags, 
      color_palette, pattern_type, occasion_fit, dominant_material
    )
    VALUES
      ('prod-seed-001', ARRAY['flowy', 'oversized'], ARRAY['smooth', 'embroidered'], ARRAY['traditional', 'romantic'], 'earth-tones', ARRAY['embroidered'], ARRAY['formal', 'festive'], 'silk'),
      ('prod-seed-002', ARRAY['fitted'], ARRAY['textured', 'printed'], ARRAY['minimalist', 'contemporary'], 'neutral', ARRAY['geometric'], ARRAY['casual'], 'cotton'),
      ('prod-seed-003', ARRAY['draped'], ARRAY['textured', 'embroidered'], ARRAY['traditional', 'avant-garde'], 'monochrome', ARRAY['solid'], ARRAY['formal'], 'velvet'),
      ('prod-seed-004', ARRAY['structured'], ARRAY['smooth'], ARRAY['contemporary', 'minimalist'], 'pastel', ARRAY['solid'], ARRAY['casual', 'office'], 'cotton'),
      ('prod-seed-005', ARRAY['flowy', 'structured'], ARRAY['embroidered'], ARRAY['traditional', 'romantic'], 'bold', ARRAY['embroidered'], ARRAY['bridal', 'festive'], 'silk'),
      ('prod-seed-006', ARRAY['draped'], ARRAY['smooth'], ARRAY['minimalist', 'traditional'], 'neutral', ARRAY['solid'], ARRAY['formal', 'casual'], 'pashmina'),
      ('prod-seed-007', ARRAY['fitted'], ARRAY['textured', 'embroidered'], ARRAY['traditional', 'romantic'], 'monochrome', ARRAY['embroidered'], ARRAY['formal'], 'cotton'),
      ('prod-seed-008', ARRAY['flowy'], ARRAY['smooth', 'printed'], ARRAY['contemporary', 'edgy'], 'bold', ARRAY['geometric'], ARRAY['casual', 'party'], 'crepe')
    ON CONFLICT (product_id) DO NOTHING;

    -- 6. Add to featured collection
    INSERT INTO public.marketplace_collection_products (collection_id, product_id, display_order)
    VALUES
      ('b1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111112', 1),
      ('b1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111114', 2),
      ('b1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111118', 3),
      ('b1111111-1111-1111-1111-111111111112', 'e1111111-1111-1111-1111-111111111111', 1),
      ('b1111111-1111-1111-1111-111111111112', 'e1111111-1111-1111-1111-111111111113', 2),
      ('b1111111-1111-1111-1111-111111111112', 'e1111111-1111-1111-1111-111111111117', 3),
      ('b1111111-1111-1111-1111-111111111113', 'e1111111-1111-1111-1111-111111111114', 1),
      ('b1111111-1111-1111-1111-111111111113', 'e1111111-1111-1111-1111-111111111116', 2)
    ON CONFLICT (collection_id, product_id) DO NOTHING;

    -- 7. Add sample authenticity certificates (PREVIEW DATA)
    INSERT INTO public.product_authenticity_certificates (
      id, product_id, designer_id, certificate_number, designer_name,
      materials_certified, production_location, is_active
    )
    VALUES
      ('cert-seed-001', 'prod-seed-001', designer_id_1, 'PKD-26-0001', 'Designer Studio', ARRAY['Silk', 'Cotton lining'], 'Lahore, Pakistan', true),
      ('cert-seed-005', 'prod-seed-005', designer_id_3, 'PKD-26-0005', 'Designer Atelier', ARRAY['Silk', 'Organza', 'Metallic thread'], 'Karachi, Pakistan', true)
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Marketplace preview data seeded successfully for % products', 8;
  ELSE
    RAISE NOTICE 'No designer profiles found. Please create designer profiles first.';
  END IF;
END $$;

-- ============================================================================
-- CLEANUP INSTRUCTIONS:
-- Before production launch, run this to remove all seed data:
-- 
-- DELETE FROM public.marketplace_collection_products WHERE product_id LIKE 'prod-seed-%';
-- DELETE FROM public.product_visual_attributes WHERE product_id LIKE 'prod-seed-%';
-- DELETE FROM public.product_authenticity_certificates WHERE product_id LIKE 'prod-seed-%';
-- DELETE FROM public.marketplace_products WHERE id LIKE 'prod-seed-%';
-- DELETE FROM public.marketplace_collections WHERE id LIKE 'col-%';
-- DELETE FROM public.marketplace_categories WHERE id LIKE 'cat-%';
--
-- Or simply delete/comment out this entire migration file before deployment.
-- ============================================================================

COMMENT ON TABLE public.marketplace_products IS 'Contains sample seed data prefixed with "prod-seed-" - REMOVE BEFORE PRODUCTION';
