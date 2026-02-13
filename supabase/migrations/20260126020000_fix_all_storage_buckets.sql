-- =====================================================
-- COMPREHENSIVE STORAGE BUCKETS FIX
-- This migration creates and configures ALL storage buckets
-- needed across the entire application with proper RLS policies
-- =====================================================

-- Create all necessary storage buckets
-- Using ON CONFLICT to avoid errors if buckets already exist

-- 1. AVATARS BUCKET (Profile pictures)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[];

-- 2. LOGOS BUCKET (Brand logos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']::text[];

-- 3. BANNERS BUCKET (Profile/page banners)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[];

-- 4. PORTFOLIO BUCKET (Portfolio project images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[];

-- 5. STYLEBOX-SUBMISSIONS BUCKET (Stylebox submission files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'stylebox-submissions',
  'stylebox-submissions',
  false,
  20971520, -- 20MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']::text[];

-- 6. COLLECTION-FILES BUCKET (Collection submission files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'collection-files',
  'collection-files',
  false,
  20971520, -- 20MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']::text[];

-- 7. FOUNDING-SUBMISSIONS BUCKET (Founding Designers Program)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'founding-submissions',
  'founding-submissions',
  false,
  20971520, -- 20MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']::text[];

-- 8. WALKTHROUGH-FILES BUCKET (Walkthrough content)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'walkthrough-files',
  'walkthrough-files',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']::text[];

-- 9. PRODUCT-IMAGES BUCKET (Marketplace product images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[];

-- =====================================================
-- RLS POLICIES FOR ALL BUCKETS
-- =====================================================

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public avatars are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

DROP POLICY IF EXISTS "Public logos are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own logo" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own logo" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own logo" ON storage.objects;

DROP POLICY IF EXISTS "Public banners are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own banner" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own banner" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own banner" ON storage.objects;

DROP POLICY IF EXISTS "Public portfolio images viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own portfolio images" ON storage.objects;

DROP POLICY IF EXISTS "Users can view own stylebox submissions" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload stylebox submissions" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own stylebox submissions" ON storage.objects;

DROP POLICY IF EXISTS "Users can view own collection files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload collection files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own collection files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own collection files" ON storage.objects;

DROP POLICY IF EXISTS "Users can upload founding submission files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own founding files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all founding files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own founding files" ON storage.objects;

DROP POLICY IF EXISTS "Public walkthrough files viewable" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload walkthrough files" ON storage.objects;

DROP POLICY IF EXISTS "Public product images viewable" ON storage.objects;
DROP POLICY IF EXISTS "Designers can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Designers can update own product images" ON storage.objects;
DROP POLICY IF EXISTS "Designers can delete own product images" ON storage.objects;

-- =====================================================
-- AVATARS BUCKET POLICIES
-- =====================================================

CREATE POLICY "Public avatars are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- LOGOS BUCKET POLICIES
-- =====================================================

CREATE POLICY "Public logos are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

CREATE POLICY "Users can upload their own logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own logo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own logo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- BANNERS BUCKET POLICIES
-- =====================================================

CREATE POLICY "Public banners are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

CREATE POLICY "Users can upload their own banner"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'banners'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own banner"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'banners'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own banner"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'banners'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- PORTFOLIO BUCKET POLICIES
-- =====================================================

CREATE POLICY "Public portfolio images viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Users can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own portfolio images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own portfolio images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- STYLEBOX-SUBMISSIONS BUCKET POLICIES
-- =====================================================

CREATE POLICY "Users can view own stylebox submissions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'stylebox-submissions'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  )
);

CREATE POLICY "Users can upload stylebox submissions"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'stylebox-submissions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own stylebox submissions"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'stylebox-submissions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- COLLECTION-FILES BUCKET POLICIES
-- =====================================================

CREATE POLICY "Users can view own collection files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'collection-files'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  )
);

CREATE POLICY "Users can upload collection files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'collection-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own collection files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'collection-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own collection files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'collection-files'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- FOUNDING-SUBMISSIONS BUCKET POLICIES
-- =====================================================

CREATE POLICY "Users can upload founding submission files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'founding-submissions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own founding files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'founding-submissions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can view all founding files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'founding-submissions'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "Users can delete own founding files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'founding-submissions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- WALKTHROUGH-FILES BUCKET POLICIES
-- =====================================================

CREATE POLICY "Public walkthrough files viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'walkthrough-files');

CREATE POLICY "Admins can upload walkthrough files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'walkthrough-files'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- =====================================================
-- PRODUCT-IMAGES BUCKET POLICIES
-- =====================================================

CREATE POLICY "Public product images viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Designers can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Designers can update own product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Designers can delete own product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
