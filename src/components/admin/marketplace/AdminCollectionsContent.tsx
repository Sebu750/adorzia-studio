import { useState, useMemo, useCallback } from "react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Package,
  Store,
  Users,
  FileSearch,
  RefreshCw,
  Tag,
  X
} from "lucide-react";
import { CollectionManagementModal } from "@/components/admin/CollectionManagementModal";

interface Designer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  category: string;
  rank: string;
  rank_name: string;
  subscription: string;
  status: string;
  completedStyleboxes: number;
  publishedItems: number;
  revenue: number;
  joinedAt: string;
}

interface CollectionItem {
  id: string;
  type: 'product' | 'article';
  title: string;
  designer_id: string;
  designer_name: string;
  price: number;
  category: string;
  status: 'draft' | 'live' | 'archived' | 'published';
  inventory_count: number;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  // For products
  is_made_to_order?: boolean;
  is_limited_edition?: boolean;
  edition_size?: number;
  // For articles
  is_featured?: boolean;
}

const AdminCollectionsContent = () => {
  const [editingItem, setEditingItem] = useState<{ id: string; type: 'product' | 'article' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [designerFilter, setDesignerFilter] = useState('all-designers');
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'products' | 'articles'>('all');
  const [statusFilter, setStatusFilter] = useState('all-status');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: keyof CollectionItem; direction: 'asc' | 'desc' } | null>(null);

  // Fetch all content (products and articles) with error handling
  const { data: content = [], isLoading: contentLoading, refetch: refetchContent, isError: contentError } = useQuery({
    queryKey: ['admin-collections-full'],
    queryFn: async () => {
      try {
        // Fetch products separately first
        const { data: products, error: productsError } = await supabase
          .from('marketplace_products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) {
          console.error('Products fetch error:', productsError);
          throw productsError;
        }

        // Fetch articles separately
        const { data: articles, error: articlesError } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (articlesError) {
          console.error('Articles fetch error:', articlesError);
          throw articlesError;
        }

        // Fetch designer profiles separately to avoid join issues
        const designerIds = [
          ...(products?.map(p => p.designer_id) || []),
          ...(articles?.map(a => a.author_id) || [])
        ].filter(Boolean);
        
        let designersMap: Record<string, any> = {};
        if (designerIds.length > 0) {
          const uniqueDesignerIds = [...new Set(designerIds)];
          const { data: designerProfiles, error: designersError } = await supabase
            .from('profiles')
            .select('user_id, name')
            .in('user_id', uniqueDesignerIds);

          if (designersError) {
            console.error('Designer profiles fetch error:', designersError);
            // Continue without designer names if this fails
          } else {
            designersMap = designerProfiles?.reduce((acc, profile) => {
              acc[profile.user_id] = profile;
              return acc;
            }, {}) || {};
          }
        }

        // Combine and format both content types
        const formattedProducts = products?.map(item => ({
          id: item.id,
          type: 'product' as const,
          title: item.title,
          designer_id: item.designer_id,
          designer_name: designersMap[item.designer_id]?.name || "Unknown Designer",
          price: parseFloat(item.price?.toString() || '0'), // Convert decimal to number with fallback
          category: item.category_id || "General", // Using category_id from products table
          status: item.status,
          inventory_count: item.inventory_count || 0,
          created_at: item.created_at,
          updated_at: item.updated_at,
          image_url: item.images && Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null,
          is_made_to_order: item.is_made_to_order || false,
          is_limited_edition: item.is_limited_edition || false,
          edition_size: item.edition_size || undefined
        })) || [];

        const formattedArticles = articles?.map(item => ({
          id: item.id,
          type: 'article' as const,
          title: item.title,
          designer_id: item.author_id,
          designer_name: designersMap[item.author_id]?.name || "Unknown Author",
          price: 0, // Articles don't have price
          category: item.category || "General",
          status: item.status as 'draft' | 'published' | 'archived',
          inventory_count: 0, // Articles don't have stock
          created_at: item.created_at,
          updated_at: item.updated_at,
          image_url: item.featured_image,
          is_featured: item.is_featured || false
        })) || [];

        // Combine both arrays
        return [...formattedProducts, ...formattedArticles];
      } catch (error) {
        console.error('Error fetching content:', error);
        throw error;
      }
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
  });

  // Fetch all designers with error handling
  const { data: designers = [], isLoading: designersLoading, refetch: refetchDesigners, isError: designersError } = useQuery({
    queryKey: ['admin-designers-full'],
    queryFn: async () => {
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('name');

        if (profilesError) {
          console.error('Profiles fetch error:', profilesError);
          // Return empty array instead of throwing to prevent complete failure
          return [];
        }

        if (!profiles || profiles.length === 0) {
          return []; // Return empty array if no profiles found
        }

        return profiles.map(profile => ({
          id: profile.user_id,
          name: profile.name || "Unknown",
          email: profile.email || "No email",
          avatar: profile.avatar_url,
          category: profile.category,
          rank: profile.founder_tier === 'f1' ? 'f1' : profile.founder_tier === 'f2' ? 'f2' : profile.rank_id ? 'f1' : 'apprentice',
          rank_name: profile.founder_tier === 'f1' ? 'F1 - Founding Legacy' : profile.founder_tier === 'f2' ? 'F2 - The Pioneer' : "Apprentice",
          subscription: profile.subscription_tier,
          status: profile.status,
          completedStyleboxes: 0, // Placeholder - would need to fetch from submissions
          publishedItems: 0, // Placeholder - would need to fetch from submissions
          revenue: 0, // Placeholder - would need to fetch from earnings
          joinedAt: new Date(profile.created_at).toLocaleDateString()
        }));
      } catch (error) {
        console.error('Error in admin designers query:', error);
        // Return empty array instead of throwing to prevent complete failure
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });

  // Combined loading and error states
  const isLoading = contentLoading || designersLoading;
  // Don't show error state if we have data, even if there were transient errors
  const hasError = (contentError || designersError) && content.length === 0 && designers.length === 0 && !isLoading;

  // Apply filters and search
  const filteredContent = useMemo(() => {
    let result = content;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.designer_name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    }

    // Apply designer filter
    if (designerFilter !== 'all-designers') {
      result = result.filter(item => item.designer_id === designerFilter);
    }

    // Apply content type filter
    if (contentTypeFilter !== 'all') {
      if (contentTypeFilter === 'products') {
        result = result.filter(item => item.type === 'product');
      } else if (contentTypeFilter === 'articles') {
        result = result.filter(item => item.type === 'article');
      }
    }

    // Apply status filter
    if (statusFilter !== 'all-status') {
      result = result.filter(item => {
        if (statusFilter === 'published') {
          return item.status === 'live' || item.status === 'published';
        } else if (statusFilter === 'draft') {
          return item.status === 'draft';
        } else if (statusFilter === 'archived') {
          return item.status === 'archived';
        }
        return true;
      });
    }

    // Apply sorting
    if (sortConfig !== null) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [content, searchTerm, designerFilter, contentTypeFilter, statusFilter, sortConfig]);

  // Pagination
  const paginatedContent = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContent.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContent, currentPage, itemsPerPage]);

  // Handle sorting
  const handleSort = (key: keyof CollectionItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetchContent();
    refetchDesigners();
  }, [refetchContent, refetchDesigners]);

  // Handle edit
  const handleEditContent = useCallback((item: any) => {
    setEditingItem({ id: item.id, type: item.type });
    setIsModalOpen(true);
  }, []);

  // Handle add new
  const handleAddContent = useCallback(() => {
    // Pass the currently selected designer ID if not "all-designers"
    const selectedDesignerId = designerFilter !== 'all-designers' ? designerFilter : undefined;
    setEditingItem(null);
    setIsModalOpen(true);
  }, [designerFilter]);

  // Handle delete
  const { mutate: deleteContent, isLoading: isDeleting } = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: 'product' | 'article' }) => {
      if (type === 'product') {
        const { error } = await supabase
          .from('marketplace_products')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      refetchContent();
    }
  });

  // Handle status toggle
  const { mutate: toggleStatusMutation } = useMutation({
    mutationFn: async ({ id, type, newStatus }: { id: string; type: 'product' | 'article'; newStatus: string }) => {
      if (type === 'product') {
        const { error } = await supabase
          .from('marketplace_products')
          .update({ status: newStatus })
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .update({ status: newStatus })
          .eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      refetchContent();
    }
  });

  // Handle modal success
  const handleModalSuccess = useCallback(() => {
    refetchContent();
    setIsModalOpen(false);
    setEditingItem(null);
  }, [refetchContent]);

  // Get sort indicator for column header
  const getSortIndicator = (columnName: keyof CollectionItem) => {
    if (!sortConfig || sortConfig.key !== columnName) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (hasError) {
    return (
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-6 flex items-center gap-3">
            <FileSearch className="h-5 w-5 text-destructive" />
            <div>
              <h3 className="font-medium text-destructive">Error Loading Collections</h3>
              <p className="text-sm text-destructive/80">There was an issue loading the collections data. Please try refreshing.</p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleRefresh}
              className="ml-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>
          <p className="text-sm text-muted-foreground">
            Manage products and articles from all designers
          </p>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddContent}>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: "Designer",
            value: designerFilter,
            onChange: setDesignerFilter,
            options: [
              { value: 'all-designers', label: 'All Designers' },
              ...designers.map(d => ({ value: d.id, label: d.name }))
            ]
          },
          {
            label: "Type",
            value: contentTypeFilter,
            onChange: (value: any) => setContentTypeFilter(value),
            options: [
              { value: 'all', label: 'All Types' },
              { value: 'products', label: 'Products' },
              { value: 'articles', label: 'Articles' }
            ]
          },
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'all-status', label: 'All Statuses' },
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived' }
            ]
          }
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Items</p>
                <p className="text-xl font-bold text-blue-900">{content.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Store className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Published</p>
                <p className="text-xl font-bold text-green-900">
                  {content.filter(c => c.status === 'live' || c.status === 'published').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-amber-600 font-medium">Designers</p>
                <p className="text-xl font-bold text-amber-900">{designers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <FileSearch className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Products</p>
                <p className="text-xl font-bold text-purple-900">
                  {content.filter(c => c.type === 'product').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Table */}
      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle>Content ({filteredContent.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading collections...</span>
            </div>
          ) : filteredContent.length === 0 ? (
            <EmptyState
              title="No collections found"
              description="There are no collections matching your current filters"
              action={
                <Button onClick={handleAddContent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="w-[300px] cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('title')}
                      >
                        Title {getSortIndicator('title')}
                      </TableHead>
                      <TableHead 
                        onClick={() => handleSort('designer_name')}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        Designer {getSortIndicator('designer_name')}
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead 
                        onClick={() => handleSort('created_at')}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        Date {getSortIndicator('created_at')}
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedContent.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium max-w-xs truncate">
                          <div className="flex items-center gap-3">
                            {item.image_url ? (
                              <img 
                                src={item.image_url} 
                                alt={item.title} 
                                className="w-10 h-10 rounded object-cover"
                              />
                            ) : (
                              <div className="bg-muted rounded w-10 h-10 flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <div className="truncate max-w-[200px]">
                              {item.title}
                              {item.type === 'product' && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.is_made_to_order && (
                                    <Badge variant="secondary" className="text-xs">Made to Order</Badge>
                                  )}
                                  {item.is_limited_edition && (
                                    <Badge variant="secondary" className="text-xs">
                                      Limited Edition {item.edition_size ? `(#${item.edition_size})` : ''}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={item.image_url || ""} />
                              <AvatarFallback>{item.designer_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{item.designer_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.type === 'product' ? 'default' : 'secondary'}>
                            {item.type === 'product' ? 'Product' : 'Article'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              (item.status === 'live' || item.status === 'published') ? 'default' : 
                              item.status === 'draft' ? 'secondary' : 
                              'destructive'
                            }
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.type === 'product' ? `$${item.price.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell>
                          {new Date(item.created_at).toLocaleDateString()}
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
                              <DropdownMenuItem 
                                onClick={() => handleEditContent(item)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  const newStatus = item.status === 'live' || item.status === 'published' 
                                    ? (item.type === 'product' ? 'draft' : 'draft') 
                                    : (item.type === 'product' ? 'live' : 'published');
                                  
                                  toggleStatusMutation.mutate({ 
                                    id: item.id, 
                                    type: item.type, 
                                    newStatus 
                                  });
                                }}
                                className="focus:bg-warning/10 focus:text-warning"
                              >
                                {(item.type === 'product' && item.status === 'live') || (item.type === 'article' && item.status === 'published') ? (
                                  <>
                                    <Tag className="h-4 w-4 mr-2.5" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Tag className="h-4 w-4 mr-2.5" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => deleteContent({ id: item.id, type: item.type })}
                                className="text-destructive focus:text-destructive"
                                disabled={isDeleting}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <TablePagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredContent.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                totalItems={filteredContent.length}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Collection Management Modal */}
      <CollectionManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collectionType={editingItem?.type || 'product'}
        collectionId={editingItem?.id}
        designerId={editingItem ? undefined : designerFilter !== 'all-designers' ? designerFilter : undefined}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default AdminCollectionsContent;