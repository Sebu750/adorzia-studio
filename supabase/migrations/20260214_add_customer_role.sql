-- Migration: Add customer role and setup customer authentication system
-- Date: 2026-02-14

-- Add 'customer' to app_role enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'customer' 
    AND enumtypid = 'public.app_role'::regtype
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'customer';
  END IF;
END $$;

-- Ensure marketplace_customers has proper RLS
ALTER TABLE public.marketplace_customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own customer record" ON public.marketplace_customers;
DROP POLICY IF EXISTS "Users can update own customer record" ON public.marketplace_customers;
DROP POLICY IF EXISTS "Admins can view all customers" ON public.marketplace_customers;

-- Policy: Users can view their own customer record
CREATE POLICY "Users can view own customer record" ON public.marketplace_customers
  FOR SELECT USING (user_id = auth.uid());

-- Policy: Users can update their own customer record
CREATE POLICY "Users can update own customer record" ON public.marketplace_customers
  FOR UPDATE USING (user_id = auth.uid());

-- Policy: Admins can view all customers
CREATE POLICY "Admins can view all customers" ON public.marketplace_customers
  FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'superadmin')
  );

-- Function to automatically create customer record on signup
CREATE OR REPLACE FUNCTION public.handle_new_customer()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create customer record if user has 'customer' role
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = NEW.id AND role = 'customer'
  ) THEN
    INSERT INTO public.marketplace_customers (user_id, email, name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name')
    ON CONFLICT (user_id) DO UPDATE 
    SET email = EXCLUDED.email,
        name = EXCLUDED.name,
        updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created_customer ON auth.users;

-- Trigger to auto-create customer record
CREATE TRIGGER on_auth_user_created_customer
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_customer();

-- Also trigger on user update (in case role is added later)
DROP TRIGGER IF EXISTS on_auth_user_updated_customer ON auth.users;

CREATE TRIGGER on_auth_user_updated_customer
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
  EXECUTE FUNCTION public.handle_new_customer();

-- Add index for faster customer lookups
CREATE INDEX IF NOT EXISTS idx_marketplace_customers_user_id 
ON public.marketplace_customers(user_id);

-- Function to check if user is a customer
CREATE OR REPLACE FUNCTION public.is_customer(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'customer'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
