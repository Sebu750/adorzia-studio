-- Add pending_approval status to user_status enum
ALTER TYPE public.user_status ADD VALUE IF NOT EXISTS 'pending_approval';

-- Create designer_follows table for follow system
CREATE TABLE IF NOT EXISTS public.designer_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  designer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (follower_id, designer_id)
);

ALTER TABLE public.designer_follows ENABLE ROW LEVEL SECURITY;

-- RLS policies for designer_follows
CREATE POLICY "Users can view all follows"
  ON public.designer_follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow designers"
  ON public.designer_follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow designers"
  ON public.designer_follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Add follower counts to profiles (materialized view would be better for performance)
CREATE OR REPLACE FUNCTION public.get_follower_count(designer_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.designer_follows
  WHERE designer_id = designer_user_id
$$;

-- Create search index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_name_search ON public.profiles USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_profiles_bio_search ON public.profiles USING gin(to_tsvector('english', COALESCE(bio, '')));
CREATE INDEX IF NOT EXISTS idx_marketplace_products_title_search ON public.marketplace_products USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_marketplace_products_description_search ON public.marketplace_products USING gin(to_tsvector('english', COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_marketplace_collections_name_search ON public.marketplace_collections USING gin(to_tsvector('english', name));

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_status_category ON public.profiles(status, category);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_status_category ON public.marketplace_products(status, category_id);
CREATE INDEX IF NOT EXISTS idx_designer_follows_designer ON public.designer_follows(designer_id);
CREATE INDEX IF NOT EXISTS idx_designer_follows_follower ON public.designer_follows(follower_id);

-- Create a unified search function
CREATE OR REPLACE FUNCTION public.global_search(search_query TEXT, result_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  result_type TEXT,
  id UUID,
  title TEXT,
  subtitle TEXT,
  image_url TEXT,
  url TEXT,
  relevance REAL
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  -- Search Designers
  SELECT
    'designer'::TEXT as result_type,
    p.user_id as id,
    p.name as title,
    p.bio as subtitle,
    p.avatar_url as image_url,
    ('/shop/products?designer=' || p.user_id) as url,
    ts_rank(to_tsvector('english', p.name || ' ' || COALESCE(p.bio, '')), plainto_tsquery('english', search_query)) as relevance
  FROM public.profiles p
  WHERE
    p.status = 'active'
    AND (
      to_tsvector('english', p.name || ' ' || COALESCE(p.bio, '')) @@ plainto_tsquery('english', search_query)
      OR p.name ILIKE '%' || search_query || '%'
      OR p.brand_name ILIKE '%' || search_query || '%'
    )
  
  UNION ALL
  
  -- Search Products
  SELECT
    'product'::TEXT as result_type,
    mp.id as id,
    mp.title as title,
    mp.description as subtitle,
    (mp.images->0)::TEXT as image_url,
    ('/shop/product/' || COALESCE(mp.slug, mp.id::TEXT)) as url,
    ts_rank(to_tsvector('english', mp.title || ' ' || COALESCE(mp.description, '')), plainto_tsquery('english', search_query)) as relevance
  FROM public.marketplace_products mp
  WHERE
    mp.status = 'live'
    AND (
      to_tsvector('english', mp.title || ' ' || COALESCE(mp.description, '')) @@ plainto_tsquery('english', search_query)
      OR mp.title ILIKE '%' || search_query || '%'
    )
  
  UNION ALL
  
  -- Search Collections
  SELECT
    'collection'::TEXT as result_type,
    mc.id as id,
    mc.name as title,
    mc.description as subtitle,
    mc.image_url as image_url,
    ('/shop/products?collection=' || mc.id) as url,
    ts_rank(to_tsvector('english', mc.name || ' ' || COALESCE(mc.description, '')), plainto_tsquery('english', search_query)) as relevance
  FROM public.marketplace_collections mc
  WHERE
    mc.is_active = true
    AND (
      to_tsvector('english', mc.name || ' ' || COALESCE(mc.description, '')) @@ plainto_tsquery('english', search_query)
      OR mc.name ILIKE '%' || search_query || '%'
    )
  
  ORDER BY relevance DESC
  LIMIT result_limit;
END;
$$;

-- Grant execute permission on the search function
GRANT EXECUTE ON FUNCTION public.global_search TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_follower_count TO authenticated, anon;
