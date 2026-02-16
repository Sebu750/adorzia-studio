import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[manage-team] Request received:', req.method, req.url)
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('[manage-team] Missing Authorization header')
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create client with user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Create admin client
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!serviceRoleKey) {
      console.error('[manage-team] CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not set')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    )

    // Get authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      console.error('[manage-team] Auth error:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    console.log('[manage-team] Request from user:', user.id)

    // Parse request body
    let requestBody
    try {
      requestBody = await req.json()
      console.log('[manage-team] Request body:', JSON.stringify(requestBody))
    } catch (parseError) {
      console.error('[manage-team] Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, ...payload } = requestBody
    console.log(`[manage-team] Action: ${action}, User: ${user.id}`)

    if (!action) {
      console.error('[manage-team] Missing action in request')
      return new Response(
        JSON.stringify({ error: 'Missing action parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    switch (action) {
      case 'create': {
        const { name, description, category, max_members, is_open } = payload

        if (!name || name.trim().length < 3) {
          return new Response(
            JSON.stringify({ error: 'Team name must be at least 3 characters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check user's rank - must be Rank 3 (Stylist) or higher to create teams
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select('ranks(rank_order)')
          .eq('user_id', user.id)
          .single()

        if (profileError) {
          console.error('[manage-team] Profile fetch error:', JSON.stringify(profileError))
          return new Response(
            JSON.stringify({ error: 'Failed to fetch user profile' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const userRankOrder = (profile?.ranks as any)?.rank_order || 0
        console.log('[manage-team] User rank order:', userRankOrder)

        if (userRankOrder < 3) {
          return new Response(
            JSON.stringify({ 
              error: 'Rank requirement not met', 
              details: 'You must be Rank 3 (Stylist) or higher to create a team',
              required_rank: 'Stylist (F3)',
              current_rank_order: userRankOrder
            }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check if user is already in a team
        const { data: existingMembership } = await supabaseAdmin
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (existingMembership) {
          return new Response(
            JSON.stringify({ error: 'You are already a member of a team' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Create team
        const { data: team, error: teamError } = await supabaseAdmin
          .from('teams')
          .insert({
            name: name.trim(),
            description: description?.trim() || null,
            category: category || 'fashion',
            max_members: max_members || 5,
            is_open: is_open !== false,
            created_by: user.id,
          })
          .select()
          .single()

        if (teamError) {
          console.error('[manage-team] Create team error:', JSON.stringify(teamError))
          return new Response(
            JSON.stringify({ 
              error: 'Failed to create team', 
              details: teamError.message || 'Database error',
              code: teamError.code 
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log('[manage-team] Team created successfully:', team.id)

        // Add creator as team lead
        const { error: memberError } = await supabaseAdmin
          .from('team_members')
          .insert({
            team_id: team.id,
            user_id: user.id,
            role: 'lead',
          })

        if (memberError) {
          console.error('[manage-team] Add lead error:', JSON.stringify(memberError))
          // Rollback - delete team
          await supabaseAdmin.from('teams').delete().eq('id', team.id)
          return new Response(
            JSON.stringify({ 
              error: 'Failed to add team leader', 
              details: memberError.message || 'Database error',
              code: memberError.code 
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Send notification
        await supabaseAdmin.from('notifications').insert({
          user_id: user.id,
          type: 'system',
          title: 'Team Created',
          message: `Your team "${team.name}" has been created successfully!`,
        })

        console.log(`[manage-team] Team created: ${team.id}`)
        return new Response(
          JSON.stringify({ success: true, team }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'invite': {
        const { team_id, invitee_id, message } = payload

        // Verify user is team lead
        const { data: membership } = await supabaseAdmin
          .from('team_members')
          .select('role')
          .eq('team_id', team_id)
          .eq('user_id', user.id)
          .maybeSingle()

        if (!membership || membership.role !== 'lead') {
          return new Response(
            JSON.stringify({ error: 'Only team leads can send invitations' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check if invitee is already in a team
        const { data: inviteeMembership } = await supabaseAdmin
          .from('team_members')
          .select('team_id')
          .eq('user_id', invitee_id)
          .maybeSingle()

        if (inviteeMembership) {
          return new Response(
            JSON.stringify({ error: 'User is already in a team' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Create invitation
        const { data: invitation, error: inviteError } = await supabaseAdmin
          .from('team_invitations')
          .insert({
            team_id,
            inviter_id: user.id,
            invitee_id,
            message,
          })
          .select()
          .single()

        if (inviteError) {
          console.error('[manage-team] Invite error:', inviteError)
          throw inviteError
        }

        // Get team info for notification
        const { data: team } = await supabaseAdmin
          .from('teams')
          .select('name')
          .eq('id', team_id)
          .single()

        // Send notification to invitee
        await supabaseAdmin.from('notifications').insert({
          user_id: invitee_id,
          type: 'team',
          title: 'Team Invitation',
          message: `You've been invited to join "${team?.name || 'a team'}"`,
          metadata: { invitation_id: invitation.id, team_id },
        })

        console.log(`[manage-team] Invitation sent: ${invitation.id}`)
        return new Response(
          JSON.stringify({ success: true, invitation }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'respond_invitation': {
        const { invitation_id, accept } = payload

        // Get invitation
        const { data: invitation, error: invError } = await supabaseAdmin
          .from('team_invitations')
          .select('*, teams(name, max_members)')
          .eq('id', invitation_id)
          .eq('invitee_id', user.id)
          .eq('status', 'pending')
          .single()

        if (invError || !invitation) {
          return new Response(
            JSON.stringify({ error: 'Invitation not found or already responded' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const newStatus = accept ? 'accepted' : 'declined'

        // Update invitation status
        await supabaseAdmin
          .from('team_invitations')
          .update({
            status: newStatus,
            responded_at: new Date().toISOString(),
          })
          .eq('id', invitation_id)

        if (accept) {
          // Check team capacity
          const { count: memberCount } = await supabaseAdmin
            .from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', invitation.team_id)

          const maxMembers = (invitation.teams as any)?.max_members || 5

          if (memberCount && memberCount >= maxMembers) {
            return new Response(
              JSON.stringify({ error: 'Team is full' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Add user to team
          await supabaseAdmin.from('team_members').insert({
            team_id: invitation.team_id,
            user_id: user.id,
            role: 'member',
          })

          // Notify inviter
          await supabaseAdmin.from('notifications').insert({
            user_id: invitation.inviter_id,
            type: 'team',
            title: 'Invitation Accepted',
            message: `Your team invitation was accepted!`,
          })
        }

        console.log(`[manage-team] Invitation ${newStatus}: ${invitation_id}`)
        return new Response(
          JSON.stringify({ success: true, status: newStatus }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'join_request': {
        const { team_id, message } = payload

        // Check if user can join
        const { data: canJoin } = await supabaseAdmin
          .rpc('can_join_team', { team_uuid: team_id, user_uuid: user.id })

        if (!canJoin) {
          return new Response(
            JSON.stringify({ error: 'Cannot join this team (full, already member, or in another team)' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Create join request
        const { data: request, error: reqError } = await supabaseAdmin
          .from('team_join_requests')
          .insert({
            team_id,
            user_id: user.id,
            message,
          })
          .select()
          .single()

        if (reqError) {
          console.error('[manage-team] Join request error:', reqError)
          throw reqError
        }

        // Notify team lead
        const { data: lead } = await supabaseAdmin
          .from('team_members')
          .select('user_id')
          .eq('team_id', team_id)
          .eq('role', 'lead')
          .single()

        if (lead) {
          await supabaseAdmin.from('notifications').insert({
            user_id: lead.user_id,
            type: 'team',
            title: 'New Join Request',
            message: `Someone wants to join your team`,
            metadata: { request_id: request.id, team_id },
          })
        }

        console.log(`[manage-team] Join request created: ${request.id}`)
        return new Response(
          JSON.stringify({ success: true, request }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'respond_request': {
        const { request_id, approve } = payload

        // Get request and verify user is team lead
        const { data: request, error: reqError } = await supabaseAdmin
          .from('team_join_requests')
          .select('*, teams(max_members)')
          .eq('id', request_id)
          .eq('status', 'pending')
          .single()

        if (reqError || !request) {
          return new Response(
            JSON.stringify({ error: 'Request not found or already responded' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verify user is team lead
        const { data: membership } = await supabaseAdmin
          .from('team_members')
          .select('role')
          .eq('team_id', request.team_id)
          .eq('user_id', user.id)
          .maybeSingle()

        if (!membership || membership.role !== 'lead') {
          return new Response(
            JSON.stringify({ error: 'Only team leads can respond to join requests' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const newStatus = approve ? 'approved' : 'rejected'

        // Update request status
        await supabaseAdmin
          .from('team_join_requests')
          .update({
            status: newStatus,
            responded_at: new Date().toISOString(),
            responded_by: user.id,
          })
          .eq('id', request_id)

        if (approve) {
          // Check team capacity
          const { count: memberCount } = await supabaseAdmin
            .from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', request.team_id)

          const maxMembers = (request.teams as any)?.max_members || 5

          if (memberCount && memberCount >= maxMembers) {
            return new Response(
              JSON.stringify({ error: 'Team is full' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Add user to team
          await supabaseAdmin.from('team_members').insert({
            team_id: request.team_id,
            user_id: request.user_id,
            role: 'member',
          })
        }

        // Notify requester
        await supabaseAdmin.from('notifications').insert({
          user_id: request.user_id,
          type: 'team',
          title: approve ? 'Join Request Approved' : 'Join Request Declined',
          message: approve ? 'Your join request was approved!' : 'Your join request was declined',
        })

        console.log(`[manage-team] Join request ${newStatus}: ${request_id}`)
        return new Response(
          JSON.stringify({ success: true, status: newStatus }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'leave': {
        const { team_id } = payload

        // Get user's membership
        const { data: membership } = await supabaseAdmin
          .from('team_members')
          .select('role')
          .eq('team_id', team_id)
          .eq('user_id', user.id)
          .single()

        if (!membership) {
          return new Response(
            JSON.stringify({ error: 'Not a member of this team' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // If lead, check if there are other members
        if (membership.role === 'lead') {
          const { count } = await supabaseAdmin
            .from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', team_id)

          if (count && count > 1) {
            return new Response(
              JSON.stringify({ error: 'Team lead must transfer leadership or remove all members before leaving' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Delete team if lead is leaving and no other members
          await supabaseAdmin.from('teams').delete().eq('id', team_id)
        } else {
          // Remove member
          await supabaseAdmin
            .from('team_members')
            .delete()
            .eq('team_id', team_id)
            .eq('user_id', user.id)
        }

        console.log(`[manage-team] User left team: ${team_id}`)
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('[manage-team] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
