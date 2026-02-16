import { useState } from "react";
import { useParams, Link } from "react-router-dom";
<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, ShoppingBag, Share2, Star, Clock, Shield, 
  ChevronLeft, ChevronRight, Minus, Plus, Check,
  Sparkles, Ruler, Package, ArrowRight
=======
import { motion } from "framer-motion";
import { 
  Heart, ShoppingBag, Share2, Star, Truck, Shield, RotateCcw, 
  ChevronLeft, ChevronRight, Minus, Plus, Check
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
<<<<<<< HEAD
import { Separator } from "@/components/ui/separator";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { AuthenticityBadge } from "@/components/marketplace/AuthenticityBadge";
=======
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { useMarketplaceProduct } from "@/hooks/useMarketplaceProducts";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/marketplace-math";

export default function ShopProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem, isLoading: cartLoading } = useCart();
  
  const { data, isLoading, error } = useMarketplaceProduct(id || '');

  if (isLoading) {
    return (
      <MarketplaceLayout>
<<<<<<< HEAD
        <div className="min-h-screen">
          <div className="container py-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image Skeleton */}
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-muted rounded-sm animate-pulse" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-24 bg-muted rounded-sm animate-pulse" />
                  ))}
                </div>
              </div>
              
              {/* Info Skeleton */}
              <div className="space-y-6">
                <div className="h-4 bg-muted rounded animate-pulse w-32" />
                <div className="h-10 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-6 bg-muted rounded animate-pulse w-1/4" />
                <div className="h-32 bg-muted rounded animate-pulse" />
                <div className="h-12 bg-muted rounded animate-pulse" />
              </div>
=======
        <div className="container py-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-6 bg-muted rounded animate-pulse w-1/4" />
              <div className="h-24 bg-muted rounded animate-pulse" />
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
            </div>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  if (error || !data?.product) {
    return (
      <MarketplaceLayout>
<<<<<<< HEAD
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-editorial-title mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild size="lg">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
=======
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        </div>
      </MarketplaceLayout>
    );
  }

  const { product, relatedProducts, reviews } = data;
  const images = product.images || ['/placeholder.svg'];
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const displayPrice = product.sale_price || product.price;

  const handleAddToCart = async () => {
    await addItem(product.id, quantity);
  };

<<<<<<< HEAD
  const nextImage = () => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1);
  const prevImage = () => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1);

  return (
    <MarketplaceLayout>
      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b">
          <div className="container py-4">
            <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
              <ChevronRight className="h-3 w-3" />
              {product.designer && (
                <>
                  <Link 
                    to={`/shop/designer/${product.designer.id}`} 
                    className="hover:text-foreground transition-colors"
                  >
                    {product.designer.brand_name || product.designer.full_name}
                  </Link>
                  <ChevronRight className="h-3 w-3" />
                </>
              )}
              <span className="text-foreground font-medium truncate">{product.title}</span>
            </nav>
          </div>
        </div>

        <div className="container py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-muted overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={images[selectedImage]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-lg"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-lg"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-24 overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-foreground' 
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="space-y-4">
                {product.designer && (
                  <Link 
                    to={`/shop/designer/${product.designer.id}`}
                    className="inline-flex items-center gap-2 group"
                  >
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                      {product.designer.brand_name || product.designer.full_name}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                )}
                
                <h1 className="text-editorial-title text-3xl md:text-4xl">
                  {product.title}
                </h1>
                
                {/* Rating */}
                {product.average_rating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(product.average_rating) 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.average_rating.toFixed(1)} ({product.review_count} reviews)
                    </span>
                  </div>
                )}
                
                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-display text-foreground">
