# Admin Invitation System
## Technical Specification

## 1. System Architecture

### 1.1 Overview
The Admin Invitation System enables superadmins to securely invite new administrators to the platform with specified roles and permissions. The system handles the complete workflow from invitation creation to account activation.

### 1.2 Architecture Diagram
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Admin UI      │    │  Supabase Edge   │    │   PostgreSQL    │
│  (React/TS)     │◄──►│    Functions     │◄──►│   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Email Service │    │   Auth System    │    │   RLS Policies  │
│   (Resend/SES)  │    │   (Supabase)     │    │   (Security)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 2. Database Schema

### 2.1 Core Table: admin_invitations

```sql
CREATE TABLE public.admin_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'superadmin')),
    invited_by UUID REFERENCES auth.users(id) NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
    accepted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.2 RLS Policies

```sql
-- Superadmins can manage all invitations
CREATE POLICY "Superadmins can manage admin invitations" 
ON public.admin_invitations 
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'superadmin'
    )
);

-- Admins can view invitations (transparency)
CREATE POLICY "Admins can view admin invitations" 
ON public.admin_invitations 
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'superadmin')
    )
);
```

### 2.3 Indexes for Performance

```sql
CREATE INDEX idx_admin_invitations_email ON public.admin_invitations(email);
CREATE INDEX idx_admin_invitations_status ON public.admin_invitations(status);
CREATE INDEX idx_admin_invitations_expires ON public.admin_invitations(expires_at);
```

## 3. API Endpoints

### 3.1 Edge Functions

#### send-admin-invitation
**Endpoint**: `/functions/v1/send-admin-invitation`

**Request**:
```typescript
interface SendInvitationRequest {
    invitationId: string;
    email: string;
    name: string;
    role: 'admin' | 'superadmin';
    message?: string;
    invitedByName: string;
}
```

**Response**:
```typescript
interface SendInvitationResponse {
    success: boolean;
    message: string;
    invitationId: string;
}
```

#### accept-admin-invitation
**Endpoint**: `/functions/v1/accept-admin-invitation`

**Request**:
```typescript
interface AcceptInvitationRequest {
    invitationId: string;
    email: string;
    password: string;
}
```

**Response**:
```typescript
interface AcceptInvitationResponse {
    success: boolean;
    message: string;
    userId: string;
    role: 'admin' | 'superadmin';
}
```

## 4. Frontend Implementation

### 4.1 Component Structure

#### Enhanced AdminSecurity Component
```typescript
interface InviteData {
    email: string;
    name: string;
    role: 'admin' | 'superadmin';
    message: string;
}

const AdminSecurity = () => {
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [inviteData, setInviteData] = useState<InviteData>({
        email: "",
        name: "",
        role: "admin",
        message: ""
    });
    const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    
    // ... existing code
};
```

### 4.2 State Management

#### React Query Integration
```typescript
const useAdminInvitations = () => {
    return useQuery({
        queryKey: ['admin-invitations'],
        queryFn: fetchAdminInvitations,
        enabled: isSuperadmin
    });
};

