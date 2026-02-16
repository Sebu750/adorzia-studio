import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: TablePaginationProps) {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-admin-border/60 bg-admin-muted/20">
      <p className="text-sm text-admin-muted-foreground">
        Showing <span className="font-semibold text-admin-foreground">{start}-{end}</span> of{" "}
        <span className="font-semibold text-admin-foreground">{totalItems}</span> results
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-9 w-9 rounded-lg border-admin-border/60 hover:bg-admin-muted hover:border-admin-border disabled:opacity-40"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 px-3 rounded-lg border-admin-border/60 hover:bg-admin-muted hover:border-admin-border gap-1.5 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </Button>
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-admin-muted-foreground/60 text-sm">...</span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                  page === currentPage 
                    ? "bg-admin-foreground text-admin-background hover:bg-admin-foreground/90" 
                    : "hover:bg-admin-muted text-admin-foreground"
                )}
                onClick={() => typeof page === 'number' && onPageChange(page)}
              >
                {page}
              </Button>
            )
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 px-3 rounded-lg border-admin-border/60 hover:bg-admin-muted hover:border-admin-border gap-1.5 disabled:opacity-40"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 rounded-lg border-admin-border/60 hover:bg-admin-muted hover:border-admin-border disabled:opacity-40"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
