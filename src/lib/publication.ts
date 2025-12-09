// Publication Flow Types & Status Definitions

export type PublicationStatus = 
  | 'draft'           // Not submitted
  | 'pending_review'  // Submitted, awaiting initial review
  | 'revision_requested' // Team requested changes
  | 'approved'        // Approved for sampling
  | 'sampling'        // In sampling process
  | 'sample_ready'    // Sample completed
  | 'costing_ready'   // Costing completed
  | 'pre_production'  // Ready for pre-production
  | 'marketplace_pending' // Awaiting marketplace listing
  | 'listing_preview' // Designer preview before publish
  | 'published'       // Live on marketplace
  | 'rejected';       // Rejected (with reason)

export interface PublicationStatusConfig {
  id: PublicationStatus;
  label: string;
  description: string;
  stage: 'submission' | 'review' | 'production' | 'marketplace';
  order: number;
  designerEditable: boolean;
}

export const PUBLICATION_STATUSES: Record<PublicationStatus, PublicationStatusConfig> = {
  draft: {
    id: 'draft',
    label: 'Draft',
    description: 'Work in progress',
    stage: 'submission',
    order: 0,
    designerEditable: true,
  },
  pending_review: {
    id: 'pending_review',
    label: 'Pending Review',
    description: 'Submitted for initial review',
    stage: 'review',
    order: 1,
    designerEditable: false,
  },
  revision_requested: {
    id: 'revision_requested',
    label: 'Revision Requested',
    description: 'Changes needed before approval',
    stage: 'review',
    order: 2,
    designerEditable: true,
  },
  approved: {
    id: 'approved',
    label: 'Approved',
    description: 'Approved for sampling',
    stage: 'production',
    order: 3,
    designerEditable: false,
  },
  sampling: {
    id: 'sampling',
    label: 'Sampling',
    description: 'Sample being created',
    stage: 'production',
    order: 4,
    designerEditable: false,
  },
  sample_ready: {
    id: 'sample_ready',
    label: 'Sample Ready',
    description: 'Sample completed',
    stage: 'production',
    order: 5,
    designerEditable: false,
  },
  costing_ready: {
    id: 'costing_ready',
    label: 'Costing Ready',
    description: 'Final costing completed',
    stage: 'production',
    order: 6,
    designerEditable: false,
  },
  pre_production: {
    id: 'pre_production',
    label: 'Pre-Production',
    description: 'Ready for manufacturing',
    stage: 'production',
    order: 7,
    designerEditable: false,
  },
  marketplace_pending: {
    id: 'marketplace_pending',
    label: 'Marketplace Prep',
    description: 'Listing being prepared',
    stage: 'marketplace',
    order: 8,
    designerEditable: false,
  },
  listing_preview: {
    id: 'listing_preview',
    label: 'Preview Listing',
    description: 'Review before going live',
    stage: 'marketplace',
    order: 9,
    designerEditable: false,
  },
  published: {
    id: 'published',
    label: 'Published',
    description: 'Live on marketplace',
    stage: 'marketplace',
    order: 10,
    designerEditable: false,
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    description: 'Not approved for publication',
    stage: 'review',
    order: -1,
    designerEditable: true,
  },
};

// Required fields for publication submission
export interface ProjectCompleteness {
  title: boolean;
  description: boolean;
  category: boolean;
  sketches: boolean;
  moodboard: boolean;
  mockups: boolean;
  story?: boolean; // Optional
  fabricNotes?: boolean; // Optional
}

export const REQUIRED_FIELDS = [
  'title',
  'description', 
  'category',
  'sketches',
  'moodboard',
  'mockups',
] as const;

export const OPTIONAL_FIELDS = [
  'story',
  'fabricNotes',
] as const;

export function calculateCompleteness(fields: ProjectCompleteness): number {
  const required = REQUIRED_FIELDS.filter(f => fields[f]).length;
  const total = REQUIRED_FIELDS.length;
  return Math.round((required / total) * 100);
}

export function isEligibleForPublish(
  completeness: number,
  subscriptionTier: 'basic' | 'pro' | 'elite'
): { eligible: boolean; reason?: string } {
  if (subscriptionTier === 'basic') {
    return { 
      eligible: false, 
      reason: 'Pro or Elite subscription required to publish' 
    };
  }
  
  if (completeness < 100) {
    return { 
      eligible: false, 
      reason: 'All required fields must be completed' 
    };
  }
  
  return { eligible: true };
}

export function getStatusStageProgress(status: PublicationStatus): number {
  const config = PUBLICATION_STATUSES[status];
  if (config.order === -1) return 0; // Rejected
  return Math.round((config.order / 10) * 100);
}
