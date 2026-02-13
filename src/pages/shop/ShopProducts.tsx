import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Grid, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { AdvancedFilters, FilterState } from "@/components/marketplace/AdvancedFilters";
import { useMarketplaceProducts, useMarketplaceCategories } from "@/hooks/useMarketplaceProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'bestselling', label: 'Best Selling' },
];

export default function ShopProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'newest',
  });

  const { data: categoriesData } = useMarketplaceCategories();
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
    category: filters.categories?.[0] || undefined,
    designer: filters.designers?.[0] || undefined,
    sort: filters.sortBy as any,
    minPrice: filters.priceRange?.[0],
    maxPrice: filters.priceRange?.[1],
    limit: 24,
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Products</h1>
            {productsData && (
              <p className="text-muted-foreground">
                Showing {productsData.products?.length || 0} of {productsData.pagination?.total || 0} products
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Advanced Filters */}
            <AdvancedFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categoriesData?.categories?.map((c: any) => ({ id: c.id, name: c.name })) || []}
              designers={designersData || []}
            />

            {/* View Mode */}
            <div className="hidden md:flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="rounded-none rounded-l-md"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="rounded-none rounded-r-md"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-[2/3] bg-white border border-slate-100 animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-slate-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : productsData?.products?.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 md:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {productsData?.products?.map((product: any) => (
                    <MarketplaceProductCard
                      key={product.id}
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
                  ))}
                </div>

                {/* Pagination */}
                {productsData?.pagination && productsData.pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      disabled={currentPage <= 1}
                      onClick={() => updateFilter('page', String(currentPage - 1))}
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
                            onClick={() => updateFilter('page', String(pageNum))}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      disabled={currentPage >= productsData.pagination.totalPages}
                      onClick={() => updateFilter('page', String(currentPage + 1))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
