import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, Share2, Heart, ArrowLeft, ArrowUpRight,
  Instagram, Globe, Mail, Package, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFollowDesigner } from "@/hooks/useGlobalSearch";
import { useToast } from "@/hooks/use-toast";

export default function ShopDesignerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isCustomer } = useAuth();
  const { toast } = useToast();
  const { followDesigner, unfollowDesigner, isFollowing: checkIsFollowing } = useFollowDesigner();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Check if user is following this designer
  useEffect(() => {
    if (user && id) {
      checkIsFollowing(id).then(setIsFollowing);
    }
  }, [user, id, checkIsFollowing]);

  // Fetch designer profile
  const { data: designer, isLoading } = useQuery({
    queryKey: ['designer-profile', id],
    queryFn: async () => {
      if (!id) return null;

      // Fetch designer profile
      // No approval required - all designers with brand names are visible
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          name, 
          avatar_url, 
          bio, 
          category, 
          xp,
          brand_name,
          banner_image,
          location,
          education,
          manufacturing_countries,
          artist_statement,
          website_url,
          instagram_handle,
          twitter_handle,
          linkedin_url,
          sustainability_practices
        `)
        .eq('user_id', id)
        .not('brand_name', 'is', null)
        .single();

      // Handle case where designer doesn't exist
      if (error && error.code === 'PGRST116') {
        // No rows returned - designer not found
        return null;
      }
      
      if (error) {
        console.error('Error fetching designer profile:', error);
        throw error;
      }
      
      // Map to UI format
      return {
        ...data,
        id: data.user_id, // Map user_id to id for compatibility
        brand_name: data.brand_name || data.name?.toUpperCase(),
        social_links: {
          website: data.website_url,
          instagram: data.instagram_handle ? `https://instagram.com/${data.instagram_handle}` : null,
          twitter: data.twitter_handle ? `https://twitter.com/${data.twitter_handle}` : null,
          linkedin: data.linkedin_url
        }
      };
    },
  });

  // Fetch real products query
  const { data: products } = useQuery({
    queryKey: ['designer-products', id],
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
        .from('marketplace_products')
        .select('id, title, price, images, slug, is_made_to_order, is_limited_edition, edition_size')
        .eq('designer_id', id)
        .eq('status', 'live')
        .order('created_at', { ascending: false })
        .limit(12);

      // Handle case where no products exist
      if (error) {
        console.error('Error fetching designer products:', error);
        return [];
      }
      
      return data || [];
    },
  });

  // Fetch real articles query
  const { data: editorials } = useQuery({
    queryKey: ['designer-editorials', designer?.user_id],
    enabled: !!designer?.user_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, featured_image, category, excerpt')
        .eq('author_id', designer!.user_id)
        .eq('status', 'published')
        .limit(4);

      // Handle case where no articles exist
      if (error) {
        console.error('Error fetching designer articles:', error);
        return [];
      }
      
      return data || [];
    },
  });

  // Fetch designer collections
  const { data: collections } = useQuery({
    queryKey: ['designer-collections', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
        .from('marketplace_collections')
        .select(`
          id,
          name,
          slug,
          description,
          image_url,
          is_featured,
          collection_products:marketplace_collection_products(count)
        `)
        .eq('designer_id', id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6);

      // Handle case where no collections exist
      if (error) {
        console.error('Error fetching designer collections:', error);
        return [];
      }
      
      return data?.map(collection => ({
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        description: collection.description || '',
        image_url: collection.image_url || 'https://images.unsplash.com/photo-1558769132-cb1aea1c8e86?w=1200',
        is_featured: collection.is_featured,
        items: collection.collection_products?.[0]?.count || 0,
      })) || [];
    },
  });

  if (isLoading) {
    return (
      <MarketplaceLayout>
        <div className="pt-32 pb-20">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
            <div className="animate-pulse space-y-8">
              <div className="h-[50vh] bg-gray-200 rounded-lg" />
              <div className="h-32 bg-gray-200 rounded-lg max-w-2xl" />
            </div>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  if (!designer) {
    return (
      <MarketplaceLayout>
        <div className="pt-32 pb-20 text-center">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="font-display text-3xl text-gray-900 mb-4">Designer Not Found</h1>
            <p className="text-gray-600 mb-8">The designer you're looking for doesn't exist.</p>
            <Button asChild className="bg-gray-900 text-white hover:bg-gray-800">
              <Link to="/shop/designers">Explore Designers</Link>
            </Button>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-end">
        {designer.banner_image ? (
          <img
            src={designer.banner_image}
            alt={designer.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-gray-900 hover:text-gray-600 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
            >
              <Link to="/shop/designers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Designers
              </Link>
            </Button>
          </div>
        </div>

        {/* Designer Info */}
        <div className="relative w-full pb-16 md:pb-24">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10"
            >
              {/* Avatar */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white bg-gray-100 flex-shrink-0">
                {designer.avatar_url ? (
                  <img
                    src={designer.avatar_url}
                    alt={designer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="font-display text-4xl text-gray-500">
                      {designer.name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-3">
                  {designer.brand_name || designer.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  {designer.category && (
                    <span className="text-sm">{designer.category}</span>
                  )}
                  {designer.location && (
                    <>
                      <span className="hidden md:inline text-gray-400">·</span>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-gray-500" />
                        {designer.location}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 gap-2"
                >
                  <Link to={`/portfolio/${id}`}>
                    <Briefcase className="h-4 w-4" />
                    View Portfolio
                  </Link>
                </Button>
                <Button
                  variant={isFollowing ? "default" : "outline"}
                  size="lg"
                  onClick={async () => {
                    if (!user) {
                      navigate('/shop/auth', { state: { from: location.pathname } });
                      return;
                    }
                    if (!isCustomer) {
                      toast({
                        title: "Customer account required",
                        description: "Please sign in as a customer to follow designers.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setIsFollowLoading(true);
                    try {
                      if (isFollowing) {
                        await unfollowDesigner(id!);
                        setIsFollowing(false);
                        toast({ title: "Unfollowed", description: `You are no longer following ${designer.brand_name || designer.name}` });
                      } else {
                        await followDesigner(id!);
                        setIsFollowing(true);
                        toast({ title: "Following", description: `You are now following ${designer.brand_name || designer.name}` });
                      }
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update follow status. Please try again.",
                        variant: "destructive",
                      });
                    } finally {
                      setIsFollowLoading(false);
                    }
                  }}
                  disabled={isFollowLoading}
                  className={`gap-2 ${isFollowing 
                    ? 'bg-gray-900 text-white hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <Heart className={`h-4 w-4 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-11 w-11 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={async () => {
                    const shareUrl = `${window.location.origin}/shop/designer/${id}`;
                    const shareData = {
                      title: `${designer.brand_name || designer.name} on Adorzia`,
                      text: `Check out ${designer.brand_name || designer.name} on Adorzia!`,
                      url: shareUrl,
                    };
                    
                    if (navigator.share) {
                      try {
                        await navigator.share(shareData);
                      } catch (err) {
                        // User cancelled or share failed
                      }
                    } else {
                      // Fallback: copy to clipboard
                      try {
                        await navigator.clipboard.writeText(shareUrl);
                        toast({
                          title: "Link copied!",
                          description: "Designer profile link copied to clipboard.",
                        });
                      } catch (err) {
                        toast({
                          title: "Share",
                          description: shareUrl,
                        });
                      }
                    }
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-24 md:pb-32">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_380px] gap-16">
            {/* Main Content */}
            <div className="space-y-16">
              {/* About */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-editorial-caption text-gray-500 mb-4">About</p>
                <div className="prose prose-lg max-w-none">
                  <p className="text-editorial-body text-gray-800 leading-relaxed">
                    {designer.bio || designer.artist_statement || `${designer.brand_name || designer.name} is a talented designer creating exceptional pieces that blend traditional craftsmanship with contemporary aesthetics.`}
                  </p>
                </div>
                {designer.artist_statement && designer.artist_statement !== designer.bio && (
                  <blockquote className="mt-8 pl-6 border-l-2 border-gray-200 italic text-lg text-gray-600">
                    "{designer.artist_statement}"
                  </blockquote>
                )}
              </motion.section>

              <Separator className="bg-gray-200" />

              {/* Collections */}
              {collections && collections.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-editorial-caption text-gray-500">Collections</p>
                    <span className="text-sm text-gray-500">{collections.length} collections</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collections.map((collection) => (
                      <Link 
                        key={collection.id} 
                        to={`/shop/products?collection=${collection.id}`}
                        className="group relative aspect-[4/3] overflow-hidden rounded-lg"
                      >
                        <img
                          src={collection.image_url}
                          alt={collection.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="font-display text-xl font-medium text-white mb-1">
                            {collection.name}
                          </h3>
                          <p className="text-sm text-white/70">{collection.items} pieces</p>
                        </div>
                        {collection.is_featured && (
                          <Badge className="absolute top-4 right-4 bg-white/90 text-gray-900 border-0">
                            Featured
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                </motion.section>
              )}

              <Separator className="bg-gray-200" />

              {/* Products */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-8">
                  <p className="text-editorial-caption text-gray-500">Products</p>
                  <span className="text-sm text-gray-500">{products?.length || 0} pieces</span>
                </div>

                {products && products.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {products.map((product: any) => (
                      <MarketplaceProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        images={product.images || []}
                        brandName={designer.brand_name}
                        designerName={designer.name}
                        designerId={designer.id}
                        slug={product.slug}
                        isMadeToOrder={product.is_made_to_order}
                        isLimitedEdition={product.is_limited_edition}
                        editionSize={product.edition_size}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No products available yet. Check back soon.
                    </p>
                  </div>
                )}
              </motion.section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
              {/* Connect */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-editorial-caption text-gray-500 mb-4">Connect</p>
                <div className="space-y-3">
                  {designer.instagram_handle && (
                    <a
                      href={`https://instagram.com/${designer.instagram_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors group border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <Instagram className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Instagram</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </a>
                  )}
                  {designer.website_url && (
                    <a
                      href={designer.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors group border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Website</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </a>
                  )}
                  <a
                    href={`mailto:hello@adorzia.com`}
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors group border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Contact</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </a>
                </div>
              </div>

              {/* Custom Inquiries */}
              <div className="p-6 bg-gray-900 text-white rounded-lg">
                <h3 className="font-display text-xl font-medium mb-2">Custom Inquiries</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Interested in bespoke pieces or collaboration opportunities?
                </p>
                <Button
                  variant="secondary"
                  className="w-full bg-white text-gray-900 hover:bg-gray-100"
                  asChild
                >
                  <a href="mailto:hello@adorzia.com">
                    Get in Touch
                  </a>
                </Button>
              </div>

              {/* Sustainability */}
              {designer.sustainability_practices && designer.sustainability_practices.length > 0 && (
                <div className="p-6 bg-gray-50 rounded-lg">
                  <p className="text-editorial-caption text-gray-500 mb-4">Sustainability</p>
                  <ul className="space-y-2">
                    {designer.sustainability_practices.map((practice: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}