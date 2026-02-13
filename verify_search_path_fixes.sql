-- Verification script to check if all functions have proper search_path settings
-- This will help confirm that the security vulnerabilities have been resolved

-- Check for functions that still have mutable search_path (missing SET search_path)
SELECT 
    n.nspname AS schema_name,
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition,
    CASE 
        WHEN pg_get_functiondef(p.oid) ILIKE '%SET search_path%' THEN 'FIXED'
        ELSE 'STILL VULNERABLE'
    END AS status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND (p.prokind = 'f' OR p.prokind = 'p') -- functions and procedures
    AND p.proname IN (
        'handle_updated_at',
        'get_designer_stats', 
        'generate_certificate_number',
        'generate_serial_number',
        'find_similar_products',
        'can_join_team',
        'bootstrap_superadmin',
        'update_user_visual_preferences',
        'get_admin_dashboard_stats',
        'sync_founding_status',
        'update_founding_submissions_updated_at',
        'increment_team_completed_challenges',
        'notify_submission_reviewed',
        'get_personalized_recommendations',
        'get_team_stats',
        'generate_verification_code',
        'update_portfolio_projects_updated_at'
    )
ORDER BY p.proname;

-- Alternative check for SECURITY DEFINER functions without search_path
SELECT 
    n.nspname AS schema_name,
    p.proname AS function_name,
    p.prosecdef AS security_definer,
    p.proconfig AS config_settings,
    CASE 
        WHEN p.proconfig IS NULL THEN 'MISSING search_path SETTING'
        WHEN p.proconfig::text ILIKE '%search_path%' THEN 'HAS search_path SETTING'
        ELSE 'MISSING search_path SETTING'
    END AS search_path_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND p.prosecdef = true  -- SECURITY DEFINER functions
ORDER BY p.proname;