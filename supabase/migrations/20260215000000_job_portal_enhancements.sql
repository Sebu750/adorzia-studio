-- Job Portal Real-Time Integration Enhancements
-- Migration Date: 2026-02-15
-- Purpose: Add indexes and realtime configuration for job portal

-- ============================================================================
-- PART 1: Verify and Add Missing Columns to jobs table
-- ============================================================================

-- Ensure all required columns exist on jobs table
DO $$
BEGIN
    -- Company information
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'company_name') THEN
        ALTER TABLE public.jobs ADD COLUMN company_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'company_logo') THEN
        ALTER TABLE public.jobs ADD COLUMN company_logo TEXT;
    END IF;
    
    -- Location information
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'location') THEN
        ALTER TABLE public.jobs ADD COLUMN location TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'location_type') THEN
        ALTER TABLE public.jobs ADD COLUMN location_type public.location_type DEFAULT 'remote';
    END IF;
    
    -- Job type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'job_type') THEN
        ALTER TABLE public.jobs ADD COLUMN job_type public.job_type DEFAULT 'full_time';
    END IF;
    
    -- Salary information
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_min') THEN
        ALTER TABLE public.jobs ADD COLUMN salary_min INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_max') THEN
        ALTER TABLE public.jobs ADD COLUMN salary_max INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_type') THEN
        ALTER TABLE public.jobs ADD COLUMN salary_type public.salary_type DEFAULT 'annual';
    END IF;
    
    -- Arrays for requirements, benefits, tags
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'requirements') THEN
        ALTER TABLE public.jobs ADD COLUMN requirements JSONB DEFAULT '[]'::JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'benefits') THEN
        ALTER TABLE public.jobs ADD COLUMN benefits JSONB DEFAULT '[]'::JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'tags') THEN
        ALTER TABLE public.jobs ADD COLUMN tags JSONB DEFAULT '[]'::JSONB;
    END IF;
    
    -- Status and featured
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'status') THEN
        ALTER TABLE public.jobs ADD COLUMN status public.job_status DEFAULT 'draft';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'is_featured') THEN
        ALTER TABLE public.jobs ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Deadline and contact
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'deadline') THEN
        ALTER TABLE public.jobs ADD COLUMN deadline TIMESTAMPTZ;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'contact_email') THEN
        ALTER TABLE public.jobs ADD COLUMN contact_email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'external_link') THEN
        ALTER TABLE public.jobs ADD COLUMN external_link TEXT;
    END IF;
    
    -- Application count
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'application_count') THEN
        ALTER TABLE public.jobs ADD COLUMN application_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- ============================================================================
-- PART 2: Verify and Add Missing Columns to job_applications table
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_applications' AND column_name = 'cover_letter') THEN
        ALTER TABLE public.job_applications ADD COLUMN cover_letter TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_applications' AND column_name = 'portfolio_url') THEN
        ALTER TABLE public.job_applications ADD COLUMN portfolio_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_applications' AND column_name = 'resume_url') THEN
        ALTER TABLE public.job_applications ADD COLUMN resume_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_applications' AND column_name = 'notes') THEN
        ALTER TABLE public.job_applications ADD COLUMN notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_applications' AND column_name = 'interview_date') THEN
        ALTER TABLE public.job_applications ADD COLUMN interview_date TIMESTAMPTZ;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_applications' AND column_name = 'reviewed_by') THEN
        ALTER TABLE public.job_applications ADD COLUMN reviewed_by UUID REFERENCES auth.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_applications' AND column_name = 'reviewed_at') THEN
        ALTER TABLE public.job_applications ADD COLUMN reviewed_at TIMESTAMPTZ;
    END IF;
END $$;

-- ============================================================================
-- PART 3: Enable Realtime for job_applications table
-- ============================================================================

-- Add job_applications to realtime publication
DO $$
BEGIN
    -- Check if job_applications is already in the publication
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'job_applications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE job_applications;
    END IF;
END $$;

-- Set REPLICA IDENTITY FULL for complete row data on updates
ALTER TABLE job_applications REPLICA IDENTITY FULL;

-- Ensure jobs table also has REPLICA IDENTITY FULL
ALTER TABLE jobs REPLICA IDENTITY FULL;

-- ============================================================================
-- PART 4: Add Performance Indexes
-- ============================================================================

-- Indexes for jobs table
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON public.jobs(is_featured);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON public.jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_status_featured ON public.jobs(status, is_featured);

