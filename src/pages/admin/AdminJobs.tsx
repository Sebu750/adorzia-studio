import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { JobStatsCards } from "@/components/admin/jobs/JobStatsCards";
import { JobForm } from "@/components/admin/jobs/JobForm";
import { JobsTable } from "@/components/admin/jobs/JobsTable";
import { ApplicationsTable } from "@/components/admin/jobs/ApplicationsTable";
import { toast } from "sonner";
import { Plus, Briefcase, Users } from "lucide-react";

export default function AdminJobs() {
  const { user } = useAdminAuth();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [selectedJobFilter, setSelectedJobFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("jobs");

  // Fetch jobs
  const { data: jobs = [] } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch applications - fetch profiles separately since no direct FK
  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ['admin-applications', selectedJobFilter],
    queryFn: async () => {
      let query = supabase.from('job_applications').select(`*, jobs(title, company_name)`).order('applied_at', { ascending: false });
      if (selectedJobFilter) query = query.eq('job_id', selectedJobFilter);
      const { data, error } = await query;
      if (error) throw error;
      
      // Fetch profiles for each application
      const designerIds = [...new Set(data.map(a => a.designer_id))];
      const { data: profiles } = await supabase.from('profiles').select('user_id, name, email, avatar_url, category').in('user_id', designerIds);
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return data.map(app => ({
        ...app,
        profiles: profileMap.get(app.designer_id) || { name: null, email: null, avatar_url: null, category: null }
      }));
    },
  });

  // Stats
  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
    totalApplications: applications.length,
    pendingReviews: applications.filter(a => a.status === 'applied').length,
    hireRate: applications.length > 0 ? Math.round((applications.filter(a => a.status === 'hired').length / applications.length) * 100) : 0,
  };

  // Create/Update job
  const jobMutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.id) {
        const { error } = await supabase.from('jobs').update(data).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('jobs').insert({ ...data, posted_by: user?.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      toast.success(editingJob ? 'Job updated' : 'Job created');
      setFormOpen(false);
      setEditingJob(null);
    },
    onError: () => toast.error('Failed to save job'),
  });

  // Delete job
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      toast.success('Job deleted');
    },
  });

  // Update job status/featured
  const updateJobMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from('jobs').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-jobs'] }),
  });

  // Update application
  const updateAppMutation = useMutation({
    mutationFn: async ({ id, status, notes, interviewDate }: { id: string; status: 'applied' | 'shortlisted' | 'rejected' | 'hired'; notes?: string; interviewDate?: string }) => {
      const { error } = await supabase.from('job_applications').update({ 
        status, 
        notes, 
        interview_date: interviewDate,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString()
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      toast.success('Application updated');
    },
  });

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-admin-foreground">Job Portal Management</h1>
            <p className="text-sm text-admin-muted-foreground mt-1">Manage job listings and review applications</p>
          </div>
          <Button 
            onClick={() => { setEditingJob(null); setFormOpen(true); }}
            className="gap-2 h-10 px-4 bg-admin-foreground text-admin-background hover:bg-admin-foreground/90 transition-all active:scale-[0.98] shadow-md"
          >
            <Plus className="h-4 w-4" />New Job Listing
          </Button>
        </div>

        <JobStatsCards stats={stats} />

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
              onDuplicate={(job) => { setEditingJob({ ...job, id: undefined, title: `${job.title} (Copy)`, status: 'draft' }); setFormOpen(true); }}
              onDelete={(id) => deleteMutation.mutate(id)}
              onToggleStatus={(id, status) => updateJobMutation.mutate({ id, updates: { status } })}
              onToggleFeatured={(id, featured) => updateJobMutation.mutate({ id, updates: { is_featured: featured } })}
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
                await updateAppMutation.mutateAsync({ id, status: status as 'applied' | 'shortlisted' | 'rejected' | 'hired', notes, interviewDate });
              }}
            />
          </TabsContent>
        </Tabs>

        <JobForm
          job={editingJob}
          open={formOpen}
          onOpenChange={setFormOpen}
          isSubmitting={jobMutation.isPending}
          onSubmit={async (data) => await jobMutation.mutateAsync(editingJob?.id ? { ...data, id: editingJob.id } : data)}
        />
      </div>
    </AdminLayout>
  );
}
