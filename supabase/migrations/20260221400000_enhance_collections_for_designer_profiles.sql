-- Ensure marketplace_collections table has proper structure for enhanced designer profiles

-- Add missing columns if they don't exist
ALTER TABLE public.marketplace_collections
  ADD COLUMN IF NOT EXISTS designer_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_marketplace_collections_designer_id ON public.marketplace_collections(designer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_collections_is_active ON public.marketplace_collections(is_active);
CREATE INDEX IF NOT EXISTS idx_marketplace_collections_is_featured ON public.marketplace_collections(is_featured);

-- Update existing collections to have designer_id if missing
-- This would need to be done manually based on your data structure
-- UPDATE public.marketplace_collections 
-- SET designer_id = 'some-designer-id' 
-- WHERE designer_id IS NULL;

-- Add RLS policies if they don't exist
ALTER TABLE public.marketplace_collections ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active collections
CREATE POLICY IF NOT EXISTS "Public can view active collections" ON public.marketplace_collections
  FOR SELECT USING (is_active = true);

-- Allow designers to manage their own collections
CREATE POLICY IF NOT EXISTS "Designers can manage their collections" ON public.marketplace_collections
  FOR ALL USING (
    auth.uid() = designer_id
  );

-- Add comment for documentation
COMMENT ON COLUMN public.marketplace_collections.designer_id IS 'The designer who owns this collection';
COMMENT ON COLUMN public.marketplace_collections.is_active IS 'Whether this collection is currently visible';
COMMENT ON COLUMN public.marketplace_collections.is_featured IS 'Whether this collection should be highlighted';
