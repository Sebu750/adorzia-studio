import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2, Eye, Star, ExternalLink } from "lucide-react";
import { Article, useDeleteArticle, ARTICLE_CATEGORIES } from "@/hooks/useArticles";

interface ArticlesTableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
}

export function ArticlesTable({ articles, onEdit }: ArticlesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteArticle = useDeleteArticle();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "draft": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "archived": return "bg-slate-500/10 text-slate-600 border-slate-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getCategoryLabel = (value: string) => {
    return ARTICLE_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteArticle.mutate(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {article.is_featured && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                    <div>
                      <p className="font-medium line-clamp-1">{article.title}</p>
                      <p className="text-sm text-muted-foreground">/{article.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getCategoryLabel(article.category)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(article.status)}>
                    {article.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {article.published_at 
                    ? format(new Date(article.published_at), "MMM d, yyyy")
                    : "-"
                  }
                </TableCell>
                <TableCell>{article.view_count || 0}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(article)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {article.status === "published" && (
                        <DropdownMenuItem asChild>
                          <a href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Live
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => setDeleteId(article.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
