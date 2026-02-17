import { useState, useMemo, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { Briefcase, FileText, Bookmark, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useJobs,
  useMyApplications,
  useSavedJobsWithDetails,
  useToggleSaveJob,
  useApplyToJob,
  Job,
  JobFilters as JobFiltersType,
} from "@/hooks/useJobs";

const defaultFilters: JobFiltersType = {
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
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [newJobsCount, setNewJobsCount] = useState(0);

  // Fetch jobs using the custom hook
  const { data: jobs = [], isLoading: jobsLoading } = useJobs(filters);

  // Fetch user's applications
  const { data: applications = [] } = useMyApplications(user?.id);

  // Fetch saved jobs with details
  const { data: savedJobsList = [] } = useSavedJobsWithDetails(user?.id);

  // Mutations
  const saveMutation = useToggleSaveJob();
  const applyMutation = useApplyToJob();

  // Get saved job IDs for quick lookup
  const savedJobIds = useMemo(() => 
    savedJobsList.map(job => job.id),
    [savedJobsList]
  );

  // ============================================================================
  // REAL-TIME SUBSCRIPTIONS
  // ============================================================================
  
  useEffect(() => {
    if (!user) return;

    // Create a realtime channel for job portal updates
    const channel = supabase
      .channel('job-portal-realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'jobs',
          filter: 'status=eq.active'
        },
        (payload) => {
          console.log('[Realtime] Job change:', payload);
          
          if (payload.eventType === 'INSERT') {
            // New job posted - show notification and increment counter
            setNewJobsCount(prev => prev + 1);
            toast.success(`New job posted: ${payload.new.title}`, {
              description: `at ${payload.new.company_name || 'Unknown Company'}`,
              action: {
                label: 'View',
                onClick: () => {
                  setSelectedJob(payload.new as Job);
                  setDetailOpen(true);
                },
              },
            });
          } else if (payload.eventType === 'UPDATE') {
            // Job updated
            if (payload.new.status !== 'active') {
              toast.info(`Job "${payload.new.title}" is no longer active`);
            }
          } else if (payload.eventType === 'DELETE') {
            // Job deleted
            toast.info('A job has been removed');
          }
          
          // Invalidate jobs query to refresh data
          queryClient.invalidateQueries({ queryKey: ['jobs'] });
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'job_applications',
          filter: `designer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('[Realtime] Application change:', payload);
          
          if (payload.eventType === 'INSERT') {
            // New application (shouldn't happen via realtime for same user, but just in case)
            queryClient.invalidateQueries({ queryKey: ['my-applications'] });
          } else if (payload.eventType === 'UPDATE') {
            // Application status updated by admin
            const oldStatus = payload.old?.status;
            const newStatus = payload.new?.status;
            
            if (oldStatus !== newStatus) {
              // Fetch job details for the notification
              supabase
                .from('jobs')
                .select('title')
                .eq('id', payload.new.job_id)
                .single()
                .then(({ data }) => {
                  const jobTitle = data?.title || 'a job';
                  
                  if (newStatus === 'shortlisted') {
                    toast.success(`You've been shortlisted for "${jobTitle}"!`, {
                      description: 'Check your applications for details.',
                    });
                  } else if (newStatus === 'hired') {
                    toast.success(`Congratulations! You've been hired for "${jobTitle}"!`, {
                      description: 'The employer will contact you soon.',
                    });
                  } else if (newStatus === 'rejected') {
                    toast.info(`Update on your application for "${jobTitle}"`, {
                      description: 'Unfortunately, you were not selected this time.',
                    });
                  }
                });
              
              queryClient.invalidateQueries({ queryKey: ['my-applications'] });
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'saved_jobs',
          filter: `designer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('[Realtime] Saved job change:', payload);
          queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Subscription status:', status);
        setIsRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Filter jobs (client-side filtering for additional criteria)
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

  const appliedJobIds = useMemo(() => 
    applications.map(a => a.job_id),
    [applications]
  );

  // Handle refresh to clear new jobs counter
  const handleRefresh = useCallback(() => {
    setNewJobsCount(0);
    queryClient.invalidateQueries({ queryKey: ['jobs'] });
  }, [queryClient]);

  return (
    <AppLayout>
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Job Portal</h1>
              {/* Real-time connection indicator */}
              <Badge 
                variant="outline" 
                className={`gap-1.5 text-xs ${isRealtimeConnected ? 'text-green-600 border-green-200 bg-green-50' : 'text-gray-500'}`}
              >
                {isRealtimeConnected ? (
                  <><Wifi className="h-3 w-3" /> Live</>
                ) : (
                  <><WifiOff className="h-3 w-3" /> Offline</>
                )}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Find your next design opportunity</p>
          </div>
          {newJobsCount > 0 && (
            <Badge 
              className="cursor-pointer hover:bg-primary/90"
              onClick={handleRefresh}
            >
              {newJobsCount} new job{newJobsCount > 1 ? 's' : ''} posted
            </Badge>
          )}
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse" className="gap-2"><Briefcase className="h-4 w-4" />Browse Jobs</TabsTrigger>
            <TabsTrigger value="applications" className="gap-2"><FileText className="h-4 w-4" />My Applications ({applications.length})</TabsTrigger>
            <TabsTrigger value="saved" className="gap-2"><Bookmark className="h-4 w-4" />Saved ({savedJobsList.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <JobFilters filters={filters} onFiltersChange={setFilters} onReset={() => setFilters(defaultFilters)} />
              </div>
              <div className="lg:col-span-3">
                {jobsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-lg" />)}
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <p className="text-lg">No jobs found matching your criteria</p>
                    <p className="text-sm mt-2">
                      Try adjusting your filters or check back later for new opportunities
                    </p>
                    {isRealtimeConnected && (
                      <p className="text-sm mt-4 text-green-600">
                        <Wifi className="h-3 w-3 inline mr-1" />
                        Listening for new job postings...
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.map(job => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isSaved={savedJobIds.includes(job.id)}
                        hasApplied={appliedJobIds.includes(job.id)}
                        onView={(j) => { setSelectedJob(j); setDetailOpen(true); }}
                        onSave={(id) => {
                          if (user) {
                            saveMutation.mutate({ 
                              jobId: id, 
                              designerId: user.id, 
                              isSaved: savedJobIds.includes(id) 
                            });
                          }
                        }}
                        onApply={(j) => { setSelectedJob(j); setApplyOpen(true); }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div className="max-w-4xl mx-auto">
              {applications.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg">You haven't applied to any jobs yet</p>
                  <p className="text-sm mt-2">When you apply to jobs, they'll appear here for easy tracking</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map(app => <ApplicationCard key={app.id} application={app} />)}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="max-w-4xl mx-auto">
              {savedJobsList.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg">No saved jobs</p>
                  <p className="text-sm mt-2">Jobs you save will appear here for later review</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedJobsList.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={true}
                      hasApplied={appliedJobIds.includes(job.id)}
                      onView={(j) => { setSelectedJob(j); setDetailOpen(true); }}
                      onSave={(id) => {
                        if (user) {
                          saveMutation.mutate({ 
                            jobId: id, 
                            designerId: user.id, 
                            isSaved: true 
                          });
                        }
                      }}
                      onApply={(j) => { setSelectedJob(j); setApplyOpen(true); }}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <JobDetailModal
          job={selectedJob}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          isSaved={selectedJob ? savedJobIds.includes(selectedJob.id) : false}
          hasApplied={selectedJob ? appliedJobIds.includes(selectedJob.id) : false}
          onSave={(id) => {
            if (user) {
              saveMutation.mutate({ 
                jobId: id, 
                designerId: user.id, 
                isSaved: savedJobIds.includes(id) 
              });
            }
          }}
          onApply={(j) => { setDetailOpen(false); setApplyOpen(true); }}
        />

        <JobApplicationForm
          job={selectedJob}
          open={applyOpen}
          onOpenChange={setApplyOpen}
          isSubmitting={applyMutation.isPending}
          onSubmit={async (data) => {
            if (selectedJob && user) {
              await applyMutation.mutateAsync({ 
                jobId: selectedJob.id, 
                designerId: user.id,
                coverLetter: data.cover_letter, 
                portfolioUrl: data.portfolio_url 
              });
            }
          }}
        />
      </div>
    </AppLayout>
  );
}
