import { useState, useMemo, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";
import { FilterBar } from "@/components/admin/FilterBar";
import { EmptyState } from "@/components/admin/EmptyState";
import { TablePagination } from "@/components/admin/TablePagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  FolderOpen,
  Star,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  X,
  Loader2,
  Upload,
  Package,
  Check
} from "lucide-react";
import { AdminBulkActionsBar } from "./AdminBulkActionsBar";
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

interface Designer {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}

interface MarketplaceCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  designer_id: string | null;
  created_at: string;
  updated_at: string;
  product_count?: number;
  designer_name?: string;
}

interface CollectionFormData {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  designer_id: string;
}

const AdminMarketplaceCollections = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<MarketplaceCollection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [designerFilter, setDesignerFilter] = useState('all-designers');
  const [statusFilter, setStatusFilter] = useState('all-status');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: keyof MarketplaceCollection; direction: 'asc' | 'desc' } | null>(null);
  
  // Product management modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedCollectionForProducts, setSelectedCollectionForProducts] = useState<MarketplaceCollection | null>(null);
  
  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CollectionFormData>({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    is_featured: false,
    is_active: true,
    designer_id: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch collections with designer info
  const { data: collections = [], isLoading: collectionsLoading, refetch: refetchCollections } = useQuery({
    queryKey: ['admin-marketplace-collections'],
    queryFn: async () => {
      const { data: collectionsData, error } = await supabase
        .from('marketplace_collections')
        .select(`
          *,
          collection_products:marketplace_collection_products(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get designer IDs from collections that have them
      const designerIds = collectionsData
        ?.filter(c => c.designer_id)
        .map(c => c.designer_id) || [];

      // Fetch designer profiles if there are any designer IDs
      let designersMap: Record<string, Designer> = {};
      if (designerIds.length > 0) {
        const uniqueIds = [...new Set(designerIds)];
        const { data: designersData } = await supabase
          .from('profiles')
          .select('user_id, name, email, avatar_url')
          .in('user_id', uniqueIds);

        designersMap = designersData?.reduce((acc, d) => {
          acc[d.user_id] = d;
          return acc;
        }, {} as Record<string, Designer>) || {};
      }

      return collectionsData?.map(collection => ({
        ...collection,
        product_count: collection.collection_products?.[0]?.count || 0,
        designer_name: collection.designer_id ? designersMap[collection.designer_id]?.name : null
      })) || [];
    }
  });

  // Fetch designers for the dropdown
  const { data: designers = [], isLoading: designersLoading } = useQuery({
    queryKey: ['admin-designers-for-collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, name, email, avatar_url')
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: CollectionFormData & { id?: string }) => {
      const collectionData = {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        image_url: data.image_url || null,
        is_featured: data.is_featured,
        is_active: data.is_active,
        designer_id: data.designer_id || null
      };

      if (data.id) {
        const { error } = await supabase
          .from('marketplace_collections')
          .update(collectionData)
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('marketplace_collections')
          .insert([collectionData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace-collections'] });
      toast({ title: `Collection ${editingCollection ? 'updated' : 'created'} successfully` });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: `Error ${editingCollection ? 'updating' : 'creating'} collection`, 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('marketplace_collections')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace-collections'] });
      toast({ title: "Collection deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting collection", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('marketplace_collections')
        .delete()
        .in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace-collections'] });
      toast({ title: `Successfully deleted ${selectedIds.size} collections` });
      setSelectedIds(new Set());
      setBulkDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting collections", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('marketplace_collections')
        .update({ is_active: isActive })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace-collections'] });
    }
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      const { error } = await supabase
        .from('marketplace_collections')
        .update({ is_featured: isFeatured })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace-collections'] });
    }
  });

  // Fetch products for a collection - using separate queries to avoid join issues
  const { data: collectionProducts = [], isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ['collection-products', selectedCollectionForProducts?.id],
    queryFn: async () => {
      if (!selectedCollectionForProducts?.id) return [];
      
      // First, get the collection product relationships
      const { data: cpData, error: cpError } = await supabase
        .from('marketplace_collection_products')
        .select('id, product_id, position')
        .eq('collection_id', selectedCollectionForProducts.id)
        .order('position', { ascending: true });
      
      if (cpError) {
        console.error('Collection products error:', cpError);
        throw cpError;
      }
      
      if (!cpData || cpData.length === 0) return [];
      
      // Then fetch the actual products
      const productIds = cpData.map(cp => cp.product_id);
      const { data: productsData, error: productsError } = await supabase
        .from('marketplace_products')
        .select('id, title, price, images, status, designer_id')
        .in('id', productIds);
      
      if (productsError) {
        console.error('Products error:', productsError);
        throw productsError;
      }
      
      // Combine the data
      return cpData.map(cp => ({
        id: cp.id,
        product_id: cp.product_id,
        position: cp.position,
        marketplace_products: productsData?.find(p => p.id === cp.product_id) || null
      }));
    },
    enabled: !!selectedCollectionForProducts?.id
  });

  // Fetch all available products for adding to collection
  const { data: availableProducts = [], isLoading: availableProductsLoading } = useQuery({
    queryKey: ['available-products-for-collection', selectedCollectionForProducts?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_products')
        .select('id, title, price, images, status, designer_id')
        .eq('status', 'live')
        .order('title', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: isProductModalOpen
  });

  // Add product to collection mutation
  const addProductToCollectionMutation = useMutation({
    mutationFn: async ({ collectionId, productId }: { collectionId: string; productId: string }) => {
      // Get the max position
      const { data: maxPosData } = await supabase
        .from('marketplace_collection_products')
        .select('position')
        .eq('collection_id', collectionId)
        .order('position', { ascending: false })
        .limit(1);
      
      const nextPosition = (maxPosData?.[0]?.position || 0) + 1;
      
      const { error } = await supabase
        .from('marketplace_collection_products')
        .insert([{ collection_id: collectionId, product_id: productId, position: nextPosition }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace-collections'] });
      toast({ title: "Product added to collection" });
    },
    onError: (error: any) => {
      toast({ title: "Error adding product", description: error.message, variant: "destructive" });
    }
  });

  // Remove product from collection mutation
  const removeProductFromCollectionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('marketplace_collection_products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace-collections'] });
      toast({ title: "Product removed from collection" });
    },
    onError: (error: any) => {
      toast({ title: "Error removing product", description: error.message, variant: "destructive" });
    }
  });

  // Image upload handler - uses stylebox-curation-assets bucket
  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      setIsUploadingImage(true);
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please select an image smaller than 5MB", variant: "destructive" });
        return null;
      }
      
      // Get current user for the upload path to satisfy RLS policy
      const { data: { user } } = await supabase.auth.getUser();
      
      let userIdForPath;
      if (user) {
        userIdForPath = user.id;
      } else if (formData.designer_id) {
        // In admin context, use the selected designer's ID
        userIdForPath = formData.designer_id;
      } else {
        throw new Error('Cannot determine user for upload path');
      }
      
      // Generate unique filename with user ID as folder prefix
      const fileExt = file.name.split('.').pop();
      const fileName = `collection_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${userIdForPath}/collections/${fileName}`;
      
      // Try uploading to collection-files bucket
      const { error: uploadError } = await supabase.storage
        .from('collection-files')
        .upload(filePath, file, { 
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        // If bucket doesn't exist or upload fails, use URL input instead
        toast({ 
          title: "Upload failed", 
          description: "Please use the URL input field instead or check storage bucket permissions.", 
          variant: "destructive" 
        });
        return null;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('collection-files')
        .getPublicUrl(filePath);
      
      if (!data?.publicUrl) {
        throw new Error('Could not generate public URL for uploaded image');
      }
      
      toast({ title: "Image uploaded successfully" });
      return data.publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ title: "Error uploading image", description: error.message || "Upload failed", variant: "destructive" });
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImagePreview = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openProductModal = (collection: MarketplaceCollection) => {
    setSelectedCollectionForProducts(collection);
    setIsProductModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      is_featured: false,
      is_active: true,
      designer_id: ''
    });
    setEditingCollection(null);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenModal = (collection?: MarketplaceCollection) => {
    if (collection) {
      setEditingCollection(collection);
      setFormData({
        name: collection.name,
        slug: collection.slug,
        description: collection.description || '',
        image_url: collection.image_url || '',
        is_featured: collection.is_featured,
        is_active: collection.is_active,
        designer_id: collection.designer_id || ''
      });
      // Set image preview for existing collection image
      if (collection.image_url) {
        setImagePreview(collection.image_url);
      }
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Upload image if a new file is selected
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }
      
      await saveMutation.mutateAsync({
        ...formData,
        image_url: finalImageUrl,
        id: editingCollection?.id
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingCollection ? prev.slug : generateSlug(name)
    }));
  };

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked && filteredCollections) {
      setSelectedIds(new Set(filteredCollections.map(c => c.id)));
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

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    bulkDeleteMutation.mutate(Array.from(selectedIds));
  };

  // Filter and sort collections
  const filteredCollections = useMemo(() => {
    let result = [...collections];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.designer_name?.toLowerCase().includes(term)
      );
    }

    if (designerFilter !== 'all-designers') {
      if (designerFilter === 'no-designer') {
        result = result.filter(c => !c.designer_id);
      } else {
        result = result.filter(c => c.designer_id === designerFilter);
      }
    }

    if (statusFilter !== 'all-status') {
      if (statusFilter === 'active') {
        result = result.filter(c => c.is_active);
      } else if (statusFilter === 'inactive') {
        result = result.filter(c => !c.is_active);
      } else if (statusFilter === 'featured') {
        result = result.filter(c => c.is_featured);
      }
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [collections, searchTerm, designerFilter, statusFilter, sortConfig]);

  const isAllSelected = filteredCollections.length > 0 && selectedIds.size === filteredCollections.length;

  const paginatedCollections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCollections.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCollections, currentPage, itemsPerPage]);

  const handleSort = (key: keyof MarketplaceCollection) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof MarketplaceCollection) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const isLoading = collectionsLoading || designersLoading;

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search collections..."
          filters={[
            {
              placeholder: "Designer",
              value: designerFilter,
              onChange: setDesignerFilter,
              options: [
                { value: 'all-designers', label: 'All Designers' },
                { value: 'no-designer', label: 'No Designer (General)' },
                ...designers.map(d => ({ value: d.user_id, label: d.name || d.email }))
              ]
            },
            {
              placeholder: "Status",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'all-status', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'featured', label: 'Featured' }
              ]
            }
          ]}
        />
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetchCollections()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Collection
          </Button>
        </div>
      </div>

      {/* Collections Table */}
      <Card className="border-admin-border/60 bg-admin-card">
        <CardHeader className="px-6 py-4">
          <CardTitle>Collections ({filteredCollections.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading collections...</span>
            </div>
          ) : filteredCollections.length === 0 ? (
            <EmptyState
              title="No collections found"
              description="There are no collections matching your current filters"
              action={
                <Button onClick={() => handleOpenModal()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Collection
                </Button>
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead 
                        className="w-[250px] cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('name')}
                      >
                        Collection {getSortIndicator('name')}
                      </TableHead>
                      <TableHead>Designer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('created_at')}
                      >
                        Created {getSortIndicator('created_at')}
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCollections.map((collection) => {
                      const isSelected = selectedIds.has(collection.id);
                      return (
                      <TableRow key={collection.id} className={isSelected ? 'bg-muted/20' : ''}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectOne(collection.id, !!checked)}
                            aria-label={`Select ${collection.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {collection.image_url ? (
                              <img 
                                src={collection.image_url} 
                                alt={collection.name} 
                                className="w-12 h-12 rounded object-cover"
                              />
                            ) : (
                              <div className="bg-muted rounded w-12 h-12 flex items-center justify-center">
                                <FolderOpen className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{collection.name}</p>
                              <p className="text-xs text-muted-foreground">/{collection.slug}</p>
                              {collection.is_featured && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {collection.designer_id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{collection.designer_name || 'Unknown'}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">General Collection</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <Badge 
                              variant={collection.is_active ? 'default' : 'secondary'}
                              className="w-fit cursor-pointer"
                              onClick={() => toggleStatusMutation.mutate({ 
                                id: collection.id, 
                                isActive: !collection.is_active 
                              })}
                            >
                              {collection.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {collection.product_count || 0} products
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(collection.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenModal(collection)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openProductModal(collection)}>
                                <Package className="h-4 w-4 mr-2" />
                                Manage Products
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => toggleFeaturedMutation.mutate({ 
                                  id: collection.id, 
                                  isFeatured: !collection.is_featured 
                                })}
                              >
                                <Star className="h-4 w-4 mr-2" />
                                {collection.is_featured ? 'Unfeature' : 'Feature'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this collection?')) {
                                    deleteMutation.mutate(collection.id);
                                  }
                                }}
                                className="text-destructive focus:text-destructive"
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

              <TablePagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredCollections.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                totalItems={filteredCollections.length}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Collection Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCollection ? 'Edit Collection' : 'Create New Collection'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Collection Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Summer Essentials 2024"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="summer-essentials-2024"
                required
              />
              <p className="text-xs text-muted-foreground">
                This will be used in the URL: /shop/collections/{formData.slug || 'your-slug'}
              </p>
            </div>

            {/* Designer Selection */}
            <div className="space-y-2">
              <Label htmlFor="designer">Assign to Designer</Label>
              <Select
                value={formData.designer_id || "no-designer"}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  designer_id: value === "no-designer" ? "" : value 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a designer (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-designer">General Collection (No Designer)</SelectItem>
                  {designers.map(designer => (
                    <SelectItem key={designer.user_id} value={designer.user_id}>
                      {designer.name || designer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Assign this collection to a specific designer, or leave as general collection
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this collection..."
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Collection Image</Label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload image</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 5MB (JPG, PNG, WebP)</p>
                  </div>
                  
                  {/* URL input as alternative */}
                  <div className="mt-3">
                    <Label className="text-xs text-muted-foreground">Or enter image URL</Label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, image_url: e.target.value }));
                        if (e.target.value && !imageFile) {
                          setImagePreview(e.target.value);
                        }
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-32 w-32 rounded-lg object-cover border"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                        // Show a fallback div when image fails to load
                        const fallback = img.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="h-32 w-32 rounded-lg border bg-muted hidden items-center justify-center text-center p-2"
                      style={{ display: 'none' }}
                    >
                      <span className="text-xs text-muted-foreground">Image unavailable</span>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={removeImagePreview}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Status Toggles */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Make this collection visible in the store
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_featured">Featured</Label>
                  <p className="text-xs text-muted-foreground">
                    Highlight this collection on the homepage
                  </p>
                </div>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting || isUploadingImage}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploadingImage}>
                {isSubmitting || isUploadingImage ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isUploadingImage ? 'Uploading...' : 'Saving...'}
                  </>
                ) : editingCollection ? (
                  'Update Collection'
                ) : (
                  'Create Collection'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Product Management Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Products - {selectedCollectionForProducts?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Products in Collection */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Products in Collection ({collectionProducts.length})</h3>
              {productsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : collectionProducts.length === 0 ? (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <Package className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No products in this collection yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {collectionProducts.map((cp: any) => {
                    const product = cp.marketplace_products;
                    const images = product?.images as string[] | null;
                    return (
                      <div key={cp.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        {images?.[0] ? (
                          <img src={images[0]} alt={product?.title} className="h-12 w-12 rounded object-cover" />
                        ) : (
                          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product?.title || 'Unknown Product'}</p>
                          <p className="text-xs text-muted-foreground">${product?.price?.toFixed(2) || '0.00'}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeProductFromCollectionMutation.mutate(cp.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add Products */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Add Products</h3>
              {availableProductsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {availableProducts
                    .filter((p: any) => !collectionProducts.some((cp: any) => cp.product_id === p.id))
                    .map((product: any) => {
                      const images = product.images as string[] | null;
                      return (
                        <div 
                          key={product.id} 
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => {
                            if (selectedCollectionForProducts) {
                              addProductToCollectionMutation.mutate({
                                collectionId: selectedCollectionForProducts.id,
                                productId: product.id
                              });
                            }
                          }}
                        >
                          {images?.[0] ? (
                            <img src={images[0]} alt={product.title} className="h-10 w-10 rounded object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product.title}</p>
                            <p className="text-xs text-muted-foreground">${product.price?.toFixed(2) || '0.00'}</p>
                          </div>
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      );
                    })}
                </div>
              )}
              {availableProducts.filter((p: any) => !collectionProducts.some((cp: any) => cp.product_id === p.id)).length === 0 && !availableProductsLoading && (
                <div className="text-center py-6 bg-muted/30 rounded-lg">
                  <Check className="h-6 w-6 mx-auto text-green-500 mb-2" />
                  <p className="text-sm text-muted-foreground">All available products are already in this collection</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Bar */}
      <AdminBulkActionsBar
        selectedCount={selectedIds.size}
        onDelete={handleBulkDelete}
        onClearSelection={() => setSelectedIds(new Set())}
        entityType="collections"
        isDeleting={bulkDeleteMutation.isPending}
      />

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedIds.size} Collections
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} selected collections? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending ? "Deleting..." : "Delete All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMarketplaceCollections;
