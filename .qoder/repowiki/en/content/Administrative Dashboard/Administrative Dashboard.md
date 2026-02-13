# Administrative Dashboard

<cite>
**Referenced Files in This Document**
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx)
- [AdminLayout.tsx](file://src/components/admin/AdminLayout.tsx)
- [AdminSidebar.tsx](file://src/components/admin/AdminSidebar.tsx)
- [useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx)
- [useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx)
- [AdminAnalytics.tsx](file://src/pages/admin/AdminAnalytics.tsx)
- [AdminDesigners.tsx](file://src/pages/admin/AdminDesigners.tsx)
- [AdminSecurity.tsx](file://src/pages/admin/AdminSecurity.tsx)
- [AdminSettings.tsx](file://src/pages/admin/AdminSettings.tsx)
- [AdminPayouts.tsx](file://src/pages/admin/AdminPayouts.tsx)
- [AdminMarketplace.tsx](file://src/pages/admin/AdminMarketplace.tsx)
- [AdminPublications.tsx](file://src/pages/admin/AdminPublications.tsx)
- [AdminRankings.tsx](file://src/pages/admin/AdminRankings.tsx)
- [AdminProductionQueues.tsx](file://src/pages/admin/AdminProductionQueues.tsx)
- [AdminTeams.tsx](file://src/pages/admin/AdminTeams.tsx)
- [AdminJobs.tsx](file://src/pages/admin/AdminJobs.tsx)
- [AdminStyleboxes.tsx](file://src/pages/admin/AdminStyleboxes.tsx)
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
This document describes the administrative dashboard system used by platform operators to oversee and control Adorzia Studio. It covers the admin portal overview, user management, content moderation, analytics and reporting, and system configuration. It also explains administrative workflows, oversight mechanisms, and control systems, including analytics dashboards, user activity monitoring, content review processes, system health metrics, administrative security measures, audit trails, and governance features.

## Project Structure
The administrative dashboard is built as a React application with TypeScript, using Supabase for backend authentication and data access. The admin pages are organized under `/src/pages/admin`, while shared admin UI components live under `/src/components/admin`. Authentication and real-time capabilities are provided by dedicated hooks and Supabase clients.

```mermaid
graph TB
subgraph "Admin Pages"
AD["AdminDashboard.tsx"]
AA["AdminAnalytics.tsx"]
ADI["AdminDesigners.tsx"]
ASP["AdminSecurity.tsx"]
AST["AdminSettings.tsx"]
APO["AdminPayouts.tsx"]
AMK["AdminMarketplace.tsx"]
APUB["AdminPublications.tsx"]
AR["AdminRankings.tsx"]
AQ["AdminProductionQueues.tsx"]
AT["AdminTeams.tsx"]
AJ["AdminJobs.tsx"]
ASB["AdminStyleboxes.tsx"]
end
subgraph "Shared Admin Components"
AL["AdminLayout.tsx"]
ASBID["AdminSidebar.tsx"]
CARD["AdminStatCard.tsx"]
QUEUE["PendingQueueCard.tsx"]
TOP["TopDesignersCard.tsx"]
ACT["RecentActivityCard.tsx"]
end
subgraph "Hooks"
AUTH["useAdminAuth.tsx"]
REALTIME["useAdminRealtimeStats.tsx"]
end
AD --> AL
AA --> AL
ADI --> AL
ASP --> AL
AST --> AL
APO --> AL
AMK --> AL
APUB --> AL
AR --> AL
AQ --> AL
AT --> AL
AJ --> AL
ASB --> AL
AL --> ASBID
AD --> CARD
AD --> QUEUE
AD --> TOP
AD --> ACT
AD -.-> AUTH
AA -.-> REALTIME
ADI -.-> AUTH
APUB -.-> AUTH
AQ -.-> AUTH
AT -.-> AUTH
AJ -.-> AUTH
ASB -.-> AUTH
```

**Diagram sources**
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L1-L428)
- [AdminAnalytics.tsx](file://src/pages/admin/AdminAnalytics.tsx#L1-L313)
- [AdminDesigners.tsx](file://src/pages/admin/AdminDesigners.tsx#L1-L403)
- [AdminSecurity.tsx](file://src/pages/admin/AdminSecurity.tsx#L1-L353)
- [AdminSettings.tsx](file://src/pages/admin/AdminSettings.tsx#L1-L519)
- [AdminPayouts.tsx](file://src/pages/admin/AdminPayouts.tsx#L1-L296)
- [AdminMarketplace.tsx](file://src/pages/admin/AdminMarketplace.tsx#L1-L211)
- [AdminPublications.tsx](file://src/pages/admin/AdminPublications.tsx#L1-L990)
- [AdminRankings.tsx](file://src/pages/admin/AdminRankings.tsx#L1-L714)
- [AdminProductionQueues.tsx](file://src/pages/admin/AdminProductionQueues.tsx#L1-L510)
- [AdminTeams.tsx](file://src/pages/admin/AdminTeams.tsx#L1-L369)
- [AdminJobs.tsx](file://src/pages/admin/AdminJobs.tsx#L1-L199)
- [AdminStyleboxes.tsx](file://src/pages/admin/AdminStyleboxes.tsx#L1-L531)
- [AdminLayout.tsx](file://src/components/admin/AdminLayout.tsx#L1-L238)
- [AdminSidebar.tsx](file://src/components/admin/AdminSidebar.tsx#L1-L254)
- [useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L1-L216)
- [useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx#L1-L209)

**Section sources**
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L1-L428)
- [AdminLayout.tsx](file://src/components/admin/AdminLayout.tsx#L1-L238)
- [AdminSidebar.tsx](file://src/components/admin/AdminSidebar.tsx#L1-L254)
- [useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L1-L216)
- [useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx#L1-L209)

## Core Components
- AdminLayout: Provides the global admin header, sidebar navigation, theme toggle, notifications, and user menu. It also integrates a command palette for quick actions.
- AdminSidebar: Renders categorized navigation links (Dashboard, Designers, Collections, StyleBoxes, Submissions, Walkthroughs, Publications, Production Queues, Marketplace, Articles, Rankings & Revenue, Payouts, Teams, Job Portal, Notifications, Analytics, Security, Settings). Visibility of Security depends on role.
- useAdminAuth: Centralized admin authentication state, role detection, sign-in/sign-out, and cross-tab synchronization. It enforces role-based access and logs auth events.
- useAdminRealtimeStats: Fetches dashboard statistics and live activity feed via Supabase RPC and Postgres changes, with periodic refresh.
- Dashboard cards: AdminStatCard, PendingQueueCard, TopDesignersCard, RecentActivityCard provide overview widgets.

**Section sources**
- [AdminLayout.tsx](file://src/components/admin/AdminLayout.tsx#L1-L238)
- [AdminSidebar.tsx](file://src/components/admin/AdminSidebar.tsx#L1-L254)
- [useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L1-L216)
- [useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx#L1-L209)

## Architecture Overview
The admin portal follows a layered architecture:
- Presentation Layer: Pages under `/pages/admin` render views and orchestrate data fetching.
- Shared Components: `/components/admin` encapsulate reusable UI elements and layouts.
- Hooks: `/hooks` provide domain-specific state and data fetching (e.g., authentication, analytics).
- Backend Integration: Supabase client (`supabaseAdmin`) handles authentication, queries, and real-time subscriptions.

```mermaid
graph TB
subgraph "Presentation Layer"
PAGES["Admin Pages<br/>Dashboard, Analytics, Designers, Security, Settings,<br/>Payouts, Marketplace, Publications, Rankings,<br/>Production Queues, Teams, Jobs, Styleboxes"]
end
subgraph "Shared Components"
LAYOUT["AdminLayout, AdminSidebar"]
CARDS["AdminStatCard, PendingQueueCard,<br/>TopDesignersCard, RecentActivityCard"]
end
subgraph "Hooks"
AUTH["useAdminAuth"]
STATS["useAdminRealtimeStats"]
end
subgraph "Backend"
SUPA["Supabase Admin Client"]
RPC["RPC Functions"]
RT["Postgres Changes"]
end
PAGES --> LAYOUT
PAGES --> CARDS
PAGES --> AUTH
PAGES --> STATS
AUTH --> SUPA
STATS --> SUPA
STATS --> RPC
STATS --> RT
PAGES --> SUPA
```

**Diagram sources**
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L1-L428)
- [AdminLayout.tsx](file://src/components/admin/AdminLayout.tsx#L1-L238)
- [AdminSidebar.tsx](file://src/components/admin/AdminSidebar.tsx#L1-L254)
- [useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L1-L216)
- [useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx#L1-L209)

## Detailed Component Analysis

### Admin Portal Overview
The dashboard aggregates key metrics, recent activity, and quick actions. It uses Supabase to compute counts and revenue, and subscribes to real-time events for immediate feedback.

```mermaid
sequenceDiagram
participant U as "Admin User"
participant D as "AdminDashboard"
participant H as "useAdminAuth"
participant S as "Supabase Admin Client"
U->>D : Load dashboard
D->>H : Read auth state and role
D->>S : Query counts (designers, styleboxes, publications)
D->>S : Query earnings (monthly)
D->>S : Query live products, founders, submissions
D->>S : Subscribe to profiles insert (real-time)
S-->>D : Real-time toast + refresh
D-->>U : Render metrics, top designers, recent activity
```

**Diagram sources**
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L47-L272)
- [useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L1-L216)

**Section sources**
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L1-L428)

### User Management
The designer management page lists designers, filters by rank/status, and allows status updates. It fetches profiles, submission counts, earnings, and renders a paginated table with actions.

```mermaid
flowchart TD
Start(["Open Designer Management"]) --> Fetch["Fetch profiles with roles and ranks"]
Fetch --> Join["Join submissions and earnings per designer"]
Join --> Filter["Apply search and filters (rank, status)"]
Filter --> Paginate["Paginate results"]
Paginate --> Render["Render table with actions (activate/suspend)"]
Render --> Update["Mutate status on action"]
Update --> Invalidate["Invalidate cache and refetch"]
Invalidate --> End(["Done"])
```

**Diagram sources**
- [AdminDesigners.tsx](file://src/pages/admin/AdminDesigners.tsx#L74-L138)

**Section sources**
- [AdminDesigners.tsx](file://src/pages/admin/AdminDesigners.tsx#L1-L403)

### Content Moderation
The publication queue manages designer submissions through a multi-stage workflow. Admins can approve, request revisions, reject, or adjust revenue shares. The system tracks decisions, reviewer notes, and logs actions.

```mermaid
sequenceDiagram
participant A as "Admin"
participant P as "AdminPublications"
participant S as "Supabase Admin Client"
participant L as "Admin Logs"
A->>P : Select publication
A->>P : Choose action (approve/reject/revision)
A->>P : Add quality rating and notes
P->>S : Update portfolio_publications (decision, notes, reviewer)
P->>S : Insert publication_reviews record
P->>L : Insert admin_log entry
S-->>P : Success
P-->>A : Toast + refresh queue
```

**Diagram sources**
- [AdminPublications.tsx](file://src/pages/admin/AdminPublications.tsx#L206-L283)

**Section sources**
- [AdminPublications.tsx](file://src/pages/admin/AdminPublications.tsx#L1-L990)

### Analytics & Reporting
The analytics page displays real-time metrics, charts, and a live activity feed. It uses Supabase RPC for dashboard stats and Postgres changes for live updates.

```mermaid
sequenceDiagram
participant A as "Admin"
participant AN as "AdminAnalytics"
participant H as "useAdminRealtimeStats"
participant S as "Supabase Admin Client"
A->>AN : Open Analytics
AN->>H : Query dashboard stats (RPC)
H->>S : Call get_admin_dashboard_stats
S-->>H : Stats data
H->>S : Subscribe to profiles/stylebox_submissions/portfolio_publications/earnings
S-->>H : Real-time events
H-->>AN : Update activity feed and stats
AN-->>A : Render charts and live feed
```

**Diagram sources**
- [AdminAnalytics.tsx](file://src/pages/admin/AdminAnalytics.tsx#L1-L313)
- [useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx#L24-L184)

**Section sources**
- [AdminAnalytics.tsx](file://src/pages/admin/AdminAnalytics.tsx#L1-L313)
- [useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx#L1-L209)

### System Configuration
The settings page centralizes admin account management, including profile updates, password changes, 2FA toggling, and logout controls. Updates are logged for auditability.

```mermaid
flowchart TD
Start(["Open Settings"]) --> Load["Load profile and role"]
Load --> UpdateProfile["Update name/email via Edge Function"]
UpdateProfile --> LogProfile["Log profile_update"]
Load --> UpdatePassword["Update password via Edge Function"]
UpdatePassword --> LogPass["Log password_change"]
Load --> Toggle2FA["Toggle 2FA"]
Toggle2FA --> Log2FA["Log 2fa_toggle"]
Load --> Logout["Sign out or sign out everywhere"]
Logout --> LogOut["Log logout/logout_all_devices"]
LogProfile --> Done(["Saved"])
LogPass --> Done
Log2FA --> Done
LogOut --> Done
```

**Diagram sources**
- [AdminSettings.tsx](file://src/pages/admin/AdminSettings.tsx#L128-L246)

**Section sources**
- [AdminSettings.tsx](file://src/pages/admin/AdminSettings.tsx#L1-L519)

### Administrative Security & Governance
The security page manages administrative roles and audits access. It supports role promotion/demotion and displays auth logs.

```mermaid
sequenceDiagram
participant A as "Admin (Superadmin)"
participant SEC as "AdminSecurity"
participant S as "Supabase Admin Client"
participant L as "Admin Logs"
A->>SEC : Open Security
SEC->>S : Fetch admins and roles
SEC->>S : Update role in user_roles
S-->>SEC : Success
SEC->>L : Insert admin_log (update_role)
SEC-->>A : Toast + refresh list
```

**Diagram sources**
- [AdminSecurity.tsx](file://src/pages/admin/AdminSecurity.tsx#L129-L155)

**Section sources**
- [AdminSecurity.tsx](file://src/pages/admin/AdminSecurity.tsx#L1-L353)

### Financial Operations
The payouts page manages designer earnings and payout requests, with status transitions and audit logging.

```mermaid
flowchart TD
Start(["Open Payouts"]) --> Fetch["Fetch payouts and earnings"]
Fetch --> Stats["Compute totals and rates"]
Stats --> Filter["Filter/search payouts"]
Filter --> Action["Approve/Reject"]
Action --> Mutate["Update payout status"]
Mutate --> Log["Insert admin_log"]
Log --> Invalidate["Invalidate queries"]
Invalidate --> End(["Done"])
```

**Diagram sources**
- [AdminPayouts.tsx](file://src/pages/admin/AdminPayouts.tsx#L87-L103)

**Section sources**
- [AdminPayouts.tsx](file://src/pages/admin/AdminPayouts.tsx#L1-L296)

### Marketplace Management
The marketplace page provides product and order management, plus category administration.

```mermaid
sequenceDiagram
participant A as "Admin"
participant MK as "AdminMarketplace"
participant S as "Supabase Admin Client"
A->>MK : Open Marketplace
MK->>S : Fetch product stats
MK->>S : Fetch products/orders/categories (filtered)
A->>MK : Add/Edit product
MK->>S : Upsert product
MK-->>A : Toast + refresh
```

**Diagram sources**
- [AdminMarketplace.tsx](file://src/pages/admin/AdminMarketplace.tsx#L30-L204)

**Section sources**
- [AdminMarketplace.tsx](file://src/pages/admin/AdminMarketplace.tsx#L1-L211)

### Production Queues
The production queues page orchestrates the end-to-end production pipeline with status transitions and logging.

```mermaid
sequenceDiagram
participant A as "Admin"
participant Q as "AdminProductionQueues"
participant S as "Supabase Admin Client"
participant PL as "Production Logs"
A->>Q : Select queue tab
Q->>S : Fetch items by status_v2
A->>Q : Perform action (Review/Sample/Approve/etc.)
Q->>S : Update status_v2 and reviewer fields
Q->>PL : Insert production_log
Q->>S : Insert admin_log
S-->>Q : Success
Q-->>A : Toast + refresh
```

**Diagram sources**
- [AdminProductionQueues.tsx](file://src/pages/admin/AdminProductionQueues.tsx#L174-L271)

**Section sources**
- [AdminProductionQueues.tsx](file://src/pages/admin/AdminProductionQueues.tsx#L1-L510)

### Rankings & Revenue
The rankings page manages designer ranks, revenue shares, and payouts, with export capabilities and insights.

```mermaid
flowchart TD
Start(["Open Rankings"]) --> FetchRanks["Fetch ranks"]
FetchRanks --> FetchDesigners["Fetch designers with ranks"]
FetchDesigners --> FetchPayouts["Fetch payouts"]
FetchPayouts --> Stats["Compute totals and distributions"]
Stats --> Filter["Filter/search designers"]
Filter --> Export["Export CSV"]
Filter --> Edit["Edit rank/revenue/share"]
Edit --> Log["Insert admin_log"]
Export --> Done(["Done"])
Log --> Done
```

**Diagram sources**
- [AdminRankings.tsx](file://src/pages/admin/AdminRankings.tsx#L107-L188)

**Section sources**
- [AdminRankings.tsx](file://src/pages/admin/AdminRankings.tsx#L1-L714)

### Teams & Challenges
The teams page manages designer collectives and team-based submissions.

```mermaid
sequenceDiagram
participant A as "Admin"
participant T as "AdminTeams"
participant S as "Supabase Admin Client"
A->>T : Open Teams
T->>S : Fetch teams and members
A->>T : Search teams
T-->>A : Render team list
A->>T : Open Submissions
T->>S : Fetch team_stylebox_submissions
A->>T : Review submission (approve/reject)
T->>S : Update status and admin feedback
S-->>T : Success
T-->>A : Toast + refresh
```

**Diagram sources**
- [AdminTeams.tsx](file://src/pages/admin/AdminTeams.tsx#L63-L121)

**Section sources**
- [AdminTeams.tsx](file://src/pages/admin/AdminTeams.tsx#L1-L369)

### Job Portal Management
The jobs page manages job listings and application reviews.

```mermaid
sequenceDiagram
participant A as "Admin"
participant J as "AdminJobs"
participant S as "Supabase Admin Client"
A->>J : Open Jobs
J->>S : Fetch jobs and stats
A->>J : Create/Edit/Delete job
J->>S : Upsert/Delete job
S-->>J : Success
A->>J : Switch to Applications
J->>S : Fetch applications with profiles
A->>J : Update application status
J->>S : Update job_applications
S-->>J : Success
J-->>A : Toast + refresh
```

**Diagram sources**
- [AdminJobs.tsx](file://src/pages/admin/AdminJobs.tsx#L23-L120)

**Section sources**
- [AdminJobs.tsx](file://src/pages/admin/AdminJobs.tsx#L1-L199)

### StyleBox Management
The StyleBox management page creates, edits, duplicates, and archives creative challenges.

```mermaid
flowchart TD
Start(["Open StyleBoxes"]) --> Fetch["Fetch styleboxes with filters/sorting"]
Fetch --> Filter["Search/filter by category/difficulty/status"]
Filter --> Actions["Edit/Duplicate/Archive"]
Actions --> Duplicate["Duplicate as draft"]
Actions --> Archive["Archive (soft delete)"]
Duplicate --> Log["Insert admin_log"]
Archive --> Log
Log --> Invalidate["Invalidate cache"]
Invalidate --> End(["Done"])
```

**Diagram sources**
- [AdminStyleboxes.tsx](file://src/pages/admin/AdminStyleboxes.tsx#L97-L180)

**Section sources**
- [AdminStyleboxes.tsx](file://src/pages/admin/AdminStyleboxes.tsx#L1-L531)

## Dependency Analysis
The admin system exhibits clear separation of concerns:
- Pages depend on shared components and hooks.
- Hooks encapsulate Supabase interactions and caching.
- Real-time updates rely on Postgres changes and RPC functions.
- Role-based visibility ensures sensitive areas (Security) are restricted.

```mermaid
graph LR
P_Dashboard["AdminDashboard.tsx"] --> H_Auth["useAdminAuth.tsx"]
P_Dashboard --> H_Realtime["useAdminRealtimeStats.tsx"]
P_Analytics["AdminAnalytics.tsx"] --> H_Realtime
P_Designers["AdminDesigners.tsx"] --> H_Auth
P_Publications["AdminPublications.tsx"] --> H_Auth
P_Production["AdminProductionQueues.tsx"] --> H_Auth
P_Teams["AdminTeams.tsx"] --> H_Auth
P_Jobs["AdminJobs.tsx"] --> H_Auth
P_Styleboxes["AdminStyleboxes.tsx"] --> H_Auth
P_Security["AdminSecurity.tsx"] --> H_Auth
P_Settings["AdminSettings.tsx"] --> H_Auth
P_Dashboard --> C_Layout["AdminLayout.tsx"]
P_Analytics --> C_Layout
P_Designers --> C_Layout
P_Security --> C_Layout
P_Settings --> C_Layout
P_Payouts["AdminPayouts.tsx"] --> C_Layout
P_Marketplace["AdminMarketplace.tsx"] --> C_Layout
P_Publications --> C_Layout
P_Rankings["AdminRankings.tsx"] --> C_Layout
P_Production --> C_Layout
P_Teams --> C_Layout
P_Jobs --> C_Layout
P_Styleboxes --> C_Layout
C_Layout --> C_Sidebar["AdminSidebar.tsx"]
```

**Diagram sources**
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L1-L428)
- [AdminAnalytics.tsx](file://src/pages/admin/AdminAnalytics.tsx#L1-L313)
- [AdminDesigners.tsx](file://src/pages/admin/AdminDesigners.tsx#L1-L403)
- [AdminSecurity.tsx](file://src/pages/admin/AdminSecurity.tsx#L1-L353)
- [AdminSettings.tsx](file://src/pages/admin/AdminSettings.tsx#L1-L519)
- [AdminPayouts.tsx](file://src/pages/admin/AdminPayouts.tsx#L1-L296)
- [AdminMarketplace.tsx](file://src/pages/admin/AdminMarketplace.tsx#L1-L211)
- [AdminPublications.tsx](file://src/pages/admin/AdminPublications.tsx#L1-L990)
- [AdminRankings.tsx](file://src/pages/admin/AdminRankings.tsx#L1-L714)
- [AdminProductionQueues.tsx](file://src/pages/admin/AdminProductionQueues.tsx#L1-L510)
- [AdminTeams.tsx](file://src/pages/admin/AdminTeams.tsx#L1-L369)
- [AdminJobs.tsx](file://src/pages/admin/AdminJobs.tsx#L1-L199)
- [AdminStyleboxes.tsx](file://src/pages/admin/AdminStyleboxes.tsx#L1-L531)
- [AdminLayout.tsx](file://src/components/admin/AdminLayout.tsx#L1-L238)
- [AdminSidebar.tsx](file://src/components/admin/AdminSidebar.tsx#L1-L254)
- [useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L1-L216)
- [useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx#L1-L209)

**Section sources**
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx#L1-L428)
- [AdminLayout.tsx](file://src/components/admin/AdminLayout.tsx#L1-L238)
- [AdminSidebar.tsx](file://src/components/admin/AdminSidebar.tsx#L1-L254)
- [useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L1-L216)
- [useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx#L1-L209)

## Performance Considerations
- Real-time updates: Postgres changes and RPC reduce polling overhead and improve responsiveness.
- Caching: React Query manages server state and invalidation to avoid redundant network calls.
- Pagination and filtering: Reduce payload sizes and rendering work on large datasets.
- Role-based UI: Conditional rendering prevents unnecessary DOM for non-visible sections.

## Troubleshooting Guide
- Authentication issues: Verify admin role resolution and cross-tab sign-out behavior. Check auth logs for failures.
- Real-time feeds: Confirm channel subscriptions and ensure RPC functions are available.
- Data inconsistencies: Use query invalidation after mutations to synchronize UI state.
- Audit trails: Review admin logs and production logs for actions taken by administrators.

**Section sources**
- [useAdminAuth.tsx](file://src/hooks/useAdminAuth.tsx#L134-L140)
- [AdminSecurity.tsx](file://src/pages/admin/AdminSecurity.tsx#L115-L127)
- [AdminProductionQueues.tsx](file://src/pages/admin/AdminProductionQueues.tsx#L241-L257)

## Conclusion
The administrative dashboard provides a comprehensive, role-aware control surface for managing users, content, commerce, and operations. Its real-time capabilities, robust audit logging, and modular component architecture enable efficient oversight and governance across the platform.