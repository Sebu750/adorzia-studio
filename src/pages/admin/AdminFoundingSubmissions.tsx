import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  Star,
  Clock,
  FileText,
  AlertCircle,
  ExternalLink,
  Info,
  History,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FoundingSubmission {
  id: string;
  designer_id: string;
  collection_name: string;
  design_philosophy: string | null;
  designer_vision_statement: string | null;
  primary_category: string;
  status: string;
  moodboard_files: any[];
  tech_pack_files: any[];
  articles: any[];
  estimated_articles: number;
  proposed_materials: string | null;
  target_seasonal_launch: string;
  created_at: string;
  admin_feedback: string | null;
  internal_notes: string | null;
  rejection_reason: string | null;
  status_history: any[];
  designer?: {
    name: string | null;
    avatar_url: string | null;
    email: string | null;
    brand_name: string | null;
    is_founding_designer: boolean;
  };
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Submitted", color: "bg-blue-500/10 text-blue-500", icon: FileText },
  under_review: { label: "Under Review", color: "bg-amber-500/10 text-amber-500", icon: Clock },
  revisions_required: { label: "Feedback Sent", color: "bg-orange-500/10 text-orange-500", icon: Info },
  approved: { label: "Approved", color: "bg-success/10 text-success", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive", icon: XCircle },
};

const AdminFoundingSubmissions = () => {
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = React.useState<FoundingSubmission[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [titleFilter, setTitleFilter] = React.useState("all");

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data: submissionsData, error } = await supabase
        .from("founding_designers_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const designerIds = [...new Set(submissionsData?.map(s => s.designer_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name, avatar_url, email, brand_name, is_founding_designer")
        .in("user_id", designerIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const enrichedSubmissions: FoundingSubmission[] = (submissionsData || []).map(sub => ({
        ...sub,
        designer: profileMap.get(sub.designer_id) || undefined,
      }));

      setSubmissions(enrichedSubmissions);
    } catch (error) {
      console.error("Error fetching founding submissions:", error);
      toast.error("Failed to load founding submissions");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleMarkUnderReview = async (id: string) => {
    try {
      console.log("Marking submission as under review:", id);
      const { data, error } = await supabase.functions.invoke('manage-founding', {
        body: {
          action: 'mark_review',
          submissionId: id
        }
      });
      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to update status");
      }
      toast.success("Marked as Under Review");
      fetchSubmissions();
    } catch (error: any) {
      console.error("Action error:", error);
      toast.error(error.message || "Update failed");
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.collection_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.designer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.designer?.brand_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    const matchesTitle = titleFilter === "all" || 
      (titleFilter === "assigned" && sub.designer?.is_founding_designer) ||
      (titleFilter === "not_assigned" && !sub.designer?.is_founding_designer);

    return matchesSearch && matchesStatus && matchesTitle;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === "pending").length,
    approved: submissions.filter(s => s.status === "approved").length,
    rejected: submissions.filter(s => s.status === "rejected").length,
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <header className="space-y-1">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <h1 className="text-display-lg text-admin-foreground">Founding Designers Program</h1>
          </div>
          <p className="text-admin-muted-foreground">
            Review and manage designer collections for the launch cohort.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Applications", value: stats.total, icon: FileText, color: "bg-admin-muted" },
            { label: "Pending Review", value: stats.pending, icon: Clock, color: "bg-warning/10 text-warning" },
            { label: "Approved Cohort", value: stats.approved, icon: CheckCircle, color: "bg-success/10 text-success" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, color: "bg-destructive/10 text-destructive" },
          ].map((stat, i) => (
            <Card key={i} className="bg-admin-card border-admin-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-admin-foreground">{stat.value}</p>
                  <p className="text-xs text-admin-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-muted-foreground" />
            <Input
              placeholder="Search by collection, designer, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-admin-card border-admin-border text-admin-foreground"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-admin-card border-admin-border text-admin-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-admin-card border-admin-border text-admin-foreground">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Submitted</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="revisions_required">Feedback Sent</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={titleFilter} onValueChange={setTitleFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-admin-card border-admin-border text-admin-foreground">
              <SelectValue placeholder="Founding Title" />
            </SelectTrigger>
            <SelectContent className="bg-admin-card border-admin-border text-admin-foreground">
              <SelectItem value="all">All Titles</SelectItem>
              <SelectItem value="assigned">Title Assigned</SelectItem>
              <SelectItem value="not_assigned">Not Assigned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="bg-admin-card border-admin-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-admin-muted-foreground">Loading submissions...</div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="p-12 text-center text-admin-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                No collections have been submitted yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-admin-border hover:bg-transparent">
                    <TableHead className="text-admin-muted-foreground">Designer / Brand</TableHead>
                    <TableHead className="text-admin-muted-foreground">Collection</TableHead>
                    <TableHead className="text-admin-muted-foreground">Articles</TableHead>
                    <TableHead className="text-admin-muted-foreground">Submitted</TableHead>
                    <TableHead className="text-admin-muted-foreground">Status</TableHead>
                    <TableHead className="text-admin-muted-foreground">Founding Title</TableHead>
                    <TableHead className="text-admin-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((sub) => {
                    const status = statusConfig[sub.status] || statusConfig.pending;
                    return (
                      <TableRow key={sub.id} className="border-admin-border hover:bg-admin-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 ring-1 ring-admin-border">
                              <AvatarImage src={sub.designer?.avatar_url || undefined} />
                              <AvatarFallback className="bg-admin-muted text-xs">{sub.designer?.name?.charAt(0) || "D"}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-admin-foreground">{sub.designer?.name}</span>
                              <span className="text-[10px] text-admin-muted-foreground">{sub.designer?.brand_name || "No Brand Name"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-admin-foreground">{sub.collection_name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-admin-muted text-admin-foreground">
                            {sub.articles?.length || 0} Articles
                          </Badge>
                        </TableCell>
                        <TableCell className="text-admin-muted-foreground text-sm">
                          {format(new Date(sub.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${status.color} gap-1 border-0`}>
                            <status.icon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {sub.designer?.is_founding_designer ? (
                            <Badge className="bg-success/10 text-success border-success/20">Yes</Badge>
                          ) : (
                            <Badge variant="outline" className="border-admin-border text-admin-muted-foreground">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {sub.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-[10px] uppercase font-bold text-amber-500 hover:bg-amber-500/10"
                                onClick={() => handleMarkUnderReview(sub.id)}
                              >
                                Mark Under Review
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-admin-foreground hover:bg-admin-muted"
                              onClick={() => {
                                console.log("Navigating to review for ID:", sub.id);
                                navigate(`/admin/founding-submissions/${sub.id}`);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFoundingSubmissions;
