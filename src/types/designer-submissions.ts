/**
 * Designer-Side StyleBox Submission Types
 * Type-safe interfaces for the designer workflow
 */

export type SubmissionStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'revision_requested';

export type DeliverableStatus = 
  | 'pending' 
  | 'uploaded' 
  | 'approved' 
  | 'rejected';

export type DesignerFileType = 
  | 'image_2d' 
  | 'technical_pack' 
  | 'model_3d' 
  | 'video' 
  | 'document';

export type CritiqueSeverity = 
  | 'info' 
  | 'suggestion' 
  | 'issue' 
  | 'critical';

export interface StyleboxSubmission {
  id: string;
  stylebox_id: string;
  designer_id: string;
  version_number: number;
  is_final: boolean;
  manifestation_rationale?: string;
  status: SubmissionStatus;
  submission_date?: string;
  review_date?: string;
  total_deliverables: number;
  completed_deliverables: number;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface SubmissionFile {
  id: string;
  submission_id: string;
  deliverable_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: DesignerFileType;
  mime_type: string;
  status: DeliverableStatus;
  thumbnail_url?: string;
  preview_url?: string;
  is_watermarked: boolean;
  watermark_text: string;
  upload_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CritiqueComment {
  id: string;
  submission_id: string;
  file_id?: string;
  admin_id: string;
  pin_x?: number;
  pin_y?: number;
  comment_text: string;
  severity: CritiqueSeverity;
  is_resolved: boolean;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  admin?: {
    name: string;
    avatar_url?: string;
  };
}

export interface DesignerDraft {
  id: string;
  submission_id: string;
  designer_id: string;
  draft_data: Record<string, any>;
  is_auto_saved: boolean;
  last_saved_at: string;
  created_at: string;
  updated_at: string;
}

export interface StyleboxShareLink {
  id: string;
  submission_id: string;
  designer_id: string;
  share_token: string;
  share_url: string;
  expires_at?: string;
  is_active: boolean;
  view_count: number;
  max_views?: number;
  allow_comments: boolean;
  allow_download: boolean;
  created_at: string;
  last_accessed_at?: string;
}

export interface ShareLinkComment {
  id: string;
  share_link_id: string;
  commenter_name: string;
  commenter_email?: string;
  comment_text: string;
  created_at: string;
}

// Upload-related types
export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  uploadedUrl?: string;
  thumbnailUrl?: string;
}

export interface DeliverableRequirement {
  id: string;
  name: string;
  description?: string;
  file_type: string;
  is_required: boolean;
  max_file_size?: number;
  accepted_formats?: string[];
}

// Submission creation/update payloads
export interface CreateSubmissionPayload {
  stylebox_id: string;
  version_number?: number;
  manifestation_rationale?: string;
}

export interface UpdateSubmissionPayload {
  manifestation_rationale?: string;
  status?: SubmissionStatus;
  is_final?: boolean;
}

export interface UploadFilePayload {
  submission_id: string;
  deliverable_id: string;
  file: File;
  apply_watermark?: boolean;
}

export interface CreateCritiquePayload {
  submission_id: string;
  file_id?: string;
  pin_x?: number;
  pin_y?: number;
  comment_text: string;
  severity?: CritiqueSeverity;
}

export interface CreateShareLinkPayload {
  submission_id: string;
  expires_in_days?: number;
  max_views?: number;
  allow_comments?: boolean;
  allow_download?: boolean;
}

// View models for UI components
export interface SubmissionWithFiles extends StyleboxSubmission {
  files: SubmissionFile[];
  stylebox?: {
    id: string;
    title: string;
    display_id?: string;
    difficulty: string;
    adorzia_deliverables?: any;
  };
}

export interface SubmissionWithCritiques extends SubmissionWithFiles {
  critiques: CritiqueComment[];
}

// Validation helpers
export const isSubmissionComplete = (submission: StyleboxSubmission): boolean => {
  return submission.completed_deliverables >= submission.total_deliverables 
    && submission.total_deliverables > 0;
};

export const canSubmit = (submission: StyleboxSubmission): boolean => {
  return isSubmissionComplete(submission) && submission.status === 'draft';
};

export const getFileTypeIcon = (fileType: DesignerFileType): string => {
  switch (fileType) {
    case 'image_2d': return '🖼️';
    case 'technical_pack': return '📋';
    case 'model_3d': return '🎨';
    case 'video': return '🎬';
    case 'document': return '📄';
    default: return '📎';
  }
};

export const getStatusColor = (status: SubmissionStatus): string => {
  switch (status) {
    case 'draft': return 'gray';
    case 'submitted': return 'blue';
    case 'under_review': return 'yellow';
    case 'approved': return 'green';
    case 'rejected': return 'red';
    case 'revision_requested': return 'orange';
    default: return 'gray';
  }
};

export const getSeverityColor = (severity: CritiqueSeverity): string => {
  switch (severity) {
    case 'info': return 'blue';
    case 'suggestion': return 'green';
    case 'issue': return 'yellow';
    case 'critical': return 'red';
    default: return 'gray';
  }
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Progress percentage formatting
export const formatProgress = (percentage: number): string => {
  return `${Math.round(percentage)}%`;
};
