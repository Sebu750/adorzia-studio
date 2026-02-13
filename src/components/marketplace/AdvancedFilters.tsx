import { useState } from "react";
import { Filter, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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

/**
 * Page 2: Advanced Filters for Shop/Marketplace
 * Filters: Category, Designer, Price, Fabric, Technique, Occasion, Made-to-order timeline
 * Sorting: Newest, Price, Popular
 */

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
  categories?: Array<{ id: string; name: string }>;
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

  const activeFilterCount = 
    (localFilters.categories?.length || 0) +
    (localFilters.designers?.length || 0) +
    (localFilters.fabrics?.length || 0) +
    (localFilters.techniques?.length || 0) +
    (localFilters.occasions?.length || 0) +
    (localFilters.priceRange ? 1 : 0) +
    (localFilters.timeline ? 1 : 0);

  return (
    <div className="flex items-center gap-3">
      {/* Sort Dropdown */}
      <Select 
        value={filters.sortBy || 'newest'} 
        onValueChange={(value: any) => onFilterChange({ ...filters, sortBy: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Filter Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 rounded-full px-2 py-0">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filter Products</SheetTitle>
            <SheetDescription>
              Refine your search with advanced filters
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            <Accordion type="multiple" defaultValue={['price', 'category']} className="w-full">
              {/* Price Range */}
              <AccordionItem value="price">
                <AccordionTrigger>
                  Price Range
                  {localFilters.priceRange && (
                    <Badge variant="secondary" className="ml-2">
                      ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                    </Badge>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <Slider
                      value={localFilters.priceRange || [0, 10000]}
                      onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                      max={10000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>${localFilters.priceRange?.[0] || 0}</span>
                      <span>${localFilters.priceRange?.[1] || 10000}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Categories */}
              {categories.length > 0 && (
                <AccordionItem value="category">
                  <AccordionTrigger>
                    Category
                    {localFilters.categories && localFilters.categories.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {localFilters.categories.length}
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cat-${cat.id}`}
                            checked={localFilters.categories?.includes(cat.id)}
                            onCheckedChange={() => toggleArrayFilter('categories', cat.id)}
                          />
                          <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer">
                            {cat.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Designers */}
              {designers.length > 0 && (
                <AccordionItem value="designer">
                  <AccordionTrigger>
                    Designer
                    {localFilters.designers && localFilters.designers.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {localFilters.designers.length}
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2 max-h-64 overflow-y-auto">
                      {designers.map((designer) => (
                        <div key={designer.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`designer-${designer.id}`}
                            checked={localFilters.designers?.includes(designer.id)}
                            onCheckedChange={() => toggleArrayFilter('designers', designer.id)}
                          />
                          <Label htmlFor={`designer-${designer.id}`} className="cursor-pointer">
                            {designer.brand_name || designer.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Fabrics */}
              <AccordionItem value="fabric">
                <AccordionTrigger>
                  Fabric
                  {localFilters.fabrics && localFilters.fabrics.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {localFilters.fabrics.length}
                    </Badge>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {FABRICS.map((fabric) => (
                      <div key={fabric} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fabric-${fabric}`}
                          checked={localFilters.fabrics?.includes(fabric)}
                          onCheckedChange={() => toggleArrayFilter('fabrics', fabric)}
                        />
                        <Label htmlFor={`fabric-${fabric}`} className="cursor-pointer">
                          {fabric}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Techniques */}
              <AccordionItem value="technique">
                <AccordionTrigger>
                  Technique
                  {localFilters.techniques && localFilters.techniques.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {localFilters.techniques.length}
                    </Badge>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {TECHNIQUES.map((technique) => (
                      <div key={technique} className="flex items-center space-x-2">
                        <Checkbox
                          id={`technique-${technique}`}
                          checked={localFilters.techniques?.includes(technique)}
                          onCheckedChange={() => toggleArrayFilter('techniques', technique)}
                        />
                        <Label htmlFor={`technique-${technique}`} className="cursor-pointer">
                          {technique}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Occasions */}
              <AccordionItem value="occasion">
                <AccordionTrigger>
                  Occasion
                  {localFilters.occasions && localFilters.occasions.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {localFilters.occasions.length}
                    </Badge>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {OCCASIONS.map((occasion) => (
                      <div key={occasion} className="flex items-center space-x-2">
                        <Checkbox
                          id={`occasion-${occasion}`}
                          checked={localFilters.occasions?.includes(occasion)}
                          onCheckedChange={() => toggleArrayFilter('occasions', occasion)}
                        />
                        <Label htmlFor={`occasion-${occasion}`} className="cursor-pointer">
                          {occasion}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Production Timeline */}
              <AccordionItem value="timeline">
                <AccordionTrigger>
                  Made-to-Order Timeline
                  {localFilters.timeline && (
                    <Badge variant="secondary" className="ml-2">
                      {TIMELINES.find(t => t.value === localFilters.timeline)?.label}
                    </Badge>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {TIMELINES.map((timeline) => (
                      <div key={timeline.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`timeline-${timeline.value}`}
                          checked={localFilters.timeline === timeline.value}
                          onCheckedChange={(checked) => 
                            updateFilter('timeline', checked ? timeline.value : undefined)
                          }
                        />
                        <Label htmlFor={`timeline-${timeline.value}`} className="cursor-pointer">
                          {timeline.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={clearFilters} className="flex-1">
              Clear All
            </Button>
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
