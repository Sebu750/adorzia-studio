-- Add fields to support admin-listed products and approval workflow
ALTER TABLE public.marketplace_products
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS is_adorzia_product boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id);

-- Make designer_id nullable (null = Adorzia product)
ALTER TABLE public.marketplace_products
  ALTER COLUMN designer_id DROP NOT NULL;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_marketplace_products_is_adorzia ON public.marketplace_products(is_adorzia_product);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_created_by ON public.marketplace_products(created_by);