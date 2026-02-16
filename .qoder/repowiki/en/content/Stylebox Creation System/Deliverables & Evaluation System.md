# Deliverables & Evaluation System

<cite>
**Referenced Files in This Document**
- [DeliverablesConfigTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesConfigTab.tsx)
- [DeliverablesTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesTab.tsx)
- [DetailedDeliverablesTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DetailedDeliverablesTab.tsx)
- [EvaluationTab.tsx](file://src/components/admin/stylebox-wizard/tabs/EvaluationTab.tsx)
- [WizardContext.tsx](file://src/components/admin/stylebox-wizard/WizardContext.tsx)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts)
- [designer-submissions.ts](file://src/types/designer-submissions.ts)
- [DeliverablesChecklist.tsx](file://src/components/stylebox/workspace/DeliverablesChecklist.tsx)
- [StyleboxWorkspace.tsx](file://src/pages/StyleboxWorkspace.tsx)
- [scoring.ts](file://src/lib/scoring.ts)
- [submit-stylebox-entry/index.ts](file://supabase/functions/submit-stylebox-entry/index.ts)
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
This document explains the deliverables and evaluation system within the StyleBox creation workflow. It covers the differences between standard deliverables and detailed deliverables, configuration options for each, evaluation criteria setup, the deliverables checklist functionality, required versus optional deliverables, and how deliverables relate to scoring and review processes. Practical examples demonstrate how to configure deliverables for different design scenarios, set up evaluation rubrics, and manage deliverable requirements throughout the design process.

## Project Structure
The deliverables and evaluation system spans several components:
- Admin wizard tabs for configuration
- Template definitions and defaults
- Designer workspace checklist
- Submission and review integration
- Scoring and evaluation logic

```mermaid
graph TB
subgraph "Admin Wizard"
WCtx["WizardContext"]
DT["DeliverablesTab"]
DDT["DetailedDeliverablesTab"]
DC["DeliverablesConfigTab"]
ET["EvaluationTab"]
end
subgraph "Templates & Types"
ST["stylebox-template.ts"]
DS["designer-submissions.ts"]
end
subgraph "Designer Workspace"
SW["StyleboxWorkspace"]
DCL["DeliverablesChecklist"]
end
subgraph "Backend"
SUP["Supabase Functions"]
SUB["submit-stylebox-entry"]
end
WCtx --> DT
WCtx --> DDT
WCtx --> DC
WCtx --> ET
DT --> ST
DDT --> ST
DC --> ST
ET --> ST
ST --> DS
SW --> DCL
DCL --> DS
SW --> SUP
SUP --> SUB
```

**Diagram sources**
- [WizardContext.tsx](file://src/components/admin/stylebox-wizard/WizardContext.tsx#L45-L119)
- [DeliverablesTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesTab.tsx#L11-L198)
- [DetailedDeliverablesTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DetailedDeliverablesTab.tsx#L29-L351)
- [DeliverablesConfigTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesConfigTab.tsx#L25-L187)
- [EvaluationTab.tsx](file://src/components/admin/stylebox-wizard/tabs/EvaluationTab.tsx#L11-L177)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L188-L282)
- [designer-submissions.ts](file://src/types/designer-submissions.ts#L33-L100)
- [StyleboxWorkspace.tsx](file://src/pages/StyleboxWorkspace.tsx#L29-L412)
- [DeliverablesChecklist.tsx](file://src/components/stylebox/workspace/DeliverablesChecklist.tsx#L38-L374)
- [submit-stylebox-entry/index.ts](file://supabase/functions/submit-stylebox-entry/index.ts#L9-L142)

**Section sources**
- [WizardContext.tsx](file://src/components/admin/stylebox-wizard/WizardContext.tsx#L45-L119)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L188-L282)
- [StyleboxWorkspace.tsx](file://src/pages/StyleboxWorkspace.tsx#L29-L412)

## Core Components
- Deliverables configuration (standard and detailed)
- Evaluation criteria setup
- Deliverables checklist in the designer workspace
- Submission pipeline and validation

Key responsibilities:
- Admin wizard: define deliverables and evaluation criteria
- Designer workspace: upload deliverables and track progress
- Backend: validate submissions and notify stakeholders

**Section sources**
- [DeliverablesTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesTab.tsx#L11-L198)
- [DetailedDeliverablesTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DetailedDeliverablesTab.tsx#L29-L351)
- [DeliverablesConfigTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesConfigTab.tsx#L25-L187)
- [EvaluationTab.tsx](file://src/components/admin/stylebox-wizard/tabs/EvaluationTab.tsx#L11-L177)
- [DeliverablesChecklist.tsx](file://src/components/stylebox/workspace/DeliverablesChecklist.tsx#L38-L374)

## Architecture Overview
The deliverables and evaluation system integrates admin configuration with designer submission and backend validation.

```mermaid
sequenceDiagram
participant Admin as "Admin Wizard"
participant WCtx as "WizardContext"
participant ST as "stylebox-template"
participant DS as "designer-submissions"
participant SW as "StyleboxWorkspace"
participant DCL as "DeliverablesChecklist"
participant SUP as "Supabase Functions"
participant SUB as "submit-stylebox-entry"
Admin->>WCtx : Configure deliverables and evaluation
WCtx->>ST : Persist template with deliverables and criteria
ST-->>DS : Provide types and defaults
SW->>DCL : Render checklist with deliverables
DCL->>SUP : Upload deliverable files
SUP-->>SUB : Trigger submission endpoint
SUB-->>SW : Confirm submission receipt
```

**Diagram sources**
- [WizardContext.tsx](file://src/components/admin/stylebox-wizard/WizardContext.tsx#L53-L92)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L429-L460)
- [designer-submissions.ts](file://src/types/designer-submissions.ts#L33-L100)
- [StyleboxWorkspace.tsx](file://src/pages/StyleboxWorkspace.tsx#L74-L117)
- [DeliverablesChecklist.tsx](file://src/components/stylebox/workspace/DeliverablesChecklist.tsx#L77-L162)
- [submit-stylebox-entry/index.ts](file://supabase/functions/submit-stylebox-entry/index.ts#L88-L106)

## Detailed Component Analysis

### Standard Deliverables vs Detailed Deliverables
- Standard deliverables: curated, category-aware deliverables included in the template. They are selected by category and can be marked required or optional.
- Detailed deliverables: granular, production-grade deliverables with categories, specifications, file formats, dimensions, and required flags.

Configuration options:
- Standard deliverables: name, description, required flag, naming convention, and removal.
- Detailed deliverables: name, description, category, specifications list, file format, dimensions, required flag, and expandable details.

```mermaid
classDiagram
class DeliverableItem {
+string id
+string name
+boolean required
+string description
+string naming_convention
+string file_format
}
class DetailedDeliverable {
+string id
+string name
+string description
+string[] specifications
+string file_format
+string dimensions
+boolean required
+string category
}
class EvaluationCriterion {
+string name
+number weight
+string description
}
class StyleBoxTemplate {
+DeliverableItem[] deliverables
+DetailedDeliverable[] detailed_deliverables
+EvaluationCriterion[] evaluation_criteria
}
StyleBoxTemplate --> DeliverableItem : "has many"
StyleBoxTemplate --> DetailedDeliverable : "has many"
StyleBoxTemplate --> EvaluationCriterion : "has many"
```

**Diagram sources**
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L194-L201)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L173-L182)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L188-L192)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L209-L282)

**Section sources**
- [DeliverablesTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesTab.tsx#L11-L198)
- [DetailedDeliverablesTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DetailedDeliverablesTab.tsx#L29-L351)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L340-L352)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L173-L182)

### Deliverables Checklist Functionality
The checklist displays deliverables, tracks upload progress, applies watermarks for images, validates file sizes, and updates submission progress.

Key behaviors:
- File type detection and icons
- Watermark application for images
- Chunked upload messaging for large files
- Storage upload and database record creation
- Progress indicators and success/error notifications

```mermaid
flowchart TD
Start(["User selects file"]) --> Detect["Detect file type"]
Detect --> Watermark{"Is image?"}
Watermark --> |Yes| ApplyWM["Apply watermark"]
Watermark --> |No| SkipWM["Skip watermark"]
ApplyWM --> Large{"File > 50MB?"}
SkipWM --> Large
Large --> |Yes| Notify["Notify chunked upload"]
Large --> |No| Proceed["Proceed to upload"]
Notify --> Proceed
Proceed --> Upload["Upload to storage"]
Upload --> URL["Get public URL"]
URL --> Record["Insert submission file record"]
Record --> Success["Show success and refresh"]
Success --> End(["Done"])
```

**Diagram sources**
- [DeliverablesChecklist.tsx](file://src/components/stylebox/workspace/DeliverablesChecklist.tsx#L77-L162)
- [DeliverablesChecklist.tsx](file://src/components/stylebox/workspace/DeliverablesChecklist.tsx#L164-L178)

**Section sources**
- [DeliverablesChecklist.tsx](file://src/components/stylebox/workspace/DeliverablesChecklist.tsx#L38-L374)
- [StyleboxWorkspace.tsx](file://src/pages/StyleboxWorkspace.tsx#L337-L389)

### Evaluation Criteria Setup
Evaluation criteria define the scoring rubric with weights that must sum to 100%. Defaults include Creativity, On-Trend Alignment, Technical Accuracy, and Market Relevance.

Configuration options:
- Add/remove criteria
- Adjust weights with slider
- Reset to defaults
- Distribute evenly across existing criteria

Validation:
- Total weight validation
- Enforce 100% requirement

**Section sources**
- [EvaluationTab.tsx](file://src/components/admin/stylebox-wizard/tabs/EvaluationTab.tsx#L11-L177)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L305-L310)

### Required vs Optional Deliverables
- Required deliverables: marked with a required badge and enforced for submission completion.
- Optional deliverables: can be added without blocking submission.

In the workspace:
- Required deliverables are visually emphasized
- Submission is disabled until all required deliverables are uploaded

**Section sources**
- [DeliverablesChecklist.tsx](file://src/components/stylebox/workspace/DeliverablesChecklist.tsx#L279-L286)
- [StyleboxWorkspace.tsx](file://src/pages/StyleboxWorkspace.tsx#L346-L368)

### Relationship to Scoring and Review
Scoring and review are separate from deliverables configuration but integrate with submissions:
- Scoring system calculates weighted contributions from StyleBox, Portfolio, Publications, and Selling
- Evaluation criteria inform reviewer scoring rubrics
- Submission completeness drives submission eligibility

```mermaid
graph LR
EC["Evaluation Criteria"] --> REV["Reviewer Scoring"]
DL["Deliverables"] --> SUB["Submission"]
SUB --> REV
REV --> SC["Scoring System"]
SC --> RANK["Rank & XP"]
```

**Diagram sources**
- [scoring.ts](file://src/lib/scoring.ts#L1-L239)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L188-L192)
- [designer-submissions.ts](file://src/types/designer-submissions.ts#L33-L100)

**Section sources**
- [scoring.ts](file://src/lib/scoring.ts#L1-L239)
- [StyleboxWorkspace.tsx](file://src/pages/StyleboxWorkspace.tsx#L346-L368)

## Dependency Analysis
- Wizard tabs depend on WizardContext for state management and on stylebox-template for defaults and types.
- Designer workspace depends on stylebox-template for deliverables and on designer-submissions for submission types.
- Backend functions depend on Supabase client for authentication and storage operations.

```mermaid
graph TB
WCtx["WizardContext.tsx"] --> ST["stylebox-template.ts"]
DT["DeliverablesTab.tsx"] --> ST
DDT["DetailedDeliverablesTab.tsx"] --> ST
DC["DeliverablesConfigTab.tsx"] --> ST
ET["EvaluationTab.tsx"] --> ST
DCL["DeliverablesChecklist.tsx"] --> DS["designer-submissions.ts"]
SW["StyleboxWorkspace.tsx"] --> DCL
SUBF["submit-stylebox-entry/index.ts"] --> SUP["Supabase Client"]
```

**Diagram sources**
- [WizardContext.tsx](file://src/components/admin/stylebox-wizard/WizardContext.tsx#L45-L119)
- [DeliverablesTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesTab.tsx#L11-L198)
- [DetailedDeliverablesTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DetailedDeliverablesTab.tsx#L29-L351)
- [DeliverablesConfigTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesConfigTab.tsx#L25-L187)
- [EvaluationTab.tsx](file://src/components/admin/stylebox-wizard/tabs/EvaluationTab.tsx#L11-L177)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L188-L282)
- [designer-submissions.ts](file://src/types/designer-submissions.ts#L33-L100)
- [DeliverablesChecklist.tsx](file://src/components/stylebox/workspace/DeliverablesChecklist.tsx#L38-L374)
- [StyleboxWorkspace.tsx](file://src/pages/StyleboxWorkspace.tsx#L29-L412)
- [submit-stylebox-entry/index.ts](file://supabase/functions/submit-stylebox-entry/index.ts#L9-L142)

**Section sources**
- [WizardContext.tsx](file://src/components/admin/stylebox-wizard/WizardContext.tsx#L45-L119)
- [stylebox-template.ts](file://src/lib/stylebox-template.ts#L188-L282)
- [designer-submissions.ts](file://src/types/designer-submissions.ts#L33-L100)

## Performance Considerations
- Large file uploads: chunked upload messaging improves perceived performance for large assets.
- Watermark application: offloads image processing to client-side before upload to reduce backend load.
- Progress indicators: provide immediate feedback during upload and processing.
- Validation: client-side checks prevent unnecessary backend calls for invalid files.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Missing deliverables: ensure at least one deliverable is configured in the wizard; otherwise, the designer cannot submit.
- Evaluation weights not summing to 100%: adjust weights until total equals 100%; use the "Distribute Evenly" or "Reset Defaults" buttons.
- Submission blocked: verify all required deliverables are uploaded; submission is disabled until checklist is complete.
- Upload failures: check file size limits (500MB max) and supported formats; confirm network connectivity and storage permissions.

**Section sources**
- [DeliverablesConfigTab.tsx](file://src/components/admin/stylebox-wizard/tabs/DeliverablesConfigTab.tsx#L170-L181)
- [EvaluationTab.tsx](file://src/components/admin/stylebox-wizard/tabs/EvaluationTab.tsx#L69-L88)
- [DeliverablesChecklist.tsx](file://src/components/stylebox/workspace/DeliverablesChecklist.tsx#L318-L326)
- [StyleboxWorkspace.tsx](file://src/pages/StyleboxWorkspace.tsx#L346-L368)

## Conclusion
The deliverables and evaluation system provides a structured framework for defining submission requirements and scoring criteria. Admins configure deliverables and evaluation rubrics in the wizard, while designers use the workspace checklist to upload deliverables and track progress. The backend enforces submission rules and notifies stakeholders upon successful submission. Proper configuration of required deliverables and balanced evaluation weights ensures a fair and efficient review process aligned with learning outcomes and commercial goals.