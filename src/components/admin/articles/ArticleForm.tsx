import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Eye, Search } from "lucide-react";
import { Article, useCreateArticle, useUpdateArticle, ARTICLE_CATEGORIES } from "@/hooks/useArticles";
import { sanitizeInput, sanitizeTitle, sanitizeRichText } from "@/lib/input-sanitizer";

interface ArticleFormProps {
  article?: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticleForm({ article, open, onOpenChange }: ArticleFormProps) {
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("style-guide");
  const [featuredImage, setFeaturedImage] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSlug(article.slug);
      setExcerpt(article.excerpt || "");
      setContent(article.content || "");
      setCategory(article.category);
      setFeaturedImage(article.featured_image || "");
      setMetaTitle(article.meta_title || "");
      setMetaDescription(article.meta_description || "");
      setStatus(article.status);
      setTags(article.tags || []);
      setIsFeatured(article.is_featured || false);
    } else {
      resetForm();
    }
  }, [article]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCategory("style-guide");
    setFeaturedImage("");
    setMetaTitle("");
    setMetaDescription("");
    setStatus("draft");
    setTags([]);
    setTagInput("");
    setIsFeatured(false);
  };

  const handleTitleChange = (value: string) => {
    const sanitizedValue = sanitizeTitle(value);
    setTitle(sanitizedValue);
    if (!article) {
      setSlug(sanitizedValue.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const addTag = () => {
    const sanitizedTagInput = sanitizeInput(tagInput);
    if (sanitizedTagInput.trim() && !tags.includes(sanitizedTagInput.trim())) {
      setTags([...tags, sanitizedTagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    const sanitizedTitle = sanitizeTitle(title);
    const sanitizedExcerpt = sanitizeInput(excerpt);
    const sanitizedContent = sanitizeRichText(content);
    const sanitizedMetaTitle = sanitizeTitle(metaTitle || title);
    const sanitizedMetaDescription = sanitizeInput(metaDescription || excerpt);
    const sanitizedTags = sanitizeStringArray(tags);
    
    const articleData = {
      title: sanitizedTitle,
      slug,
      excerpt: sanitizedExcerpt || null,
      content: sanitizedContent || null,
      category,
      featured_image: featuredImage || null,
      meta_title: sanitizedMetaTitle,
      meta_description: sanitizedMetaDescription || null,
      status,
      tags: sanitizedTags,
      is_featured: isFeatured,
      published_at: status === "published" ? new Date().toISOString() : null,
    };

    if (article) {
      updateArticle.mutate({ id: article.id, data: articleData }, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      createArticle.mutate(articleData, {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
      });
    }
  };

  const isLoading = createArticle.isPending || updateArticle.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{article ? "Edit Article" : "Create New Article"}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4 pr-4">
            <TabsContent value="content" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input 
                    value={title} 
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Article title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="article-slug"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ARTICLE_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Featured Image URL</Label>
                <Input 
                  value={featuredImage} 
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the article..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full article content (supports markdown)..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="secondary">Add</Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                <Label>Featured Article</Label>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Search Engine Optimization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Meta Title ({metaTitle.length || title.length}/60)</Label>
                    <Input 
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder={title || "Page title for search engines"}
                      maxLength={60}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description ({metaDescription.length || excerpt.length}/160)</Label>
                    <Textarea 
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder={excerpt || "Description shown in search results"}
                      maxLength={160}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Google Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {metaTitle || title || "Article Title"}
                    </p>
                    <p className="text-green-700 text-sm">
                      adorzia.com/articles/{slug || "article-slug"}
                    </p>
                    <p className="text-slate-600 text-sm mt-1">
                      {metaDescription || excerpt || "Article description will appear here..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Article Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {featuredImage && (
                    <img 
                      src={featuredImage} 
                      alt={title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <Badge className="mb-2">
                    {ARTICLE_CATEGORIES.find(c => c.value === category)?.label}
                  </Badge>
                  <h1 className="text-2xl font-bold mb-2">{title || "Article Title"}</h1>
                  <p className="text-muted-foreground mb-4">{excerpt || "Article excerpt..."}</p>
                  <div className="prose prose-sm max-w-none">
                    {content || "Article content will appear here..."}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !slug || isLoading}>
            {isLoading ? "Saving..." : article ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
