import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { X, Search, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface JobFiltersProps {
  filters: {
    search: string;
    category: string;
    jobType: string;
    locationType: string;
    salaryMin: number;
    salaryMax: number;
    featuredOnly: boolean;
  };
  onFiltersChange: (filters: JobFiltersProps['filters']) => void;
  onReset: () => void;
}

export function JobFilters({ filters, onFiltersChange, onReset }: JobFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateFilter = <K extends keyof typeof filters>(key: K, value: typeof filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.jobType !== 'all' || 
    filters.locationType !== 'all' ||
    filters.salaryMin > 0 ||
    filters.salaryMax < 500000 ||
    filters.featuredOnly;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select 
          value={filters.category} 
          onValueChange={(v) => updateFilter('category', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="fashion">Fashion Design</SelectItem>
            <SelectItem value="textile">Textile Design</SelectItem>
            <SelectItem value="jewelry">Jewelry Design</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Type */}
      <div className="space-y-2">
        <Label>Job Type</Label>
        <Select 
          value={filters.jobType} 
          onValueChange={(v) => updateFilter('jobType', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full_time">Full Time</SelectItem>
            <SelectItem value="part_time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="freelance">Freelance</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location Type */}
      <div className="space-y-2">
        <Label>Location</Label>
        <Select 
          value={filters.locationType} 
          onValueChange={(v) => updateFilter('locationType', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="onsite">On-site</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Salary Range */}
      <div className="space-y-4">
        <Label>Salary Range (Annual)</Label>
        <div className="px-2">
          <Slider
            value={[filters.salaryMin, filters.salaryMax]}
            min={0}
            max={500000}
            step={10000}
            onValueChange={([min, max]) => {
              onFiltersChange({ ...filters, salaryMin: min, salaryMax: max });
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${(filters.salaryMin / 1000).toFixed(0)}k</span>
          <span>${(filters.salaryMax / 1000).toFixed(0)}k+</span>
        </div>
      </div>

      {/* Featured Only */}
      <div className="flex items-center justify-between">
        <Label htmlFor="featured">Featured Jobs Only</Label>
        <Switch
          id="featured"
          checked={filters.featuredOnly}
          onCheckedChange={(v) => updateFilter('featuredOnly', v)}
        />
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onReset}
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs, companies, or keywords..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                Reset
              </Button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters Button */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Jobs</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
