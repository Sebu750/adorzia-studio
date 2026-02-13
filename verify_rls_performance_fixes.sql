-- Verification script to check if RLS performance fixes have been applied
-- This will help confirm that auth.uid() calls have been wrapped with (select ...) for better performance

-- Check for RLS policies that still use direct auth.uid() calls (these should be fixed)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE qual LIKE '%auth.uid()%' 
    AND qual NOT LIKE '%(select auth.uid%)%'
ORDER BY schemaname, tablename, policyname;

-- Check for RLS policies that still use direct has_role(auth.uid()) calls (these should be fixed)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE qual LIKE '%has_role(auth.uid%'
    AND qual NOT LIKE '%has_role((select auth.uid%)%'
ORDER BY schemaname, tablename, policyname;

-- Check for RLS policies that have been properly fixed with (select auth.uid()) pattern
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    'FIXED' as status
FROM pg_policies 
WHERE qual LIKE '%(select auth.uid%)%'
ORDER BY schemaname, tablename, policyname;

-- Summary counts
SELECT 
    'Total RLS policies' as metric,
    COUNT(*) as count
FROM pg_policies
UNION ALL
SELECT 
    'Unfixed policies (still using direct auth.uid)' as metric,
    COUNT(*) as count
FROM pg_policies 
WHERE qual LIKE '%auth.uid()%' 
    AND qual NOT LIKE '%(select auth.uid%)%'
UNION ALL
SELECT 
    'Fixed policies (using optimized (select auth.uid())' as metric,
    COUNT(*) as count
FROM pg_policies 
WHERE qual LIKE '%(select auth.uid%)%';