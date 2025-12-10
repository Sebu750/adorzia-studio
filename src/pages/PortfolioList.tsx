import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolios } from '@/hooks/usePortfolio';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PORTFOLIO_STATUS_CONFIG, VISIBILITY_CONFIG } from '@/lib/portfolio';
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Eye,
  Trash2,
  Copy,
  Globe,
  Lock,
  Store,
  Image,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { format } from 'date-fns';

export default function PortfolioList() {
  const { portfolios, isLoading, createPortfolio, deletePortfolio } = usePortfolios();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredPortfolios = portfolios.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await createPortfolio.mutateAsync({ title: newTitle });
    setNewTitle('');
    setShowCreateDialog(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deletePortfolio.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Globe className="w-3.5 h-3.5" />;
      case 'marketplace_only': return <Store className="w-3.5 h-3.5" />;
      default: return <Lock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Portfolio
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and showcase your design work
            </p>
          </div>

          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Portfolio
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search portfolios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="review">In Review</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredPortfolios.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No portfolios yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Create your first portfolio to start showcasing your work
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Portfolio
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredPortfolios.map((portfolio, index) => {
                const statusConfig = PORTFOLIO_STATUS_CONFIG[portfolio.status];
                
                return (
                  <motion.div
                    key={portfolio.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-md transition-shadow">
                      {/* Cover Image */}
                      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                        {portfolio.cover_image ? (
                          <img
                            src={portfolio.cover_image}
                            alt={portfolio.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-10 h-10 text-muted-foreground/50" />
                          </div>
                        )}

                        {/* Status Badge */}
                        <Badge className={`absolute top-3 left-3 ${statusConfig.color}`}>
                          {statusConfig.label}
                        </Badge>

                        {/* Visibility Icon */}
                        <div className="absolute top-3 right-3 p-1.5 rounded-md bg-background/80 backdrop-blur">
                          {getVisibilityIcon(portfolio.visibility)}
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{portfolio.title}</h3>
                            {portfolio.tagline && (
                              <p className="text-sm text-muted-foreground truncate mt-0.5">
                                {portfolio.tagline}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              Updated {format(new Date(portfolio.updated_at), 'MMM d, yyyy')}
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/portfolio/${portfolio.id}`}>
                                  <Edit2 className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/portfolio/${portfolio.id}/preview`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(portfolio.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link to={`/portfolio/${portfolio.id}`}>
                              <Edit2 className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link to={`/portfolio/${portfolio.id}/preview`}>
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Portfolio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Portfolio Title</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., My Design Portfolio"
                className="mt-1"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim() || createPortfolio.isPending}>
              {createPortfolio.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this portfolio and all its projects and assets. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
