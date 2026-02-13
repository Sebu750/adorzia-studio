-- Create sequence for StyleBox display IDs
CREATE SEQUENCE IF NOT EXISTS styleboxes_display_id_seq START WITH 1;

-- Function to generate the display ID
CREATE OR REPLACE FUNCTION generate_stylebox_display_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.display_id IS NULL THEN
    NEW.display_id := 'ADORZIA-SB-' || LPAD(nextval('styleboxes_display_id_seq')::text, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add new columns to styleboxes table
ALTER TABLE styleboxes 
ADD COLUMN IF NOT EXISTS display_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS collection_line TEXT,
ADD COLUMN IF NOT EXISTS market_context TEXT,
ADD COLUMN IF NOT EXISTS visibility_tags JSONB DEFAULT '[]'::jsonb;

-- Create trigger to auto-generate display_id
DROP TRIGGER IF EXISTS tr_generate_stylebox_display_id ON styleboxes;
CREATE TRIGGER tr_generate_stylebox_display_id
BEFORE INSERT ON styleboxes
FOR EACH ROW
EXECUTE FUNCTION generate_stylebox_display_id();
