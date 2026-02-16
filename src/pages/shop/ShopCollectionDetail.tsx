import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ShopCollectionDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: collection, isLoading: loadingCollection } = useQuery({
    queryKey: ['collection-detail', slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from('marketplace_collections')
        .select(`
          *,
          designer:profiles!marketplace_collections_designer_id_fkey(
            id,
            name,
            brand_name,
            avatar_url,
            bio,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['collection-products', collection?.id],
    enabled: !!collection?.id,
    queryFn: async () => {
      if (!collection?.id) return [];

      const { data, error } = await supabase
        .from('marketplace_collection_products')
        .select(`
          product:marketplace_products!inner(
            id,
            title,
            price,
            sale_price,
            images,
            slug,
            average_rating,
            review_count,
            production_time_days,
            designer:profiles!marketplace_products_designer_id_fkey(
              id,
              name,
              brand_name
            )
          )
        `)
        .eq('collection_id', collection.id);

      if (error) throw error;
      return data?.map((item: any) => item.product) || [];
    },
  });

  if (loadingCollection) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen">
          {/* Hero Skeleton */}
          <div className="h-[70vh] bg-muted animate-pulse" />
          
          {/* Content Skeleton */}
          <div className="container py-16">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="h-6 bg-muted rounded w-32 mx-auto" />
              <div className="h-12 bg-muted rounded w-2/3 mx-auto" />
              <div className="h-20 bg-muted rounded w-full" />
            </div>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  if (!collection) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-editorial-title mb-4">Collection Not Found</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The collection you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild size="lg">
              <Link to="/shop/collections">Browse Collections</Link>
            </Button>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  const designer = collection.designer?.[0] || collection.designer;

  return (
    <MarketplaceLayout>
      {/* Hero Section - Full Bleed */}
      <section className="relative h-[70vh] min-h-[600px]">
        {collection.image_url ? (
          <img
            src={collection.image_url}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-8 left-0 right-0 container z-10"
        >
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <Link to="/shop/collections">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Collections
            </Link>
          </Button>
        </motion.div>

        {/* Collection Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container pb-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl"
            >
              {/* Season Badge */}
              {collection.season && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <Badge 
                    variant="outline" 
                    className="bg-background/80 backdrop-blur-sm text-foreground border-border/50 px-4 py-1.5 text-xs tracking-widest uppercase"
                  >
                    <Calendar className="h-3 w-3 mr-2" />
                    {collection.season}
                  </Badge>
                </motion.div>
              )}
              
              {/* Collection Name */}
              <h1 className="text-editorial-display text-white mb-6 drop-shadow-lg">
                {collection.name}
              </h1>
              
              {/* Description */}
              {collection.description && (
                <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl drop-shadow-md">
                  {collection.description}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Designer Attribution Bar */}
      {designer && (
        <section className="border-b bg-card">
          <div className="container py-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <Link 
                to={`/shop/designer/${designer.slug || designer.id}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-muted overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                  {designer.avatar_url ? (
                    <img
                      src={designer.avatar_url}
                      alt={designer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-lg font-display">
                        {(designer.brand_name || designer.name)?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                    Collection by
                  </p>
                  <p className="text-lg font-display group-hover:text-primary transition-colors">
                    {designer.brand_name || designer.name}
                  </p>
                </div>
              </Link>

              <Button variant="outline" asChild>
                <Link to={`/shop/designer/${designer.slug || designer.id}`}>
                  View Designer Profile
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Collection Story / Details */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Story Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-editorial-caption text-muted-foreground mb-4 block">
                The Collection
              </span>
              <h2 className="text-editorial-title mb-6">
                Crafted with Intention
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Each piece in this collection represents hours of meticulous craftsmanship 
                  and attention to detail. From the initial sketch to the final stitch, 
                  every garment tells a story of dedication to the art of fashion.
                </p>
                <p>
                  The collection features premium materials sourced from renowned suppliers, 
                  ensuring both luxury and sustainability in every creation.
                </p>
              </div>

              {/* Collection Stats */}
              <div className="grid grid-cols-3 gap-8 mt-10 pt-10 border-t">
                <div>
                  <p className="text-3xl font-display text-foreground">{products?.length || 0}</p>
                  <p className="text-sm text-muted-foreground mt-1">Pieces</p>
                </div>
                <div>
                  <p className="text-3xl font-display text-foreground">
                    <Clock className="h-6 w-6 inline mr-1" />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Made to Order</p>
                </div>
                <div>
                  <p className="text-3xl font-display text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground mt-1">Handcrafted</p>
                </div>
              </div>
            </motion.div>

            {/* Featured Image or Quote */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden">
                {collection.image_url ? (
                  <img
                    src={collection.image_url}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-border/50 rounded-sm -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
          >
            <div>
              <span className="text-editorial-caption text-muted-foreground mb-2 block">
                The Pieces
              </span>
              <h2 className="text-editorial-title">Collection Items</h2>
            </div>
            <p className="text-muted-foreground">
              {products?.length || 0} exclusive {products?.length === 1 ? 'piece' : 'pieces'}
            </p>
          </motion.div>

          {/* Products Grid */}
          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-muted rounded-sm animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-5 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any, i: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  <MarketplaceProductCard
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    salePrice={product.sale_price}
                    images={product.images || []}
                    brandName={product.designer?.brand_name}
                    designerName={product.designer?.name}
                    designerId={product.designer?.id}
                    averageRating={product.average_rating}
                    reviewCount={product.review_count}
                    productionTimeDays={product.production_time_days}
                    slug={product.slug}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display mb-2">No products yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                This collection doesn't have any products yet. Check back soon for new arrivals.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* More Collections CTA */}
      <section className="py-20 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="text-editorial-caption text-muted-foreground mb-4 block">
              Continue Exploring
            </span>
            <h2 className="text-editorial-display mb-6">More Collections</h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Discover more curated collections from our talented designers. 
              Each collection tells a unique story of craftsmanship and creativity.
            </p>
            <Button size="lg" asChild className="px-8">
              <Link to="/shop/collections">
                View All Collections
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </MarketplaceLayout>
  );
}
