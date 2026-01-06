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
import { useMarketplaceProducts, useMarketplaceCategories } from "@/hooks/useMarketplaceProducts";

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'bestselling', label: 'Best Selling' },
];

export default function ShopProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentCategory = searchParams.get('category');
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search');
  const currentPage = parseInt(searchParams.get('page') || '1');

  const { data: categoriesData } = useMarketplaceCategories();
  const { data: productsData, isLoading } = useMarketplaceProducts({
    category: currentCategory || undefined,
    sort: currentSort as any,
    search: currentSearch || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
    page: currentPage,
    limit: 12,
  });

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange([0, 1000]);
  };

  const activeFiltersCount = [currentCategory, currentSearch].filter(Boolean).length +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0);

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          {categoriesData?.categories?.map((category: any) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category.id}`}
                checked={currentCategory === category.id}
                onCheckedChange={(checked) => 
                  updateFilter('category', checked ? category.id : null)
                }
              />
              <Label htmlFor={`cat-${category.id}`} className="text-sm cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={1000}
          step={10}
          className="mb-4"
        />
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
            className="w-24"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
            className="w-24"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {currentSearch ? `Search: "${currentSearch}"` : 'All Products'}
            </h1>
            {productsData && (
              <p className="text-muted-foreground">
                Showing {productsData.products?.length || 0} of {productsData.pagination?.total || 0} products
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={currentSort} onValueChange={(value) => updateFilter('sort', value)}>
              <SelectTrigger className="w-[180px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {currentCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {categoriesData?.categories?.find((c: any) => c.id === currentCategory)?.name}
                <button onClick={() => updateFilter('category', null)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {currentSearch && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {currentSearch}
                <button onClick={() => updateFilter('search', null)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                ${priceRange[0]} - ${priceRange[1]}
                <button onClick={() => setPriceRange([0, 1000])}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
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
