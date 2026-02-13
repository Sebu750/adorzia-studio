// Publication Flow Types & Status Definitions
// Aligned with Adorzia Publication Flow Specification

export type PublicationStatus = 
  | 'draft'              // Not submitted - designer working
  | 'pending_review'     // Submitted, awaiting initial review
  | 'revision_requested' // Team requested changes
  | 'approved'           // Approved for sampling
  | 'sampling'           // In sampling process
  | 'sample_ready'       // Sample completed
  | 'costing_ready'      // Costing completed
  | 'pre_production'     // Ready for pre-production
  | 'marketplace_pending'// Awaiting marketplace listing
  | 'listing_preview'    // Designer preview before publish
  | 'published'          // Live on marketplace
  | 'rejected';          // Rejected (with reason)

export type ProductionStage = 
  | 'submission'
  | 'sampling'
  | 'techpack'
  | 'preproduction'
  | 'marketplace';

export interface PublicationStatusConfig {
  id: PublicationStatus;
  label: string;
  description: string;
  stage: 'submission' | 'review' | 'production' | 'marketplace';
  order: number;
  designerEditable: boolean;
  designerVisible: boolean;
  adminActions: string[];
}

export const PUBLICATION_STATUSES: Record<PublicationStatus, PublicationStatusConfig> = {
  draft: {
    id: 'draft',
    label: 'Draft',
    description: 'Work in progress',
    stage: 'submission',
    order: 0,
    designerEditable: true,
    designerVisible: true,
    adminActions: [],
  },
  pending_review: {
    id: 'pending_review',
    label: 'Pending Review',
    description: 'Submitted for initial review',
    stage: 'review',
    order: 1,
    designerEditable: false,
    designerVisible: true,
    adminActions: ['approve', 'request_revision', 'reject'],
  },
  revision_requested: {
    id: 'revision_requested',
    label: 'Revision Requested',
    description: 'Changes needed before approval',
    stage: 'review',
    order: 2,
    designerEditable: true,
    designerVisible: true,
    adminActions: [],
  },
  approved: {
    id: 'approved',
    label: 'Approved',
    description: 'Approved for sampling',
    stage: 'production',
    order: 3,
    designerEditable: false,
    designerVisible: true,
    adminActions: ['start_sampling'],
  },
  sampling: {
    id: 'sampling',
    label: 'Sampling',
    description: 'Sample being created',
    stage: 'production',
    order: 4,
    designerEditable: false,
    designerVisible: true,
    adminActions: ['complete_sampling', 'reject'],
  },
  sample_ready: {
    id: 'sample_ready',
    label: 'Sample Ready',
    description: 'Sample completed',
    stage: 'production',
    order: 5,
    designerEditable: false,
    designerVisible: true,
    adminActions: ['start_costing'],
  },
  costing_ready: {
    id: 'costing_ready',
    label: 'Costing Ready',
    description: 'Final costing completed',
    stage: 'production',
    order: 6,
    designerEditable: false,
    designerVisible: true,
    adminActions: ['approve_preproduction'],
  },
  pre_production: {
    id: 'pre_production',
    label: 'Pre-Production',
    description: 'Ready for manufacturing',
    stage: 'production',
    order: 7,
    designerEditable: false,
    designerVisible: true,
    adminActions: ['send_to_marketplace'],
  },
  marketplace_pending: {
    id: 'marketplace_pending',
    label: 'Marketplace Prep',
    description: 'Listing being prepared',
    stage: 'marketplace',
    order: 8,
    designerEditable: false,
    designerVisible: true,
    adminActions: ['create_listing'],
  },
  listing_preview: {
    id: 'listing_preview',
    label: 'Preview Listing',
    description: 'Review before going live',
    stage: 'marketplace',
    order: 9,
    designerEditable: false,
    designerVisible: true,
    adminActions: ['publish', 'request_adjustments'],
  },
  published: {
    id: 'published',
    label: 'Published',
    description: 'Live on marketplace',
    stage: 'marketplace',
    order: 10,
    designerEditable: false,
    designerVisible: true,
    adminActions: ['unpublish'],
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    description: 'Not approved for publication',
    stage: 'review',
    order: -1,
    designerEditable: true,
    designerVisible: true,
    adminActions: [],
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
  story?: boolean;
  fabricNotes?: boolean;
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
  if (config.order === -1) return 0;
  return Math.round((config.order / 10) * 100);
}

// Production queue stages mapping
export const PRODUCTION_STAGES: Record<ProductionStage, {
  label: string;
  statuses: PublicationStatus[];
  teams: string[];
}> = {
  submission: {
    label: 'Submission Queue',
    statuses: ['pending_review', 'revision_requested'],
    teams: ['Review Team'],
  },
  sampling: {
    label: 'Sampling Queue',
    statuses: ['approved', 'sampling', 'sample_ready'],
    teams: ['Production Team', 'Sourcing Team'],
  },
  techpack: {
    label: 'Tech Pack Queue',
    statuses: ['sample_ready', 'costing_ready'],
    teams: ['Production Team'],
  },
  preproduction: {
    label: 'Pre-Production Queue',
    statuses: ['costing_ready', 'pre_production'],
    teams: ['QA Team', 'Production Team'],
  },
  marketplace: {
    label: 'Marketplace Queue',
    statuses: ['marketplace_pending', 'listing_preview'],
    teams: ['Marketplace Team'],
  },
};

// Status transition rules
export const STATUS_TRANSITIONS: Record<PublicationStatus, PublicationStatus[]> = {
  draft: ['pending_review'],
  pending_review: ['approved', 'revision_requested', 'rejected'],
  revision_requested: ['pending_review'],
  approved: ['sampling'],
  sampling: ['sample_ready', 'rejected'],
  sample_ready: ['costing_ready'],
  costing_ready: ['pre_production'],
  pre_production: ['marketplace_pending'],
  marketplace_pending: ['listing_preview'],
  listing_preview: ['published', 'marketplace_pending'],
  published: [],
  rejected: ['draft'],
};

export function canTransition(from: PublicationStatus, to: PublicationStatus): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

// Auto-approve timeout (48 hours in milliseconds)
export const AUTO_APPROVE_TIMEOUT_MS = 48 * 60 * 60 * 1000;

export function getAutoApproveDeadline(submittedAt: Date): Date {
  return new Date(submittedAt.getTime() + AUTO_APPROVE_TIMEOUT_MS);
}

export function shouldAutoApprove(autoApproveAt: Date | null): boolean {
  if (!autoApproveAt) return false;
  return new Date() >= autoApproveAt;
}
