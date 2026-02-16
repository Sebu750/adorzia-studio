-- Create bucket for StyleBox curation phase assets (Module D)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'stylebox-curation-assets',
  'stylebox-curation-assets',
  false,
  20971520, -- 20MB limit
  ARRAY[
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/webp', 
    'application/pdf',
    'video/mp4',
    'video/quicktime',
    'model/obj',
    'model/gltf-binary',
    'application/octet-stream'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY[
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/webp', 
    'application/pdf',
    'video/mp4',
    'video/quicktime',
    'model/obj',
    'model/gltf-binary',
    'application/octet-stream'
  ]::text[];

-- RLS Policies for curators and admins
CREATE POLICY "Curators can manage curation assets"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'stylebox-curation-assets'
);
