import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TransactionalEmailRequest {
  type: string;
  to: string;
  data: Record<string, unknown>;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("[SEND-TRANSACTIONAL] Function started");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

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

    const { type, to, data }: TransactionalEmailRequest = await req.json();

    if (!type || !to) {
      return new Response(JSON.stringify({ error: "Type and to are required" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const fromAddress = "Adorzia <onboarding@resend.dev>";
    const subject = type === "welcome" ? "Welcome to Adorzia!" : `Adorzia - ${type}`;

    const emailResult = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject,
      html: `<h2>${subject}</h2><p>This is a transactional email from Adorzia.</p>`,
    });

    await supabase.from("email_logs").insert({ subdomain: "mail", email_type: type, from_address: fromAddress, to_address: to, subject, status: "sent", resend_id: emailResult.data?.id, metadata: data });

    return new Response(JSON.stringify({ success: true, message_id: emailResult.data?.id }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[SEND-TRANSACTIONAL] ERROR:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
