import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import SEOHead from "@/components/public/SEOHead";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Grid3X3, Sparkles } from "lucide-react";
import { useMarketplaceProducts, useMarketplaceCategories } from "@/hooks/useMarketplaceProducts";

export default function ShopCategory() {
  const { slug } = useParams<{ slug: string }>();
  const { data: categories } = useMarketplaceCategories();
  const category = categories?.find(c => c.slug === slug);
  
  const { data: productsData, isLoading } = useMarketplaceProducts({
    category: slug,
    limit: 24,
  });

  if (!category && !isLoading) {
    return (
      <MarketplaceLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The category you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/shop/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse All Products
            </Link>
          </Button>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <SEOHead 
        title={category?.seo_title || `${category?.name || 'Category'} | Adorzia Shop`}
        description={category?.seo_description || category?.description || ''}
        url={`https://adorzia.com/shop/category/${slug}`}
        keywords={[
          ...(category?.focus_areas || []),
          ...(category?.vibe_tags || []),
        ].join(", ")}
      />

      {/* Breadcrumb Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Shop", "item": "https://adorzia.com/shop" },
            { "@type": "ListItem", "position": 2, "name": category?.name, "item": `https://adorzia.com/shop/category/${slug}` }
          ]
        })
      }} />

      {/* Collection Page Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": category?.name,
          "description": category?.description,
          "url": `https://adorzia.com/shop/category/${slug}`,
          "numberOfItems": productsData?.products?.length || 0
        })
      }} />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section 
          className="relative py-16 md:py-24 px-4 overflow-hidden"
          style={{
            backgroundImage: category?.banner_image_url 
              ? `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${category.banner_image_url})`
              : undefined,
            backgroundColor: !category?.banner_image_url ? 'hsl(var(--muted))' : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/shop" className={category?.banner_image_url ? "text-white/80 hover:text-white" : ""}>
                    Shop
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={category?.banner_image_url ? "text-white/60" : ""} />
                <BreadcrumbItem>
                  <BreadcrumbPage className={category?.banner_image_url ? "text-white" : ""}>
                    {category?.name || <Skeleton className="h-4 w-32" />}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={category?.banner_image_url ? "text-white" : ""}
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {category?.name || <Skeleton className="h-12 w-64" />}
              </h1>
              <p className={`text-lg max-w-2xl mb-6 ${category?.banner_image_url ? "text-white/90" : "text-muted-foreground"}`}>
                {category?.description || <Skeleton className="h-6 w-full" />}
              </p>

              {/* Focus Areas */}
              {category?.focus_areas && category.focus_areas.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-sm font-medium ${category?.banner_image_url ? "text-white/70" : "text-muted-foreground"}`}>
                    Focus:
                  </span>
                  {category.focus_areas.map((focus, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary"
                      className={category?.banner_image_url ? "bg-white/20 text-white border-white/30" : ""}
                    >
                      {focus}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Vibe Tags */}
              {category?.vibe_tags && category.vibe_tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Sparkles className={`h-4 w-4 mt-0.5 ${category?.banner_image_url ? "text-white/70" : "text-muted-foreground"}`} />
                  {category.vibe_tags.map((vibe, i) => (
                    <span 
                      key={i} 
                      className={`text-sm italic ${category?.banner_image_url ? "text-white/80" : "text-muted-foreground"}`}
                    >
                      {vibe}{i < category.vibe_tags!.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="container max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {productsData?.products?.length || 0} products
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[3/4] w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : !productsData?.products?.length ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">
                No products in this category yet.
              </p>
              <Button asChild variant="outline">
                <Link to="/shop/products">Browse All Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsData.products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <MarketplaceProductCard 
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    salePrice={product.sale_price}
                    images={product.images || []}
                    designerName={product.designer_name}
                    averageRating={product.average_rating}
                    reviewCount={product.review_count}
                    isNew={product.is_new}
                    isBestseller={product.is_bestseller}
                    slug={product.slug}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* All Categories */}
        {categories && categories.length > 1 && (
          <section className="bg-muted/50 py-12">
            <div className="container max-w-6xl mx-auto px-4">
              <h2 className="text-xl font-bold mb-6">Explore Other Categories</h2>
              <div className="flex flex-wrap gap-3">
                {categories
                  .filter(c => c.slug !== slug && c.is_active)
                  .map(cat => (
                    <Link key={cat.id} to={`/shop/category/${cat.slug}`}>
                      <Badge 
                        variant="outline" 
                        className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                      >
                        {cat.name}
                      </Badge>
                    </Link>
                  ))
                }
              </div>
            </div>
          </section>
        )}
      </div>
    </MarketplaceLayout>
  );
}
