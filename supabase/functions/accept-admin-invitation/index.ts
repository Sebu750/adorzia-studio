import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { invitationId, email, password } = await req.json();

    if (!invitationId || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Verify the invitation exists and is valid
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('admin_invitations')
      .select('*')
      .eq('id', invitationId)
      .eq('email', email)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (invitationError) {
      console.error('[accept-admin-invitation] Invitation lookup error:', invitationError);
      throw new Error('Invalid invitation');
    }

    if (!invitation) {
      throw new Error('Invitation not found or expired');
    }

    // 2. Create the admin user account
    const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: invitation.email,
      password: password,
      email_confirm: true,
      user_metadata: { 
        name: invitation.name,
        invited_by: invitation.invited_by
      }
    });

    if (createUserError) {
      console.error('[accept-admin-invitation] User creation error:', createUserError);
      throw new Error('Failed to create admin account');
    }

    // 3. Assign the role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: invitation.role
      });

    if (roleError) {
      console.error('[accept-admin-invitation] Role assignment error:', roleError);
      throw new Error('Failed to assign role');
    }

    // 4. Create admin profile
    const { error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .insert({
        user_id: newUser.user.id,
        name: invitation.name,
        email: invitation.email
      });

    if (profileError) {
      console.error('[accept-admin-invitation] Profile creation error:', profileError);
      // Don't fail completely if profile creation fails
    }

    // 5. Update invitation status
    await supabaseAdmin
      .from('admin_invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', invitationId);

    // 6. Log the acceptance
    await supabaseAdmin.from('admin_logs').insert({
      admin_id: invitation.invited_by,
      action: 'invitation_accepted',
      target_type: 'admin_invitation',
      target_id: invitationId,
      details: { 
        new_admin_id: newUser.user.id,
        email: invitation.email,
        role: invitation.role
      }
    });

    console.log(`[accept-admin-invitation] Admin ${invitation.email} accepted invitation as ${invitation.role}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invitation accepted successfully",
        userId: newUser.user.id,
        role: invitation.role
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("[accept-admin-invitation] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to accept invitation" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});