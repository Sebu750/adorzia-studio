import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  FileImage, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Edit2, 
  Trash2, 
  Eye,
  Send,
  FolderOpen
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { CollectionSubmissionForm } from "@/components/collections/CollectionSubmissionForm";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { Skeleton } from "@/components/ui/skeleton";

type CollectionStatus = 'draft' | 'pending' | 'approved' | 'revisions_required' | 'rejected';

interface CollectionSubmission {
  id: string;
  title: string;
  description: string | null;
  category: string;
  inspiration: string | null;
  concept_notes: string | null;
  files: any[];
  thumbnail_url: string | null;
  status: CollectionStatus;
  admin_feedback: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<CollectionStatus, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive"; icon: any }> = {
  draft: { label: "Draft", variant: "secondary", icon: Edit2 },
  pending: { label: "Pending Review", variant: "warning", icon: Clock },
  approved: { label: "Approved", variant: "success", icon: CheckCircle2 },
  revisions_required: { label: "Revisions Required", variant: "destructive", icon: AlertCircle },
  rejected: { label: "Rejected", variant: "destructive", icon: AlertCircle },
};

export default function Collections() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<CollectionSubmission | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['collection-submissions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collection_submissions')
        .select('*')
        .eq('designer_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CollectionSubmission[];
    },
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('collection_submissions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-submissions'] });
      toast({ title: "Draft deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete draft", variant: "destructive" });
    },
  });

  const filteredSubmissions = submissions?.filter(sub => {
    if (activeTab === "all") return true;
    if (activeTab === "drafts") return sub.status === "draft";
    if (activeTab === "pending") return sub.status === "pending";
    if (activeTab === "reviewed") return ["approved", "revisions_required", "rejected"].includes(sub.status);
    return true;
  });

  const stats = {
    total: submissions?.length || 0,
    drafts: submissions?.filter(s => s.status === "draft").length || 0,
    pending: submissions?.filter(s => s.status === "pending").length || 0,
    approved: submissions?.filter(s => s.status === "approved").length || 0,
  };

  const handleEdit = (submission: CollectionSubmission) => {
    setEditingSubmission(submission);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSubmission(null);
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">My Collections</h1>
            <p className="text-muted-foreground">Submit your design collections for review</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Collection
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <FolderOpen className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
              <p className="font-display text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Collections</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Edit2 className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
              <p className="font-display text-2xl font-bold">{stats.drafts}</p>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-5 w-5 mx-auto text-warning mb-2" />
              <p className="font-display text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-5 w-5 mx-auto text-success mb-2" />
              <p className="font-display text-2xl font-bold">{stats.approved}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs & Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({stats.drafts})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <Skeleton className="h-48 rounded-t-xl" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredSubmissions?.length === 0 ? (
              <Card className="p-12 text-center">
                <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">No collections yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by creating your first collection submission
                </p>
                <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Collection
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubmissions?.map(submission => (
                  <CollectionCard
                    key={submission.id}
                    submission={submission}
                    statusConfig={statusConfig}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Form Dialog */}
        <CollectionSubmissionForm
          open={isFormOpen}
          onClose={handleFormClose}
          editingSubmission={editingSubmission}
        />
      </div>
    </AppLayout>
  );
}