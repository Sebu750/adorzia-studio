# Resend Email Activation Plan

## Current State Analysis

### Edge Functions with Resend Integration
1. **submit-feedback** - Uses Resend SDK (`import { Resend } from "https://esm.sh/resend@2.0.0"`)
   - ✅ Implemented
   - From: `feedback@mail.adorzia.com`
   - Purpose: Designer feedback notifications to admin

2. **newsletter-subscribe** - Uses Resend REST API (fetch)
   - ✅ Implemented
   - From: `hello@newsletter.adorzia.com`
   - Purpose: Welcome email to newsletter subscribers

3. **send-contact** - Uses Resend SDK
   - ✅ Implemented
   - Purpose: Contact form submissions

4. **send-transactional** - Uses Resend SDK
   - ✅ Implemented
   - Purpose: Generic transactional emails

## Issues Identified

### Issue 1: Edge Functions Not Deployed
**Problem**: Settings feedback submission fails because edge functions may not be deployed to Supabase.

**Solution**: Deploy all email-enabled edge functions
```bash
npx supabase functions deploy submit-feedback --project-ref lnrhrevpouozugsarsmz
npx supabase functions deploy newsletter-subscribe --project-ref lnrhrevpouozugsarsmz
npx supabase functions deploy send-contact --project-ref lnrhrevpouozugsarsmz
npx supabase functions deploy send-transactional --project-ref lnrhrevpouozugsarsmz
```

### Issue 2: Missing RESEND_API_KEY Environment Variable
**Problem**: Edge functions require `RESEND_API_KEY` to be set in Supabase project secrets.

**Solution**: Set environment variable in Supabase Dashboard
1. Go to: Project Settings > Edge Functions > Secrets
2. Add secret: `RESEND_API_KEY` = `<your-resend-api-key>`

### Issue 3: Resend Domain Verification
**Problem**: Email sending may fail if sender domains are not verified in Resend.

**Domains to Verify**:
- `mail.adorzia.com` (for feedback)
- `newsletter.adorzia.com` (for newsletter)
- Any other domains used in `from` addresses

**Solution**: Verify domains in Resend Dashboard
1. Go to Resend Dashboard > Domains
2. Add and verify each domain with DNS records

### Issue 4: Profile Update Not Persisting
**Problem**: User reported profile updates don't persist.

**Root Cause Analysis Needed**:
1. Check RLS policies on `profiles` table
2. Verify `handleProfileUpdate` function in Settings.tsx
3. Check database triggers on `profiles` table
4. Verify `upsert` conflict resolution

## Deployment Checklist

### Phase 1: Environment Setup
- [ ] Obtain Resend API key from Resend Dashboard
- [ ] Add `RESEND_API_KEY` to Supabase Edge Function secrets
- [ ] Verify all sender domains in Resend

### Phase 2: Edge Function Deployment
- [ ] Deploy `submit-feedback` edge function
- [ ] Deploy `newsletter-subscribe` edge function
- [ ] Deploy `send-contact` edge function
- [ ] Deploy `send-transactional` edge function

### Phase 3: Testing
- [ ] Test feedback submission from Settings page
- [ ] Test newsletter subscription
- [ ] Test contact form (if exists)
- [ ] Verify emails are received
- [ ] Check `email_logs` table for records

### Phase 4: Profile Update Fix
- [ ] Review RLS policies on profiles table
- [ ] Add debug logging to `handleProfileUpdate`
- [ ] Test profile update flow
- [ ] Verify data persists in database

## Commands Reference

### Deploy Single Function
```bash
npx supabase functions deploy <function-name> --project-ref lnrhrevpouozugsarsmz
```

### Deploy All Email Functions
```bash
npx supabase functions deploy submit-feedback --project-ref lnrhrevpouozugsarsmz && \
npx supabase functions deploy newsletter-subscribe --project-ref lnrhrevpouozugsarsmz && \
npx supabase functions deploy send-contact --project-ref lnrhrevpouozugsarsmz && \
npx supabase functions deploy send-transactional --project-ref lnrhrevpouozugsarsmz
```

### View Function Logs
```bash
npx supabase functions logs <function-name> --project-ref lnrhrevpouozugsarsmz
```

## Email Sender Addresses

| Function | Sender Address | Purpose |
|----------|---------------|---------|
| submit-feedback | feedback@mail.adorzia.com | Designer feedback to admin |
| newsletter-subscribe | hello@newsletter.adorzia.com | Welcome emails |
| send-contact | contact@mail.adorzia.com | Contact form submissions |
| send-transactional | noreply@mail.adorzia.com | Generic transactional emails |

**Note**: All domains must be verified in Resend Dashboard for emails to send successfully.

## Next Steps

1. **IMMEDIATE**: Deploy edge functions to enable email functionality
2. **HIGH PRIORITY**: Set RESEND_API_KEY environment variable
3. **HIGH PRIORITY**: Verify sender domains in Resend
4. **MEDIUM PRIORITY**: Fix profile update persistence issue
5. **LOW PRIORITY**: Add email delivery monitoring/alerts

## Testing URLs

- Settings Feedback: `https://studio.adorzia.com/settings` (Feedback tab)
- Newsletter: Footer of public pages
- Contact Form: `https://adorzia.com/contact` (if exists)

---

**Status**: Plan Ready for Execution
**Next Action**: Deploy edge functions with deployment commands above
