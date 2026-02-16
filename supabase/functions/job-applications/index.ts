// Edge Function: job-applications
// Purpose: Designer job application operations with validation and atomic checks

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
};

interface ApplicationData {
  jobId: string;
  coverLetter?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
}

// Helper to check if job is active and not expired
async function validateJobForApplication(supabase: any, jobId: string): Promise<{ valid: boolean; error?: string }> {
  const { data: job, error } = await supabase
    .from("jobs")
    .select("status, deadline, application_count")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    return { valid: false, error: "Job not found" };
  }

  if (job.status !== "active") {
    return { valid: false, error: "This job is no longer accepting applications" };
  }

  if (job.deadline) {
    const deadline = new Date(job.deadline);
    if (deadline < new Date()) {
      return { valid: false, error: "Application deadline has passed" };
    }
  }

  return { valid: true };
}

// Check if designer has already applied
async function hasAlreadyApplied(supabase: any, jobId: string, designerId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("job_applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("designer_id", designerId)
    .maybeSingle();

  return !error && data !== null;
}

// Apply to a job
async function applyToJob(supabase: any, data: ApplicationData, designerId: string) {
  // Validate job is open for applications
  const validation = await validateJobForApplication(supabase, data.jobId);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Check if already applied
  const alreadyApplied = await hasAlreadyApplied(supabase, data.jobId, designerId);
  if (alreadyApplied) {
    throw new Error("You have already applied for this job");
  }

  // Create application
  const { data: application, error } = await supabase
    .from("job_applications")
    .insert({
      job_id: data.jobId,
      designer_id: designerId,
      cover_letter: data.coverLetter,
      portfolio_url: data.portfolioUrl,
      resume_url: data.resumeUrl,
      status: "applied",
    })
    .select(`
      *,
      jobs(title, company_name, company_logo)
    `)
    .single();

  if (error) throw error;
  return application;
}

// Withdraw an application
async function withdrawApplication(supabase: any, applicationId: string, designerId: string) {
  // Verify the application belongs to this designer
  const { data: existing, error: fetchError } = await supabase
    .from("job_applications")
    .select("id, status")
    .eq("id", applicationId)
    .eq("designer_id", designerId)
    .single();

  if (fetchError || !existing) {
    throw new Error("Application not found");
  }

  // Don't allow withdrawal if already hired
  if (existing.status === "hired") {
    throw new Error("Cannot withdraw a hired application");
  }

  const { error } = await supabase
    .from("job_applications")
    .delete()
    .eq("id", applicationId)
    .eq("designer_id", designerId);

  if (error) throw error;
}

// Get designer's applications with full details
async function getMyApplications(supabase: any, designerId: string) {
  const { data, error } = await supabase
    .from("job_applications")
    .select(`
      *,
      jobs(
        id,
        title,
        company_name,
        company_logo,
        location,
        job_type,
        salary_min,
        salary_max,
        salary_type
      )
    `)
    .eq("designer_id", designerId)
    .order("applied_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Get available jobs for designer (active jobs they haven't applied to)
async function getAvailableJobs(supabase: any, designerId: string, filters?: any) {
  // Get jobs the designer has already applied to
  const { data: appliedJobs } = await supabase
    .from("job_applications")
    .select("job_id")
    .eq("designer_id", designerId);

  const appliedJobIds = appliedJobs?.map(a => a.job_id) || [];

  // Build query for active jobs
  let query = supabase
    .from("jobs")
    .select("*")
    .eq("status", "active")
    .is("deadline", null)
    .or(`deadline.gte.${new Date().toISOString()}`)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  // Exclude applied jobs
  if (appliedJobIds.length > 0) {
    query = query.not("id", "in", `(${appliedJobIds.join(",")})`);
  }

  // Apply filters
  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }
  if (filters?.jobType && filters.jobType !== "all") {
    query = query.eq("job_type", filters.jobType);
  }
  if (filters?.locationType && filters.locationType !== "all") {
    query = query.eq("location_type", filters.locationType);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables");
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { action, data } = body;

    let result;

    switch (action) {
      case "apply": {
        if (!data?.jobId) {
          return new Response(
            JSON.stringify({ error: "Missing jobId" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await applyToJob(supabase, data, user.id);
        break;
      }

      case "withdraw": {
        if (!data?.applicationId) {
          return new Response(
            JSON.stringify({ error: "Missing applicationId" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        await withdrawApplication(supabase, data.applicationId, user.id);
        result = { success: true, message: "Application withdrawn" };
        break;
      }

      case "getMyApplications": {
        result = await getMyApplications(supabase, user.id);
        break;
      }

      case "getAvailableJobs": {
        result = await getAvailableJobs(supabase, user.id, data?.filters);
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in job-applications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
