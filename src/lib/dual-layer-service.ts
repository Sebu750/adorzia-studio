import { Project, ProjectAsset, PublicationRequest } from './dual-layer-types';
import { supabase } from '../integrations/supabase/client';

export class DualLayerService {
  // Designer Operations
  static async createProject(
    designerId: string,
    projectData: Omit<Project, 'id' | 'designer_id' | 'created_at' | 'updated_at'>
  ): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectData, designer_id: designerId }])
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  static async updateProject(
    projectId: string,
    projectData: Partial<Omit<Project, 'id' | 'designer_id'>>,
    designerId: string
  ): Promise<Project | null> {
    try {
      // First verify the designer owns this project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('designer_id')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      if (project.designer_id !== designerId) {
        throw new Error('Unauthorized: You do not own this project');
      }

      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  static async deleteProject(projectId: string, designerId: string): Promise<boolean> {
    try {
      // Verify ownership
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('designer_id')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      if (project.designer_id !== designerId) {
        throw new Error('Unauthorized: You do not own this project');
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  static async getDesignerProjects(designerId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('designer_id', designerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Project[];
    } catch (error) {
      console.error('Error fetching designer projects:', error);
      return [];
    }
  }

  // Project Asset Operations
  static async uploadProjectAsset(
    projectId: string,
    assetData: Omit<ProjectAsset, 'id' | 'designer_id' | 'created_at'>
  ): Promise<ProjectAsset | null> {
    try {
      // Get designer ID from project to verify access
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('designer_id')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      const { data, error } = await supabase
        .from('project_assets')
        .insert([{ ...assetData, designer_id: project.designer_id, project_id: projectId }])
        .select()
        .single();

      if (error) throw error;
      return data as ProjectAsset;
    } catch (error) {
      console.error('Error uploading project asset:', error);
      return null;
    }
  }

  static async getProjectAssets(projectId: string): Promise<ProjectAsset[]> {
    try {
      const { data, error } = await supabase
        .from('project_assets')
        .select('*')
        .eq('project_id', projectId)
        .order('display_order');

      if (error) throw error;
      return (data || []) as ProjectAsset[];
    } catch (error) {
      console.error('Error fetching project assets:', error);
      return [];
    }
  }

  // Publication Request Operations
  static async submitPublicationRequest(
    designerId: string,
    request: Omit<PublicationRequest, 'id' | 'designer_id' | 'status' | 'submitted_at' | 'created_at' | 'updated_at'>
  ): Promise<PublicationRequest | null> {
    try {
      // Verify the project belongs to the designer
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('designer_id')
        .eq('id', request.project_id)
        .single();

      if (projectError) throw projectError;
      if (project.designer_id !== designerId) {
        throw new Error('Unauthorized: You do not own this project');
      }

      const { data, error } = await supabase
        .from('publication_requests')
        .insert([{
          ...request,
          designer_id: designerId,
          status: 'pending',
          submitted_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data as PublicationRequest;
    } catch (error) {
      console.error('Error submitting publication request:', error);
      return null;
    }
  }

  static async getDesignerPublicationRequests(designerId: string): Promise<PublicationRequest[]> {
    try {
      const { data, error } = await supabase
        .from('publication_requests')
        .select(`
          *,
          projects!publication_requests_project_id_fkey(title, description, category)
        `)
        .eq('designer_id', designerId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      
      // Flatten the project data into the request object
      return (data || []).map(req => ({
        ...req,
        project_title: req.projects?.title,
        project_description: req.projects?.description
      })) as any;
    } catch (error) {
      console.error('Error fetching designer publication requests:', error);
      return [];
    }
  }

  // Admin Operations
  static async getPendingPublicationRequests(): Promise<PublicationRequest[]> {
    try {
      const { data, error } = await supabase
        .from('publication_requests')
        .select(`
          *,
          projects!publication_requests_project_id_fkey(*)
        `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return (data || []) as any;
    } catch (error) {
      console.error('Error fetching pending publication requests:', error);
      return [];
    }
  }

  static async reviewPublicationRequest(
    requestId: string,
    adminId: string,
    decision: 'approved' | 'rejected' | 'under_review',
    notes?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('publication_requests')
        .update({
          status: decision,
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminId,
          admin_notes: notes || null
        })
        .eq('id', requestId);

      if (error) throw error;

      // If approved, convert to marketplace product
      if (decision === 'approved') {
        await this.convertRequestToProduct(requestId, adminId);
      }

      return true;
    } catch (error) {
      console.error('Error reviewing publication request:', error);
      return false;
    }
  }

  static async convertRequestToProduct(requestId: string, adminId: string): Promise<boolean> {
    try {
      // Get the full request with project data
      const { data: request, error: requestError } = await supabase
        .from('publication_requests')
        .select(`
          *,
          projects!publication_requests_project_id_fkey(*)
        `)
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      const req = request as any;
      const project = req.projects;

      // Create a marketplace product from the project data
      const { data: productData, error: productError } = await supabase
        .from('marketplace_products')
        .insert([{
          title: project.title,
          description: project.description || '',
          designer_id: project.designer_id,
          price: 0, // Admin sets price later
          inventory_count: 0, // Admin manages inventory
          status: 'draft', // Admin publishes when ready
          images: project.metadata?.images || [],
          tags: project.tags || [],
          // Link back to the original publication request
          portfolio_publication_id: req.id
        }])
        .select()
        .single();

      if (productError) throw productError;

      // Update the request to link to the created product
      await supabase
        .from('publication_requests')
        .update({
          marketplace_conversion_id: productData.id
        })
        .eq('id', requestId);

      console.log(`Converted request ${requestId} to product ${productData.id}`);
      return true;
    } catch (error) {
      console.error('Error converting request to product:', error);
      return false;
    }
  }

  static async getProductForRequest(requestId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('publication_requests')
        .select('marketplace_conversion_id')
        .eq('id', requestId)
        .single();

      if (error) throw error;

      if (!data?.marketplace_conversion_id) {
        return null;
      }

      // Get the product details
      const { data: product, error: productError } = await supabase
        .from('marketplace_products')
        .select('*')
        .eq('id', data.marketplace_conversion_id)
        .single();

      if (productError) throw productError;
      return product;
    } catch (error) {
      console.error('Error getting product for request:', error);
      return null;
    }
  }
}