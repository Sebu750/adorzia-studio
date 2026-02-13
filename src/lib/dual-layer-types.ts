// Dual Layer Operating Model - Type Definitions

export interface Project {
  id: string;
  designer_id: string;
  title: string;
  description: string | null;
  category: string;
  status: 'draft' | 'in_progress' | 'completed' | 'published';
  tags: string[] | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectAsset {
  id: string;
  project_id: string;
  designer_id: string;
  name: string;
  type: 'image' | 'video' | 'document' | '3d_model' | 'other';
  url: string;
  thumbnail_url: string | null;
  display_order: number;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface PublicationRequest {
  id: string;
  designer_id: string;
  project_id: string;
  project_title?: string;
  project_description?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  admin_notes: string | null;
  marketplace_conversion_id: string | null;
  created_at: string;
  updated_at: string;
}
