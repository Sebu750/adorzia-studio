-- Add admin policy for product-images bucket
-- Admins need to be able to upload product images for marketplace products

-- Create security definer function to avoid recursion in RLS policies
CREATE OR REPLACE FUNCTION public.is_admin_or_superadmin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;

-- Create policy for admin uploads
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND public.is_admin_or_superadmin(auth.uid())
);

-- Also add admin update and delete policies
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND public.is_admin_or_superadmin(auth.uid())
);

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND public.is_admin_or_superadmin(auth.uid())
);
