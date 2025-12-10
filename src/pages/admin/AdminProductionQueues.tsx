import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { QueueStatsHeader } from "@/components/admin/QueueStatsHeader";
import { ProductionQueueCard } from "@/components/admin/ProductionQueueCard";
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
  XCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

type QueueTab = 'submission' | 'sampling' | 'techpack' | 'preproduction' | 'marketplace';

// Map queue tabs to publication statuses (using available enum values)
// pending = submission queue, approved = sampling/techpack/preproduction, published = marketplace complete
const queueStatusMap: Record<QueueTab, string[]> = {
  submission: ['pending'],
  sampling: ['approved'],
  techpack: ['approved'],
  preproduction: ['approved'],
  marketplace: ['approved'],
};

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

  // Fetch queue items
  const { data: queueItems, isLoading } = useQuery({
    queryKey: ['production-queues', activeQueue],
    queryFn: async () => {
      // Use marketplace_status for queue tracking instead of status enum
      let query = supabase
        .from('portfolio_publications')
        .select(`
          id,
          status,
          marketplace_status,
          submitted_at,
          design_metadata,
          reviewer_notes,
          portfolio:portfolios(
            id,
            title,
            description,
            items,
            designer_id
          )
        `)
        .order('submitted_at', { ascending: true });

      // Filter based on marketplace_status field
      switch (activeQueue) {
        case 'submission':
          query = query.eq('status', 'pending');
          break;
        case 'sampling':
          query = query.eq('marketplace_status', 'sampling');
          break;
        case 'techpack':
          query = query.eq('marketplace_status', 'techpack');
          break;
        case 'preproduction':
          query = query.eq('marketplace_status', 'preproduction');
          break;
        case 'marketplace':
          query = query.eq('marketplace_status', 'marketplace_prep');
          break;
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch designer profiles separately
      const designerIds = [...new Set(data?.map(d => d.portfolio?.designer_id).filter(Boolean))];
      
      let designers: any[] = [];
      if (designerIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, name, avatar_url')
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

  // Fetch queue stats
  const { data: stats } = useQuery({
    queryKey: ['queue-stats'],
    queryFn: async () => {
      // Get counts for each queue
      const [submissionCount, samplingCount, techpackCount, preproductionCount, marketplaceCount] = await Promise.all([
        supabase.from('portfolio_publications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('portfolio_publications').select('*', { count: 'exact', head: true }).eq('marketplace_status', 'sampling'),
        supabase.from('portfolio_publications').select('*', { count: 'exact', head: true }).eq('marketplace_status', 'techpack'),
        supabase.from('portfolio_publications').select('*', { count: 'exact', head: true }).eq('marketplace_status', 'preproduction'),
        supabase.from('portfolio_publications').select('*', { count: 'exact', head: true }).eq('marketplace_status', 'marketplace_prep'),
      ]);

      // Get urgent count (items older than 48 hours)
      const urgentDate = new Date();
      urgentDate.setHours(urgentDate.getHours() - 48);
      
      const { count: urgentCount } = await supabase
        .from('portfolio_publications')
        .select('*', { count: 'exact', head: true })
        .lt('submitted_at', urgentDate.toISOString())
        .not('status', 'in', '(published,rejected)');

      // Get completed today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: completedToday } = await supabase
        .from('portfolio_publications')
        .select('*', { count: 'exact', head: true })
        .gte('reviewed_at', today.toISOString())
        .eq('status', 'published');

      return {
        submission: submissionCount.count || 0,
        sampling: samplingCount.count || 0,
        techpack: techpackCount.count || 0,
        preproduction: preproductionCount.count || 0,
        marketplace: marketplaceCount.count || 0,
        urgent: urgentCount || 0,
        avgWaitTime: '2.4 days',
        completedToday: completedToday || 0,
      };
    },
  });

  // Process queue action
  const processAction = useMutation({
    mutationFn: async ({ itemId, action, notes }: { itemId: string; action: string; notes: string }) => {
      let newStatus: 'pending' | 'approved' | 'published' | 'rejected' = 'approved';
      let newMarketplaceStatus: string | null = null;
      
      // Determine new status based on action
      switch (action) {
        case 'Review':
        case 'Start Sampling':
          newStatus = 'approved';
          newMarketplaceStatus = 'sampling';
          break;
        case 'Generate Tech Pack':
          newMarketplaceStatus = 'techpack';
          break;
        case 'Approve Production':
          newMarketplaceStatus = 'preproduction';
          break;
        case 'Create Listing':
          newMarketplaceStatus = 'marketplace_prep';
          break;
        case 'Quick Reject':
        case 'Reject':
          newStatus = 'rejected';
          break;
        case 'Hold':
          newMarketplaceStatus = 'hold';
          break;
        default:
          throw new Error('Unknown action');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      // Update publication status
      const { error: updateError } = await supabase
        .from('portfolio_publications')
        .update({
          status: newStatus,
          marketplace_status: newMarketplaceStatus,
          reviewer_notes: notes || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
        })
        .eq('id', itemId);

      if (updateError) throw updateError;

      // Log the action
      await supabase.from('admin_logs').insert({
        admin_id: user?.id,
        action: `queue_${action.toLowerCase().replace(' ', '_')}`,
        target_type: 'publication',
        target_id: itemId,
        metadata: { notes, new_status: newStatus, queue: activeQueue },
      });

      // Log to publication reviews
      await supabase.from('publication_reviews').insert({
        publication_id: itemId,
        reviewer_id: user?.id,
        action: action.toLowerCase().replace(' ', '_'),
        notes: notes || null,
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
    if (hoursSinceSubmission > 72) priority = 'urgent';
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
        rank: undefined,
      },
      status: item.status === 'pending' ? 'pending' : 'in_progress',
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
            <h1 className="text-2xl font-display font-bold text-admin-wine-foreground">
              Production Queues
            </h1>
            <p className="text-admin-apricot/70">
              Manage the end-to-end production pipeline
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-admin-chocolate text-admin-apricot hover:bg-admin-chocolate"
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
          <TabsList className="bg-admin-coffee border border-admin-chocolate w-full justify-start gap-1 p-1">
            {queueTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "flex items-center gap-2 data-[state=active]:bg-admin-wine data-[state=active]:text-admin-wine-foreground",
                  "text-admin-apricot/70 hover:text-admin-wine-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 h-5 px-1.5 text-[10px] bg-admin-chocolate"
                  >
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Filters */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-apricot/50" />
              <Input
                placeholder="Search by title or designer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-admin-coffee border-admin-chocolate text-admin-wine-foreground placeholder:text-admin-apricot/50"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40 bg-admin-coffee border-admin-chocolate text-admin-wine-foreground">
                <Filter className="w-4 h-4 mr-2 text-admin-apricot/50" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-admin-coffee border-admin-chocolate">
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
                <div className="text-center py-12 text-admin-apricot/70">
                  Loading queue items...
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <tab.icon className="w-12 h-12 mx-auto text-admin-apricot/30 mb-3" />
                  <p className="text-admin-apricot/70">No items in this queue</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredItems.map((item) => (
                    <ProductionQueueCard
                      key={item.id}
                      item={item}
                      queueType={activeQueue}
                      onAction={handleAction}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Action Dialog */}
        <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ ...actionDialog, open: false })}>
          <DialogContent className="bg-admin-coffee border-admin-chocolate">
            <DialogHeader>
              <DialogTitle className="text-admin-wine-foreground">
                {actionDialog.action}: {actionDialog.title}
              </DialogTitle>
              <DialogDescription className="text-admin-apricot/70">
                Confirm this action and optionally add notes.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-admin-chocolate/30">
                {actionDialog.action.includes('Reject') || actionDialog.action === 'Hold' ? (
                  <XCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                <span className="text-admin-wine-foreground">
                  {actionDialog.action}
                </span>
              </div>
              
              <div>
                <label className="text-sm text-admin-apricot/70 mb-2 block">
                  Notes (optional)
                </label>
                <Textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Add any notes for this action..."
                  className="bg-admin-coffee border-admin-chocolate text-admin-wine-foreground placeholder:text-admin-apricot/50"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setActionDialog({ ...actionDialog, open: false })}
                className="border-admin-chocolate text-admin-apricot hover:bg-admin-chocolate"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                disabled={processAction.isPending}
                className={cn(
                  actionDialog.action.includes('Reject') || actionDialog.action === 'Hold'
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-admin-wine hover:bg-admin-wine/90",
                  "text-admin-wine-foreground"
                )}
              >
                {processAction.isPending ? 'Processing...' : 'Confirm'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
