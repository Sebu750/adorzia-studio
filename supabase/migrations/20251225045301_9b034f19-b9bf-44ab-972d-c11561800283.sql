-- Create job status enum
CREATE TYPE public.job_status AS ENUM ('draft', 'active', 'paused', 'closed', 'expired');

-- Create job type enum
CREATE TYPE public.job_type AS ENUM ('full_time', 'part_time', 'contract', 'freelance', 'internship');

-- Create location type enum
CREATE TYPE public.location_type AS ENUM ('onsite', 'remote', 'hybrid');

-- Create salary type enum
CREATE TYPE public.salary_type AS ENUM ('annual', 'monthly', 'hourly', 'project');

-- Add new columns to jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS company_logo text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS location_type public.location_type DEFAULT 'remote',
ADD COLUMN IF NOT EXISTS job_type public.job_type DEFAULT 'full_time',
ADD COLUMN IF NOT EXISTS salary_min integer,
ADD COLUMN IF NOT EXISTS salary_max integer,
ADD COLUMN IF NOT EXISTS salary_type public.salary_type DEFAULT 'annual',
ADD COLUMN IF NOT EXISTS requirements jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS benefits jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS status public.job_status DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS deadline timestamp with time zone,
ADD COLUMN IF NOT EXISTS external_link text,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS application_count integer DEFAULT 0;

-- Add new columns to job_applications table
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS cover_letter text,
ADD COLUMN IF NOT EXISTS portfolio_url text,
ADD COLUMN IF NOT EXISTS resume_url text,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS interview_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS reviewed_by uuid,
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone;

-- Create saved_jobs table
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  designer_id uuid NOT NULL,
  saved_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(job_id, designer_id)
);

-- Enable RLS on saved_jobs
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_jobs
CREATE POLICY "Designers can manage own saved jobs"
ON public.saved_jobs
FOR ALL
USING (designer_id = auth.uid());

-- Create function to update application count
CREATE OR REPLACE FUNCTION public.update_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.jobs SET application_count = application_count + 1 WHERE id = NEW.job_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.jobs SET application_count = application_count - 1 WHERE id = OLD.job_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for application count
DROP TRIGGER IF EXISTS update_application_count ON public.job_applications;
CREATE TRIGGER update_application_count
AFTER INSERT OR DELETE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_job_application_count();

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON public.jobs(is_featured);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_designer ON public.saved_jobs(designer_id);