-- Add columns for made-to-order and limited edition features to marketplace_products table

-- Add boolean column for made-to-order products
ALTER TABLE public.marketplace_products ADD COLUMN IF NOT EXISTS is_made_to_order BOOLEAN DEFAULT FALSE;

-- Add boolean column for limited edition products
ALTER TABLE public.marketplace_products ADD COLUMN IF NOT EXISTS is_limited_edition BOOLEAN DEFAULT FALSE;

-- Add integer column for edition size (only applicable when is_limited_edition is true)
ALTER TABLE public.marketplace_products ADD COLUMN IF NOT EXISTS edition_size INTEGER;

-- Add constraint to ensure edition_size is positive when is_limited_edition is true
ALTER TABLE public.marketplace_products ADD CONSTRAINT chk_edition_size_positive 
CHECK (NOT is_limited_edition OR (is_limited_edition AND edition_size > 0));

-- Update RLS policies to allow admins to manage these new columns
-- Admins can already manage all products, so no policy changes needed for access

-- Add indexes for better query performance on new columns
CREATE INDEX IF NOT EXISTS idx_marketplace_products_made_to_order 
ON public.marketplace_products(is_made_to_order) 
WHERE is_made_to_order = TRUE;

CREATE INDEX IF NOT EXISTS idx_marketplace_products_limited_edition 
ON public.marketplace_products(is_limited_edition) 
WHERE is_limited_edition = TRUE;

-- Also add a compound index for common filtering combinations
CREATE INDEX IF NOT EXISTS idx_marketplace_products_features 
ON public.marketplace_products(is_made_to_order, is_limited_edition);