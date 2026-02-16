-- Migration to add 'lead_curator' role and update RBAC for StyleBox creation
-- Part 1: Add the new enum value
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'lead_curator' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'lead_curator';
  END IF;
END$$;
