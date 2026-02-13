import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Copy, 
  Download,
  Filter,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  Eye,
  Archive,
  RotateCcw,
  Star
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";
import { WalkthroughModal } from "@/components/admin/WalkthroughModal";
import { WalkthroughProgressModal } from "@/components/admin/WalkthroughProgressModal";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Stylebox = Database["public"]["Tables"]["styleboxes"]["Row"];
type WalkthroughProgress = Database["public"]["Tables"]["walkthrough_progress"]["Row"];

const difficultyColors: Record<string, string> = {
  free: "bg-success/20 text-success border-success/30",
  easy: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  medium: "bg-amber-500/20 text-amber-600 border-amber-500/30",
  hard: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  insane: "bg-red-500/20 text-red-600 border-red-500/30",
};

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  active: "bg-success/20 text-success border-success/30",
  archived: "bg-secondary text-secondary-foreground border-border",
};

const categoryColors: Record<string, string> = {
  fashion: "bg-purple-500/20 text-purple-600 border-purple-500/30",
  textile: "bg-teal-500/20 text-teal-600 border-teal-500/30",
  jewelry: "bg-pink-500/20 text-pink-600 border-pink-500/30",
};

export default function AdminWalkthroughs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWalkthrough, setEditingWalkthrough] = useState<Stylebox | null>(null);
  const [deleteWalkthrough, setDeleteWalkthrough] = useState<Stylebox | null>(null);
  const [viewProgressWalkthrough, setViewProgressWalkthrough] = useState<Stylebox | null>(null);

  // Fetch walkthroughs (is_walkthrough = true)
  const { data: walkthroughs, isLoading } = useQuery({
    queryKey: ["admin-walkthroughs", categoryFilter, difficultyFilter, statusFilter, sortField, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from("styleboxes")
        .select("*")
        .eq("is_walkthrough", true)
        .order(sortField, { ascending: sortOrder === "asc" });

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter as "fashion" | "textile" | "jewelry");
      }
      if (difficultyFilter !== "all") {
        query = query.eq("difficulty", difficultyFilter as "free" | "easy" | "medium" | "hard" | "insane");
      }
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as "draft" | "active" | "archived");
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Stylebox[];
    },
  });

  // Fetch progress stats for all walkthroughs
  const { data: progressStats } = useQuery({
    queryKey: ["admin-walkthrough-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("walkthrough_progress")
        .select("stylebox_id, completed_at");
      if (error) throw error;
      
      const stats: Record<string, { total: number; completed: number }> = {};
      data.forEach((p: WalkthroughProgress) => {
        if (!stats[p.stylebox_id]) {
          stats[p.stylebox_id] = { total: 0, completed: 0 };
        }
        stats[p.stylebox_id].total++;
        if (p.completed_at) {
          stats[p.stylebox_id].completed++;
        }
      });
      return stats;
    },
  });

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("styleboxes")
        .update({ status: "archived" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-walkthroughs"] });
      toast({
        title: "Walkthrough archived",
        description: "The walkthrough has been archived successfully.",
      });
      setDeleteWalkthrough(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to archive walkthrough.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("styleboxes")
        .update({ status: "draft" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-walkthroughs"] });
      toast({
        title: "Walkthrough restored",
        description: "The walkthrough has been restored to draft.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to restore walkthrough.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from("styleboxes")
        .update({ is_featured: featured })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { featured }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-walkthroughs"] });
      toast({
        title: featured ? "Walkthrough featured" : "Walkthrough unfeatured",
        description: featured 
          ? "This walkthrough will now appear as featured." 
          : "This walkthrough is no longer featured.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update featured status.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Duplicate mutation
  const duplicateMutation = useMutation({
    mutationFn: async (walkthrough: Stylebox) => {
      const { id, created_at, updated_at, created_by, ...rest } = walkthrough;
      const newWalkthrough = {
        ...rest,
        title: `${walkthrough.title} (Copy)`,
        status: "draft" as const,
        version: 1,
      };
      const { error } = await supabase.from("styleboxes").insert(newWalkthrough);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-walkthroughs"] });
      toast({
        title: "Walkthrough duplicated",
        description: "A copy has been created as a draft.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to duplicate walkthrough.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Filter by search
  const filteredWalkthroughs = walkthroughs?.filter(w =>
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleEdit = (walkthrough: Stylebox) => {
    setEditingWalkthrough(walkthrough);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingWalkthrough(null);
    setIsModalOpen(true);
  };

  // Stats
  const totalWalkthroughs = walkthroughs?.length || 0;
  const activeWalkthroughs = walkthroughs?.filter(w => w.status === "active").length || 0;
  const totalParticipants = Object.values(progressStats || {}).reduce((acc, s) => acc + s.total, 0);
  const totalCompletions = Object.values(progressStats || {}).reduce((acc, s) => acc + s.completed, 0);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-admin-camel" />
              Walkthrough Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage guided learning experiences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreate} className="bg-admin-wine hover:bg-admin-wine/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Walkthrough
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-admin-wine/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-admin-wine" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalWalkthroughs}</p>
                  <p className="text-sm text-muted-foreground">Total Walkthroughs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeWalkthroughs}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalParticipants}</p>
                  <p className="text-sm text-muted-foreground">Active Learners</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCompletions}</p>
                  <p className="text-sm text-muted-foreground">Completions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center bg-card rounded-lg border p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search walkthroughs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tracks</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="textile">Textile</SelectItem>
                <SelectItem value="jewelry">Jewelry</SelectItem>
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="insane">Insane</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[300px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("title")} className="gap-1 -ml-3">
                    Walkthrough
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Track</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("xp_reward")} className="gap-1 -ml-3">
                    XP
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Modules</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={8}>
                      <div className="h-12 bg-muted/50 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredWalkthroughs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No walkthroughs found</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={handleCreate}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first walkthrough
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredWalkthroughs?.map((walkthrough) => {
                  const steps = Array.isArray(walkthrough.steps) ? walkthrough.steps : [];
                  const stats = progressStats?.[walkthrough.id] || { total: 0, completed: 0 };
                  
                  return (
                    <TableRow key={walkthrough.id} className="group hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-admin-wine/10 flex items-center justify-center relative">
                            <BookOpen className="h-5 w-5 text-admin-wine" />
                            {walkthrough.is_featured && (
                              <Star className="h-3 w-3 text-amber-500 fill-amber-500 absolute -top-1 -right-1" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{walkthrough.title}</p>
                              {walkthrough.version && walkthrough.version > 1 && (
                                <Badge variant="outline" className="text-xs">
                                  v{walkthrough.version}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[250px]">
                              {walkthrough.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={categoryColors[walkthrough.category]}>
                          {walkthrough.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={difficultyColors[walkthrough.difficulty]}>
                          {walkthrough.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{walkthrough.xp_reward}</span>
                        <span className="text-muted-foreground text-xs ml-1">XP</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{steps.length}</span>
                        <span className="text-muted-foreground text-xs ml-1">steps</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{stats.total}</span>
                          {stats.completed > 0 && (
                            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                              {stats.completed} done
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[walkthrough.status]}>
                          {walkthrough.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleEdit(walkthrough)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewProgressWalkthrough(walkthrough)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => duplicateMutation.mutate(walkthrough)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Clone
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => toggleFeaturedMutation.mutate({ 
                                id: walkthrough.id, 
                                featured: !walkthrough.is_featured 
                              })}
                            >
                              <Star className="h-4 w-4 mr-2" />
                              {walkthrough.is_featured ? "Unfeature" : "Feature"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {walkthrough.status === "archived" ? (
                              <DropdownMenuItem onClick={() => restoreMutation.mutate(walkthrough.id)}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Restore
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => setDeleteWalkthrough(walkthrough)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Archive Confirmation Dialog */}
        <AlertDialog open={!!deleteWalkthrough} onOpenChange={() => setDeleteWalkthrough(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archive Walkthrough</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to archive "{deleteWalkthrough?.title}"? 
                Users will no longer be able to start this walkthrough, but existing progress will be preserved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteWalkthrough && archiveMutation.mutate(deleteWalkthrough.id)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Archive
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Walkthrough Modal */}
        <WalkthroughModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          walkthrough={editingWalkthrough}
        />

        {/* Progress Modal */}
        {viewProgressWalkthrough && (
          <WalkthroughProgressModal
            open={!!viewProgressWalkthrough}
            onOpenChange={() => setViewProgressWalkthrough(null)}
            walkthrough={viewProgressWalkthrough}
          />
        )}
      </div>
    </AdminLayout>
  );
}
