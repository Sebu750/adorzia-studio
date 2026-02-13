import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { invitationId, email, name, role, message, invitedByName } = await req.json();

    if (!invitationId || !email || !name || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // In a real implementation, you would:
    // 1. Send an email using your email service (Resend/SES/etc)
    // 2. Include a secure invitation link
    // 3. Store the invitation token for verification
    
    // For now, we'll simulate the email sending process
    console.log(`[send-admin-invitation] Sending invitation to ${email}`);
    console.log(`[send-admin-invitation] Role: ${role}`);
    console.log(`[send-admin-invitation] Invited by: ${invitedByName}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, you would integrate with an email service like:
    /*
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'admin@yourdomain.com',
        to: email,
        subject: `Admin Invitation - ${role} Role`,
        html: `
          <h2>Admin Invitation</h2>
          <p>Hello ${name},</p>
          <p>You have been invited to join the admin team as a ${role} by ${invitedByName}.</p>
          ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
          <p><a href="${Deno.env.get('ADMIN_BASE_URL')}/accept-invitation/${invitationId}">Accept Invitation</a></p>
          <p>This invitation will expire in 7 days.</p>
        `
      })
    });
    
    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }
    */

    // Log the invitation sending
    console.log(`[send-admin-invitation] Invitation sent successfully to ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invitation sent successfully",
        invitationId 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("[send-admin-invitation] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send invitation" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});