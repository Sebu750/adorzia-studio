import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export interface FilterState {
  categories?: string[];
  designers?: string[];
  priceRange?: [number, number];
  fabrics?: string[];
  techniques?: string[];
  occasions?: string[];
  timeline?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories?: Array<{ id: string; name: string; category?: string; slug: string }>;
  designers?: Array<{ id: string; name: string; brand_name?: string }>;
}

const FABRICS = [
  'Cotton', 'Silk', 'Chiffon', 'Velvet', 'Linen', 'Wool', 
  'Satin', 'Organza', 'Georgette', 'Brocade', 'Lawn'
];

const TECHNIQUES = [
  'Embroidery', 'Block Print', 'Hand Weaving', 'Digital Print',
  'Tie-Dye', 'Appliqué', 'Beadwork', 'Mirror Work', 'Sequins'
];

const OCCASIONS = [
  'Casual', 'Formal', 'Wedding', 'Festive', 'Bridal',
  'Party', 'Office', 'Evening', 'Cocktail'
];

const TIMELINES = [
  { value: '1-2', label: '1-2 weeks' },
  { value: '2-4', label: '2-4 weeks' },
  { value: '4-6', label: '4-6 weeks' },
  { value: '6+', label: '6+ weeks' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export function AdvancedFilters({ filters, onFilterChange, categories = [], designers = [] }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [open, setOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
  };

  const toggleArrayFilter = (key: 'categories' | 'designers' | 'fabrics' | 'techniques' | 'occasions', value: string) => {
    const current = localFilters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    setOpen(false);
  };

  const clearFilters = () => {
    const cleared: FilterState = { sortBy: filters.sortBy };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const clearSingleFilter = (key: keyof FilterState, value?: string) => {
    if (key === 'priceRange' || key === 'timeline') {
      const updated = { ...filters };
      delete updated[key];
      onFilterChange(updated);
    } else if (value) {
      const current = filters[key] as string[] || [];
      onFilterChange({
        ...filters,
        [key]: current.filter(v => v !== value)
      });
    }
  };

  const activeFilterCount = 
    (filters.categories?.length || 0) +
    (filters.designers?.length || 0) +
    (filters.fabrics?.length || 0) +
    (filters.techniques?.length || 0) +
    (filters.occasions?.length || 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.timeline ? 1 : 0);

  // Get all active filters for display
  const getActiveFilters = () => {
    const active: Array<{ key: keyof FilterState; value: string; label: string }> = [];
    
    filters.categories?.forEach(catId => {
      const cat = categories.find(c => c.id === catId);
      if (cat) active.push({ key: 'categories', value: catId, label: cat.name });
    });
    
    filters.designers?.forEach(desId => {
      const des = designers.find(d => d.id === desId);
      if (des) active.push({ key: 'designers', value: desId, label: des.brand_name || des.name });
    });
    
    filters.fabrics?.forEach(fab => {
      active.push({ key: 'fabrics', value: fab, label: fab });
    });
    
    filters.techniques?.forEach(tech => {
      active.push({ key: 'techniques', value: tech, label: tech });
    });
    
    filters.occasions?.forEach(occ => {
      active.push({ key: 'occasions', value: occ, label: occ });
    });
    
    if (filters.priceRange) {
      active.push({ 
        key: 'priceRange', 
        value: 'price', 
        label: `$${filters.priceRange[0]} - $${filters.priceRange[1]}` 
      });
    }
    
    if (filters.timeline) {
      const timeline = TIMELINES.find(t => t.value === filters.timeline);
      if (timeline) active.push({ key: 'timeline', value: filters.timeline, label: timeline.label });
    }
    
    return active;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort Dropdown */}
        <Select 
          value={filters.sortBy || 'newest'} 
          onValueChange={(value: any) => onFilterChange({ ...filters, sortBy: value })}
        >
          <SelectTrigger className="w-[180px] h-10 bg-background border-border/60">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6 hidden sm:block" />

        {/* Filter Sheet Trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="gap-2 h-10 border-border/60 hover:bg-muted/50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
            {/* Header */}
            <SheetHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-editorial-title text-xl">Filters</SheetTitle>
                {activeFilterCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </SheetHeader>

            {/* Filter Content */}
            <div className="py-2">
              <Accordion type="multiple" defaultValue={['price']} className="w-full">
                {/* Price Range */}
                <AccordionItem value="price" className="border-b px-6">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span className="text-sm font-medium">Price Range</span>
                    {localFilters.priceRange && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="space-y-6 pt-2">
                      <Slider
                        value={localFilters.priceRange || [0, 10000]}
                        onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                        max={10000}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <div className="px-3 py-2 bg-muted rounded-sm">
                          <span className="text-muted-foreground">$</span>
                          <span className="font-medium ml-1">{localFilters.priceRange?.[0] || 0}</span>
                        </div>
                        <span className="text-muted-foreground">to</span>
                        <div className="px-3 py-2 bg-muted rounded-sm">
                          <span className="text-muted-foreground">$</span>
                          <span className="font-medium ml-1">{localFilters.priceRange?.[1] || 10000}</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Categories - Grouped by Main Categories */}
                {categories.length > 0 && (
                  <AccordionItem value="category" className="border-b px-6">
                    <AccordionTrigger className="py-4 hover:no-underline">
                      <span className="text-sm font-medium">Category</span>
                      {localFilters.categories && localFilters.categories.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {localFilters.categories.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-6 pt-2">
                        {/* Group categories by main category */}
                        {Array.from(new Set(categories.map(cat => cat.category || 'Other'))).map((mainCategory) => {
                          const subCategories = categories.filter(cat => (cat.category || 'Other') === mainCategory);
                          return (
                            <div key={mainCategory}>
                              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                                {mainCategory}
                              </h4>
                              <div className="space-y-2">
                                {subCategories.map((cat) => (
                                  <div key={cat.id} className="flex items-center space-x-3">
                                    <Checkbox
                                      id={`cat-${cat.id}`}
                                      checked={localFilters.categories?.includes(cat.slug || cat.id)}
                                      onCheckedChange={() => toggleArrayFilter('categories', cat.slug || cat.id)}
                                    />
                                    <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer text-sm">
                                      {cat.name}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Designers */}
                {designers.length > 0 && (
                  <AccordionItem value="designer" className="border-b px-6">
                    <AccordionTrigger className="py-4 hover:no-underline">
                      <span className="text-sm font-medium">Designer</span>
                      {localFilters.designers && localFilters.designers.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {localFilters.designers.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-3 pt-2 max-h-64 overflow-y-auto">
                        {designers.map((designer) => (
                          <div key={designer.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={`designer-${designer.id}`}
                              checked={localFilters.designers?.includes(designer.id)}
                              onCheckedChange={() => toggleArrayFilter('designers', designer.id)}
                            />
                            <Label htmlFor={`designer-${designer.id}`} className="cursor-pointer text-sm">
                              {designer.brand_name || designer.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Fabrics */}
                <AccordionItem value="fabric" className="border-b px-6">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span className="text-sm font-medium">Fabric</span>
                    {localFilters.fabrics && localFilters.fabrics.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {localFilters.fabrics.length}
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {FABRICS.map((fabric) => (
                        <div key={fabric} className="flex items-center space-x-3">
                          <Checkbox
                            id={`fabric-${fabric}`}
                            checked={localFilters.fabrics?.includes(fabric)}
                            onCheckedChange={() => toggleArrayFilter('fabrics', fabric)}
                          />
                          <Label htmlFor={`fabric-${fabric}`} className="cursor-pointer text-sm">
                            {fabric}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Techniques */}
                <AccordionItem value="technique" className="border-b px-6">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span className="text-sm font-medium">Technique</span>
                    {localFilters.techniques && localFilters.techniques.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {localFilters.techniques.length}
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {TECHNIQUES.map((technique) => (
                        <div key={technique} className="flex items-center space-x-3">
                          <Checkbox
                            id={`technique-${technique}`}
                            checked={localFilters.techniques?.includes(technique)}
                            onCheckedChange={() => toggleArrayFilter('techniques', technique)}
                          />
                          <Label htmlFor={`technique-${technique}`} className="cursor-pointer text-sm">
                            {technique}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Occasions */}
                <AccordionItem value="occasion" className="border-b px-6">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span className="text-sm font-medium">Occasion</span>
                    {localFilters.occasions && localFilters.occasions.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {localFilters.occasions.length}
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {OCCASIONS.map((occasion) => (
                        <div key={occasion} className="flex items-center space-x-3">
                          <Checkbox
                            id={`occasion-${occasion}`}
                            checked={localFilters.occasions?.includes(occasion)}
                            onCheckedChange={() => toggleArrayFilter('occasions', occasion)}
                          />
                          <Label htmlFor={`occasion-${occasion}`} className="cursor-pointer text-sm">
                            {occasion}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Production Timeline */}
                <AccordionItem value="timeline" className="border-b px-6">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span className="text-sm font-medium">Production Timeline</span>
                    {localFilters.timeline && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {TIMELINES.find(t => t.value === localFilters.timeline)?.label}
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="space-y-3 pt-2">
                      {TIMELINES.map((timeline) => (
                        <div key={timeline.value} className="flex items-center space-x-3">
                          <Checkbox
                            id={`timeline-${timeline.value}`}
                            checked={localFilters.timeline === timeline.value}
                            onCheckedChange={(checked) => 
                              updateFilter('timeline', checked ? timeline.value : undefined)
                            }
                          />
                          <Label htmlFor={`timeline-${timeline.value}`} className="cursor-pointer text-sm">
                            {timeline.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="flex-1 h-12"
                >
                  Clear All
                </Button>
                <Button 
                  onClick={applyFilters} 
                  className="flex-1 h-12"
                >
                  Show Results
                  {activeFilterCount > 0 && (
                    <span className="ml-2 text-xs opacity-80">({activeFilterCount})</span>
                  )}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2"
          >
            {activeFilters.map((filter, index) => (
              <motion.div
                key={`${filter.key}-${filter.value}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Badge 
                  variant="secondary" 
                  className="px-3 py-1.5 text-xs font-normal cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => clearSingleFilter(filter.key, filter.value)}
                >
                  {filter.label}
                  <X className="h-3 w-3 ml-2" />
                </Badge>
              </motion.div>
            ))}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground h-7"
            >
              Clear all
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
