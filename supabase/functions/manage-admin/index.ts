import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!serviceRoleKey) {
      console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not set in Edge Function secrets')
      throw new Error('Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    )

    // 1. Get the user making the request
    const { data: { user: requester }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !requester) {
      console.error('Auth error - could not get user from token:', userError)
      throw new Error('Unauthorized: Invalid or expired token')
    }

    // 2. Check role using the ADMIN client (bypassing RLS) to ensure we can see the role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', requester.id)
      .maybeSingle()

    if (roleError) {
      console.error('Role check error:', roleError)
      throw new Error('Could not verify user role')
    }

    const isAdmin = roleData?.role === 'admin' || roleData?.role === 'superadmin'
    const isSuperadmin = roleData?.role === 'superadmin'

    if (!isAdmin) {
      throw new Error('Forbidden: Admin access required')
    }

    const body = await req.json().catch(() => ({}))
    const { action, targetUserId, password, email, name } = body

    if (!action || !targetUserId) {
      throw new Error('Action and targetUserId are required')
    }

    // 3. Security: Standard admins can only update THEMSELVES. Superadmins can update anyone.
    if (!isSuperadmin && requester.id !== targetUserId) {
      throw new Error('Forbidden: Only superadmins can update other accounts')
    }

    let result = {}

    console.log(`Processing admin action: ${action} for user: ${targetUserId}`)

    switch (action) {
      case 'update_auth':
        const updateData: any = {}
        if (password) updateData.password = password
        if (email) updateData.email = email
        
        // Update auth user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
          targetUserId,
          updateData
        )
        if (authError) throw authError
        
        // Update profile in admin_profiles
        const { error: profileError } = await supabaseAdmin
          .from('admin_profiles')
          .update({ 
            email: email ?? undefined,
            name: name ?? undefined,
            updated_at: new Date().toISOString() 
          })
          .eq('user_id', targetUserId)
        
        if (profileError) {
          console.warn('Could not update admin_profiles, trying standard profiles fallback')
          await supabaseAdmin.from('profiles').update({ email, name }).eq('user_id', targetUserId)
        }

        result = { success: true, user: authUser }
        break

      case 'create_admin':
        if (!isSuperadmin) throw new Error('Only superadmins can create new admins')
        
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name }
        })
        if (createError) throw createError

        await supabaseAdmin.from('user_roles').insert({ user_id: newUser.user.id, role: 'admin' })
        await supabaseAdmin.from('admin_profiles').insert({
          user_id: newUser.user.id,
          email,
          name
        })

        result = { success: true, userId: newUser.user.id }
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Edge Function Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
