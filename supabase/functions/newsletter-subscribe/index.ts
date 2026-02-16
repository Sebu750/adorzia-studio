import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY_NEWSLETTER");
if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY_NEWSLETTER not configured");
  throw new Error("RESEND_API_KEY_NEWSLETTER not configured");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  source?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getWelcomeEmailHtml = () => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Adorzia</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #212529; padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Adorzia</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.7); font-size: 14px;">Fashion Creation Ecosystem</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #212529; font-size: 24px; font-weight: 600;">Welcome to the Revolution!</h2>
              <p style="margin: 0 0 24px; color: #495057; font-size: 16px; line-height: 1.6;">
                Thank you for joining Adorzia's newsletter! You're now part of a community that's reinventing how fashion designers create, learn, and earn.
              </p>
              
              <!-- Features -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f8f9fa; border-radius: 8px; margin-bottom: 12px;">
                    <strong style="color: #212529;">🎨 StyleBoxes</strong>
                    <p style="margin: 8px 0 0; color: #6c757d; font-size: 14px;">Curated design challenges that build skills and portfolio</p>
                  </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                  <td style="padding: 16px; background-color: #f8f9fa; border-radius: 8px;">
                    <strong style="color: #212529;">🏆 Competitions</strong>
                    <p style="margin: 8px 0 0; color: #6c757d; font-size: 14px;">Styleathons with real prizes and industry exposure</p>
                  </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                  <td style="padding: 16px; background-color: #f8f9fa; border-radius: 8px;">
                    <strong style="color: #212529;">💰 Marketplace</strong>
                    <p style="margin: 8px 0 0; color: #6c757d; font-size: 14px;">Publish designs and earn up to 50% revenue share</p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="https://studio.adorzia.com/auth" style="display: inline-block; padding: 14px 32px; background-color: #212529; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 16px;">
                      Start Creating Today →
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; color: #6c757d; font-size: 14px; line-height: 1.6;">
                We'll keep you updated with new StyleBox releases, competition announcements, and designer success stories.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 40px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 12px; color: #6c757d; font-size: 14px;">
                Follow us on social media
              </p>
              <p style="margin: 0 0 16px;">
                <a href="https://instagram.com/adorziaofficial" style="color: #212529; text-decoration: none; margin: 0 8px;">Instagram</a>
                <a href="https://x.com/adorziaofficial" style="color: #212529; text-decoration: none; margin: 0 8px;">Twitter</a>
                <a href="https://linkedin.com/company/adorziaofficial" style="color: #212529; text-decoration: none; margin: 0 8px;">LinkedIn</a>
              </p>
              <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                © ${new Date().getFullYear()} Adorzia. Made with ♥ in Pakistan.
              </p>
              <p style="margin: 8px 0 0; color: #adb5bd; font-size: 11px;">
                You're receiving this because you subscribed to our newsletter.
                <a href="https://adorzia.com/unsubscribe?email=${normalizedEmail}" style="color: #6c757d; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, source = "footer" }: SubscribeRequest = await req.json();
    
    // Validate email format
    if (!email || !emailRegex.test(email.trim())) {
      console.log("Invalid email format:", email);
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Get IP for rate limiting (from headers)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
               req.headers.get("x-real-ip") || 
               "unknown";

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for duplicate
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existing) {
      if (existing.status === "active") {
        console.log("Email already subscribed:", normalizedEmail);
        return new Response(
          JSON.stringify({ message: "You're already subscribed! Thank you for your interest." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } else {
        // Reactivate unsubscribed user
        await supabase
          .from("newsletter_subscribers")
          .update({ status: "active", subscribed_at: new Date().toISOString() })
          .eq("id", existing.id);
          
        console.log("Reactivated subscriber:", normalizedEmail);
        return new Response(
          JSON.stringify({ message: "Welcome back! You've been resubscribed." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Rate limiting: Check recent subscriptions from this IP (max 3 per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("created_at", oneHourAgo);

    if (count && count >= 3) {
      console.log("Rate limit exceeded for IP:", ip);
      return new Response(
        JSON.stringify({ error: "Too many subscription attempts. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: normalizedEmail,
        source,
        ip_address: ip,
        status: "active",
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to subscribe. Please try again.");
    }

    console.log("New subscriber added:", normalizedEmail);

    // Add subscriber to Resend contact list (General segment)
    let resendContactId: string | null = null;
    try {
      const resendContactResponse = await fetch("https://api.resend.com/audiences/c0e31432-a0ca-461e-b668-f4343e43f485/contacts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          unsubscribed: false,
        }),
      });

      const resendContactResult = await resendContactResponse.json();
      
      if (resendContactResponse.ok && resendContactResult.id) {
        resendContactId = resendContactResult.id;
        console.log("Added to Resend contact list:", resendContactId);
        
        // Update subscriber with resend_contact_id
        await supabase
          .from("newsletter_subscribers")
          .update({ resend_contact_id: resendContactId })
          .eq("email", normalizedEmail);
      } else {
        console.error("Failed to add to Resend contacts:", resendContactResult);
      }
    } catch (resendErr) {
      console.error("Resend contact API error:", resendErr);
      // Don't fail subscription if Resend contact add fails
    }

    // Send welcome email via Resend API
    let emailSent = false;
    let emailError: any = null;
    let emailResult: any = null;
    const emailSubject = "Welcome to Adorzia! 🎨";
    const fromAddress = "hello@mail.adorzia.com";
    
    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Adorzia <${fromAddress}>`,
          to: [normalizedEmail],
          subject: emailSubject,
          html: getWelcomeEmailHtml(),
        }),
      });

      emailResult = await emailResponse.json();
      
      if (!emailResponse.ok) {
        throw new Error(emailResult.message || "Failed to send email");
      }

      console.log("Welcome email sent:", emailResult);
      emailSent = true;

      // Update welcome email status
      await supabase
        .from("newsletter_subscribers")
        .update({
          welcome_email_sent: true,
          welcome_email_sent_at: new Date().toISOString(),
        })
        .eq("email", normalizedEmail);
    } catch (err) {
      emailError = err;
      console.error("Failed to send welcome email:", err);
      // Don't fail the subscription if email fails
    }

    // Log email to email_logs table
    try {
      await supabase.from("email_logs").insert({
        subdomain: "newsletter",
        email_type: "welcome",
        from_address: "hello@mail.adorzia.com",
        to_address: normalizedEmail,
        subject: emailSubject,
        status: emailSent ? "sent" : "failed",
        resend_id: emailResult?.id || null,
        error_message: emailError?.message || null,
        metadata: { source },
      });
      console.log("Email logged to email_logs table");
    } catch (logError) {
      console.error("Failed to log email:", logError);
    }

    return new Response(
      JSON.stringify({
        message: "Successfully subscribed! Check your inbox for a welcome email.",
        emailSent,
        emailError: emailError ? "Welcome email could not be sent" : null,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

Deno.serve(handler);
