# Studio Workspace

<cite>
**Referenced Files in This Document**
- [App.tsx](file://src/App.tsx)
- [Dashboard.tsx](file://src/pages/Dashboard.tsx)
- [Portfolio.tsx](file://src/pages/Portfolio.tsx)
- [DesignerProjects.tsx](file://src/pages/DesignerProjects.tsx)
- [Teams.tsx](file://src/pages/Teams.tsx)
- [Jobs.tsx](file://src/pages/Jobs.tsx)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts)
- [dual-layer-types.ts](file://src/lib/dual-layer-types.ts)
- [useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx)
- [usePortfolioData.tsx](file://src/hooks/usePortfolioData.tsx)
- [useTeamData.tsx](file://src/hooks/useTeamData.tsx)
- [DesignerProjectManager.tsx](file://src/components/projects/DesignerProjectManager.tsx)
- [PortfolioGrid.tsx](file://src/components/portfolio/PortfolioGrid.tsx)
- [StatCard.tsx](file://src/components/dashboard/StatCard.tsx)
- [TeamActivity.tsx](file://src/components/dashboard/TeamActivity.tsx)
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
This document explains the designer studio workspace functionality: the dashboard and analytics system, portfolio management for showcasing design work, team collaboration features for multi-user projects, and the job opportunities platform. It also documents the dual-layer context system that orchestrates designer projects, the real-time analytics capabilities, and the integration between studio tools and marketplace functionality. Practical examples illustrate how to create designs, manage portfolios, and collaborate in teams, along with dashboard analytics usage.

## Project Structure
The studio workspace spans routing, providers, pages, hooks, contexts, and components:
- Routing and Providers: App-level routing wraps studio pages with authentication, subscription, theme, and dual-layer providers.
- Pages: Dashboard, Portfolio, Designer Projects, Teams, Jobs, and Analytics.
- Hooks: Real-time statistics, portfolio data, team data.
- Context: DualLayerContext manages projects, assets, and publication requests.
- Services: DualLayerService encapsulates Supabase operations for projects and publication requests.
- Components: Dashboard widgets, portfolio grids, team discovery, and job listings.

```mermaid
graph TB
subgraph "Routing & Providers"
APP["App.tsx"]
DLProv["DualLayerContext.tsx"]
end
subgraph "Studio Pages"
DASH["Dashboard.tsx"]
PORT["Portfolio.tsx"]
DPRJ["DesignerProjects.tsx"]
TEAM["Teams.tsx"]
JOB["Jobs.tsx"]
end
subgraph "Hooks"
DSH["useDashboardStats.tsx"]
POD["usePortfolioData.tsx"]
TMD["useTeamData.tsx"]
end
subgraph "Context & Service"
DLS["DualLayerContext.tsx"]
DLSVC["dual-layer-service.ts"]
DLT["dual-layer-types.ts"]
end
subgraph "Components"
STAT["StatCard.tsx"]
TACT["TeamActivity.tsx"]
PGRID["PortfolioGrid.tsx"]
DPM["DesignerProjectManager.tsx"]
end
APP --> DASH
APP --> PORT
APP --> DPRJ
APP --> TEAM
APP --> JOB
DASH --> DSH
DASH --> STAT
DASH --> TACT
PORT --> POD
PORT --> PGRID
DPRJ --> DLS
DLS --> DLSVC
DLSVC --> DLT
TEAM --> TMD
```

**Diagram sources**
- [App.tsx](file://src/App.tsx#L155-L420)
- [Dashboard.tsx](file://src/pages/Dashboard.tsx#L29-L440)
- [Portfolio.tsx](file://src/pages/Portfolio.tsx#L36-L322)
- [DesignerProjects.tsx](file://src/pages/DesignerProjects.tsx#L6-L46)
- [Teams.tsx](file://src/pages/Teams.tsx#L41-L633)
- [Jobs.tsx](file://src/pages/Jobs.tsx#L26-L228)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L135-L303)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L4-L340)
- [dual-layer-types.ts](file://src/lib/dual-layer-types.ts#L1-L44)
- [useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx#L16-L147)
- [usePortfolioData.tsx](file://src/hooks/usePortfolioData.tsx#L31-L117)
- [useTeamData.tsx](file://src/hooks/useTeamData.tsx#L24-L129)
- [StatCard.tsx](file://src/components/dashboard/StatCard.tsx#L17-L73)
- [TeamActivity.tsx](file://src/components/dashboard/TeamActivity.tsx#L20-L97)
- [PortfolioGrid.tsx](file://src/components/portfolio/PortfolioGrid.tsx#L76-L330)
- [DesignerProjectManager.tsx](file://src/components/projects/DesignerProjectManager.tsx#L9-L364)

**Section sources**
- [App.tsx](file://src/App.tsx#L155-L420)

## Core Components
- Dashboard: Presents statistics, active styleboxes, recent activity, rank progress, team activity, and earnings snapshot.
- Portfolio: Manages design projects, supports upload, categorization, collections, and publication requests.
- Designer Projects: Centralizes project lifecycle and publication requests via the dual-layer context.
- Teams: Enables team creation, discovery, invitations, join requests, and team challenges.
- Jobs: Provides job browsing, filtering, saving, and application submission.
- Dual-Layer Context: State and service orchestration for projects, assets, and publication requests.
- Hooks: Real-time dashboard stats, portfolio metrics, and team data.

**Section sources**
- [Dashboard.tsx](file://src/pages/Dashboard.tsx#L29-L440)
- [Portfolio.tsx](file://src/pages/Portfolio.tsx#L36-L322)
- [DesignerProjects.tsx](file://src/pages/DesignerProjects.tsx#L6-L46)
- [Teams.tsx](file://src/pages/Teams.tsx#L41-L633)
- [Jobs.tsx](file://src/pages/Jobs.tsx#L26-L228)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L135-L303)
- [useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx#L16-L147)
- [usePortfolioData.tsx](file://src/hooks/usePortfolioData.tsx#L31-L117)
- [useTeamData.tsx](file://src/hooks/useTeamData.tsx#L24-L129)

## Architecture Overview
The studio workspace follows a layered architecture:
- Routing and Providers: App.tsx configures routes and composes providers for auth, subscription, theme, and dual-layer context.
- Pages: Each page composes reusable components and hooks.
- Context and Service: DualLayerContext exposes CRUD operations and state updates; DualLayerService performs Supabase queries and transformations.
- Real-time Analytics: Dashboard statistics subscribe to portfolio changes for near real-time updates.

```mermaid
sequenceDiagram
participant U as "User"
participant R as "App.tsx Router"
participant P as "Studio Providers"
participant C as "DualLayerContext"
participant S as "DualLayerService"
participant DB as "Supabase"
U->>R : Navigate to "/projects"
R->>P : Wrap with providers
P->>C : Initialize DualLayerProvider
U->>C : loadDesignerProjects(userId)
C->>S : getDesignerProjects(userId)
S->>DB : SELECT projects WHERE designer_id=userId
DB-->>S : Projects[]
S-->>C : Projects[]
C-->>U : Render DesignerProjectManager with projects
```

**Diagram sources**
- [App.tsx](file://src/App.tsx#L223-L300)
- [DesignerProjects.tsx](file://src/pages/DesignerProjects.tsx#L6-L46)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L135-L303)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L85-L99)

## Detailed Component Analysis

### Dashboard and Analytics System
The dashboard aggregates key metrics and presents them in an accessible layout:
- Statistics cards: Active styleboxes, completed this year, portfolio items, love count, earnings snapshot.
- Active styleboxes: Grid of stylebox cards with progress and status.
- Recent activity: List of recent stylebox submissions with status badges.
- Team activity: Team overview, current project, and member avatars.
- Earnings snapshot: Monthly and total earnings, pending payouts, products sold.

```mermaid
flowchart TD
Start(["Dashboard Mount"]) --> FetchProfile["Fetch Profile & Greeting"]
FetchProfile --> FetchStats["useDashboardStats()"]
FetchStats --> QuerySubmissions["Query stylebox_submissions"]
QuerySubmissions --> QueryPortfolios["Count portfolio_projects per designer"]
QueryPortfolios --> QueryEarnings["Sum earnings per designer"]
QueryEarnings --> QueryPayouts["Sum pending payouts"]
QueryPayouts --> QueryProducts["Count live marketplace_products"]
QueryProducts --> QueryFollows["Count designer_follows"]
QueryFollows --> Render["Render StatCards, Activity, Team, Earnings"]
Render --> End(["Dashboard Ready"])
```

**Diagram sources**
- [Dashboard.tsx](file://src/pages/Dashboard.tsx#L58-L94)
- [useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx#L30-L143)

Practical example: Viewing monthly earnings and portfolio items
- Navigate to the dashboard.
- Observe the “Earnings” and “Portfolio Items” cards.
- Toggle tabs to see recent activity and team highlights.

**Section sources**
- [Dashboard.tsx](file://src/pages/Dashboard.tsx#L29-L440)
- [StatCard.tsx](file://src/components/dashboard/StatCard.tsx#L17-L73)
- [TeamActivity.tsx](file://src/components/dashboard/TeamActivity.tsx#L20-L97)
- [useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx#L16-L147)

### Portfolio Management
Portfolio management enables designers to:
- Upload projects and organize them by category and status.
- Create collections from categories.
- Request publication to marketplace.
- Track publication status and manage featured items.

```mermaid
sequenceDiagram
participant U as "Designer"
participant PORT as "Portfolio.tsx"
participant GRID as "PortfolioGrid.tsx"
participant DL as "DualLayerContext"
participant SVC as "DualLayerService"
U->>PORT : Open Portfolio
PORT->>GRID : Render items (stylebox/upload)
U->>GRID : Click "Request Publish"
GRID->>DL : submitPublicationRequest(designerId, {project_id})
DL->>SVC : submitPublicationRequest(...)
SVC->>SVC : Validate ownership
SVC-->>DL : Created request
DL-->>PORT : Update requests list
PORT-->>U : Show status and track option
```

**Diagram sources**
- [Portfolio.tsx](file://src/pages/Portfolio.tsx#L36-L322)
- [PortfolioGrid.tsx](file://src/components/portfolio/PortfolioGrid.tsx#L76-L330)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L229-L241)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L147-L181)

Practical example: Creating a portfolio collection
- Go to the “Collections” tab in Portfolio.
- Add projects to a category; the system counts unique categories as collections.
- Use the “Create Collection” card to define a new grouping.

**Section sources**
- [Portfolio.tsx](file://src/pages/Portfolio.tsx#L36-L322)
- [PortfolioGrid.tsx](file://src/components/portfolio/PortfolioGrid.tsx#L76-L330)
- [usePortfolioData.tsx](file://src/hooks/usePortfolioData.tsx#L31-L117)

### Team Collaboration Features
Teams allows designers to:
- Create teams with category, max members, and open/closed settings.
- Discover and request to join public teams.
- Manage invitations and join requests (team leads).
- Participate in team challenges with specialized roles.

```mermaid
flowchart TD
Start(["Teams Page"]) --> CheckTeam{"Have a team?"}
CheckTeam --> |No| Create["Create Team Dialog"]
CheckTeam --> |Yes| MyTeam["My Team Tab"]
Create --> Validate["Eligibility & Validation"]
Validate --> Submit["Submit Team Creation"]
Submit --> Success["Switch to My Team Tab"]
Discover["Discover Teams Tab"] --> Search["Search & Filter"]
Search --> Join["Request to Join (open teams)"]
Join --> Pending["Pending Join Requests"]
Invites["Invitations Tab"] --> Respond["Accept/Decline"]
Respond --> Update["Update Team Membership"]
```

**Diagram sources**
- [Teams.tsx](file://src/pages/Teams.tsx#L41-L633)

Practical example: Starting a team challenge
- Go to “Team Challenges” tab.
- Review the Sovereign Atelier challenge details and eligibility.
- Start the challenge and assign roles to team members.

**Section sources**
- [Teams.tsx](file://src/pages/Teams.tsx#L41-L633)
- [useTeamData.tsx](file://src/hooks/useTeamData.tsx#L24-L129)

### Job Opportunities Platform
The Jobs page provides:
- Browse jobs with filters (category, job type, location, salary).
- Save jobs and track applications.
- Apply with cover letter and portfolio URL.

```mermaid
sequenceDiagram
participant U as "Designer"
participant JOB as "Jobs.tsx"
participant API as "Supabase"
U->>JOB : Browse Jobs
JOB->>API : Fetch active jobs
API-->>JOB : Jobs[]
U->>JOB : Save/Unsave Job
JOB->>API : Upsert saved_jobs
U->>JOB : Apply
JOB->>API : Insert job_applications
API-->>JOB : Success
JOB-->>U : Toast success
```

**Diagram sources**
- [Jobs.tsx](file://src/pages/Jobs.tsx#L26-L228)

Practical example: Applying to a job
- Filter jobs by category and location.
- Save interesting positions.
- Submit an application with a cover letter and portfolio link.

**Section sources**
- [Jobs.tsx](file://src/pages/Jobs.tsx#L26-L228)

### Dual-Layer Context System
The dual-layer context manages:
- Projects: Create, update, delete, list.
- Assets: Upload and list per project.
- Publication Requests: Submit, list, review, and convert to marketplace products.

```mermaid
classDiagram
class DualLayerContext {
+projects : Project[]
+projectAssets : Record<string, ProjectAsset[]>
+publicationRequests : PublicationRequest[]
+loading : object
+error : string|null
+createProject()
+updateProject()
+deleteProject()
+uploadProjectAsset()
+loadProjectAssets()
+submitPublicationRequest()
+loadDesignerProjects()
+loadDesignerPublicationRequests()
+loadPendingPublicationRequests()
+reviewPublicationRequest()
}
class DualLayerService {
+createProject()
+updateProject()
+deleteProject()
+getDesignerProjects()
+uploadProjectAsset()
+getProjectAssets()
+submitPublicationRequest()
+getDesignerPublicationRequests()
+getPendingPublicationRequests()
+reviewPublicationRequest()
+convertRequestToProduct()
+getProductForRequest()
}
class Project {
+string id
+string designer_id
+string title
+string description
+string category
+string status
+string[]|null tags
+object|null metadata
+string created_at
+string updated_at
}
class ProjectAsset {
+string id
+string project_id
+string designer_id
+string name
+string type
+string url
+string|url thumbnail_url
+number display_order
+object|null metadata
+string created_at
}
class PublicationRequest {
+string id
+string designer_id
+string project_id
+string|project_title
+string|project_description
+string status
+string submitted_at
+string|reviewed_at
+string|reviewed_by
+string|admin_notes
+string|marketplace_conversion_id
+string created_at
+string updated_at
}
DualLayerContext --> DualLayerService : "delegates"
DualLayerService --> Project : "manages"
DualLayerService --> ProjectAsset : "manages"
DualLayerService --> PublicationRequest : "manages"
```

**Diagram sources**
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L120-L295)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L4-L340)
- [dual-layer-types.ts](file://src/lib/dual-layer-types.ts#L3-L44)

Practical example: Managing a project lifecycle
- Create a project via Designer Projects page.
- Upload assets to the project.
- Submit a publication request.
- Monitor status and, upon approval, convert to a marketplace product.

**Section sources**
- [DesignerProjects.tsx](file://src/pages/DesignerProjects.tsx#L6-L46)
- [DesignerProjectManager.tsx](file://src/components/projects/DesignerProjectManager.tsx#L9-L364)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L135-L303)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L4-L340)

### Real-Time Collaboration and Analytics
- Dashboard statistics subscribe to portfolio changes to keep counts current.
- Team activity displays current project and member avatars.
- Portfolio grid supports reordering and quick actions for efficient management.

```mermaid
sequenceDiagram
participant DSH as "useDashboardStats.tsx"
participant SB as "Supabase"
DSH->>SB : postgres_changes on portfolio_projects
SB-->>DSH : Event
DSH->>SB : Refetch stats
SB-->>DSH : Stats data
DSH-->>UI : Updated stats
```

**Diagram sources**
- [useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx#L129-L143)

**Section sources**
- [useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx#L16-L147)
- [useTeamData.tsx](file://src/hooks/useTeamData.tsx#L24-L129)
- [PortfolioGrid.tsx](file://src/components/portfolio/PortfolioGrid.tsx#L76-L330)

## Dependency Analysis
- Routing depends on providers for authentication, subscription, theme, and dual-layer context.
- Pages depend on hooks for data fetching and components for UI.
- DualLayerContext depends on DualLayerService for backend operations.
- DualLayerService depends on Supabase for database operations.

```mermaid
graph LR
APP["App.tsx"] --> DASH["Dashboard.tsx"]
APP --> PORT["Portfolio.tsx"]
APP --> DPRJ["DesignerProjects.tsx"]
APP --> TEAM["Teams.tsx"]
APP --> JOB["Jobs.tsx"]
DASH --> DSH["useDashboardStats.tsx"]
PORT --> POD["usePortfolioData.tsx"]
TEAM --> TMD["useTeamData.tsx"]
DPRJ --> DLS["DualLayerContext.tsx"]
DLS --> DLSVC["dual-layer-service.ts"]
DLSVC --> DLT["dual-layer-types.ts"]
```

**Diagram sources**
- [App.tsx](file://src/App.tsx#L223-L300)
- [Dashboard.tsx](file://src/pages/Dashboard.tsx#L29-L440)
- [Portfolio.tsx](file://src/pages/Portfolio.tsx#L36-L322)
- [DesignerProjects.tsx](file://src/pages/DesignerProjects.tsx#L6-L46)
- [Teams.tsx](file://src/pages/Teams.tsx#L41-L633)
- [Jobs.tsx](file://src/pages/Jobs.tsx#L26-L228)
- [DualLayerContext.tsx](file://src/contexts/DualLayerContext.tsx#L135-L303)
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L4-L340)
- [dual-layer-types.ts](file://src/lib/dual-layer-types.ts#L1-L44)
- [useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx#L16-L147)
- [usePortfolioData.tsx](file://src/hooks/usePortfolioData.tsx#L31-L117)
- [useTeamData.tsx](file://src/hooks/useTeamData.tsx#L24-L129)

**Section sources**
- [App.tsx](file://src/App.tsx#L223-L300)

## Performance Considerations
- Minimize redundant queries: Use query keys and invalidate strategies to avoid repeated network calls.
- Pagination and filtering: Apply filters early to reduce payload sizes.
- Real-time subscriptions: Limit channels and events to essential tables to reduce overhead.
- Component memoization: Use useMemo and memoized components for large lists (e.g., portfolio grids).

## Troubleshooting Guide
Common issues and resolutions:
- Unauthorized access to projects/assets: Ensure ownership checks pass before mutating data.
- Loading states: Use skeleton loaders and loading flags to prevent UI flicker.
- Real-time updates: Verify Supabase channel subscriptions are established and cleaned up on unmount.
- Portfolio counts: Confirm portfolio_projects triggers are firing and stats are recalculated.

**Section sources**
- [dual-layer-service.ts](file://src/lib/dual-layer-service.ts#L25-L83)
- [useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx#L129-L143)

## Conclusion
The studio workspace integrates a robust dashboard, portfolio management, team collaboration, and job opportunities with a dual-layer context that connects designer projects to marketplace publishing. Real-time analytics and structured components streamline workflows from design creation to portfolio presentation and team collaboration.