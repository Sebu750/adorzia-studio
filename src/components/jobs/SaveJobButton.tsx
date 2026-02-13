import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveJobButtonProps {
  isSaved: boolean;
  isLoading?: boolean;
  onClick: () => void;
  variant?: "icon" | "full";
  className?: string;
}

export function SaveJobButton({ 
  isSaved, 
  isLoading, 
  onClick, 
  variant = "icon",
  className 
}: SaveJobButtonProps) {
  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", className)}
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSaved ? (
          <BookmarkCheck className="h-4 w-4 text-primary fill-primary" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className={className}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isSaved ? (
        <BookmarkCheck className="h-4 w-4 mr-2 fill-current" />
      ) : (
        <Bookmark className="h-4 w-4 mr-2" />
      )}
      {isSaved ? 'Saved' : 'Save'}
    </Button>
  );
}
