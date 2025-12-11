-- Add bio and skills columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[];

-- Update the handle_new_user function to auto-assign F1 rank
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  f1_rank_id UUID;
BEGIN
  -- Get F1 rank ID (rank_order = 0)
  SELECT id INTO f1_rank_id FROM public.ranks WHERE rank_order = 0 LIMIT 1;
  
  INSERT INTO public.profiles (user_id, email, name, category, rank_id, xp)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'category')::designer_category, 'fashion'::designer_category),
    f1_rank_id,
    0
  );
  RETURN NEW;
END;
$$;