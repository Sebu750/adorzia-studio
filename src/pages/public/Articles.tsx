import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import PublicLayout from "@/components/public/PublicLayout";
import SEOHead from "@/components/public/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar, Eye } from "lucide-react";
import { usePublishedArticles, ARTICLE_CATEGORIES } from "@/hooks/useArticles";

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: articles, isLoading } = usePublishedArticles();

  const filteredArticles = selectedCategory 
    ? articles?.filter(a => a.category === selectedCategory)
    : articles;

  const featuredArticle = articles?.find(a => a.is_featured);
  const regularArticles = filteredArticles?.filter(a => a.id !== featuredArticle?.id);

  const getCategoryLabel = (value: string) => {
    return ARTICLE_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  return (
    <PublicLayout>
      <SEOHead 
        title="Fashion Industry Articles | Insights for Pakistani Designers"
        description="In-depth articles on fashion design, sustainable fashion, and industry trends in Pakistan. Expert insights for students and professionals. Trend reports and style guides."
        url="https://www.adorzia.com/articles"
        keywords="Fashion articles Pakistan, Fashion industry insights, Sustainable fashion Pakistan, Fashion design education, Industry trends 2026, Designer spotlights"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-muted/50 to-background">
          <div className="container max-w-6xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Articles & Insights
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Discover trend reports, designer spotlights, and industry insights 
              from the world of emerging fashion design.
            </motion.p>
          </div>
        </section>

        <div className="container max-w-6xl mx-auto px-4 py-12">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {ARTICLE_CATEGORIES.map(cat => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !articles?.length ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No articles published yet.</p>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featuredArticle && !selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <Link to={`/articles/${featuredArticle.slug}`}>
                    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                      <div className="grid md:grid-cols-2">
                        {featuredArticle.featured_image && (
                          <div className="relative h-64 md:h-auto overflow-hidden">
                            <img 
                              src={featuredArticle.featured_image}
                              alt={featuredArticle.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <CardContent className="p-8 flex flex-col justify-center">
                          <Badge className="w-fit mb-4">Featured</Badge>
                          <Badge variant="outline" className="w-fit mb-2">
                            {getCategoryLabel(featuredArticle.category)}
                          </Badge>
                          <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                            {featuredArticle.title}
                          </h2>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {featuredArticle.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {featuredArticle.published_at && 
                                format(new Date(featuredArticle.published_at), "MMM d, yyyy")
                              }
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {featuredArticle.view_count || 0} views
                            </span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )}

              {/* Article Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles?.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/articles/${article.slug}`}>
                      <Card className="h-full overflow-hidden group hover:shadow-lg transition-shadow">
                        {article.featured_image && (
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={article.featured_image}
                              alt={article.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <Badge variant="outline" className="mb-2">
                            {getCategoryLabel(article.category)}
                          </Badge>
                          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              {article.published_at && 
                                format(new Date(article.published_at), "MMM d, yyyy")
                              }
                            </span>
                            <span className="flex items-center gap-1 text-primary font-medium">
                              Read more <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
