-- Migration to add 'lead_curator' role and update RBAC for StyleBox creation
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'lead_curator' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'lead_curator';
  END IF;
END$$;

-- Update RLS policies for styleboxes to include lead_curator
DROP POLICY IF EXISTS "Admins can manage styleboxes" ON public.styleboxes;
CREATE POLICY "Admins and Lead Curators can manage styleboxes" ON public.styleboxes
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'superadmin') OR 
    public.has_role(auth.uid(), 'lead_curator')
  );

-- Update storage policies for stylebox-curation-assets
DROP POLICY IF EXISTS "Curators can manage curation assets" ON storage.objects;
CREATE POLICY "Admins and Lead Curators can manage curation assets"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'stylebox-curation-assets' AND (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'superadmin') OR 
    public.has_role(auth.uid(), 'lead_curator')
  )
);
