import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Star, Sparkles, TrendingUp, Package, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { useMarketplaceProducts, useMarketplaceCategories, useMarketplaceCollections } from "@/hooks/useMarketplaceProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = [
  // Couture & Bespoke Fashion
  { name: "Bridal & Wedding Gowns", slug: "bridal-wedding-gowns", image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800", count: 24, category: "Couture & Bespoke" },
  { name: "Evening & Red Carpet", slug: "evening-red-carpet", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800", count: 38, category: "Couture & Bespoke" },
  { name: "Custom Tailored Suits", slug: "custom-tailored-suits", image: "https://images.unsplash.com/photo-1591047134523-4cc43d2950f0?w=800", count: 18, category: "Couture & Bespoke" },
  { name: "Couture Ready-to-Wear", slug: "couture-ready-to-wear", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800", count: 15, category: "Couture & Bespoke" },
  
  // Limited Edition Clothing
  { name: "Seasonal Dresses", slug: "seasonal-dresses", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800", count: 32, category: "Limited Edition" },
  { name: "Tops & Shirts", slug: "tops-shirts", image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800", count: 28, category: "Limited Edition" },
  { name: "Pants & Skirts", slug: "pants-skirts", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800", count: 22, category: "Limited Edition" },
  { name: "Outerwear & Jackets", slug: "outerwear-jackets", image: "https://images.unsplash.com/photo-1591047134523-4cc43d2950f0?w=800", count: 19, category: "Limited Edition" },
  { name: "Knitwear & Sweaters", slug: "knitwear-sweaters", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800", count: 25, category: "Limited Edition" },
  
  // Designer Accessories
  { name: "Luxury Bags & Clutches", slug: "luxury-bags-clutches", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800", count: 35, category: "Accessories" },
  { name: "Custom Shoes", slug: "custom-shoes", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800", count: 21, category: "Accessories" },
  { name: "Scarves & Shawls", slug: "scarves-shawls", image: "https://images.unsplash.com/photo-1591561951950-72510d379f11?w=800", count: 17, category: "Accessories" },
  { name: "Belts & Gloves", slug: "belts-gloves", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800", count: 14, category: "Accessories" },
  { name: "Statement Headpieces", slug: "statement-headpieces", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800", count: 12, category: "Accessories" },
  
  // Fine Jewelry & Watches
  { name: "Necklaces & Pendants", slug: "necklaces-pendants", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800", count: 28, category: "Jewelry & Watches" },
  { name: "Earrings", slug: "earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab61100?w=800", count: 33, category: "Jewelry & Watches" },
  { name: "Bracelets & Bangles", slug: "bracelets-bangles", image: "https://images.unsplash.com/photo-1611915301065-d237d1261f80?w=800", count: 26, category: "Jewelry & Watches" },
  { name: "Rings", slug: "rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800", count: 31, category: "Jewelry & Watches" },
  { name: "Designer Watches", slug: "designer-watches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", count: 18, category: "Jewelry & Watches" },
  
  // Custom / Made-to-Order Fashion
  { name: "Personalized Clothing", slug: "personalized-clothing", image: "https://images.unsplash.com/photo-1525171002232-3e3d2615c1c5?w=800", count: 20, category: "Custom Fashion" },
  { name: "Bespoke Accessories", slug: "bespoke-accessories", image: "https://images.unsplash.com/photo-1602062486445-8b40617b7000?w=800", count: 16, category: "Custom Fashion" },
  { name: "Tailored Couture", slug: "tailored-couture", image: "https://images.unsplash.com/photo-1568243296379-249097b54c14?w=800", count: 13, category: "Custom Fashion" },
  
  // Exclusive Collections
  { name: "Seasonal Designer Drops", slug: "seasonal-designer-drops", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800", count: 22, category: "Exclusive Collections" },
  { name: "One-of-a-Kind Pieces", slug: "one-of-a-kind", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800", count: 15, category: "Exclusive Collections" },
  { name: "Designer Collaborations", slug: "designer-collaborations", image: "https://images.unsplash.com/photo-1523380744952-b4db976d6403?w=800", count: 18, category: "Exclusive Collections" },
  
  // Sustainable / Artisan Fashion
  { name: "Eco-Conscious Luxury", slug: "eco-conscious-luxury", image: "https://images.unsplash.com/photo-1583391733450-45992b494f0d?w=800", count: 24, category: "Sustainable Fashion" },
  { name: "Handcrafted Artisan", slug: "handcrafted-artisan", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800", count: 19, category: "Sustainable Fashion" },
  { name: "Limited Batch", slug: "limited-batch", image: "https://images.unsplash.com/photo-1596176545934-09818a1c0414?w=800", count: 16, category: "Sustainable Fashion" },
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
  // Use local category data instead of API
  const categoriesData = {
    data: CATEGORIES.map((cat, index) => ({
      id: (index + 1).toString(),
      name: cat.name,
      category: cat.category,
      slug: cat.slug,
      count: cat.count
    }))
  };

  // Fetch featured designers
  const { data: featuredDesigners } = useQuery({
    queryKey: ['featured-designers'],
    queryFn: async () => {
      // Fetch featured designers with banner images
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, name, brand_name, avatar_url, bio, location, category, banner_image')
        .not('name', 'is', null)
        .order('xp', { ascending: false })
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
                      {/* Background Banner */}
                      {designer.banner_image ? (
                        <div className="absolute inset-0">
                          <img
                            src={designer.banner_image}
                            alt={`${designer.brand_name || designer.name} banner`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent"></div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                      )}
                      
                      {/* Profile Picture */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                          {designer.avatar_url ? (
                            <img
                              src={designer.avatar_url}
                              alt={designer.name || "Designer"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="font-display text-xl text-gray-600">
                                {(designer.name || "?").charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-sm font-medium text-white">View Profile</span>
                        <ArrowUpRight className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-xl font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                        {designer.brand_name || designer.name}
                      </h3>
                      {designer.brand_name && (
                        <p className="text-sm text-gray-600">
                          by {designer.name}
                        </p>
                      )}
                      {designer.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span>{designer.location}</span>
                        </div>
                      )}
                      {!designer.brand_name && designer.category && (
                        <p className="text-sm text-gray-600">
                          {designer.category}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Shortcuts - Grouped by Main Categories */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-editorial-caption text-gray-500 mb-4">Browse</p>
            <h2 className="text-editorial-display text-gray-900">Shop by Category</h2>
          </div>

          {/* Group categories by main category */}
          <div className="space-y-16">
            {Array.from(new Set(CATEGORIES.map(cat => cat.category))).map((mainCategory) => {
              const subCategories = CATEGORIES.filter(cat => cat.category === mainCategory);
              return (
                <div key={mainCategory}>
                  <h3 className="text-2xl font-display font-medium text-gray-900 mb-8 text-center">
                    {mainCategory}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {subCategories.map((category, i) => (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      >
                        <Link 
                          to={`/shop/products?category=${category.slug}`}
                          className="group block relative aspect-[3/4] overflow-hidden rounded-lg"
                        >
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                            <h4 className="font-display text-lg md:text-xl font-medium text-white mb-1">
                              {category.name}
                            </h4>
                            <p className="text-sm text-white/70">
                              {category.count} pieces
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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
        </div>
      </section>
    </MarketplaceLayout>
  );
}
