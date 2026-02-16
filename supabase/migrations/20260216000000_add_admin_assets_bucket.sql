-- Migration to create admin-assets bucket for Super Admin profile pictures and admin files
-- This fixes the issue where Super Admin cannot upload profile pictures

-- Create the admin-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'admin-assets',
  'admin-assets',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[];

-- Drop any existing policies for admin-assets to avoid conflicts
DROP POLICY IF EXISTS "Public can view admin-assets" ON storage.objects;
DROP POLICY IF EXISTS "Superadmins can manage admin-assets" ON storage.objects;
DROP POLICY IF EXISTS "Superadmins can upload admin-assets" ON storage.objects;
DROP POLICY IF EXISTS "Superadmins can update admin-assets" ON storage.objects;
DROP POLICY IF EXISTS "Superadmins can delete admin-assets" ON storage.objects;

-- Create policy for public read access (so avatars can be displayed)
CREATE POLICY "Public can view admin-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'admin-assets');

-- Create policy for superadmins to upload files
CREATE POLICY "Superadmins can upload admin-assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'admin-assets'
  AND public.is_superadmin(auth.uid())
);

-- Create policy for superadmins to update files
CREATE POLICY "Superadmins can update admin-assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'admin-assets'
  AND public.is_superadmin(auth.uid())
);

-- Create policy for superadmins to delete files
CREATE POLICY "Superadmins can delete admin-assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'admin-assets'
  AND public.is_superadmin(auth.uid())
);

-- Note: Migration applied successfully. admin-assets bucket created for Super Admin profile pictures.
