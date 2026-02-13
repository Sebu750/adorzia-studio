import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// TODO: REMOVE MOCK DATA - Replace with real database queries
const MOCK_COLLECTIONS = [
  {
    id: "ss24-modern-minimalism",
    name: "SS24: Modern Minimalism",
    description: "Clean lines, neutral palettes, and understated elegance define this spring/summer collection.",
    season: "Spring/Summer 2024",
    designer_name: "Hongshan Feng",
    items: 12,
    image_url: "https://images.unsplash.com/photo-1558769132-cb1aea1c8e86?w=1200",
  },
  {
    id: "bridal-couture-2024",
    name: "Bridal Couture 2024",
    description: "Timeless elegance meets contemporary design in our exclusive bridal collection.",
    season: "All Season",
    designer_name: "Multiple Designers",
    items: 8,
    image_url: "https://images.unsplash.com/photo-1594552072238-3c0b0e4d25d0?w=1200",
  },
  {
    id: "urban-luxury-aw24",
    name: "AW24: Urban Luxury",
    description: "Sophisticated pieces for the modern city dweller. Warmth meets style.",
    season: "Autumn/Winter 2024",
    designer_name: "Various Designers",
    items: 15,
    image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200",
  },
  {
    id: "limited-heritage",
    name: "Limited Drop: Heritage Reimagined",
    description: "Traditional craftsmanship meets contemporary aesthetics in this exclusive capsule.",
    season: "Limited Edition",
    designer_name: "Curated Selection",
    items: 6,
    image_url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200",
  },
  {
    id: "summer-essentials",
    name: "Summer Essentials 2024",
    description: "Lightweight, breathable pieces perfect for warm weather styling.",
    season: "Summer 2024",
    designer_name: "Collective",
    items: 24,
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200",
  },
  {
    id: "sustainable-basics",
    name: "Sustainable Basics",
    description: "Eco-friendly essentials crafted from sustainable materials.",
    season: "Year-Round",
    designer_name: "Eco Collective",
    items: 18,
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200",
  },
];

export default function ShopCollections() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: collections, isLoading } = useQuery({
    queryKey: ['shop-collections'],
    queryFn: async () => {
      const { data: collectionsData, error } = await supabase
        .from('marketplace_collections')
        .select(`
          *,
          collection_products:marketplace_collection_products(count)
        `)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching collections:', error);
        // Fallback to mock data if query fails
        return MOCK_COLLECTIONS;
      }
      
      // Transform database data to match component structure
      return collectionsData.map(collection => ({
        id: collection.id,
        name: collection.name,
        description: collection.description || '',
        season: 'Current Season', // Can be added to database if needed
        designer_name: 'Curated Selection', // Can be enhanced with designer info
        items: collection.collection_products?.[0]?.count || 0,
        image_url: collection.image_url || 'https://images.unsplash.com/photo-1558769132-cb1aea1c8e86?w=1200',
      }));
    },
  });

  const filteredCollections = collections?.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MarketplaceLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-6">
                Curated Collections
              </Badge>
              <AnimatedHeading className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Designer Collections
              </AnimatedHeading>
              <p className="text-lg text-muted-foreground mb-8">
                Curated capsules created directly through StyleBoxes. Explore seasonal collections, limited drops, and designer exclusives.
              </p>
              <div className="max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-video bg-muted rounded-2xl animate-pulse" />
                  <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredCollections?.map((collection, i) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/shop/products?collection=${collection.id}`}>
                    <TiltCard tiltAmount={6}>
                      <Card className="h-full overflow-hidden group cursor-pointer">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={collection.image_url}
                            alt={collection.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/60 transition-colors flex items-center justify-center">
                            <div className="text-center text-background px-6">
                              <h3 className="font-display text-xl font-bold mb-2">{collection.name}</h3>
                              <p className="text-sm text-background/80">{collection.items} items</p>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {collection.description}
                          </p>
                          <p className="text-xs text-muted-foreground">by {collection.designer_name}</p>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredCollections?.length === 0 && (
            <div className="text-center py-12">
              <h3 className="font-display text-2xl font-bold mb-2">No collections found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or check back later for new collections.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-6 border-background/20 text-background">
              Join Us
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Create Your Own Collection
            </h2>
            <p className="text-lg text-background/80 mb-8 max-w-2xl mx-auto">
              Ready to showcase your work? Join our marketplace and create curated collections that tell your unique story.
            </p>
            <Button size="lg" variant="secondary" className="group" asChild>
              <Link to="/for-designers">
                Become a Designer
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </MarketplaceLayout>
  );
}
