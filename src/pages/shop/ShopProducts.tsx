import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { AdvancedFilters, FilterState } from "@/components/marketplace/AdvancedFilters";
import { useMarketplaceProducts, useMarketplaceCategories } from "@/hooks/useMarketplaceProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'bestselling', label: 'Most Popular' },
];

export default function ShopProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Use local category data
  const categoriesData = {
    data: [
      // Couture & Bespoke Fashion
      { id: "1", name: "Bridal & Wedding Gowns", category: "Couture & Bespoke", slug: "bridal-wedding-gowns" },
      { id: "2", name: "Evening & Red Carpet", category: "Couture & Bespoke", slug: "evening-red-carpet" },
      { id: "3", name: "Custom Tailored Suits", category: "Couture & Bespoke", slug: "custom-tailored-suits" },
      { id: "4", name: "Couture Ready-to-Wear", category: "Couture & Bespoke", slug: "couture-ready-to-wear" },
      
      // Limited Edition Clothing
      { id: "5", name: "Seasonal Dresses", category: "Limited Edition", slug: "seasonal-dresses" },
      { id: "6", name: "Tops & Shirts", category: "Limited Edition", slug: "tops-shirts" },
      { id: "7", name: "Pants & Skirts", category: "Limited Edition", slug: "pants-skirts" },
      { id: "8", name: "Outerwear & Jackets", category: "Limited Edition", slug: "outerwear-jackets" },
      { id: "9", name: "Knitwear & Sweaters", category: "Limited Edition", slug: "knitwear-sweaters" },
      
      // Designer Accessories
      { id: "10", name: "Luxury Bags & Clutches", category: "Accessories", slug: "luxury-bags-clutches" },
      { id: "11", name: "Custom Shoes", category: "Accessories", slug: "custom-shoes" },
      { id: "12", name: "Scarves & Shawls", category: "Accessories", slug: "scarves-shawls" },
      { id: "13", name: "Belts & Gloves", category: "Accessories", slug: "belts-gloves" },
      { id: "14", name: "Statement Headpieces", category: "Accessories", slug: "statement-headpieces" },
      
      // Fine Jewelry & Watches
      { id: "15", name: "Necklaces & Pendants", category: "Jewelry & Watches", slug: "necklaces-pendants" },
      { id: "16", name: "Earrings", category: "Jewelry & Watches", slug: "earrings" },
      { id: "17", name: "Bracelets & Bangles", category: "Jewelry & Watches", slug: "bracelets-bangles" },
      { id: "18", name: "Rings", category: "Jewelry & Watches", slug: "rings" },
      { id: "19", name: "Designer Watches", category: "Jewelry & Watches", slug: "designer-watches" },
      
      // Custom / Made-to-Order Fashion
      { id: "20", name: "Personalized Clothing", category: "Custom Fashion", slug: "personalized-clothing" },
      { id: "21", name: "Bespoke Accessories", category: "Custom Fashion", slug: "bespoke-accessories" },
      { id: "22", name: "Tailored Couture", category: "Custom Fashion", slug: "tailored-couture" },
      
      // Exclusive Collections
      { id: "23", name: "Seasonal Designer Drops", category: "Exclusive Collections", slug: "seasonal-designer-drops" },
      { id: "24", name: "One-of-a-Kind Pieces", category: "Exclusive Collections", slug: "one-of-a-kind" },
      { id: "25", name: "Designer Collaborations", category: "Exclusive Collections", slug: "designer-collaborations" },
      
      // Sustainable / Artisan Fashion
      { id: "26", name: "Eco-Conscious Luxury", category: "Sustainable Fashion", slug: "eco-conscious-luxury" },
      { id: "27", name: "Handcrafted Artisan", category: "Sustainable Fashion", slug: "handcrafted-artisan" },
      { id: "28", name: "Limited Batch", category: "Sustainable Fashion", slug: "limited-batch" },
    ]
  };
  const { data: designersData } = useQuery({
    queryKey: ['shop-designers-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, brand_name')
        .not('name', 'is', null)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: productsData, isLoading } = useMarketplaceProducts({
    category: searchParams.get('category') || filters.categories?.[0] || undefined,
    designer: filters.designers?.[0] || undefined,
    sort: filters.sortBy as any,
    minPrice: filters.priceRange?.[0],
    maxPrice: filters.priceRange?.[1],
    page: currentPage,
    limit: 24,
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = useCallback(() => {
    setFilters({ sortBy: 'newest' });
    setCurrentPage(1);
  }, []);

  const activeFiltersCount = 
    (filters.categories?.length || 0) + 
    (filters.designers?.length || 0) +
    (filters.priceRange ? 1 : 0);

  return (
    <MarketplaceLayout>
      {/* Header */}
      <section className="pt-32 pb-12">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-editorial-caption text-muted-foreground mb-4">Browse</p>
            <h1 className="text-editorial-display mb-4">All Products</h1>
            {productsData && (
              <p className="text-muted-foreground">
                {productsData.pagination?.total || 0} pieces available
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-20 z-30 bg-background/95 backdrop-blur-sm border-y border-border">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
                  className="h-9 pl-3 pr-8 text-sm bg-muted border-0 rounded-md appearance-none cursor-pointer focus-visible:ring-1"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border"
            >
              <span className="text-xs text-muted-foreground">Active:</span>
              {filters.categories?.map((cat) => (
                <Badge key={cat} variant="secondary" className="gap-1">
                  {cat}
                  <button onClick={() => handleFilterChange({ ...filters, categories: filters.categories?.filter(c => c !== cat) })}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.designers?.map((des) => (
                <Badge key={des} variant="secondary" className="gap-1">
                  {designersData?.find(d => d.id === des)?.brand_name || 'Designer'}
                  <button onClick={() => handleFilterChange({ ...filters, designers: filters.designers?.filter(d => d !== des) })}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.priceRange && (
                <Badge variant="secondary" className="gap-1">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  <button onClick={() => handleFilterChange({ ...filters, priceRange: undefined })}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7">
                Clear all
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <AdvancedFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categoriesData?.map((c: any) => ({ id: c.id, name: c.name })) || []}
          designers={designersData || []}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Products Grid */}
      <section className="py-12 pb-24">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : productsData?.products?.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-muted-foreground mb-4">No products found</p>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms.
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {productsData?.products?.map((product: any, i: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
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

              {/* Pagination */}
              {productsData?.pagination && productsData.pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-16">
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(productsData.pagination.totalPages, 5))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => setCurrentPage(pageNum)}
                          className="h-10 w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    disabled={currentPage >= productsData.pagination.totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </MarketplaceLayout>
  );
}
