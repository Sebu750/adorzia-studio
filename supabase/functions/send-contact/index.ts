import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("[SEND-CONTACT] Function started");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY_CONTACT");
    if (!resendApiKey) throw new Error("RESEND_API_KEY_CONTACT not configured");

    const resend = new Resend(resendApiKey);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { name, email, subject, message, category }: ContactRequest = await req.json();

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Store submission
    const { data: submission, error: insertError } = await supabase
      .from("contact_submissions")
      .insert({ name: name.trim(), email: email.trim().toLowerCase(), subject: subject.trim(), message: message.trim(), category: category || "general", ip_address: ip })
      .select().single();

    if (insertError) throw new Error("Failed to save submission");

    // Send emails
    const fromAddress = "Adorzia Contact <contact@mail.adorzia.com>";
    
    await resend.emails.send({
      from: fromAddress,
      to: ["hello@adorzia.com"],
      subject: `[Contact] ${subject}`,
      html: `<h2>New Contact Form Submission</h2><p><strong>From:</strong> ${name} (${email})</p><p><strong>Category:</strong> ${category}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: "We received your message - Adorzia",
      html: `<h2>Thank you, ${name}!</h2><p>We received your message and will get back to you within 24 hours.</p><p>Best regards,<br>The Adorzia Team</p>`,
    });

    // Log email
    await supabase.from("email_logs").insert({ subdomain: "contact", email_type: "contact_inquiry", from_address: "contact@mail.adorzia.com", to_address: email, subject: "Contact confirmation", status: "sent", metadata: { submission_id: submission.id } });

    return new Response(JSON.stringify({ success: true, message: "Message sent successfully!" }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[SEND-CONTACT] ERROR:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

Deno.serve(handler);
