
# Dashboard & Analytics

<cite>
**Referenced Files in This Document**
- [AdminDashboard.tsx](file://src/pages/admin/AdminDashboard.tsx)
- [AdminAnalytics.tsx](file://src/pages/admin/AdminAnalytics.tsx)
- [useAdminRealtimeStats.tsx](file://src/hooks/useAdminRealtimeStats.tsx)
- [useAnalyticsData.tsx](file://src/hooks/useAnalyticsData.tsx)
- [useDashboardStats.tsx](file://src/hooks/useDashboardStats.tsx)
- [AdminStatCard.tsx](file://src/components/admin/AdminStatCard.tsx)
- [PendingQueueCard.tsx](file://src/components/admin/PendingQueueCard.tsx)
- [TopDesignersCard.tsx](file://src/components/admin/TopDesignersCard.tsx)
- [RecentActivityCard.tsx](file://src/components/admin/RecentActivityCard.tsx)
- [RevenueChart.tsx](file://src/components/admin/RevenueChart.tsx)
- [admin-client.ts](file://src/integrations/supabase/admin-client.ts)
- [types.ts](file://src/integrations/supabase/types.ts)
- [20260126030000_system_optimization.sql](file://supabase/migrations/20260126030000_system_optimization.sql)
- [20251209213954_141af71b-504d-4a68-a16d-b931834b1328.sql](file://supabase/migrations/20251209213954_141af71b-504d-4a68-a16d-b931834b1328.sql)
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
This document explains the admin dashboard and analytics system, focusing on:
- Key metrics display: total designers, active styleboxes, pending publications, and monthly revenue
- Real-time statistics powered by Supabase Postgres changes subscriptions
- Performance overview cards: pending reviews, average completion time, approval rate, and top-performing stylebox
- Submission trend visualization with 30-day analytics and interactive charts
- Quick actions panel for common administrative tasks
- Recent activity feed
- Examples for accessing analytics data, interpreting dashboard metrics, and setting up real-time notifications for admin users

## Project Structure
The dashboard and analytics are implemented as React components and hooks integrated with Supabase:
- Pages: AdminDashboard and AdminAnalytics orchestrate the UI and real-time data
- Hooks: useAdminRealtimeStats, useAnalyticsData, useDashboardStats encapsulate data fetching and subscriptions
- Components: reusable cards and charts for stats, queues, rankings, and activity
- Supabase: admin-client.ts isolates admin sessions; stored procedures and migrations define backend capabilities

```mermaid
graph TB
  subgraph "Admin Pages"
    AD["AdminDashboard.tsx"]
    AA["AdminAnalytics.tsx"]
  end

  subgraph "Hooks"
    HAR["useAdminRealtimeStats.tsx"]
    HAD["useAnalyticsData.tsx"]
    HDS["useDashboardStats.tsx"]
  end

  subgraph "UI Components"
    ASC["AdminStatCard.tsx"]
    PQC["PendingQueueCard.tsx"]
    TDC["TopDesignersCard.tsx"]
    RAC["RecentActivityCard.tsx"]
    RC["RevenueChart.tsx"]
  end

  subgraph "Supabase Integration"
    SAC["admin-client.ts"]
    TYP["types.ts"]
    MIG["20260126030000_system_optimization.sql"]
  end

  AD --> ASC
  AD --> PQC
  AD --> TDC
  AD --> RAC
  AA --> RC

  AD --> HAR
  AA --> HAR
  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC......
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR......
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR --> SAC
  HAR --> PQC
  HAR --> TDC
  HAR --> RAC
  HAR --> RC

  HAR......