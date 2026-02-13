-- Ensure preview teams exist with all data
-- This is idempotent and will update existing teams or create new ones

-- First ensure columns exist
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Insert/Update preview teams (created_by is NULL for preview teams)
INSERT INTO public.teams (id, name, description, category, max_members, is_open, completed_challenges, banner_url, logo_url, created_at, created_by)
VALUES 
  (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Avant-Garde Collective',
    'Pushing boundaries in experimental fashion design. We specialize in unconventional materials, deconstructed silhouettes, and runway-ready pieces that challenge traditional aesthetics.',
    'fashion',
    5,
    false,
    8,
    'https://images.unsplash.com/photo-1558769132-cb1aea3c8838?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&h=200&fit=crop',
    NOW() - INTERVAL '4 months',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000002'::uuid,
    'Sustainable Studio',
    'Eco-conscious fashion collective dedicated to zero-waste patterns, organic textiles, and ethical production. Creating beautiful designs that respect our planet and future generations.',
    'textile',
    4,
    false,
    12,
    'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    NOW() - INTERVAL '6 months',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000003'::uuid,
    'Heritage Artisans',
    'Preserving traditional craftsmanship while creating modern designs. We blend cultural heritage with contemporary aesthetics, honoring ancient techniques in every stitch.',
    'jewelry',
    4,
    false,
    6,
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=200&h=200&fit=crop',
    NOW() - INTERVAL '3 months',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000004'::uuid,
    'Minimalist Masters',
    'Clean lines, timeless elegance, and functional beauty. Our design philosophy embraces simplicity and precision, proving that less is indeed more in creating lasting style.',
    'fashion',
    5,
    false,
    10,
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=200&h=200&fit=crop',
    NOW() - INTERVAL '5 months',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000005'::uuid,
    'Urban Streetwear Crew',
    'Bold graphics, street culture, and urban aesthetics. We capture the energy of city life in every design, merging high fashion with authentic street style.',
    'fashion',
    6,
    false,
    15,
    'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=200&h=200&fit=crop',
    NOW() - INTERVAL '7 months',
    NULL
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  banner_url = EXCLUDED.banner_url,
  logo_url = EXCLUDED.logo_url,
  completed_challenges = EXCLUDED.completed_challenges,
  max_members = EXCLUDED.max_members;
