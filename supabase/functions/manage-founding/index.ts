import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[manage-founding] Request received:', req.method, req.url)
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('[manage-founding] Missing Authorization header')
      throw new Error('Missing Authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!serviceRoleKey) {
      console.error('[manage-founding] CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not set')
      throw new Error('Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    )

    const { data: { user: requester }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !requester) {
      console.error('[manage-founding] Auth error:', userError)
      throw new Error('Unauthorized: Invalid or expired token')
    }
    console.log('[manage-founding] Request from user:', requester.id)

    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', requester.id)
      .maybeSingle()

    if (roleError) {
      console.error('[manage-founding] Role check error:', roleError)
      throw new Error('Could not verify user role')
    }

    console.log('[manage-founding] User role:', roleData?.role)
    const isAdmin = roleData?.role === 'admin' || roleData?.role === 'superadmin'
    if (!isAdmin) {
      console.error('[manage-founding] Forbidden: user does not have admin role')
      throw new Error('Forbidden: Admin access required')
    }

    const body = await req.json()
    const { action, submissionId, designerId, feedback, internalNotes, rejectionReason, tier, assignTitle } = body
    console.log('[manage-founding] Action:', action, 'SubmissionId:', submissionId)

    if (!action || !submissionId) {
      console.error('[manage-founding] Missing required parameters:', { action, submissionId })
      throw new Error('Missing required parameters: action and submissionId')
    }

    let result = {}

    switch (action) {
      case 'approve':
        console.log('[manage-founding] Processing approval for submission:', submissionId)
        // Update submission status - the database trigger will handle profile promotion
        const { error: subError } = await supabaseAdmin
          .from('founding_designers_submissions')
          .update({
            status: 'approved',
            admin_feedback: feedback,
            internal_notes: internalNotes,
            reviewed_at: new Date().toISOString(),
            reviewed_by: requester.id
          })
          .eq('id', submissionId)
        if (subError) {
          console.error('[manage-founding] Approval submission update error:', subError)
          throw subError
        }

        // Store tier preference in profile (trigger will set is_founding_designer = true)
        if (designerId) {
          const { error: profError } = await supabaseAdmin
            .from('profiles')
            .update({
              founder_tier: tier ?? 'standard'
            })
            .eq('user_id', designerId)
          if (profError) {
            console.warn('[manage-founding] Could not update founder_tier:', profError)
          }
        } else {
          console.warn('[manage-founding] No designerId provided for tier assignment')
        }

        console.log('[manage-founding] Approval completed successfully')
        result = { success: true, message: 'Submission approved and designer promoted' }
        break

      case 'reject':
        console.log('[manage-founding] Processing rejection for submission:', submissionId)
        if (!rejectionReason) {
          console.error('[manage-founding] Rejection reason is required')
          throw new Error('Rejection reason is required')
        }
        const { error: rejError } = await supabaseAdmin
          .from('founding_designers_submissions')
          .update({
            status: 'rejected',
            admin_feedback: feedback,
            internal_notes: internalNotes,
            rejection_reason: rejectionReason,
            reviewed_at: new Date().toISOString(),
            reviewed_by: requester.id
          })
          .eq('id', submissionId)
        if (rejError) {
          console.error('[manage-founding] Rejection update error:', rejError)
          throw rejError
        }
        console.log('[manage-founding] Rejection completed successfully')
        result = { success: true, message: 'Submission rejected' }
        break

      case 'feedback':
        console.log('[manage-founding] Sending feedback for submission:', submissionId)
        const { error: feedError } = await supabaseAdmin
          .from('founding_designers_submissions')
          .update({
            status: 'revisions_required',
            admin_feedback: feedback,
            internal_notes: internalNotes,
            reviewed_at: new Date().toISOString(),
            reviewed_by: requester.id
          })
          .eq('id', submissionId)
        if (feedError) {
          console.error('[manage-founding] Feedback update error:', feedError)
          throw feedError
        }
        console.log('[manage-founding] Feedback sent successfully')
        result = { success: true, message: 'Feedback sent to designer' }
        break

      case 'mark_review':
        console.log('[manage-founding] Marking as under review:', submissionId)
        const { error: markError } = await supabaseAdmin
          .from('founding_designers_submissions')
          .update({ status: 'under_review' })
          .eq('id', submissionId)
        if (markError) {
          console.error('[manage-founding] Mark review error:', markError)
          throw markError
        }
        console.log('[manage-founding] Marked as under review successfully')
        result = { success: true, message: 'Marked as under review' }
        break

      default:
        console.error('[manage-founding] Invalid action:', action)
        throw new Error(`Invalid action: ${action}`)
    }

    console.log('[manage-founding] Request completed successfully')
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('[manage-founding] Request failed with error:', error.message, error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
