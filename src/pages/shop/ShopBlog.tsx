import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import SEOHead from "@/components/public/SEOHead";

// TODO: REMOVE MOCK DATA - Replace with real database queries
const MOCK_BLOG_POSTS = [
  {
    id: "studio-visit-hongshan",
    title: "Studio Visit: Inside Hongshan Feng's Creative Process",
    description: "An intimate look at how one of our featured designers transforms traditional craftsmanship into contemporary luxury pieces.",
    excerpt: "Step into the creative world of Hongshan Feng, where Eastern aesthetics meet Western minimalism. In this exclusive studio visit, we explore the designer's process from concept to creation.",
    hero_image: "https://images.unsplash.com/photo-1558769132-cb1aea1c8e86?w=1200",
    author: "Adorzia Editorial",
    author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    published_date: "2024-01-15",
    reading_time: "8 min read",
    category: "Behind the Scenes",
    tags: ["Designer Spotlight", "Creative Process", "Studio Tour"],
    featured: true,
  },
  {
    id: "sustainable-fashion",
    title: "The Future of Sustainable Fashion in Pakistan",
    description: "Exploring eco-friendly materials and ethical production methods with our sustainability-focused designers.",
    excerpt: "Discover how Pakistani designers are leading the charge in sustainable fashion, using innovative materials and ethical production practices to create beautiful, eco-conscious pieces.",
    hero_image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200",
    author: "Sarah Ahmed",
    author_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    published_date: "2024-01-20",
    reading_time: "6 min read",
    category: "Sustainability",
    tags: ["Eco-Friendly", "Ethical Fashion", "Innovation"],
  },
  {
    id: "bridal-trends-2024",
    title: "Bridal Trends 2024: Modern Romance",
    description: "From minimalist silhouettes to dramatic statements, discover what's defining bridal fashion this year.",
    excerpt: "Wedding season is here, and 2024 brings a fresh perspective on bridal fashion. Explore the trends shaping contemporary bridal wear, from sustainable fabrics to bold silhouettes.",
    hero_image: "https://images.unsplash.com/photo-1594552072238-3c0b0e4d25d0?w=1200",
    author: "Hira Noor",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    published_date: "2024-01-25",
    reading_time: "10 min read",
    category: "Trends",
    tags: ["Bridal Fashion", "Wedding Trends", "2024 Trends"],
  },
  {
    id: "streetwear-revolution",
    title: "The Streetwear Revolution in Pakistani Luxury Fashion",
    description: "How urban designers are reshaping the luxury landscape with bold, contemporary pieces.",
    excerpt: "Pakistan's streetwear scene is exploding. Young designers are merging street culture with luxury craftsmanship, creating a new category that's capturing global attention.",
    hero_image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200",
    author: "Zain Ahmed",
    author_avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    published_date: "2024-02-01",
    reading_time: "7 min read",
    category: "Trends",
    tags: ["Streetwear", "Urban Fashion", "Luxury"],
  },
  {
    id: "heritage-reimagined",
    title: "Heritage Reimagined: Traditional Meets Modern",
    description: "Celebrating designers who honor traditional techniques while creating contemporary masterpieces.",
    excerpt: "Traditional Pakistani craftsmanship is experiencing a renaissance. Designers are preserving centuries-old techniques while creating pieces that speak to modern sensibilities.",
    hero_image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200",
    author: "Fatima Malik",
    author_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    published_date: "2024-02-05",
    reading_time: "9 min read",
    category: "Culture",
    tags: ["Heritage", "Traditional Craft", "Innovation"],
  },
  {
    id: "summer-essentials-guide",
    title: "Summer Essentials: Building Your Perfect Wardrobe",
    description: "Expert styling tips and must-have pieces for the summer season from our top designers.",
    excerpt: "As temperatures rise, it's time to refresh your wardrobe. Our designers share their essential summer pieces and styling tips for staying chic in the heat.",
    hero_image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200",
    author: "Adorzia Style Team",
    author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    published_date: "2024-02-10",
    reading_time: "5 min read",
    category: "Styling",
    tags: ["Summer Fashion", "Style Guide", "Wardrobe Essentials"],
  },
];

const categories = ["All", "Behind the Scenes", "Sustainability", "Trends", "Culture", "Styling"];

export default function ShopBlog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = MOCK_BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0];
  const otherPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);

  return (
    <MarketplaceLayout>
      <SEOHead
        title="Fashion Blog | Designer Stories, Trends & Style Guides | Adorzia"
        description="Explore the world of Pakistani fashion design. Read designer spotlights, sustainability insights, bridal trends, streetwear evolution, and expert style guides from Adorzia's creative community."
        keywords="pakistani fashion blog, designer interviews, fashion trends 2024, sustainable fashion pakistan, bridal fashion trends, streetwear pakistan, designer spotlight, fashion industry insights, style guides, luxury fashion blog"
        url="https://studio.adorzia.com/shop/blog"
        image={featuredPost?.hero_image || "https://studio.adorzia.com/og-blog.jpg"}
        type="website"
      />

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
                Fashion Editorial
              </Badge>
              <AnimatedHeading className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Stories from the Studio
              </AnimatedHeading>
              <p className="text-lg text-muted-foreground mb-8">
                Dive into the world of independent fashion design. Discover stories, insights, and inspiration from Pakistan's most creative designers.
              </p>
              <div className="max-w-md mx-auto mb-6">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link to={`/shop/blog/${featuredPost.id}`}>
                <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="aspect-square md:aspect-auto relative overflow-hidden">
                      <img
                        src={featuredPost.hero_image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                      <Badge variant="secondary" className="w-fit mb-4">
                        Featured Article
                      </Badge>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">{featuredPost.category}</Badge>
                      </div>
                      <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 text-lg line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <img 
                            src={featuredPost.author_avatar} 
                            alt={featuredPost.author}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <span>{featuredPost.author}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(featuredPost.published_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {featuredPost.reading_time}
                        </div>
                      </div>
                      <Button className="w-fit group/btn">
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* More Articles */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <AnimatedHeading className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              Latest Articles
            </AnimatedHeading>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/shop/blog/${post.id}`}>
                  <TiltCard tiltAmount={6}>
                    <Card className="h-full overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img
                          src={post.hero_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary">{post.category}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-display text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <img 
                            src={post.author_avatar} 
                            alt={post.author}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          <span>{post.author}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.published_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </div>

          {otherPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="font-display text-2xl font-bold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-6 border-background/20 text-background">
              Stay Updated
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Never Miss a Story
            </h2>
            <p className="text-lg text-background/80 mb-8 max-w-2xl mx-auto">
              Get the latest designer features, fashion insights, and style guides delivered to your inbox every week.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
              />
              <Button size="lg" variant="secondary">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </MarketplaceLayout>
  );
}