-- Indexes for job_applications table
CREATE INDEX IF NOT EXISTS idx_job_applications_designer ON public.job_applications(designer_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_at ON public.job_applications(applied_at DESC);

-- Indexes for saved_jobs table
CREATE INDEX IF NOT EXISTS idx_saved_jobs_designer ON public.saved_jobs(designer_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job ON public.saved_jobs(job_id);

-- ============================================================================
-- PART 5: Create/Update Trigger Functions for Application Count
-- ============================================================================

-- Function to update job application count
CREATE OR REPLACE FUNCTION public.update_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.jobs SET application_count = application_count + 1 WHERE id = NEW.job_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.jobs SET application_count = GREATEST(application_count - 1, 0) WHERE id = OLD.job_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trigger_update_job_application_count ON public.job_applications;

-- Create trigger
CREATE TRIGGER trigger_update_job_application_count
AFTER INSERT OR DELETE ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION public.update_job_application_count();

-- ============================================================================
-- PART 6: Create Helper Functions for Real-Time Job Portal
-- ============================================================================

-- Function to get jobs with application status for a designer
CREATE OR REPLACE FUNCTION public.get_jobs_with_designer_status(designer_uuid UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    company_name TEXT,
    company_logo TEXT,
    description TEXT,
    location TEXT,
    location_type TEXT,
    job_type TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_type TEXT,
    category TEXT,
    requirements JSONB,
    benefits JSONB,
    tags JSONB,
    is_featured BOOLEAN,
    status TEXT,
    deadline TIMESTAMPTZ,
    contact_email TEXT,
    external_link TEXT,
    application_count INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    has_applied BOOLEAN,
    application_status TEXT,
    is_saved BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id,
        j.title,
        j.company_name,
        j.company_logo,
        j.description,
        j.location,
        j.location_type::TEXT,
        j.job_type::TEXT,
        j.salary_min,
        j.salary_max,
        j.salary_type::TEXT,
        j.category::TEXT,
        j.requirements,
        j.benefits,
        j.tags,
        j.is_featured,
        j.status::TEXT,
        j.deadline,
        j.contact_email,
        j.external_link,
        j.application_count,
        j.created_at,
        j.updated_at,
        EXISTS (
            SELECT 1 FROM public.job_applications ja 
            WHERE ja.job_id = j.id AND ja.designer_id = designer_uuid
        ) AS has_applied,
        (
            SELECT ja.status::TEXT FROM public.job_applications ja 
            WHERE ja.job_id = j.id AND ja.designer_id = designer_uuid
            LIMIT 1
        ) AS application_status,
        EXISTS (
            SELECT 1 FROM public.saved_jobs sj 
            WHERE sj.job_id = j.id AND sj.designer_id = designer_uuid
        ) AS is_saved
    FROM public.jobs j
    WHERE j.status = 'active'
    ORDER BY j.is_featured DESC, j.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Function to get application statistics for admin dashboard
CREATE OR REPLACE FUNCTION public.get_job_application_stats()
RETURNS TABLE (
    total_jobs BIGINT,
    active_jobs BIGINT,
    total_applications BIGINT,
    pending_reviews BIGINT,
    shortlisted_count BIGINT,
    hired_count BIGINT,
    rejected_count BIGINT,
    applications_today BIGINT,
    applications_this_week BIGINT,
    applications_this_month BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.jobs) AS total_jobs,
        (SELECT COUNT(*) FROM public.jobs WHERE status = 'active') AS active_jobs,
        (SELECT COUNT(*) FROM public.job_applications) AS total_applications,
        (SELECT COUNT(*) FROM public.job_applications WHERE status = 'applied') AS pending_reviews,
        (SELECT COUNT(*) FROM public.job_applications WHERE status = 'shortlisted') AS shortlisted_count,
        (SELECT COUNT(*) FROM public.job_applications WHERE status = 'hired') AS hired_count,
        (SELECT COUNT(*) FROM public.job_applications WHERE status = 'rejected') AS rejected_count,
        (SELECT COUNT(*) FROM public.job_applications WHERE applied_at >= CURRENT_DATE) AS applications_today,
        (SELECT COUNT(*) FROM public.job_applications WHERE applied_at >= CURRENT_DATE - INTERVAL '7 days') AS applications_this_week,
        (SELECT COUNT(*) FROM public.job_applications WHERE applied_at >= CURRENT_DATE - INTERVAL '30 days') AS applications_this_month;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- PART 7: Grant Execute Permissions
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.get_jobs_with_designer_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_job_application_stats() TO authenticated;

-- ============================================================================
-- Migration Complete
-- ============================================================================
