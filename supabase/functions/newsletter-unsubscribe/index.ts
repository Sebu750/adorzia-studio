import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UnsubscribeRequest {
  email: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: UnsubscribeRequest = await req.json();
    
    // Validate email format
    if (!email || !emailRegex.test(email.trim())) {
      console.log("Invalid email format:", email);
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if subscriber exists
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (!existing) {
      console.log("Email not found in subscribers:", normalizedEmail);
      return new Response(
        JSON.stringify({ message: "Email address not found in our subscription list." }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (existing.status === "unsubscribed") {
      console.log("Email already unsubscribed:", normalizedEmail);
      return new Response(
        JSON.stringify({ message: "You're already unsubscribed." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Unsubscribe the user
    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({ 
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("Unsubscribe error:", updateError);
      throw new Error("Failed to unsubscribe. Please try again.");
    }

    console.log("User unsubscribed:", normalizedEmail);

    return new Response(
      JSON.stringify({
        message: "You've been successfully unsubscribed from our newsletter.",
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Newsletter unsubscribe error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

Deno.serve(handler);
