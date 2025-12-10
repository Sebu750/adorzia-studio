import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PortfolioGrid, PortfolioItemProps } from "@/components/portfolio/PortfolioGrid";
import { PublicationRequestForm } from "@/components/portfolio/PublicationRequestForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  FileText,
  Clock,
  Send
} from "lucide-react";
import { PublicationStatus } from "@/lib/publication";

const portfolioItems: PortfolioItemProps[] = [
  {
    id: "1",
    title: "Urban Street Style Series",
    category: "Fashion",
    thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600",
    status: "published",
    createdAt: "Dec 5, 2024",
    source: "stylebox",
    publicationStatus: "published",
  },
  {
    id: "2",
    title: "Minimalist Ring Collection",
    category: "Jewelry",
    thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    status: "completed",
    createdAt: "Dec 3, 2024",
    source: "stylebox",
    publicationStatus: "sampling",
    submittedAt: "Dec 4, 2024",
    lastUpdated: "Dec 6, 2024",
  },
  {
    id: "3",
    title: "Autumn Textile Print",
    category: "Textile",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    status: "pending",
    createdAt: "Dec 1, 2024",
    source: "stylebox",
    publicationStatus: "pending_review",
    submittedAt: "Dec 2, 2024",
    lastUpdated: "Dec 2, 2024",
  },
  {
    id: "4",
    title: "Personal Lookbook 2024",
    category: "Fashion",
    thumbnail: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600",
    status: "draft",
    createdAt: "Nov 28, 2024",
    source: "upload",
    publicationStatus: "draft",
  },
  {
    id: "5",
    title: "Coastal Jewelry Concept",
    category: "Jewelry",
    thumbnail: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600",
    status: "completed",
    createdAt: "Nov 25, 2024",
    source: "stylebox",
    publicationStatus: "revision_requested",
    submittedAt: "Nov 26, 2024",
    lastUpdated: "Nov 28, 2024",
    reviewerNotes: "Great concept! Please add more detailed fabric/material specifications and update the moodboard with production-ready references.",
  },
  {
    id: "6",
    title: "Heritage Weave Patterns",
    category: "Textile",
    thumbnail: "https://images.unsplash.com/photo-1606722590583-3b9e9e9b9b9d?w=600",
    status: "published",
    createdAt: "Nov 20, 2024",
    source: "stylebox",
    publicationStatus: "published",
  },
  {
    id: "7",
    title: "Avant-Garde Evening Wear",
    category: "Fashion",
    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
    status: "completed",
    createdAt: "Nov 15, 2024",
    source: "upload",
    publicationStatus: "marketplace_pending",
    submittedAt: "Nov 16, 2024",
    lastUpdated: "Dec 5, 2024",
  },
  {
    id: "8",
    title: "Nature-Inspired Pendants",
    category: "Jewelry",
    thumbnail: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600",
    status: "published",
    createdAt: "Nov 10, 2024",
    source: "stylebox",
    publicationStatus: "published",
  },
];

const Portfolio = () => {
  const [publishFormOpen, setPublishFormOpen] = useState(false);

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
              Manage and showcase your design work
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button 
              variant="accent" 
              className="gap-2"
              onClick={() => setPublishFormOpen(true)}
            >
              <Send className="h-4 w-4" />
              Request Publish
            </Button>
            <Button variant="default" className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Project
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Projects", value: "89", icon: Grid3X3 },
            { label: "Published", value: "3", icon: Upload },
            { label: "In Pipeline", value: "4", icon: Clock },
            { label: "Collections", value: "4", icon: FolderPlus },
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
        </div>

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
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button variant="ghost" size="icon" className="rounded-none h-10">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-none h-10">
                <List className="h-4 w-4" />
              </Button>
            </div>
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
            <PortfolioGrid items={portfolioItems.filter(i => i.source === "stylebox")} />
          </TabsContent>

          <TabsContent value="uploaded">
            <PortfolioGrid items={portfolioItems.filter(i => i.source === "upload")} />
          </TabsContent>

          <TabsContent value="collections">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Fashion Forward", count: 12, cover: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400" },
                { name: "Jewelry Concepts", count: 8, cover: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400" },
                { name: "Textile Explorations", count: 6, cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
                { name: "Best of 2024", count: 15, cover: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400" },
              ].map((collection, index) => (
                <Card key={index} hover className="overflow-hidden cursor-pointer group">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={collection.cover}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="font-display text-lg font-semibold text-primary-foreground">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-primary-foreground/70">
                        {collection.count} projects
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
              <Card className="aspect-square border-dashed flex items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors">
                <div className="text-center">
                  <FolderPlus className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Create Collection</p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Publication Request Form Modal */}
      <PublicationRequestForm
        open={publishFormOpen}
        onOpenChange={setPublishFormOpen}
      />
    </AppLayout>
  );
};

export default Portfolio;
