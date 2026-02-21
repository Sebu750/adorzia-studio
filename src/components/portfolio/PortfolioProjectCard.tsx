import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Boxes, 
  Eye, 
  Calendar, 
  Tag,
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileText,
  Palette,
  Scissors,
  Gem,
  Image
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";

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
  is_stylebox_certified?: boolean;
  marketplace_status: string | null;
  // StyleBox specific fields
  design_brief?: string | null;
  moodboard_url?: string | null;
  technical_sketches?: string[] | null;
  fabric_materials?: string | null;
  embellishment_map?: string | null;
  final_design_url?: string | null;
  execution_images?: string[] | null;
}

interface PortfolioProjectCardProps {
  project: PortfolioProject;
  index?: number;
  showStyleboxBadge?: boolean;
  showMarketplaceBadge?: boolean;
}

export function PortfolioProjectCard({ 
  project, 
  index = 0, 
  showStyleboxBadge = false,
  showMarketplaceBadge = false 
}: PortfolioProjectCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isStylebox = project.source_type === "stylebox";
  const isMarketplaceApproved = project.marketplace_status === "approved";

  // Collect all images for gallery
  const allImages = [
    project.thumbnail_url,
    project.moodboard_url,
    project.final_design_url,
    ...(project.technical_sketches || []),
    ...(project.execution_images || []),
  ].filter(Boolean) as string[];

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card 
          className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setDetailOpen(true)}
        >
          {/* Image */}
          <div className="aspect-square relative overflow-hidden bg-muted">
            <img
              src={project.thumbnail_url || "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600"}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4">
                <Button variant="secondary" size="sm" className="w-full gap-2">
                  <Eye className="h-4 w-4" />
                  View Project
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {(isStylebox || showStyleboxBadge) && project.source_type === "stylebox" && (
                <Badge className="bg-accent text-accent-foreground gap-1 shadow-sm">
                  <Boxes className="h-3 w-3" />
                  StyleBox Certified
                </Badge>
              )}
              {(isMarketplaceApproved || showMarketplaceBadge) && project.marketplace_status === "approved" && (
                <Badge className="bg-green-500 text-white gap-1 shadow-sm">
                  <ShoppingBag className="h-3 w-3" />
                  Available for Order
                </Badge>
              )}
              {project.is_featured && (
                <Badge variant="secondary" className="gap-1 shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </Badge>
              )}
            </div>

            {/* Category Badge */}
            {project.category && (
              <Badge 
                variant="secondary" 
                className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm"
              >
                {project.category}
              </Badge>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-4">
            <h3 className="font-display font-semibold text-lg line-clamp-1 group-hover:text-accent transition-colors">
              {project.title}
            </h3>
            
            {project.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {project.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
              {project.collection_name && (
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {project.collection_name}
                </span>
              )}
              {project.created_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(project.created_at), "MMM yyyy")}
                </span>
              )}
              {!project.collection_name && !project.created_at && project.year && (
                <span>{project.year}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Project Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="font-display text-2xl">
                  {project.title}
                </DialogTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {isStylebox && (
                    <Badge className="bg-accent text-accent-foreground gap-1">
                      <Boxes className="h-3 w-3" />
                      StyleBox Certified Project
                    </Badge>
                  )}
                  {isMarketplaceApproved && (
                    <Badge className="bg-green-500 text-white gap-1">
                      <ShoppingBag className="h-3 w-3" />
                      Available for Order
                    </Badge>
                  )}
                  {project.category && (
                    <Badge variant="secondary">{project.category}</Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Image Gallery */}
            {allImages.length > 0 && (
              <div className="space-y-4">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={allImages[currentImageIndex]}
                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                  {allImages.length > 1 && (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={cn(
                          "relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                          currentImageIndex === idx
                            ? "border-accent"
                            : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {project.description && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent" />
                  Description
                </h4>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            )}

            {/* StyleBox Specific Sections */}
            {isStylebox && (
              <div className="space-y-6 border-t pt-6">
                <h4 className="font-display font-semibold text-lg flex items-center gap-2">
                  <Boxes className="h-5 w-5 text-accent" />
                  StyleBox Project Details
                </h4>

                {project.design_brief && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Design Brief
                    </h5>
                    <p className="text-sm text-muted-foreground">{project.design_brief}</p>
                  </div>
                )}

                {project.fabric_materials && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Fabric & Material Details
                    </h5>
                    <p className="text-sm text-muted-foreground">{project.fabric_materials}</p>
                  </div>
                )}

                {project.embellishment_map && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Gem className="h-4 w-4" />
                      Embellishment Map
                    </h5>
                    <p className="text-sm text-muted-foreground">{project.embellishment_map}</p>
                  </div>
                )}
              </div>
            )}

            {/* Manual Project Details */}
            {!isStylebox && (
              <div className="grid grid-cols-2 gap-4">
                {project.fabric_details && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Scissors className="h-4 w-4" />
                      Fabric Details
                    </h5>
                    <p className="text-sm text-muted-foreground">{project.fabric_details}</p>
                  </div>
                )}

                {project.inspiration && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Inspiration
                    </h5>
                    <p className="text-sm text-muted-foreground">{project.inspiration}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 pt-4 border-t text-sm text-muted-foreground">
              {project.collection_name && (
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  Collection: {project.collection_name}
                </span>
              )}
              {project.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Year: {project.year}
                </span>
              )}
              {project.created_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created: {format(new Date(project.created_at), "MMMM d, yyyy")}
                </span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
