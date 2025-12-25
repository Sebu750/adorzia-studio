import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();
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

  // Fetch applications with profiles
  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ['admin-applications', selectedJobFilter],
    queryFn: async () => {
      let query = supabase.from('job_applications').select(`*, jobs(title, company_name), profiles!job_applications_designer_id_fkey(name, email, avatar_url, category)`).order('applied_at', { ascending: false });
      if (selectedJobFilter) query = query.eq('job_id', selectedJobFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data;
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
    mutationFn: async ({ id, status, notes, interviewDate }: { id: string; status: string; notes?: string; interviewDate?: string }) => {
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Job Portal Management</h1>
            <p className="text-muted-foreground">Manage job listings and review applications</p>
          </div>
          <Button onClick={() => { setEditingJob(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />New Job
          </Button>
        </div>

        <JobStatsCards stats={stats} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="jobs" className="gap-2"><Briefcase className="h-4 w-4" />Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="applications" className="gap-2"><Users className="h-4 w-4" />Applications ({applications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-6">
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

          <TabsContent value="applications" className="mt-6">
            <ApplicationsTable
              applications={applications}
              isLoading={appsLoading}
              jobs={jobs.map(j => ({ id: j.id, title: j.title }))}
              selectedJobId={selectedJobFilter}
              onJobFilter={setSelectedJobFilter}
              onUpdateStatus={async (id, status, notes, interviewDate) => {
                await updateAppMutation.mutateAsync({ id, status, notes, interviewDate });
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
