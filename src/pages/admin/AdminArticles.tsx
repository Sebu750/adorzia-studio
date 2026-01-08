import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  Star,
  PenLine
} from "lucide-react";
import { useArticles, Article, ARTICLE_CATEGORIES } from "@/hooks/useArticles";
import { ArticlesTable } from "@/components/admin/articles/ArticlesTable";
import { ArticleForm } from "@/components/admin/articles/ArticleForm";

export default function AdminArticles() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const { data: articles, isLoading } = useArticles({ 
    status: status !== "all" ? status : undefined,
    search: search || undefined,
  });

  const stats = {
    total: articles?.length || 0,
    published: articles?.filter(a => a.status === "published").length || 0,
    drafts: articles?.filter(a => a.status === "draft").length || 0,
    featured: articles?.filter(a => a.is_featured).length || 0,
    totalViews: articles?.reduce((sum, a) => sum + (a.view_count || 0), 0) || 0,
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingArticle(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Articles</h1>
            <p className="text-muted-foreground">
              Manage blog posts and content marketing
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Eye className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.published}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <PenLine className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.drafts}</p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Star className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.featured}</p>
                <p className="text-sm text-muted-foreground">Featured</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <Tabs value={status} onValueChange={setStatus}>
          <TabsList>
            <TabsTrigger value="all">All Articles</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value={status} className="mt-4">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading articles...
              </div>
            ) : !articles?.length ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No articles found</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsFormOpen(true)}
                  >
                    Create your first article
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ArticlesTable articles={articles} onEdit={handleEdit} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ArticleForm 
        article={editingArticle}
        open={isFormOpen}
        onOpenChange={handleClose}
      />
    </AdminLayout>
  );
}
