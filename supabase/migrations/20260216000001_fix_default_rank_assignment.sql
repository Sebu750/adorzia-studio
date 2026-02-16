-- Fix: Assign default Apprentice rank to new users
-- Also auto-assign ranks based on Style Credits (SC) for existing users

-- 1. Update handle_new_user function to assign default Apprentice rank
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_rank_id UUID;
BEGIN
  -- Get the Apprentice rank (rank_order = 2)
  SELECT id INTO default_rank_id FROM public.ranks WHERE rank_order = 2 LIMIT 1;
  
  INSERT INTO public.profiles (user_id, email, name, rank_id)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    default_rank_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Create function to auto-assign ranks based on Style Credits
CREATE OR REPLACE FUNCTION public.auto_assign_rank_based_on_sc()
RETURNS TRIGGER AS $$
DECLARE
  new_rank_id UUID;
  current_sc INTEGER;
BEGIN
  -- Get current Style Credits for the designer
  SELECT COALESCE(style_credits, 0) INTO current_sc
  FROM public.profiles
  WHERE user_id = NEW.user_id;
  
  -- Determine appropriate rank based on SC thresholds
  SELECT id INTO new_rank_id
  FROM public.ranks
  WHERE 
    CASE 
      WHEN current_sc >= 5001 THEN rank_order = 7  -- Creative Director
      WHEN current_sc >= 3201 THEN rank_order = 6  -- Visionary
      WHEN current_sc >= 2001 THEN rank_order = 5  -- Couturier
      WHEN current_sc >= 801 THEN rank_order = 4   -- Stylist
      WHEN current_sc >= 301 THEN rank_order = 3   -- Patternist
      ELSE rank_order = 2                          -- Apprentice (default)
    END
  LIMIT 1;
  
  -- Update the profile with the new rank if different
  IF new_rank_id IS NOT NULL AND new_rank_id != (SELECT rank_id FROM public.profiles WHERE user_id = NEW.user_id) THEN
    UPDATE public.profiles
    SET rank_id = new_rank_id
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Create trigger to auto-update rank when style_credits changes
DROP TRIGGER IF EXISTS on_style_credits_update ON public.profiles;
CREATE TRIGGER on_style_credits_update
  AFTER UPDATE OF style_credits ON public.profiles
  FOR EACH ROW
  WHEN (OLD.style_credits IS DISTINCT FROM NEW.style_credits)
  EXECUTE FUNCTION public.auto_assign_rank_based_on_sc();

-- 4. Fix existing profiles without ranks - assign Apprentice as default
UPDATE public.profiles
SET rank_id = (SELECT id FROM public.ranks WHERE rank_order = 2 LIMIT 1)
WHERE rank_id IS NULL;

-- 5. Auto-update ranks for existing users based on their current SC
DO $$
DECLARE
  profile_record RECORD;
  new_rank_id UUID;
BEGIN
  FOR profile_record IN 
    SELECT user_id, COALESCE(style_credits, 0) as sc, rank_id 
    FROM public.profiles 
    WHERE rank_id IS NOT NULL
  LOOP
    -- Determine appropriate rank
    SELECT id INTO new_rank_id
    FROM public.ranks
    WHERE 
      CASE 
        WHEN profile_record.sc >= 5001 THEN rank_order = 7
        WHEN profile_record.sc >= 3201 THEN rank_order = 6
        WHEN profile_record.sc >= 2001 THEN rank_order = 5
        WHEN profile_record.sc >= 801 THEN rank_order = 4
        WHEN profile_record.sc >= 301 THEN rank_order = 3
        ELSE rank_order = 2
      END
    LIMIT 1;
    
    -- Update if rank should change (and not a founder rank)
    IF new_rank_id IS NOT NULL AND new_rank_id != profile_record.rank_id THEN
      -- Check if current rank is not F1/F2 (founder ranks should be preserved)
      IF NOT EXISTS (
        SELECT 1 FROM public.ranks 
        WHERE id = profile_record.rank_id AND rank_order IN (0, 1)
      ) THEN
        UPDATE public.profiles
        SET rank_id = new_rank_id
        WHERE user_id = profile_record.user_id;
      END IF;
    END IF;
  END LOOP;
END $$;
