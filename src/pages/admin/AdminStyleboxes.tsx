import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Box,
  Sparkles,
  Users
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
<<<<<<< HEAD
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
=======
import { supabase } from "@/integrations/supabase/client";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { useToast } from "@/hooks/use-toast";
import { StyleboxWizard } from "@/components/admin/stylebox-wizard/StyleboxWizard";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Stylebox = Database["public"]["Tables"]["styleboxes"]["Row"];
type StyleboxInsert = Database["public"]["Tables"]["styleboxes"]["Insert"];

const difficultyColors: Record<string, string> = {
<<<<<<< HEAD
  free: "bg-success/20 text-success border-success/30",
=======
  free: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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

export default function AdminStyleboxes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStylebox, setEditingStylebox] = useState<Stylebox | null>(null);
  const [deleteStylebox, setDeleteStylebox] = useState<Stylebox | null>(null);

  // Fetch styleboxes
  const { data: styleboxes, isLoading } = useQuery({
    queryKey: ["admin-styleboxes", categoryFilter, difficultyFilter, statusFilter, sortField, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from("styleboxes")
        .select("*")
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

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("styleboxes")
        .update({ status: "archived" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-styleboxes"] });
      toast({
        title: "StyleBox archived",
        description: "The StyleBox has been archived successfully.",
      });
      setDeleteStylebox(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to archive StyleBox. Please try again.",
        variant: "destructive",
      });
<<<<<<< HEAD
=======
      console.error(error);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    },
  });

  // Duplicate mutation
  const duplicateMutation = useMutation({
    mutationFn: async (stylebox: Stylebox) => {
      const newStylebox: StyleboxInsert = {
        title: `${stylebox.title} (Copy)`,
        description: stylebox.description,
        category: stylebox.category,
        difficulty: stylebox.difficulty,
        xp_reward: stylebox.xp_reward,
        brief: stylebox.brief,
        deliverables: stylebox.deliverables,
        status: "draft",
      };
      const { error } = await supabase.from("styleboxes").insert(newStylebox);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-styleboxes"] });
      toast({
        title: "StyleBox duplicated",
        description: "A copy has been created as a draft.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to duplicate StyleBox.",
        variant: "destructive",
      });
<<<<<<< HEAD
=======
      console.error(error);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    },
  });

  // Export to CSV
  const exportToCSV = () => {
    if (!styleboxes) return;
    
    const headers = ["Title", "Category", "Difficulty", "XP", "Status", "Created At"];
    const rows = styleboxes.map(s => [
      s.title,
      s.category,
      s.difficulty,
      s.xp_reward?.toString() || "0",
      s.status,
      format(new Date(s.created_at), "yyyy-MM-dd"),
    ]);
    
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `styleboxes-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export complete",
      description: "StyleBoxes exported to CSV successfully.",
    });
  };

  // Filter by search
  const filteredStyleboxes = styleboxes?.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleEdit = (stylebox: Stylebox) => {
    setEditingStylebox(stylebox);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingStylebox(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <Box className="h-6 w-6 text-admin-camel" />
              StyleBox Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Create, edit, and manage all creative challenges
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleCreate} className="bg-admin-wine hover:bg-admin-wine/90">
              <Plus className="h-4 w-4 mr-2" />
              Add StyleBox
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center bg-card rounded-lg border p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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
                <SelectItem value="free">Free</SelectItem>
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

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{styleboxes?.length || 0}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-success">
              {styleboxes?.filter(s => s.status === "active").length || 0}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Team Challenges</p>
            <p className="text-2xl font-bold text-purple-500">
              {styleboxes?.filter(s => s.is_team_challenge).length || 0}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Fashion</p>
            <p className="text-2xl font-bold text-purple-600">
              {styleboxes?.filter(s => s.category === "fashion").length || 0}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Textile</p>
            <p className="text-2xl font-bold text-teal-600">
              {styleboxes?.filter(s => s.category === "textile").length || 0}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Jewelry</p>
            <p className="text-2xl font-bold text-pink-600">
              {styleboxes?.filter(s => s.category === "jewelry").length || 0}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[300px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("title")} className="gap-1 -ml-3">
                    Title
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("difficulty")} className="gap-1 -ml-3">
                    Difficulty
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("xp_reward")} className="gap-1 -ml-3">
                    XP
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("created_at")} className="gap-1 -ml-3">
                    Created
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <div className="h-12 bg-muted/50 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredStyleboxes?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Box className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No StyleBoxes found</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={handleCreate}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first StyleBox
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStyleboxes?.map((stylebox) => (
                  <TableRow key={stylebox.id} className="group hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-admin-wine/10 flex items-center justify-center relative">
                          <Sparkles className="h-5 w-5 text-admin-wine" />
                          {stylebox.is_team_challenge && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center">
                              <Users className="h-2.5 w-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{stylebox.title}</p>
                            {stylebox.is_team_challenge && (
                              <Badge variant="secondary" className="text-[10px] px-1 py-0 bg-purple-500/20 text-purple-400 border-purple-500/30">
                                Team
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                            {stylebox.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={categoryColors[stylebox.category]}>
                        {stylebox.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={difficultyColors[stylebox.difficulty]}>
                        {stylebox.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{stylebox.xp_reward}</span>
                      <span className="text-muted-foreground text-xs ml-1">XP</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[stylebox.status]}>
                        {stylebox.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(stylebox.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleEdit(stylebox)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateMutation.mutate(stylebox)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setDeleteStylebox(stylebox)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination info */}
        {filteredStyleboxes && filteredStyleboxes.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            Showing {filteredStyleboxes.length} of {styleboxes?.length} StyleBoxes
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <StyleboxWizard
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        stylebox={editingStylebox}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteStylebox} onOpenChange={() => setDeleteStylebox(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive StyleBox?</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive "{deleteStylebox?.title}" and hide it from designers. 
              You can restore it later by changing its status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteStylebox && deleteMutation.mutate(deleteStylebox.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
