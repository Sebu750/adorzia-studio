# Founding Designers Submission Management System
## Technical Specification

## 1. System Architecture

### 1.1 Overview
The Founding Designers Submission Management System is a comprehensive admin interface built on the Supabase platform that enables administrators to review, approve, reject, and provide feedback on designer submissions for the Founding Designers Program.

### 1.2 Architecture Components
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Admin UI      │    │  Supabase Edge   │    │   PostgreSQL    │
│  (React/TS)     │◄──►│    Functions     │◄──►│   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Supabase      │    │  Storage API     │    │   Realtime      │
│   Auth/RBAC     │    │   (Files)        │    │   Subscriptions │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 2. Database Schema

### 2.1 Core Tables

#### founding_designers_submissions
```sql
CREATE TABLE public.founding_designers_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    designer_id UUID REFERENCES auth.users(id),
    collection_name TEXT NOT NULL,
    design_philosophy TEXT,
    designer_vision_statement TEXT,
    primary_category TEXT,
    status TEXT DEFAULT 'pending',
    moodboard_files JSONB,
    tech_pack_files JSONB,
    articles JSONB,
    estimated_articles INTEGER,
    proposed_materials TEXT,
    target_seasonal_launch TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    admin_feedback TEXT,
    internal_notes TEXT,
    rejection_reason TEXT,
    status_history JSONB DEFAULT '[]'::jsonb,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id)
);
```

#### profiles (extended for founding designers)
```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS (
    brand_name TEXT,
    is_founding_designer BOOLEAN DEFAULT FALSE,
    founder_tier TEXT DEFAULT 'standard',
    founding_title_assigned BOOLEAN DEFAULT FALSE
);
```

### 2.2 RLS Policies
```sql
-- Admin access policies
CREATE POLICY "Admins can view all founding submissions"
ON public.founding_designers_submissions
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'superadmin')
    )
);

CREATE POLICY "Admins can update founding submissions"
ON public.founding_designers_submissions
FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'superadmin')
    )
);
```

## 3. API Endpoints

### 3.1 Edge Functions

#### manage-founding
**Endpoint**: `/functions/v1/manage-founding`

**Actions**:
- `approve`: Approve submission and promote designer
- `reject`: Reject submission with reason
- `feedback`: Send feedback requiring revisions
- `mark_review`: Mark submission as under review

**Request Format**:
```typescript
interface ManageFoundingRequest {
    action: 'approve' | 'reject' | 'feedback' | 'mark_review';
    submissionId: string;
    feedback?: string;
    internalNotes?: string;
    rejectionReason?: string;
    tier?: 'standard' | 'f1' | 'f2';
    designerId?: string;
}
```

**Response Format**:
```typescript
interface ManageFoundingResponse {
    success: boolean;
    message: string;
    data?: any;
}
```

### 3.2 Database Functions

