import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminEmailRequest {
  template: 'welcome' | 'announcement' | 'alert' | 'custom';
  to: string | string[];
  subject: string;
  content: string;
  targetType?: 'individual' | 'all';
}

const emailTemplates: Record<string, (data: any) => string> = {
  welcome: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Adorzia</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
        .content { padding: 40px 30px; }
        .content h2 { color: #667eea; font-size: 22px; margin-top: 0; }
        .content p { font-size: 16px; color: #555; margin-bottom: 20px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { font-size: 14px; color: #6b7280; margin: 5px 0; }
        .social-links { margin-top: 20px; }
        .social-links a { display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Adorzia</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your creative journey starts here</p>
        </div>
        <div class="content">
          <h2>Hello ${data.name || 'Designer'}!</h2>
          <p>We're thrilled to have you join our community of creative professionals. Adorzia is your platform to showcase your work, collaborate with teams, and grow your career.</p>
          <p>${data.content || ''}</p>
          <center>
            <a href="https://adorzia.com/dashboard" class="button">Get Started</a>
          </center>
          <p>If you have any questions, our support team is always here to help. Just reply to this email or reach out through the platform.</p>
          <p>Best regards,<br><strong>The Adorzia Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2024 Adorzia. All rights reserved.</p>
          <p>123 Creative Street, Design City, DC 12345</p>
        </div>
      </div>
    </body>
    </html>
  `,
  announcement: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.subject}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 300; }
        .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px; }
        .content { padding: 40px 30px; }
        .content h2 { color: #1d4ed8; font-size: 22px; margin-top: 0; }
        .content p { font-size: 16px; color: #555; margin-bottom: 20px; }
        .highlight-box { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { font-size: 14px; color: #6b7280; margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${data.subject}</h1>
          <div class="badge">Platform Announcement</div>
        </div>
        <div class="content">
          <h2>Hello ${data.name || 'Designer'}!</h2>
          <div class="highlight-box">
            <p style="margin: 0; font-size: 16px; color: #1e40af;">${data.content}</p>
          </div>
          <p>We're constantly working to improve your experience on Adorzia. Stay tuned for more updates!</p>
          <center>
            <a href="https://adorzia.com/dashboard" class="button">Visit Dashboard</a>
          </center>
          <p>Thank you for being part of our creative community.</p>
          <p>Best regards,<br><strong>The Adorzia Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2024 Adorzia. All rights reserved.</p>
          <p>You're receiving this because you're a registered member of Adorzia.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  alert: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.subject}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 300; }
        .alert-icon { font-size: 48px; margin-bottom: 15px; }
        .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px; }
        .content { padding: 40px 30px; }
        .content h2 { color: #d97706; font-size: 22px; margin-top: 0; }
        .content p { font-size: 16px; color: #555; margin-bottom: 20px; }
        .alert-box { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { font-size: 14px; color: #6b7280; margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="alert-icon">⚠️</div>
          <h1>${data.subject}</h1>
          <div class="badge">Important Alert</div>
        </div>
        <div class="content">
          <h2>Hello ${data.name || 'Designer'}!</h2>
          <div class="alert-box">
            <p style="margin: 0; font-size: 16px; color: #92400e;">${data.content}</p>
          </div>
          <p>Please take a moment to review this information. If you have any questions or concerns, don't hesitate to reach out to our support team.</p>
          <center>
            <a href="https://adorzia.com/dashboard" class="button">View Details</a>
          </center>
          <p>Thank you for your attention.</p>
          <p>Best regards,<br><strong>The Adorzia Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2024 Adorzia. All rights reserved.</p>
          <p>You're receiving this because you're a registered member of Adorzia.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  custom: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.subject}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 300; }
        .content { padding: 40px 30px; }
        .content h2 { color: #1e293b; font-size: 22px; margin-top: 0; }
        .content p { font-size: 16px; color: #555; margin-bottom: 20px; }
        .custom-content { background: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; margin: 25px 0; border-radius: 8px; }
        .button { display: inline-block; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { font-size: 14px; color: #6b7280; margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${data.subject}</h1>
        </div>
        <div class="content">
          <h2>Hello ${data.name || 'Designer'}!</h2>
          <div class="custom-content">
            <p style="margin: 0; font-size: 16px; color: #334155; white-space: pre-wrap;">${data.content}</p>
          </div>
          <center>
            <a href="https://adorzia.com/dashboard" class="button">Go to Dashboard</a>
          </center>
          <p>Best regards,<br><strong>The Adorzia Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2024 Adorzia. All rights reserved.</p>
          <p>You're receiving this because you're a registered member of Adorzia.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

const handler = async (req: Request): Promise<Response> => {
  console.log("[SEND-ADMIN-EMAIL] Function started");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY_ADMIN");
    if (!resendApiKey) throw new Error("RESEND_API_KEY_ADMIN not configured");

    const resend = new Resend(resendApiKey);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization required" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify admin
    const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: requester }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !requester) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check superadmin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', requester.id)
      .maybeSingle();

    if (roleData?.role !== 'superadmin') {
      return new Response(JSON.stringify({ error: "Forbidden: Superadmin only" }), {
        status: 403, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { template, to, subject, content, targetType }: AdminEmailRequest = await req.json();

    if (!template || !subject || !content) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let recipients: string[] = [];
    let recipientCount = 0;

    if (targetType === 'all' || (Array.isArray(to) && to.length === 0)) {
      // Fetch all user emails
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('email, name')
        .not('email', 'is', null)
        .limit(1000);

      if (usersError) throw usersError;
      recipients = users?.map(u => u.email) || [];
      recipientCount = recipients.length;
    } else if (Array.isArray(to)) {
      recipients = to;
      recipientCount = recipients.length;
    } else {
      recipients = [to];
      recipientCount = 1;
    }

    if (recipients.length === 0) {
      return new Response(JSON.stringify({ error: "No recipients found" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const templateFn = emailTemplates[template] || emailTemplates.custom;
    const html = templateFn({ subject, content, name: '' });

    // Send emails in batches
    const batchSize = 50;
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const sendPromises = batch.map(async (email) => {
        try {
          const result = await resend.emails.send({
            from: "Adorzia <admin@mail.adorzia.com>",
            to: [email],
            subject,
            html,
          });
          
          // Log email
          await supabase.from("email_logs").insert({
            subdomain: "admin",
            email_type: template,
            from_address: "admin@mail.adorzia.com",
            to_address: email,
            subject,
            status: "sent",
            resend_id: result.id,
            metadata: { sent_by: requester.id, template },
          });
          
          return { success: true, email };
        } catch (err) {
          console.error(`[SEND-ADMIN-EMAIL] Failed to send to ${email}:`, err);
          
          await supabase.from("email_logs").insert({
            subdomain: "admin",
            email_type: template,
            from_address: "admin@mail.adorzia.com",
            to_address: email,
            subject,
            status: "failed",
            error_message: err.message,
            metadata: { sent_by: requester.id, template },
          });
          
          return { success: false, email, error: err.message };
        }
      });

      const results = await Promise.all(sendPromises);
      sentCount += results.filter(r => r.success).length;
      failedCount += results.filter(r => !r.success).length;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Email sent to ${sentCount} recipients`,
      sent: sentCount,
      failed: failedCount,
      total: recipientCount
    }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("[SEND-ADMIN-EMAIL] ERROR:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

Deno.serve(handler);
