# Adorzia Core Operating Model Implementation Plan

## Executive Summary
This plan outlines the technical implementation required to enforce the **Creative-Commercial Bifurcation** model where designers are creative partners with zero operational authority, and Adorzia Admin controls the entire commercial value chain.

---

## Current State Analysis

### ✅ Already Implemented
1. **Portfolio System**: Designers can create portfolio projects (styleboxes + uploads)
2. **Publication Request Workflow**: `portfolio_publications` table with approval pipeline
3. **Admin Review System**: Admin can approve/reject/request revisions via `AdminPublications.tsx`
4. **Production Queues**: Multi-stage pipeline (submission → sampling → techpack → preproduction → marketplace)
5. **Marketplace Products**: Separate `marketplace_products` table (admin-created)
6. **RLS Policies**: Designers cannot directly manipulate marketplace data
7. **Designer Profiles**: Public-facing curated profiles on marketplace

### ⚠️ Gaps & Violations
1. **Direct Publishing Risk**: No explicit logic gate preventing designer-initiated marketplace listings
2. **Designer Asset Control**: Designers may still upload assets that could bypass admin curation
3. **Pricing Exposure**: No explicit restriction preventing designers from seeing/influencing pricing
4. **Operational KPI Leakage**: Dashboard may expose employment-style metrics (e.g., pending counts, completion rates)
5. **Profile Editing**: Designer profiles may allow self-editing instead of admin-only curation
6. **Data Silos Incomplete**: Portfolio (creative) and Marketplace (commercial) layers not fully isolated
7. **Designer-Marketplace Linkage**: No clear enforcement that `marketplace_products.designer_id` is attribution-only

---

## Implementation Roadmap

### Phase 1: Database Schema Enforcement (Critical)
**Objective**: Lock down database constraints to prevent unauthorized commercial actions.

#### 1.1 Marketplace Product Creation Restriction
```sql
-- Migration: 20260130000000_enforce_admin_only_marketplace_creation.sql

-- Add created_by field to track who created the product (must be admin)
ALTER TABLE public.marketplace_products 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Add check constraint: Only admins can create marketplace products
ALTER TABLE public.marketplace_products 
ADD CONSTRAINT marketplace_products_admin_only 
CHECK (created_by IN (SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'superadmin')));

-- Update existing products to set created_by
UPDATE public.marketplace_products 
SET created_by = (SELECT user_id FROM public.user_roles WHERE role = 'superadmin' LIMIT 1)
WHERE created_by IS NULL;

-- Make created_by NOT NULL after backfill
ALTER TABLE public.marketplace_products ALTER COLUMN created_by SET NOT NULL;
```

#### 1.2 Designer Attribution Clarification
```sql
-- Add comment to clarify designer_id is attribution-only
COMMENT ON COLUMN public.marketplace_products.designer_id IS 
  'Creative attribution link to the designer. Designer has NO control over this product listing. All commercial operations (pricing, inventory, status) are admin-exclusive.';

-- Ensure designer_id is nullable (products can be Adorzia-original)
ALTER TABLE public.marketplace_products ALTER COLUMN designer_id DROP NOT NULL;
```

#### 1.3 Portfolio Publications Immutability
```sql
-- Once submitted, designers cannot modify the submission
CREATE OR REPLACE FUNCTION prevent_designer_publication_modification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != 'draft' AND auth.uid() = (SELECT designer_id FROM public.portfolios WHERE id = OLD.portfolio_id) THEN
    RAISE EXCEPTION 'Cannot modify publication after submission. Contact admin for changes.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public', 'pg_temp';

CREATE TRIGGER enforce_publication_immutability
BEFORE UPDATE ON public.portfolio_publications
FOR EACH ROW EXECUTE FUNCTION prevent_designer_publication_modification();
```

#### 1.4 Profile Curation Lockdown
```sql
-- Add admin_curated flag to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS admin_curated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_curated_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS last_curated_at TIMESTAMPTZ;

-- RLS: Designers have read-only access to their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Designers view own profile read-only"
  ON public.profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Only admins can update profiles"
  ON public.profiles FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );
```

---

### Phase 2: Application Logic Enforcement (High Priority)

