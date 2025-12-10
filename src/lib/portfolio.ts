// Portfolio System Types

export type PortfolioVisibility = 'private' | 'public' | 'marketplace_only';
export type PortfolioStatus = 'draft' | 'review' | 'approved' | 'published' | 'rejected';
export type AssetCategory = 'sketch' | 'moodboard' | 'mockup' | 'final' | 'process';
export type SectionType = 'gallery' | 'text' | 'hero' | 'about' | 'contact';

export interface Portfolio {
  id: string;
  designer_id: string;
  title: string;
  description: string | null;
  tagline: string | null;
  category: string;
  cover_image: string | null;
  status: PortfolioStatus;
  visibility: PortfolioVisibility;
  version: number;
  slug: string | null;
  seo_title: string | null;
  seo_description: string | null;
  view_count: number;
  quality_score: number | null;
  is_locked: boolean;
  locked_by: string | null;
  locked_at: string | null;
  reviewer_notes: string | null;
  settings: Record<string, any>;
  published_at: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
  items?: any;
  pdf_exported?: boolean;
}

export interface PortfolioProject {
  id: string;
  portfolio_id: string;
  title: string;
  description: string | null;
  category: string | null;
  tags: string[] | null;
  thumbnail_url: string | null;
  display_order: number;
  is_featured: boolean;
  source_type: string | null;
  source_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  assets?: PortfolioAsset[];
}

export interface PortfolioAsset {
  id: string;
  portfolio_id: string;
  project_id: string | null;
  designer_id: string;
  file_name: string;
  file_url: string;
  file_type: 'image' | 'video' | 'document';
  asset_category: AssetCategory | null;
  file_size: number | null;
  mime_type: string | null;
  dimensions: { width: number; height: number } | null;
  display_order: number;
  alt_text: string | null;
  caption: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface PortfolioSection {
  id: string;
  portfolio_id: string;
  title: string;
  section_type: SectionType;
  content: Record<string, any>;
  display_order: number;
  is_visible: boolean;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PortfolioVersion {
  id: string;
  portfolio_id: string;
  version_number: number;
  snapshot: Record<string, any>;
  change_summary: string | null;
  created_by: string;
  created_at: string;
}

export interface PortfolioReview {
  id: string;
  portfolio_id: string;
  reviewer_id: string;
  action: string;
  notes: string | null;
  quality_score: number | null;
  feedback: Record<string, any>;
  created_at: string;
}

export const PORTFOLIO_STATUS_CONFIG: Record<PortfolioStatus, {
  label: string;
  description: string;
  color: string;
  canEdit: boolean;
}> = {
  draft: {
    label: 'Draft',
    description: 'Working on your portfolio',
    color: 'bg-muted text-muted-foreground',
    canEdit: true,
  },
  review: {
    label: 'In Review',
    description: 'Submitted for admin review',
    color: 'bg-primary/10 text-primary',
    canEdit: false,
  },
  approved: {
    label: 'Approved',
    description: 'Ready to publish',
    color: 'bg-green-500/10 text-green-600',
    canEdit: true,
  },
  published: {
    label: 'Published',
    description: 'Live and visible',
    color: 'bg-green-500/10 text-green-600',
    canEdit: true,
  },
  rejected: {
    label: 'Needs Changes',
    description: 'Review feedback available',
    color: 'bg-destructive/10 text-destructive',
    canEdit: true,
  },
};

export const VISIBILITY_CONFIG: Record<PortfolioVisibility, {
  label: string;
  description: string;
  icon: string;
}> = {
  private: {
    label: 'Private',
    description: 'Only you can see this',
    icon: 'Lock',
  },
  public: {
    label: 'Public',
    description: 'Anyone with the link can view',
    icon: 'Globe',
  },
  marketplace_only: {
    label: 'Marketplace Only',
    description: 'Visible on Adorzia marketplace',
    icon: 'Store',
  },
};

export const ASSET_CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: 'sketch', label: 'Sketch' },
  { value: 'moodboard', label: 'Moodboard' },
  { value: 'mockup', label: 'Mockup' },
  { value: 'final', label: 'Final Design' },
  { value: 'process', label: 'Process' },
];

export const SECTION_TYPES: { value: SectionType; label: string; description: string }[] = [
  { value: 'hero', label: 'Hero', description: 'Large featured image section' },
  { value: 'gallery', label: 'Gallery', description: 'Grid of project images' },
  { value: 'text', label: 'Text', description: 'Rich text content block' },
  { value: 'about', label: 'About', description: 'Designer bio and info' },
  { value: 'contact', label: 'Contact', description: 'Contact information' },
];
