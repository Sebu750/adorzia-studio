import { useState } from "react";
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
  Package 
} from "lucide-react";
import { 
  useAdminProducts, 
  useApproveProduct, 
  useRejectProduct, 
  useDeleteProduct,
  type AdminProductFilters 
} from "@/hooks/useAdminProducts";
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

export function AdminProductsTable({ filters, onEdit }: AdminProductsTableProps) {
  const { data: products, isLoading } = useAdminProducts(filters);
  const approveProduct = useApproveProduct();
  const rejectProduct = useRejectProduct();
  const deleteProduct = useDeleteProduct();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProduct.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

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
      </div>
    );
  }

  return (
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
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
