import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ShopCollections() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: collections, isLoading } = useQuery({
    queryKey: ['shop-collections'],
    queryFn: async () => {
      // First, fetch collections
      const { data: collectionsData, error } = await supabase
        .from('marketplace_collections')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching collections:', error);
        return [];
      }

      if (!collectionsData || collectionsData.length === 0) {
        return [];
      }
      
      // Fetch product counts for each collection separately
      const collectionIds = collectionsData.map(c => c.id);
      const productCountPromises = collectionIds.map(async (collectionId) => {
        const { count } = await supabase
          .from('marketplace_collection_products')
          .select('*', { count: 'exact', head: true })
          .eq('collection_id', collectionId);
        return { id: collectionId, count: count || 0 };
      });
      
      const productCounts = await Promise.all(productCountPromises);
      const countsMap = productCounts.reduce((acc, pc) => {
        acc[pc.id] = pc.count;
        return acc;
      }, {} as Record<string, number>);
      
      // Get designer IDs from collections
      const designerIds = collectionsData
        ?.filter(c => c.designer_id)
        .map(c => c.designer_id) || [];

      // Fetch designer profiles if there are designer IDs
      let designersMap: Record<string, { name: string; brand_name: string | null }> = {};
      if (designerIds.length > 0) {
        const uniqueIds = [...new Set(designerIds)];
        const { data: designersData } = await supabase
          .from('profiles')
          .select('user_id, name, brand_name')
          .in('user_id', uniqueIds);

        designersMap = designersData?.reduce((acc, d) => {
          acc[d.user_id] = d;
          return acc;
        }, {} as Record<string, { name: string; brand_name: string | null }>) || {};
      }
      
      // Transform database data to match component structure
      return collectionsData.map(collection => {
        const designer = collection.designer_id ? designersMap[collection.designer_id] : null;
        const designerName = designer 
          ? (designer.brand_name || designer.name)
          : 'Curated Selection';
        
        return {
          id: collection.id,
          name: collection.name,
          description: collection.description || '',
          season: 'Current Season',
          designer_name: designerName,
          designer_id: collection.designer_id,
          items: countsMap[collection.id] || 0,
          image_url: collection.image_url || 'https://images.unsplash.com/photo-1558769132-cb1aea1c8e86?w=1200',
          is_featured: collection.is_featured,
        };
      });
    },
  });

  const filteredCollections = collections?.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
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
              Curated
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-editorial-display mb-6"
            >
              Designer Collections
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-editorial-body text-muted-foreground mb-10 max-w-xl"
            >
              Explore curated capsules created through StyleBoxes. Each collection 
              represents a designer's unique vision and creative journey.
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
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-11 pr-4 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
                  <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections?.map((collection, i) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link 
                    to={`/shop/products?collection=${collection.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                      <img
                        src={collection.image_url}
                        alt={collection.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-sm font-medium text-background">
                          View Collection
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-background" />
                      </div>
                      {collection.is_featured && (
                        <Badge className="absolute top-4 right-4 bg-background/90 text-foreground">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-display text-xl font-medium group-hover:text-foreground/80 transition-colors">
                          {collection.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {collection.items} pieces
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {collection.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {collection.designer_name}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredCollections?.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-muted-foreground mb-4">No collections found</p>
              <p className="text-muted-foreground">
                Try adjusting your search or check back later for new collections.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-luxury-charcoal text-background">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-editorial-caption text-background/50 mb-6">Join Us</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light mb-6">
                Create Your Own Collection
              </h2>
              <p className="text-background/70 mb-8 max-w-lg mx-auto">
                Ready to showcase your work? Join our marketplace and create curated 
                collections that tell your unique story.
              </p>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-background/30 text-background hover:bg-background/10"
                asChild
              >
                <Link to="/studio-info">
                  Become a Designer
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </MarketplaceLayout>
  );
}
