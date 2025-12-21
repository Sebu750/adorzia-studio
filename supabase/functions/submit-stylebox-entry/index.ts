import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`User ${user.id} submitting stylebox entry`);

    // Parse request body
    const { stylebox_id, description, submission_files } = await req.json();

    // Validate required fields
    if (!stylebox_id) {
      console.error("Missing stylebox_id");
      return new Response(
        JSON.stringify({ error: "stylebox_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!submission_files || !Array.isArray(submission_files) || submission_files.length === 0) {
      console.error("Missing or invalid submission_files");
      return new Response(
        JSON.stringify({ error: "At least one file URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the stylebox exists and is active
    const { data: stylebox, error: styleboxError } = await supabase
      .from("styleboxes")
      .select("id, title, status, xp_reward")
      .eq("id", stylebox_id)
      .single();

    if (styleboxError || !stylebox) {
      console.error("Stylebox not found:", styleboxError?.message);
      return new Response(
        JSON.stringify({ error: "Stylebox not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (stylebox.status !== "active") {
      console.error("Stylebox is not active:", stylebox.status);
      return new Response(
        JSON.stringify({ error: "This challenge is not currently active" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the submission
    const { data: submission, error: insertError } = await supabase
      .from("stylebox_submissions")
      .insert({
        stylebox_id,
        designer_id: user.id,
        description: description || null,
        submission_files,
        status: "submitted",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating submission:", insertError.message);
      return new Response(
        JSON.stringify({ error: "Failed to create submission" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Submission ${submission.id} created successfully for stylebox ${stylebox.title}`);

    // Create a notification for the user
    await supabase
      .from("notifications")
      .insert({
        user_id: user.id,
        type: "submission",
        message: `Your submission for "${stylebox.title}" has been received and is pending review.`,
        status: "unread",
      });

    return new Response(
      JSON.stringify({
        success: true,
        submission: {
          id: submission.id,
          stylebox_id: submission.stylebox_id,
          status: submission.status,
          submitted_at: submission.submitted_at,
        },
        message: `Submission received for "${stylebox.title}". You'll be notified once it's reviewed.`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
