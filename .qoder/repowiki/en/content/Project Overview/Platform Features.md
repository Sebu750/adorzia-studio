# Platform Features

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [App.tsx](file://src/App.tsx)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts)
- [dual-layer-types.ts](file://src/lib/dual-layer-types.ts)
- [AdminMarketplace.tsx](file://src/pages/admin/AdminMarketplace.tsx)
- [AdminStyleboxes.tsx](file://src/pages/admin/AdminStyleboxes.tsx)
- [StyleboxWizard.tsx](file://src/components/admin/stylebox-wizard/StyleboxWizard.tsx)
- [BasicSetupTab.tsx](file://src/components/admin/stylebox-wizard/tabs/BasicSetupTab.tsx)
- [ArchetypeTab.tsx](file://src/components/admin/stylebox-wizard/tabs/ArchetypeTab.tsx)
- [DeliverablesConfigTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesConfigTab.tsx)
- [Styleboxes.tsx](file://src/pages/Styleboxes.tsx)
- [Portfolio.tsx](file://src/pages/Portfolio.tsx)
- [Teams.tsx](file://src/pages/Teams.tsx)
- [Subscription.tsx](file://src/pages/Subscription.tsx)
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document describes the platform features of Adorzia, focusing on the dual-layer operating model that separates a designer studio workspace from an admin panel. It outlines the core capabilities and value propositions, including the Stylebox creation system, marketplace platform, portfolio management, team collaboration, subscription management, and administrative controls. The target audiences include designers, customers, and administrators. The document also compares features, illustrates usage scenarios, and highlights integration patterns and workflows unique to the fashion design ecosystem.

## Project Structure
Adorzia is a React application structured around a dual-layer routing and provider model:
- Public website routes (no authentication) for marketing, discovery, and shopping.
- Studio routes (designer workspace) protected by a designer authentication provider.
- Admin routes (administrative controls) protected by a separate admin authentication provider.
- A shared Dual Layer Context orchestrates cross-cutting designer project and publication workflows.

```mermaid
graph TB
subgraph "Routing and Providers"
A["App.tsx<br/>Routing + Providers"]
B["StudioProviders<br/>(Auth + Subscription + Theme + DualLayer)"]
C["AdminProviders<br/>(Admin Auth + Theme)"]
D["WebsiteWrapper<br/>(Public Site Theme)"]
end
subgraph "Public Website"
W1["Home / About / Pricing / Blogs"]
W2["Shop: Products, Collections, Cart, Checkout"]
end
subgraph "Studio Workspace"
S1["Dashboard"]
S2["Styleboxes Library"]
S3["Stylebox Workspace"]
S4["Portfolio Management"]
S5["Teams Collaboration"]
S6["Subscription / Founders"]
S7["Profile / Settings / Analytics"]
end
subgraph "Admin Panel"
AD1["Admin Dashboard"]
AD2["Stylebox Management"]
AD3["Marketplace Admin"]
AD4["Designers / Rankings / Payouts"]
AD5["Teams / Jobs / Articles / Settings"]
end
A --> D --> W1
A --> D --> W2
A --> B --> S1
A --> B --> S2
A --> B --> S3
A --> B --> S4
A --> B --> S5
A --> B --> S6
A --> B --> S7
A --> C --> AD1
A --> C --> AD2
A --> C --> AD3
A --> C --> AD4
A --> C --> AD5
```

**Diagram sources**
- [App.tsx](file://src/App.tsx#L157-L431)

**Section sources**
- [App.tsx](file://src/App.tsx#L157-L431)

## Core Components
- Dual Layer Operating Model: A shared context and service layer enabling designers to create projects, upload assets, and submit publication requests, while admins review and convert eligible requests into marketplace products.
- Stylebox Creation System: A guided, multi-tab wizard for curators to define Stylebox archetypes, mutations, restrictions, manifestations, deliverables, and publishing timeline.
- Marketplace Platform: Admin-managed storefront with product catalog, orders, categories, and collections, integrated with designer publication approvals.
- Portfolio Management: Designer-centric portfolio creation, editing, publishing requests, and collections.
- Team Collaboration: Team discovery, invitations, join requests, and specialized team challenges.
- Subscription Management: Designer subscription and founder tier purchasing flows.
- Administrative Controls: Real-time dashboards, queues, designer rankings, payouts, and operational insights.

**Section sources**
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L1-L303)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L1-L340)
- [dual-layer-types.ts](file://src/lib/dual-layer-types.ts#L1-L44)
- [StyleboxWizard.tsx](file://src/components/admin/stylebox-wizard/StyleboxWizard.tsx#L1-L392)
- [AdminMarketplace.tsx](file://src/pages/admin/AdminMarketplace.tsx#L1-L217)
- [Portfolio.tsx](file://src/pages/Portfolio.tsx#L1-L322)
- [Teams.tsx](file://src/pages/Teams.tsx#L1-L633)
- [Subscription.tsx](file://src/pages/Subscription.tsx#L1-L195)
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L1-L608)

## Architecture Overview
The platform enforces separation of concerns:
- Routing and providers isolate studio and admin contexts.
- Studio context integrates authentication, subscription gating, theme, and the Dual Layer context.
- Admin context isolates admin authentication and theming.
- Dual Layer service mediates designer project lifecycle and admin publication review.

```mermaid
graph TB
subgraph "Client"
UI["React UI"]
end
subgraph "Studio Context"
UAC["useAuth"]
SUB["useSubscription"]
THEME["useStudioTheme"]
DLL["DualLayerContext"]
end
subgraph "Admin Context"
AUA["useAdminAuth"]
ATHEM["useAdminTheme"]
end
subgraph "Services"
SVC["DualLayerService"]
SUP["Supabase Client"]
end
UI --> UAC --> SUB --> THEME --> DLL
UI --> AUA --> ATHEM
DLL --> SVC --> SUP
```

**Diagram sources**
- [App.tsx](file://src/App.tsx#L110-L134)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L135-L295)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L1-L340)

**Section sources**
- [App.tsx](file://src/App.tsx#L110-L134)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L135-L295)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L1-L340)

## Detailed Component Analysis

### Dual Layer Operating Model
The Dual Layer enables a seamless designer-to-marketplace pipeline:
- Designers create projects and assets, submit publication requests.
- Admins review, approve, and convert eligible requests into marketplace products.
- Shared state and actions are centralized in the Dual Layer context and service.

```mermaid
sequenceDiagram
participant D as "Designer"
participant Ctx as "DualLayerContext"
participant Svc as "DualLayerService"
participant DB as "Supabase"
D->>Ctx : createProject()
Ctx->>Svc : createProject(...)
Svc->>DB : insert projects
DB-->>Svc : project
Svc-->>Ctx : project
Ctx-->>D : success
D->>Ctx : uploadProjectAsset()
Ctx->>Svc : uploadProjectAsset(...)
Svc->>DB : insert project_assets
DB-->>Svc : asset
Svc-->>Ctx : asset
Ctx-->>D : success
D->>Ctx : submitPublicationRequest()
Ctx->>Svc : submitPublicationRequest(...)
Svc->>DB : insert publication_requests
DB-->>Svc : request
Svc-->>Ctx : request
Ctx-->>D : success
Admin->>Svc : reviewPublicationRequest(id, decision)
Svc->>DB : update publication_requests
alt approved
Svc->>DB : insert marketplace_products
DB-->>Svc : product
end
Svc-->>Ctx : updated request
Ctx-->>Admin : success
```

**Diagram sources**
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L151-L274)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L6-L340)
- [dual-layer-types.ts](file://src/lib/dual-layer-types.ts#L3-L43)

**Section sources**
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L1-L303)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L1-L340)
- [dual-layer-types.ts](file://src/lib/dual-layer-types.ts#L1-L44)

### Stylebox Creation System
The Stylebox wizard is a guided, multi-tab editor for curation:
- Basic Setup: Title, taxonomy, category, difficulty, XP reward, status, visibility tags, walkthrough/featured toggles.
- Quadrant Builder: Archetype (silhouette, rationale, anchor image), Mutation, Restrictions, Manifestation.
- Deliverables: Configure required deliverables, file types, grading rubrics, and visibility.
- Timeline: Publishing decisions and deadlines.

```mermaid
flowchart TD
Start(["Open Stylebox Wizard"]) --> Basic["Basic Setup Tab"]
Basic --> Arch["Archetype Tab"]
Arch --> Mut["Mutation Tab"]
Mut --> Res["Restrictions Tab"]
Res --> Man["Manifestation Tab"]
Man --> Del["Deliverables Config Tab"]
Del --> Pub["Timeline Tab"]
Pub --> Save{"Save & Publish?"}
Save --> |Publish Now| Create["Create/Update Stylebox"]
Save --> |Draft Later| Draft["Auto-Save Draft"]
Create --> End(["Done"])
Draft --> End
```

**Diagram sources**
- [StyleboxWizard.tsx](file://src/components/admin/stylebox-wizard/StyleboxWizard.tsx#L51-L104)
- [BasicSetupTab.tsx](file://src/components/admin/stylebox-wizard/tabs/BasicSetupTab.tsx#L27-L268)
- [ArchetypeTab.tsx](file://src/components/admin/stylebox-wizard/tabs/ArchetypeTab.tsx#L32-L217)
- [DeliverablesConfigTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesConfigTab.tsx#L25-L186)

**Section sources**
- [StyleboxWizard.tsx](file://src/components/admin/stylebox-wizard/StyleboxWizard.tsx#L1-L392)
- [AdminStyleboxes.tsx](file://src/pages/admin/AdminStyleboxes.tsx#L1-L529)
- [BasicSetupTab.tsx](file://src/components/admin/stylebox-wizard/tabs/BasicSetupTab.tsx#L1-L269)
- [ArchetypeTab.tsx](file://src/components/admin/stylebox-wizard/tabs/ArchetypeTab.tsx#L1-L218)
- [DeliverablesConfigTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesConfigTab.tsx#L1-L187)

### Marketplace Platform
Admin-managed marketplace with:
- Dashboard overview, product management, orders, categories, collections, and designers.
- Product creation/editing with forms and tables.
- Orders and fulfillment workflows.

```mermaid
sequenceDiagram
participant Admin as "Admin"
participant MP as "AdminMarketplace"
participant Prod as "Products Table"
participant Form as "Product Form"
participant DB as "Supabase"
Admin->>MP : Open Marketplace
MP->>Prod : Load products
Prod->>DB : select marketplace_products
DB-->>Prod : products
Admin->>Form : Add/Edit Product
Form->>DB : insert/update marketplace_products
DB-->>Form : success
Form-->>Admin : close dialog
```

**Diagram sources**
- [AdminMarketplace.tsx](file://src/pages/admin/AdminMarketplace.tsx#L40-L216)

**Section sources**
- [AdminMarketplace.tsx](file://src/pages/admin/AdminMarketplace.tsx#L1-L217)

### Portfolio Management
Designer portfolio features:
- Project grid/list views, filtering, bulk actions, reordering.
- Publication request flow to convert projects into marketplace-ready entries.
- Collections and categorization.

```mermaid
flowchart TD
PStart(["Designer Portfolio"]) --> View["View Projects"]
View --> Filter["Filter & Search"]
Filter --> Actions["Bulk Actions / Reorder"]
Actions --> Publish["Request Publish"]
Publish --> PRForm["Publication Request Form"]
PRForm --> Submit["Submit Request"]
Submit --> Pending["Pending Review"]
Pending --> Approve{"Approved?"}
Approve --> |Yes| Market["Converted to Product"]
Approve --> |No| Feedback["Feedback / Resubmit"]
Market --> End(["Done"])
Feedback --> End
```

**Diagram sources**
- [Portfolio.tsx](file://src/pages/Portfolio.tsx#L36-L321)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L146-L206)

**Section sources**
- [Portfolio.tsx](file://src/pages/Portfolio.tsx#L1-L322)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L146-L206)

### Team Collaboration
Team features:
- Discover teams, create teams, join requests, invitations.
- Team challenges with specialized roles and eligibility.
- Team cards and management UI.

```mermaid
sequenceDiagram
participant D as "Designer"
participant Teams as "Teams Page"
participant API as "Teams Hook"
participant DB as "Supabase"
D->>Teams : Open Teams
Teams->>API : load myTeam / availableTeams / invitations
API->>DB : queries
DB-->>API : data
API-->>Teams : state
D->>Teams : Create Team / Request to Join
Teams->>API : createTeam / requestToJoin
API->>DB : mutate
DB-->>API : ok
API-->>Teams : refresh state
```

**Diagram sources**
- [Teams.tsx](file://src/pages/Teams.tsx#L41-L632)

**Section sources**
- [Teams.tsx](file://src/pages/Teams.tsx#L1-L633)

### Subscription Management
Designer subscription and founder tiers:
- Subscription page with success/cancellation feedback.
- Founder tier purchasing flow with Stripe integration hooks.

```mermaid
sequenceDiagram
participant D as "Designer"
participant Sub as "Subscription Page"
participant Hook as "useSubscription"
participant Stripe as "Stripe Checkout"
D->>Sub : Open Subscription
D->>Hook : startCheckout()
Hook->>Stripe : redirect to checkout
Stripe-->>Hook : success/cancel
Hook-->>Sub : refreshSubscription()
Sub-->>D : toast success/cancel
```

**Diagram sources**
- [Subscription.tsx](file://src/pages/Subscription.tsx#L14-L194)

**Section sources**
- [Subscription.tsx](file://src/pages/Subscription.tsx#L1-L195)

### Administrative Controls
Admin dashboard and queues:
- Real-time metrics, pending queues, top designers, recent activity.
- Stylebox analytics and submission trends.
- Quick actions for common admin tasks.

```mermaid
sequenceDiagram
participant Admin as "Admin"
participant Dash as "AdminDashboard"
participant DB as "Supabase"
participant Toast as "Toast"
Admin->>Dash : Open Dashboard
Dash->>DB : fetch stats, queues, trends
DB-->>Dash : data
Dash-->>Admin : render cards
DB-->>Dash : realtime events
Dash->>Toast : notify new registration/submission
```

**Diagram sources**
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L33-L607)

**Section sources**
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L1-L608)

## Dependency Analysis
- Routing and providers are layered to ensure proper isolation between studio and admin contexts.
- Dual Layer context depends on Dual Layer service, which encapsulates Supabase interactions for projects, assets, and publication requests.
- Admin pages depend on admin-specific providers and clients.
- Studio pages depend on designer auth, subscription gating, and studio theme.

```mermaid
graph LR
App["App.tsx"] --> SP["StudioProviders"]
App --> AP["AdminProviders"]
SP --> DL["DualLayerContext"]
DL --> DS["DualLayerService"]
DS --> SUP["Supabase Client"]
AP --> ADM["Admin Pages"]
SP --> STU["Studio Pages"]
```

**Diagram sources**
- [App.tsx](file://src/App.tsx#L110-L134)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L135-L295)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L1-L340)

**Section sources**
- [App.tsx](file://src/App.tsx#L110-L134)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L135-L295)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L1-L340)

## Performance Considerations
- Use TanStack Query for efficient caching and background refetching in studio and admin pages.
- Debounce filters and search inputs in portfolio and marketplace listings.
- Lazy-load heavy components (e.g., modals, wizards) to reduce initial bundle size.
- Optimize image uploads with watermarking and CDN delivery.
- Batch admin operations (e.g., CSV exports) and paginate large datasets.

## Troubleshooting Guide
- API request monitoring is initialized at startup to detect infinite loops and excessive re-renders.
- Admin dashboard listens to real-time events to keep metrics fresh; confirm Supabase channels are connected.
- Dual Layer actions dispatch loading/error states; inspect context state for failures.
- If marketplace conversions fail, verify publication request ownership and admin permissions.

**Section sources**
- [App.tsx](file://src/App.tsx#L157-L166)
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L304-L353)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L138-L149)

## Conclusion
Adorzia’s dual-layer architecture cleanly separates designer creativity from administrative oversight, enabling a robust Stylebox curation pipeline, a curated marketplace, and powerful collaboration tools. The platform’s modular components, guided workflows, and admin controls position it as a comprehensive solution for fashion design communities, supporting designers, customers, and administrators with tailored experiences and scalable operations.