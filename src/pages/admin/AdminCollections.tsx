import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  FolderOpen,
  Clock,
  FileImage,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import { CollectionReviewModal } from "@/components/admin/CollectionReviewModal";
import { format } from "date-fns";

interface CollectionSubmission {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  designer_id: string;
  files: any[];
  thumbnail_url: string | null;
  concept_notes: string | null;
  inspiration: string | null;
  admin_feedback: string | null;
  designer?: {
    name: string | null;
    avatar_url: string | null;
    email: string | null;
  };
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "bg-admin-muted text-admin-muted-foreground", icon: Clock },
  pending: { label: "Pending Review", color: "bg-warning/10 text-warning", icon: Clock },
  approved: { label: "Approved", color: "bg-success/10 text-success", icon: CheckCircle },
  revisions_required: { label: "Revisions Required", color: "bg-orange-500/10 text-orange-500", icon: RotateCcw },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive", icon: XCircle },
};

const AdminCollections = () => {
  const { user } = useAdminAuth();
  const [submissions, setSubmissions] = useState<CollectionSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<CollectionSubmission | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data: submissionsData, error } = await supabase
        .from("collection_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch designer profiles for each submission
      const designerIds = [...new Set(submissionsData?.map(s => s.designer_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name, avatar_url, email")
        .in("user_id", designerIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const enrichedSubmissions: CollectionSubmission[] = (submissionsData || []).map(sub => ({
        ...sub,
        files: Array.isArray(sub.files) ? sub.files : [],
        designer: profileMap.get(sub.designer_id) || undefined,
      }));

      setSubmissions(enrichedSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleReview = (submission: CollectionSubmission) => {
    setSelectedSubmission(submission);
    setReviewModalOpen(true);
  };

  const handleStatusUpdate = async (submissionId: string, newStatus: string, feedback?: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      };

      if (feedback) {
        updateData.admin_feedback = feedback;
      }

      const { error } = await supabase
        .from("collection_submissions")
        .update(updateData)
        .eq("id", submissionId);

      if (error) throw error;

      // Log admin action
      await supabase.from("admin_logs").insert({
        admin_id: user?.id,
        action: `collection_${newStatus}`,
        target_type: "collection_submission",
        target_id: submissionId,
        metadata: { feedback },
      });

      toast.success(`Submission ${newStatus === 'approved' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'marked for revisions'}`);
      setReviewModalOpen(false);
      fetchSubmissions();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update submission status");
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.designer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && sub.status === activeTab;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === "pending").length,
    approved: submissions.filter(s => s.status === "approved").length,
    revisions: submissions.filter(s => s.status === "revisions_required").length,
    rejected: submissions.filter(s => s.status === "rejected").length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AdminLayout>
      <motion.div
        className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="space-y-1">
          <h1 className="text-display-lg text-admin-foreground">Collection Submissions</h1>
          <p className="text-admin-muted-foreground">
            Review and manage designer collection submissions
          </p>
        </motion.header>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-admin-card border-admin-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-admin-muted flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-admin-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-admin-foreground">{stats.total}</p>
                <p className="text-xs text-admin-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-admin-card border-admin-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-admin-foreground">{stats.pending}</p>
                <p className="text-xs text-admin-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-admin-card border-admin-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-admin-foreground">{stats.approved}</p>
                <p className="text-xs text-admin-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-admin-card border-admin-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <RotateCcw className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-admin-foreground">{stats.revisions}</p>
                <p className="text-xs text-admin-muted-foreground">Revisions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-admin-card border-admin-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-admin-foreground">{stats.rejected}</p>
                <p className="text-xs text-admin-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters & Search */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-muted-foreground" />
            <Input
              placeholder="Search by title, designer, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-admin-card border-admin-border text-admin-foreground"
            />
          </div>
          <Button variant="outline" className="gap-2 border-admin-border text-admin-foreground">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </motion.div>

        {/* Tabs & Table */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-admin-muted border border-admin-border">
              <TabsTrigger value="all" className="data-[state=active]:bg-admin-card">
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-admin-card">
                Pending ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-admin-card">
                Approved ({stats.approved})
              </TabsTrigger>
              <TabsTrigger value="revisions_required" className="data-[state=active]:bg-admin-card">
                Revisions ({stats.revisions})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-admin-card">
                Rejected ({stats.rejected})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <Card className="bg-admin-card border-admin-border">
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-8 text-center text-admin-muted-foreground">
                      Loading submissions...
                    </div>
                  ) : filteredSubmissions.length === 0 ? (
                    <div className="p-8 text-center">
                      <AlertCircle className="h-12 w-12 mx-auto text-admin-muted-foreground mb-3" />
                      <p className="text-admin-muted-foreground">No submissions found</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-admin-border hover:bg-transparent">
                          <TableHead className="text-admin-muted-foreground">Collection</TableHead>
                          <TableHead className="text-admin-muted-foreground">Designer</TableHead>
                          <TableHead className="text-admin-muted-foreground">Category</TableHead>
                          <TableHead className="text-admin-muted-foreground">Files</TableHead>
                          <TableHead className="text-admin-muted-foreground">Submitted</TableHead>
                          <TableHead className="text-admin-muted-foreground">Status</TableHead>
                          <TableHead className="text-admin-muted-foreground text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubmissions.map((submission) => {
                          const status = statusConfig[submission.status] || statusConfig.draft;
                          const StatusIcon = status.icon;
                          return (
                            <TableRow 
                              key={submission.id} 
                              className="border-admin-border hover:bg-admin-muted/50 cursor-pointer"
                              onClick={() => handleReview(submission)}
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {submission.thumbnail_url ? (
                                    <img
                                      src={submission.thumbnail_url}
                                      alt={submission.title}
                                      className="h-10 w-10 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-lg bg-admin-muted flex items-center justify-center">
                                      <FileImage className="h-5 w-5 text-admin-muted-foreground" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-admin-foreground">{submission.title}</p>
                                    {submission.description && (
                                      <p className="text-xs text-admin-muted-foreground truncate max-w-[200px]">
                                        {submission.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={submission.designer?.avatar_url || undefined} />
                                    <AvatarFallback className="bg-admin-muted text-admin-foreground text-xs">
                                      {submission.designer?.name?.charAt(0) || "D"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-admin-foreground">
                                    {submission.designer?.name || "Unknown"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize border-admin-border text-admin-foreground">
                                  {submission.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="text-admin-muted-foreground">
                                  {submission.files?.length || 0} files
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-admin-muted-foreground text-sm">
                                  {submission.submitted_at 
                                    ? format(new Date(submission.submitted_at), "MMM d, yyyy")
                                    : format(new Date(submission.created_at), "MMM d, yyyy")}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${status.color} gap-1`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {status.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-admin-muted-foreground hover:text-admin-foreground">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-admin-card border-admin-border">
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReview(submission);
                                      }}
                                      className="gap-2 text-admin-foreground"
                                    >
                                      <Eye className="h-4 w-4" />
                                      Review
                                    </DropdownMenuItem>
                                    {submission.status === "pending" && (
                                      <>
                                        <DropdownMenuItem 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusUpdate(submission.id, "approved");
                                          }}
                                          className="gap-2 text-success"
                                        >
                                          <CheckCircle className="h-4 w-4" />
                                          Approve
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSubmission(submission);
                                            setReviewModalOpen(true);
                                          }}
                                          className="gap-2 text-orange-500"
                                        >
                                          <RotateCcw className="h-4 w-4" />
                                          Request Revisions
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSubmission(submission);
                                            setReviewModalOpen(true);
                                          }}
                                          className="gap-2 text-destructive"
                                        >
                                          <XCircle className="h-4 w-4" />
                                          Reject
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Review Modal */}
      <CollectionReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        submission={selectedSubmission}
        onStatusUpdate={handleStatusUpdate}
      />
    </AdminLayout>
  );
};

export default AdminCollections;
