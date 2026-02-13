import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Heart, ShoppingBag, Share2, Star, Truck, Shield, RotateCcw, 
  ChevronLeft, ChevronRight, Minus, Plus, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { AuthenticityBadge } from "@/components/marketplace/AuthenticityBadge";
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
        <div className="container py-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-6 bg-muted rounded animate-pulse w-1/4" />
              <div className="h-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  if (error || !data?.product) {
    return (
      <MarketplaceLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
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

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] uppercase tracking-widest text-slate-500 mb-12">
          <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          {product.designer && (
            <>
              <Link to={`/shop?designer=${product.designer.id}`} className="hover:text-black transition-colors">
                {product.designer.brand_name || product.designer.full_name}
              </Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="text-black font-bold truncate">{product.title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              className="aspect-[2/3] bg-white border border-slate-100 overflow-hidden relative"
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
          <div className="space-y-8">
            {/* NJAL Hero Info Section */}
            <div className="space-y-4">
              {product.designer && (
                <Link 
                  to={`/shop?designer=${product.designer.id}`}
                  className="block group"
                >
                  <p className="text-[14px] font-bold uppercase tracking-[0.3em] text-black group-hover:text-slate-600 transition-colors">
                    {product.designer.brand_name || product.designer.full_name}
                  </p>
                </Link>
              )}
              
              <h1 className="text-4xl font-light tracking-tight text-black">{product.title}</h1>
              
              <div className="flex items-center gap-4">
                <span className="text-2xl font-medium text-black">
                  {formatCurrency(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-slate-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* FR 1.2: Designer's Vision Section */}
            {product.designer?.bio && (
              <div className="space-y-3">
                <h3 className="text-[12px] font-bold uppercase tracking-widest text-black">Designer's Vision</h3>
                <p className="text-slate-600 text-[15px] leading-relaxed italic">
                  "{product.designer.bio}"
                </p>
                {product.description && (
                  <p className="text-slate-700 text-sm leading-relaxed mt-3">
                    {product.description}
                  </p>
                )}
              </div>
            )}

            {/* FR 1.6: Authenticity Verification */}
            <AuthenticityBadge productId={product.id} />

            <Separator className="bg-slate-100" />

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
                  brandName={product.designer?.brand_name}
                  designerName={product.designer?.full_name}
                  designerId={product.designer_id}
                  averageRating={product.average_rating}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </MarketplaceLayout>
  );
}
