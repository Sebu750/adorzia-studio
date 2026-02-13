import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { PublicationRequestForm } from "@/components/portfolio/PublicationRequestForm";
import { PortfolioUploadModal } from "@/components/portfolio/PortfolioUploadModal";
import { EmptyPortfolio } from "@/components/empty-states/EmptyPortfolio";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Download, 
  FolderPlus, 
  Grid3X3, 
  List,
  Upload,
  Clock,
  Send,
  GripVertical
} from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { format } from "date-fns";
import { PortfolioManagementControls } from "@/components/portfolio/PortfolioManagementControls";

const PortfolioManagement = () => {
  const [publishFormOpen, setPublishFormOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const { projects, stats, loading, refetch } = usePortfolioData();

  // Transform portfolio projects to grid format
  const portfolioItems = projects.map(project => ({
    id: project.id,
    title: project.title,
    category: project.category || "Uncategorized",
    thumbnail: project.thumbnail_url || "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600",
    status: "completed" as const,
    createdAt: project.created_at ? format(new Date(project.created_at), "MMM d, yyyy") : "",
    source: (project.source_type === "stylebox" ? "stylebox" : "upload") as "stylebox" | "upload",
  }));

  const styleboxItems = portfolioItems.filter(i => i.source === "stylebox");
  const uploadedItems = portfolioItems.filter(i => i.source === "upload");

  // Get unique categories for collections view
  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              My Portfolio
            </h1>
            <p className="text-muted-foreground mt-1">
              Create, upload, edit, and manage your design work
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setPublishFormOpen(true)}
              disabled={projects.length === 0}
            >
              <Send className="h-4 w-4" />
              Request Publish
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setIsReordering(!isReordering)}
            >
              <GripVertical className="h-4 w-4" />
              {isReordering ? 'Exit Reorder' : 'Reorder'}
            </Button>
            <Button 
              variant="default" 
              className="gap-2"
              onClick={() => setUploadModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Upload Project
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </>
          ) : (
            <>
              {[
                { label: "Total Projects", value: stats.totalProjects.toString(), icon: Grid3X3 },
                { label: "Published", value: stats.published.toString(), icon: Upload },
                { label: "In Pipeline", value: stats.inPipeline.toString(), icon: Clock },
                { label: "Collections", value: stats.collections.toString(), icon: FolderPlus },
              ].map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-semibold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
        ) : projects.length === 0 ? (
          <EmptyPortfolio onUpload={() => setUploadModalOpen(true)} />
        ) : (
          <>
            {/* Management Controls */}
            <PortfolioManagementControls
              items={portfolioItems}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              onReorderToggle={() => setIsReordering(!isReordering)}
              isReordering={isReordering}
              onViewChange={setCurrentView}
              currentView={currentView}
            />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="textile">Textile</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="stylebox">From Styleboxes</TabsTrigger>
                <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <PortfolioGrid items={portfolioItems} />
              </TabsContent>

              <TabsContent value="stylebox">
                {styleboxItems.length > 0 ? (
                  <PortfolioGrid items={styleboxItems} />
                ) : (
                  <EmptyPortfolio />
                )}
              </TabsContent>

              <TabsContent value="uploaded">
                {uploadedItems.length > 0 ? (
                  <PortfolioGrid items={uploadedItems} />
                ) : (
                  <EmptyPortfolio />
                )}
              </TabsContent>

              <TabsContent value="collections">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories.map((category, index) => {
                    const categoryProjects = projects.filter(p => p.category === category);
                    const cover = categoryProjects[0]?.thumbnail_url || 
                      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400";
                    return (
                      <Card key={index} hover className="overflow-hidden cursor-pointer group">
                        <div className="aspect-square relative overflow-hidden">
                          <img
                            src={cover}
                            alt={category || "Collection"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <h3 className="font-display text-lg font-semibold text-primary-foreground">
                              {category}
                            </h3>
                            <p className="text-sm text-primary-foreground/70">
                              {categoryProjects.length} projects
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                  <Card className="aspect-square border-dashed flex items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors">
                    <div className="text-center">
                      <FolderPlus className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">Create Collection</p>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Publication Request Form Modal */}
      <PublicationRequestForm
        open={publishFormOpen}
        onOpenChange={setPublishFormOpen}
      />

      {/* Upload Project Modal */}
      <PortfolioUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onSuccess={refetch}
      />
    </AppLayout>
  );
};

export default PortfolioManagement;