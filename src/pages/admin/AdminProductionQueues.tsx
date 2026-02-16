import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
<<<<<<< HEAD
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
=======
import { supabase } from "@/integrations/supabase/client";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { AdminLayout } from "@/components/admin/AdminLayout";
import { QueueStatsHeader } from "@/components/admin/QueueStatsHeader";
import { ProductionQueueCard } from "@/components/admin/ProductionQueueCard";
import { QueueItemDetailModal } from "@/components/admin/QueueItemDetailModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  FileText, 
  Beaker, 
  FileSpreadsheet, 
  Factory, 
  Store,
  RefreshCw,
  CheckCircle,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  PublicationStatus, 
  PUBLICATION_STATUSES, 
  PRODUCTION_STAGES,
  ProductionStage 
} from "@/lib/publication";

type QueueTab = ProductionStage;

export default function AdminProductionQueues() {
  const queryClient = useQueryClient();
  const [activeQueue, setActiveQueue] = useState<QueueTab>('submission');
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    itemId: string;
    action: string;
    title: string;
  }>({ open: false, itemId: '', action: '', title: '' });
  const [actionNotes, setActionNotes] = useState("");
  const [detailModalId, setDetailModalId] = useState<string | null>(null);

  // Fetch queue items based on the new status_v2 column
  const { data: queueItems, isLoading } = useQuery({
    queryKey: ['production-queues', activeQueue],
    queryFn: async () => {
      const stageConfig = PRODUCTION_STAGES[activeQueue];
      
      let query = supabase
        .from('portfolio_publications')
        .select(`
          id,
          status,
          status_v2,
          marketplace_status,
          submitted_at,
          design_metadata,
          reviewer_notes,
          priority_score,
          assigned_team,
          portfolio:portfolios(
            id,
            title,
            description,
            items,
            designer_id
          )
        `)
        .order('priority_score', { ascending: false })
        .order('submitted_at', { ascending: true });

      // Filter based on status_v2 for the stage
      if (stageConfig.statuses.length > 0) {
        query = query.in('status_v2', stageConfig.statuses);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch designer profiles separately
      const designerIds = [...new Set(data?.map(d => d.portfolio?.designer_id).filter(Boolean))];
      
      let designers: any[] = [];
      if (designerIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, name, avatar_url, rank_id')
          .in('user_id', designerIds);
        designers = profilesData || [];
      }

      // Map designers to items
      return (data || []).map(item => ({
        ...item,
        designerProfile: designers.find(d => d.user_id === item.portfolio?.designer_id),
      }));
    },
  });

  // Fetch queue stats using new status_v2
  const { data: stats } = useQuery({
    queryKey: ['queue-stats'],
    queryFn: async () => {
      const stages = Object.keys(PRODUCTION_STAGES) as ProductionStage[];
      const counts: Record<string, number> = {};
      
      for (const stage of stages) {
        const stageConfig = PRODUCTION_STAGES[stage];
        if (stageConfig.statuses.length > 0) {
          const { count } = await supabase
            .from('portfolio_publications')
            .select('*', { count: 'exact', head: true })
            .in('status_v2', stageConfig.statuses);
          counts[stage] = count || 0;
        }
      }

      // Get urgent count (items older than 48 hours)
      const urgentDate = new Date();
      urgentDate.setHours(urgentDate.getHours() - 48);
      
      const { count: urgentCount } = await supabase
        .from('portfolio_publications')
        .select('*', { count: 'exact', head: true })
        .lt('submitted_at', urgentDate.toISOString())
        .not('status_v2', 'in', '(published,rejected,draft)');

      // Get completed today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: completedToday } = await supabase
        .from('portfolio_publications')
        .select('*', { count: 'exact', head: true })
        .gte('published_at', today.toISOString())
        .eq('status_v2', 'published');

      return {
        submission: counts.submission || 0,
        sampling: counts.sampling || 0,
        techpack: counts.techpack || 0,
        preproduction: counts.preproduction || 0,
        marketplace: counts.marketplace || 0,
        urgent: urgentCount || 0,
        avgWaitTime: '2.4 days',
        completedToday: completedToday || 0,
      };
    },
  });

  // Process queue action with new status transitions
  const processAction = useMutation({
    mutationFn: async ({ itemId, action, notes }: { itemId: string; action: string; notes: string }) => {
      let newStatus: PublicationStatus = 'pending_review';
      
      // Determine new status based on action
      switch (action) {
        case 'Review':
          newStatus = 'pending_review';
          break;
        case 'Start Sampling':
          newStatus = 'sampling';
          break;
        case 'Generate Tech Pack':
        case 'Complete Sampling':
          newStatus = 'sample_ready';
          break;
        case 'Approve Costing':
          newStatus = 'costing_ready';
          break;
        case 'Approve Production':
          newStatus = 'pre_production';
          break;
        case 'Create Listing':
          newStatus = 'marketplace_pending';
          break;
        case 'Send Preview':
          newStatus = 'listing_preview';
          break;
        case 'Publish':
          newStatus = 'published';
          break;
        case 'Quick Reject':
        case 'Reject':
          newStatus = 'rejected';
          break;
        case 'Request Revision':
          newStatus = 'revision_requested';
          break;
        case 'Approve':
          newStatus = 'approved';
          break;
        default:
          throw new Error('Unknown action');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      const updateData: Record<string, any> = {
        status_v2: newStatus,
        reviewer_notes: notes || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      };

      // Set published_at timestamp when publishing
      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      // Update publication status
      const { error: updateError } = await supabase
        .from('portfolio_publications')
        .update(updateData)
        .eq('id', itemId);

      if (updateError) throw updateError;

      // Log to production_logs
      await supabase.from('production_logs').insert({
        publication_id: itemId,
        action: action.toLowerCase().replace(' ', '_'),
        to_stage: newStatus,
        performed_by: user?.id,
        notes: notes || null,
      });

      // Log admin action
      await supabase.from('admin_logs').insert({
        admin_id: user?.id,
        action: `queue_${action.toLowerCase().replace(' ', '_')}`,
        target_type: 'publication',
        target_id: itemId,
        metadata: { notes, new_status: newStatus, queue: activeQueue },
      });

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-queues'] });
      queryClient.invalidateQueries({ queryKey: ['queue-stats'] });
      toast.success('Action completed successfully');
      setActionDialog({ open: false, itemId: '', action: '', title: '' });
      setActionNotes('');
    },
    onError: (error) => {
      toast.error('Failed to process action: ' + error.message);
    },
  });

  const handleAction = (itemId: string, action: string) => {
    const item = queueItems?.find(i => i.id === itemId);
    setActionDialog({
      open: true,
      itemId,
      action,
      title: item?.portfolio?.title || 'Unknown Item',
    });
  };

  const confirmAction = () => {
    processAction.mutate({
      itemId: actionDialog.itemId,
      action: actionDialog.action,
      notes: actionNotes,
    });
  };

  // Transform queue items for display
  const displayItems = queueItems?.map(item => {
    const submittedDate = new Date(item.submitted_at);
    const hoursSinceSubmission = (Date.now() - submittedDate.getTime()) / (1000 * 60 * 60);
    
    let priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal';
    if (item.priority_score && item.priority_score > 80) priority = 'urgent';
    else if (item.priority_score && item.priority_score > 50) priority = 'high';
    else if (hoursSinceSubmission > 72) priority = 'urgent';
    else if (hoursSinceSubmission > 48) priority = 'high';
    else if (hoursSinceSubmission < 12) priority = 'low';

    const items = item.portfolio?.items as any[];
    const thumbnail = items?.[0]?.url || items?.[0]?.thumbnail;

    return {
      id: item.id,
      title: item.portfolio?.title || 'Untitled',
      designer: {
        name: item.designerProfile?.name || 'Unknown',
        avatar: item.designerProfile?.avatar_url,
        rank: item.designerProfile?.rank_id,
      },
      status: item.status_v2 || item.status || 'pending',
      priority,
      submittedAt: item.submitted_at,
      category: (item.design_metadata as any)?.category || 'fashion',
      thumbnailUrl: thumbnail,
    };
  }) || [];

  // Filter items
  const filteredItems = displayItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.designer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const queueTabs = [
    { id: 'submission' as const, label: 'Submissions', icon: FileText, count: stats?.submission },
    { id: 'sampling' as const, label: 'Sampling', icon: Beaker, count: stats?.sampling },
    { id: 'techpack' as const, label: 'Tech Packs', icon: FileSpreadsheet, count: stats?.techpack },
    { id: 'preproduction' as const, label: 'Pre-Production', icon: Factory, count: stats?.preproduction },
    { id: 'marketplace' as const, label: 'Marketplace', icon: Store, count: stats?.marketplace },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Production Queues
            </h1>
            <p className="text-muted-foreground">
              Manage the end-to-end production pipeline
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['production-queues'] });
              queryClient.invalidateQueries({ queryKey: ['queue-stats'] });
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Header */}
        {stats && <QueueStatsHeader stats={stats} />}

        {/* Queue Tabs */}
        <Tabs value={activeQueue} onValueChange={(v) => setActiveQueue(v as QueueTab)}>
          <TabsList className="w-full justify-start gap-1 p-1">
            {queueTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Filters */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or designer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Queue Content */}
          {queueTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-4">
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading queue items...
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <tab.icon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No items in this queue</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredItems.map((item) => (
                    <ProductionQueueCard
                      key={item.id}
                      item={item}
                      queueType={activeQueue}
                      onAction={handleAction}
                      onView={(id) => setDetailModalId(id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Action Dialog */}
        <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ ...actionDialog, open: false })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionDialog.action}: {actionDialog.title}
              </DialogTitle>
              <DialogDescription>
                Confirm this action and optionally add notes.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                {actionDialog.action.includes('Reject') || actionDialog.action === 'Hold' ? (
                  <XCircle className="w-5 h-5 text-destructive" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
                <span className="text-foreground">
                  {actionDialog.action}
                </span>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Notes (optional)
                </label>
                <Textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Add any notes for this action..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setActionDialog({ ...actionDialog, open: false })}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                disabled={processAction.isPending}
              >
                {processAction.isPending ? 'Processing...' : 'Confirm'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Modal */}
        <QueueItemDetailModal
          open={!!detailModalId}
          onOpenChange={(open) => !open && setDetailModalId(null)}
          itemId={detailModalId || ''}
          onAction={(id, action) => {
            setDetailModalId(null);
            handleAction(id, action);
          }}
        />
      </div>
    </AdminLayout>
  );
}
