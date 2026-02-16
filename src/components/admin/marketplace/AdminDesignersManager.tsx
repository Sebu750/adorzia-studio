import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Search, 
  Grid3X3, 
  List, 
  Users,
  MoreHorizontal,
  Eye,
  Pencil,
  Package,
  FolderOpen,
  CheckCircle,
  XCircle,
  Ban,
  Instagram,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AdminDesignerCard, type Designer } from "./AdminDesignerCard";
import { AdminDesignerProfileDrawer } from "./AdminDesignerProfileDrawer";

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'active' | 'inactive' | 'suspended';
type SortOption = 'name_asc' | 'name_desc' | 'products_desc' | 'collections_desc' | 'newest';

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-admin-muted text-admin-muted-foreground border-admin-border/50',
  },
  suspended: {
    label: 'Suspended',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function AdminDesignersManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name_asc');
  const [selectedDesignerId, setSelectedDesignerId] = useState<string | null>(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    designerId: string;
    designerName: string;
    newStatus: 'active' | 'inactive' | 'suspended';
  } | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch designers with product and collection counts
  const { data: designers, isLoading } = useQuery({
    queryKey: ['admin-designers-list', searchQuery, statusFilter, sortOption],
    queryFn: async () => {
      // Fetch all profiles with names
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, name, brand_name, avatar_url, bio, email, instagram_handle, website_url, created_at')
        .not('name', 'is', null);

      if (profilesError) throw profilesError;
      if (!profiles || profiles.length === 0) return [];

      // Fetch product counts for each designer
      const designersWithCounts = await Promise.all(
        profiles.map(async (profile) => {
          const [{ count: productCount }, { count: collectionCount }] = await Promise.all([
            supabase
              .from('marketplace_products')
              .select('*', { count: 'exact', head: true })
              .eq('designer_id', profile.user_id),
            supabase
              .from('marketplace_collections')
              .select('*', { count: 'exact', head: true })
              .eq('designer_id', profile.user_id),
          ]);

          return {
            user_id: profile.user_id,
            name: profile.name || 'Unknown',
            brand_name: profile.brand_name,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            email: profile.email,
            instagram_handle: profile.instagram_handle,
            website_url: profile.website_url,
            created_at: profile.created_at,
            status: 'active' as const, // Default status
            product_count: productCount || 0,
            collection_count: collectionCount || 0,
          } as Designer;
        })
      );

      // Apply search filter
      let filtered = designersWithCounts;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(d => 
          d.name.toLowerCase().includes(query) ||
          d.brand_name?.toLowerCase().includes(query) ||
          d.email?.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(d => d.status === statusFilter);
      }

      // Apply sorting
      switch (sortOption) {
        case 'name_asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'products_desc':
          filtered.sort((a, b) => b.product_count - a.product_count);
          break;
        case 'collections_desc':
          filtered.sort((a, b) => b.collection_count - a.collection_count);
          break;
        case 'newest':
          filtered.sort((a, b) => {
            if (!a.created_at || !b.created_at) return 0;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
          break;
      }

      return filtered;
    },
  });

  // Status change mutation (for future backend implementation)
  const statusChangeMutation = useMutation({
    mutationFn: async ({ designerId, status }: { designerId: string; status: string }) => {
      // Note: This would need a backend function or profiles table update
      // For now, we'll just show a toast
      console.log('Status change:', designerId, status);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-designers-list'] });
      toast({ title: "Designer status updated successfully" });
      setStatusChangeDialog(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update status", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleViewDesigner = (designerId: string) => {
    setSelectedDesignerId(designerId);
    setIsProfileDrawerOpen(true);
  };

  const handleEditDesigner = (designerId: string) => {
    // For now, just open the profile drawer
    // Could open an edit modal in the future
    handleViewDesigner(designerId);
  };

  const handleStatusChange = (designerId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    const designer = designers?.find(d => d.user_id === designerId);
    if (designer) {
      setStatusChangeDialog({
        designerId,
        designerName: designer.name,
        newStatus,
      });
    }
  };

  const confirmStatusChange = () => {
    if (statusChangeDialog) {
      statusChangeMutation.mutate({
        designerId: statusChangeDialog.designerId,
        status: statusChangeDialog.newStatus,
      });
    }
  };

  const handleViewProducts = (designerId: string) => {
    // TODO: Navigate to products filtered by designer
    toast({ title: "View products feature coming soon" });
  };

  const handleViewCollections = (designerId: string) => {
    // TODO: Navigate to collections filtered by designer
    toast({ title: "View collections feature coming soon" });
  };

  const getStatusDialogContent = () => {
    if (!statusChangeDialog) return null;
    
    const statusMessages = {
      active: {
        title: 'Activate Designer',
        description: `Are you sure you want to activate ${statusChangeDialog.designerName}? They will be able to manage their products and collections.`,
        actionLabel: 'Activate',
        actionClass: 'bg-success hover:bg-success/90',
      },
      inactive: {
        title: 'Deactivate Designer',
        description: `Are you sure you want to deactivate ${statusChangeDialog.designerName}? Their products will be hidden from the marketplace.`,
        actionLabel: 'Deactivate',
        actionClass: 'bg-admin-foreground hover:bg-admin-foreground/90',
      },
      suspended: {
        title: 'Suspend Designer',
        description: `Are you sure you want to suspend ${statusChangeDialog.designerName}? This will hide their products and prevent them from logging in.`,
        actionLabel: 'Suspend',
        actionClass: 'bg-destructive hover:bg-destructive/90',
      },
    };

    return statusMessages[statusChangeDialog.newStatus];
  };

  const dialogContent = getStatusDialogContent();

 return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-muted-foreground/60" />
            <Input
              placeholder="Search designers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-admin-card border-admin-border/60 rounded-lg focus:ring-2 focus:ring-admin-foreground/10 text-admin-foreground"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-[140px] h-10 bg-admin-card border-admin-border/60 rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-admin-card border-admin-border/60 rounded-lg">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
            <SelectTrigger className="w-[160px] h-10 bg-admin-card border-admin-border/60 rounded-lg">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-admin-card border-admin-border/60 rounded-lg">
              <SelectItem value="name_asc">Name A-Z</SelectItem>
              <SelectItem value="name_desc">Name Z-A</SelectItem>
              <SelectItem value="products_desc">Most Products</SelectItem>
              <SelectItem value="collections_desc">Most Collections</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center border border-admin-border/60 rounded-lg overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className={cn(
              "h-10 w-10 rounded-none",
              viewMode === 'grid' 
                ? "bg-admin-foreground text-admin-background" 
                : "hover:bg-admin-muted text-admin-muted-foreground"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            className={cn(
              "h-10 w-10 rounded-none",
              viewMode === 'list' 
                ? "bg-admin-foreground text-admin-background" 
                : "hover:bg-admin-muted text-admin-muted-foreground"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        )
      ) : !designers || designers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-admin-muted/30 rounded-xl border border-admin-border/50 border-dashed">
          <div className="h-14 w-14 rounded-xl bg-admin-muted/60 flex items-center justify-center mb-4">
            <Users className="h-7 w-7 text-admin-muted-foreground/50" />
          </div>
          <h3 className="text-base font-semibold text-admin-foreground">No designers found</h3>
          <p className="text-sm text-admin-muted-foreground mt-1 max-w-xs">
            {searchQuery || statusFilter !== 'all' 
              ? "Try adjusting your search or filters" 
              : "Designers will appear here once they join the marketplace"}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {designers.map((designer) => (
            <AdminDesignerCard
              key={designer.user_id}
              designer={designer}
              onView={() => handleViewDesigner(designer.user_id)}
              onEdit={() => handleEditDesigner(designer.user_id)}
              onStatusChange={(status) => handleStatusChange(designer.user_id, status)}
              onViewProducts={() => handleViewProducts(designer.user_id)}
              onViewCollections={() => handleViewCollections(designer.user_id)}
            />
          ))}
        </div>
      ) : (
        <div className="border border-admin-border/60 rounded-xl overflow-hidden bg-admin-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-admin-muted/50 hover:bg-admin-muted/50">
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground py-4">Designer</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground py-4">Products</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground py-4">Collections</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground py-4">Status</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground py-4">Social</TableHead>
                <TableHead className="w-[50px] py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {designers.map((designer) => {
                const statusInfo = statusConfig[designer.status];
                const initials = designer.name
                  ?.split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || '??';

                return (
                  <TableRow 
                    key={designer.user_id} 
                    className="transition-colors hover:bg-admin-muted/30 border-b border-admin-border/50 last:border-b-0"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-lg border border-admin-border/30">
                          <AvatarImage src={designer.avatar_url || undefined} alt={designer.name} />
                          <AvatarFallback className="rounded-lg bg-admin-muted text-admin-foreground font-semibold text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-admin-foreground text-sm">{designer.name}</p>
                          {designer.brand_name && (
                            <p className="text-xs text-admin-muted-foreground">@{designer.brand_name}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Package className="h-3.5 w-3.5 text-admin-muted-foreground" />
                        <span className="font-medium text-admin-foreground">{designer.product_count}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-sm">
                        <FolderOpen className="h-3.5 w-3.5 text-admin-muted-foreground" />
                        <span className="font-medium text-admin-foreground">{designer.collection_count}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant="outline" 
                        className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", statusInfo.className)}
                      >
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5">
                        {designer.instagram_handle && (
                          <a 
                            href={`https://instagram.com/${designer.instagram_handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-7 w-7 rounded-lg bg-admin-muted/60 flex items-center justify-center text-admin-muted-foreground hover:text-admin-foreground hover:bg-admin-muted transition-colors"
                          >
                            <Instagram className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {designer.website_url && (
                          <a 
                            href={designer.website_url.startsWith('http') ? designer.website_url : `https://${designer.website_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-7 w-7 rounded-lg bg-admin-muted/60 flex items-center justify-center text-admin-muted-foreground hover:text-admin-foreground hover:bg-admin-muted transition-colors"
                          >
                            <Globe className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-admin-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-admin-card border-admin-border/60 rounded-xl shadow-lg p-1.5 min-w-[160px]">
                          <DropdownMenuItem onClick={() => handleViewDesigner(designer.user_id)} className="rounded-lg cursor-pointer py-2 px-2.5 text-sm focus:bg-admin-muted">
                            <Eye className="h-4 w-4 mr-2.5 text-admin-muted-foreground" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditDesigner(designer.user_id)} className="rounded-lg cursor-pointer py-2 px-2.5 text-sm focus:bg-admin-muted">
                            <Pencil className="h-4 w-4 mr-2.5 text-admin-muted-foreground" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-admin-border/50 my-1.5" />
                          {designer.status !== 'active' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(designer.user_id, 'active')}
                              className="rounded-lg cursor-pointer py-2 px-2.5 text-sm text-success focus:text-success focus:bg-success/10"
                            >
                              <CheckCircle className="h-4 w-4 mr-2.5" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          {designer.status !== 'inactive' && designer.status !== 'suspended' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(designer.user_id, 'inactive')}
                              className="rounded-lg cursor-pointer py-2 px-2.5 text-sm focus:bg-admin-muted"
                            >
                              <XCircle className="h-4 w-4 mr-2.5" />
                              Deactivate
                            </DropdownMenuItem>
                          )}
                          {designer.status !== 'suspended' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(designer.user_id, 'suspended')}
                              className="rounded-lg cursor-pointer py-2 px-2.5 text-sm text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Ban className="h-4 w-4 mr-2.5" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Profile Drawer */}
      <AdminDesignerProfileDrawer
        designerId={selectedDesignerId}
        open={isProfileDrawerOpen}
        onClose={() => {
          setIsProfileDrawerOpen(false);
          setSelectedDesignerId(null);
        }}
        onStatusChange={handleStatusChange}
      />

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={!!statusChangeDialog} onOpenChange={() => setStatusChangeDialog(null)}>
        <AlertDialogContent className="bg-admin-card border-admin-border/60 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-admin-foreground">
              {dialogContent?.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-admin-muted-foreground">
              {dialogContent?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-lg border-admin-border/60 hover:bg-admin-muted transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStatusChange} 
              className={cn("rounded-lg text-white", dialogContent?.actionClass)}
            >
              {dialogContent?.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
