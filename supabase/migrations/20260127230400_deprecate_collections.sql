-- =====================================================
-- DEPRECATE COLLECTIONS FEATURE
-- Migrate collection_submissions to portfolio system
-- =====================================================

-- Migrate collection_submissions data to portfolio_projects
-- This preserves existing collection submissions as portfolio projects
DO $$
DECLARE
  submission_record RECORD;
  portfolio_id_var UUID;
  new_project_id UUID;
BEGIN
  FOR submission_record IN 
    SELECT * FROM public.collection_submissions 
    WHERE status NOT IN ('draft') -- Only migrate non-draft submissions
  LOOP
    -- Get or create portfolio for designer
    SELECT id INTO portfolio_id_var
    FROM public.portfolios
    WHERE designer_id = submission_record.designer_id
    LIMIT 1;

    IF portfolio_id_var IS NULL THEN
      -- Create portfolio if doesn't exist
      INSERT INTO public.portfolios (designer_id, title, description)
      VALUES (
        submission_record.designer_id,
        'My Portfolio',
        'Design portfolio'
      )
      RETURNING id INTO portfolio_id_var;
    END IF;

    -- Create portfolio project from collection submission
    INSERT INTO public.portfolio_projects (
      portfolio_id,
      title,
      description,
      category,
      tags,
      thumbnail_url,
      source_type,
      migration_source,
      created_at,
      updated_at
    )
    VALUES (
      portfolio_id_var,
      submission_record.title,
      COALESCE(submission_record.description, submission_record.concept_notes, submission_record.inspiration),
      submission_record.category,
      NULL, -- No tags in collection_submissions
      submission_record.thumbnail_url,
      'migrated_collection',
      'collection_submissions',
      submission_record.created_at,
      submission_record.updated_at
    )
    RETURNING id INTO new_project_id;

    -- Migrate file URLs to portfolio_assets if available
    IF submission_record.files IS NOT NULL AND jsonb_array_length(submission_record.files) > 0 THEN
      INSERT INTO public.portfolio_assets (
        portfolio_id,
        project_id,
        designer_id,
        file_url,
        file_name,
        file_type,
        mime_type,
        display_order
      )
      SELECT
        portfolio_id_var,
        new_project_id,
        submission_record.designer_id,
        file_entry->>'url',
        file_entry->>'name',
        'image',
        'image/jpeg',
        (row_number() OVER ()) - 1
      FROM jsonb_array_elements(submission_record.files) AS file_entry;
    END IF;

    RAISE NOTICE 'Migrated collection submission % to portfolio project %', submission_record.id, new_project_id;
  END LOOP;
END $$;

-- NOTE: We preserve founding_designers_submissions table as it's a separate system
-- Comment: founding_designers_submissions is NOT affected by this migration

-- Drop RLS policies for collection_submissions
DROP POLICY IF EXISTS "Designers can view own submissions" ON public.collection_submissions;
DROP POLICY IF EXISTS "Designers can insert own submissions" ON public.collection_submissions;
DROP POLICY IF EXISTS "Designers can update own draft submissions" ON public.collection_submissions;
DROP POLICY IF EXISTS "Designers can delete own draft submissions" ON public.collection_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.collection_submissions;
DROP POLICY IF EXISTS "Admins can update all submissions" ON public.collection_submissions;

-- Drop collection_submissions table
-- NOTE: Consider backing up this table before dropping in production
DROP TABLE IF EXISTS public.collection_submissions CASCADE;

-- Drop collection-files storage policies
-- TEMPORARILY DISABLED: Requires elevated permissions
-- DROP POLICY IF EXISTS "Designers can upload collection files" ON storage.objects;
-- DROP POLICY IF EXISTS "Anyone can view collection files" ON storage.objects;
-- DROP POLICY IF EXISTS "Designers can update own collection files" ON storage.objects;
-- DROP POLICY IF EXISTS "Designers can delete own collection files" ON storage.objects;

-- Comment on migration
COMMENT ON COLUMN public.portfolio_projects.migration_source IS 'Tracks data origin for migrated records (e.g., collection_submissions)';

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Collection submissions migration completed successfully';
  RAISE NOTICE 'Migrated submissions are now available in portfolio_projects with source_type=migrated_collection';
  RAISE NOTICE 'Original collection_submissions table has been dropped';
END $$;