const sendInvitationMutation = useMutation({
    mutationFn: sendAdminInvitation,
    onSuccess: () => {
        queryClient.invalidateQueries(['admin-invitations']);
        queryClient.invalidateQueries(['admin-users']);
    }
});
```

## 5. Security Implementation

### 5.1 Authentication Flow
```typescript
// Verify superadmin privileges
const verifySuperadmin = async (userId: string): Promise<boolean> => {
    const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'superadmin')
        .single();
    
    return !!data;
};
```

### 5.2 Authorization Checks
```typescript
// Route protection for invitation features
const InvitationProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isSuperadmin, loading } = useAdminAuth();
    
    if (loading) return <LoadingSpinner />;
    if (!isSuperadmin) return <Unauthorized />;
    
    return <>{children}</>;
};
```

### 5.3 Data Validation
```typescript
const validateInvitation = (data: InviteData): string[] => {
    const errors: string[] = [];
    
    if (!data.email) errors.push("Email is required");
    if (!data.name) errors.push("Name is required");
    if (!isValidEmail(data.email)) errors.push("Invalid email format");
    if (!['admin', 'superadmin'].includes(data.role)) errors.push("Invalid role");
    
    return errors;
};
```

## 6. Email Integration

### 6.1 Email Template
```html
<!-- Invitation Email Template -->
<h2>Admin Invitation</h2>
<p>Hello {{name}},</p>
<p>You have been invited to join the admin team as a {{role}} by {{invitedByName}}.</p>
{{#if message}}
<p><strong>Message:</strong> {{message}}</p>
{{/if}}
<p><a href="{{acceptUrl}}">Accept Invitation</a></p>
<p>This invitation will expire on {{expiryDate}}.</p>
```

### 6.2 Email Service Integration
```typescript
const sendInvitationEmail = async (invitation: InvitationData) => {
    const emailData = {
        from: 'admin@yourdomain.com',
        to: invitation.email,
        subject: `Admin Invitation - ${invitation.role} Role`,
        html: renderEmailTemplate('admin-invitation', {
            name: invitation.name,
            role: invitation.role,
            invitedByName: invitation.invitedByName,
            message: invitation.message,
            acceptUrl: `${ADMIN_BASE_URL}/accept-invitation/${invitation.id}`,
            expiryDate: format(invitation.expires_at, 'PPP')
        })
    };
    
    return await emailService.send(emailData);
};
```

## 7. Error Handling

### 7.1 Error Types
```typescript
enum InvitationError {
    INVALID_EMAIL = 'INVALID_EMAIL',
    DUPLICATE_INVITATION = 'DUPLICATE_INVITATION',
    EXPIRED_INVITATION = 'EXPIRED_INVITATION',
    ROLE_ASSIGNMENT_FAILED = 'ROLE_ASSIGNMENT_FAILED',
    ACCOUNT_CREATION_FAILED = 'ACCOUNT_CREATION_FAILED'
}
```

### 7.2 Error Responses
```typescript
const handleInvitationError = (error: InvitationError): ErrorResponse => {
    const errorMap = {
        [InvitationError.INVALID_EMAIL]: {
            status: 400,
            message: 'Please provide a valid email address'
        },
        [InvitationError.DUPLICATE_INVITATION]: {
            status: 409,
            message: 'An invitation already exists for this email'
        },
        [InvitationError.EXPIRED_INVITATION]: {
            status: 410,
            message: 'This invitation has expired'
        }
    };
    
    return errorMap[error] || {
        status: 500,
        message: 'An unexpected error occurred'
    };
};
```

## 8. Testing Strategy

### 8.1 Unit Tests
```typescript
describe('Admin Invitation System', () => {
    describe('Invitation Creation', () => {
        it('should create invitation with valid data', async () => {
            const result = await createInvitation(validInvitationData);
            expect(result.success).toBe(true);
            expect(result.invitationId).toBeDefined();
        });
        
        it('should reject invalid email format', async () => {
            await expect(createInvitation(invalidEmailData))
                .rejects.toThrow('Invalid email format');
        });
    });
    
    describe('Invitation Acceptance', () => {
        it('should accept valid invitation', async () => {
            const result = await acceptInvitation(validAcceptanceData);
            expect(result.userId).toBeDefined();
            expect(result.role).toBe('admin');
        });
        
        it('should reject expired invitation', async () => {
            await expect(acceptInvitation(expiredInvitationData))
                .rejects.toThrow('Invitation expired');
        });
    });
});
```

### 8.2 Integration Tests
```typescript
describe('End-to-End Workflow', () => {
    it('should complete full invitation workflow', async () => {
        // 1. Superadmin sends invitation
        const invitation = await sendInvitation(invitationData);
        
        // 2. Recipient accepts invitation
        const account = await acceptInvitation({
            invitationId: invitation.id,
            email: invitationData.email,
            password: 'securePassword123'
        });
        
        // 3. Verify account creation
        const user = await getUser(account.userId);
        expect(user.role).toBe(invitationData.role);
        expect(user.isActive).toBe(true);
    });
});
```

## 9. Monitoring and Analytics

### 9.1 Key Metrics
```typescript
interface InvitationMetrics {
    totalSent: number;
    accepted: number;
    expired: number;
    revoked: number;
    acceptanceRate: number;
    averageResponseTime: number;
}
```

### 9.2 Logging
```typescript
const logInvitationActivity = (activity: InvitationActivity) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        userId: activity.userId,
        action: activity.action,
        targetType: 'admin_invitation',
        targetId: activity.invitationId,
        metadata: activity.metadata
    };
    
    logger.info('Admin Invitation Activity', logEntry);
};
```

## 10. Deployment Configuration

### 10.1 Environment Variables
```bash
# Email Configuration
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=admin@yourdomain.com

# Application URLs
ADMIN_BASE_URL=https://admin.yourdomain.com
FRONTEND_BASE_URL=https://yourdomain.com

# Security Settings
INVITATION_EXPIRY_DAYS=7
MAX_INVITATIONS_PER_DAY=50
```

### 10.2 CI/CD Pipeline
```yaml
# GitHub Actions workflow
name: Deploy Admin Invitation System
on:
  push:
    branches: [main]
    paths:
      - 'src/pages/admin/AdminSecurity.tsx'
      - 'supabase/functions/send-admin-invitation/**'
      - 'supabase/functions/accept-admin-invitation/**'
      - 'supabase/migrations/*admin_invitations*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Database Migration
        run: npx supabase db push
      - name: Deploy Edge Functions
        run: |
          npx supabase functions deploy send-admin-invitation
          npx supabase functions deploy accept-admin-invitation
      - name: Deploy Frontend
        run: npm run deploy
```

## 11. Maintenance Procedures

### 11.1 Regular Tasks
- Daily cleanup of expired invitations
- Weekly review of invitation metrics
- Monthly audit of admin access permissions
- Quarterly security assessment

### 11.2 Emergency Procedures
- Immediate revocation of compromised invitations
- Rapid deployment of security patches
- Backup restoration procedures
- Incident response checklist

This technical specification provides a comprehensive guide for implementing and maintaining the Admin Invitation System.