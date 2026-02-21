import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PublicLayout from "@/components/public/PublicLayout";
import SEOHead from "@/components/public/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { DesignerProfileHeader } from "@/components/portfolio/DesignerProfileHeader";
import { PortfolioProjectCard } from "@/components/portfolio/PortfolioProjectCard";
import { SkillsExpertiseSection } from "@/components/portfolio/SkillsExpertiseSection";
import { AchievementsSection } from "@/components/portfolio/AchievementsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Grid3X3, 
  Boxes, 
  Upload, 
  ShoppingBag, 
  Award,
  ArrowLeft,
  Mail,
  ExternalLink,
  Store
} from "lucide-react";
import { motion } from "framer-motion";

interface DesignerProfile {
  id: string;
  user_id: string;
  name: string | null;
  brand_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  logo_url: string | null;
  banner_image: string | null;
  category: string | null;
  location: string | null;
  skills: string[] | null;
  education: string[] | null;
  awards: string[] | null;
  website_url: string | null;
  instagram_handle: string | null;
  twitter_handle: string | null;
  linkedin_url: string | null;
  behance_url: string | null;
  dribbble_url: string | null;
  rank: { name: string } | null;
  style_credits: number | null;
}

interface PortfolioProject {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string | null;
  source_type: string | null;
  tags: string[] | null;
  is_featured: boolean;
  collection_name: string | null;
  year: number | null;
  fabric_details: string | null;
  inspiration: string | null;
  is_stylebox_certified: boolean;
  marketplace_status: string | null;
}

interface MarketplaceProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  sale_price: number | null;
  images: string[];
  status: string;
  is_made_to_order: boolean;
}