#### log_founding_submission_status_change()
```sql
CREATE OR REPLACE FUNCTION public.log_founding_submission_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        NEW.status_history = NEW.status_history || jsonb_build_object(
            'from', OLD.status,
            'to', NEW.status,
            'timestamp', now(),
            'changed_by', auth.uid()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### notify_submission_reviewed()
```sql
CREATE OR REPLACE FUNCTION public.notify_submission_reviewed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status != OLD.status AND NEW.status IN ('approved', 'rejected', 'revisions_required') THEN
        INSERT INTO public.notifications (user_id, type, title, message, metadata)
        VALUES (
            NEW.designer_id,
            'submission',
            'Founding Designers Submission ' || 
                CASE 
                    WHEN NEW.status = 'approved' THEN 'Approved'
                    WHEN NEW.status = 'rejected' THEN 'Rejected'
                    WHEN NEW.status = 'revisions_required' THEN 'Needs Revisions'
                END,
            'Your collection "' || NEW.collection_name || '" has been reviewed.',
            jsonb_build_object(
                'submission_id', NEW.id,
                'collection_name', NEW.collection_name,
                'status', NEW.status,
                'admin_feedback', NEW.admin_feedback
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## 4. Frontend Implementation

### 4.1 Component Structure

#### AdminFoundingSubmissions.tsx
```typescript
interface FoundingSubmission {
    id: string;
    designer_id: string;
    collection_name: string;
    design_philosophy: string | null;
    designer_vision_statement: string | null;
    primary_category: string;
    status: string;
    moodboard_files: any[];
    tech_pack_files: any[];
    articles: any[];
    estimated_articles: number;
    proposed_materials: string | null;
    target_seasonal_launch: string;
    created_at: string;
    admin_feedback: string | null;
    internal_notes: string | null;
    rejection_reason: string | null;
    status_history: any[];
    designer?: {
        name: string | null;
        avatar_url: string | null;
        email: string | null;
        brand_name: string | null;
        is_founding_designer: boolean;
    };
}
```

#### AdminFoundingReview.tsx
Key features:
- Detailed submission review interface
- Article gallery with preview capabilities
- Status change workflows (approve/reject/feedback)
- Tier assignment and title management
- Internal notes and audit trail

### 4.2 State Management

#### React Query Hooks
```typescript
// Fetch submissions
const { data: submissions, isLoading, refetch } = useQuery({
    queryKey: ['admin-founding-submissions', filters],
    queryFn: fetchFoundingSubmissions
});

// Update submission status
const updateStatusMutation = useMutation({
    mutationFn: updateSubmissionStatus,
    onSuccess: () => {
        queryClient.invalidateQueries(['admin-founding-submissions']);
        queryClient.invalidateQueries(['admin-founding-submission', submissionId]);
    }
});
```

### 4.3 UI Components

#### Status Badges
```typescript
const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    pending: { label: "Submitted", color: "bg-blue-500/10 text-blue-500", icon: FileText },
    under_review: { label: "Under Review", color: "bg-amber-500/10 text-amber-500", icon: Clock },
    revisions_required: { label: "Feedback Sent", color: "bg-orange-500/10 text-orange-500", icon: Info },
    approved: { label: "Approved", color: "bg-success/10 text-success", icon: CheckCircle },
    rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive", icon: XCircle }
};
```

## 5. Security Implementation

### 5.1 Authentication Flow
```typescript
// Admin authentication check
const { session } = useAdminAuth();
const hasAdminRole = session?.user?.app_metadata?.role === 'admin' || 
                    session?.user?.app_metadata?.role === 'superadmin';

// Protected route wrapper
const AdminRoute = ({ children }: { children: ReactNode }) => {
    const { session, isLoading } = useAdminAuth();
    
    if (isLoading) return <LoadingSpinner />;
    if (!session) return <Navigate to="/admin/login" />;
    if (!hasAdminRole) return <Unauthorized />;
    
    return <>{children}</>;
};
```

### 5.2 Authorization Checks
```typescript
// RLS policy enforcement
const canManageSubmissions = async (userId: string) => {
    const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .in('role', ['admin', 'superadmin']);
    
    return !error && data?.length > 0;
};
```

## 6. File Management

### 6.1 Storage Structure
```
founding-submissions/
├── {user_id}/
│   ├── {submission_id}/
│   │   ├── moodboards/
│   │   │   └── [uploaded_files]
│   │   ├── tech-packs/
│   │   │   └── [uploaded_files]
│   │   └── articles/
│   │       └── [article_files]
```

### 6.2 File Upload Handler
```typescript
const uploadFiles = async (files: File[], path: string) => {
    const uploadedFiles = [];
    
    for (const file of files) {
        const fileName = `${path}/${Date.now()}-${file.name}`;
        const { data, error } = await supabaseAdmin.storage
            .from('founding-submissions')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });
            
        if (!error) {
            uploadedFiles.push({
                name: file.name,
                path: fileName,
                url: `${SUPABASE_URL}/storage/v1/object/public/founding-submissions/${fileName}`
            });
        }
    }
    
    return uploadedFiles;
};
```

## 7. Notification System

### 7.1 Email Templates
```typescript
const emailTemplates = {
    approved: {
        subject: '🎉 Your Founding Designers Submission Has Been Approved!',
        template: 'founding-approved'
    },
    rejected: {
        subject: 'Founding Designers Submission Review Complete',
        template: 'founding-rejected'
    },
    feedback: {
        subject: '📝 Feedback on Your Founding Designers Submission',
        template: 'founding-feedback'
    }
};
```

### 7.2 In-App Notifications
```typescript
const sendNotification = async (userId: string, type: string, data: any) => {
    await supabase.from('notifications').insert({
        user_id: userId,
        type,
        title: data.title,
        message: data.message,
        metadata: data.metadata,
        read: false
    });
};
```

## 8. Testing Strategy

### 8.1 Unit Tests
```typescript
// Test submission approval workflow
describe('Submission Approval', () => {
    it('should approve submission and update designer profile', async () => {
        const result = await approveSubmission(mockSubmissionId, mockFeedback);
        expect(result.success).toBe(true);
        expect(result.designer.is_founding_designer).toBe(true);
    });
    
    it('should reject submission with required reason', async () => {
        await expect(rejectSubmission(mockSubmissionId)).rejects.toThrow();
        const result = await rejectSubmission(mockSubmissionId, mockReason);
        expect(result.success).toBe(true);
    });
});
```

### 8.2 Integration Tests
```typescript
// Test end-to-end workflow
describe('Admin Review Workflow', () => {
    it('should complete full review process', async () => {
        // 1. Load submission
        const submission = await loadSubmission(submissionId);
        
        // 2. Add feedback
        await provideFeedback(submissionId, feedbackText);
        
        // 3. Approve with tier assignment
        await approveSubmission(submissionId, 'f1');
        
        // 4. Verify final state
        const updated = await loadSubmission(submissionId);
        expect(updated.status).toBe('approved');
        expect(updated.designer.founder_tier).toBe('f1');
    });
});
```

## 9. Deployment Configuration

### 9.1 Environment Variables
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration
RESEND_API_KEY=your_resend_key
FROM_EMAIL=noreply@yourdomain.com

# Application Settings
ADMIN_BASE_URL=https://admin.yourdomain.com
```

### 9.2 CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Admin Panel
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build application
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 10. Monitoring and Analytics

### 10.1 Key Metrics to Track
- Submission processing time
- Approval/rejection rates
- Admin response times
- System performance metrics
- User satisfaction scores

### 10.2 Error Tracking
```typescript
// Log errors with context
const logError = (error: Error, context: Record<string, any>) => {
    console.error('Admin Error:', {
        error: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userId: session?.user?.id
    });
};
```

## 11. Maintenance Procedures

### 11.1 Regular Tasks
- Database backup verification
- Security audit reviews
- Performance optimization
- Dependency updates
- User access reviews

### 11.2 Emergency Procedures
- Rollback process documentation
- Incident response checklist
- Backup restoration procedures
- Communication protocols

This technical specification provides a comprehensive guide for implementing and maintaining the Founding Designers Submission Management System.