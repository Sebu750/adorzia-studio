-- Rename xp column to style_credits in profiles table
-- This aligns the database with the ranking system based on Style Credits (SC)

-- 1. Rename the column
ALTER TABLE public.profiles 
RENAME COLUMN xp TO style_credits;

-- 2. Add comment for clarity
COMMENT ON COLUMN public.profiles.style_credits IS 'Style Credits (SC) - used for designer ranking system';

-- 3. Update any existing data that might have NULL values to 0
UPDATE public.profiles 
SET style_credits = 0 
WHERE style_credits IS NULL;

-- 4. Set default value for new records
ALTER TABLE public.profiles 
ALTER COLUMN style_credits SET DEFAULT 0;
