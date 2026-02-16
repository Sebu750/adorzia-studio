import { useQuery } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Instagram, 
  Globe, 
  Twitter, 
  Mail,
  Package,
  FolderOpen,
  Calendar,
  CheckCircle,
  XCircle,
  Ban,
  ExternalLink,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Designer } from "./AdminDesignerCard";

interface AdminDesignerProfileDrawerProps {
  designerId: string | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (designerId: string, status: 'active' | 'inactive' | 'suspended') => void;
}

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-admin-muted text-admin-muted-foreground border-admin-border/50',
  },
  suspended: {
    label: 'Suspended',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function AdminDesignerProfileDrawer({ 
  designerId, 
  open, 
  onClose, 
  onStatusChange 
}: AdminDesignerProfileDrawerProps) {
  // Fetch designer details
  const { data: designer, isLoading } = useQuery({
    queryKey: ['admin-designer-profile', designerId],
    queryFn: async () => {
      if (!designerId) return null;

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', designerId)
        .single();

      if (profileError) throw profileError;

      // Fetch product count
      const { count: productCount } = await supabase
        .from('marketplace_products')
        .select('*', { count: 'exact', head: true })
        .eq('designer_id', designerId);

      // Fetch collection count
      const { count: collectionCount } = await supabase
        .from('marketplace_collections')
        .select('*', { count: 'exact', head: true })
        .eq('designer_id', designerId);

      // Fetch total sales (sum of sold products)
      const { data: salesData } = await supabase
        .from('marketplace_products')
        .select('sold_count, price')
        .eq('designer_id', designerId);

      const totalSales = salesData?.reduce((acc, p) => acc + ((p.sold_count || 0) * (p.price || 0)), 0) || 0;

      return {
        ...profile,
        user_id: profile.user_id,
        status: 'active' as const, // Default status since profiles table might not have status column
        product_count: productCount || 0,
        collection_count: collectionCount || 0,
        total_sales: totalSales,
      };
    },
    enabled: !!designerId && open,
  });

  const statusInfo = statusConfig[designer?.status || 'active'];
  const initials = designer?.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-admin-card border-admin-border/60 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ) : designer ? (
          <>
            <SheetHeader className="pb-0">
              <SheetTitle className="sr-only">Designer Profile</SheetTitle>
            </SheetHeader>

            <div className="space-y-6 pt-6">
              {/* Header with Avatar */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 rounded-xl border-2 border-admin-border/30">
                  <AvatarImage src={designer.avatar_url || undefined} alt={designer.name} />
                  <AvatarFallback className="rounded-xl bg-admin-muted text-admin-foreground font-semibold text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-admin-foreground truncate">
                    {designer.name}
                  </h2>
                  {designer.brand_name && (
                    <p className="text-sm text-admin-muted-foreground truncate">
                      @{designer.brand_name}
                    </p>
                  )}
                  <div className="mt-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full", statusInfo.className)}
                    >
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {designer.bio && (
                <div className="bg-admin-muted/30 rounded-xl p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground mb-2">
                    About
                  </h3>
                  <p className="text-sm text-admin-foreground/90 leading-relaxed">
                    {designer.bio}
                  </p>
                </div>
              )}

              {/* Social Links */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground mb-3">
                  Social & Contact
                </h3>
                <div className="space-y-2">
                  {designer.email && (
                    <a 
                      href={`mailto:${designer.email}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-admin-muted/30 hover:bg-admin-muted/50 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-admin-muted flex items-center justify-center">
                        <Mail className="h-4 w-4 text-admin-muted-foreground" />
                      </div>
                      <span className="text-sm text-admin-foreground flex-1 truncate">{designer.email}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-admin-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {designer.instagram_handle && (
                    <a 
                      href={`https://instagram.com/${designer.instagram_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-admin-muted/30 hover:bg-admin-muted/50 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Instagram className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-admin-foreground flex-1">@{designer.instagram_handle}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-admin-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {designer.website_url && (
                    <a 
                      href={designer.website_url.startsWith('http') ? designer.website_url : `https://${designer.website_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-admin-muted/30 hover:bg-admin-muted/50 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-admin-muted flex items-center justify-center">
                        <Globe className="h-4 w-4 text-admin-muted-foreground" />
                      </div>
                      <span className="text-sm text-admin-foreground flex-1 truncate">{designer.website_url}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-admin-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {designer.twitter_handle && (
                    <a 
                      href={`https://twitter.com/${designer.twitter_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-admin-muted/30 hover:bg-admin-muted/50 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center">
                        <Twitter className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-admin-foreground flex-1">@{designer.twitter_handle}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-admin-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground mb-3">
                  Statistics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-admin-muted/30 rounded-xl p-4 text-center">
                    <Package className="h-5 w-5 text-admin-muted-foreground mx-auto mb-1.5" />
                    <p className="text-2xl font-bold text-admin-foreground">{designer.product_count}</p>
                    <p className="text-xs text-admin-muted-foreground">Products</p>
                  </div>
                  <div className="bg-admin-muted/30 rounded-xl p-4 text-center">
                    <FolderOpen className="h-5 w-5 text-admin-muted-foreground mx-auto mb-1.5" />
                    <p className="text-2xl font-bold text-admin-foreground">{designer.collection_count}</p>
                    <p className="text-xs text-admin-muted-foreground">Collections</p>
                  </div>
                  <div className="bg-admin-muted/30 rounded-xl p-4 text-center">
                    <DollarSign className="h-5 w-5 text-admin-muted-foreground mx-auto mb-1.5" />
                    <p className="text-2xl font-bold text-admin-foreground">
                      ${designer.total_sales?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-admin-muted-foreground">Total Sales</p>
                  </div>
                  <div className="bg-admin-muted/30 rounded-xl p-4 text-center">
                    <Calendar className="h-5 w-5 text-admin-muted-foreground mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-admin-foreground">
                      {designer.created_at ? format(new Date(designer.created_at), 'MMM yyyy') : 'N/A'}
                    </p>
                    <p className="text-xs text-admin-muted-foreground">Joined</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-admin-border/50" />

              {/* Actions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground mb-3">
                  Actions
                </h3>
                <div className="space-y-2">
                  {designer.status !== 'active' && (
                    <Button 
                      onClick={() => onStatusChange(designer.user_id, 'active')}
                      className="w-full justify-start h-10 bg-success/10 text-success hover:bg-success/20 border border-success/20 rounded-lg"
                      variant="ghost"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate Designer
                    </Button>
                  )}
                  {designer.status !== 'inactive' && designer.status !== 'suspended' && (
                    <Button 
                      onClick={() => onStatusChange(designer.user_id, 'inactive')}
                      className="w-full justify-start h-10 hover:bg-admin-muted/60 border border-admin-border/50 rounded-lg"
                      variant="ghost"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Deactivate Designer
                    </Button>
                  )}
                  {designer.status !== 'suspended' && (
                    <Button 
                      onClick={() => onStatusChange(designer.user_id, 'suspended')}
                      className="w-full justify-start h-10 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 rounded-lg"
                      variant="ghost"
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend Designer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-admin-muted-foreground">Designer not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
