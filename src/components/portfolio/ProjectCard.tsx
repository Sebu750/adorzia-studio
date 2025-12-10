import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Star, 
  GripVertical,
  Image,
  Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { PortfolioProject, PortfolioAsset } from '@/lib/portfolio';

interface ProjectCardProps {
  project: PortfolioProject;
  assets?: PortfolioAsset[];
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onAddAssets: () => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export function ProjectCard({
  project,
  assets = [],
  onEdit,
  onDelete,
  onToggleFeatured,
  onAddAssets,
  isDragging,
  dragHandleProps,
}: ProjectCardProps) {
  const projectAssets = assets.filter(a => a.project_id === project.id);
  const thumbnail = project.thumbnail_url || projectAssets[0]?.file_url;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'group',
        isDragging && 'z-50'
      )}
    >
      <Card className={cn(
        'overflow-hidden transition-all hover:shadow-md',
        isDragging && 'shadow-lg ring-2 ring-primary'
      )}>
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={project.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Image className="w-10 h-10" />
              <span className="text-sm">No images yet</span>
            </div>
          )}

          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="absolute top-2 left-2 p-1.5 rounded-md bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Featured Badge */}
          {project.is_featured && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}

          {/* Asset Count */}
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur text-xs font-medium">
            {projectAssets.length} assets
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={onEdit}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={onAddAssets}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Assets
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {project.description}
                </p>
              )}
              {project.category && (
                <Badge variant="outline" className="mt-2 text-xs">
                  {project.category}
                </Badge>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAddAssets}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Assets
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggleFeatured}>
                  <Star className={cn("w-4 h-4 mr-2", project.is_featured && "fill-current")} />
                  {project.is_featured ? 'Remove Featured' : 'Mark Featured'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface EmptyProjectCardProps {
  onClick: () => void;
}

export function EmptyProjectCard({ onClick }: EmptyProjectCardProps) {
  return (
    <Card 
      className="border-dashed cursor-pointer hover:border-primary hover:bg-muted/50 transition-all"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Plus className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground">Add New Project</p>
        <p className="text-sm text-muted-foreground">
          Start building your portfolio
        </p>
      </CardContent>
    </Card>
  );
}
