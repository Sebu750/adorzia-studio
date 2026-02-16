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
    console.log('[broadcast-notification] Request received')
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('[broadcast-notification] Missing Authorization header')
      throw new Error('Missing Authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!serviceRoleKey) {
      console.error('[broadcast-notification] CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not set')
      throw new Error('Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    )

    // Verify admin authentication
    const { data: { user: requester }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !requester) {
      console.error('[broadcast-notification] Auth error:', userError)
      throw new Error('Unauthorized: Invalid or expired token')
    }

    // Verify admin role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', requester.id)
      .maybeSingle()

    if (roleError) {
      console.error('[broadcast-notification] Role check error:', roleError)
      throw new Error('Could not verify user role')
    }

    // MVP: Single role - superadmin only
    const isSuperadmin = roleData?.role === 'superadmin'
    if (!isSuperadmin) {
      console.error('[broadcast-notification] Forbidden: user is not superadmin')
      throw new Error('Forbidden: Superadmin access required')
    }

    const body = await req.json()
    const { type, message, title } = body

    if (!type || !message) {
      console.error('[broadcast-notification] Missing required fields:', { type, message })
      throw new Error('Missing required fields: type and message')
    }

    console.log('[broadcast-notification] Broadcasting notification:', { type, messageLength: message.length })

    // Fetch all active users (with a reasonable limit to prevent timeouts)
    const { data: users, error: usersError } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .limit(1000)

    if (usersError) {
      console.error('[broadcast-notification] Error fetching users:', usersError)
      throw usersError
    }

    if (!users || users.length === 0) {
      console.warn('[broadcast-notification] No users found to notify')
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No users to notify',
        count: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Create notification records for all users
    // Note: notifications table has columns: id, user_id, type, message, status, created_at
    // Title is included in metadata since the table doesn't have a title column
    const notifications = users.map(u => ({
      user_id: u.user_id,
      type: type,
      message: message,
      status: 'unread',
      metadata: {
        sent_by: requester.id,
        sent_at: new Date().toISOString(),
        broadcast: true,
        title: title || 'System Notification'
      }
    }))

    console.log('[broadcast-notification] Inserting', notifications.length, 'notifications')

    // Insert in batches of 100 to avoid payload size limits
    const batchSize = 100
    let totalInserted = 0
    for (let i = 0; i < notifications.length; i += batchSize) {
      const batch = notifications.slice(i, i + batchSize)
      const { error: insertError } = await supabaseAdmin
        .from('notifications')
        .insert(batch)

      if (insertError) {
        console.error('[broadcast-notification] Batch insert error:', insertError)
        throw insertError
      }
      totalInserted += batch.length
      console.log('[broadcast-notification] Inserted batch:', totalInserted, '/', notifications.length)
    }

    console.log('[broadcast-notification] Broadcast complete:', totalInserted, 'notifications sent')

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Broadcast notification sent successfully',
      count: totalInserted 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('[broadcast-notification] Request failed:', error.message, error)
    // Return appropriate HTTP status codes
    let status = 500
    if (error.message?.includes('Forbidden')) status = 403
    else if (error.message?.includes('Unauthorized')) status = 401
    else if (error.message?.includes('required')) status = 400
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: status,
    })
  }
})
