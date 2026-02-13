import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Shield, RotateCcw, Sparkles, TrendingUp, Package, Users, Filter, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { BentoGrid, generateBentoLayout } from "@/components/marketplace/BentoGrid";
import { useMarketplaceProducts, useMarketplaceCategories, useMarketplaceCollections } from "@/hooks/useMarketplaceProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import StatsSection from "@/components/public/StatsSection";

// END MOCK DATA

const OCCASIONS = [
  { name: "Wedding", count: 45 },
  { name: "Cocktail", count: 32 },
  { name: "Formal", count: 58 },
  { name: "Casual", count: 90 },
];

const shopStats = [
  { value: 200, suffix: "+", label: "Products Live", icon: <Package className="h-6 w-6 text-muted-foreground" /> },
  { value: 50, suffix: "+", label: "Designers", icon: <Users className="h-6 w-6 text-muted-foreground" /> },
  { value: 5, suffix: "K+", label: "Happy Customers", icon: <Star className="h-6 w-6 text-muted-foreground" /> },
  { value: 98, suffix: "%", label: "Satisfaction Rate", icon: <TrendingUp className="h-6 w-6 text-muted-foreground" /> },
];

export default function ShopHome() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useMarketplaceProducts({ 
    featured: true, 
    limit: 8 
  });
  const { data: newArrivals, isLoading: loadingNew } = useMarketplaceProducts({ 
    sort: 'newest', 
    limit: 8 
  });
  const { data: collectionsData } = useMarketplaceCollections(true);

  const { data: categoriesData } = useMarketplaceCategories();
  const categories = categoriesData?.categories || [];

  // Fetch featured designers
  const { data: featuredDesigners } = useQuery({
    queryKey: ['featured-designers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, brand_name, avatar_url, bio, location')
        .not('name', 'is', null)
        .order('xp', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  // Generate Bento layout data
  const bentoItems = generateBentoLayout(
    featuredProducts?.products || [],
    collectionsData?.collections || [],
    featuredDesigners || []
  );

  return (
    <MarketplaceLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-6">
                Designer Marketplace
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
                Shop Designer
                <br />
                <span className="text-muted-foreground">Made in Pakistan</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Discover unique fashion pieces created by emerging Pakistani designers. Every purchase supports independent creators and sustainable fashion.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="group" asChild>
                  <Link to="/shop/products" className="flex items-center">
                    Browse Products
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/shop/products">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Hero Image Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100">
                  {categories[0]?.image_url && (
                    <img
                      src={categories[0].image_url}
                      alt={categories[0].name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                  {categories[1]?.image_url && (
                    <img
                      src={categories[1].image_url}
                      alt={categories[1].name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                  {categories[2]?.image_url && (
                    <img
                      src={categories[2].image_url}
                      alt={categories[2].name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
                    alt="Fashion"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-t border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <StatsSection stats={shopStats} variant="default" />
        </div>
      </section>

      {/* Editorial Bento Grid - Featured Content */}
      {bentoItems.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Badge variant="outline" className="mb-4">
                  Curated Selection
                </Badge>
              </motion.div>
              <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Discover This Season
              </AnimatedHeading>
            </div>
            <BentoGrid items={bentoItems} />
          </div>
        </section>
      )}

      {/* Featured Designers */}
      {featuredDesigners && featuredDesigners.length > 0 && (
        <section className="py-20 md:py-28 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <Badge variant="outline" className="mb-4">
                    Rising Stars
                  </Badge>
                </motion.div>
                <AnimatedHeading className="font-display text-3xl font-bold tracking-tight">
                  Featured Designers
                </AnimatedHeading>
              </div>
              <Button variant="ghost" className="group" asChild>
                <Link to="/shop/designers">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDesigners.slice(0, 6).map((designer: any, i: number) => (
                <motion.div
                  key={designer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/shop/designer/${designer.id}`}>
                    <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={designer.avatar_url} alt={designer.name} />
                            <AvatarFallback>{designer.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                              {designer.brand_name || designer.name}
                            </h3>
                            {designer.location && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {designer.location}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {designer.bio || 'Discover unique fashion pieces'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            View Profile
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Badge variant="outline" className="mb-4">
                  Editor's Choice
                </Badge>
              </motion.div>
              <AnimatedHeading className="font-display text-3xl font-bold tracking-tight">
                Featured Products
              </AnimatedHeading>
            </div>
            <Button variant="ghost" className="group" asChild>
              <Link to="/shop/products?featured=true">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {loadingFeatured ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.products?.slice(0, 8).map((product: any, i: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
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
                    isNew={false}
                    isBestseller={product.is_bestseller}
                    slug={product.slug}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Badge variant="outline" className="mb-4">
                Browse
              </Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Shop by Category
            </AnimatedHeading>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Curated collections for every occasion and style.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((category: any, i: number) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/shop/products?category=${category.slug}`}>
                  <TiltCard tiltAmount={6}>
                    <Card className="h-full overflow-hidden group cursor-pointer">
                      <div className="aspect-[4/5] relative overflow-hidden">
                        {category.image_url && (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <h3 className="font-display text-2xl font-bold mb-2">{category.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                          <p className="text-sm font-medium">{category.product_count || 0} products</p>
                        </div>
                      </div>
                    </Card>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      {collectionsData?.collections && collectionsData.collections.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Badge variant="outline" className="mb-4">
                  Curated
                </Badge>
              </motion.div>
              <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Designer Collections
              </AnimatedHeading>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Curated capsules created directly through StyleBoxes.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {collectionsData.collections.slice(0, 3).map((collection: any, i: number) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/shop/collections`}>
                    <TiltCard tiltAmount={6}>
                      <Card className="h-full overflow-hidden group cursor-pointer">
                        <div className="aspect-video relative overflow-hidden">
                          {collection.image_url && (
                            <img
                              src={collection.image_url}
                              alt={collection.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                          <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/60 transition-colors flex items-center justify-center">
                            <div className="text-center text-background px-6">
                              <h3 className="font-display text-xl font-bold mb-2">{collection.name}</h3>
                              <p className="text-sm text-background/80">{collection.season || 'Collection'}</p>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Badge variant="outline" className="mb-4">
                  Just In
                </Badge>
              </motion.div>
              <AnimatedHeading className="font-display text-3xl font-bold tracking-tight">
                New Arrivals
              </AnimatedHeading>
            </div>
            <Button variant="ghost" className="group" asChild>
              <Link to="/shop/products?sort=newest">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {loadingNew ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals?.products?.slice(0, 8).map((product: any, i: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
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
                    isNew={true}
                    isBestseller={product.is_bestseller}
                    slug={product.slug}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="py-20 md:py-28 bg-foreground text-background relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Badge variant="outline" className="mb-4 border-background/20 text-background">
                Occasions
              </Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight text-background">
              Shop by Occasion
            </AnimatedHeading>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {OCCASIONS.map((occasion, i) => (
              <motion.div
                key={occasion.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <Link to={`/shop/products?occasion=${occasion.name.toLowerCase()}`}>
                  <div className="bg-background/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-background/20 transition-colors cursor-pointer border border-background/10">
                    <h3 className="font-medium mb-1">{occasion.name}</h3>
                    <p className="text-sm text-background/60">{occasion.count} items</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Info */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Badge variant="outline" className="mb-4">
                Quality Assurance
              </Badge>
              <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Production-Ready Products
              </AnimatedHeading>
              <p className="text-muted-foreground mb-6">
                Every item on our marketplace is backed by Adorzia's manufacturing pipeline. From design to delivery, we ensure quality at every step.
              </p>
              <ul className="space-y-4">
                {[
                  "Designer-created, production-verified",
                  "Quality checked before listing",
                  "Local manufacturing excellence",
                  "Secure checkout and delivery",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <TiltCard tiltAmount={8}>
                <Card className="overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted-foreground/10 p-8 flex items-center justify-center relative">
                    <div className="grid grid-cols-2 gap-2 w-full h-full">
                      <div className="bg-background/50 rounded-lg flex items-center justify-center">
                        <Shield className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                      <div className="bg-background/50 rounded-lg flex items-center justify-center">
                        <Star className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                      <div className="bg-background/50 rounded-lg flex items-center justify-center">
                        <Truck className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                      <div className="bg-background/50 rounded-lg flex items-center justify-center">
                        <RotateCcw className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge>Verified</Badge>
                      <Badge variant="secondary">Quality</Badge>
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">Trusted Marketplace</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Each product comes with full provenance—you know exactly who designed it and how it was made.
                    </p>
                    <Button className="w-full" asChild>
                      <Link to="/shop/designers">
                        Meet Our Designers
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>
    </MarketplaceLayout>
  );
}