#### 2.1 Remove Designer Marketplace Access
**Files to Update:**
- `src/pages/Portfolio.tsx`: Remove any "Publish to Marketplace" buttons
- `src/components/portfolio/PortfolioGrid.tsx`: Disable direct marketplace actions
- `src/hooks/usePortfolioData.tsx`: Ensure no marketplace mutation functions

**Action:**
```tsx
// Portfolio.tsx - Replace "Publish to Marketplace" with "Request Commercialization"
<Button 
  variant="accent" 
  onClick={() => setPublishFormOpen(true)}
  disabled={projects.length === 0}
>
  <Send className="h-4 w-4" />
  Request Commercialization  {/* Changed from "Publish" */}
</Button>
```

#### 2.2 Publication Request Form Updates
**File:** `src/components/portfolio/PublicationRequestForm.tsx`

**Changes:**
- Add explicit disclaimer: "This is a request for admin review. You will not have control over pricing, naming, or marketplace listing."
- Remove any fields that suggest designer control (pricing suggestions, publish dates)
- Add design intent fields (inspiration, target aesthetic, material preferences)

#### 2.3 Designer Dashboard Metrics Cleanup
**File:** `src/pages/Dashboard.tsx`

**Remove:**
- Pending approval counts (creates employment-style pressure)
- Production stage visibility (operational detail, not strategic)

**Keep:**
- Partner Performance Summary (revenue share, published projects count)
- Creative Insights (most popular design themes, customer feedback trends)

#### 2.4 Profile Editing Restrictions
**Files:**
- `src/pages/Settings.tsx`: Add read-only mode for public profile fields
- `src/pages/Profile.tsx`: Display admin-curated content with "Request Profile Update" button

**Implementation:**
```tsx
// Settings.tsx
const { user } = useAuth();
const { data: profile } = useProfile();

// Make public-facing fields read-only
const isAdminCurated = profile?.admin_curated;

return (
  <FormField name="brand_name">
    <FormControl>
      <Input 
        {...field} 
        disabled={isAdminCurated}  // Admin-curated fields locked
      />
    </FormControl>
    {isAdminCurated && (
      <FormDescription>
        This field is curated by Adorzia. Contact support to request changes.
      </FormDescription>
    )}
  </FormField>
);
```

---

### Phase 3: Admin Control Panel Enhancements (Medium Priority)

#### 3.1 Designer Profile Curation Interface
**New File:** `src/pages/admin/AdminDesignerProfiles.tsx`

**Features:**
- View all designer profiles
- Edit public-facing fields (brand_name, bio, artist_statement, banner_image)
- Mark profiles as "admin_curated" (locks designer editing)
- Audit log of profile changes

#### 3.2 Production Pipeline Dashboard Refinement
**File:** `src/pages/admin/AdminProductionQueues.tsx`

**Enhancements:**
- Add "Create Marketplace Listing" button on approved publications
- Pre-fill product form with designer's creative input metadata
- Link marketplace product back to source portfolio_publication (already exists via `portfolio_publication_id`)

#### 3.3 Designer Communication Interface
**New File:** `src/pages/admin/AdminDesignerMessages.tsx`

**Purpose:** Replace raw operational data exposure with strategic summaries
- Send "Partner Updates" with contextualized performance insights
- Notify designers of publication decisions (approved/revision/rejection)
- Share customer feedback trends (not raw sales data)

---

### Phase 4: Data Isolation & Security (High Priority)

#### 4.1 Edge Function Hardening
**Review all edge functions for designer access:**
- `marketplace-products`: Ensure only admin roles can invoke
- `marketplace-checkout`: Verify no designer_id in request body can manipulate pricing
- `upload-portfolio-project`: Confirm assets go to portfolio bucket, not marketplace bucket

#### 4.2 Storage Bucket Segregation
**Supabase Storage Policies:**
```sql
-- Portfolio bucket: Designer read/write
-- Marketplace bucket: Admin-only write, public read

-- Portfolio assets (creative layer)
CREATE POLICY "Designers manage own portfolio assets"
  ON storage.objects FOR ALL
  USING (bucket_id = 'portfolio-assets' AND auth.uid() = (storage.foldername(name))[1]::uuid);

-- Marketplace assets (commercial layer)
CREATE POLICY "Only admins upload to marketplace"
  ON storage.objects FOR INSERT
  USING (
    bucket_id = 'marketplace-products' AND 
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE POLICY "Public read marketplace assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'marketplace-products');
```

