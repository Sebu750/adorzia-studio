# Team Challenge Participation

<cite>
**Referenced Files in This Document**
- [src/lib/team-challenges.ts](file://src/lib/team-challenges.ts)
- [src/lib/sovereign-atelier.ts](file://src/lib/sovereign-atelier.ts)
- [src/hooks/useTeams.tsx](file://src/hooks/useTeams.tsx)
- [src/hooks/useTeamData.tsx](file://src/hooks/useTeamData.tsx)
- [src/pages/Teams.tsx](file://src/pages/Teams.tsx)
- [src/components/teams/TeamStyleboxCard.tsx](file://src/components/teams/TeamStyleboxCard.tsx)
- [src/components/teams/TeamRoleAssignment.tsx](file://src/components/teams/TeamRoleAssignment.tsx)
- [src/components/teams/TeamChallengeProgress.tsx](file://src/components/teams/TeamChallengeProgress.tsx)
- [src/components/admin/TeamSubmissionReview.tsx](file://src/components/admin/TeamSubmissionReview.tsx)
- [supabase/functions/validate-team-eligibility/index.ts](file://supabase/functions/validate-team-eligibility/index.ts)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts)
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
This document explains the team challenge participation mechanics implemented in the application. It covers how teams enroll in challenges, eligibility requirements, role assignments, progress tracking, deliverable submission, evaluation, and reward distribution. It also documents timing constraints, team size requirements, difficulty scaling, and practical strategies for optimizing team performance.

## Project Structure
The team challenge system spans frontend React components and hooks, backend Supabase edge functions, and shared TypeScript libraries that define challenge types and constants.

```mermaid
graph TB
subgraph "Frontend"
TeamsPage["Teams.tsx"]
TeamStyleboxCard["TeamStyleboxCard.tsx"]
TeamRoleAssignment["TeamRoleAssignment.tsx"]
TeamChallengeProgress["TeamChallengeProgress.tsx"]
useTeams["useTeams.tsx"]
useTeamData["useTeamData.tsx"]
TeamSubmissionReview["TeamSubmissionReview.tsx"]
TeamChallengesLib["team-challenges.ts"]
SovereignAtelier["sovereign-atelier.ts"]
end
subgraph "Backend"
ValidateEligibility["validate-team-eligibility/index.ts"]
ManageTeam["manage-team/index.ts"]
end
TeamsPage --> TeamStyleboxCard
TeamsPage --> TeamRoleAssignment
TeamsPage --> TeamChallengeProgress
TeamsPage --> useTeams
TeamStyleboxCard --> TeamChallengesLib
TeamRoleAssignment --> TeamChallengesLib
TeamChallengeProgress --> TeamChallengesLib
TeamSubmissionReview --> TeamChallengesLib
useTeams --> ManageTeam
useTeamData --> ManageTeam
TeamsPage --> ValidateEligibility
TeamChallengesLib --> SovereignAtelier
```

**Diagram sources**
- [src/pages/Teams.tsx](file://src/pages/Teams.tsx#L1-L633)
- [src/components/teams/TeamStyleboxCard.tsx](file://src/components/teams/TeamStyleboxCard.tsx#L1-L159)
- [src/components/teams/TeamRoleAssignment.tsx](file://src/components/teams/TeamRoleAssignment.tsx#L1-L201)
- [src/components/teams/TeamChallengeProgress.tsx](file://src/components/teams/TeamChallengeProgress.tsx#L1-L215)
- [src/hooks/useTeams.tsx](file://src/hooks/useTeams.tsx#L1-L579)
- [src/hooks/useTeamData.tsx](file://src/hooks/useTeamData.tsx#L1-L129)
- [src/components/admin/TeamSubmissionReview.tsx](file://src/components/admin/TeamSubmissionReview.tsx#L42-L128)
- [src/lib/team-challenges.ts](file://src/lib/team-challenges.ts#L1-L133)
- [src/lib/sovereign-atelier.ts](file://src/lib/sovereign-atelier.ts#L1-L177)
- [supabase/functions/validate-team-eligibility/index.ts](file://supabase/functions/validate-team-eligibility/index.ts#L1-L145)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L1-L548)

**Section sources**
- [src/pages/Teams.tsx](file://src/pages/Teams.tsx#L1-L633)
- [src/lib/team-challenges.ts](file://src/lib/team-challenges.ts#L1-L133)
- [src/lib/sovereign-atelier.ts](file://src/lib/sovereign-atelier.ts#L1-L177)
- [src/hooks/useTeams.tsx](file://src/hooks/useTeams.tsx#L1-L579)
- [src/hooks/useTeamData.tsx](file://src/hooks/useTeamData.tsx#L1-L129)
- [supabase/functions/validate-team-eligibility/index.ts](file://supabase/functions/validate-team-eligibility/index.ts#L1-L145)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L1-L548)

## Core Components
- Team challenge types and helpers: Defines roles, challenge metadata, submission status, and utility functions for progress calculation and deadlines.
- Sovereign Atelier challenge definition: Provides a concrete team challenge with roles, evaluation criteria, constraints, and deliverables.
- Team management hooks: Provide team CRUD, invitations, join requests, and real-time updates.
- UI components: Cards for challenge discovery, role assignment dialogs, and progress dashboards.
- Edge functions: Validate team eligibility and manage team lifecycle operations.

**Section sources**
- [src/lib/team-challenges.ts](file://src/lib/team-challenges.ts#L1-L133)
- [src/lib/sovereign-atelier.ts](file://src/lib/sovereign-atelier.ts#L1-L177)
- [src/hooks/useTeams.tsx](file://src/hooks/useTeams.tsx#L1-L579)
- [src/hooks/useTeamData.tsx](file://src/hooks/useTeamData.tsx#L1-L129)
- [src/pages/Teams.tsx](file://src/pages/Teams.tsx#L1-L633)
- [src/components/teams/TeamStyleboxCard.tsx](file://src/components/teams/TeamStyleboxCard.tsx#L1-L159)
- [src/components/teams/TeamRoleAssignment.tsx](file://src/components/teams/TeamRoleAssignment.tsx#L1-L201)
- [src/components/teams/TeamChallengeProgress.tsx](file://src/components/teams/TeamChallengeProgress.tsx#L1-L215)
- [src/components/admin/TeamSubmissionReview.tsx](file://src/components/admin/TeamSubmissionReview.tsx#L42-L128)
- [supabase/functions/validate-team-eligibility/index.ts](file://supabase/functions/validate-team-eligibility/index.ts#L1-L145)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L1-L548)

## Architecture Overview
The system integrates frontend UI with backend Supabase edge functions and database tables to support team-based challenges.

```mermaid
sequenceDiagram
participant User as "User"
participant UI as "Teams.tsx"
participant Hook as "useTeams.tsx"
participant Func as "manage-team/index.ts"
participant DB as "Supabase DB"
User->>UI : "Create Team"
UI->>Hook : "createTeam(payload)"
Hook->>Func : "invoke('manage-team', {action : 'create', ...})"
Func->>DB : "Insert teams + team_members"
DB-->>Func : "Team created"
Func-->>Hook : "{ team }"
Hook-->>UI : "Refresh teams, show success"
```

**Diagram sources**
- [src/pages/Teams.tsx](file://src/pages/Teams.tsx#L67-L86)
- [src/hooks/useTeams.tsx](file://src/hooks/useTeams.tsx#L306-L351)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L82-L201)

```mermaid
sequenceDiagram
participant User as "User"
participant UI as "TeamStyleboxCard.tsx"
participant Elig as "validate-team-eligibility/index.ts"
participant DB as "Supabase DB"
User->>UI : "Start Challenge"
UI->>Elig : "Invoke validate-team-eligibility {team_id, stylebox_id}"
Elig->>DB : "Fetch stylebox + team members + ranks"
DB-->>Elig : "Team + members + ranks"
Elig-->>UI : "{ eligible, members, teamRoles }"
UI-->>User : "Enable Start or show reasons"
```

**Diagram sources**
- [src/components/teams/TeamStyleboxCard.tsx](file://src/components/teams/TeamStyleboxCard.tsx#L1-L159)
- [supabase/functions/validate-team-eligibility/index.ts](file://supabase/functions/validate-team-eligibility/index.ts#L16-L134)

## Detailed Component Analysis

### Team Challenge Types and Helpers
Defines the canonical types and helpers for team challenges:
- TeamRole: role identity, requirements, deliverables, and badge metadata.
- TeamChallenge: challenge metadata including team size, minimum rank order, and role requirements.
- TeamSubmissionStatus: submission state per role and overall challenge status.
- Utility functions: role lookup, completeness checks, progress calculation, and countdown formatting.

```mermaid
classDiagram
class TeamRole {
+string role_id
+string role_name
+string[] requirements
+string[] deliverables
+badge.name
+badge.icon
+badge.meaning
}
class TeamChallenge {
+boolean is_team_challenge
+number team_size
+number minimum_team_rank_order
+TeamRole[] team_role_requirements
}
class TeamSubmissionStatus {
+string status
+Record role_id -> user_id role_assignments
+Record role_id -> files, submitted_at, status role_submissions
+string deadline
+number total_score
}
TeamChallenge --> TeamRole : "has many"
```

**Diagram sources**
- [src/lib/team-challenges.ts](file://src/lib/team-challenges.ts#L3-L40)

**Section sources**
- [src/lib/team-challenges.ts](file://src/lib/team-challenges.ts#L1-L133)

### Sovereign Atelier Challenge Definition
Provides a concrete team challenge with:
- Roles: Master Cutter, Artisan Weaver, Draping Specialist, Creative Director.
- Evaluation criteria and fail points.
- Constraints: minimum rank, team size, deadlines, and approval requirements.
- Deliverables organized by category.

```mermaid
flowchart TD
Start(["Challenge Setup"]) --> Roles["Define 4 Specialized Roles"]
Roles --> Eval["Set Evaluation Criteria"]
Eval --> Constraints["Set Constraints<br/>- Min Rank<br/>- Team Size<br/>- Deadline<br/>- Approval"]
Constraints --> Deliverables["Define Deliverables by Category"]
Deliverables --> Publish["Publish Challenge"]
Publish --> Enroll["Team Enrollment"]
Enroll --> Assign["Role Assignment"]
Assign --> Work["Work Phase"]
Work --> Submit["Submit Deliverables"]
Submit --> Review["Review & Score"]
Review --> Reward["Distribute Rewards"]
Reward --> End(["Complete"])
```

**Diagram sources**
- [src/lib/sovereign-atelier.ts](file://src/lib/sovereign-atelier.ts#L5-L89)
- [src/lib/sovereign-atelier.ts](file://src/lib/sovereign-atelier.ts#L91-L130)
- [src/lib/sovereign-atelier.ts](file://src/lib/sovereign-atelier.ts#L132-L176)

**Section sources**
- [src/lib/sovereign-atelier.ts](file://src/lib/sovereign-atelier.ts#L1-L177)

### Team Management Hooks
The hooks encapsulate team operations and state:
- useTeams: fetch user’s team, available teams, invitations, join requests; create, invite, respond, join, leave team; real-time subscriptions.
- useTeamData: lightweight team data for quick displays.

```mermaid
sequenceDiagram
participant UI as "Teams.tsx"
participant Hook as "useTeams.tsx"
participant Func as "manage-team/index.ts"
participant DB as "Supabase DB"
UI->>Hook : "fetchMyTeam()"
Hook->>DB : "Query team_members + teams + profiles"
DB-->>Hook : "TeamWithMembers"
Hook-->>UI : "Set state"
UI->>Hook : "createTeam()"
Hook->>Func : "invoke('manage-team', {action : 'create'})"
Func->>DB : "Insert teams + team_members"
DB-->>Func : "Team"
Func-->>Hook : "{ team }"
Hook-->>UI : "Refetch + toast"
```

**Diagram sources**
- [src/hooks/useTeams.tsx](file://src/hooks/useTeams.tsx#L66-L147)
- [src/hooks/useTeams.tsx](file://src/hooks/useTeams.tsx#L306-L351)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L82-L201)

**Section sources**
- [src/hooks/useTeams.tsx](file://src/hooks/useTeams.tsx#L1-L579)
- [src/hooks/useTeamData.tsx](file://src/hooks/useTeamData.tsx#L1-L129)

### Team Discovery and Eligibility
The Teams page surfaces team challenges and eligibility:
- Displays a challenge card with difficulty, team size, time limit, XP reward, and roles.
- Determines eligibility based on team composition and rank thresholds.
- Provides “Start Challenge” when eligible and team is fully formed.

```mermaid
flowchart TD
Load["Load Teams Page"] --> Card["Render TeamStyleboxCard"]
Card --> CheckElig["Check isTeamEligible (mock)"]
CheckElig --> FullTeam{"Team at size?"}
FullTeam --> |No| Disabled["Disable Start"]
FullTeam --> |Yes| Enabled["Enable Start"]
Enabled --> Start["Start Challenge"]
Disabled --> Wait["Wait for members"]
```

**Diagram sources**
- [src/pages/Teams.tsx](file://src/pages/Teams.tsx#L396-L446)
- [src/components/teams/TeamStyleboxCard.tsx](file://src/components/teams/TeamStyleboxCard.tsx#L1-L159)

**Section sources**
- [src/pages/Teams.tsx](file://src/pages/Teams.tsx#L1-L633)
- [src/components/teams/TeamStyleboxCard.tsx](file://src/components/teams/TeamStyleboxCard.tsx#L1-L159)

### Role Assignment and Confirmation
The role assignment dialog enforces one-role-per-member and allows final confirmation before starting the challenge.

```mermaid
sequenceDiagram
participant UI as "TeamStyleboxCard.tsx"
participant Dialog as "TeamRoleAssignment.tsx"
participant Hook as "useTeams.tsx"
participant Func as "validate-team-eligibility/index.ts"
UI->>Dialog : "Open Role Assignment"
Dialog->>Hook : "Fetch team members"
Dialog->>Dialog : "Prevent double-assignment"
Dialog-->>UI : "Show confirmation"
UI->>Func : "Validate eligibility (real impl)"
Func-->>UI : "{ eligible }"
UI-->>Dialog : "Proceed to start"
```

**Diagram sources**
- [src/components/teams/TeamRoleAssignment.tsx](file://src/components/teams/TeamRoleAssignment.tsx#L1-L201)
- [src/components/teams/TeamStyleboxCard.tsx](file://src/components/teams/TeamStyleboxCard.tsx#L1-L159)
- [supabase/functions/validate-team-eligibility/index.ts](file://supabase/functions/validate-team-eligibility/index.ts#L16-L134)

**Section sources**
- [src/components/teams/TeamRoleAssignment.tsx](file://src/components/teams/TeamRoleAssignment.tsx#L1-L201)
- [src/components/teams/TeamStyleboxCard.tsx](file://src/components/teams/TeamStyleboxCard.tsx#L1-L159)

### Progress Tracking and Deliverable Submission
The progress component visualizes deadline, overall progress, per-role status, and submission actions.

```mermaid
flowchart TD
Enter["Enter Progress View"] --> Load["Load roles + assignments + submissions"]
Load --> Time["Compute time remaining"]
Load --> Progress["Compute % complete"]
Progress --> Roles["Render role cards"]
Roles --> Actions{"Role status"}
Actions --> |Pending| Upload["Upload deliverable"]
Actions --> |Submitted| Review["Under Review"]
Actions --> |Approved| Done["Approved"]
Actions --> |Revision| Revise["Resubmit with feedback"]
```

**Diagram sources**
- [src/components/teams/TeamChallengeProgress.tsx](file://src/components/teams/TeamChallengeProgress.tsx#L1-L215)
- [src/lib/team-challenges.ts](file://src/lib/team-challenges.ts#L66-L77)
- [src/lib/team-challenges.ts](file://src/lib/team-challenges.ts#L79-L113)

**Section sources**
- [src/components/teams/TeamChallengeProgress.tsx](file://src/components/teams/TeamChallengeProgress.tsx#L1-L215)
- [src/lib/team-challenges.ts](file://src/lib/team-challenges.ts#L1-L133)

### Evaluation and Review Workflow
Administrators review submissions against evaluation criteria and can approve, request revision, or reject.

```mermaid
sequenceDiagram
participant Reviewer as "TeamSubmissionReview.tsx"
participant Criteria as "EvaluationCriteria[]"
participant Roles as "TeamRole[]"
Reviewer->>Reviewer : "Initialize scores per role/criteria"
Reviewer->>Criteria : "Iterate criteria with weights"
Reviewer->>Roles : "Collect role-specific notes"
Reviewer->>Reviewer : "Compute total weighted score"
Reviewer-->>Reviewer : "Approve/Revision/Reject with feedback"
```

**Diagram sources**
- [src/components/admin/TeamSubmissionReview.tsx](file://src/components/admin/TeamSubmissionReview.tsx#L78-L128)
- [src/lib/sovereign-atelier.ts](file://src/lib/sovereign-atelier.ts#L91-L130)

**Section sources**
- [src/components/admin/TeamSubmissionReview.tsx](file://src/components/admin/TeamSubmissionReview.tsx#L42-L128)
- [src/lib/sovereign-atelier.ts](file://src/lib/sovereign-atelier.ts#L91-L130)

## Dependency Analysis
The system exhibits clear separation of concerns:
- Frontend UI depends on shared types and challenge definitions.
- Hooks orchestrate Supabase edge function invocations.
- Edge functions enforce business rules and update the database.
- Real-time subscriptions keep the UI synchronized.

```mermaid
graph LR
UI["Teams.tsx"] --> Card["TeamStyleboxCard.tsx"]
UI --> RoleDlg["TeamRoleAssignment.tsx"]
UI --> Progress["TeamChallengeProgress.tsx"]
Card --> Types["team-challenges.ts"]
RoleDlg --> Types
Progress --> Types
UI --> Hooks["useTeams.tsx"]
Hooks --> Manage["manage-team/index.ts"]
UI --> Elig["validate-team-eligibility/index.ts"]
Types --> SA["sovereign-atelier.ts"]
```

**Diagram sources**
- [src/pages/Teams.tsx](file://src/pages/Teams.tsx#L1-L633)
- [src/components/teams/TeamStyleboxCard.tsx](file://src/components/teams/TeamStyleboxCard.tsx#L1-L159)
- [src/components/teams/TeamRoleAssignment.tsx](file://src/components/teams/TeamRoleAssignment.tsx#L1-L201)
- [src/components/teams/TeamChallengeProgress.tsx](file://src/components/teams/TeamChallengeProgress.tsx#L1-L215)
- [src/hooks/useTeams.tsx](file://src/hooks/useTeams.tsx#L1-L579)
- [src/lib/team-challenges.ts](file://src/lib/team-challenges.ts#L1-L133)
- [src/lib/sovereign-atelier.ts](file://src/lib/sovereign-atelier.ts#L1-L177)
- [supabase/functions/validate-team-eligibility/index.ts](file://supabase/functions/validate-team-eligibility/index.ts#L1-L145)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L1-L548)

**Section sources**
- [src/pages/Teams.tsx](file://src/pages/Teams.tsx#L1-L633)
- [src/hooks/useTeams.tsx](file://src/hooks/useTeams.tsx#L1-L579)
- [src/lib/team-challenges.ts](file://src/lib/team-challenges.ts#L1-L133)
- [src/lib/sovereign-atelier.ts](file://src/lib/sovereign-atelier.ts#L1-L177)
- [supabase/functions/validate-team-eligibility/index.ts](file://supabase/functions/validate-team-eligibility/index.ts#L1-L145)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L1-L548)

## Performance Considerations
- Minimize redundant queries: use the provided hooks and pass pre-fetched data to components.
- Debounce search and filters in team discovery to reduce network load.
- Cache role and submission metadata locally when appropriate to avoid repeated calculations.
- Use real-time subscriptions for near-real-time updates without polling.

## Troubleshooting Guide
Common issues and resolutions:
- Team creation blocked by rank: Ensure the creator meets the minimum rank threshold before creation.
- Invitation acceptance fails due to team capacity: Verify the team has available slots.
- Join request denied: Check team membership rules and capacity.
- Eligibility validation errors: Confirm all team members meet the minimum rank order and team size requirements.
- Progress not updating: Ensure real-time subscriptions are active and the backend functions are reachable.

**Section sources**
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L93-L121)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L314-L319)
- [supabase/functions/manage-team/index.ts](file://supabase/functions/manage-team/index.ts#L453-L458)
- [supabase/functions/validate-team-eligibility/index.ts](file://supabase/functions/validate-team-eligibility/index.ts#L85-L97)
- [supabase/functions/validate-team-eligibility/index.ts](file://supabase/functions/validate-team-eligibility/index.ts#L109-L120)

## Conclusion
The team challenge system combines robust frontend components with backend validation and team management functions. It supports structured role-based collaboration, transparent progress tracking, and fair evaluation with clear reward pathways. By adhering to the documented constraints and leveraging the provided components and hooks, teams can effectively participate in competitive challenges while maintaining clarity and fairness across all stages.