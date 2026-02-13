-- Add columns for featured articles to articles table

-- First, let's check if the articles table exists and what its structure is
-- We'll add the is_featured column to highlight featured articles

ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Add an index for better performance when querying featured articles
CREATE INDEX IF NOT EXISTS idx_articles_is_featured 
ON public.articles(is_featured) 
WHERE is_featured = TRUE;

-- If the articles table doesn't exist, we'll need to create it
-- But assuming it exists based on our code references, we just add the column