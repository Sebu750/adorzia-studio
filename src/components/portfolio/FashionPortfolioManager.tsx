import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Edit3, 
  Eye, 
  Trash2, 
  Copy, 
  Download, 
  Star, 
  Palette, 
  Scissors, 
  Ruler,
  Sparkles,
  TrendingUp,
  Users,
  ShoppingCart
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface FashionProject {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  status: 'draft' | 'completed' | 'published' | 'pending';
  createdAt: string;
  isFeatured: boolean;
  views: number;
  likes: number;
  sales: number;
  tags: string[];
}

interface FashionPortfolioManagerProps {
  projects: FashionProject[];
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onDuplicate: (projectId: string) => void;
  onPublish: (projectId: string) => void;
  onFeature: (projectId: string, featured: boolean) => void;
}

export const FashionPortfolioManager: React.FC<FashionPortfolioManagerProps> = ({
  projects,
  onEdit,
  onDelete,
  onDuplicate,
  onPublish,
  onFeature
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Mutation for deleting a project
  const deleteMutation = useMutation({
    mutationFn: async (projectId: string) => {
      // Delete assets first
      const { error: assetsError } = await supabase
        .from('portfolio_assets')
        .delete()
        .eq('project_id', projectId);

      if (assetsError) throw assetsError;

      // Then delete project
      const { error: projectError } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', projectId);

      if (projectError) throw projectError;
    },
    onSuccess: () => {
      toast.success('Project deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-projects'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    }
  });

  // Mutation for duplicating a project
  const duplicateMutation = useMutation({
    mutationFn: async (projectId: string) => {
      // Get the original project
      const { data: originalProject, error: fetchError } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (fetchError) throw fetchError;

      // Get the original project assets
      const { data: originalAssets, error: assetsError } = await supabase
        .from('portfolio_assets')
        .select('*')
        .eq('project_id', projectId);

      if (assetsError) throw assetsError;

      // Create new project with duplicated data
      const { data: newProject, error: createError } = await supabase
        .from('portfolio_projects')
        .insert({
          ...originalProject,
          id: undefined, // Let DB generate new ID
          title: `${originalProject.title} (Copy)`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) throw createError;

      // Create copies of assets for the new project
      if (originalAssets && originalAssets.length > 0) {
        const newAssets = originalAssets.map(asset => ({
          ...asset,
          id: undefined, // Let DB generate new ID
          project_id: newProject.id,
          created_at: new Date().toISOString(),
        }));

        const { error: insertAssetsError } = await supabase
          .from('portfolio_assets')
          .insert(newAssets);

        if (insertAssetsError) throw insertAssetsError;
      }

      return newProject;
    },
    onSuccess: () => {
      toast.success('Project duplicated successfully!');
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-projects'] });
    },
    onError: (error) => {
      toast.error(`Failed to duplicate project: ${error.message}`);
    }
  });

  // Mutation for updating featured status
  const featureMutation = useMutation({
    mutationFn: async ({ projectId, featured }: { projectId: string; featured: boolean }) => {
      const { error } = await supabase
        .from('portfolio_projects')
        .update({ is_featured: featured })
        .eq('id', projectId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Featured status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-projects'] });
    },
    onError: (error) => {
      toast.error(`Failed to update featured status: ${error.message}`);
    }
  });

  const handleDelete = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteMutation.mutate(projectId);
    }
  };

  const handleDuplicate = (projectId: string) => {
    duplicateMutation.mutate(projectId);
  };

  const handleFeatureToggle = (projectId: string, currentFeatured: boolean) => {
    featureMutation.mutate({ projectId, featured: !currentFeatured });
  };

  const getProjectStats = () => {
    return {
      totalProjects: projects.length,
      featured: projects.filter(p => p.isFeatured).length,
      published: projects.filter(p => p.status === 'published').length,
      drafts: projects.filter(p => p.status === 'draft').length,
      totalViews: projects.reduce((sum, p) => sum + p.views, 0),
      totalLikes: projects.reduce((sum, p) => sum + p.likes, 0),
      totalSales: projects.reduce((sum, p) => sum + p.sales, 0)
    };
  };

  const stats = getProjectStats();

  return (
    <div className="space-y-6">
      {/* Portfolio Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center mb-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.totalProjects}</p>
            <p className="text-xs text-blue-700">Projects</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center mb-2">
              <Star className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.featured}</p>
            <p className="text-xs text-purple-700">Featured</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.published}</p>
            <p className="text-xs text-green-700">Published</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center mb-2">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-orange-900">{stats.totalViews}</p>
            <p className="text-xs text-orange-700">Views</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-red-900">{stats.totalLikes}</p>
            <p className="text-xs text-red-700">Likes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center mb-2">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-emerald-900">{stats.totalSales}</p>
            <p className="text-xs text-emerald-700">Sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Quick stats overlay */}
              <div className="absolute top-3 right-3 flex gap-1">
                <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                  <Eye className="h-3 w-3 mr-1" />
                  {project.views}
                </Badge>
                <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                  <Users className="h-3 w-3 mr-1" />
                  {project.likes}
                </Badge>
                <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {project.sales}
                </Badge>
              </div>
              
              {/* Featured indicator */}
              {project.isFeatured && (
                <div className="absolute top-3 left-3">
                  <Badge variant="default" className="bg-yellow-500 text-yellow-900">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              
              {/* Status indicator */}
              <div className="absolute bottom-3 left-3">
                <Badge 
                  variant={project.status === 'published' ? 'default' : 
                         project.status === 'draft' ? 'secondary' : 
                         project.status === 'pending' ? 'outline' : 'default'}
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
              
              {/* Action buttons overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => onEdit(project.id)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="default" 
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => onPublish(project.id)}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => handleFeatureToggle(project.id, project.isFeatured)}
                >
                  <Star className={`h-4 w-4 ${project.isFeatured ? 'fill-current text-yellow-500' : ''}`} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full">
                      <Scissors className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDuplicate(project.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(project.id)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(project.id)}>
                      <Palette className="h-4 w-4 mr-2" />
                      Change Theme
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(project.id)}>
                      <Ruler className="h-4 w-4 mr-2" />
                      Adjust Measurements
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg truncate">{project.title}</CardTitle>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{project.category}</Badge>
                <span className="text-xs text-muted-foreground">{project.createdAt}</span>
              </div>
            </CardHeader>
            
            <CardContent className="pb-4">
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.tags.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};