-- Enhance designer profiles with comprehensive profile fields
-- Adds fields for brand storytelling, professional credibility, and cross-platform presence

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS brand_name TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS banner_image TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS education TEXT[],
ADD COLUMN IF NOT EXISTS awards TEXT[],
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
ADD COLUMN IF NOT EXISTS twitter_handle TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS tiktok_handle TEXT,
ADD COLUMN IF NOT EXISTS youtube_channel TEXT,
ADD COLUMN IF NOT EXISTS dribbble_url TEXT,
ADD COLUMN IF NOT EXISTS behance_url TEXT,
ADD COLUMN IF NOT EXISTS etsy_shop_url TEXT,
ADD COLUMN IF NOT EXISTS shopify_store_url TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_brand_name ON profiles(brand_name);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);

-- Enable RLS (Row Level Security) if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profile access
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles" 
ON profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- Add storage bucket for logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Add storage bucket for banners if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Add storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for logos
DROP POLICY IF EXISTS "Anyone can read logos" ON storage.objects;
CREATE POLICY "Anyone can read logos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'logos');

DROP POLICY IF EXISTS "Users can upload own logos" ON storage.objects;
CREATE POLICY "Users can upload own logos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own logos" ON storage.objects;
CREATE POLICY "Users can update own logos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own logos" ON storage.objects;
CREATE POLICY "Users can delete own logos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage policies for banners
DROP POLICY IF EXISTS "Anyone can read banners" ON storage.objects;
CREATE POLICY "Anyone can read banners" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "Users can upload own banners" ON storage.objects;
CREATE POLICY "Users can upload own banners" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'banners' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own banners" ON storage.objects;
CREATE POLICY "Users can update own banners" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'banners' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own banners" ON storage.objects;
CREATE POLICY "Users can delete own banners" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'banners' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage policies for avatars
DROP POLICY IF EXISTS "Anyone can read avatars" ON storage.objects;
CREATE POLICY "Anyone can read avatars" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload own avatars" ON storage.objects;
CREATE POLICY "Users can upload own avatars" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
CREATE POLICY "Users can update own avatars" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
CREATE POLICY "Users can delete own avatars" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