=======
  return (
    <MarketplaceLayout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <ChevronRight className="h-4 w-4" />
          {product.category && (
            <>
              <Link to={`/shop?category=${product.category.id}`} className="hover:text-foreground">
                {product.category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-foreground truncate">{product.title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </motion.div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Designer */}
            {product.designer && (
              <Link 
                to={`/shop/designer/${product.designer.id}`}
                className="inline-flex items-center gap-2 hover:opacity-80"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={product.designer.avatar_url} />
                  <AvatarFallback>{product.designer.name?.[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{product.designer.name}</span>
              </Link>
            )}

            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${hasDiscount ? 'text-destructive' : ''}`}>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                    {formatCurrency(displayPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>
<<<<<<< HEAD
              </div>

              <Separator />

              {/* Production Time */}
              {product.production_time_days && (
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-sm">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Made to Order</p>
                    <p className="text-xs text-muted-foreground">
                      Estimated delivery in {product.production_time_days} days
                    </p>
                  </div>
                </div>
              )}

              {/* Description Preview */}
              {product.description && (
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
                    About this piece
                  </h3>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Authenticity */}
              <AuthenticityBadge productId={product.id} />

              <Separator />

              {/* Quantity & Add to Cart */}
              <div className="space-y-6">
                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium uppercase tracking-wider">Quantity</span>
                  <div className="flex items-center border rounded-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={() => setQuantity(q => q + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1 h-14 text-base"
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {cartLoading ? 'Adding...' : 'Add to Bag'}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-14"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="h-14 w-14"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y">
                <div className="text-center">
                  <Shield className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Authenticity<br/>Guaranteed</p>
                </div>
                <div className="text-center">
                  <Sparkles className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Handcrafted<br/>with Care</p>
                </div>
                <div className="text-center">
                  <Ruler className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Custom<br/>Fittings</p>
                </div>
              </div>

              {/* Product Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full bg-transparent border-b rounded-none h-auto p-0">
                  <TabsTrigger 
                    value="description" 
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent py-3"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger 
                    value="details" 
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent py-3"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reviews" 
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent py-3"
                  >
                    Reviews ({product.review_count})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description || 'No description available.'}
                  </p>
                </TabsContent>
                
                <TabsContent value="details" className="mt-6">
                  <div className="space-y-4">
                    {product.materials && product.materials.length > 0 && (
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-muted-foreground text-sm">Materials</span>
                        <span className="text-sm">{product.materials.join(', ')}</span>
                      </div>
                    )}
                    {product.care_instructions && (
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-muted-foreground text-sm">Care Instructions</span>
                        <span className="text-sm">{product.care_instructions}</span>
                      </div>
                    )}
                    {product.sku && (
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-muted-foreground text-sm">SKU</span>
                        <span className="text-sm font-mono">{product.sku}</span>
                      </div>
                    )}
                    {product.production_time_days && (
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-muted-foreground text-sm">Production Time</span>
                        <span className="text-sm">{product.production_time_days} days</span>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-6">
                  {reviews && reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? 'fill-amber-400 text-amber-400' 
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium text-sm">{review.customer?.name || 'Anonymous'}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {review.title && <h4 className="font-medium mb-2">{review.title}</h4>}
                          <p className="text-muted-foreground text-sm leading-relaxed">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No reviews yet. Be the first to review this product!
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Designer Section */}
          {product.designer && (
            <section className="mt-20 py-16 border-t">
              <div className="max-w-4xl mx-auto text-center">
                <span className="text-editorial-caption text-muted-foreground mb-4 block">
                  Meet the Designer
                </span>
                <h2 className="text-editorial-title mb-6">
                  {product.designer.brand_name || product.designer.full_name}
                </h2>
                {product.designer.bio && (
                  <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                    {product.designer.bio}
                  </p>
                )}
                <Button variant="outline" asChild>
                  <Link to={`/shop/designer/${product.designer.id}`}>
                    View Designer Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </section>
          )}

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <section className="mt-20 py-16 border-t">
              <div className="text-center mb-12">
                <span className="text-editorial-caption text-muted-foreground mb-2 block">
                  You May Also Like
                </span>
                <h2 className="text-editorial-title">Similar Pieces</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((product: any, i: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <MarketplaceProductCard
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      salePrice={product.sale_price}
                      images={product.images || []}
                      brandName={product.designer?.brand_name}
                      designerName={product.designer?.full_name}
                      designerId={product.designer_id}
                      averageRating={product.average_rating}
                      reviewCount={product.review_count}
                      slug={product.slug}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
=======
                {product.review_count > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{product.average_rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({product.review_count} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {hasDiscount && (
                <Badge variant="destructive">
                  Save {Math.round((1 - product.sale_price / product.price) * 100)}%
                </Badge>
              )}
              {product.is_bestseller && <Badge variant="secondary">Bestseller</Badge>}
            </div>

            <Separator />

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Bag
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span>Free shipping over $200</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span>30-day returns</span>
              </div>
            </div>

            <Separator />

            {/* Product Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">
                  Reviews ({product.review_count})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <div className="space-y-3">
                  {product.materials && product.materials.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Materials</span>
                      <span>{product.materials.join(', ')}</span>
                    </div>
                  )}
                  {product.care_instructions && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Care</span>
                      <span>{product.care_instructions}</span>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU</span>
                      <span>{product.sku}</span>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'fill-amber-400 text-amber-400' 
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.customer?.name || 'Anonymous'}</span>
                        </div>
                        {review.title && <h4 className="font-medium">{review.title}</h4>}
                        <p className="text-muted-foreground text-sm">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product: any) => (
                <MarketplaceProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  images={product.images || []}
                  averageRating={product.average_rating}
                />
              ))}
            </div>
          </section>
        )}
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      </div>
    </MarketplaceLayout>
  );
}
