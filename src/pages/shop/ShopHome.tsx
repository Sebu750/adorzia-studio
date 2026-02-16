import { Link } from "react-router-dom";
import { motion } from "framer-motion";
<<<<<<< HEAD
import { ArrowRight, ArrowUpRight, Star, Sparkles, TrendingUp, Package, Users, Heart } from "lucide-react";
=======
import { ArrowRight, Star, Truck, Shield, RotateCcw } from "lucide-react";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { useMarketplaceProducts, useMarketplaceCategories, useMarketplaceCollections } from "@/hooks/useMarketplaceProducts";
<<<<<<< HEAD
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = [
  { name: "Bridal", image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800", count: 24 },
  { name: "Evening", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800", count: 38 },
  { name: "Luxury Pret", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800", count: 56 },
  { name: "Couture", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800", count: 18 },
=======

// Static hero data (can be dynamic later)
const heroSlides = [
  {
    title: "Designer Fashion,\nCurated for You",
    subtitle: "Discover unique pieces from emerging designers worldwide",
    image: "/placeholder.svg",
    cta: { label: "Shop New Arrivals", href: "/shop/new-arrivals" },
  },
];

const trustBadges = [
  { icon: Truck, title: "Free Shipping", description: "On orders over $200" },
  { icon: Shield, title: "Secure Payment", description: "100% protected checkout" },
  { icon: RotateCcw, title: "Easy Returns", description: "30-day return policy" },
  { icon: Star, title: "Quality Assured", description: "Curated by experts" },
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
];

export default function ShopHome() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useMarketplaceProducts({ 
    featured: true, 
    limit: 8 
  });
  const { data: newArrivals, isLoading: loadingNew } = useMarketplaceProducts({ 
    sort: 'newest', 
<<<<<<< HEAD
    limit: 8 
  });
  const { data: collectionsData } = useMarketplaceCollections(true);
  const { data: categoriesData } = useMarketplaceCategories();

  // Fetch featured designers
  const { data: featuredDesigners } = useQuery({
    queryKey: ['featured-designers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, name, brand_name, avatar_url, bio, location, category')
        .not('name', 'is', null)
        .order('style_credits', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      // Map user_id to id for consistent routing
      return data?.map(designer => ({
        ...designer,
        id: designer.user_id
      }));
    },
  });

  return (
    <MarketplaceLayout>
      {/* Hero Section - Full Bleed Editorial */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920"
            alt="Luxury fashion editorial"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-editorial-caption text-gray-600 mb-6"
            >
              Designer Marketplace
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-editorial-hero text-gray-900 mb-8"
            >
              Where Vision<br />
              <span className="text-gray-600">Meets Craft</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-editorial-body text-gray-700 mb-10 max-w-lg"
            >
              Discover exceptional pieces from Pakistan's most talented designers. 
              Each creation tells a story of dedication, artistry, and cultural heritage.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="h-14 px-8 text-sm tracking-wider bg-gray-900 text-white hover:bg-gray-800" asChild>
                <Link to="/shop/designers">
                  Explore Designers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-sm tracking-wider border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
                <Link to="/shop/products?featured=true">
                  Limited Editions
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-400 to-transparent" />
        </motion.div>
      </section>

      {/* Featured Limited Editions */}
      {featuredProducts?.products && featuredProducts.products.length > 0 && (
        <section className="py-24 md:py-32 bg-gray-50">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-editorial-caption text-gray-500 mb-4">Exclusive</p>
                <h2 className="text-editorial-display text-gray-900">Limited Editions</h2>
              </div>
              <Button variant="ghost" className="hidden md:flex items-center gap-2 group text-gray-700 hover:text-gray-900 hover:bg-gray-100" asChild>
                <Link to="/shop/products?featured=true">
                  View All
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.products.slice(0, 4).map((product: any, i: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
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
          </div>
        </section>
      )}

      {/* Trending Designers */}
      {featuredDesigners && featuredDesigners.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-editorial-caption text-gray-500 mb-4">Rising Stars</p>
                <h2 className="text-editorial-display text-gray-900">Trending Designers</h2>
              </div>
              <Button variant="ghost" className="hidden md:flex items-center gap-2 group text-gray-700 hover:text-gray-900 hover:bg-gray-100" asChild>
                <Link to="/shop/designers">
                  All Designers
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDesigners.slice(0, 6).map((designer: any, i: number) => (
                <motion.div
                  key={designer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link to={`/shop/designer/${designer.id}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 mb-4">
                      {designer.avatar_url ? (
                        <img
                          src={designer.avatar_url}
                          alt={designer.brand_name || designer.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="font-display text-4xl text-gray-500">
                            {(designer.brand_name || designer.name)?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-sm font-medium text-white">View Profile</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-medium text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                        {designer.brand_name || designer.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {designer.category || 'Fashion Designer'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Shortcuts */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-editorial-caption text-gray-500 mb-4">Browse</p>
            <h2 className="text-editorial-display text-gray-900">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map((category, i) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link 
                  to={`/shop/products?category=${category.name.toLowerCase().replace(' ', '-')}`}
                  className="group block relative aspect-[3/4] overflow-hidden rounded-lg"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl md:text-3xl font-medium text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/70">
                      {category.count} pieces
                    </p>
                  </div>
                </Link>
=======
    limit: 4 
  });
  const { data: bestsellers, isLoading: loadingBest } = useMarketplaceProducts({ 
    bestseller: true, 
    limit: 4 
  });
  const { data: categoriesData } = useMarketplaceCategories();
  const { data: collectionsData } = useMarketplaceCollections(true);

  return (
    <MarketplaceLayout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-muted">
          <img 
            src={heroSlides[0].image} 
            alt="" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="container relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight whitespace-pre-line mb-6">
              {heroSlides[0].title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {heroSlides[0].subtitle}
            </p>
            <Button size="lg" asChild>
              <Link to={heroSlides[0].cta.href}>
                {heroSlides[0].cta.label}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-border">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-center md:text-left"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{badge.title}</h3>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              </motion.div>
            ))}
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* New Arrivals */}
      {newArrivals?.products && newArrivals.products.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-editorial-caption text-gray-500 mb-4">Just In</p>
                <h2 className="text-editorial-display text-gray-900">New Arrivals</h2>
              </div>
              <Button variant="ghost" className="hidden md:flex items-center gap-2 group text-gray-700 hover:text-gray-900 hover:bg-gray-100" asChild>
                <Link to="/shop/products?sort=newest">
                  View All
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.products.slice(0, 4).map((product: any, i: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
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
          </div>
        </section>
      )}

      {/* Collections */}
      {collectionsData?.collections && collectionsData.collections.length > 0 && (
        <section className="py-24 md:py-32 bg-gray-900 text-white">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-editorial-caption text-gray-400 mb-4">Curated</p>
                <h2 className="text-editorial-display text-white">Designer Collections</h2>
              </div>
              <Button 
                variant="outline" 
                className="hidden md:flex items-center gap-2 group border-gray-700 text-white hover:bg-gray-800"
                asChild
              >
                <Link to="/shop/collections">
                  All Collections
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collectionsData.collections.slice(0, 3).map((collection: any, i: number) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link to={`/shop/collections`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                      <img
                        src={collection.image_url || 'https://images.unsplash.com/photo-1558769132-cbaea1c1e86?w=1200'}
                        alt={collection.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <h3 className="font-display text-xl font-medium text-white mb-1">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {collection.description}
                    </p>
=======
      {/* Categories */}
      {categoriesData?.categories && categoriesData.categories.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Shop by Category</h2>
              <Button variant="ghost" asChild>
                <Link to="/shop">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoriesData.categories.slice(0, 4).map((category: any, index: number) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/shop?category=${category.id}`}
                    className="block relative aspect-square rounded-lg overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-muted">
                      {category.image_url && (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    </div>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

<<<<<<< HEAD
      {/* Editorial Banner - Craftsmanship */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden rounded-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-editorial-caption text-gray-500 mb-6">Our Promise</p>
              <h2 className="text-editorial-title text-gray-900 mb-6">
                Crafted with Intention,<br />Made with Care
              </h2>
              <p className="text-editorial-body text-gray-700 mb-8">
                Every piece in our marketplace represents countless hours of design, 
                meticulous craftsmanship, and a deep respect for the art of fashion. 
                We partner with designers who share our commitment to quality, 
                sustainability, and the preservation of traditional techniques.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-900">Verified Quality</span>
                  </div>
                  <p className="text-xs text-gray-600">Every piece inspected before listing</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-900">Direct Support</span>
                  </div>
                  <p className="text-xs text-gray-600">Designers keep up to 50% of sales</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-900">Made to Order</span>
                  </div>
                  <p className="text-xs text-gray-600">Reducing waste, ensuring fit</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-900">Emerging Talent</span>
                  </div>
                  <p className="text-xs text-gray-600">Discover tomorrow's stars today</p>
                </div>
              </div>
            </motion.div>
          </div>
=======
      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge variant="outline" className="mb-2">Curated Selection</Badge>
              <h2 className="text-2xl font-bold">Featured Products</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/shop?featured=true">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {loadingFeatured ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts?.products?.slice(0, 8).map((product: any) => (
                <MarketplaceProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  salePrice={product.sale_price}
                  images={product.images || []}
                  designerName={product.designer?.name}
                  designerId={product.designer_id}
                  averageRating={product.average_rating}
                  reviewCount={product.review_count}
                  isNew={false}
                  isBestseller={product.is_bestseller}
                  slug={product.slug}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collections Banner */}
      {collectionsData?.collections && collectionsData.collections.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-6">
              {collectionsData.collections.slice(0, 2).map((collection: any, index: number) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to={`/shop/collection/${collection.slug}`}
                    className="block relative aspect-[2/1] rounded-lg overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-muted">
                      {collection.image_url && (
                        <img
                          src={collection.image_url}
                          alt={collection.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-2" variant="secondary">Collection</Badge>
                      <h3 className="text-white text-2xl font-bold mb-2">{collection.name}</h3>
                      <p className="text-white/80 text-sm mb-4 line-clamp-2">{collection.description}</p>
                      <span className="text-white text-sm font-medium flex items-center">
                        Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="mb-2">Just In</Badge>
              <h2 className="text-2xl font-bold">New Arrivals</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/shop/new-arrivals">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {loadingNew ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals?.products?.map((product: any) => (
                <MarketplaceProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  salePrice={product.sale_price}
                  images={product.images || []}
                  designerName={product.designer?.name}
                  designerId={product.designer_id}
                  averageRating={product.average_rating}
                  reviewCount={product.review_count}
                  isNew={true}
                  isBestseller={product.is_bestseller}
                  slug={product.slug}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Designer CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Are You a Designer?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join our community of talented designers and sell your creations to customers worldwide.
              Earn up to 50% commission on every sale.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/for-designers">
                Become a Designer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        </div>
      </section>
    </MarketplaceLayout>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
