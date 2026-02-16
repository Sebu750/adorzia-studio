# System Design

<cite>
**Referenced Files in This Document**
- [src/App.tsx](file://src/App.tsx)
- [src/main.tsx](file://src/main.tsx)
- [src/contexts/DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx)
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts)
- [src/lib/dual-layer-service.ts](file://src/lib/dual-layer-service.ts)
- [src/components/auth/ProtectedRoute.tsx](file://src/components/auth/ProtectedRoute.tsx)
- [src/components/auth/AdminProtectedRoute.tsx](file://src/components/auth/AdminProtectedRoute.tsx)
- [src/pages/Dashboard.tsx](file://src/pages/Dashboard.tsx)
- [src/pages/admin/AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx)
- [package.json](file://package.json)
- [vercel.json](file://vercel.json)
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts)
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
10. [Appendices](#appendices)

## Introduction
This document describes the system design of the Adorzia platform, a React-based frontend integrated with a Supabase backend. The platform implements a dual-layer operating model separating the designer workspace (Studio) and the admin panel, with distinct authentication providers and session management. It leverages Supabase for identity, real-time, and database needs, integrates Stripe for payments, and uses Vercel for hosting and routing. The document explains the provider pattern, routing architecture, authentication system, and backend integration points.

## Project Structure
The frontend is organized around:
- Pages: route-specific page components for website, studio, and admin
- Components: reusable UI and layout components
- Hooks: custom React hooks for authentication, subscriptions, and UI state
- Integrations: Supabase clients and typed database access
- Lib: shared business logic and services (e.g., dual-layer operations)
- Contexts: global state providers (e.g., dual-layer)

```mermaid
graph TB
subgraph "Frontend"
A["React App<br/>Providers & Routing"]
B["Pages<br/>Website / Studio / Admin"]
C["Components<br/>UI & Layout"]
D["Hooks<br/>Auth & State"]
E["Lib<br/>Services & Utilities"]
F["Integrations<br/>Supabase Clients"]
end
subgraph "Backend"
G["Supabase Auth & DB"]
H["Supabase Functions<br/>Stripe Integration"]
I["Stripe"]
end
A --> B
A --> C
A --> D
A --> E
A --> F
D --> F
E --> F
F --> G
H --> I
H --> G
```

**Diagram sources**
- [src/App.tsx](file://src/App.tsx#L155-L420)
- [src/main.tsx](file://src/main.tsx#L1-L46)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L1-L17)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts#L1-L28)
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts#L77-L204)

**Section sources**
- [src/App.tsx](file://src/App.tsx#L155-L420)
- [src/main.tsx](file://src/main.tsx#L1-L46)

## Core Components
- Provider Pattern
  - QueryClientProvider: centralized caching and invalidation
  - TooltipProvider: global tooltip behavior
  - ThemeProvider: theme persistence and switching
  - Custom Providers: AuthProvider, AdminAuthProvider, SubscriptionProvider, Studio/Admin Theme Providers, DualLayerProvider
- Routing Architecture
  - WebsiteWrapper: public site theme wrapper
  - AuthWrapper: authentication-aware theme wrapper
  - StudioProviders: nested providers for studio routes
  - AdminProviders: nested providers for admin routes
  - ProtectedRoute and AdminProtectedRoute: route guards
- Authentication System
  - AuthProvider: studio user session, role detection, sign-up/sign-in/sign-out
  - AdminAuthProvider: admin-only session, role detection, isolated storage
- Dual-Layer Operating Model
  - DualLayerProvider: state for projects, assets, and publication requests
  - DualLayerService: CRUD operations and conversions between studio and admin workflows

**Section sources**
- [src/App.tsx](file://src/App.tsx#L106-L132)
- [src/App.tsx](file://src/App.tsx#L134-L152)
- [src/App.tsx](file://src/App.tsx#L173-L414)
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx#L34-L314)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L21-L240)
- [src/contexts/DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L135-L295)
- [src/lib/dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L4-L340)

## Architecture Overview
The system follows a layered architecture:
- Presentation Layer: React components and pages
- Routing and Guards: React Router with protected wrappers
- State Management: React Contexts and React Query
- Authentication: Supabase Auth with dual providers and isolated sessions
- Backend Services: Supabase Auth/DB plus Supabase Edge Functions for Stripe integration
- External Integrations: Stripe for payments, Vercel for hosting and security headers

```mermaid
graph TB
subgraph "Browser"
R["React Router"]
P1["QueryClientProvider"]
P2["TooltipProvider"]
P3["ThemeProvider"]
P4["AuthProvider / AdminAuthProvider"]
P5["DualLayerProvider"]
end
subgraph "Supabase"
SA["Auth (Studio)"]
AA["Auth (Admin)"]
DB["PostgreSQL"]
RF["Realtime"]
end
subgraph "External"
ST["Stripe"]
end
R --> P1 --> P2 --> P3 --> P4 --> P5
P4 --> SA
P4 --> AA
P5 --> DB
P5 --> RF
DB --> ST
```

**Diagram sources**
- [src/App.tsx](file://src/App.tsx#L167-L418)
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx#L34-L314)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L21-L240)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L11-L17)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts#L16-L27)
- [src/lib/dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L1-L340)

## Detailed Component Analysis

### Routing Architecture
The router defines three primary zones:
- Website routes: public pages without authentication
- Auth routes: authentication pages under a themed wrapper
- Studio routes: designer workspace with studio providers and route protection
- Admin routes: admin panel with admin providers and admin route protection

```mermaid
sequenceDiagram
participant U as "User"
participant BR as "BrowserRouter"
participant WR as "WebsiteWrapper"
participant AR as "AuthWrapper"
participant SR as "StudioProviders"
participant AD as "AdminProviders"
U->>BR : Navigate to "/"
BR->>WR : Render public website
U->>BR : Navigate to "/auth"
BR->>AR : Render auth pages
U->>BR : Navigate to "/dashboard"
BR->>SR : Render studio with providers
U->>BR : Navigate to "/admin"
BR->>AD : Render admin with providers
```

**Diagram sources**
- [src/App.tsx](file://src/App.tsx#L173-L414)

**Section sources**
- [src/App.tsx](file://src/App.tsx#L173-L414)

### Authentication System
Dual authentication providers ensure separation of concerns:
- Studio AuthProvider
  - Manages studio user session and roles
  - Logs sign-ups, logins, and logout actions
  - Supports sign-up with profile attributes and sign-in/sign-out
- AdminAuthProvider
  - Isolated admin session using custom storage keys
  - Role checks against user_roles table
  - Prevents unauthorized access to admin routes

```mermaid
sequenceDiagram
participant U as "User"
participant RP as "ProtectedRoute"
participant AP as "AuthProvider"
participant AC as "useAuth"
participant SA as "Supabase Studio Auth"
U->>RP : Access protected route
RP->>AC : Check user and role
AC->>SA : onAuthStateChange
SA-->>AC : Session and user
AC-->>RP : isAdmin/isDesigner flags
RP-->>U : Allow or redirect
```

**Diagram sources**
- [src/components/auth/ProtectedRoute.tsx](file://src/components/auth/ProtectedRoute.tsx#L11-L41)
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx#L34-L314)

```mermaid
sequenceDiagram
participant A as "Admin User"
participant ARP as "AdminProtectedRoute"
participant AAP as "AdminAuthProvider"
participant AAC as "useAdminAuth"
participant AA as "Supabase Admin Auth"
A->>ARP : Access admin route
ARP->>AAC : Check admin role
AAC->>AA : onAuthStateChange
AA-->>AAC : Session and user
AAC-->>ARP : isAdmin/isSuperadmin flags
ARP-->>A : Allow or redirect
```

**Diagram sources**
- [src/components/auth/AdminProtectedRoute.tsx](file://src/components/auth/AdminProtectedRoute.tsx#L11-L51)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L21-L240)

**Section sources**
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx#L34-L314)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L21-L240)
- [src/components/auth/ProtectedRoute.tsx](file://src/components/auth/ProtectedRoute.tsx#L11-L41)
- [src/components/auth/AdminProtectedRoute.tsx](file://src/components/auth/AdminProtectedRoute.tsx#L11-L51)

### Provider Pattern Implementation
The App composes providers to deliver cross-cutting capabilities:
- Global providers: QueryClientProvider, TooltipProvider, Toaster, Sonner, ThemeProvider
- WebsiteWrapper: light theme for public pages
- AuthWrapper: studio theme for auth pages
- StudioProviders: AuthProvider, SubscriptionProvider, StudioThemeProvider, DualLayerProvider
- AdminProviders: AdminAuthProvider, AdminThemeProvider

```mermaid
graph TB
QC["QueryClientProvider"]
TP["TooltipProvider"]
TH["ThemeProvider"]
AU["AuthProvider"]
SU["SubscriptionProvider"]
ST["StudioThemeProvider"]
DL["DualLayerProvider"]
AAU["AdminAuthProvider"]
AT["AdminThemeProvider"]
QC --> TP --> TH
TH --> AU --> SU --> ST --> DL
TH --> AAU --> AT
```

**Diagram sources**
- [src/App.tsx](file://src/App.tsx#L167-L169)
- [src/App.tsx](file://src/App.tsx#L108-L132)

**Section sources**
- [src/App.tsx](file://src/App.tsx#L106-L132)
- [src/App.tsx](file://src/App.tsx#L134-L152)

### Dual-Layer Operating Model
The dual-layer model coordinates designer workspace and admin operations:
- DualLayerProvider maintains state for projects, assets, and publication requests
- DualLayerService encapsulates CRUD and conversion logic between studio and admin domains

```mermaid
flowchart TD
Start(["Studio Action"]) --> Create["Create Project"]
Create --> Upload["Upload Assets"]
Upload --> Submit["Submit Publication Request"]
Submit --> AdminReview["Admin Review"]
AdminReview --> Approved{"Approved?"}
Approved --> |Yes| Convert["Convert to Marketplace Product"]
Approved --> |No| Feedback["Admin Notes"]
Convert --> Live["Admin Publishes Product"]
Feedback --> End(["Done"])
Live --> End
```

**Diagram sources**
- [src/contexts/DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L135-L295)
- [src/lib/dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L4-L340)

**Section sources**
- [src/contexts/DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L135-L295)
- [src/lib/dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L4-L340)

### Supabase Integration Details
- Studio client uses localStorage for auth persistence and auto token refresh
- Admin client uses a prefixed storage key to isolate admin sessions
- Real-time channels are used in admin dashboards for live notifications
- Edge functions integrate with Stripe for checkout sessions and order verification

```mermaid
sequenceDiagram
participant C as "Client"
participant SC as "Supabase Studio Client"
participant AC as "Supabase Admin Client"
participant SF as "Supabase Function"
participant ST as "Stripe"
C->>SC : Auth operations (studio)
C->>AC : Auth operations (admin)
C->>SF : Call function (checkout)
SF->>ST : Create Stripe checkout session
ST-->>SF : Session URL
SF-->>C : Return session data
```

**Diagram sources**
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L11-L17)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts#L16-L27)
- [src/pages/admin/AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L308-L353)
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts#L77-L204)

**Section sources**
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L1-L17)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts#L1-L28)
- [src/pages/admin/AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L308-L353)
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts#L77-L204)

## Dependency Analysis
The frontend depends on:
- React ecosystem: React, React Router, React Hook Form, Radix UI, shadcn/ui
- State and UX: React Query, next-themes, Framer Motion, Sonner
- Supabase: @supabase/supabase-js for auth and DB
- Tooling: Vite, TailwindCSS, TypeScript

```mermaid
graph LR
R["React"] --> RR["React Router"]
R --> RH["React Hook Form"]
R --> TM["TanStack React Query"]
R --> TT["next-themes"]
R --> FM["Framer Motion"]
R --> UI["shadcn/ui + Radix UI"]
R --> SB["@supabase/supabase-js"]
R --> CL["TailwindCSS"]
R --> TS["TypeScript"]
```

**Diagram sources**
- [package.json](file://package.json#L15-L69)

**Section sources**
- [package.json](file://package.json#L15-L69)

## Performance Considerations
- React Query caching: leverage QueryClientProvider for efficient caching and background refetching
- Minimal re-renders: use Contexts and memoized callbacks in auth providers
- Lazy loading: defer heavy computations until after initial session resolution
- Real-time updates: use Supabase Realtime selectively to avoid unnecessary updates
- Bundle size: keep UI libraries tree-shaken and avoid importing unused components

## Troubleshooting Guide
- Authentication issues
  - Studio vs Admin confusion: ensure correct provider is active for the route
  - Session conflicts: verify isolated storage keys for admin sessions
- Route protection failures
  - ProtectedRoute/AdminProtectedRoute: confirm role flags and loading states
- Real-time notifications
  - Admin dashboard: ensure channel subscriptions are established and cleaned up
- Build and deployment
  - Vercel headers: confirm security headers are applied globally
  - SPA fallback: verify rewrites for client-side routing

**Section sources**
- [src/components/auth/ProtectedRoute.tsx](file://src/components/auth/ProtectedRoute.tsx#L11-L41)
- [src/components/auth/AdminProtectedRoute.tsx](file://src/components/auth/AdminProtectedRoute.tsx#L11-L51)
- [src/pages/admin/AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L308-L353)
- [vercel.json](file://vercel.json#L1-L24)

## Conclusion
Adorzia’s architecture cleanly separates studio and admin experiences through dual providers and dual authentication providers, ensuring secure and independent sessions. Supabase provides robust identity, real-time, and database capabilities, while Stripe integration is handled via Supabase Edge Functions. The routing and guard system enforces access control, and the dual-layer model streamlines the designer-to-marketplace workflow.

## Appendices

### Infrastructure and Deployment Topology
- Hosting: Vercel with global security headers and SPA rewrite
- Frontend: React SPA built with Vite
- Backend: Supabase (Auth, Database, Realtime, Edge Functions)
- Payments: Stripe via Supabase Functions

```mermaid
graph TB
U["User Browser"] --> V["Vercel CDN"]
V --> FE["React SPA"]
FE --> SB["Supabase Auth/DB"]
FE --> SF["Supabase Functions"]
SF --> ST["Stripe"]
```

**Diagram sources**
- [vercel.json](file://vercel.json#L1-L24)
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts#L77-L204)

**Section sources**
- [vercel.json](file://vercel.json#L1-L24)
- [supabase/functions/marketplace-checkout/index.ts](file://supabase/functions/marketplace-checkout/index.ts#L77-L204)