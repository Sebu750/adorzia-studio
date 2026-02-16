<<<<<<< HEAD
import { useState, useMemo } from "react";
=======
import { useState } from "react";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  Check, 
  X, 
<<<<<<< HEAD
  Package,
  Search,
  Filter,
  Plus
=======
  Package 
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
} from "lucide-react";
import { 
  useAdminProducts, 
  useApproveProduct, 
  useRejectProduct, 
  useDeleteProduct,
  type AdminProductFilters 
} from "@/hooks/useAdminProducts";
<<<<<<< HEAD
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
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
<<<<<<< HEAD
import { useToast } from "@/hooks/use-toast";
import { AdminBulkActionsBar } from "./AdminBulkActionsBar";
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

interface AdminProductsTableProps {
  filters?: AdminProductFilters;
  onEdit?: (productId: string) => void;
}

const statusVariants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  pending_review: { label: "Pending Review", variant: "outline" },
  live: { label: "Live", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  archived: { label: "Archived", variant: "secondary" },
};

<<<<<<< HEAD
type StatusFilter = 'all' | 'draft' | 'live' | 'archived';

export function AdminProductsTable({ filters, onEdit }: AdminProductsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [designerFilter, setDesignerFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Build filters
  const combinedFilters: AdminProductFilters = {
    ...filters,
    ...(searchQuery && { search: searchQuery }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(designerFilter !== 'all' && { designer_id: designerFilter }),
  };

  const { data: products, isLoading } = useAdminProducts(combinedFilters);
  const approveProduct = useApproveProduct();
  const rejectProduct = useRejectProduct();
  const deleteProduct = useDeleteProduct();

  // Fetch all designers for filter dropdown
  const { data: allDesigners } = useQuery({
    queryKey: ["admin-all-designers-filter"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, name, brand_name")
        .not("name", "is", null)
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch designer information for displayed products
  const designerIds = products?.map(p => p.designer_id).filter(Boolean) || [];
  const { data: designers } = useQuery({
    queryKey: ["admin-product-designers", designerIds],
    queryFn: async () => {
      if (designerIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, name, brand_name, avatar_url")
        .in("user_id", designerIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: designerIds.length > 0,
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from("marketplace_products")
        .delete()
        .in("id", ids);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: `Successfully deleted ${selectedIds.size} products` });
      setSelectedIds(new Set());
      setBulkDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete products", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Bulk status update mutation
  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      const { error } = await supabase
        .from("marketplace_products")
        .update({ status })
        .in("id", ids);
      
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: `Successfully updated ${selectedIds.size} products to ${status}` });
      setSelectedIds(new Set());
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update products", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && products) {
      setSelectedIds(new Set(products.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };
=======
export function AdminProductsTable({ filters, onEdit }: AdminProductsTableProps) {
  const { data: products, isLoading } = useAdminProducts(filters);
  const approveProduct = useApproveProduct();
  const rejectProduct = useRejectProduct();
  const deleteProduct = useDeleteProduct();
  const [deleteId, setDeleteId] = useState<string | null>(null);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProduct.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

<<<<<<< HEAD
  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    bulkDeleteMutation.mutate(Array.from(selectedIds));
  };

  const handleBulkActivate = () => {
    bulkStatusMutation.mutate({ ids: Array.from(selectedIds), status: 'live' });
  };

  const handleBulkDeactivate = () => {
    bulkStatusMutation.mutate({ ids: Array.from(selectedIds), status: 'draft' });
  };

  const isAllSelected = products && products.length > 0 && selectedIds.size === products.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < (products?.length || 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Filter Bar Skeleton */}
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 max-w-sm rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
        {/* Table Skeleton */}
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
=======
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No products found</h3>
        <p className="text-sm text-muted-foreground">
          {filters?.status ? `No products with status "${filters.status}"` : "Start by adding your first product"}
        </p>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-muted-foreground/60" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-admin-card border-admin-border/60 rounded-lg focus:ring-2 focus:ring-admin-foreground/10 text-admin-foreground"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-[130px] h-10 bg-admin-card border-admin-border/60 rounded-lg">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-admin-card border-admin-border/60 rounded-lg">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Designer Filter */}
        <Select value={designerFilter} onValueChange={setDesignerFilter}>
          <SelectTrigger className="w-[180px] h-10 bg-admin-card border-admin-border/60 rounded-lg">
            <SelectValue placeholder="All Designers" />
          </SelectTrigger>
          <SelectContent className="bg-admin-card border-admin-border/60 rounded-lg max-h-60">
            <SelectItem value="all">All Designers</SelectItem>
            {allDesigners?.map((designer) => (
              <SelectItem key={designer.user_id} value={designer.user_id}>
                {designer.brand_name || designer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {!products?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-admin-muted/30 rounded-xl border border-admin-border/50 border-dashed">
          <div className="h-14 w-14 rounded-xl bg-admin-muted/60 flex items-center justify-center mb-4">
            <Package className="h-7 w-7 text-admin-muted-foreground/50" />
          </div>
          <h3 className="text-base font-semibold text-admin-foreground">No products found</h3>
          <p className="text-sm text-admin-muted-foreground mt-1 max-w-xs">
            {searchQuery || statusFilter !== 'all' || designerFilter !== 'all'
              ? "Try adjusting your search or filters"
              : "Start by adding your first product to the marketplace"}
          </p>
        </div>
      ) : (
        <div className="border border-admin-border/60 rounded-xl overflow-hidden bg-admin-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-admin-muted/50 hover:bg-admin-muted/50">
                <TableHead className="w-[50px] py-4">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className="data-[state=checked]:bg-admin-foreground data-[state=checked]:border-admin-foreground"
                  />
                </TableHead>
                <TableHead className="w-[60px] text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground py-4">Image</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground py-4">Product</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground py-4">Designer</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground py-4">Price</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground py-4">Stock</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground py-4">Status</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-wider text-admin-muted-foreground py-4">Created</TableHead>
                <TableHead className="w-[50px] py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const images = product.images as string[] | null;
                const statusInfo = statusVariants[product.status] || statusVariants.draft;
                const designer = designers?.find(d => d.user_id === product.designer_id);
                const isSelected = selectedIds.has(product.id);

                return (
                  <TableRow 
                    key={product.id} 
                    className={`transition-colors hover:bg-admin-muted/30 border-b border-admin-border/50 last:border-b-0 ${isSelected ? 'bg-admin-muted/20' : ''}`}
                  >
                    <TableCell className="py-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectOne(product.id, !!checked)}
                        aria-label={`Select ${product.title}`}
                        className="data-[state=checked]:bg-admin-foreground data-[state=checked]:border-admin-foreground"
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-10 w-10 rounded-lg bg-admin-muted/60 overflow-hidden border border-admin-border/30">
                        {images?.[0] ? (
                          <img 
                            src={images[0]} 
                            alt={product.title} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-admin-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-semibold text-admin-foreground text-sm truncate max-w-[200px]">{product.title}</div>
                      {product.sku && (
                        <div className="text-xs text-admin-muted-foreground/70 mt-0.5">SKU: {product.sku}</div>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      {product.designer_id && designer ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 rounded-md border border-admin-border/30">
                            <AvatarImage src={designer.avatar_url || undefined} />
                            <AvatarFallback className="rounded-md bg-admin-muted text-[10px] font-semibold">
                              {designer.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-admin-foreground truncate max-w-[100px]">
                            {designer.brand_name || designer.name}
                          </span>
                        </div>
                      ) : product.is_adorzia_product ? (
                        <Badge variant="default" className="bg-admin-foreground text-admin-background text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          Adorzia
                        </Badge>
                      ) : (
                        <span className="text-xs text-admin-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-semibold text-admin-foreground text-sm">
                        ${product.sale_price || product.price}
                      </div>
                      {product.sale_price && (
                        <div className="text-xs text-admin-muted-foreground/60 line-through">
                          ${product.price}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={product.inventory_count === 0 ? "text-destructive font-semibold text-sm" : "text-sm text-admin-foreground font-medium"}>
                        {product.inventory_count ?? "∞"}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant={statusInfo.variant} 
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                      >
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-admin-muted-foreground/80 py-4">
                      {formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-admin-muted text-admin-muted-foreground hover:text-admin-foreground transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-admin-card border-admin-border/60 rounded-xl shadow-lg p-1.5 min-w-[160px]">
                          <DropdownMenuItem onClick={() => onEdit?.(product.id)} className="rounded-lg cursor-pointer py-2 px-2.5 text-sm focus:bg-admin-muted">
                            <Pencil className="h-4 w-4 mr-2.5 text-admin-muted-foreground" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer py-2 px-2.5 text-sm focus:bg-admin-muted">
                            <Eye className="h-4 w-4 mr-2.5 text-admin-muted-foreground" />
                            View on Store
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-admin-border/50 my-1.5" />
                          {(product.status as string) === "pending_review" && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => approveProduct.mutate(product.id)}
                                className="rounded-lg cursor-pointer py-2 px-2.5 text-sm text-success focus:text-success focus:bg-success/10"
                              >
                                <Check className="h-4 w-4 mr-2.5" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => rejectProduct.mutate(product.id)}
                                className="rounded-lg cursor-pointer py-2 px-2.5 text-sm text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <X className="h-4 w-4 mr-2.5" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-admin-border/50 my-1.5" />
                            </>
                          )}
                          <DropdownMenuItem 
                            onClick={() => setDeleteId(product.id)}
                            className="rounded-lg cursor-pointer py-2 px-2.5 text-sm text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-2.5" />
                            Delete
                          </DropdownMenuItem>
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

      {/* Bulk Actions Bar */}
      <AdminBulkActionsBar
        selectedCount={selectedIds.size}
        onDelete={handleBulkDelete}
        onActivate={handleBulkActivate}
        onDeactivate={handleBulkDeactivate}
        onClearSelection={() => setSelectedIds(new Set())}
        entityType="products"
        isDeleting={bulkDeleteMutation.isPending}
      />

      {/* Single Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-admin-card border-admin-border/60 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-admin-foreground">Delete Product</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-admin-muted-foreground">
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-lg border-admin-border/60 hover:bg-admin-muted transition-colors">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg">
=======
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-admin-muted/50">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const images = product.images as string[] | null;
              const statusInfo = statusVariants[product.status] || statusVariants.draft;

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded-md bg-muted overflow-hidden">
                      {images?.[0] ? (
                        <img 
                          src={images[0]} 
                          alt={product.title} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{product.title}</div>
                    {product.sku && (
                      <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.is_adorzia_product ? (
                      <Badge variant="default" className="bg-primary">Adorzia</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Vendor
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ${product.sale_price || product.price}
                    </div>
                    {product.sale_price && (
                      <div className="text-xs text-muted-foreground line-through">
                        ${product.price}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={product.inventory_count === 0 ? "text-destructive font-medium" : ""}>
                      {product.inventory_count ?? "∞"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(product.id)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View on Store
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {(product.status as string) === "pending_review" && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => approveProduct.mutate(product.id)}
                              className="text-green-600"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => rejectProduct.mutate(product.id)}
                              className="text-destructive"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem 
                          onClick={() => setDeleteId(product.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
<<<<<<< HEAD

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent className="bg-admin-card border-admin-border/60 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-admin-foreground">
              Delete {selectedIds.size} Products
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-admin-muted-foreground">
              Are you sure you want to delete {selectedIds.size} selected products? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-lg border-admin-border/60 hover:bg-admin-muted transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg"
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending ? "Deleting..." : "Delete All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
=======
    </>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  );
}
