-- Fix F1 and F2 bonuses (F1 = +10%, F2 = +5%)
UPDATE public.ranks 
SET 
  bonus_percentage = 10,
  description = 'Exclusive founding members with +10% lifetime commission bonus',
  revenue_share_percent = 10
WHERE name = 'F1';

UPDATE public.ranks 
SET 
  bonus_percentage = 5,
  description = 'Pioneer designers with +5% lifetime commission bonus',
  revenue_share_percent = 5
WHERE name = 'F2';

-- Update Novice (rank_order 2) to Apprentice with new SC thresholds
UPDATE public.ranks 
SET 
  name = 'Apprentice_new',
  revenue_share_percent = 8,
  min_weighted_score = 0,
  description = 'Learning the software and basic garment construction. SC: 0-300',
  requirements = '["SC Range: 0-300", "Learning design software", "Basic garment construction"]'::jsonb,
  priority_queue = false
WHERE rank_order = 2;

-- Update old Apprentice (rank_order 3) to Patternist
UPDATE public.ranks 
SET 
  name = 'Patternist',
  revenue_share_percent = 12,
  min_weighted_score = 301,
  description = 'Able to handle Medium difficulty (Complex patterns). SC: 301-800',
  requirements = '["SC Range: 301-800", "Handle Medium difficulty briefs", "Complex pattern creation"]'::jsonb,
  priority_queue = false
WHERE rank_order = 3;

-- Update Designer (rank_order 4) to Stylist
UPDATE public.ranks 
SET 
  name = 'Stylist',
  revenue_share_percent = 18,
  min_weighted_score = 801,
  description = 'Proven ability to handle Hard/Insane briefs. SC: 801-2,000',
  requirements = '["SC Range: 801-2,000", "Handle Hard/Insane briefs", "Advanced styling skills"]'::jsonb,
  priority_queue = false
WHERE rank_order = 4;

-- Update Senior (rank_order 5) to Couturier
UPDATE public.ranks 
SET 
  name = 'Couturier',
  revenue_share_percent = 25,
  min_weighted_score = 2001,
  description = 'Expert level; focus on luxury and high-detail designs. SC: 2,001-3,200',
  requirements = '["SC Range: 2,001-3,200", "Luxury design expertise", "High-detail craftsmanship"]'::jsonb,
  priority_queue = true
WHERE rank_order = 5;

-- Update Lead (rank_order 6) to Visionary
UPDATE public.ranks 
SET 
  name = 'Visionary',
  revenue_share_percent = 32,
  min_weighted_score = 3201,
  description = 'Trend-setter; designs have high artistic value. SC: 3,201-5,000',
  requirements = '["SC Range: 3,201-5,000", "Trend-setting capability", "High artistic value designs"]'::jsonb,
  priority_queue = true
WHERE rank_order = 6;

-- Update Elite (rank_order 7) to Creative Director
UPDATE public.ranks 
SET 
  name = 'Creative Director',
  revenue_share_percent = 40,
  min_weighted_score = 5001,
  description = 'The Master level; leading the Adorzia aesthetic. SC: 5,000+',
  requirements = '["SC Range: 5,000+", "Master-level expertise", "Leading platform aesthetic"]'::jsonb,
  priority_queue = true
WHERE rank_order = 7;

-- Now rename Apprentice_new to Apprentice (since old Apprentice is now Patternist)
UPDATE public.ranks 
SET name = 'Apprentice'
WHERE name = 'Apprentice_new';

-- Set all profiles to start at Apprentice rank (rank_order = 2)
UPDATE public.profiles 
SET rank_id = (SELECT id FROM public.ranks WHERE rank_order = 2 LIMIT 1);