import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobStatsCards } from "@/components/admin/jobs/JobStatsCards";
import { JobForm } from "@/components/admin/jobs/JobForm";
import { JobsTable } from "@/components/admin/jobs/JobsTable";
import { ApplicationsTable } from "@/components/admin/jobs/ApplicationsTable";
import { JobActivityFeed } from "@/components/admin/jobs/JobActivityFeed";
import { toast } from "sonner";
import { Plus, Briefcase, Users, Wifi, WifiOff, Bell } from "lucide-react";
import {
  useAllJobs,
  useAllApplications,
  useApplicationStats,
  useSaveJob,
  useDeleteJob,
  useUpdateJobStatus,
  useToggleJobFeatured,
  useUpdateApplicationStatus,
  Job,
} from "@/hooks/useJobs";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";

export default function AdminJobs() {
  const { user } = useAdminAuth();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJobFilter, setSelectedJobFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("jobs");
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);

  // Fetch jobs using custom hook
  const { data: jobs = [] } = useAllJobs();

  // Fetch applications using custom hook
  const { data: applications = [], isLoading: appsLoading } = useAllApplications(selectedJobFilter);

  // Fetch stats using custom hook
  const { data: statsData } = useApplicationStats();

  // Stats
  const stats = {
    totalJobs: statsData?.total_jobs ?? jobs.length,
    activeJobs: statsData?.active_jobs ?? jobs.filter(j => j.status === 'active').length,
    totalApplications: statsData?.total_applications ?? applications.length,
    pendingReviews: statsData?.pending_reviews ?? applications.filter(a => a.status === 'applied').length,
    hireRate: statsData?.total_applications ? Math.round((statsData.hired_count / statsData.total_applications) * 100) : 0,
  };

  // Mutations
  const jobMutation = useSaveJob();
  const deleteMutation = useDeleteJob();
  const updateJobStatusMutation = useUpdateJobStatus();
  const toggleFeaturedMutation = useToggleJobFeatured();
  const updateAppMutation = useUpdateApplicationStatus();

  // ============================================================================
  // REAL-TIME SUBSCRIPTIONS
  // ============================================================================
  
  useEffect(() => {
    if (!user) return;

    // Create a realtime channel for admin job portal updates
    const channel = supabaseAdmin
      .channel('admin-jobs-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        (payload) => {
          console.log('[Admin Realtime] Job change:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast.success('New job created', {
              description: `"${payload.new.title}" has been added`,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Job updated', {
              description: `"${payload.new.title}" has been modified`,
            });
          } else if (payload.eventType === 'DELETE') {
            toast.info('Job deleted');
          }
          
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['jobs'] });
          queryClient.invalidateQueries({ queryKey: ['job-application-stats'] });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'job_applications' },
        (payload) => {
          console.log('[Admin Realtime] New application:', payload);
          
          // Increment new applications counter
          setNewApplicationsCount(prev => prev + 1);
          
          // Fetch job details for the notification
          supabaseAdmin
            .from('jobs')
            .select('title')
            .eq('id', payload.new.job_id)
            .single()
            .then(({ data }) => {
              toast.success('New application received!', {
                description: `Someone applied for "${data?.title || 'a job'}"`,
                action: {
                  label: 'View',
                  onClick: () => {
                    setSelectedJobFilter(payload.new.job_id);
                    setActiveTab('applications');
                  },
                },
              });
            });
          
          // Invalidate queries
          queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
          queryClient.invalidateQueries({ queryKey: ['job-application-stats'] });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'job_applications' },
        (payload) => {
          console.log('[Admin Realtime] Application updated:', payload);
          
          if (payload.old?.status !== payload.new?.status) {
            queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
            queryClient.invalidateQueries({ queryKey: ['job-application-stats'] });
          }
        }
      )
      .subscribe((status) => {
        console.log('[Admin Realtime] Subscription status:', status);
        setIsRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabaseAdmin.removeChannel(channel);
    };
  }, [user, queryClient]);

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-admin-foreground">Job Portal Management</h1>
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
            <p className="text-sm text-admin-muted-foreground mt-1">Manage job listings and review applications</p>
          </div>
          <div className="flex items-center gap-3">
            {newApplicationsCount > 0 && (
              <Badge 
                variant="secondary"
                className="gap-1.5 cursor-pointer hover:bg-secondary/80"
                onClick={() => {
                  setNewApplicationsCount(0);
                  setActiveTab('applications');
                }}
              >
                <Bell className="h-3 w-3" />
                {newApplicationsCount} new application{newApplicationsCount > 1 ? 's' : ''}
              </Badge>
            )}
            <Button 
              onClick={() => { setEditingJob(null); setFormOpen(true); }}
              className="gap-2 h-10 px-4 bg-admin-foreground text-admin-background hover:bg-admin-foreground/90 transition-all active:scale-[0.98] shadow-md"
            >
              <Plus className="h-4 w-4" />New Job Listing
            </Button>
          </div>
        </div>

        <JobStatsCards stats={stats} />

        {/* Activity Feed */}
        <JobActivityFeed applications={applications.slice(0, 5)} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="sticky top-0 z-10 bg-admin-background/80 backdrop-blur-sm py-2 -mx-2 px-2">
            <TabsList className="h-auto gap-2 bg-transparent p-0">
              <TabsTrigger 
                value="jobs" 
                className="gap-2 data-[state=active]:bg-admin-foreground data-[state=active]:text-admin-background rounded-lg transition-all"
              >
                <Briefcase className="h-4 w-4" />
                Jobs
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-admin-muted/30">({jobs.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="applications" 
                className="gap-2 data-[state=active]:bg-admin-foreground data-[state=active]:text-admin-background rounded-lg transition-all"
              >
                <Users className="h-4 w-4" />
                Applications
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-admin-muted/30">({applications.length})</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jobs" className="space-y-4">
            <JobsTable
              jobs={jobs}
              onEdit={(job) => { setEditingJob(job); setFormOpen(true); }}
              onDuplicate={(job) => { 
                const { id, ...jobWithoutId } = job;
                setEditingJob({ ...jobWithoutId, title: `${job.title} (Copy)`, status: 'draft' } as Job); 
                setFormOpen(true); 
              }}
              onDelete={(id) => deleteMutation.mutate(id)}
              onToggleStatus={(id, status) => updateJobStatusMutation.mutate({ jobId: id, status })}
              onToggleFeatured={(id, featured) => toggleFeaturedMutation.mutate({ jobId: id, isFeatured: featured })}
              onViewApplications={(id) => { setSelectedJobFilter(id); setActiveTab('applications'); }}
            />
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <ApplicationsTable
              applications={applications}
              isLoading={appsLoading}
              jobs={jobs.map(j => ({ id: j.id, title: j.title }))}
              selectedJobId={selectedJobFilter}
              onJobFilter={setSelectedJobFilter}
              onUpdateStatus={async (id, status, notes, interviewDate) => {
                if (user) {
                  await updateAppMutation.mutateAsync({ 
                    applicationId: id, 
                    status: status as 'applied' | 'shortlisted' | 'rejected' | 'hired', 
                    notes, 
                    interviewDate,
                    reviewedBy: user.id
                  });
                }
              }}
            />
          </TabsContent>
        </Tabs>

        <JobForm
          job={editingJob}
          open={formOpen}
          onOpenChange={setFormOpen}
          isSubmitting={jobMutation.isPending}
          onSubmit={async (data) => {
            if (user) {
              try {
                await jobMutation.mutateAsync({ 
                  job: editingJob?.id ? { ...data, id: editingJob.id } : data, 
                  userId: user.id 
                });
                // Close form and reset editing job on success
                setFormOpen(false);
                setEditingJob(null);
              } catch (error) {
                // Error is handled by the mutation's onError
                console.error('Job submission failed:', error);
              }
            }
          }}
        />
      </div>
    </AdminLayout>
  );
}
