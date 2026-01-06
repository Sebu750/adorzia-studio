import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { useMarketplaceProducts, useMarketplaceCategories, useMarketplaceCollections } from "@/hooks/useMarketplaceProducts";

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
];

export default function ShopHome() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useMarketplaceProducts({ 
    featured: true, 
    limit: 8 
  });
  const { data: newArrivals, isLoading: loadingNew } = useMarketplaceProducts({ 
    sort: 'newest', 
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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
        </div>
      </section>
    </MarketplaceLayout>
  );
}
