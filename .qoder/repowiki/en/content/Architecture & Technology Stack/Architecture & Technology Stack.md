# Architecture & Technology Stack

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [src/main.tsx](file://src/main.tsx)
- [src/App.tsx](file://src/App.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts)
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx)
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx)
- [src/hooks/useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx)
- [src/hooks/useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx)
- [src/pages/Dashboard.tsx](file://src/pages/Dashboard.tsx)
- [src/pages/admin/AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx)
- [src/types/database.ts](file://src/types/database.ts)
- [supabase/config.toml](file://supabase/config.toml)
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
This document describes the full-stack architecture of the Adorzia platform, focusing on the React frontend and Supabase backend services. It explains the component hierarchy, state management strategy using custom hooks and React Context, data flow patterns, authentication architecture with dual providers for designers and administrators, and Supabase integration including database schema, real-time subscriptions, storage, and serverless functions. It also covers system boundaries, external dependencies, scalability, security, and deployment topology.

## Project Structure
The application is a Vite + React + TypeScript single-page application with a clear separation of concerns:
- Frontend: React components organized by feature (studio, admin, marketplace, public), shared UI primitives, and hooks for state and data.
- Supabase integration: Two clients (studio and admin) with isolated storage to maintain separate sessions.
- Supabase backend: Functions (invoked via Supabase Functions API), migrations (schema), and configuration.

```mermaid
graph TB
subgraph "Browser"
FE["React SPA<br/>Vite + TypeScript"]
end
subgraph "Supabase Backend"
SB["Auth + Postgres"]
FN["Edge Functions"]
RT["Realtime Subscriptions"]
ST["Storage"]
end
FE --> |"HTTP + JWT"| SB
FE --> |"Functions Invoke"| FN
FE --> |"Realtime"| RT
FE --> |"Storage Upload/Download"| ST
```

**Diagram sources**
- [src/App.tsx](file://src/App.tsx#L112-L347)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L11-L17)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts#L16-L27)
- [supabase/config.toml](file://supabase/config.toml#L1-L71)

**Section sources**
- [README.md](file://README.md#L53-L62)
- [package.json](file://package.json#L13-L66)
- [src/App.tsx](file://src/App.tsx#L112-L347)

## Core Components
- Dual authentication providers:
  - Designer/Admin provider: centralized auth state, role resolution, and session persistence.
  - Admin-only provider: isolated session and role checks for administrative functions.
- Data providers:
  - Cart provider: manages marketplace cart via Supabase Edge Functions.
  - Dashboard stats: aggregates metrics for studio dashboards.
  - Admin realtime stats: live dashboard metrics with Supabase Realtime.
- Routing and layout:
  - Nested routing with protected routes for studio and admin.
  - Providers wrapped around route groups to scope auth and subscriptions.

Key implementation references:
- App shell and routing: [src/App.tsx](file://src/App.tsx#L112-L347)
- Studio auth provider: [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx#L22-L243)
- Admin auth provider: [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L21-L207)
- Cart provider: [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx#L57-L205)
- Dashboard stats: [src/hooks/useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx#L15-L122)
- Admin realtime stats: [src/hooks/useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx#L24-L208)

**Section sources**
- [src/App.tsx](file://src/App.tsx#L112-L347)
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx#L22-L243)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L21-L207)
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx#L57-L205)
- [src/hooks/useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx#L15-L122)
- [src/hooks/useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx#L24-L208)

## Architecture Overview
The system follows a client-driven architecture:
- React SPA handles routing, UI rendering, and user interactions.
- Supabase provides identity, relational data, real-time, storage, and serverless functions.
- Studio and Admin apps share the same backend but use separate clients and isolated sessions.

```mermaid
graph TB
subgraph "Client App"
R["React Router"]
P1["Studio Providers<br/>AuthProvider + SubscriptionProvider"]
P2["Admin Providers<br/>AdminAuthProvider + AdminThemeProvider"]
C1["Studio Pages"]
C2["Admin Pages"]
end
subgraph "Supabase"
A["Auth"]
D["PostgreSQL"]
F["Edge Functions"]
T["Realtime"]
S["Storage"]
end
R --> P1 --> C1
R --> P2 --> C2
C1 --> |"Hooks + Supabase JS"| A
C1 --> |"Hooks + Supabase JS"| D
C1 --> |"Functions invoke"| F
C1 --> |"Realtime subscribe"| T
C1 --> |"Storage ops"| S
C2 --> |"Admin client"| A
C2 --> |"Admin client"| D
C2 --> |"Admin client"| F
C2 --> |"Admin client"| T
C2 --> |"Admin client"| S
```

**Diagram sources**
- [src/App.tsx](file://src/App.tsx#L90-L110)
- [src/App.tsx](file://src/App.tsx#L241-L338)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L11-L17)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts#L16-L27)

## Detailed Component Analysis

### Authentication Architecture
Dual providers ensure secure, isolated sessions:
- Studio provider:
  - Listens to auth state changes and resolves user roles from a dedicated roles table.
  - Logs auth actions for auditability.
  - Supports multi-tab synchronization and scoped sign-out.
- Admin provider:
  - Uses an isolated storage adapter to keep admin sessions separate.
  - Enforces admin-only access and logs admin actions.
  - Forces sign-out on invalid access attempts to prevent hijacking.

```mermaid
sequenceDiagram
participant U as "User"
participant RP as "React Router"
participant AP as "AuthProvider"
participant SP as "Supabase Studio Client"
participant AR as "Role Resolver"
U->>RP : Navigate to protected route
RP->>AP : Enter Studio Providers
AP->>SP : onAuthStateChange()
SP-->>AP : Session event
AP->>AR : checkUserRole(userId)
AR-->>AP : Highest privilege role
AP-->>U : Render protected content
```

**Diagram sources**
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx#L54-L133)
- [src/App.tsx](file://src/App.tsx#L157-L236)

```mermaid
sequenceDiagram
participant U as "Admin User"
participant RP as "React Router"
participant AAP as "AdminAuthProvider"
participant AC as "Admin Supabase Client"
participant AR as "Admin Role Resolver"
U->>RP : Navigate to admin route
RP->>AAP : Enter Admin Providers
AAP->>AC : onAuthStateChange()
AC-->>AAP : Session event
AAP->>AR : checkAdminRole(userId)
alt Not admin
AAP->>AC : signOut({scope : 'local'})
AAP-->>U : Redirect unauthorized
else Is admin
AR-->>AAP : Role (admin/superadmin/lead_curator)
AAP-->>U : Render admin content
end
```

**Diagram sources**
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L53-L140)
- [src/App.tsx](file://src/App.tsx#L241-L338)

**Section sources**
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx#L22-L243)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L21-L207)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts#L8-L12)

### State Management Strategy
- Context providers encapsulate cross-cutting concerns:
  - Auth contexts for studio and admin.
  - Subscription context for studio features.
  - Cart context for marketplace operations.
  - UI theme context for admin.
- Hooks orchestrate Supabase interactions and expose typed data to components.

```mermaid
classDiagram
class AuthProvider {
+user
+session
+isAdmin
+isDesigner
+userRole
+signUp()
+signIn()
+signOut()
}
class AdminAuthProvider {
+user
+session
+isAdmin
+isSuperadmin
+adminRole
+signIn()
+signOut()
}
class CartProvider {
+cart
+itemCount
+addItem()
+updateQuantity()
+removeItem()
+clearCart()
+refreshCart()
}
class DashboardPage {
+useDashboardStats()
}
class AdminDashboardPage {
+useAdminRealtimeStats()
}
DashboardPage --> AuthProvider : "uses"
AdminDashboardPage --> AdminAuthProvider : "uses"
DashboardPage --> CartProvider : "uses indirectly"
AdminDashboardPage --> AdminAuthProvider : "uses"
```

**Diagram sources**
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx#L22-L243)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L21-L207)
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx#L57-L205)
- [src/pages/Dashboard.tsx](file://src/pages/Dashboard.tsx#L29-L93)
- [src/pages/admin/AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L29-L181)

**Section sources**
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx#L22-L243)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L21-L207)
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx#L57-L205)
- [src/pages/Dashboard.tsx](file://src/pages/Dashboard.tsx#L29-L93)
- [src/pages/admin/AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L29-L181)

### Data Flow Patterns
- Studio dashboard metrics:
  - Aggregates counts and sums from multiple tables using Supabase queries.
  - Uses a hook to compute derived metrics client-side.
- Admin realtime dashboard:
  - Uses RPC for initial stats and Supabase Realtime for live updates.
  - Subscribes to inserts/updates on profiles, stylebox_submissions, portfolio_publications, and earnings.

```mermaid
flowchart TD
Start(["Fetch Dashboard Stats"]) --> CheckUser["Has user?"]
CheckUser --> |No| Stop["Set loading=false"]
CheckUser --> |Yes| FetchSubmissions["Query stylebox_submissions"]
FetchSubmissions --> ComputeActive["Compute active submissions"]
ComputeActive --> FetchPortfolio["Query portfolios count"]
FetchPortfolio --> FetchEarnings["Query earnings"]
FetchEarnings --> SumEarnings["Sum totals and monthly"]
SumEarnings --> FetchPayouts["Query pending payouts"]
FetchPayouts --> FetchProducts["Query designer's live products"]
FetchProducts --> CountSales["Aggregate quantity_sold"]
CountSales --> BuildStats["Build stats object"]
BuildStats --> Done(["Return stats"])
Stop --> Done
```

**Diagram sources**
- [src/hooks/useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx#L34-L118)

**Section sources**
- [src/hooks/useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx#L15-L122)
- [src/pages/Dashboard.tsx](file://src/pages/Dashboard.tsx#L29-L93)

### Supabase Integration
- Clients:
  - Studio client with default storage and token refresh.
  - Admin client with isolated storage and admin-specific keys.
- Functions:
  - Invoked via Supabase JS Functions API from the cart provider.
  - Configured per-function JWT verification toggles.
- Realtime:
  - Admin dashboard subscribes to postgres_changes for live updates.
  - Studio dashboard uses React Query for polling and RPC for stats.

```mermaid
sequenceDiagram
participant C as "CartProvider"
participant S as "Supabase Client"
participant F as "Edge Function"
participant DB as "PostgreSQL"
C->>S : functions.invoke('marketplace-cart', {action, session_id})
S->>F : HTTP request (with Authorization if signed in)
F->>DB : R/W operations (cart, inventory)
DB-->>F : Results
F-->>S : Response data
S-->>C : Update cart state
```

**Diagram sources**
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx#L67-L85)
- [supabase/config.toml](file://supabase/config.toml#L3-L52)

**Section sources**
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L11-L17)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts#L16-L27)
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx#L57-L205)
- [supabase/config.toml](file://supabase/config.toml#L1-L71)

### Data Types and Relationships
The application defines typed relations for marketplace products and cart items, enriching rows with related data.

```mermaid
erDiagram
MARKETPLACE_PRODUCTS {
uuid id PK
uuid designer_id FK
string title
numeric price
jsonb images
int inventory_count
string status
}
CART_ITEMS {
uuid product_id FK
string title
numeric price
string image
int quantity
jsonb variant
}
PRODUCTS {
uuid id PK
uuid designer_id FK
string name
string slug
}
MARKETPLACE_PRODUCTS ||--o{ CART_ITEMS : "contains"
DESIGNERS ||--o{ MARKETPLACE_PRODUCTS : "creates"
```

**Diagram sources**
- [src/types/database.ts](file://src/types/database.ts#L3-L28)

**Section sources**
- [src/types/database.ts](file://src/types/database.ts#L1-L29)

## Dependency Analysis
External dependencies and their roles:
- Supabase JS: Auth, database, storage, and functions.
- TanStack React Query: Server state caching and refetching.
- React Router DOM: Navigation and protected routes.
- UI libraries: Radix UI primitives, shadcn/ui, Tailwind CSS.

```mermaid
graph LR
FE["Frontend App"] --> SR["React Router"]
FE --> RQ["React Query"]
FE --> UI["Radix/shadcn/Tailwind"]
FE --> SBJS["@supabase/supabase-js"]
SBJS --> AUTH["Supabase Auth"]
SBJS --> PG["PostgreSQL"]
SBJS --> FN["Edge Functions"]
SBJS --> RT["Realtime"]
SBJS --> ST["Storage"]
```

**Diagram sources**
- [package.json](file://package.json#L13-L66)
- [src/App.tsx](file://src/App.tsx#L112-L347)

**Section sources**
- [package.json](file://package.json#L13-L66)

## Performance Considerations
- Minimize redundant queries: use React Query’s caching and selective refetch intervals.
- Batch reads/writes: leverage Supabase RPCs and functions to reduce round-trips.
- Realtime efficiency: subscribe only to necessary channels and events; throttle UI updates.
- Client-side computation: derive metrics in hooks to avoid repeated server calls.
- Storage: compress images before upload and use CDN-backed URLs.

## Troubleshooting Guide
- Auth state inconsistencies:
  - Verify multi-tab sync logic and storage keys for both studio and admin clients.
  - Confirm auth state change listeners are properly unsubscribed.
- Admin access denied:
  - Ensure admin role resolution succeeds; invalid access triggers immediate sign-out from admin scope.
- Realtime not updating:
  - Check channel subscriptions and event filters; confirm table/column names match.
- Cart operations failing:
  - Inspect function invocation headers and session IDs; validate function permissions and JWT verification settings.

**Section sources**
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx#L36-L49)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L35-L48)
- [src/hooks/useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx#L114-L184)
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx#L67-L85)
- [supabase/config.toml](file://supabase/config.toml#L3-L71)

## Conclusion
Adorzia employs a clean separation between studio and admin experiences, powered by Supabase. The dual authentication providers enforce strict isolation, while custom hooks and React Context deliver predictable state management. Supabase Functions, Realtime, and Storage integrate seamlessly with the React SPA, enabling scalable, real-time features with minimal backend maintenance.

## Appendices

### Deployment Topology
- Frontend: Vite-built static assets served via a CDN or edge platform.
- Backend: Supabase-managed infrastructure (Auth, Postgres, Edge Functions, Storage, Realtime).
- Environment: Supabase project ID and function-level JWT verification configured centrally.

**Section sources**
- [README.md](file://README.md#L63-L73)
- [supabase/config.toml](file://supabase/config.toml#L1-L71)