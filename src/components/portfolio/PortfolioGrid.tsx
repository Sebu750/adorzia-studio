import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Upload, 
  Check,
  ExternalLink,
  Clock,
  AlertCircle,
  Package,
  Factory,
<<<<<<< HEAD
  Store,
  Trash2,
  Star,
  StarOff,
  ImageIcon,
  GripVertical
=======
  Store
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PublicationStatus, PUBLICATION_STATUSES } from "@/lib/publication";
import { RankTier } from "@/lib/ranks";
import { RequestPublishModal } from "./RequestPublishModal";
import { PublicationStatusModal } from "./PublicationStatusModal";
<<<<<<< HEAD
import { ProjectDetailModal } from "./ProjectDetailModal";
import { SortablePortfolioGrid } from "./SortablePortfolioGrid";
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

export interface PortfolioItemProps {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  status: "draft" | "completed" | "published" | "pending";
  createdAt: string;
  source: "stylebox" | "upload";
  publicationStatus?: PublicationStatus;
  submittedAt?: string;
  lastUpdated?: string;
  reviewerNotes?: string;
<<<<<<< HEAD
  imageCount?: number;
  isFeatured?: boolean;
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
}

interface PortfolioGridProps {
  items: PortfolioItemProps[];
  currentRank?: RankTier;
  subscriptionTier?: 'basic' | 'pro' | 'elite';
<<<<<<< HEAD
  isReordering?: boolean;
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
}

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" as const, icon: Edit },
  completed: { label: "Completed", variant: "success" as const, icon: Check },
  published: { label: "Published", variant: "accent" as const, icon: ExternalLink },
  pending: { label: "Pending Review", variant: "warning" as const, icon: Clock },
};

const publicationStatusIcons: Partial<Record<PublicationStatus, React.ElementType>> = {
  pending_review: Clock,
  revision_requested: AlertCircle,
  sampling: Package,
  pre_production: Factory,
  marketplace_pending: Store,
};

