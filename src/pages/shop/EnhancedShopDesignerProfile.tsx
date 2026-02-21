import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Grid, 
  List, 
  Heart, 
  ShoppingBag, 
  Star, 
  Filter,
  Search,
  ChevronLeft,
  ArrowUpRight,
  Eye,
  ShoppingCart,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatCurrency } from "@/lib/marketplace-math";
import { getProductImage, generateSrcSet } from "@/lib/cdn-image";
import { toast } from "sonner";

interface Designer {
  user_id: string;
  name: string;
  brand_name: string | null;
  avatar_url: string | null;
  banner_image: string | null;
  bio: string | null;
  category: string | null;
  location: string | null;
  xp: number | null;
  is_featured: boolean | null;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  product_count: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  sale_price: number | null;
  images: string[];
  is_bestseller: boolean;
  is_featured: boolean;
  is_made_to_order: boolean;
  is_limited_edition: boolean;
  edition_size: number | null;
  average_rating: number;
  review_count: number;
  slug: string | null;
  created_at: string;
}

export default function EnhancedShopDesignerProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "rating">("newest");

  // Fetch designer profile
  const { data: designer, isLoading: designerLoading } = useQuery({
    queryKey: ['enhanced-designer-profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, name, brand_name, avatar_url, banner_image, bio, category, location, xp, is_featured')
        .eq('user_id', id)
        .not('name', 'is', null)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Fetch collections
  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ['designer-collections', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_collections')
        .select(`
          id,
          name,
          slug,
          description,
          image_url,
          is_featured,
          collection_products:marketplace_collection_products(count)
        `)
        .eq('designer_id', id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(collection => ({
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        image_url: collection.image_url,
        is_featured: collection.is_featured,
        product_count: collection.collection_products?.[0]?.count || 0
      })) || [];
    },
    enabled: !!id
  });

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['designer-products', id, selectedCollection, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('marketplace_products')
        .select('*')
        .eq('designer_id', id)
        .eq('status', 'live');

      if (selectedCollection) {
        query = query.eq('collection_id', selectedCollection);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('average_rating', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  // Filter products based on search
  const filteredProducts = products?.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const isLoading = designerLoading || collectionsLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-96 bg-muted"></div>
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="h-96 bg-muted rounded"></div>
              <div className="md:col-span-3 space-y-6">
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">👤</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Designer Not Found</h1>
          <p className="text-muted-foreground mb-6">The designer you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/shop/designers">Browse Designers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const brandName = designer.brand_name || designer.name;
  const displayName = designer.brand_name ? `${designer.brand_name} by ${designer.name}` : designer.name;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-96 overflow-hidden">
        {designer.banner_image ? (
          <img
            src={designer.banner_image}
            alt={`${brandName} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button variant="secondary" size="sm" asChild className="gap-2">
            <Link to="/shop/designers">
              <ChevronLeft className="h-4 w-4" />
              All Designers
            </Link>
          </Button>
        </div>

        {/* Designer Info */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-6"
            >
              {designer.avatar_url && (
                <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-background">
                  <img
                    src={designer.avatar_url}
                    alt={designer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {brandName}
                </h1>
                {designer.brand_name && (
                  <p className="text-lg text-muted-foreground">by {designer.name}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {designer.category && (
                    <Badge variant="secondary">{designer.category}</Badge>
                  )}
                  {designer.location && (
                    <span className="text-sm text-muted-foreground">{designer.location}</span>
                  )}
                  {designer.is_featured && (
                    <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured Designer
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Collections */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* About Section */}
              {designer.bio && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">About</h3>
                    <p className="text-sm text-muted-foreground">{designer.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Collections */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Collections</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCollection(null)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        !selectedCollection 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      All Products
                      <span className="text-xs text-muted-foreground ml-2">
                        ({products?.length || 0})
                      </span>
                    </button>
                    {collections?.map((collection) => (
                      <button
                        key={collection.id}
                        onClick={() => setSelectedCollection(collection.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCollection === collection.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {collection.name}
                        <span className="text-xs text-muted-foreground ml-2">
                          ({collection.product_count})
                        </span>
                        {collection.is_featured && (
                          <Star className="h-3 w-3 text-yellow-500 inline ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedCollection 
                    ? collections?.find(c => c.id === selectedCollection)?.name || 'Collection'
                    : 'All Products'
                  }
                </h2>
                <p className="text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
                
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border rounded-md text-sm bg-background"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                
                {/* View Toggle */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none border-r"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? "Try adjusting your search terms" 
                    : "This designer hasn't added any products yet"
                  }
                </p>
              </div>
            ) : (
              <motion.div
                layout
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-4"
                }
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      isInWishlist={isInWishlist(product.id)}
                      onAddToCart={addItem}
                      onToggleWishlist={() => toggleWishlist(product.id)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  viewMode, 
  isInWishlist, 
  onAddToCart, 
  onToggleWishlist 
}: { 
  product: Product; 
  viewMode: "grid" | "list";
  isInWishlist: boolean;
  onAddToCart: (productId: string, quantity: number) => Promise<void>;
  onToggleWishlist: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const displayPrice = product.sale_price || product.price;
  const hasDiscount = !!product.sale_price && product.sale_price < product.price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onAddToCart(product.id, 1);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex gap-6 p-6 border rounded-lg hover:shadow-md transition-shadow"
      >
        <div className="relative w-32 h-32 flex-shrink-0">
          <img
            src={getProductImage(product.images[0], 'thumbnail')}
            alt={product.title}
            className="w-full h-full object-cover rounded-md"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse rounded-md"></div>
          )}
          {product.is_featured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white text-xs">
              Featured
            </Badge>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg mb-2">{product.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="font-medium text-foreground">{formatCurrency(displayPrice)}</span>
                {hasDiscount && (
                  <span className="line-through text-muted-foreground">
                    {formatCurrency(product.price)}
                  </span>
                )}
                {product.average_rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.average_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleWishlist}
                className={isInWishlist ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
              </Button>
              <Button size="sm" onClick={handleAddToCart} className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {product.is_bestseller && (
              <Badge variant="default">Bestseller</Badge>
            )}
            {product.is_made_to_order && (
              <Badge variant="secondary">Made to Order</Badge>
            )}
            {product.is_limited_edition && (
              <Badge variant="destructive">Limited Edition</Badge>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={getProductImage(product.images[0], 'card')}
            srcSet={generateSrcSet(product.images[0])}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? "scale-105" : ""
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse"></div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2">
            {product.is_featured && (
              <Badge className="bg-yellow-500 text-white text-xs">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
            {product.is_bestseller && (
              <Badge variant="default" className="text-xs">Bestseller</Badge>
            )}
            {product.is_limited_edition && (
              <Badge variant="destructive" className="text-xs">Limited</Badge>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist();
              }}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current text-red-500" : ""}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full shadow-lg"
              asChild
            >
              <Link to={`/shop/product/${product.slug || product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {/* Add to Cart Button */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              className="w-full gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </motion.div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium mb-2 line-clamp-1">{product.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{formatCurrency(displayPrice)}</span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            {product.average_rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{product.average_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}