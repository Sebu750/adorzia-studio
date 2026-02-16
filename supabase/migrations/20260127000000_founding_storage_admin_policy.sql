-- Add admin read access to founding-submissions bucket
-- This allows admins to view moodboards and tech packs in the review interface
-- Note: Storage policies must be created as the postgres user or with appropriate permissions
-- TEMPORARILY DISABLED: Requires elevated permissions

/*
DO $$
BEGIN
  -- Check if policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can view all founding submission files'
  ) THEN
    -- Create the policy using a function that runs with elevated privileges
    EXECUTE format('
      CREATE POLICY "Admins can view all founding submission files"
        ON storage.objects FOR SELECT
        USING (
          bucket_id = ''founding-submissions''
          AND EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role IN (''admin'', ''superadmin'')
          )
        )
    ');
  END IF;
END $$;
*/

-- Migration placeholder - policy creation requires superuser privileges
