import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { JobApplicationForm } from "@/components/jobs/JobApplicationForm";
import { JobFilters } from "@/components/jobs/JobFilters";
import { ApplicationCard } from "@/components/jobs/ApplicationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Briefcase, FileText, Bookmark } from "lucide-react";

const defaultFilters = {
  search: '',
  category: 'all',
  jobType: 'all',
  locationType: 'all',
  salaryMin: 0,
  salaryMax: 500000,
  featuredOnly: false,
};

export default function Jobs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  // Fetch jobs
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch user's applications
  const { data: applications = [] } = useQuery({
    queryKey: ['my-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('job_applications')
        .select('*, jobs(title, company_name, company_logo, location, job_type)')
        .eq('designer_id', user.id)
        .order('applied_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch saved jobs
  const { data: savedJobs = [] } = useQuery({
    queryKey: ['saved-jobs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('designer_id', user.id);
      if (error) throw error;
      return data.map(s => s.job_id);
    },
    enabled: !!user,
  });

  // Save/unsave job mutation
  const saveMutation = useMutation({
    mutationFn: async (jobId: string) => {
      if (!user) throw new Error('Must be logged in');
      const isSaved = savedJobs.includes(jobId);
      if (isSaved) {
        await supabase.from('saved_jobs').delete().eq('job_id', jobId).eq('designer_id', user.id);
      } else {
        await supabase.from('saved_jobs').insert({ job_id: jobId, designer_id: user.id });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-jobs'] }),
  });

  // Apply mutation
  const applyMutation = useMutation({
    mutationFn: async ({ jobId, coverLetter, portfolioUrl }: { jobId: string; coverLetter: string; portfolioUrl: string }) => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase.from('job_applications').insert({
        job_id: jobId,
        designer_id: user.id,
        cover_letter: coverLetter,
        portfolio_url: portfolioUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      toast.success('Application submitted successfully!');
      setApplyOpen(false);
    },
    onError: () => toast.error('Failed to submit application'),
  });

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !job.company_name?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category !== 'all' && job.category !== filters.category) return false;
      if (filters.jobType !== 'all' && job.job_type !== filters.jobType) return false;
      if (filters.locationType !== 'all' && job.location_type !== filters.locationType) return false;
      if (filters.featuredOnly && !job.is_featured) return false;
      return true;
    });
  }, [jobs, filters]);

  const appliedJobIds = applications.map(a => a.job_id);
  const savedJobsList = jobs.filter(j => savedJobs.includes(j.id));

  return (
    <AppLayout>
      <div className="container max-w-7xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Job Portal</h1>
          <p className="text-muted-foreground mt-1">Find your next design opportunity</p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse" className="gap-2"><Briefcase className="h-4 w-4" />Browse Jobs</TabsTrigger>
            <TabsTrigger value="applications" className="gap-2"><FileText className="h-4 w-4" />My Applications ({applications.length})</TabsTrigger>
            <TabsTrigger value="saved" className="gap-2"><Bookmark className="h-4 w-4" />Saved ({savedJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <JobFilters filters={filters} onFiltersChange={setFilters} onReset={() => setFilters(defaultFilters)} />
              </div>
              <div className="lg:col-span-3 space-y-4">
                {jobsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">No jobs found matching your criteria</div>
                ) : (
                  filteredJobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobs.includes(job.id)}
                      hasApplied={appliedJobIds.includes(job.id)}
                      onView={(j) => { setSelectedJob(j); setDetailOpen(true); }}
                      onSave={(id) => saveMutation.mutate(id)}
                      onApply={(j) => { setSelectedJob(j); setApplyOpen(true); }}
                    />
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div className="space-y-4 max-w-2xl">
              {applications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">You haven't applied to any jobs yet</div>
              ) : (
                applications.map(app => <ApplicationCard key={app.id} application={app} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobsList.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-muted-foreground">No saved jobs</div>
              ) : (
                savedJobsList.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={true}
                    hasApplied={appliedJobIds.includes(job.id)}
                    onView={(j) => { setSelectedJob(j); setDetailOpen(true); }}
                    onSave={(id) => saveMutation.mutate(id)}
                    onApply={(j) => { setSelectedJob(j); setApplyOpen(true); }}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <JobDetailModal
          job={selectedJob}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          isSaved={selectedJob ? savedJobs.includes(selectedJob.id) : false}
          hasApplied={selectedJob ? appliedJobIds.includes(selectedJob.id) : false}
          onSave={(id) => saveMutation.mutate(id)}
          onApply={(j) => { setDetailOpen(false); setApplyOpen(true); }}
        />

        <JobApplicationForm
          job={selectedJob}
          open={applyOpen}
          onOpenChange={setApplyOpen}
          isSubmitting={applyMutation.isPending}
          onSubmit={async (data) => {
            if (selectedJob) {
              await applyMutation.mutateAsync({ jobId: selectedJob.id, coverLetter: data.cover_letter, portfolioUrl: data.portfolio_url });
            }
          }}
        />
      </div>
    </AppLayout>
  );
}
