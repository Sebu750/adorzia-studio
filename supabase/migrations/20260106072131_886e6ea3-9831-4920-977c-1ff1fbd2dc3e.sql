-- Fix search_path for new functions
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
$$ LANGUAGE plpgsql SET search_path = public;

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
$$ LANGUAGE plpgsql SET search_path = public;