export function PortfolioGrid({ 
  items, 
  currentRank = 'stylist',
<<<<<<< HEAD
  subscriptionTier = 'pro',
  isReordering = false
}: PortfolioGridProps) {
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioItemProps | null>(null);
  const [localIsReordering, setLocalIsReordering] = useState(false);

  // Use passed prop if provided, otherwise use local state
  const effectiveIsReordering = isReordering !== undefined ? isReordering : localIsReordering;

  const handleReorderToggle = () => {
    if (typeof isReordering === 'boolean') {
      // If isReordering is controlled by parent, notify parent
      setLocalIsReordering(!localIsReordering);
    } else {
      // If isReordering is not controlled, toggle local state
      setLocalIsReordering(!localIsReordering);
    }
  };
=======
  subscriptionTier = 'pro' 
}: PortfolioGridProps) {
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioItemProps | null>(null);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

  const handleRequestPublish = (item: PortfolioItemProps) => {
    setSelectedProject(item);
    setPublishModalOpen(true);
  };

  const handleViewStatus = (item: PortfolioItemProps) => {
    setSelectedProject(item);
    setStatusModalOpen(true);
  };

<<<<<<< HEAD
  const handleViewDetails = (item: PortfolioItemProps) => {
    setSelectedProject(item);
    setDetailModalOpen(true);
  };

=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  const handleSubmitPublish = (projectId: string, notes: string) => {
    console.log("Submitting project:", projectId, "with notes:", notes);
    // In real app, this would call an API
  };

  // Check if item can request publish
  const canRequestPublish = (item: PortfolioItemProps) => {
    return item.status === 'completed' && 
           (!item.publicationStatus || item.publicationStatus === 'draft' || item.publicationStatus === 'revision_requested');
  };

  // Check if item has active publication status to track
  const hasActivePublication = (item: PortfolioItemProps) => {
    return item.publicationStatus && 
           item.publicationStatus !== 'draft' && 
           item.publicationStatus !== 'published';
  };

  return (
    <>
<<<<<<< HEAD
      {effectiveIsReordering ? (
        <SortablePortfolioGrid items={items.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          thumbnail: item.thumbnail,
          status: item.status as 'completed' | 'draft' | 'pending',
          createdAt: item.createdAt,
          source: item.source
        }))} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => {
            // Safe access with fallback to draft
            const status = statusConfig[item.status as keyof typeof statusConfig] ?? statusConfig.draft;
            const StatusIcon = status.icon;
            const hasPublication = hasActivePublication(item);
            const PublicationIcon = item.publicationStatus 
              ? publicationStatusIcons[item.publicationStatus] 
              : null;

            return (
              <Card key={item.id} hover className="overflow-hidden group">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quick actions overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-10 w-10 rounded-full"
                      onClick={() => handleViewDetails(item)}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-10 w-10 rounded-full"
                      onClick={() => handleViewDetails(item)}
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    {canRequestPublish(item) && (
                      <Button 
                        size="icon" 
                        variant="accent" 
                        className="h-10 w-10 rounded-full"
                        onClick={() => handleRequestPublish(item)}
                      >
                        <Upload className="h-5 w-5" />
                      </Button>
                    )}
                  </div>

                  {/* Image count badge */}
                  {item.imageCount && item.imageCount > 1 && (
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="gap-1 bg-background/90">
                        <ImageIcon className="h-3 w-3" />
                        {item.imageCount}
                      </Badge>
                    </div>
                  )}

                {/* Featured star */}
                {item.isFeatured && (
                  <div className="absolute top-3 left-3">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  </div>
                )}

                {/* Source indicator - moved to top right next to status */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <Badge variant="outline" className="bg-background/80 text-foreground border-0 text-xs">
                    {item.source === "stylebox" ? "Stylebox" : "Uploaded"}
                  </Badge>
=======
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => {
          // Safe access with fallback to draft
          const status = statusConfig[item.status as keyof typeof statusConfig] ?? statusConfig.draft;
          const StatusIcon = status.icon;
          const hasPublication = hasActivePublication(item);
          const PublicationIcon = item.publicationStatus 
            ? publicationStatusIcons[item.publicationStatus] 
            : null;

          return (
            <Card key={item.id} hover className="overflow-hidden group">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Quick actions overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
                    <Eye className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
                    <Edit className="h-5 w-5" />
                  </Button>
                  {canRequestPublish(item) && (
                    <Button 
                      size="icon" 
                      variant="accent" 
                      className="h-10 w-10 rounded-full"
                      onClick={() => handleRequestPublish(item)}
                    >
                      <Upload className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                {/* Status badge */}
                <div className="absolute top-3 right-3">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                  <Badge variant={status.variant} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>

                {/* Publication Status indicator */}
                {hasPublication && PublicationIcon && (
                  <div className="absolute bottom-3 right-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 gap-1.5 text-xs bg-background/90 hover:bg-background"
                      onClick={() => handleViewStatus(item)}
                    >
                      <PublicationIcon className="h-3 w-3 text-accent" />
                      Track
                    </Button>
                  </div>
                )}
<<<<<<< HEAD
=======

                {/* Source indicator */}
                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className="bg-background/80 text-foreground border-0 text-xs">
                    {item.source === "stylebox" ? "Stylebox" : "Uploaded"}
                  </Badge>
                </div>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold truncate">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
<<<<<<< HEAD
                      <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleReorderToggle}>
                        <GripVertical className="h-4 w-4 mr-2" />
                        {effectiveIsReordering ? 'Exit Reorder' : 'Reorder Projects'}
                      </DropdownMenuItem>
=======
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                      {hasPublication && (
                        <DropdownMenuItem onClick={() => handleViewStatus(item)}>
                          <Clock className="h-4 w-4 mr-2" />
                          Track Status
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {canRequestPublish(item) ? (
                        <DropdownMenuItem onClick={() => handleRequestPublish(item)}>
                          <Upload className="h-4 w-4 mr-2" />
                          Request Publish
                        </DropdownMenuItem>
                      ) : item.status === 'published' ? (
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Marketplace
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{item.createdAt}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
<<<<<<< HEAD
      )}
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

      {/* Request Publish Modal */}
      {selectedProject && (
        <RequestPublishModal
          open={publishModalOpen}
          onOpenChange={setPublishModalOpen}
          project={selectedProject}
          currentRank={currentRank}
          subscriptionTier={subscriptionTier}
          onSubmit={handleSubmitPublish}
        />
      )}

      {/* Publication Status Modal */}
      {selectedProject && selectedProject.publicationStatus && (
        <PublicationStatusModal
          open={statusModalOpen}
          onOpenChange={setStatusModalOpen}
          project={{
            ...selectedProject,
            publicationStatus: selectedProject.publicationStatus,
          }}
        />
      )}
<<<<<<< HEAD

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          projectId={selectedProject.id}
        />
      )}
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    </>
  );
}
