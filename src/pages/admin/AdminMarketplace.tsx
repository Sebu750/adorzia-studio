import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  Plus, 
  Search,
  Store,
  Users,
  FolderOpen
} from "lucide-react";
import { AdminProductsTable } from "@/components/admin/marketplace/AdminProductsTable";
import { AdminProductForm } from "@/components/admin/marketplace/AdminProductForm";
import { AdminOrdersTable } from "@/components/admin/marketplace/AdminOrdersTable";
import { AdminCategoriesManager } from "@/components/admin/marketplace/AdminCategoriesManager";
import AdminCollectionsContent from "@/components/admin/marketplace/AdminCollectionsContent"; // Import the collections content component
import { useAdminProductStats } from "@/hooks/useAdminProducts";

const AdminMarketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const { data: stats } = useAdminProductStats();

  // Check URL params to set initial tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['all', 'adorzia', 'vendor', 'pending', 'orders', 'categories', 'collections'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  const handleEditProduct = (productId: string) => {
    setEditingProductId(productId);
    setIsProductFormOpen(true);
  };

  const handleCloseProductForm = () => {
    setIsProductFormOpen(false);
    setEditingProductId(null);
  };

  const statCards = [
    { 
      title: "Total Products", 
      value: stats?.totalProducts || 0, 
      icon: Package,
      color: "text-blue-500"
    },
    { 
      title: "Live Products", 
      value: stats?.liveProducts || 0, 
      icon: TrendingUp,
      color: "text-green-500"
    },
    { 
      title: "Pending Review", 
      value: stats?.pendingReview || 0, 
      icon: Clock,
      color: "text-amber-500"
    },
    { 
      title: "Vendor Products", 
      value: stats?.vendorProducts || 0, 
      icon: Users,
      color: "text-purple-500"
    },
  ];

  const getFiltersForTab = () => {
    const base = searchQuery ? { search: searchQuery } : {};
    switch (activeTab) {
      case "adorzia":
        return { ...base, is_adorzia_product: true };
      case "vendor":
        return { ...base, is_adorzia_product: false };
      case "pending":
        return { ...base, status: "pending_review" };
      default:
        return base;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-admin-foreground">Marketplace</h1>
            <p className="text-admin-muted-foreground">Manage products, orders, categories, and collections</p>
          </div>
          <Button onClick={() => setIsProductFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="bg-admin-card border-admin-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-admin-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-admin-foreground">{stat.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg bg-admin-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList className="bg-admin-muted">
              <TabsTrigger value="all" className="data-[state=active]:bg-admin-card">
                All Products
              </TabsTrigger>
              <TabsTrigger value="adorzia" className="data-[state=active]:bg-admin-card">
                <Store className="h-4 w-4 mr-2" />
                Adorzia
              </TabsTrigger>
              <TabsTrigger value="vendor" className="data-[state=active]:bg-admin-card">
                <Users className="h-4 w-4 mr-2" />
                Vendor
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-admin-card">
                Pending
                {(stats?.pendingReview || 0) > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                    {stats?.pendingReview}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-admin-card">
                Orders
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-admin-card">
                Categories
              </TabsTrigger>
              <TabsTrigger value="collections" className="data-[state=active]:bg-admin-card">
                <FolderOpen className="h-4 w-4 mr-2" />
                Collections
              </TabsTrigger>
            </TabsList>

            {activeTab !== "orders" && activeTab !== "categories" && activeTab !== "collections" && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
          </div>

          <TabsContent value="all" className="mt-0">
            <AdminProductsTable filters={getFiltersForTab()} onEdit={handleEditProduct} />
          </TabsContent>

          <TabsContent value="adorzia" className="mt-0">
            <AdminProductsTable filters={getFiltersForTab()} onEdit={handleEditProduct} />
          </TabsContent>

          <TabsContent value="vendor" className="mt-0">
            <AdminProductsTable filters={getFiltersForTab()} onEdit={handleEditProduct} />
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            <AdminProductsTable filters={getFiltersForTab()} onEdit={handleEditProduct} />
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <AdminOrdersTable />
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <AdminCategoriesManager />
          </TabsContent>

          <TabsContent value="collections" className="mt-0">
            <AdminCollectionsContent />
          </TabsContent>
        </Tabs>

        {/* Product Form Dialog */}
        <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProductId ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <AdminProductForm 
              onSuccess={handleCloseProductForm}
              onCancel={handleCloseProductForm}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminMarketplace;