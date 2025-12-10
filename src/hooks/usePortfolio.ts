import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { 
  Portfolio, 
  PortfolioProject, 
  PortfolioAsset, 
  PortfolioSection,
  PortfolioStatus,
  PortfolioVisibility 
} from '@/lib/portfolio';

export function usePortfolios() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const portfoliosQuery = useQuery({
    queryKey: ['portfolios', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('designer_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as Portfolio[];
    },
    enabled: !!user?.id,
  });

  const createPortfolio = useMutation({
    mutationFn: async (data: { title: string; description?: string; category?: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const { data: portfolio, error } = await supabase
        .from('portfolios')
        .insert({
          designer_id: user.id,
          title: data.title,
          description: data.description || null,
          category: data.category || 'fashion',
          slug: `${slug}-${Date.now()}`,
          status: 'draft',
          visibility: 'private',
        })
        .select()
        .single();
      
      if (error) throw error;
      return portfolio;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast.success('Portfolio created');
    },
    onError: (error) => {
      toast.error('Failed to create portfolio');
      console.error(error);
    },
  });

  const updatePortfolio = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Portfolio> & { id: string }) => {
      const { data, error } = await supabase
        .from('portfolios')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.id] });
    },
  });

  const deletePortfolio = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast.success('Portfolio deleted');
    },
    onError: () => {
      toast.error('Failed to delete portfolio');
    },
  });

  return {
    portfolios: portfoliosQuery.data || [],
    isLoading: portfoliosQuery.isLoading,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  };
}

export function usePortfolio(id: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const portfolioQuery = useQuery({
    queryKey: ['portfolio', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Portfolio | null;
    },
    enabled: !!id,
  });

  const projectsQuery = useQuery({
    queryKey: ['portfolio-projects', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('portfolio_id', id)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as PortfolioProject[];
    },
    enabled: !!id,
  });

  const assetsQuery = useQuery({
    queryKey: ['portfolio-assets', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .eq('portfolio_id', id)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as PortfolioAsset[];
    },
    enabled: !!id,
  });

  const sectionsQuery = useQuery({
    queryKey: ['portfolio-sections', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('portfolio_sections')
        .select('*')
        .eq('portfolio_id', id)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as PortfolioSection[];
    },
    enabled: !!id,
  });

  // Project mutations
  const createProject = useMutation({
    mutationFn: async (data: Partial<PortfolioProject>) => {
      if (!id || !user?.id) throw new Error('Missing data');
      
      const maxOrder = projectsQuery.data?.reduce((max, p) => Math.max(max, p.display_order), -1) ?? -1;
      
      const { data: project, error } = await supabase
        .from('portfolio_projects')
        .insert({
          portfolio_id: id,
          title: data.title || 'Untitled Project',
          description: data.description,
          category: data.category,
          display_order: maxOrder + 1,
        })
        .select()
        .single();
      if (error) throw error;
      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-projects', id] });
      toast.success('Project added');
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ projectId, ...updates }: Partial<PortfolioProject> & { projectId: string }) => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-projects', id] });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-projects', id] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-assets', id] });
      toast.success('Project deleted');
    },
  });

  const reorderProjects = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const updates = orderedIds.map((projectId, index) => 
        supabase
          .from('portfolio_projects')
          .update({ display_order: index })
          .eq('id', projectId)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-projects', id] });
    },
  });

  // Asset mutations
  const uploadAsset = useMutation({
    mutationFn: async ({ 
      file, 
      projectId, 
      category 
    }: { 
      file: File; 
      projectId?: string; 
      category?: string 
    }) => {
      if (!id || !user?.id) throw new Error('Missing data');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      const fileType = file.type.startsWith('image/') ? 'image' 
        : file.type.startsWith('video/') ? 'video' 
        : 'document';

      const maxOrder = assetsQuery.data
        ?.filter(a => a.project_id === projectId)
        .reduce((max, a) => Math.max(max, a.display_order), -1) ?? -1;

      const { data: asset, error } = await supabase
        .from('portfolio_assets')
        .insert({
          portfolio_id: id,
          project_id: projectId || null,
          designer_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          file_type: fileType,
          asset_category: category || null,
          file_size: file.size,
          mime_type: file.type,
          display_order: maxOrder + 1,
        })
        .select()
        .single();
      
      if (error) throw error;
      return asset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-assets', id] });
      toast.success('Asset uploaded');
    },
    onError: (error) => {
      toast.error('Failed to upload asset');
      console.error(error);
    },
  });

  const updateAsset = useMutation({
    mutationFn: async ({ assetId, ...updates }: Partial<PortfolioAsset> & { assetId: string }) => {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .update(updates)
        .eq('id', assetId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-assets', id] });
    },
  });

  const deleteAsset = useMutation({
    mutationFn: async (assetId: string) => {
      const asset = assetsQuery.data?.find(a => a.id === assetId);
      if (asset?.file_url) {
        const path = asset.file_url.split('/portfolio-assets/')[1];
        if (path) {
          await supabase.storage.from('portfolio-assets').remove([path]);
        }
      }
      
      const { error } = await supabase
        .from('portfolio_assets')
        .delete()
        .eq('id', assetId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-assets', id] });
      toast.success('Asset deleted');
    },
  });

  // Section mutations
  const createSection = useMutation({
    mutationFn: async (data: Partial<PortfolioSection>) => {
      if (!id) throw new Error('Missing portfolio ID');
      
      const maxOrder = sectionsQuery.data?.reduce((max, s) => Math.max(max, s.display_order), -1) ?? -1;
      
      const { data: section, error } = await supabase
        .from('portfolio_sections')
        .insert({
          portfolio_id: id,
          title: data.title || 'New Section',
          section_type: data.section_type || 'gallery',
          content: data.content || {},
          display_order: maxOrder + 1,
        })
        .select()
        .single();
      if (error) throw error;
      return section;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-sections', id] });
      toast.success('Section added');
    },
  });

  const updateSection = useMutation({
    mutationFn: async ({ sectionId, ...updates }: Partial<PortfolioSection> & { sectionId: string }) => {
      const { data, error } = await supabase
        .from('portfolio_sections')
        .update(updates)
        .eq('id', sectionId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-sections', id] });
    },
  });

  const deleteSection = useMutation({
    mutationFn: async (sectionId: string) => {
      const { error } = await supabase
        .from('portfolio_sections')
        .delete()
        .eq('id', sectionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-sections', id] });
      toast.success('Section deleted');
    },
  });

  // Status mutations
  const submitForReview = useMutation({
    mutationFn: async () => {
      if (!id || !user?.id) throw new Error('Missing data');
      
      const { error } = await supabase
        .from('portfolios')
        .update({ 
          status: 'review',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) throw error;

      await supabase.from('portfolio_reviews').insert({
        portfolio_id: id,
        reviewer_id: user.id,
        action: 'submitted',
        notes: 'Portfolio submitted for review',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', id] });
      toast.success('Portfolio submitted for review');
    },
  });

  const publishPortfolio = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Missing portfolio ID');
      
      const { error } = await supabase
        .from('portfolios')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', id] });
      toast.success('Portfolio published');
    },
  });

  const unpublishPortfolio = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Missing portfolio ID');
      
      const { error } = await supabase
        .from('portfolios')
        .update({ 
          status: 'draft',
          published_at: null,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', id] });
      toast.success('Portfolio unpublished');
    },
  });

  return {
    portfolio: portfolioQuery.data,
    projects: projectsQuery.data || [],
    assets: assetsQuery.data || [],
    sections: sectionsQuery.data || [],
    isLoading: portfolioQuery.isLoading,
    
    createProject,
    updateProject,
    deleteProject,
    reorderProjects,
    
    uploadAsset,
    updateAsset,
    deleteAsset,
    
    createSection,
    updateSection,
    deleteSection,
    
    submitForReview,
    publishPortfolio,
    unpublishPortfolio,
  };
}
