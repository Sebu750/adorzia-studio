-- Add custom categories and enhanced brand display support

-- Create custom_categories table for user-defined categories
CREATE TABLE IF NOT EXISTS public.custom_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add custom category reference to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS custom_category_id UUID REFERENCES public.custom_categories(id),
  ADD COLUMN IF NOT EXISTS custom_category_name TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_categories_user_id ON public.custom_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_custom_category_id ON public.profiles(custom_category_id);

-- Enable RLS
ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_categories
CREATE POLICY "Users can view their own custom categories" ON public.custom_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom categories" ON public.custom_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom categories" ON public.custom_categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom categories" ON public.custom_categories
  FOR DELETE USING (auth.uid() = user_id);

-- Update existing profiles to migrate from enum to text for category
-- This allows for both enum values and custom categories
ALTER TABLE public.profiles
  ALTER COLUMN category TYPE TEXT USING category::TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.custom_category_id IS 'Reference to user-defined custom category';
COMMENT ON COLUMN public.profiles.custom_category_name IS 'Direct storage of custom category name (for performance)';
COMMENT ON TABLE public.custom_categories IS 'User-defined custom categories for designer profiles';
