import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Designer {
  id: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  brand_name?: string | null;
  category: string | null;
  location?: string | null;
  banner_image?: string | null;
  style_credits: number;
  product_count?: number;
  product_images?: string[];
  is_featured?: boolean;
}

export default function ShopDesigners() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch only APPROVED designers with product counts and sample images
  const { data: designers, isLoading } = useQuery({
    queryKey: ['shop-designers'],
    queryFn: async () => {
      // Fetch ALL designers with product counts and sample images
      // No approval required - all designers with brand names are visible
      let query = supabase
        .from('profiles')
        .select('user_id, name, avatar_url, bio, brand_name, category, location, xp, is_featured, banner_image')
        .not('name', 'is', null);

      const { data: profileData, error } = await query;
      if (error) throw error;

      // Fetch product counts for approved designers
      const designersWithProducts = await Promise.all(
        (profileData || []).map(async (profile) => {
          const { count } = await supabase
            .from('marketplace_products')
            .select('*', { count: 'exact', head: true })
            .eq('designer_id', profile.user_id)
            .eq('status', 'live');

          const { data: products } = await supabase
            .from('marketplace_products')
            .select('images')
            .eq('designer_id', profile.user_id)
            .eq('status', 'live')
            .limit(4);

          const productImages = products
            ?.flatMap(p => (Array.isArray(p.images) ? p.images : []))
            .filter((img): img is string => typeof img === 'string')
            .slice(0, 4) || [];

          return {
            id: profile.user_id,
            name: profile.name,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            brand_name: profile.brand_name,
            category: profile.category,
            location: profile.location,
            banner_image: profile.banner_image,
            style_credits: profile.xp || 0,
            product_count: count || 0,
            product_images: productImages,
            is_featured: profile.is_featured || false,
          };
        })
      );

      // Sort: featured designers first, then by style credits (xp)
      return designersWithProducts.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return (b.style_credits || 0) - (a.style_credits || 0);
      });
    },
  });

  const filteredDesigners = designers?.filter(d =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.brand_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MarketplaceLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-editorial-caption text-muted-foreground mb-4"
            >
              Rising Stars
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-editorial-display mb-6"
            >
              Our Designers
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-editorial-body text-muted-foreground mb-10 max-w-xl"
            >
              Discover emerging talent from across Pakistan. Each designer brings 
              unique perspectives, exceptional craftsmanship, and a distinct creative vision.
            </motion.p>
            
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative max-w-md"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search designers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-11 pr-4 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Designers Grid */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
                  <div className="h-6 bg-muted rounded animate-pulse w-2/3" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDesigners?.map((designer, i) => (
                <motion.div
                  key={designer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link 
                    to={`/shop/designer/${designer.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted mb-4">
                      {/* Background Banner */}
                      {designer.banner_image ? (
                        <div className="absolute inset-0">
                          <img
                            src={designer.banner_image}
                            alt={`${designer.brand_name || designer.name} banner`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"></div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                      )}
                      
                      {/* Profile Picture */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="w-16 h-16 rounded-full border-4 border-background overflow-hidden bg-background shadow-lg">
                          {designer.avatar_url ? (
                            <img
                              src={designer.avatar_url}
                              alt={designer.name || "Designer"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <span className="font-display text-xl text-muted-foreground">
                                {(designer.name || "?").charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Featured Badge */}
                      {designer.is_featured && (
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white border-0">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-sm font-medium text-background">
                          View Profile
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-background" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-display text-xl font-medium group-hover:text-foreground/80 transition-colors">
                            {designer.brand_name || designer.name}
                          </h3>
                          {designer.brand_name && (
                            <p className="text-sm text-muted-foreground">
                              by {designer.name}
                            </p>
                          )}
                          {designer.category && !designer.brand_name && (
                            <p className="text-sm text-muted-foreground">
                              {designer.category}
                            </p>
                          )}
                        </div>
                        {designer.product_count !== undefined && designer.product_count > 0 && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {designer.product_count} pieces
                          </Badge>
                        )}
                      </div>
                      {designer.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {designer.location}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredDesigners?.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-muted-foreground mb-4">No designers found</p>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or check back later for new designers.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>
    </MarketplaceLayout>
  );
}
