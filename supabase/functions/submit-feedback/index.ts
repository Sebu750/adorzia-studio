import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY_FEEDBACK");
if (!resendApiKey) {
  console.error("RESEND_API_KEY_FEEDBACK not configured");
  throw new Error("RESEND_API_KEY_FEEDBACK not configured");
}

const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRequest {
  user_name: string;
  user_role: "designer" | "founder";
  category: "bug" | "ux" | "feature" | "other";
  message: string;
}

const categoryLabels: Record<string, string> = {
  bug: "🐛 Bug Report",
  ux: "🎨 UX Issue",
  feature: "✨ Feature Request",
  other: "📝 Other",
};

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User authentication failed:", userError);
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse and validate the request body
    const body: FeedbackRequest = await req.json();
    const { user_name, user_role, category, message } = body;

    // Validate required fields
    if (!user_name || !user_role || !category || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate field values
    if (!["designer", "founder"].includes(user_role)) {
      return new Response(
        JSON.stringify({ error: "Invalid user role" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!["bug", "ux", "feature", "other"].includes(category)) {
      return new Response(
        JSON.stringify({ error: "Invalid category" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Message too long (max 2000 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Received feedback from ${user_name} (${user_role}): ${category}`);

    // Insert feedback into database using service role for reliability
    const supabaseServiceRole = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: feedbackData, error: insertError } = await supabaseServiceRole
      .from("user_feedback")
      .insert({
        user_id: user.id,
        user_name,
        user_role,
        category,
        message,
        email_sent: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to insert feedback:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save feedback" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Feedback saved to database:", feedbackData.id);

    // Send email notification
    let emailSent = false;
    let emailResponse: any = null;
    let emailErrorMsg: string | null = null;
    const emailSubject = `[Adorzia Feedback] ${categoryLabels[category]} from ${user_name}`;
    const adminEmail = "haseeb.49251@gmail.com";

    try {
      const timestamp = new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Karachi",
      });

      emailResponse = await resend.emails.send({
        from: "Adorzia Feedback <feedback@mail.adorzia.com>",
        to: [adminEmail],
        subject: emailSubject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .header h1 { margin: 0; font-size: 24px; }
              .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 12px; font-size: 14px; margin-top: 8px; }
              .content { background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; }
              .field { margin-bottom: 16px; }
              .label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
              .value { margin-top: 4px; font-size: 16px; color: #111827; }
              .message-box { background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 8px; white-space: pre-wrap; }
              .footer { background: #f3f4f6; padding: 16px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; font-size: 12px; color: #6b7280; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>ADORZIA FEEDBACK</h1>
                <div class="badge">${categoryLabels[category]}</div>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">From</div>
                  <div class="value">${user_name}</div>
                </div>
                <div class="field">
                  <div class="label">Role</div>
                  <div class="value">${user_role.charAt(0).toUpperCase() + user_role.slice(1)}</div>
                </div>
                <div class="field">
                  <div class="label">Category</div>
                  <div class="value">${categoryLabels[category]}</div>
                </div>
                <div class="field">
                  <div class="label">Message</div>
                  <div class="message-box">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
                </div>
              </div>
              <div class="footer">
                <p>Submitted: ${timestamp} (PKT)</p>
                <p>User ID: ${user.id}</p>
                <p>Feedback ID: ${feedbackData.id}</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log("Email sent successfully:", emailResponse);
      emailSent = true;

      // Update email_sent flag
      await supabaseServiceRole
        .from("user_feedback")
        .update({ email_sent: true })
        .eq("id", feedbackData.id);

    } catch (err: any) {
      emailErrorMsg = err?.message || "Unknown email error";
      console.error("Failed to send email notification:", err);
      // Don't fail the request if email fails - feedback is still saved
    }

    // Log email to email_logs table
    try {
      await supabaseServiceRole.from("email_logs").insert({
        subdomain: "feedback",
        email_type: "feedback_notification",
        from_address: "feedback@mail.adorzia.com",
        to_address: adminEmail,
        subject: emailSubject,
        status: emailSent ? "sent" : "failed",
        resend_id: emailResponse?.id || null,
        error_message: emailErrorMsg,
        metadata: {
          feedback_id: feedbackData.id,
          user_id: user.id,
          category,
          user_role,
        },
      });
      console.log("Email logged to email_logs table");
    } catch (logError) {
      console.error("Failed to log email:", logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        feedback_id: feedbackData.id,
        email_sent: emailSent,
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: unknown) {
    console.error("Error in submit-feedback function:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