export default function PublicDesignerPortfolio() {
  const { designerId } = useParams<{ designerId: string }>();
  const [profile, setProfile] = useState<DesignerProfile | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (designerId) {
      fetchDesignerData();
    }
  }, [designerId]);

  const fetchDesignerData = async () => {
    setLoading(true);
    try {
      // Fetch designer profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(`
          user_id,
          name,
          avatar_url,
          bio,
          brand_name,
          category,
          location,
          skills,
          awards,
          education,
          instagram_handle,
          website_url,
          twitter_handle,
          linkedin_url,
          behance_url,
          dribbble_url,
          style_credits,
          rank_id
        `)
        .eq("user_id", designerId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch portfolio projects
      const { data: portfolios } = await supabase
        .from("portfolios")
        .select("id")
        .eq("designer_id", designerId);

      if (portfolios && portfolios.length > 0) {
        const portfolioIds = portfolios.map(p => p.id);
        const { data: projectsData } = await supabase
          .from("portfolio_projects")
          .select("*")
          .in("portfolio_id", portfolioIds)
          .order("created_at", { ascending: false });

        setProjects(projectsData || []);
      }

      // Fetch marketplace products
      const { data: productsData } = await supabase
        .from("marketplace_products")
        .select("id, title, slug, price, sale_price, images, status, is_made_to_order")
        .eq("designer_id", designerId)
        .eq("status", "live");

      setMarketplaceProducts(productsData || []);
    } catch (error) {
      console.error("Error fetching designer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const styleboxProjects = projects.filter(p => p.source_type === "stylebox");
  const manualProjects = projects.filter(p => p.source_type !== "stylebox");
  const marketplaceEligible = projects.filter(p => p.marketplace_status === "approved");

  if (loading) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-6 py-20 space-y-8">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!profile) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Designer Not Found</h1>
          <p className="text-muted-foreground mb-6">The portfolio you're looking for doesn't exist or has been removed.</p>
          <Link to="/designers">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse Designers
            </Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const seoTitle = `${profile.name || "Designer"} | Fashion Portfolio | Adorzia`;
  const seoDescription = profile.bio || `Explore the fashion design portfolio of ${profile.name}. ${profile.category || "Fashion"} designer based in ${profile.location || "Pakistan"}.`;

  return (
    <PublicLayout>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        url={`https://www.adorzia.com/portfolio/${designerId}`}
        keywords={`${profile.name}, fashion designer portfolio, ${profile.category || "fashion"} designer, Pakistan designer`}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.adorzia.com" },
        { name: "Designers", url: "https://www.adorzia.com/designers" },
        { name: profile.name || "Designer", url: `https://www.adorzia.com/portfolio/${designerId}` }
      ]} />

      <div className="min-h-screen">
        {/* Profile Header */}
        <DesignerProfileHeader profile={profile} />

        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { label: "Total Projects", value: projects.length, icon: Grid3X3 },
              { label: "StyleBox Certified", value: styleboxProjects.length, icon: Boxes },
              { label: "Manual Projects", value: manualProjects.length, icon: Upload },
              { label: "Available for Order", value: marketplaceProducts.length, icon: ShoppingBag },
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Projects Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">Projects</h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="gap-1">
                  <Boxes className="h-3 w-3" />
                  StyleBox: {styleboxProjects.length}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Upload className="h-3 w-3" />
                  Manual: {manualProjects.length}
                </Badge>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="stylebox">
                  StyleBox Certified
                  {styleboxProjects.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {styleboxProjects.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="manual">Manual Projects</TabsTrigger>
                <TabsTrigger value="marketplace">
                  Available for Order
                  {marketplaceEligible.length > 0 && (
                    <Badge variant="accent" className="ml-2 h-5 px-1.5">
                      {marketplaceEligible.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                      <PortfolioProjectCard 
                        key={project.id} 
                        project={project} 
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyProjectsState />
                )}
              </TabsContent>

              <TabsContent value="stylebox">
                {styleboxProjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {styleboxProjects.map((project, index) => (
                      <PortfolioProjectCard 
                        key={project.id} 
                        project={project} 
                        index={index}
                        showStyleboxBadge
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyProjectsState type="stylebox" />
                )}
              </TabsContent>

              <TabsContent value="manual">
                {manualProjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {manualProjects.map((project, index) => (
                      <PortfolioProjectCard 
                        key={project.id} 
                        project={project} 
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyProjectsState type="manual" />
                )}
              </TabsContent>

              <TabsContent value="marketplace">
                {marketplaceEligible.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {marketplaceEligible.map((project, index) => (
                      <PortfolioProjectCard 
                        key={project.id} 
                        project={project} 
                        index={index}
                        showMarketplaceBadge
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyProjectsState type="marketplace" />
                )}
              </TabsContent>
            </Tabs>
          </motion.section>

          {/* Skills & Expertise */}
          {profile.skills && profile.skills.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SkillsExpertiseSection 
                skills={profile.skills}
                education={profile.education}
              />
            </motion.section>
          )}

          {/* Achievements */}
          {profile.awards && profile.awards.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <AchievementsSection awards={profile.awards} />
            </motion.section>
          )}

          {/* Marketplace Products */}
          {marketplaceProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-accent" />
                    Available for Order
                    <Badge variant="accent">{marketplaceProducts.length} Products</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {marketplaceProducts.map((product) => (
                      <Link 
                        key={product.id}
                        to={`/shop/products/${product.slug || product.id}`}
                        className="group"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
                          <img
                            src={Array.isArray(product.images) ? product.images[0] : ""}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          {product.is_made_to_order && (
                            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                              Made to Order
                            </Badge>
                          )}
                        </div>
                        <h4 className="mt-2 text-sm font-medium line-clamp-1 group-hover:text-accent transition-colors">
                          {product.title}
                        </h4>
                        <p className="text-sm font-semibold">
                          ${product.sale_price || product.price}
                          {product.sale_price && product.sale_price < product.price && (
                            <span className="text-xs text-muted-foreground line-through ml-2">
                              ${product.price}
                            </span>
                          )}
                        </p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* Contact CTA */}
          <motion.section
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="font-display text-xl font-bold mb-4">
              Interested in working with {profile.name}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="gap-2">
                <Mail className="h-4 w-4" />
                Contact Designer
              </Button>
              {profile.website_url && (
                <Button variant="outline" size="lg" asChild>
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </PublicLayout>
  );
}

function EmptyProjectsState({ type }: { type?: "stylebox" | "manual" | "marketplace" }) {
  const messages = {
    stylebox: {
      title: "No StyleBox Certified Projects",
      desc: "This designer hasn't completed any StyleBox challenges yet."
    },
    manual: {
      title: "No Manual Projects",
      desc: "This designer hasn't uploaded any independent work yet."
    },
    marketplace: {
      title: "No Products Available",
      desc: "This designer doesn't have any products available for order yet."
    },
    default: {
      title: "No Projects Yet",
      desc: "This designer hasn't added any projects to their portfolio yet."
    }
  };

  const { title, desc } = messages[type || "default"];

  return (
    <div className="text-center py-12 border rounded-lg border-dashed">
      <Grid3X3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
