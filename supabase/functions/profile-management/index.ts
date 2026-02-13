import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
  // This ensures CORS is handled properly
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
  }

  try {
    // Parse the request body
    const payload = await req.json();
    const { userId, action, adminId } = payload;

    // Validate inputs
    if (!userId || !action || !adminId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: userId, action, adminId" }),
        { 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 400 
        }
      );
    }

    // Validate action type
    const validActions = ["approve", "unapprove", "feature", "unfeature"];
    if (!validActions.includes(action)) {
      return new Response(
        JSON.stringify({ error: `Invalid action. Valid actions: ${validActions.join(", ")}` }),
        { 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 400 
        }
      );
    }

    // Verify admin privileges directly from the database
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', adminId)
      .single();

    if (adminError || !adminProfile || adminProfile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Admin privileges required" }),
        { 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 403 
        }
      );
    }

    // Perform the requested action on the profile
    let updateData = {};
    let logAction = "";
    
    switch (action) {
      case "approve":
        updateData = { 
          is_approved: true,
          approved_at: new Date().toISOString(),
          approved_by: adminId
        };
        logAction = "approved";
        break;
      case "unapprove":
        updateData = { 
          is_approved: false,
          approved_at: null
        };
        logAction = "unapproved";
        break;
      case "feature":
        updateData = { 
          is_featured: true,
          featured_at: new Date().toISOString(),
          featured_by: adminId
        };
        logAction = "featured";
        break;
      case "unfeature":
        updateData = { 
          is_featured: false
        };
        logAction = "unfeatured";
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { 
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            status: 400 
          }
        );
    }

    // Update the profile in the database
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId);

    if (updateError) {
      console.error(`Database update failed: ${updateError.message}`);
      return new Response(
        JSON.stringify({ error: "Failed to update profile" }),
        { 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 500 
        }
      );
    }

    // Log the action
    const { error: logError } = await supabase
      .from('profile_approval_logs')
      .insert([{
        user_id: userId,
        admin_id: adminId,
        action: action,
        timestamp: new Date().toISOString()
      }]);

    // Even if logging fails, we still return success for the main operation
    if (logError) {
      console.warn(`Failed to log profile action: ${logError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Profile successfully ${logAction}`,
        action: action,
        userId: userId
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Error processing profile management request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500 
      }
    );
  }
});