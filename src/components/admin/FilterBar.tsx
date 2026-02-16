import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder: string;
  }[];
  onFilterClick?: () => void;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onFilterClick
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-admin-muted/40 rounded-xl border border-admin-border/60">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-muted-foreground/60" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 bg-admin-card border-admin-border/60 rounded-lg focus:ring-2 focus:ring-admin-foreground/10 focus:border-admin-foreground/30 transition-all text-admin-foreground placeholder:text-admin-muted-foreground/50"
        />
      </div>
      {filters.map((filter, index) => (
        <Select key={index} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger className="w-full sm:w-[160px] h-10 bg-admin-card border-admin-border/60 rounded-lg focus:ring-2 focus:ring-admin-foreground/10 text-admin-foreground text-sm">
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-admin-card border-admin-border/60 rounded-lg">
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-sm focus:bg-admin-muted">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {onFilterClick && (
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 shrink-0 rounded-lg border-admin-border/60 hover:bg-admin-muted hover:border-admin-border transition-all" 
          onClick={onFilterClick}
        >
          <SlidersHorizontal className="h-4 w-4 text-admin-muted-foreground" />
        </Button>
      )}
    </div>
  );
}
