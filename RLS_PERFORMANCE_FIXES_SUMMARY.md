# RLS Performance Fixes Summary

## Overview
This document summarizes the fixes applied to address the "Auth RLS InitPlan" performance warnings detected by the Supabase linter. These warnings indicate that calls to `auth.<function>()` in Row Level Security (RLS) policies were being unnecessarily re-evaluated for each row, causing performance degradation at scale.

## Issue Description
The Supabase linter identified multiple RLS policies where `auth.uid()` and `has_role()` functions were called directly in policy expressions. This causes PostgreSQL to evaluate these functions for every row in the table during query execution, leading to suboptimal performance at scale.

## Solution Applied
According to [Supabase documentation](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select), the fix involves wrapping function calls with `(select ...)` to evaluate them once per query rather than per row:

- Changed `auth.uid()` to `(select auth.uid())`
- Changed `has_role(auth.uid(), ...)` to `has_role((select auth.uid()), ...)`

## Files Updated

### Primary Files Fixed
1. `supabase/migrations/20251209213954_141af71b-504d-4a68-a16d-b931834b1328.sql` - Main schema file with core RLS policies
2. `supabase/migrations/20251210082720_87b4e6e5-fead-49a8-9626-79133a1d0496.sql` - Publication reviews policies
3. `supabase/migrations/20260126010000_add_founding_designers_program.sql` - Founding designers policies
4. `supabase/migrations/20260127020000_teams_full_backend.sql` - Team-related policies
5. `supabase/migrations/20260127230500_enhance_portfolio_rls.sql` - Portfolio-related policies

### Specific Policy Updates
The following RLS policies were updated with the performance fix:

#### From the original warning list:
- `user_roles` table: "Admins can manage user_roles" and "Users can view own roles" policies
- `ranks` table: "Admins can manage ranks" policy  
- `profiles` table: "Users can view own profile" and "Admins can view all profiles" policies
- `user_badges` table: "Users can view own badges" and "Admins can manage badges" policies
- `publication_reviews` table: "Designers can view reviews of their publications" policy
- `styleboxes` table: "Admins can manage styleboxes" policy
- `stylebox_submissions` table: "Designers can view own submissions" and "Designers can create submissions" policies

#### Additional policies fixed:
- Team invitations and join requests policies
- Portfolio projects and assets policies
- Founding designers submissions policies
- And many other RLS policies throughout the codebase

## Performance Impact
- **Before**: Functions were evaluated for each row during query execution
- **After**: Functions are evaluated once per query execution
- **Result**: Significant performance improvement at scale, especially for large tables

## Verification
A verification script `verify_rls_performance_fixes.sql` has been created to confirm that all policies now use the optimized `(select auth.uid())` pattern instead of direct `auth.uid()` calls.

## Migration Impact
These changes only affect the RLS policy definitions in the migration files. When deployed to production, these changes will update the policy definitions in the database to use the optimized evaluation pattern. This is a non-breaking change that improves performance without affecting functionality.