#### 4.3 API Route Guards
**Middleware:** `src/middleware/roleGuard.ts`

**Enforce:**
- `/api/marketplace/*`: Admin-only
- `/api/portfolio/*`: Designer (own data) + Admin (all data)
- `/api/designer-profiles/*`: Public read, Admin write

---

### Phase 5: UI/UX Clarity (Low Priority)

#### 5.1 Designer Studio Messaging
**Files:** 
- `src/pages/Portfolio.tsx`
- `src/pages/Dashboard.tsx`

**Add:**
- Tooltips explaining the partnership model
- "Request for Commercialization" terminology instead of "Publish"
- Onboarding modal explaining creative vs. commercial separation

#### 5.2 Marketplace Attribution
**File:** `src/pages/shop/ShopProductDetail.tsx`

**Feature:**
```tsx
<Card className="border-t-4 border-accent">
  <CardContent className="p-4">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">Designed By</p>
    <Link to={`/shop/designers/${product.designer_id}`}>
      <h3 className="font-display text-lg hover:text-accent transition">
        {product.designer_name}
      </h3>
    </Link>
    <p className="text-sm text-muted-foreground mt-1">
      Independent Creative Partner
    </p>
  </CardContent>
</Card>
```

---

## Migration Strategy

### Rollout Sequence
1. **Week 1**: Phase 1 (Database Schema) - Deploy during low-traffic window
2. **Week 2**: Phase 4 (Security Hardening) - Audit all edge functions
3. **Week 3**: Phase 2 (Application Logic) - UI/UX updates
4. **Week 4**: Phase 3 (Admin Tools) - Internal tools for admin team
5. **Week 5**: Phase 5 (Messaging) - Polish and documentation

### Risk Mitigation
- **Existing Designer Workflows**: Grandfather existing publications in "pending" status
- **Marketplace Products**: Backfill `created_by` to a superadmin account
- **Designer Communication**: Email campaign explaining the model before Phase 2 deployment

---

## Success Metrics

### Technical Compliance
- [ ] Zero designer-initiated marketplace_products rows (verified via audit log)
- [ ] 100% portfolio_publications require admin approval before marketplace listing
- [ ] No designer can modify admin-curated profile fields
- [ ] No direct database access to marketplace pricing data for designer role

### Operational KPIs
- [ ] Admin team can create marketplace product from portfolio_publication in <5 minutes
- [ ] Designers receive publication decision within 48 hours of submission
- [ ] Zero support tickets about "why can't I publish directly?"

---

## Appendix: Key Files to Modify

### Backend (Supabase)
- `supabase/migrations/20260130000000_enforce_admin_only_marketplace_creation.sql`
- `supabase/migrations/20260130010000_profile_curation_lockdown.sql`
- `supabase/migrations/20260130020000_storage_segregation.sql`

### Frontend (React)
- `src/pages/Portfolio.tsx` - Remove direct publish, add "Request Commercialization"
- `src/pages/Settings.tsx` - Lock admin-curated profile fields
- `src/pages/Dashboard.tsx` - Replace operational KPIs with strategic summaries
- `src/components/portfolio/PublicationRequestForm.tsx` - Add disclaimers
- `src/pages/admin/AdminProductionQueues.tsx` - Add "Create Marketplace Listing" workflow
- `src/pages/admin/AdminDesignerProfiles.tsx` - New profile curation interface
- `src/pages/shop/ShopProductDetail.tsx` - Designer attribution card

### Edge Functions
- `supabase/functions/marketplace-products/index.ts` - Admin-only guard
- `supabase/functions/upload-portfolio-project/index.ts` - Verify storage bucket isolation

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Designer cannot set pricing | Adorzia owns commercial risk, requires pricing control |
| Profiles are admin-curated | Ensures brand voice consistency across marketplace |
| Portfolio-Marketplace data separation | Creative inputs ≠ commercial outputs; prevents designer interference |
| No employment-style KPIs | Designers are partners, not employees; avoid toxic metrics |
| Attribution-only designer_id | Designer credit without operational authority |

---

**Status**: Plan Draft  
**Next Action**: Review with stakeholders, then begin Phase 1 migration script development
