import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import PublicLayout from "@/components/public/PublicLayout";
import SEOHead from "@/components/public/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Eye, Share2, Clock } from "lucide-react";
import { useArticle, usePublishedArticles, ARTICLE_CATEGORIES } from "@/hooks/useArticles";
import { SafeHTMLRenderer } from "@/components/ui/SafeHTMLRenderer";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = useArticle(slug || "");
  const { data: relatedArticles } = usePublishedArticles(4);

  const getCategoryLabel = (value: string) => {
    return ARTICLE_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  const estimateReadTime = (content: string | null) => {
    if (!content) return 1;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      await navigator.share({
        title: article.title,
        text: article.excerpt || "",
        url: window.location.href,
      });
    }
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !article) {
    return (
      <PublicLayout>
        <div className="container max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/articles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const related = relatedArticles?.filter(a => 
    a.id !== article.id && a.category === article.category
  ).slice(0, 3);

  return (
    <PublicLayout>
      <SEOHead 
        title={`${article.meta_title || article.title} | Adorzia`}
        description={article.meta_description || article.excerpt || ""}
        image={article.featured_image || undefined}
        url={`https://adorzia.com/articles/${article.slug}`}
        type="article"
        keywords={article.tags?.join(", ") || ""}
        author="Adorzia"
      />

      {/* Article Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.excerpt,
          "image": article.featured_image,
          "datePublished": article.published_at,
          "dateModified": article.updated_at,
          "author": {
            "@type": "Organization",
            "name": "Adorzia"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Adorzia",
            "logo": {
              "@type": "ImageObject",
              "url": "https://adorzia.com/logo.png"
            }
          }
        })
      }} />

      <article className="min-h-screen bg-background">
        {/* Back Link */}
        <div className="container max-w-4xl mx-auto px-4 pt-8">
          <Link 
            to="/articles" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </div>

        {/* Header */}
        <header className="container max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="mb-4">
              {getCategoryLabel(article.category)}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">
                {article.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {article.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(article.published_at), "MMMM d, yyyy")}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {estimateReadTime(article.content)} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.view_count || 0} views
              </span>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </motion.div>
        </header>

        {/* Featured Image */}
        {article.featured_image && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="container max-w-5xl mx-auto px-4 mb-12"
          >
            <img 
              src={article.featured_image}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="container max-w-3xl mx-auto px-4 pb-12"
        >
          <SafeHTMLRenderer 
            html={article.content || ''}
            className="prose prose-lg max-w-none dark:prose-invert"
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
              {article.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </motion.div>

        {/* Related Articles */}
        {related && related.length > 0 && (
          <section className="bg-muted/50 py-12">
            <div className="container max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map(relatedArticle => (
                  <Link key={relatedArticle.id} to={`/articles/${relatedArticle.slug}`}>
                    <div className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {relatedArticle.featured_image && (
                        <img 
                          src={relatedArticle.featured_image}
                          alt={relatedArticle.title}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <Badge variant="outline" className="mb-2 text-xs">
                          {getCategoryLabel(relatedArticle.category)}
                        </Badge>
                        <h3 className="font-semibold line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </PublicLayout>
  );
}
