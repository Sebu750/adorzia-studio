-- =====================================================
-- ADD DESIGNER ASSOCIATION TO MARKETPLACE COLLECTIONS
-- =====================================================
-- This migration adds designer_id to marketplace_collections
-- to allow admins to create collections for specific designers

-- Add designer_id column to marketplace_collections
ALTER TABLE public.marketplace_collections 
ADD COLUMN IF NOT EXISTS designer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster queries by designer
CREATE INDEX IF NOT EXISTS idx_marketplace_collections_designer_id 
ON public.marketplace_collections(designer_id) 
WHERE designer_id IS NOT NULL;

-- Update RLS policies to allow designers to view their own collections
-- First, drop existing policy if it exists
DROP POLICY IF EXISTS "Designers can view their own collections" ON public.marketplace_collections;

-- Create policy for designers to view collections assigned to them
CREATE POLICY "Designers can view their own collections" 
ON public.marketplace_collections 
FOR SELECT 
USING (
  is_active = true 
  AND (
    designer_id IS NULL 
    OR designer_id = auth.uid()
  )
);

-- Note: The existing "Admins can manage collections" policy already allows
-- admins to create/update/delete collections for any designer

-- Add comment explaining the column
COMMENT ON COLUMN public.marketplace_collections.designer_id IS 
'Optional designer assignment. NULL means general collection, UUID means collection for specific designer.';
