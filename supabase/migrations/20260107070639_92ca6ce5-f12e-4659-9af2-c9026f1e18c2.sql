-- Add remaining RLS policies for marketplace_products

-- Policy: Anyone can view live products
CREATE POLICY "Public can view live products" ON public.marketplace_products
  FOR SELECT
  USING (status = 'live');

-- Policy: Designers can view their own products (any status)
CREATE POLICY "Designers can view own products" ON public.marketplace_products
  FOR SELECT
  TO authenticated
  USING (designer_id = auth.uid());

-- Policy: Designers can insert their own products
CREATE POLICY "Designers can create own products" ON public.marketplace_products
  FOR INSERT
  TO authenticated
  WITH CHECK (designer_id = auth.uid() AND is_adorzia_product = false);

-- Policy: Designers can update their own products
CREATE POLICY "Designers can update own products" ON public.marketplace_products
  FOR UPDATE
  TO authenticated
  USING (designer_id = auth.uid())
  WITH CHECK (designer_id = auth.uid() AND is_adorzia_product = false);

-- Policy: Designers can delete their own draft products
CREATE POLICY "Designers can delete own draft products" ON public.marketplace_products
  FOR DELETE
  TO authenticated
  USING (designer_id = auth.uid() AND status = 'draft');