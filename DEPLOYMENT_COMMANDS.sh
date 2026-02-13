#!/bin/bash
# Adorzia Founding Designers Backend Deployment Commands
# Run these commands in sequence to deploy the updated edge functions and migrations

set -e  # Exit on error

PROJECT_REF="lnrhrevpouozugsarsmz"

echo "=== Step 1: Deploy Edge Functions ==="
echo "Deploying manage-founding function..."
npx supabase functions deploy manage-founding --project-ref $PROJECT_REF

echo ""
echo "Deploying manage-admin function..."
npx supabase functions deploy manage-admin --project-ref $PROJECT_REF

echo ""
echo "=== Step 2: Apply Storage Policy Migration ==="
echo "Pushing database migrations to production..."
npx supabase db push --project-ref $PROJECT_REF

echo ""
echo "=== Step 3: Verification ==="
echo "Testing manage-founding function..."
curl -X POST "https://${PROJECT_REF}.supabase.co/functions/v1/manage-founding" \
  -H "Authorization: Bearer YOUR_ANON_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"action":"test"}' \
  || echo "Note: Test request failed (expected if not authenticated)"

echo ""
echo "=== Deployment Complete ==="
echo "Next steps:"
echo "1. Test admin approve/reject flow in production"
echo "2. Check function logs in Supabase Dashboard → Edge Functions"
echo "3. Verify storage policy in Supabase Dashboard → Storage → Policies"
