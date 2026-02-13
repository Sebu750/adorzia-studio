# State Management

<cite>
**Referenced Files in This Document**
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx)
- [src/hooks/useProfile.tsx](file://src/hooks/useProfile.tsx)
- [src/hooks/useTeamData.tsx](file://src/hooks/useTeamData.tsx)
- [src/hooks/useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx)
- [src/hooks/useMarketplaceProducts.tsx](file://src/hooks/useMarketplaceProducts.tsx)
- [src/hooks/useArticles.tsx](file://src/hooks/useArticles.tsx)
- [src/hooks/useNotifications.tsx](file://src/hooks/useNotifications.tsx)
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx)
- [src/hooks/usePortfolioData.tsx](file://src/hooks/usePortfolioData.tsx)
- [src/hooks/useActiveStyleboxes.tsx](file://src/hooks/useActiveStyleboxes.tsx)
- [src/hooks/useAdminProducts.tsx](file://src/hooks/useAdminProducts.tsx)
- [src/hooks/useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx)
- [src/hooks/useAnalyticsData.tsx](file://src/hooks/useAnalyticsData.tsx)
- [src/hooks/useGlobalSearch.tsx](file://src/hooks/useGlobalSearch.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts)
- [src/App.tsx](file://src/App.tsx)
- [src/main.tsx](file://src/main.tsx)
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
This document explains the state management architecture of the Adorzia platform. It covers custom React hooks, TanStack Query usage, context providers, Supabase-based server state, real-time synchronization, optimistic updates, caching, error handling, loading states, and performance optimization strategies. The goal is to help developers understand how data flows across components, how server state is synchronized, and how to debug and optimize state-related behavior.

## Project Structure
The state management spans several areas:
- Authentication contexts for studio and admin portals
- Local state hooks for user profiles, teams, dashboards, and analytics
- TanStack Query queries and mutations for marketplace, articles, admin products, and global search
- A cart context provider for marketplace shopping
- Real-time subscriptions via Supabase for notifications and admin dashboards

```mermaid
graph TB
subgraph "App Shell"
MAIN["main.tsx"]
APP["App.tsx"]
end
subgraph "Auth Providers"
AUTHCTX["useAuth.tsx<br/>AuthProvider"]
ADMINCTX["useAdminAuth.tsx<br/>AdminAuthProvider"]
end
subgraph "Local State Hooks"
PROFILE["useProfile.tsx"]
TEAM["useTeamData.tsx"]
DASH["useDashboardStats.tsx"]
PORTFOLIO["usePortfolioData.tsx"]
ACTIVE["useActiveStyleboxes.tsx"]
ANALYTICS["useAnalyticsData.tsx"]
end
subgraph "TanStack Query"
MARKET["useMarketplaceProducts.tsx"]
ARTICLES["useArticles.tsx"]
ADMINPRODS["useAdminProducts.tsx"]
SEARCH["useGlobalSearch.tsx"]
end
subgraph "Context Providers"
CART["useCart.tsx<br/>CartProvider"]
end
subgraph "Real-time"
NOTIFS["useNotifications.tsx"]
ADMINREALTIME["useAdminRealtimeStats.tsx"]
end
subgraph "Supabase Clients"
CLIENT["client.ts"]
ADMIN["admin-client.ts"]
end
MAIN --> APP
APP --> AUTHCTX
APP --> ADMINCTX
APP --> CART
AUTHCTX --> PROFILE
AUTHCTX --> TEAM
AUTHCTX --> DASH
AUTHCTX --> PORTFOLIO
AUTHCTX --> ACTIVE
AUTHCTX --> ANALYTICS
PROFILE --> CLIENT
TEAM --> CLIENT
DASH --> CLIENT
PORTFOLIO --> CLIENT
ACTIVE --> CLIENT
ANALYTICS --> CLIENT
MARKET --> CLIENT
ARTICLES --> ADMIN
ADMINPRODS --> ADMIN
SEARCH --> CLIENT
CART --> CLIENT
NOTIFS --> CLIENT
ADMINREALTIME --> ADMIN
CLIENT --> |"queries/mutations"| SUPA["Supabase Functions/PostgreSQL"]
ADMIN --> |"admin ops"| SUPA
```

**Diagram sources**
- [src/main.tsx](file://src/main.tsx)
- [src/App.tsx](file://src/App.tsx)
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx)
- [src/hooks/useProfile.tsx](file://src/hooks/useProfile.tsx)
- [src/hooks/useTeamData.tsx](file://src/hooks/useTeamData.tsx)
- [src/hooks/useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx)
- [src/hooks/usePortfolioData.tsx](file://src/hooks/usePortfolioData.tsx)
- [src/hooks/useActiveStyleboxes.tsx](file://src/hooks/useActiveStyleboxes.tsx)
- [src/hooks/useAnalyticsData.tsx](file://src/hooks/useAnalyticsData.tsx)
- [src/hooks/useMarketplaceProducts.tsx](file://src/hooks/useMarketplaceProducts.tsx)
- [src/hooks/useArticles.tsx](file://src/hooks/useArticles.tsx)
- [src/hooks/useAdminProducts.tsx](file://src/hooks/useAdminProducts.tsx)
- [src/hooks/useGlobalSearch.tsx](file://src/hooks/useGlobalSearch.tsx)
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx)
- [src/hooks/useNotifications.tsx](file://src/hooks/useNotifications.tsx)
- [src/hooks/useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts)

**Section sources**
- [src/main.tsx](file://src/main.tsx)
- [src/App.tsx](file://src/App.tsx)

## Core Components
- Authentication contexts: Provide user/session state, role checks, and sign-in/sign-out actions for studio and admin portals.
- Local state hooks: Encapsulate server reads/writes for profiles, teams, dashboards, portfolio, active styleboxes, and analytics.
- TanStack Query: Centralized caching, background refetching, and optimistic updates for marketplace listings, article CRUD, admin product management, and global search.
- Cart context: Manages marketplace cart state with server-backed persistence and toast feedback.
- Real-time subscriptions: Notifications and admin dashboard activity streams powered by Supabase Postgres changes.

**Section sources**
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx)
- [src/hooks/useProfile.tsx](file://src/hooks/useProfile.tsx)
- [src/hooks/useTeamData.tsx](file://src/hooks/useTeamData.tsx)
- [src/hooks/useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx)
- [src/hooks/usePortfolioData.tsx](file://src/hooks/usePortfolioData.tsx)
- [src/hooks/useActiveStyleboxes.tsx](file://src/hooks/useActiveStyleboxes.tsx)
- [src/hooks/useAnalyticsData.tsx](file://src/hooks/useAnalyticsData.tsx)
- [src/hooks/useMarketplaceProducts.tsx](file://src/hooks/useMarketplaceProducts.tsx)
- [src/hooks/useArticles.tsx](file://src/hooks/useArticles.tsx)
- [src/hooks/useAdminProducts.tsx](file://src/hooks/useAdminProducts.tsx)
- [src/hooks/useGlobalSearch.tsx](file://src/hooks/useGlobalSearch.tsx)
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx)
- [src/hooks/useNotifications.tsx](file://src/hooks/useNotifications.tsx)
- [src/hooks/useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx)

## Architecture Overview
The platform uses a hybrid state model:
- Server-first state via Supabase (auth, tables, RPCs, functions)
- Client-side caching and invalidation via TanStack Query
- Local state for UI concerns and ephemeral data
- Context providers for cross-cutting concerns (cart)
- Real-time updates via Supabase Postgres changes

```mermaid
sequenceDiagram
participant C as "Component"
participant Q as "TanStack Query<br/>useQuery/useMutation"
participant S as "Supabase Client"
participant F as "Supabase Function/RPC"
participant DB as "PostgreSQL"
C->>Q : "Trigger queryKey"
Q->>S : "Execute queryFn"
S->>F : "Invoke function or RPC"
F->>DB : "Run SQL"
DB-->>F : "Rows"
F-->>S : "JSON payload"
S-->>Q : "Resolved data"
Q-->>C : "Render with cache"
Note over C,Q : "Mutations invalidate queries and re-fetch"
```

**Diagram sources**
- [src/hooks/useMarketplaceProducts.tsx](file://src/hooks/useMarketplaceProducts.tsx)
- [src/hooks/useArticles.tsx](file://src/hooks/useArticles.tsx)
- [src/hooks/useAdminProducts.tsx](file://src/hooks/useAdminProducts.tsx)
- [src/hooks/useGlobalSearch.tsx](file://src/hooks/useGlobalSearch.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts)

## Detailed Component Analysis

### Authentication Contexts
Studio and admin portals each maintain separate contexts with:
- Auth state listeners and session synchronization across tabs
- Role resolution against user roles
- Sign-in/sign-out with logging and scoped sessions
- Loading and signing-out flags

```mermaid
classDiagram
class AuthProvider {
+user
+session
+loading
+isAdmin
+isDesigner
+userRole
+isSigningOut
+signUp()
+signIn()
+signOut()
}
class AdminAuthProvider {
+user
+session
+loading
+isAdmin
+isSuperadmin
+adminRole
+isSigningOut
+signIn()
+signOut()
}
AuthProvider --> "uses" supabase_client : "auth.onAuthStateChange"
AdminAuthProvider --> "uses" supabase_admin_client : "auth.onAuthStateChange"
```

**Diagram sources**
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts)

**Section sources**
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx)

### Profile Hook
- Reads/writes profile data with automatic creation if missing
- Loads associated rank data
- Provides updateProfile with safe field filtering and optimistic UI updates

```mermaid
flowchart TD
Start(["useProfile mount"]) --> CheckUser{"Has user?"}
CheckUser --> |No| SetNull["Set profile=null<br/>Set loading=false"]
CheckUser --> |Yes| Fetch["Fetch profiles by user_id"]
Fetch --> Found{"Profile exists?"}
Found --> |Yes| LoadRank["Optionally load rank"]
LoadRank --> Merge["Merge profile + rank"]
Found --> |No| Upsert["Insert default profile"]
Upsert --> Merge
Merge --> Done(["Ready"])
SetNull --> End(["Exit"])
Done --> End
```

**Diagram sources**
- [src/hooks/useProfile.tsx](file://src/hooks/useProfile.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)

**Section sources**
- [src/hooks/useProfile.tsx](file://src/hooks/useProfile.tsx)

### Team Data Hook
- Resolves current user’s team membership
- Loads team members’ profiles
- Computes active project from team stylebox submissions

```mermaid
sequenceDiagram
participant H as "useTeamData"
participant S as "Supabase Client"
H->>S : "Select team_members by user_id"
S-->>H : "Membership row"
H->>S : "Select team_members by team_id"
S-->>H : "Member rows"
H->>S : "Select profiles by user_ids"
S-->>H : "Profile rows"
H->>S : "Select active team stylebox submission"
S-->>H : "Submission row"
H-->>H : "Build TeamData"
```

**Diagram sources**
- [src/hooks/useTeamData.tsx](file://src/hooks/useTeamData.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)

**Section sources**
- [src/hooks/useTeamData.tsx](file://src/hooks/useTeamData.tsx)

### Dashboard Stats Hook
- Aggregates stylebox submissions, portfolio items, earnings, payouts, and products sold
- Uses server-side counts and filters

```mermaid
flowchart TD
A["Fetch stylebox_submissions by designer_id"] --> B["Compute active/completed"]
A --> C["Count portfolios"]
A --> D["Sum earnings"]
D --> E["Filter monthly earnings"]
A --> F["Fetch payouts by status=pending"]
A --> G["Find designer products by status=live"]
G --> H["Sum product_sales quantities"]
B --> R["Set stats"]
C --> R
E --> R
F --> R
H --> R
```

**Diagram sources**
- [src/hooks/useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)

**Section sources**
- [src/hooks/useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx)

### Analytics Data Hook
- Uses RPC to compute consolidated stats
- Builds revenue charts, top products, and recent transactions
- Aggregates from earnings, product_sales, and marketplace_products

```mermaid
sequenceDiagram
participant H as "useAnalyticsData"
participant S as "Supabase Client"
H->>S : "rpc get_designer_stats(designer_uuid)"
S-->>H : "JSONB stats"
H->>S : "Select earnings by designer_id"
S-->>H : "Earnings rows"
H->>S : "Select marketplace_products by designer_id"
S-->>H : "Products rows"
H->>S : "Select product_sales by product_ids"
S-->>H : "Sales rows"
H-->>H : "Aggregate revenue, top products, transactions"
```

**Diagram sources**
- [src/hooks/useAnalyticsData.tsx](file://src/hooks/useAnalyticsData.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)

**Section sources**
- [src/hooks/useAnalyticsData.tsx](file://src/hooks/useAnalyticsData.tsx)

### Marketplace Products (TanStack Query)
- Queries marketplace products, categories, collections via Supabase Functions
- Supports filters, sorting, pagination
- Uses enabled flags and staleTime for performance

```mermaid
sequenceDiagram
participant C as "Component"
participant Q as "useMarketplaceProducts"
participant S as "Supabase Client"
participant F as "Functions : marketplace-products"
C->>Q : "useQuery({ queryKey, queryFn })"
Q->>S : "functions.invoke(...)"
S->>F : "HTTP GET /functions/v1/marketplace-products"
F-->>S : "{ products, pagination }"
S-->>Q : "Resolve data"
Q-->>C : "Render with loading/error/cache"
```

**Diagram sources**
- [src/hooks/useMarketplaceProducts.tsx](file://src/hooks/useMarketplaceProducts.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)

**Section sources**
- [src/hooks/useMarketplaceProducts.tsx](file://src/hooks/useMarketplaceProducts.tsx)

### Articles (Admin CRUD with TanStack Query)
- Lists, filters, and paginates articles using admin client
- Mutations create/update/delete with toast feedback and query invalidation

```mermaid
sequenceDiagram
participant C as "Admin Component"
participant M as "useCreateArticle/useUpdateArticle/useDeleteArticle"
participant S as "Supabase Admin Client"
C->>M : "mutation.mutate(payload)"
M->>S : "insert/update/delete"
S-->>M : "Result"
M->>M : "invalidateQueries(['articles'])"
M-->>C : "toast + refetch"
```

**Diagram sources**
- [src/hooks/useArticles.tsx](file://src/hooks/useArticles.tsx)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts)

**Section sources**
- [src/hooks/useArticles.tsx](file://src/hooks/useArticles.tsx)

### Admin Products (TanStack Query + Optimistic Updates)
- Admin CRUD for marketplace products with mutations
- Optimistic updates: UI reflects changes immediately; server errors revert silently

```mermaid
flowchart TD
Click["User clicks Approve/Reject/Delete"] --> Call["Call useApprove/useReject/useDelete"]
Call --> Opt["Optimistically update cache"]
Opt --> Server["Send mutation to Supabase"]
Server --> Ok{"Success?"}
Ok --> |Yes| Done["Keep optimistic update"]
Ok --> |No| Revert["Invalidate and refetch"]
```

**Diagram sources**
- [src/hooks/useAdminProducts.tsx](file://src/hooks/useAdminProducts.tsx)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts)

**Section sources**
- [src/hooks/useAdminProducts.tsx](file://src/hooks/useAdminProducts.tsx)

### Global Search (TanStack Query)
- RPC-based search with result limiting
- Follow/unfollow helpers and follower counts

```mermaid
sequenceDiagram
participant C as "Search Component"
participant Q as "useGlobalSearch"
participant S as "Supabase Client"
C->>Q : "useQuery({ queryKey, queryFn })"
Q->>S : "rpc global_search(search_query, result_limit)"
S-->>Q : "Results"
Q-->>C : "Render suggestions"
```

**Diagram sources**
- [src/hooks/useGlobalSearch.tsx](file://src/hooks/useGlobalSearch.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)

**Section sources**
- [src/hooks/useGlobalSearch.tsx](file://src/hooks/useGlobalSearch.tsx)

### Cart Context Provider
- Centralized cart state with server-backed persistence
- Actions: add, update quantity, remove, clear
- Toast feedback and loading states

```mermaid
sequenceDiagram
participant C as "Cart-aware Component"
participant P as "CartProvider"
participant S as "Supabase Client"
participant F as "Functions : marketplace-cart"
C->>P : "addItem(productId, quantity)"
P->>S : "functions.invoke('marketplace-cart', { action : 'add', ... })"
S->>F : "Invoke add"
F-->>S : "{ cart, message }"
S-->>P : "Data"
P-->>C : "setCart + toast"
```

**Diagram sources**
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)

**Section sources**
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx)

### Notifications (Real-time)
- Fetches recent notifications
- Subscribes to real-time INSERT/UPDATE events per user
- Supports mark-as-read, mark-all-as-read, and delete

```mermaid
sequenceDiagram
participant H as "useNotifications"
participant S as "Supabase Client"
H->>S : "select notifications by user_id"
S-->>H : "Initial list"
H->>S : "channel.on('postgres_changes', INSERT/UPDATE)"
S-->>H : "payload.new"
H-->>H : "Prepend/update list"
H->>S : "update({ status : 'read' })"
S-->>H : "OK"
H-->>H : "Optimistically update list"
```

**Diagram sources**
- [src/hooks/useNotifications.tsx](file://src/hooks/useNotifications.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)

**Section sources**
- [src/hooks/useNotifications.tsx](file://src/hooks/useNotifications.tsx)

### Admin Real-time Stats
- Periodic refetch of RPC stats
- Real-time subscriptions to profiles, stylebox_submissions, portfolio_publications, and earnings
- Builds combined activity feed

```mermaid
sequenceDiagram
participant H as "useAdminRealtimeStats"
participant S as "Supabase Admin Client"
H->>S : "rpc get_admin_dashboard_stats"
S-->>H : "Stats"
H->>S : "subscribe postgres_changes"
S-->>H : "INSERT/UPDATE events"
H-->>H : "Append to activity + refetch stats"
```

**Diagram sources**
- [src/hooks/useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts)

**Section sources**
- [src/hooks/useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx)

## Dependency Analysis
- Hooks depend on Supabase clients for auth, queries, RPCs, and functions
- TanStack Query orchestrates caching, invalidation, and refetching
- Context providers encapsulate cross-cutting state (cart)
- Real-time subscriptions rely on Supabase Postgres changes

```mermaid
graph LR
H1["useProfile.tsx"] --> C1["client.ts"]
H2["useTeamData.tsx"] --> C1
H3["useDashboardStats.tsx"] --> C1
H4["useAnalyticsData.tsx"] --> C1
H5["useMarketplaceProducts.tsx"] --> C1
H6["useArticles.tsx"] --> A1["admin-client.ts"]
H7["useAdminProducts.tsx"] --> A1
H8["useNotifications.tsx"] --> C1
H9["useAdminRealtimeStats.tsx"] --> A1
H10["useCart.tsx"] --> C1
H11["useGlobalSearch.tsx"] --> C1
```

**Diagram sources**
- [src/hooks/useProfile.tsx](file://src/hooks/useProfile.tsx)
- [src/hooks/useTeamData.tsx](file://src/hooks/useTeamData.tsx)
- [src/hooks/useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx)
- [src/hooks/useAnalyticsData.tsx](file://src/hooks/useAnalyticsData.tsx)
- [src/hooks/useMarketplaceProducts.tsx](file://src/hooks/useMarketplaceProducts.tsx)
- [src/hooks/useArticles.tsx](file://src/hooks/useArticles.tsx)
- [src/hooks/useAdminProducts.tsx](file://src/hooks/useAdminProducts.tsx)
- [src/hooks/useNotifications.tsx](file://src/hooks/useNotifications.tsx)
- [src/hooks/useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx)
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx)
- [src/hooks/useGlobalSearch.tsx](file://src/hooks/useGlobalSearch.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts)

**Section sources**
- [src/hooks/useProfile.tsx](file://src/hooks/useProfile.tsx)
- [src/hooks/useTeamData.tsx](file://src/hooks/useTeamData.tsx)
- [src/hooks/useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx)
- [src/hooks/useAnalyticsData.tsx](file://src/hooks/useAnalyticsData.tsx)
- [src/hooks/useMarketplaceProducts.tsx](file://src/hooks/useMarketplaceProducts.tsx)
- [src/hooks/useArticles.tsx](file://src/hooks/useArticles.tsx)
- [src/hooks/useAdminProducts.tsx](file://src/hooks/useAdminProducts.tsx)
- [src/hooks/useNotifications.tsx](file://src/hooks/useNotifications.tsx)
- [src/hooks/useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx)
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx)
- [src/hooks/useGlobalSearch.tsx](file://src/hooks/useGlobalSearch.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [src/integrations/supabase/admin-client.ts](file://src/integrations/supabase/admin-client.ts)

## Performance Considerations
- Caching and staleness
  - TanStack Query keys are granular (e.g., ["articles", filters], ["marketplace-products", filters]) enabling precise cache targeting.
  - StaleTime configured for global search to reduce network calls.
- Background refetching
  - Admin realtime stats refetch periodically to keep numbers fresh.
- Minimal re-renders
  - Prefer returning memoized callbacks from providers (e.g., CartProvider) to avoid unnecessary prop updates.
- Network efficiency
  - Use enabled flags to defer queries until inputs are ready (e.g., article detail by slug).
- Real-time efficiency
  - Subscribe only to necessary channels and tables; unsubscribe on unmount.
- Optimistic updates
  - Apply immediate UI changes for mutations; rely on server responses to confirm or roll back.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Auth state not syncing across tabs
  - Verify storage event handling and token key prefixes for both studio and admin contexts.
- Role checks failing
  - Confirm user roles exist in the user_roles table and that role resolution logic runs after session initialization.
- TanStack Query not updating
  - Ensure mutation onSuccess invalidates the correct query keys and that query keys match between reads and invalidations.
- Real-time not firing
  - Check channel names and filters; confirm table permissions and presence of postgres_changes triggers.
- Cart operations failing
  - Inspect function invocation headers and session ID generation; verify toast feedback for user-visible errors.
- RPC errors
  - Validate RPC names and parameters; wrap in try/catch and surface user-friendly messages.

**Section sources**
- [src/hooks/useAuth.tsx](file://src/hooks/useAuth.tsx)
- [src/hooks/useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx)
- [src/hooks/useArticles.tsx](file://src/hooks/useArticles.tsx)
- [src/hooks/useAdminProducts.tsx](file://src/hooks/useAdminProducts.tsx)
- [src/hooks/useNotifications.tsx](file://src/hooks/useNotifications.tsx)
- [src/hooks/useCart.tsx](file://src/hooks/useCart.tsx)
- [src/hooks/useGlobalSearch.tsx](file://src/hooks/useGlobalSearch.tsx)

## Conclusion
Adorzia’s state management blends Supabase server state with TanStack Query for robust caching and real-time updates, while custom hooks and context providers encapsulate domain-specific logic. The architecture supports optimistic updates, precise cache invalidation, and scalable real-time features. Following the patterns documented here ensures predictable state flow, efficient performance, and maintainable debugging practices.