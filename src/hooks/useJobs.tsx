import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

// ============================================================================
// Types
// ============================================================================

export type JobStatus = 'draft' | 'active' | 'paused' | 'closed' | 'expired';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
export type LocationType = 'remote' | 'onsite' | 'hybrid';
export type SalaryType = 'annual' | 'monthly' | 'hourly' | 'project';
export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected' | 'hired';
export type JobCategory = 'fashion' | 'textile' | 'jewelry';

export interface Job {
  id: string;
  title: string;
  company_name: string | null;
  company_logo: string | null;
  description: string | null;
  location: string | null;
  location_type: LocationType | null;
  job_type: JobType | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_type: SalaryType | null;
  category: JobCategory | null;
  requirements: string[];
  benefits: string[];
  tags: string[];
  is_featured: boolean;
  status: JobStatus;
  deadline: string | null;
  contact_email: string | null;
  external_link: string | null;
  application_count: number;
  created_at: string;
  updated_at: string;
  posted_by: string | null;
}

export interface JobApplication {
  id: string;
  job_id: string;
  designer_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  notes: string | null;
  interview_date: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  applied_at: string;
  jobs?: {
    title: string;
    company_name: string | null;
  };
}

export interface SavedJob {
  id: string;
  job_id: string;
  designer_id: string;
  saved_at: string;
}

export interface JobWithDesignerStatus extends Job {
  has_applied: boolean;
  application_status: ApplicationStatus | null;
  is_saved: boolean;
}

export interface JobFilters {
  search?: string;
  category?: JobCategory | 'all';
  jobType?: JobType | 'all';
  locationType?: LocationType | 'all';
  salaryMin?: number;
  salaryMax?: number;
  featuredOnly?: boolean;
  status?: JobStatus | 'all';
}

export interface ApplicationStats {
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
  pending_reviews: number;
  shortlisted_count: number;
  hired_count: number;
  rejected_count: number;
  applications_today: number;
  applications_this_week: number;
  applications_this_month: number;
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch all active jobs with optional filtering
 */
export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: ["jobs", "active", filters],
    queryFn: async (): Promise<Job[]> => {
      let query = supabase
        .from("jobs")
        .select("*")
        .eq("status", "active")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
      if (filters.jobType && filters.jobType !== "all") {
        query = query.eq("job_type", filters.jobType);
      }
      if (filters.locationType && filters.locationType !== "all") {
        query = query.eq("location_type", filters.locationType);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`);
      }
      if (filters.featuredOnly) {
        query = query.eq("is_featured", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Job[];
    },
  });
}

/**
 * Fetch all jobs (for admin) with filtering
 */
export function useAllJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: ["jobs", "all", filters],
    queryFn: async (): Promise<Job[]> => {
      let query = supabaseAdmin
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Job[];
    },
  });
}

/**
 * Fetch jobs with designer's application/saved status
 */
export function useJobsWithDesignerStatus(designerId: string | undefined) {
  return useQuery({
    queryKey: ["jobs", "with-status", designerId],
    queryFn: async (): Promise<JobWithDesignerStatus[]> => {
      if (!designerId) return [];
      
      const { data, error } = await supabase
        .rpc("get_jobs_with_designer_status", { designer_uuid: designerId });
      
      if (error) throw error;
      return data as JobWithDesignerStatus[];
    },
    enabled: !!designerId,
  });
}

/**
 * Fetch a single job by ID
 */
export function useJob(jobId: string | undefined) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: async (): Promise<Job | null> => {
      if (!jobId) return null;
      
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();
      
      if (error) throw error;
      return data as Job;
    },
    enabled: !!jobId,
  });
}

/**
 * Fetch designer's job applications
 */
export function useMyApplications(designerId: string | undefined) {
  return useQuery({
    queryKey: ["my-applications", designerId],
    queryFn: async (): Promise<JobApplication[]> => {
      if (!designerId) return [];
      
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          *,
          jobs(title, company_name, company_logo, location, job_type, salary_min, salary_max, salary_type)
        `)
        .eq("designer_id", designerId)
        .order("applied_at", { ascending: false });
      
      if (error) throw error;
      return data as JobApplication[];
    },
    enabled: !!designerId,
  });
}

/**
 * Fetch designer's saved jobs
 */
export function useSavedJobs(designerId: string | undefined) {
  return useQuery({
    queryKey: ["saved-jobs", designerId],
    queryFn: async (): Promise<string[]> => {
      if (!designerId) return [];
      
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("job_id")
        .eq("designer_id", designerId);
      
      if (error) throw error;
      return data.map((s) => s.job_id);
    },
    enabled: !!designerId,
  });
}

/**
 * Fetch saved jobs with full details
 */
export function useSavedJobsWithDetails(designerId: string | undefined) {
  return useQuery({
    queryKey: ["saved-jobs-details", designerId],
    queryFn: async (): Promise<Job[]> => {
      if (!designerId) return [];
      
      const { data, error } = await supabase
        .from("saved_jobs")
        .select(`
          job_id,
          jobs(*)
        `)
        .eq("designer_id", designerId);
      
      if (error) throw error;
      return data.map((s: any) => s.jobs) as Job[];
    },
    enabled: !!designerId,
  });
}

/**
 * Fetch all applications (for admin)
 */
