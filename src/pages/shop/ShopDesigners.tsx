import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
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
  website_url?: string | null;
  instagram_handle?: string | null;
  xp: number;
  product_count?: number;
  product_images?: string[];
  rating?: number;
  signature_style?: string;
  awards?: string[];
}

export default function ShopDesigners() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch designers with product counts and sample images
  const { data: designers, isLoading } = useQuery({
    queryKey: ['shop-designers'],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id, name, avatar_url, bio, brand_name, category, location, website_url, instagram_handle, xp, awards')
        .not('name', 'is', null);

      const { data: profileData, error } = await query;
      if (error) throw error;

      // Fetch product counts for real designers
      const designersWithProducts = await Promise.all(
        (profileData || []).map(async (profile) => {
          const { count } = await supabase
            .from('marketplace_products')
            .select('*', { count: 'exact', head: true })
            .eq('designer_id', profile.id)
            .eq('status', 'live');

          const { data: products } = await supabase
            .from('marketplace_products')
            .select('images')
            .eq('designer_id', profile.id)
            .eq('status', 'live')
            .limit(4);

          const productImages = products
            ?.flatMap(p => (Array.isArray(p.images) ? p.images : []))
            .filter((img): img is string => typeof img === 'string')
            .slice(0, 4) || [];

          return {
            ...profile,
            product_count: count || 0,
            product_images: productImages,
            rating: 4.5 + Math.random() * 0.4, // Mock rating for now
          };
        })
      );

      return designersWithProducts.filter(d => d.product_count > 0);
    },
  });

  const filteredDesigners = designers?.filter(d =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MarketplaceLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-4">
                Rising Stars
              </Badge>
              <AnimatedHeading className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Our Designers
              </AnimatedHeading>
              <p className="text-lg text-muted-foreground mb-8">
                Discover emerging talent from across Pakistan. Each designer brings unique perspectives and exceptional craftsmanship.
              </p>
              <div className="max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Search designers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Designers Grid */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[16/9] bg-muted rounded-2xl animate-pulse" />
                  <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDesigners?.map((designer, i) => {
                const profileLink = `/shop/designer/${designer.id}`;

                return (
                  <motion.div
                    key={designer.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={profileLink}>
                      <TiltCard tiltAmount={8}>
                        <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                          <div className="aspect-[16/9] relative overflow-hidden">
                            {designer.product_images && designer.product_images.length > 0 ? (
                              <>
                                <img
                                  src={designer.product_images[0]}
                                  alt={designer.name || 'Designer'}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h3 className="font-display font-semibold text-lg">{designer.name}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-1">{designer.category}</p>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Package className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {designer.bio || 'Designer specializing in unique handcrafted pieces.'}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{designer.product_count || 0} products</span>
                              {designer.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-primary text-primary" />
                                  <span className="font-medium">{designer.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </TiltCard>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!isLoading && filteredDesigners?.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold mb-2">No designers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or check back later for new designers.
              </p>
            </div>
          )}
        </div>
      </section>
    </MarketplaceLayout>
  );
}
