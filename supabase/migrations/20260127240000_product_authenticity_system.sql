-- FR 1.6: Authenticity Verification System
-- Digital certificate of authenticity linked to designer IP for luxury marketplace

-- Product Authenticity Certificates Table
CREATE TABLE IF NOT EXISTS public.product_authenticity_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  designer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Designer IP Information
  designer_name TEXT NOT NULL,
  designer_signature TEXT, -- Base64 encoded signature image
  design_date DATE,
  design_description TEXT,
  
  -- Product Verification Details
  materials_certified TEXT[],
  craftsmanship_notes TEXT,
  production_location TEXT,
  production_date DATE,
  
  -- Blockchain/Hash for immutability (future integration)
  certificate_hash TEXT UNIQUE,
  blockchain_tx_id TEXT,
  
  -- Certificate Metadata
  qr_code_url TEXT,
  certificate_pdf_url TEXT,
  is_active BOOLEAN DEFAULT true,
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order Item Authenticity (each sold item gets unique certificate)
CREATE TABLE IF NOT EXISTS public.order_item_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES public.marketplace_order_items(id) ON DELETE CASCADE,
  certificate_id UUID NOT NULL REFERENCES public.product_authenticity_certificates(id) ON DELETE CASCADE,
  serial_number TEXT NOT NULL UNIQUE, -- Unique for each physical item
  issued_to_customer_id UUID REFERENCES public.marketplace_customers(id) ON DELETE SET NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Transfer History for resale tracking
  transfer_history JSONB DEFAULT '[]'::jsonb,
  current_owner_id UUID REFERENCES public.marketplace_customers(id),
  
  -- Verification
  verification_code TEXT NOT NULL UNIQUE, -- Public verification code
  last_verified_at TIMESTAMPTZ,
  verification_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Designer IP Registration (copyright/trademark info)
CREATE TABLE IF NOT EXISTS public.designer_ip_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- IP Protection Details
  ip_type TEXT NOT NULL CHECK (ip_type IN ('copyright', 'trademark', 'patent', 'design_patent')),
  registration_number TEXT,
  registration_country TEXT,
  registration_date DATE,
  expiry_date DATE,
  
  -- Design Details
  design_name TEXT NOT NULL,
  design_description TEXT,
  design_images JSONB DEFAULT '[]'::jsonb,
  
  -- Legal Documentation
  certificate_url TEXT,
  legal_documents JSONB DEFAULT '[]'::jsonb,
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'expired', 'disputed')),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product IP Linkage
CREATE TABLE IF NOT EXISTS public.product_ip_linkage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  ip_registry_id UUID NOT NULL REFERENCES public.designer_ip_registry(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, ip_registry_id)
);

-- Enable RLS
ALTER TABLE public.product_authenticity_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designer_ip_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_ip_linkage ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Authenticity Certificates
CREATE POLICY "Public can view active certificates"
  ON public.product_authenticity_certificates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Designers can view own certificates"
  ON public.product_authenticity_certificates FOR SELECT
  TO authenticated
  USING (designer_id = auth.uid());

CREATE POLICY "Admins can manage all certificates"
  ON public.product_authenticity_certificates FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin')
  );

-- RLS Policies: Order Item Certificates
CREATE POLICY "Customers can view own certificates"
  ON public.order_item_certificates FOR SELECT
  TO authenticated
  USING (
    issued_to_customer_id IN (
      SELECT id FROM public.marketplace_customers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can verify certificates by code"
  ON public.order_item_certificates FOR SELECT
  USING (true); -- Verification endpoint will filter by code

-- RLS Policies: Designer IP Registry
CREATE POLICY "Public can view verified IP"
  ON public.designer_ip_registry FOR SELECT
  USING (status = 'verified');

CREATE POLICY "Designers can manage own IP"
  ON public.designer_ip_registry FOR ALL
  TO authenticated
  USING (designer_id = auth.uid())
  WITH CHECK (designer_id = auth.uid());

-- RLS Policies: Product IP Linkage
CREATE POLICY "Public can view product IP links"
  ON public.product_ip_linkage FOR SELECT
  USING (true);

-- Function: Generate Certificate Number
CREATE OR REPLACE FUNCTION generate_certificate_number(p_designer_id UUID)
RETURNS TEXT AS $$
DECLARE
  designer_code TEXT;
  year_code TEXT;
  sequence_num INTEGER;
  cert_number TEXT;
BEGIN
  -- Get designer initials or first 3 chars of name
  SELECT UPPER(LEFT(COALESCE(name, 'DES'), 3)) INTO designer_code
  FROM public.profiles WHERE id = p_designer_id;
  
  -- Year code (last 2 digits)
  year_code := TO_CHAR(CURRENT_DATE, 'YY');
  
  -- Get next sequence for this designer
  SELECT COALESCE(COUNT(*), 0) + 1 INTO sequence_num
  FROM public.product_authenticity_certificates
  WHERE designer_id = p_designer_id;
  
  -- Format: ABC-23-0001
  cert_number := designer_code || '-' || year_code || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN cert_number;
END;
$$ LANGUAGE plpgsql;

-- Function: Generate Serial Number (for each sold item)
CREATE OR REPLACE FUNCTION generate_serial_number(p_certificate_id UUID)
RETURNS TEXT AS $$
DECLARE
  cert_number TEXT;
  item_sequence INTEGER;
  serial_num TEXT;
BEGIN
  -- Get base certificate number
  SELECT certificate_number INTO cert_number
  FROM public.product_authenticity_certificates
  WHERE id = p_certificate_id;
  
  -- Get item sequence
  SELECT COALESCE(COUNT(*), 0) + 1 INTO item_sequence
  FROM public.order_item_certificates
  WHERE certificate_id = p_certificate_id;
  
  -- Format: ABC-23-0001-001
  serial_num := cert_number || '-' || LPAD(item_sequence::TEXT, 3, '0');
  
  RETURN serial_num;
END;
$$ LANGUAGE plpgsql;

-- Function: Generate Verification Code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(
    SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 4) || '-' ||
    SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 4) || '-' ||
    SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 4)
  );
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_certificates_product ON public.product_authenticity_certificates(product_id);
CREATE INDEX IF NOT EXISTS idx_certificates_designer ON public.product_authenticity_certificates(designer_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON public.product_authenticity_certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_order_certificates_serial ON public.order_item_certificates(serial_number);
CREATE INDEX IF NOT EXISTS idx_order_certificates_verification ON public.order_item_certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_ip_registry_designer ON public.designer_ip_registry(designer_id);
CREATE INDEX IF NOT EXISTS idx_product_ip_product ON public.product_ip_linkage(product_id);

-- Updated timestamp triggers
CREATE TRIGGER update_certificates_timestamp
  BEFORE UPDATE ON public.product_authenticity_certificates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ip_registry_timestamp
  BEFORE UPDATE ON public.designer_ip_registry
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE public.product_authenticity_certificates IS 'FR 1.6: Stores digital certificates of authenticity for luxury products';
COMMENT ON TABLE public.order_item_certificates IS 'FR 1.6: Individual certificates issued to customers for each purchased item';
COMMENT ON TABLE public.designer_ip_registry IS 'FR 1.6: Designer intellectual property registration and verification';
COMMENT ON TABLE public.product_ip_linkage IS 'FR 1.6: Links products to registered designer IP';