export function useAllApplications(jobId?: string | null) {
  return useQuery({
    queryKey: ["admin-applications", jobId],
    queryFn: async (): Promise<JobApplication[]> => {
      let query = supabaseAdmin
        .from("job_applications")
        .select(`
          *,
          jobs(title, company_name)
        `)
        .order("applied_at", { ascending: false });

      if (jobId) {
        query = query.eq("job_id", jobId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch profiles for each application
      const designerIds = [...new Set(data.map((a) => a.designer_id))];
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("user_id, name, email, avatar_url, category")
        .in("user_id", designerIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      return data.map((app) => ({
        ...app,
        profiles: profileMap.get(app.designer_id) || {
          name: null,
          email: null,
          avatar_url: null,
          category: null,
        },
      })) as JobApplication[];
    },
  });
}

/**
 * Fetch job application statistics
 */
export function useApplicationStats() {
  return useQuery({
    queryKey: ["job-application-stats"],
    queryFn: async (): Promise<ApplicationStats> => {
      const { data, error } = await supabase.rpc("get_job_application_stats");
      if (error) throw error;
      return data as ApplicationStats;
    },
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Save or unsave a job
 */
export function useToggleSaveJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      jobId,
      designerId,
      isSaved,
    }: {
      jobId: string;
      designerId: string;
      isSaved: boolean;
    }) => {
      if (isSaved) {
        // Unsave
        const { error } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("job_id", jobId)
          .eq("designer_id", designerId);
        if (error) throw error;
        return { action: "unsaved", jobId };
      } else {
        // Save
        const { error } = await supabase.from("saved_jobs").insert({
          job_id: jobId,
          designer_id: designerId,
        });
        if (error) throw error;
        return { action: "saved", jobId };
      }
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "with-status"] });
      
      if (result.action === "saved") {
        sonnerToast.success("Job saved to your list");
      } else {
        sonnerToast.success("Job removed from saved list");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Apply to a job
 */
export function useApplyToJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      jobId,
      designerId,
      coverLetter,
      portfolioUrl,
      resumeUrl,
    }: {
      jobId: string;
      designerId: string;
      coverLetter: string;
      portfolioUrl: string;
      resumeUrl?: string;
    }) => {
      const { error } = await supabase.from("job_applications").insert({
        job_id: jobId,
        designer_id: designerId,
        cover_letter: coverLetter,
        portfolio_url: portfolioUrl,
        resume_url: resumeUrl,
        status: "applied",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "with-status"] });
      queryClient.invalidateQueries({ queryKey: ["job-application-stats"] });
      sonnerToast.success("Application submitted successfully!");
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting application",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Withdraw a job application
 */
export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      applicationId,
      designerId,
    }: {
      applicationId: string;
      designerId: string;
    }) => {
      const { error } = await supabase
        .from("job_applications")
        .delete()
        .eq("id", applicationId)
        .eq("designer_id", designerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "with-status"] });
      queryClient.invalidateQueries({ queryKey: ["job-application-stats"] });
      sonnerToast.success("Application withdrawn");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// ============================================================================
// Admin Mutation Hooks
// ============================================================================

/**
 * Create or update a job (admin only)
 */
export function useSaveJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      job,
      userId,
    }: {
      job: Partial<Job>;
      userId: string;
    }) => {
      if (job.id) {
        // Update
        const { error } = await supabaseAdmin
          .from("jobs")
          .update({
            ...job,
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.id);
        if (error) throw error;
        return { action: "updated", id: job.id };
      } else {
        // Create
        const { data, error } = await supabaseAdmin
          .from("jobs")
          .insert({
            ...job,
            posted_by: userId,
          })
          .select()
          .single();
        if (error) throw error;
        return { action: "created", id: data.id };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job-application-stats"] });
      sonnerToast.success(result.action === "created" ? "Job created" : "Job updated");
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving job",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Delete a job (admin only)
 */
export function useDeleteJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabaseAdmin.from("jobs").delete().eq("id", jobId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job-application-stats"] });
      sonnerToast.success("Job deleted");
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting job",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Update job status (admin only)
 */
export function useUpdateJobStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      status,
    }: {
      jobId: string;
      status: JobStatus;
    }) => {
      const { error } = await supabaseAdmin
        .from("jobs")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", jobId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

/**
 * Toggle job featured status (admin only)
 */
export function useToggleJobFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      isFeatured,
    }: {
      jobId: string;
      isFeatured: boolean;
    }) => {
      const { error } = await supabaseAdmin
        .from("jobs")
        .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
        .eq("id", jobId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

/**
 * Update application status (admin only)
 */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
      notes,
      interviewDate,
      reviewedBy,
    }: {
      applicationId: string;
      status: ApplicationStatus;
      notes?: string;
      interviewDate?: string;
      reviewedBy: string;
    }) => {
      const { error } = await supabaseAdmin
        .from("job_applications")
        .update({
          status,
          notes,
          interview_date: interviewDate,
          reviewed_by: reviewedBy,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", applicationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["job-application-stats"] });
      sonnerToast.success("Application updated");
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating application",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// ============================================================================
// Constants
// ============================================================================

export const JOB_CATEGORIES = [
  { value: "fashion", label: "Fashion Design" },
  { value: "textile", label: "Textile Design" },
  { value: "jewelry", label: "Jewelry Design" },
] as const;

export const JOB_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
] as const;

export const LOCATION_TYPES = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export const SALARY_TYPES = [
  { value: "annual", label: "Annual" },
  { value: "monthly", label: "Monthly" },
  { value: "hourly", label: "Hourly" },
  { value: "project", label: "Per Project" },
] as const;

export const JOB_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "closed", label: "Closed" },
  { value: "expired", label: "Expired" },
] as const;

export const APPLICATION_STATUSES = [
  { value: "applied", label: "Applied", color: "blue" },
  { value: "shortlisted", label: "Shortlisted", color: "yellow" },
  { value: "rejected", label: "Rejected", color: "red" },
  { value: "hired", label: "Hired", color: "green" },
] as const;
