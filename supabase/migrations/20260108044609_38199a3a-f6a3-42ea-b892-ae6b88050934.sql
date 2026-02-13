-- Enhance marketplace_categories table
ALTER TABLE public.marketplace_categories
ADD COLUMN IF NOT EXISTS focus_areas TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS vibe_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS featured_products_count INTEGER DEFAULT 8,
ADD COLUMN IF NOT EXISTS banner_image_url TEXT;

-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  author_id UUID REFERENCES auth.users(id),
  category TEXT NOT NULL DEFAULT 'style-guide',
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false
);

-- Enable RLS on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Articles RLS policies
CREATE POLICY "Anyone can view published articles"
ON public.articles FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can view all articles"
ON public.articles FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Admins can insert articles"
ON public.articles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Admins can update articles"
ON public.articles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Admins can delete articles"
ON public.articles FOR DELETE
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- Trigger for updated_at
CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the 7 marketplace categories
INSERT INTO public.marketplace_categories (name, slug, description, is_active, display_order, focus_areas, vibe_tags, seo_title, seo_description)
VALUES
  ('Conceptual Outerwear', 'conceptual-outerwear', 'Architectural shapes, exaggerated silhouettes, and unconventional materials define this avant-garde collection.', true, 1, 
   ARRAY['Architectural shapes', 'Exaggerated silhouettes', 'Unconventional materials'], 
   ARRAY['Avant-garde', 'Art-wear', 'Runway pieces'],
   'Conceptual Outerwear | Avant-Garde Designer Coats & Jackets',
   'Discover architectural outerwear with exaggerated silhouettes and unconventional materials. Shop runway-ready art-wear from emerging designers.'),
  
  ('Modern Tailoring', 'modern-tailoring', 'Deconstructed suits, asymmetric cuts, and innovative draping redefine sophisticated office wear.', true, 2,
   ARRAY['Deconstructed suits', 'Asymmetry', 'Sharp cuts', 'Innovative draping'],
   ARRAY['Sophisticated', 'Structured', 'Redefining office wear'],
   'Modern Tailoring | Deconstructed Suits & Designer Blazers',
   'Shop modern tailored pieces featuring asymmetric cuts and innovative draping. Sophisticated designer wear that redefines structure.'),
  
  ('Sustainable & Upcycled', 'sustainable-upcycled', 'Zero-waste patterns, deadstock fabrics, and repurposed vintage pieces championing slow fashion.', true, 3,
   ARRAY['Zero-waste patterns', 'Deadstock fabrics', 'Repurposed vintage', 'Organic dyes'],
   ARRAY['Eco-conscious', 'Raw', 'Storytelling', 'Slow Fashion'],
   'Sustainable Fashion | Upcycled & Eco-Conscious Designer Wear',
   'Explore sustainable designer fashion made from deadstock fabrics and upcycled materials. Shop eco-conscious slow fashion with a story.'),
  
  ('Luxury Streetwear', 'luxury-streetwear', 'High-GSM jersey, technical fabrics, and utility details meet oversized urban aesthetics.', true, 4,
   ARRAY['High-GSM jersey', 'Technical fabrics', 'Utility details', 'Oversized fits'],
   ARRAY['Hype', 'Urban', 'Functional', 'Expensive ease'],
   'Luxury Streetwear | Designer Urban & Technical Fashion',
   'Premium streetwear featuring technical fabrics and utility-inspired design. Shop luxury urban fashion with an effortless edge.'),
  
  ('Artisanal & Handcrafted', 'artisanal-handcrafted', 'Hand-embroidery, intricate knitting, and hand-painted fabrics celebrating heritage techniques.', true, 5,
   ARRAY['Hand-embroidery', 'Intricate knitting', 'Weaving', 'Hand-painted fabrics'],
   ARRAY['Bohemian', 'Heritage techniques', 'One-of-a-kind'],
   'Artisanal Fashion | Handcrafted & Hand-Embroidered Pieces',
   'Discover one-of-a-kind handcrafted fashion featuring traditional embroidery, knitting, and artisanal techniques from skilled makers.'),
  
  ('Gender-Fluid / Unisex', 'gender-fluid-unisex', 'Neutral silhouettes, adjustable sizing, and versatile cuts for an inclusive, progressive wardrobe.', true, 6,
   ARRAY['Neutral silhouettes', 'Adjustable sizing', 'Versatile cuts'],
   ARRAY['Inclusive', 'Modern', 'Progressive'],
   'Gender-Fluid Fashion | Unisex Designer Clothing',
   'Shop inclusive, gender-fluid fashion with versatile silhouettes and adjustable sizing. Modern unisex designer wear for everyone.'),
  
  ('Sculptural Accessories', 'sculptural-accessories', 'Jewelry, bags, and belts that transcend function to become wearable art objects.', true, 7,
   ARRAY['Statement jewelry', 'Art-object bags', 'Sculptural belts', 'Metalwork', 'Leather molding'],
   ARRAY['Statement pieces', 'Finishing touches', 'Wearable art'],
   'Sculptural Accessories | Designer Art-Object Jewelry & Bags',
   'Discover statement accessories that blur the line between fashion and art. Shop sculptural jewelry, bags, and belts from visionary designers.')
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  focus_areas = EXCLUDED.focus_areas,
  vibe_tags = EXCLUDED.vibe_tags,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  display_order = EXCLUDED.display_order;