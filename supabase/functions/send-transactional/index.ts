<<<<<<< HEAD
=======
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
    const resendApiKey = Deno.env.get("RESEND_API_KEY_TRANSACTIONAL");
    if (!resendApiKey) throw new Error("RESEND_API_KEY_TRANSACTIONAL not configured");
=======
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

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

<<<<<<< HEAD
    const fromAddress = "Adorzia <noreply@mail.adorzia.com>";
=======
    const fromAddress = "Adorzia <onboarding@resend.dev>";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    const subject = type === "welcome" ? "Welcome to Adorzia!" : `Adorzia - ${type}`;

    const emailResult = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject,
      html: `<h2>${subject}</h2><p>This is a transactional email from Adorzia.</p>`,
    });

<<<<<<< HEAD
    await supabase.from("email_logs").insert({ subdomain: "mail", email_type: type, from_address: "noreply@mail.adorzia.com", to_address: to, subject, status: "sent", resend_id: emailResult.data?.id, metadata: data });
=======
    await supabase.from("email_logs").insert({ subdomain: "mail", email_type: type, from_address: fromAddress, to_address: to, subject, status: "sent", resend_id: emailResult.data?.id, metadata: data });
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

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

<<<<<<< HEAD
Deno.serve(handler);
=======
serve(handler);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
