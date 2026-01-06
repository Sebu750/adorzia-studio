-- =====================================================
-- ADORZIA MARKETPLACE DATABASE SCHEMA
-- =====================================================

-- 1. Marketplace Categories (hierarchical)
CREATE TABLE public.marketplace_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.marketplace_categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Marketplace Collections (curated groupings)
CREATE TABLE public.marketplace_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Collection Products (many-to-many)
CREATE TABLE public.marketplace_collection_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.marketplace_collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collection_id, product_id)
);

-- 4. Marketplace Customers (shopper accounts)
CREATE TABLE public.marketplace_customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  shipping_addresses JSONB DEFAULT '[]'::jsonb,
  billing_addresses JSONB DEFAULT '[]'::jsonb,
  default_shipping_address_id TEXT,
  default_billing_address_id TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Marketplace Carts
CREATE TABLE public.marketplace_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.marketplace_customers(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest carts
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10,2) DEFAULT 0,
  discount_code TEXT,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days')
);

-- 6. Marketplace Orders
CREATE TABLE public.marketplace_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.marketplace_customers(id) ON DELETE SET NULL,
  guest_email TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  shipping_address JSONB,
  billing_address JSONB,
  shipping_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  payment_intent_id TEXT,
  payment_method TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  notes TEXT,
  admin_notes TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Marketplace Order Items
CREATE TABLE public.marketplace_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.marketplace_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.marketplace_products(id) ON DELETE SET NULL,
  designer_id UUID NOT NULL,
  variant_data JSONB,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  designer_commission NUMERIC(10,2) DEFAULT 0,
  platform_fee NUMERIC(10,2) DEFAULT 0,
  commission_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Marketplace Reviews
CREATE TABLE public.marketplace_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.marketplace_customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.marketplace_orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Marketplace Wishlists
CREATE TABLE public.marketplace_wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.marketplace_customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(customer_id, product_id)
);

-- 10. Extend marketplace_products with new fields
ALTER TABLE public.marketplace_products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.marketplace_categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS weight NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS dimensions JSONB,
ADD COLUMN IF NOT EXISTS materials TEXT[],
ADD COLUMN IF NOT EXISTS care_instructions TEXT,
ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sale_price NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS sale_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sold_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index for product slugs
CREATE UNIQUE INDEX IF NOT EXISTS marketplace_products_slug_idx ON public.marketplace_products(slug) WHERE slug IS NOT NULL;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_wishlists ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, admin write
CREATE POLICY "Anyone can view active categories" ON public.marketplace_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.marketplace_categories
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Collections: Public read active, admin write
CREATE POLICY "Anyone can view active collections" ON public.marketplace_collections
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage collections" ON public.marketplace_collections
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Collection Products: Public read, admin write
CREATE POLICY "Anyone can view collection products" ON public.marketplace_collection_products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage collection products" ON public.marketplace_collection_products
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Customers: Users manage own, admins view all
CREATE POLICY "Users can view own customer record" ON public.marketplace_customers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own customer record" ON public.marketplace_customers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own customer record" ON public.marketplace_customers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all customers" ON public.marketplace_customers
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Carts: Users manage own, service role for guest carts
CREATE POLICY "Users can manage own cart" ON public.marketplace_carts
  FOR ALL USING (customer_id IN (SELECT id FROM public.marketplace_customers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all carts" ON public.marketplace_carts
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Orders: Users view own, admins manage all
CREATE POLICY "Users can view own orders" ON public.marketplace_orders
  FOR SELECT USING (customer_id IN (SELECT id FROM public.marketplace_customers WHERE user_id = auth.uid()));

CREATE POLICY "Service role can create orders" ON public.marketplace_orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all orders" ON public.marketplace_orders
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Order Items: Users view own, admins manage all
CREATE POLICY "Users can view own order items" ON public.marketplace_order_items
  FOR SELECT USING (order_id IN (
    SELECT id FROM public.marketplace_orders WHERE customer_id IN (
      SELECT id FROM public.marketplace_customers WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Designers can view their order items" ON public.marketplace_order_items
  FOR SELECT USING (designer_id = auth.uid());

CREATE POLICY "Admins can manage all order items" ON public.marketplace_order_items
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Reviews: Public read approved, users manage own, admins all
CREATE POLICY "Anyone can view approved reviews" ON public.marketplace_reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create reviews" ON public.marketplace_reviews
  FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM public.marketplace_customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own reviews" ON public.marketplace_reviews
  FOR UPDATE USING (customer_id IN (SELECT id FROM public.marketplace_customers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all reviews" ON public.marketplace_reviews
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Wishlists: Users manage own
CREATE POLICY "Users can manage own wishlist" ON public.marketplace_wishlists
  FOR ALL USING (customer_id IN (SELECT id FROM public.marketplace_customers WHERE user_id = auth.uid()));

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE TRIGGER update_marketplace_categories_updated_at
  BEFORE UPDATE ON public.marketplace_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_collections_updated_at
  BEFORE UPDATE ON public.marketplace_collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_customers_updated_at
  BEFORE UPDATE ON public.marketplace_customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_carts_updated_at
  BEFORE UPDATE ON public.marketplace_carts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_orders_updated_at
  BEFORE UPDATE ON public.marketplace_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_reviews_updated_at
  BEFORE UPDATE ON public.marketplace_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_marketplace_categories_parent ON public.marketplace_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_categories_slug ON public.marketplace_categories(slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_collections_slug ON public.marketplace_collections(slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_customers_user_id ON public.marketplace_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_carts_customer_id ON public.marketplace_carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_customer_id ON public.marketplace_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_order_number ON public.marketplace_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_status ON public.marketplace_orders(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_order_items_order_id ON public.marketplace_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_order_items_designer_id ON public.marketplace_order_items(designer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_product_id ON public.marketplace_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_wishlists_customer_id ON public.marketplace_wishlists(customer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_category_id ON public.marketplace_products(category_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_designer_id ON public.marketplace_products(designer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_status ON public.marketplace_products(status);

-- =====================================================
-- FUNCTION TO GENERATE ORDER NUMBER
-- =====================================================

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM public.marketplace_orders;
  new_number := 'ADZ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 5, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION TO UPDATE PRODUCT STATS
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_product_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.marketplace_products
    SET 
      average_rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM public.marketplace_reviews 
        WHERE product_id = NEW.product_id AND is_approved = true
      ),
      review_count = (
        SELECT COUNT(*) 
        FROM public.marketplace_reviews 
        WHERE product_id = NEW.product_id AND is_approved = true
      ),
      updated_at = now()
    WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.marketplace_products
    SET 
      average_rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM public.marketplace_reviews 
        WHERE product_id = OLD.product_id AND is_approved = true
      ),
      review_count = (
        SELECT COUNT(*) 
        FROM public.marketplace_reviews 
        WHERE product_id = OLD.product_id AND is_approved = true
      ),
      updated_at = now()
    WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_stats_on_review
  AFTER INSERT OR UPDATE OR DELETE ON public.marketplace_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_product_review_stats();