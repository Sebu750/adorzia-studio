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

    console.log(`Role data for ${requester.id}:`, roleData)

    // MVP: Single role - superadmin only
    const isSuperadmin = roleData?.role === 'superadmin'

    if (!isSuperadmin) {
      console.error(`User ${requester.id} is not superadmin. Found role:`, roleData?.role)
      throw new Error('Forbidden: Superadmin access required')
    }

    const body = await req.json().catch(() => ({}))
    const { action, targetUserId, password, email, name, avatar_url } = body

    if (!action || !targetUserId) {
      throw new Error('Action and targetUserId are required')
    }

    // Superadmin can update any account including their own

    let result = {}

    console.log(`Processing admin action: ${action} for user: ${targetUserId}`)
    console.log(`Requester: ${requester.id}, isSuperadmin: ${isSuperadmin}`)

    switch (action) {
      case 'update_auth':
        let authUser = null;
        
        // Only update auth if there are auth fields to update
        const updateData: any = {}
        if (password) updateData.password = password
        if (email) updateData.email = email
        
        if (Object.keys(updateData).length > 0) {
          console.log(`Updating auth user ${targetUserId} with fields:`, Object.keys(updateData))
          
          const { data: userData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            targetUserId,
            updateData
          )
          if (authError) {
            console.error('Auth update error:', authError)
            throw new Error(`Auth update failed: ${authError.message}`)
          }
          authUser = userData;
        } else {
          console.log('No auth fields to update, skipping auth update')
          // Get the current user data if we're only updating profile
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(targetUserId);
          authUser = userData;
        }
        
        // Update or create profile in admin_profiles using upsert
        const profileData: any = { 
          user_id: targetUserId,
          updated_at: new Date().toISOString() 
        }
        if (email) profileData.email = email
        if (name) profileData.name = name
        if (avatar_url !== undefined) profileData.avatar_url = avatar_url
        
        console.log(`Upserting admin_profiles for ${targetUserId} with fields:`, Object.keys(profileData))
        
        // Use upsert to create or update the admin_profiles record
        const { error: profileError } = await supabaseAdmin
          .from('admin_profiles')
          .upsert(profileData, { 
            onConflict: 'user_id',
            ignoreDuplicates: false 
          })
        
        if (profileError) {
          console.warn('Could not upsert admin_profiles:', profileError)
          // Don't throw error here as this is just a warning for profile update
        }

        result = { success: true, user: authUser }
        break

      case 'create_admin':
        // MVP: Create new superadmin only
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name, role: 'superadmin' }
        })
        if (createError) throw createError

        await supabaseAdmin.from('user_roles').insert({ user_id: newUser.user.id, role: 'superadmin' })
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
    // Return 500 for server errors, 403 for permission errors, 400 for bad requests
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
