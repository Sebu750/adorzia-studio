<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
=======
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
<<<<<<< HEAD
  Users,
  Package, 
  FolderOpen,
  ShoppingCart,
  Tags,
  Plus
=======
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  Plus, 
  Search,
  Store,
  Users
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
} from "lucide-react";
import { AdminProductsTable } from "@/components/admin/marketplace/AdminProductsTable";
import { AdminProductForm } from "@/components/admin/marketplace/AdminProductForm";
import { AdminOrdersTable } from "@/components/admin/marketplace/AdminOrdersTable";
import { AdminCategoriesManager } from "@/components/admin/marketplace/AdminCategoriesManager";
<<<<<<< HEAD
import AdminMarketplaceCollections from "@/components/admin/marketplace/AdminMarketplaceCollections";
import { AdminDesignersManager } from "@/components/admin/marketplace/AdminDesignersManager";

type TabType = 'designers' | 'products' | 'collections' | 'orders' | 'categories';

const AdminMarketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Fetch quick stats for the header
  const { data: stats } = useQuery({
    queryKey: ['admin-marketplace-quick-stats'],
    queryFn: async () => {
      const [
        { count: totalDesigners },
        { count: totalProducts },
        { count: liveProducts },
        { count: totalCollections },
        { count: pendingOrders }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).not('name', 'is', null),
        supabase.from('marketplace_products').select('*', { count: 'exact', head: true }),
        supabase.from('marketplace_products').select('*', { count: 'exact', head: true }).eq('status', 'live'),
        supabase.from('marketplace_collections').select('*', { count: 'exact', head: true }),
        supabase.from('marketplace_orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      return {
        totalDesigners: totalDesigners || 0,
        totalProducts: totalProducts || 0,
        liveProducts: liveProducts || 0,
        totalCollections: totalCollections || 0,
        pendingOrders: pendingOrders || 0,
      };
    },
  });

  // Initialize tab from URL params on mount and when URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType | null;
    if (tabParam && ['designers', 'products', 'collections', 'orders', 'categories'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
    setSearchParams({ tab: value });
  };
=======
import { useAdminProductStats } from "@/hooks/useAdminProducts";

const AdminMarketplace = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const { data: stats } = useAdminProductStats();
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

  const handleEditProduct = (productId: string) => {
    setEditingProductId(productId);
    setIsProductFormOpen(true);
  };

  const handleCloseProductForm = () => {
    setIsProductFormOpen(false);
    setEditingProductId(null);
  };

<<<<<<< HEAD
  const handleAddProduct = () => {
    setEditingProductId(null);
    setIsProductFormOpen(true);
  };

  const statCards = [
    { 
      label: "Designers", 
      value: stats?.totalDesigners || 0, 
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      label: "Products", 
      value: stats?.totalProducts || 0, 
      sublabel: `${stats?.liveProducts || 0} live`,
      icon: Package,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    { 
      label: "Collections", 
      value: stats?.totalCollections || 0, 
      icon: FolderOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    { 
      label: "Pending Orders", 
      value: stats?.pendingOrders || 0, 
      icon: ShoppingCart,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Header with Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-admin-foreground">Marketplace</h1>
            <p className="text-sm text-admin-muted-foreground mt-1">
              Manage designers, products, collections and orders
            </p>
          </div>
          
          {/* Compact Stats Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="flex items-center gap-2 px-3 py-2 bg-admin-card border border-admin-border/60 rounded-lg"
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.color} ${stat.bgColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-admin-foreground leading-none">{stat.value}</p>
                    <p className="text-[10px] text-admin-muted-foreground uppercase tracking-wider">
                      {stat.label}
                      {stat.sublabel && <span className="ml-1 text-success">({stat.sublabel})</span>}
                    </p>
                  </div>
                </div>
              );
            })}
            
            <Button 
              onClick={handleAddProduct}
              className="bg-admin-foreground text-admin-background hover:bg-admin-foreground/90 transition-all rounded-lg h-10 px-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="bg-admin-muted/60 p-1 rounded-xl h-auto flex-wrap gap-1">
            <TabsTrigger 
              value="designers" 
              className="data-[state=active]:bg-admin-card data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 text-sm font-medium transition-all gap-2"
            >
              <Users className="h-4 w-4" />
              Designers
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="data-[state=active]:bg-admin-card data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 text-sm font-medium transition-all gap-2"
            >
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="collections" 
              className="data-[state=active]:bg-admin-card data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 text-sm font-medium transition-all gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-admin-card data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 text-sm font-medium transition-all gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
              {(stats?.pendingOrders || 0) > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-warning/20 text-warning">
                  {stats?.pendingOrders}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="data-[state=active]:bg-admin-card data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 text-sm font-medium transition-all gap-2"
            >
              <Tags className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="designers" className="mt-0">
            <AdminDesignersManager />
          </TabsContent>

          <TabsContent value="products" className="mt-0">
            <AdminProductsTable onEdit={handleEditProduct} />
          </TabsContent>

          <TabsContent value="collections" className="mt-0">
            <AdminMarketplaceCollections />
=======
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
            <p className="text-admin-muted-foreground">Manage products, orders, and categories</p>
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
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
            </TabsList>

            {activeTab !== "orders" && activeTab !== "categories" && (
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <AdminOrdersTable />
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <AdminCategoriesManager />
          </TabsContent>
        </Tabs>
<<<<<<< HEAD
      </div>

      {/* Product Form Dialog */}
      <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-admin-card border-admin-border/60 rounded-xl">
          <DialogHeader className="pb-4 border-b border-admin-border/50">
            <DialogTitle className="text-lg font-semibold text-admin-foreground">
              {editingProductId ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <AdminProductForm 
            onSuccess={handleCloseProductForm}
            onCancel={handleCloseProductForm}
          />
        </DialogContent>
      </Dialog>
=======

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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    </AdminLayout>
  );
};

export default AdminMarketplace;
