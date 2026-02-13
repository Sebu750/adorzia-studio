# Progress Tracking & Rewards

<cite>
**Referenced Files in This Document**
- [CompletionProgressBar.tsx](file://src/components/stylebox/CompletionProgressBar.tsx)
- [LevelBadge.tsx](file://src/components/stylebox/LevelBadge.tsx)
- [SCRewardBadge.tsx](file://src/components/stylebox/SCRewardBadge.tsx)
- [NextUnlockHint.tsx](file://src/components/stylebox/NextUnlockHint.tsx)
- [StatusBadge.tsx](file://src/components/stylebox/StatusBadge.tsx)
- [SCProgressCard.tsx](file://src/components/dashboard/SCProgressCard.tsx)
- [RankProgress.tsx](file://src/components/dashboard/RankProgress.tsx)
- [style-credits.ts](file://src/lib/style-credits.ts)
- [scoring.ts](file://src/lib/scoring.ts)
- [ranks.ts](file://src/lib/ranks.ts)
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
This document explains the Stylebox progress tracking and rewards system in the Adorzia platform. It covers how completion progress is indicated, how designers advance through rank tiers, how Style Credits (SC) are calculated and awarded, and how the badge system communicates achievement levels and unlockable benefits. It also documents the scoring algorithms, XP-like accumulation via Stylebox evaluations, tier progression mechanics, milestone rewards, next unlock hints, progress visualization components, and integration with the broader ranking system.

## Project Structure
The Stylebox progress and rewards system spans UI components and shared libraries:
- UI components visualize progress, status, rewards, and unlocks.
- Libraries define SC difficulty ranges, rank tiers, and scoring formulas.

```mermaid
graph TB
subgraph "UI Components"
CPB["CompletionProgressBar.tsx"]
LVL["LevelBadge.tsx"]
SRB["SCRewardBadge.tsx"]
NUH["NextUnlockHint.tsx"]
STB["StatusBadge.tsx"]
SPC["SCProgressCard.tsx"]
RP["RankProgress.tsx"]
end
subgraph "Libraries"
SC_LIB["style-credits.ts"]
SCORE_LIB["scoring.ts"]
RANKS_LIB["ranks.ts"]
end
CPB --> SC_LIB
SRB --> SC_LIB
NUH --> SC_LIB
SPC --> SC_LIB
RP --> SC_LIB
SPC --> RANKS_LIB
RP --> RANKS_LIB
SCORE_LIB --> SC_LIB
```

**Diagram sources**
- [CompletionProgressBar.tsx](file://src/components/stylebox/CompletionProgressBar.tsx#L1-L49)
- [LevelBadge.tsx](file://src/components/stylebox/LevelBadge.tsx#L1-L40)
- [SCRewardBadge.tsx](file://src/components/stylebox/SCRewardBadge.tsx#L1-L46)
- [NextUnlockHint.tsx](file://src/components/stylebox/NextUnlockHint.tsx#L1-L82)
- [StatusBadge.tsx](file://src/components/stylebox/StatusBadge.tsx#L1-L89)
- [SCProgressCard.tsx](file://src/components/dashboard/SCProgressCard.tsx#L1-L226)
- [RankProgress.tsx](file://src/components/dashboard/RankProgress.tsx#L1-L204)
- [style-credits.ts](file://src/lib/style-credits.ts#L1-L188)
- [scoring.ts](file://src/lib/scoring.ts#L1-L239)
- [ranks.ts](file://src/lib/ranks.ts#L1-L246)

**Section sources**
- [CompletionProgressBar.tsx](file://src/components/stylebox/CompletionProgressBar.tsx#L1-L49)
- [SCRewardBadge.tsx](file://src/components/stylebox/SCRewardBadge.tsx#L1-L46)
- [NextUnlockHint.tsx](file://src/components/stylebox/NextUnlockHint.tsx#L1-L82)
- [SCProgressCard.tsx](file://src/components/dashboard/SCProgressCard.tsx#L1-L226)
- [RankProgress.tsx](file://src/components/dashboard/RankProgress.tsx#L1-L204)
- [style-credits.ts](file://src/lib/style-credits.ts#L1-L188)
- [scoring.ts](file://src/lib/scoring.ts#L1-L239)
- [ranks.ts](file://src/lib/ranks.ts#L1-L246)

## Core Components
- CompletionProgressBar: Tracks deliverables completion and displays potential SC reward range.
- SCRewardBadge: Visualizes SC reward ranges per difficulty.
- NextUnlockHint: Shows next challenge unlock requirement and progress toward it.
- StatusBadge: Displays Stylebox lifecycle status (draft, submitted, approved, etc.).
- SCProgressCard: Summarizes SC balance, rank, commission, and progress to next rank.
- RankProgress: Alternative rank progress card with recent badges display.
- Libraries:
  - style-credits.ts: Defines SC difficulty ranges, rank tiers, and SC-based rank progression helpers.
  - scoring.ts: Defines Stylebox scoring, evaluation weights, quality multipliers, timeliness adjustments, and weighted totals.
  - ranks.ts: Defines rank tiers, thresholds, progression, and effective commission calculation.

**Section sources**
- [CompletionProgressBar.tsx](file://src/components/stylebox/CompletionProgressBar.tsx#L1-L49)
- [SCRewardBadge.tsx](file://src/components/stylebox/SCRewardBadge.tsx#L1-L46)
- [NextUnlockHint.tsx](file://src/components/stylebox/NextUnlockHint.tsx#L1-L82)
- [StatusBadge.tsx](file://src/components/stylebox/StatusBadge.tsx#L1-L89)
- [SCProgressCard.tsx](file://src/components/dashboard/SCProgressCard.tsx#L1-L226)
- [RankProgress.tsx](file://src/components/dashboard/RankProgress.tsx#L1-L204)
- [style-credits.ts](file://src/lib/style-credits.ts#L1-L188)
- [scoring.ts](file://src/lib/scoring.ts#L1-L239)
- [ranks.ts](file://src/lib/ranks.ts#L1-L246)

## Architecture Overview
The system combines frontend visualization with backend-driven calculations:
- Frontend components consume library functions to compute and render progress, ranks, and rewards.
- Backend functions (not shown here) award SC upon Stylebox approval and may trigger notifications and leaderboards updates.

```mermaid
sequenceDiagram
participant User as "Designer"
participant UI as "SCProgressCard.tsx"
participant Lib as "style-credits.ts"
participant Ranks as "ranks.ts"
User->>UI : View dashboard
UI->>Lib : getRankFromSC(SC)
Lib-->>UI : Current rank threshold
UI->>Ranks : getNextStandardRank(currentRank)
Ranks-->>UI : Next rank definition
UI->>Ranks : getRankProgress(currentRank, SC)
Ranks-->>UI : Progress percentage
UI-->>User : Render SC, rank, progress, commission
```

**Diagram sources**
- [SCProgressCard.tsx](file://src/components/dashboard/SCProgressCard.tsx#L75-L90)
- [style-credits.ts](file://src/lib/style-credits.ts#L111-L119)
- [ranks.ts](file://src/lib/ranks.ts#L187-L215)

## Detailed Component Analysis

### Completion Progress Indicators
- Purpose: Show deliverables completion and potential SC reward range.
- Inputs: completedItems, totalItems, optional scReward range.
- Behavior:
  - Computes percentage and renders a progress bar.
  - Highlights completion state and displays reward range when provided.
- Integration: Used in Stylebox workspace to guide submissions.

```mermaid
flowchart TD
Start(["Render CompletionProgressBar"]) --> Calc["Compute progress = completed/total * 100"]
Calc --> IsComplete{"completed >= total?"}
IsComplete --> |Yes| ShowComplete["Show completion message<br/>and highlight bar"]
IsComplete --> |No| ShowProgress["Render animated progress bar"]
ShowComplete --> End(["Done"])
ShowProgress --> End
```

**Diagram sources**
- [CompletionProgressBar.tsx](file://src/components/stylebox/CompletionProgressBar.tsx#L12-L48)

**Section sources**
- [CompletionProgressBar.tsx](file://src/components/stylebox/CompletionProgressBar.tsx#L1-L49)

### Level Badge System
- Purpose: Visualize Stylebox level (I–IV) with contextual labels.
- Inputs: level number, size, className.
- Behavior: Maps numeric level to themed badge with label and tooltip.

```mermaid
flowchart TD
Start(["Render LevelBadge"]) --> Select["Select config by level"]
Select --> Apply["Apply bg/text styles and size"]
Apply --> Tooltip["Set title with level name"]
Tooltip --> End(["Done"])
```

**Diagram sources**
- [LevelBadge.tsx](file://src/components/stylebox/LevelBadge.tsx#L22-L39)

**Section sources**
- [LevelBadge.tsx](file://src/components/stylebox/LevelBadge.tsx#L1-L40)

### Style Credits Reward Badges
- Purpose: Display SC reward range for a given difficulty.
- Inputs: difficulty, showRange flag, compact mode.
- Behavior: Renders a badge with sparkles and the min-max range or max-only.

```mermaid
flowchart TD
Start(["Render SCRewardBadge"]) --> Lookup["Lookup range by difficulty"]
Lookup --> Compact{"Compact mode?"}
Compact --> |Yes| CompactBadge["Render small badge with sparkles"]
Compact --> |No| LargeBadge["Render prominent badge with gradient"]
CompactBadge --> End(["Done"])
LargeBadge --> End
```

**Diagram sources**
- [SCRewardBadge.tsx](file://src/components/stylebox/SCRewardBadge.tsx#L12-L45)

**Section sources**
- [SCRewardBadge.tsx](file://src/components/stylebox/SCRewardBadge.tsx#L1-L46)

### Next Unlock Hint System
- Purpose: Communicate next Stylebox unlock requirement and progress.
- Inputs: currentSC, nextStyleboxTitle, nextStyleboxId, requiredSC.
- Behavior:
  - If unlocked: show unlock notification and CTA to start.
  - Else: show lock icon, progress bar, and remaining SC needed.

```mermaid
flowchart TD
Start(["Render NextUnlockHint"]) --> Compute["scNeeded = required - current<br/>progress = min(100, current/required*100)"]
Compute --> Unlocked{"current >= required?"}
Unlocked --> |Yes| ShowUnlocked["Show unlock card with CTA"]
Unlocked --> |No| ShowLocked["Show lock card with progress bar"]
ShowUnlocked --> End(["Done"])
ShowLocked --> End
```

**Diagram sources**
- [NextUnlockHint.tsx](file://src/components/stylebox/NextUnlockHint.tsx#L14-L81)

**Section sources**
- [NextUnlockHint.tsx](file://src/components/stylebox/NextUnlockHint.tsx#L1-L82)

### Status Badge System
- Purpose: Display Stylebox lifecycle status with icons and color-coded labels.
- Inputs: status enum, showIcon flag.
- Behavior: Maps status to themed badge with icon and label.

```mermaid
flowchart TD
Start(["Render StatusBadge"]) --> Select["Select config by status"]
Select --> Apply["Apply themed class and icon"]
Apply --> End(["Done"])
```

**Diagram sources**
- [StatusBadge.tsx](file://src/components/stylebox/StatusBadge.tsx#L74-L88)

**Section sources**
- [StatusBadge.tsx](file://src/components/stylebox/StatusBadge.tsx#L1-L89)

### SC Progress Visualization Cards
- SCProgressCard:
  - Displays current SC, lifetime SC, rank, commission, and progress to next rank.
  - Integrates with rank styles and foundation bonuses.
- RankProgress:
  - Alternative card focusing on rank and recent badges.

```mermaid
sequenceDiagram
participant Card as "SCProgressCard.tsx"
participant SC as "style-credits.ts"
participant RK as "ranks.ts"
Card->>SC : getRankFromSC(SC)
SC-->>Card : Rank threshold
Card->>RK : getNextStandardRank(rank)
RK-->>Card : Next rank
Card->>RK : getRankProgress(rank, SC)
RK-->>Card : Progress percentage
Card-->>Card : Render SC, rank, commission, progress
```

**Diagram sources**
- [SCProgressCard.tsx](file://src/components/dashboard/SCProgressCard.tsx#L75-L90)
- [style-credits.ts](file://src/lib/style-credits.ts#L111-L119)
- [ranks.ts](file://src/lib/ranks.ts#L187-L215)

**Section sources**
- [SCProgressCard.tsx](file://src/components/dashboard/SCProgressCard.tsx#L1-L226)
- [RankProgress.tsx](file://src/components/dashboard/RankProgress.tsx#L1-L204)

### Scoring Algorithms and XP Accumulation
- Stylebox scoring:
  - Base points per difficulty.
  - Weighted evaluation score using domain-specific weights.
  - Quality multiplier based on average score band.
  - Timeliness bonus/penalty (early/on-time/late).
  - Contribution to weighted total across components.
- Designer weighted total:
  - Aggregates Stylebox, Portfolio, Publication, and Selling contributions with fixed weights.

```mermaid
flowchart TD
Start(["Calculate Stylebox Score"]) --> Base["Get base points by difficulty"]
Base --> Eval["Compute weighted evaluation score"]
Eval --> QM["Apply quality multiplier by average score"]
QM --> Time["Apply timeliness bonus/penalty"]
Time --> Final["Final score = base × multiplier × (1±bonus)"]
Final --> Contrib["Compute component contribution (30%)"]
Contrib --> End(["Done"])
```

**Diagram sources**
- [scoring.ts](file://src/lib/scoring.ts#L129-L148)

**Section sources**
- [scoring.ts](file://src/lib/scoring.ts#L1-L239)

### Tier Progression and Milestone Rewards
- Rank tiers and thresholds:
  - Apprentice → Patternist → Stylist → Couturier → Visionary → Creative Director.
  - Thresholds define min/max SC and commission rates.
- Progress calculation:
  - Percentage within current tier and SC needed to next tier.
- Milestone rewards:
  - Access to higher-difficulty Styleboxes.
  - Enhanced commission rates and badges.

```mermaid
flowchart TD
Start(["Determine Rank"]) --> Find["Find highest rank meeting SC threshold"]
Find --> Next["Compute next rank and progress %"]
Next --> Render["Render progress bar and SC needed"]
Render --> End(["Done"])
```

**Diagram sources**
- [style-credits.ts](file://src/lib/style-credits.ts#L111-L158)
- [ranks.ts](file://src/lib/ranks.ts#L199-L232)

**Section sources**
- [style-credits.ts](file://src/lib/style-credits.ts#L23-L100)
- [ranks.ts](file://src/lib/ranks.ts#L60-L177)

### Reward Distribution Mechanisms and Timing
- Random SC award on approval:
  - Difficulty-based range determines award.
  - Optional sold-out bonus range.
- Commission computation:
  - Effective commission includes foundation rank bonus, capped at 50%.
- Timing considerations:
  - Awards occur after Stylebox approval.
  - Leaderboard updates follow award events.

```mermaid
flowchart TD
Start(["Stylebox Approved"]) --> Diff["Select difficulty range"]
Diff --> RandAward["Generate random SC within range"]
RandAward --> SoldOut{"Is sold-out scenario?"}
SoldOut --> |Yes| AddBonus["Add sold-out bonus"]
SoldOut --> |No| SkipBonus["Skip bonus"]
AddBonus --> Total["Total SC = award + bonus"]
SkipBonus --> Total
Total --> Comm["Compute effective commission"]
Comm --> End(["Update profile, notify, update leaderboards"])
```

**Diagram sources**
- [style-credits.ts](file://src/lib/style-credits.ts#L160-L173)
- [style-credits.ts](file://src/lib/style-credits.ts#L121-L129)

**Section sources**
- [style-credits.ts](file://src/lib/style-credits.ts#L1-L188)

### Integration with the Broader Ranking System
- Rank tiers and thresholds are shared across UI cards and libraries.
- Effective commission considers both standard rank and foundation rank bonuses.
- UI cards render rank visuals, progress bars, and unlock hints aligned with library-defined thresholds.

```mermaid
classDiagram
class SCProgressCard {
+props : styleCredits, totalStyleCredits, currentRank, foundationRank
+renders : SC, rank, commission, progress
}
class RankProgress {
+props : currentRank, foundationRank, styleCredits, badges
+renders : rank, commission, progress, badges
}
class style_credits_lib {
+getRankFromSC()
+getProgressToNextRank()
+generateRandomSC()
+generateSoldOutBonus()
}
class ranks_lib {
+getNextStandardRank()
+getRankProgress()
+calculateEffectiveCommission()
}
SCProgressCard --> style_credits_lib : "uses"
SCProgressCard --> ranks_lib : "uses"
RankProgress --> ranks_lib : "uses"
```

**Diagram sources**
- [SCProgressCard.tsx](file://src/components/dashboard/SCProgressCard.tsx#L75-L90)
- [RankProgress.tsx](file://src/components/dashboard/RankProgress.tsx#L71-L86)
- [style-credits.ts](file://src/lib/style-credits.ts#L111-L158)
- [ranks.ts](file://src/lib/ranks.ts#L187-L221)

**Section sources**
- [SCProgressCard.tsx](file://src/components/dashboard/SCProgressCard.tsx#L1-L226)
- [RankProgress.tsx](file://src/components/dashboard/RankProgress.tsx#L1-L204)
- [style-credits.ts](file://src/lib/style-credits.ts#L1-L188)
- [ranks.ts](file://src/lib/ranks.ts#L1-L246)

## Dependency Analysis
- UI components depend on library functions for SC and rank computations.
- Libraries are cohesive and focused: style-credits.ts handles SC mechanics, ranks.ts handles rank mechanics, scoring.ts handles Stylebox evaluation math.
- No circular dependencies observed among the analyzed files.

```mermaid
graph LR
CPB["CompletionProgressBar.tsx"] --> SC_LIB["style-credits.ts"]
SRB["SCRewardBadge.tsx"] --> SC_LIB
NUH["NextUnlockHint.tsx"] --> SC_LIB
SPC["SCProgressCard.tsx"] --> SC_LIB
SPC --> RANKS_LIB["ranks.ts"]
RP["RankProgress.tsx"] --> RANKS_LIB
SCORE_LIB["scoring.ts"] --> SC_LIB
```

**Diagram sources**
- [CompletionProgressBar.tsx](file://src/components/stylebox/CompletionProgressBar.tsx#L1-L49)
- [SCRewardBadge.tsx](file://src/components/stylebox/SCRewardBadge.tsx#L1-L46)
- [NextUnlockHint.tsx](file://src/components/stylebox/NextUnlockHint.tsx#L1-L82)
- [SCProgressCard.tsx](file://src/components/dashboard/SCProgressCard.tsx#L1-L226)
- [RankProgress.tsx](file://src/components/dashboard/RankProgress.tsx#L1-L204)
- [style-credits.ts](file://src/lib/style-credits.ts#L1-L188)
- [scoring.ts](file://src/lib/scoring.ts#L1-L239)
- [ranks.ts](file://src/lib/ranks.ts#L1-L246)

**Section sources**
- [style-credits.ts](file://src/lib/style-credits.ts#L1-L188)
- [scoring.ts](file://src/lib/scoring.ts#L1-L239)
- [ranks.ts](file://src/lib/ranks.ts#L1-L246)

## Performance Considerations
- Rendering:
  - Progress bars and animations are lightweight; avoid frequent re-renders by passing memoized props.
- Computation:
  - Rank and progress calculations are constant-time lookups and arithmetic; negligible cost.
- Data fetching:
  - Ensure SC and rank data are cached to minimize repeated network requests.

## Troubleshooting Guide
- Invalid rank values:
  - Use safe accessors to prevent rendering crashes on unexpected rank keys.
- Missing next rank:
  - When at the top tier, next rank is undefined; UI should disable progress and unlock hints.
- Incorrect SC display:
  - Verify formatting helpers and ensure values are integers or properly rounded.

**Section sources**
- [RankProgress.tsx](file://src/components/dashboard/RankProgress.tsx#L77-L79)
- [ranks.ts](file://src/lib/ranks.ts#L235-L240)

## Conclusion
The Stylebox progress and rewards system integrates UI components with robust libraries to visualize SC accumulation, rank progression, and unlockable milestones. The design emphasizes clarity and motivation through progress bars, themed badges, and clear communication of next steps. The backend functions for awarding SC and computing effective commission complement the frontend to maintain a cohesive designer progression experience.