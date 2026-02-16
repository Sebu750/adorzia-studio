// Edge Function: jobs-management
// Purpose: Admin-only operations for job management with enhanced validation

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, PUT, DELETE, OPTIONS",
};

interface JobData {
  id?: string;
  title: string;
  company_name?: string;
  company_logo?: string;
  description?: string;
  location?: string;
  location_type?: string;
  job_type?: string;
  salary_min?: number;
  salary_max?: number;
  salary_type?: string;
  category?: string;
  requirements?: string[];
  benefits?: string[];
  tags?: string[];
  is_featured?: boolean;
  status?: string;
  deadline?: string;
  contact_email?: string;
  external_link?: string;
}

// Helper to check if user is admin
async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "superadmin"])
    .single();

  return !error && data !== null;
}

// Validate job data
function validateJobData(data: JobData): { valid: boolean; error?: string } {
  if (!data.title || data.title.trim().length < 3) {
    return { valid: false, error: "Title must be at least 3 characters" };
  }

  if (data.title.length > 200) {
    return { valid: false, error: "Title must be less than 200 characters" };
  }

  if (data.salary_min && data.salary_max && data.salary_min > data.salary_max) {
    return { valid: false, error: "Minimum salary cannot exceed maximum salary" };
  }

  if (data.deadline) {
    const deadlineDate = new Date(data.deadline);
    if (isNaN(deadlineDate.getTime())) {
      return { valid: false, error: "Invalid deadline date" };
    }
  }

  if (data.contact_email && !isValidEmail(data.contact_email)) {
    return { valid: false, error: "Invalid contact email" };
  }

  if (data.external_link && !isValidUrl(data.external_link)) {
    return { valid: false, error: "Invalid external link URL" };
  }

  return { valid: true };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Create a new job
async function createJob(supabase: any, data: JobData, userId: string) {
  const { data: job, error } = await supabase
    .from("jobs")
    .insert({
      ...data,
      posted_by: userId,
      application_count: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return job;
}

// Update an existing job
async function updateJob(supabase: any, jobId: string, data: JobData) {
  const { data: job, error } = await supabase
    .from("jobs")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .select()
    .single();

  if (error) throw error;
  return job;
}

// Delete a job
async function deleteJob(supabase: any, jobId: string) {
  const { error } = await supabase.from("jobs").delete().eq("id", jobId);
  if (error) throw error;
}

// Bulk update job status
async function bulkUpdateStatus(supabase: any, jobIds: string[], status: string) {
  const { error } = await supabase
    .from("jobs")
    .update({ status, updated_at: new Date().toISOString() })
    .in("id", jobIds);

  if (error) throw error;
  return { updated: jobIds.length };
}

// Bulk delete jobs
async function bulkDelete(supabase: any, jobIds: string[]) {
  const { error } = await supabase.from("jobs").delete().in("id", jobIds);
  if (error) throw error;
  return { deleted: jobIds.length };
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

    // Check if user is admin
    const admin = await isAdmin(supabase, user.id);
    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { action, data, jobId, jobIds } = body;

    let result;

    switch (action) {
      case "create": {
        const validation = validateJobData(data);
        if (!validation.valid) {
          return new Response(
            JSON.stringify({ error: validation.error }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await createJob(supabase, data, user.id);
        break;
      }

      case "update": {
        if (!jobId) {
          return new Response(
            JSON.stringify({ error: "Missing jobId" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const validation = validateJobData(data);
        if (!validation.valid) {
          return new Response(
            JSON.stringify({ error: validation.error }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await updateJob(supabase, jobId, data);
        break;
      }

      case "delete": {
        if (!jobId) {
          return new Response(
            JSON.stringify({ error: "Missing jobId" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        await deleteJob(supabase, jobId);
        result = { success: true, message: "Job deleted" };
        break;
      }

      case "bulkUpdateStatus": {
        if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
          return new Response(
            JSON.stringify({ error: "Missing or invalid jobIds array" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (!data?.status) {
          return new Response(
            JSON.stringify({ error: "Missing status" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await bulkUpdateStatus(supabase, jobIds, data.status);
        break;
      }

      case "bulkDelete": {
        if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
          return new Response(
            JSON.stringify({ error: "Missing or invalid jobIds array" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await bulkDelete(supabase, jobIds);
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
    console.error("Error in jobs-management function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
