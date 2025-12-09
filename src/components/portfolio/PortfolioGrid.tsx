import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Upload, 
  Check,
  ExternalLink,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PortfolioItemProps {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  status: "draft" | "completed" | "published" | "pending";
  createdAt: string;
  source: "stylebox" | "upload";
}

interface PortfolioGridProps {
  items: PortfolioItemProps[];
}

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" as const, icon: Edit },
  completed: { label: "Completed", variant: "success" as const, icon: Check },
  published: { label: "Published", variant: "accent" as const, icon: ExternalLink },
  pending: { label: "Pending Review", variant: "warning" as const, icon: Clock },
};

export function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => {
        const status = statusConfig[item.status];
        const StatusIcon = status.icon;

        return (
          <Card key={item.id} hover className="overflow-hidden group">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Quick actions overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
                  <Eye className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
                  <Edit className="h-5 w-5" />
                </Button>
              </div>

              {/* Status badge */}
              <div className="absolute top-3 right-3">
                <Badge variant={status.variant} className="gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>
              </div>

              {/* Source indicator */}
              <div className="absolute top-3 left-3">
                <Badge variant="outline" className="bg-background/80 text-foreground border-0 text-xs">
                  {item.source === "stylebox" ? "Stylebox" : "Uploaded"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-semibold truncate">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Upload className="h-4 w-4 mr-2" />
                      Request Publish
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{item.createdAt}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
