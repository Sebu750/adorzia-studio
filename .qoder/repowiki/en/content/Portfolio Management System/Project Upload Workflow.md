# Project Upload Workflow

<cite>
**Referenced Files in This Document**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx)
- [PortfolioEditModal.tsx](file://src/components/portfolio/PortfolioEditModal.tsx)
- [image-compression.ts](file://src/lib/image-compression.ts)
- [image-processing.ts](file://src/lib/image-processing.ts)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts)
- [Portfolio.tsx](file://src/pages/Portfolio.tsx)
- [PortfolioGrid.tsx](file://src/components/portfolio/PortfolioGrid.tsx)
- [usePortfolioData.tsx](file://src/hooks/usePortfolioData.tsx)
- [ProjectDetailModal.tsx](file://src/components/portfolio/ProjectDetailModal.tsx)
- [20260127230305_create_portfolio_tables.sql](file://supabase/migrations/20260127230305_create_portfolio_tables.sql)
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
This document explains the complete project upload workflow for the portfolio system. It covers the upload modal interface, file selection and validation, metadata entry, compression strategies, thumbnail generation, preview functionality, step-by-step procedures, error handling, progress indicators, backend processing pipeline, storage optimization, and quality assurance checks. The workflow integrates frontend UI components with Supabase functions and database tables to deliver a robust and user-friendly experience.

## Project Structure
The upload workflow spans several frontend components and backend functions:
- Frontend modals and pages orchestrate user interactions
- Image compression utilities optimize file sizes
- Supabase Edge Function handles secure server-side processing
- Database tables store projects, assets, and metadata

```mermaid
graph TB
subgraph "Frontend"
UI_Portfolio["Portfolio Page<br/>src/pages/Portfolio.tsx"]
UI_UploadModal["Upload Modal<br/>src/components/portfolio/PortfolioUploadModal.tsx"]
UI_EditModal["Edit Modal<br/>src/components/portfolio/PortfolioEditModal.tsx"]
UI_DetailModal["Project Detail Modal<br/>src/components/portfolio/ProjectDetailModal.tsx"]
UI_Grid["Portfolio Grid<br/>src/components/portfolio/PortfolioGrid.tsx"]
Util_Compress["Image Compression<br/>src/lib/image-compression.ts"]
Util_Process["Image Processing<br/>src/lib/image-processing.ts"]
end
subgraph "Backend"
Func_Upload["Upload Function<br/>supabase/functions/upload-portfolio-project/index.ts"]
DB_Projects["portfolio_projects Table<br/>supabase/migrations/...create_portfolio_tables.sql"]
DB_Assets["portfolio_assets Table<br/>supabase/migrations/...create_portfolio_tables.sql"]
end
UI_Portfolio --> UI_UploadModal
UI_UploadModal --> Util_Compress
UI_UploadModal --> Func_Upload
UI_EditModal --> Func_Upload
UI_DetailModal --> DB_Assets
UI_Grid --> DB_Projects
Func_Upload --> DB_Projects
Func_Upload --> DB_Assets
```

**Diagram sources**
- [Portfolio.tsx](file://src/pages/Portfolio.tsx#L258-L262)
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L1-L521)
- [PortfolioEditModal.tsx](file://src/components/portfolio/PortfolioEditModal.tsx#L1-L251)
- [ProjectDetailModal.tsx](file://src/components/portfolio/ProjectDetailModal.tsx#L1-L461)
- [PortfolioGrid.tsx](file://src/components/portfolio/PortfolioGrid.tsx#L1-L296)
- [image-compression.ts](file://src/lib/image-compression.ts#L1-L124)
- [image-processing.ts](file://src/lib/image-processing.ts#L1-L82)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L1-L300)
- [20260127230305_create_portfolio_tables.sql](file://supabase/migrations/20260127230305_create_portfolio_tables.sql#L1-L86)

**Section sources**
- [Portfolio.tsx](file://src/pages/Portfolio.tsx#L33-L268)
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L1-L521)
- [PortfolioEditModal.tsx](file://src/components/portfolio/PortfolioEditModal.tsx#L1-L251)
- [ProjectDetailModal.tsx](file://src/components/portfolio/ProjectDetailModal.tsx#L1-L461)
- [PortfolioGrid.tsx](file://src/components/portfolio/PortfolioGrid.tsx#L1-L296)
- [image-compression.ts](file://src/lib/image-compression.ts#L1-L124)
- [image-processing.ts](file://src/lib/image-processing.ts#L1-L82)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L1-L300)
- [20260127230305_create_portfolio_tables.sql](file://supabase/migrations/20260127230305_create_portfolio_tables.sql#L1-L86)

## Core Components
- Upload Modal: Provides drag-and-drop file selection, validation, compression, preview, and submission controls.
- Edit Modal: Allows updating project metadata and thumbnail URL after upload.
- Compression Utilities: Optimizes image sizes using browser-based compression with progress feedback.
- Upload Function: Processes uploads server-side, validates requests, creates portfolio entries, stores assets, and generates thumbnails.
- Portfolio Pages and Grid: Display projects, support filtering and publication requests.

**Section sources**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L1-L521)
- [PortfolioEditModal.tsx](file://src/components/portfolio/PortfolioEditModal.tsx#L1-L251)
- [image-compression.ts](file://src/lib/image-compression.ts#L1-L124)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L1-L300)
- [Portfolio.tsx](file://src/pages/Portfolio.tsx#L33-L268)
- [PortfolioGrid.tsx](file://src/components/portfolio/PortfolioGrid.tsx#L1-L296)

## Architecture Overview
The upload workflow follows a client-driven compression and submission pattern with server-side validation and persistence.

```mermaid
sequenceDiagram
participant User as "User"
participant Modal as "PortfolioUploadModal"
participant Compress as "Image Compression"
participant Supa as "Supabase Function"
participant Storage as "Supabase Storage"
participant DB as "Database"
User->>Modal : Open Upload Modal
Modal->>Modal : Drag/Drop or Select Files
Modal->>Compress : Compress Images (parallel)
Compress-->>Modal : Compression Results + Savings
Modal->>Modal : Validate Metadata (Title, Images)
Modal->>Supa : POST upload-portfolio-project
Supa->>DB : Create Portfolio + Project
Supa->>Storage : Upload Assets (base64 decoded)
Supa->>DB : Insert Asset Records
Supa-->>Modal : Success Response
Modal-->>User : Toast + Refresh Portfolio
```

**Diagram sources**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L75-L151)
- [image-compression.ts](file://src/lib/image-compression.ts#L69-L86)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L21-L287)

## Detailed Component Analysis

### Upload Modal Interface and File Selection
- File Acceptance: Supports JPEG, JPG, PNG, and WebP with a 10 MB per-file limit.
- Drag-and-Drop Zone: Highlights on drag enter/leave with visual feedback.
- File Validation: On selection, files are validated for type and size; invalid files show error notifications.
- Compression Pipeline: Selected files are compressed in parallel with progress updates; savings are calculated and displayed.
- Preview Grid: Shows thumbnails with remove controls; first image is marked as thumbnail.
- Metadata Forms: Title (required), description, category, and tags; tags support add/remove and Enter key submission.

```mermaid
flowchart TD
Start(["Open Upload Modal"]) --> Drag["Drag/Drop or Choose Files"]
Drag --> Validate["Validate File Types and Sizes"]
Validate --> Valid{"All Files Valid?"}
Valid --> |No| ShowErrors["Show Validation Errors"]
Valid --> |Yes| Compress["Compress Images (Parallel)"]
Compress --> ShowPreview["Render Preview Grid"]
ShowPreview --> Meta["Fill Metadata (Title*, Description, Category, Tags)"]
Meta --> Submit{"Ready to Upload?"}
Submit --> |No| Edit["Edit Selection/Metadata"]
Submit --> |Yes| CallAPI["Call Upload Function"]
CallAPI --> End(["Success/Toast + Refresh"])
```

**Diagram sources**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L185-L256)
- [image-compression.ts](file://src/lib/image-compression.ts#L69-L86)

**Section sources**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L185-L256)
- [image-compression.ts](file://src/lib/image-compression.ts#L1-L124)

### Metadata Entry Forms and Validation
- Title: Required field with character limit.
- Description: Optional with character limit.
- Category: Select from predefined categories.
- Tags: Add/remove tags with Enter key support; duplicates prevented.
- Validation: Ensures at least one image and a non-empty title before enabling upload.

**Section sources**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L410-L488)
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L75-L151)

### Supported Formats, Size Limits, and Compression Strategies
- Supported Formats: JPEG, JPG, PNG, WebP.
- Size Limit: 10 MB per file.
- Compression Defaults: Target ~2 MB max size, max dimension 1920, WebP output, 85% initial quality, Web Worker usage for performance.
- Progress Tracking: Separate progress bars for compression and upload phases.
- Savings Display: Percentage and absolute saved bytes shown after compression.

**Section sources**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L45-L46)
- [image-compression.ts](file://src/lib/image-compression.ts#L19-L25)
- [image-compression.ts](file://src/lib/image-compression.ts#L69-L86)
- [image-compression.ts](file://src/lib/image-compression.ts#L91-L101)

### Thumbnail Generation and Preview
- Thumbnail Selection: First uploaded image is automatically set as the project thumbnail.
- Backend Thumbnail Update: After successful storage, the project’s thumbnail URL is updated.
- Preview Controls: In the detail modal, users can navigate images and see thumbnails; edit modal supports manual thumbnail URL override.

**Section sources**
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L181-L193)
- [PortfolioEditModal.tsx](file://src/components/portfolio/PortfolioEditModal.tsx#L206-L227)
- [ProjectDetailModal.tsx](file://src/components/portfolio/ProjectDetailModal.tsx#L282-L339)

### Step-by-Step Upload Procedure
1. Open the Portfolio page and click "Upload Project".
2. Drag-and-drop or choose images; validation runs immediately.
3. Adjust metadata: title (required), description, category, tags.
4. Wait for compression progress; review savings.
5. Click "Upload Project"; monitor upload progress.
6. On success, toast confirms completion and the grid refreshes.

**Section sources**
- [Portfolio.tsx](file://src/pages/Portfolio.tsx#L82-L89)
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L311-L320)
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L495-L516)

### Error Handling Mechanisms and Progress Indicators
- Frontend:
  - Validation errors for unsupported types or oversized files.
  - Compression failures fall back to original files with user notification.
  - Upload progress bar and current file indicator during submission.
  - Error toast on failure; progress resets on error.
- Backend:
  - Authentication checks and authorization header validation.
  - Batch upload rollback on failure: deletes uploaded files, asset records, and project.
  - Detailed error messages returned to client.

**Section sources**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L146-L151)
- [image-compression.ts](file://src/lib/image-compression.ts#L53-L63)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L26-L66)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L228-L273)

### File Processing Pipeline and Storage Optimization
- Client-Side:
  - Base64 encoding of compressed images for transport.
  - Parallel compression reduces total wait time.
- Server-Side:
  - Decodes base64 to binary data.
  - Stores files in Supabase Storage with cache-control and unique filenames.
  - Creates asset records with file metadata and dimensions.
  - Sets thumbnail URL on the first asset.
  - Uses service role client to bypass row-level security for storage operations.

**Section sources**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L82-L103)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L136-L227)

### Quality Assurance Checks
- Required Fields: Title and at least one image are mandatory.
- File Integrity: Binary decoding and storage errors trigger rollback.
- Metadata Consistency: Thumbnail URL updated only after successful storage.
- User Feedback: Real-time progress and savings notifications.

**Section sources**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L75-L79)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L68-L76)

### Project Editing Capabilities
- Edit Modal allows updating title, description, category, tags, and thumbnail URL.
- Saves changes via Supabase update mutation and refreshes queries.

**Section sources**
- [PortfolioEditModal.tsx](file://src/components/portfolio/PortfolioEditModal.tsx#L76-L104)
- [PortfolioEditModal.tsx](file://src/components/portfolio/PortfolioEditModal.tsx#L206-L227)

### Data Model and Relationships
The upload workflow persists data in two primary tables with referential integrity and indexing.

```mermaid
erDiagram
PORTFOLIOS {
uuid id PK
uuid designer_id FK
text title
text description
}
PORTFOLIO_PROJECTS {
uuid id PK
uuid portfolio_id FK
text title
text description
text category
text[] tags
text thumbnail_url
text source_type
uuid source_id
jsonb metadata
}
PORTFOLIO_ASSETS {
uuid id PK
uuid portfolio_id FK
uuid project_id FK
uuid designer_id FK
text file_url
text file_name
text file_type
bigint file_size
text mime_type
jsonb dimensions
integer display_order
}
PORTFOLIOS ||--o{ PORTFOLIO_PROJECTS : "contains"
PORTFOLIO_PROJECTS ||--o{ PORTFOLIO_ASSETS : "has assets"
```

**Diagram sources**
- [20260127230305_create_portfolio_tables.sql](file://supabase/migrations/20260127230305_create_portfolio_tables.sql#L6-L43)

**Section sources**
- [20260127230305_create_portfolio_tables.sql](file://supabase/migrations/20260127230305_create_portfolio_tables.sql#L1-L86)

## Dependency Analysis
- Frontend dependencies:
  - PortfolioUploadModal depends on image-compression utilities and Supabase client.
  - PortfolioEditModal depends on Supabase client for updates.
  - PortfolioGrid and ProjectDetailModal depend on Supabase queries and mutations.
- Backend dependencies:
  - Upload function depends on Supabase client and service role key for storage operations.
  - Database migrations define table schemas and permissions.

```mermaid
graph LR
Modal["PortfolioUploadModal.tsx"] --> Compress["image-compression.ts"]
Modal --> SupaFunc["upload-portfolio-project/index.ts"]
EditModal["PortfolioEditModal.tsx"] --> SupaFunc
Detail["ProjectDetailModal.tsx"] --> DB["portfolio_assets"]
Grid["PortfolioGrid.tsx"] --> DBProj["portfolio_projects"]
SupaFunc --> DBProj
SupaFunc --> DBAssets["portfolio_assets"]
```

**Diagram sources**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L1-L521)
- [PortfolioEditModal.tsx](file://src/components/portfolio/PortfolioEditModal.tsx#L1-L251)
- [ProjectDetailModal.tsx](file://src/components/portfolio/ProjectDetailModal.tsx#L1-L461)
- [PortfolioGrid.tsx](file://src/components/portfolio/PortfolioGrid.tsx#L1-L296)
- [image-compression.ts](file://src/lib/image-compression.ts#L1-L124)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L1-L300)
- [20260127230305_create_portfolio_tables.sql](file://supabase/migrations/20260127230305_create_portfolio_tables.sql#L1-L86)

**Section sources**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L1-L521)
- [PortfolioEditModal.tsx](file://src/components/portfolio/PortfolioEditModal.tsx#L1-L251)
- [ProjectDetailModal.tsx](file://src/components/portfolio/ProjectDetailModal.tsx#L1-L461)
- [PortfolioGrid.tsx](file://src/components/portfolio/PortfolioGrid.tsx#L1-L296)
- [image-compression.ts](file://src/lib/image-compression.ts#L1-L124)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L1-L300)
- [20260127230305_create_portfolio_tables.sql](file://supabase/migrations/20260127230305_create_portfolio_tables.sql#L1-L86)

## Performance Considerations
- Parallel Compression: Reduces total processing time by handling multiple images concurrently.
- Web Worker Usage: Offloads compression to background threads to keep UI responsive.
- Base64 Encoding: Increases payload size; consider streaming or chunked uploads for very large batches.
- Storage Cache-Control: Sets cache-control to balance freshness and CDN performance.
- Rollback Efficiency: Batch deletion minimizes orphaned assets and ensures data consistency.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- File Type Errors: Ensure images are JPEG, JPG, PNG, or WebP; verify MIME types.
- Size Limit Exceeded: Compress images below 10 MB or resize prior to upload.
- Compression Failures: Browser-image-compression fallback returns original file; retry or adjust options.
- Authentication Errors: Verify session and access token availability before upload.
- Upload Failures: Check network connectivity; backend rollbacks clean up partial data.

**Section sources**
- [PortfolioUploadModal.tsx](file://src/components/portfolio/PortfolioUploadModal.tsx#L185-L193)
- [image-compression.ts](file://src/lib/image-compression.ts#L53-L63)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L26-L66)
- [upload-portfolio-project/index.ts](file://supabase/functions/upload-portfolio-project/index.ts#L228-L273)

## Conclusion
The project upload workflow combines a user-friendly frontend interface with efficient compression and a robust server-side pipeline. It enforces validation, provides clear feedback, optimizes storage, and maintains data integrity through rollbacks. Together with editing and preview capabilities, it delivers a seamless experience for designers to showcase their work.