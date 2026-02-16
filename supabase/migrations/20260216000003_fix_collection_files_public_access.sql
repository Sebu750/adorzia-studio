-- Fix collection-files bucket public access policy
-- Ensure that uploaded collection images are accessible publicly

-- The existing policy should already allow public access, but let's make sure it's properly configured
-- We'll recreate the policy to ensure it's correct

-- First, let's check the current bucket configuration
-- Update the bucket to ensure it's public (might already be set)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'collection-files';

-- Recreate the policies to ensure they're properly applied
DROP POLICY IF EXISTS "Anyone can view collection files" ON storage.objects;

CREATE POLICY "Anyone can view collection files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'collection-files');

-- Ensure insert policy is correct
DROP POLICY IF EXISTS "Designers can upload collection files" ON storage.objects;

CREATE POLICY "Designers can upload collection files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'collection-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Ensure update policy is correct
DROP POLICY IF EXISTS "Designers can update own collection files" ON storage.objects;

CREATE POLICY "Designers can update own collection files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'collection-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Ensure delete policy is correct
DROP POLICY IF EXISTS "Designers can delete own collection files" ON storage.objects;

CREATE POLICY "Designers can delete own collection files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'collection-files' AND auth.uid()::text = (storage.foldername(name))[1]);