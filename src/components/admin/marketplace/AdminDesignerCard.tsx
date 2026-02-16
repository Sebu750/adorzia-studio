import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Eye, 
  Pencil, 
  MoreHorizontal, 
  Package, 
  FolderOpen,
  Instagram,
  Globe,
  Twitter,
  CheckCircle,
  XCircle,
  Ban,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Designer {
  user_id: string;
  name: string;
  brand_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  status: 'active' | 'inactive' | 'suspended';
  instagram_handle?: string | null;
  website_url?: string | null;
  twitter_handle?: string | null;
  product_count: number;
  collection_count: number;
  email?: string | null;
  created_at?: string;
}

interface AdminDesignerCardProps {
  designer: Designer;
  onView: () => void;
  onEdit: () => void;
  onStatusChange: (status: 'active' | 'inactive' | 'suspended') => void;
  onViewProducts: () => void;
  onViewCollections: () => void;
}

const statusConfig = {
  active: {
    label: 'Active',
    variant: 'default' as const,
    className: 'bg-success/10 text-success border-success/20',
  },
  inactive: {
    label: 'Inactive',
    variant: 'secondary' as const,
    className: 'bg-admin-muted text-admin-muted-foreground border-admin-border/50',
  },
  suspended: {
    label: 'Suspended',
    variant: 'destructive' as const,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function AdminDesignerCard({ 
  designer, 
  onView, 
  onEdit, 
  onStatusChange,
  onViewProducts,
  onViewCollections
}: AdminDesignerCardProps) {
  const statusInfo = statusConfig[designer.status] || statusConfig.active;
  const initials = designer.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const hasSocialLinks = designer.instagram_handle || designer.website_url || designer.twitter_handle;

  return (
    <Card className="group bg-admin-card border-admin-border/60 rounded-xl shadow-sm hover:shadow-lg hover:border-admin-border transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Header with Avatar */}
        <div className="p-4 pb-3 flex items-start gap-3">
          <Avatar className="h-14 w-14 rounded-xl border-2 border-admin-border/30 group-hover:border-admin-foreground/20 transition-colors">
            <AvatarImage src={designer.avatar_url || undefined} alt={designer.name} />
            <AvatarFallback className="rounded-xl bg-admin-muted text-admin-foreground font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-admin-foreground truncate">
              {designer.name}
            </h3>
            {designer.brand_name && (
              <p className="text-xs text-admin-muted-foreground truncate">
                @{designer.brand_name}
              </p>
            )}
            <div className="mt-1.5">
              <Badge 
                variant="outline" 
                className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", statusInfo.className)}
              >
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-lg hover:bg-admin-muted text-admin-muted-foreground hover:text-admin-foreground opacity-0 group-hover:opacity-100 transition-all"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-admin-card border-admin-border/60 rounded-xl shadow-lg p-1.5 min-w-[180px]">
              <DropdownMenuItem onClick={onView} className="rounded-lg cursor-pointer py-2 px-2.5 text-sm focus:bg-admin-muted">
                <Eye className="h-4 w-4 mr-2.5 text-admin-muted-foreground" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit} className="rounded-lg cursor-pointer py-2 px-2.5 text-sm focus:bg-admin-muted">
                <Pencil className="h-4 w-4 mr-2.5 text-admin-muted-foreground" />
                Edit Info
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-admin-border/50 my-1.5" />
              <DropdownMenuItem onClick={onViewProducts} className="rounded-lg cursor-pointer py-2 px-2.5 text-sm focus:bg-admin-muted">
                <Package className="h-4 w-4 mr-2.5 text-admin-muted-foreground" />
                View Products ({designer.product_count})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewCollections} className="rounded-lg cursor-pointer py-2 px-2.5 text-sm focus:bg-admin-muted">
                <FolderOpen className="h-4 w-4 mr-2.5 text-admin-muted-foreground" />
                View Collections ({designer.collection_count})
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-admin-border/50 my-1.5" />
              
              {designer.status !== 'active' && (
                <DropdownMenuItem 
                  onClick={() => onStatusChange('active')} 
                  className="rounded-lg cursor-pointer py-2 px-2.5 text-sm text-success focus:text-success focus:bg-success/10"
                >
                  <CheckCircle className="h-4 w-4 mr-2.5" />
                  Activate
                </DropdownMenuItem>
              )}
              {designer.status !== 'inactive' && designer.status !== 'suspended' && (
                <DropdownMenuItem 
                  onClick={() => onStatusChange('inactive')} 
                  className="rounded-lg cursor-pointer py-2 px-2.5 text-sm text-admin-muted-foreground focus:bg-admin-muted"
                >
                  <XCircle className="h-4 w-4 mr-2.5" />
                  Deactivate
                </DropdownMenuItem>
              )}
              {designer.status !== 'suspended' && (
                <DropdownMenuItem 
                  onClick={() => onStatusChange('suspended')} 
                  className="rounded-lg cursor-pointer py-2 px-2.5 text-sm text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Ban className="h-4 w-4 mr-2.5" />
                  Suspend
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats */}
        <div className="px-4 pb-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-admin-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            <span className="font-medium text-admin-foreground">{designer.product_count}</span>
            <span>products</span>
          </div>
          <div className="flex items-center gap-1.5 text-admin-muted-foreground">
            <FolderOpen className="h-3.5 w-3.5" />
            <span className="font-medium text-admin-foreground">{designer.collection_count}</span>
            <span>collections</span>
          </div>
        </div>

        {/* Social Links */}
        {hasSocialLinks && (
          <div className="px-4 pb-3 flex items-center gap-2">
            {designer.instagram_handle && (
              <a 
                href={`https://instagram.com/${designer.instagram_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-lg bg-admin-muted/60 flex items-center justify-center text-admin-muted-foreground hover:text-admin-foreground hover:bg-admin-muted transition-colors"
                title={`@${designer.instagram_handle}`}
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
            )}
            {designer.website_url && (
              <a 
                href={designer.website_url.startsWith('http') ? designer.website_url : `https://${designer.website_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-lg bg-admin-muted/60 flex items-center justify-center text-admin-muted-foreground hover:text-admin-foreground hover:bg-admin-muted transition-colors"
                title="Website"
              >
                <Globe className="h-3.5 w-3.5" />
              </a>
            )}
            {designer.twitter_handle && (
              <a 
                href={`https://twitter.com/${designer.twitter_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-lg bg-admin-muted/60 flex items-center justify-center text-admin-muted-foreground hover:text-admin-foreground hover:bg-admin-muted transition-colors"
                title={`@${designer.twitter_handle}`}
              >
                <Twitter className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-4 pb-4 pt-2 border-t border-admin-border/30 flex items-center gap-2">
          <Button 
            onClick={onView}
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs border-admin-border/60 hover:bg-admin-muted/60 rounded-lg"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            View
          </Button>
          <Button 
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs border-admin-border/60 hover:bg-admin-muted/60 rounded-lg"
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
