import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, ExternalLink, Share2, Heart, ChevronLeft, 
  Instagram, Twitter, Globe, Mail, Package, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// END MOCK DATA

export default function ShopDesignerProfile() {
  const { id } = useParams<{ id: string }>();
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch designer profile
  const { data: designer, isLoading } = useQuery({
    queryKey: ['designer-profile', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, 
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
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Map to UI format
      return {
        ...data,
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
        .select('id, title, price, images, slug')
        .eq('designer_id', id)
        .eq('status', 'live')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
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

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <MarketplaceLayout>
        <div className="container py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-80 bg-slate-100" />
            <div className="h-32 bg-slate-100" />
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  if (!designer) {
    return (
      <MarketplaceLayout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-light mb-4">Designer Not Found</h1>
          <Button asChild>
            <Link to="/shop/designers">Back to Designers</Link>
          </Button>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] bg-slate-100">
        {designer.banner_image ? (
          <img
            src={designer.banner_image}
            alt={designer.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-8 left-0 right-0 container">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:bg-white/20"
          >
            <Link to="/shop/designers">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Explore Designers
            </Link>
          </Button>
        </div>

        {/* Designer Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-6"
            >
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src={designer.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">{designer.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-[48px] font-light tracking-tight text-white mb-2">
                  {designer.brand_name || designer.name}
                </h1>
                {designer.location && (
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="h-4 w-4" />
                    <span className="text-[14px]">{designer.location}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant={isFollowing ? "secondary" : "default"}
                  size="lg"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="gap-2"
                >
                  <Heart className={`h-4 w-4 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? 'Loved' : 'Love'}
                </Button>
                <Button variant="secondary" size="lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          {/* Main Content */}
          <div className="space-y-16">
            {/* About Designer */}
            <section>
              <h2 className="text-[12px] uppercase tracking-widest text-black mb-6 font-bold">
                About the Designer
              </h2>
              <div className="space-y-6">
                <p className="text-[15px] text-slate-700 leading-relaxed">
                  {designer.bio || designer.artist_statement}
                </p>
                
                {designer.education && designer.education.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[13px] font-medium text-black">Education</p>
                      <p className="text-[13px] text-slate-600">
                        {Array.isArray(designer.education) ? designer.education.join(', ') : designer.education}
                      </p>
                    </div>
                  </div>
                )}

                {designer.manufacturing_countries && designer.manufacturing_countries.length > 0 && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[13px] font-medium text-black">Manufacturing</p>
                      <p className="text-[13px] text-slate-600">
                        {designer.manufacturing_countries.join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {designer.artist_statement && designer.artist_statement !== designer.bio && (
                  <div className="p-6 bg-slate-50 border border-slate-100 italic">
                    <p className="text-[14px] text-slate-700 leading-relaxed">
                      "{designer.artist_statement}"
                    </p>
                  </div>
                )}
              </div>
            </section>

            <Separator className="bg-slate-100" />

            {/* Products Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[12px] uppercase tracking-widest text-black font-bold">
                  Collection ({products?.length || 0})
                </h2>
              </div>

              {products && products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 border border-slate-100">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-[14px]">
                    No products available yet. Check back soon.
                  </p>
                </div>
              )}
            </section>

            {/* Editorial Section */}
            {editorials && editorials.length > 0 && (
              <>
                <Separator className="bg-slate-100" />
                <section>
                  <h2 className="text-[12px] uppercase tracking-widest text-black mb-6 font-bold">
                    Editorial & Features
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {editorials.map((editorial) => (
                      <div key={editorial.id} className="group cursor-pointer">
                        <div className="aspect-[4/3] bg-slate-100 overflow-hidden mb-3">
                          {editorial.featured_image && (
                            <img
                              src={editorial.featured_image}
                              alt={editorial.title}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                          )}
                        </div>
                        <Badge variant="outline" className="mb-2 text-[10px]">
                          {editorial.category}
                        </Badge>
                        <h3 className="text-[14px] font-medium text-black mb-1 group-hover:text-slate-600 transition-colors">
                          {editorial.title}
                        </h3>
                        <p className="text-[12px] text-slate-500 line-clamp-2">{editorial.excerpt}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Social Links */}
            {/* @ts-ignore - Social links type guard */}
            {designer.social_links && Object.keys(designer.social_links).length > 0 && (
              <div>
                <h3 className="text-[12px] uppercase tracking-widest text-black mb-4 font-bold">
                  Connect
                </h3>
                <div className="space-y-2">
                  {/* @ts-ignore - Social links type guard */}
                  {'instagram' in designer.social_links && designer.social_links.instagram && (
                    <a
                      href={(designer.social_links as any).instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-slate-200 hover:border-black transition-colors group"
                    >
                      <Instagram className="h-4 w-4 text-slate-600 group-hover:text-black" />
                      <span className="text-[13px] text-slate-700 group-hover:text-black">
                        Instagram
                      </span>
                      <ExternalLink className="h-3 w-3 ml-auto text-slate-400" />
                    </a>
                  )}
                  {/* @ts-ignore - Social links type guard */}
                  {'website' in designer.social_links && designer.social_links.website && (
                    <a
                      href={(designer.social_links as any).website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-slate-200 hover:border-black transition-colors group"
                    >
                      <Globe className="h-4 w-4 text-slate-600 group-hover:text-black" />
                      <span className="text-[13px] text-slate-700 group-hover:text-black">
                        Website
                      </span>
                      <ExternalLink className="h-3 w-3 ml-auto text-slate-400" />
                    </a>
                  )}
                  {/* @ts-ignore - Social links type guard */}
                  {'email' in designer.social_links && designer.social_links.email && (
                    <a
                      href={`mailto:${(designer.social_links as any).email}`}
                      className="flex items-center gap-3 p-3 border border-slate-200 hover:border-black transition-colors group"
                    >
                      <Mail className="h-4 w-4 text-slate-600 group-hover:text-black" />
                      <span className="text-[13px] text-slate-700 group-hover:text-black">
                        Contact
                      </span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Sustainability */}
            {designer.sustainability_practices && designer.sustainability_practices.length > 0 && (
              <div>
                <h3 className="text-[12px] uppercase tracking-widest text-black mb-4 font-bold">
                  Sustainability
                </h3>
                <ul className="space-y-2">
                  {designer.sustainability_practices.map((practice, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[13px] text-slate-700">
                      <span className="text-slate-400 mt-1">•</span>
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact CTA */}
            <div className="p-6 bg-black text-white space-y-4">
              <h3 className="text-[14px] font-medium">Custom Inquiries</h3>
              <p className="text-[12px] text-white/70">
                Interested in custom pieces or collaborations?
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                asChild
              >
                {/* @ts-ignore - Social links type guard */}
                <a href={`mailto:${'email' in designer.social_links && (designer.social_links as any).email ? (designer.social_links as any).email : 'hello@adorzia.com'}`}>
                  Get in Touch
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
