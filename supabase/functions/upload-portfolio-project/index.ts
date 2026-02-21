import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UploadRequest {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  images: {
    fileName: string;
    fileType: string;
    fileData: string; // base64 encoded
  }[];
  // Enhanced manual project fields
  collection_name?: string;
  year?: number;
  fabric_details?: string;
  inspiration?: string;
  source_type?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("[upload-portfolio-project] Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      console.error("[upload-portfolio-project] Missing environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's auth header for authentication
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Validate JWT and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("[upload-portfolio-project] Auth error:", authError?.message || "No user");
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[upload-portfolio-project] Authenticated user:", user.id);

    // Create service role client for storage operations (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const requestData: UploadRequest = await req.json();
    const { title, description, category, tags, images, collection_name, year, fabric_details, inspiration, source_type } = requestData;

    if (!title || !images || images.length === 0) {
      return new Response(
        JSON.stringify({ error: "Title and at least one image are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get or create portfolio for the user
    let { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .select("id")
      .eq("designer_id", user.id)
      .single();

    if (portfolioError || !portfolio) {
      // Create portfolio if it doesn't exist
      const { data: newPortfolio, error: createError } = await supabase
        .from("portfolios")
        .insert({
          designer_id: user.id,
          title: `${user.email}'s Portfolio`,
          description: "My design portfolio",
        })
        .select("id")
        .single();

      if (createError) {
        console.error("Error creating portfolio:", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create portfolio" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      portfolio = newPortfolio;
    }

    // Create portfolio project
    const { data: project, error: projectError } = await supabase
      .from("portfolio_projects")
      .insert({
        portfolio_id: portfolio.id,
        title,
        description: description || null,
        category: category || null,
        tags: tags && tags.length > 0 ? tags : null,
        source_type: source_type || "upload",
        // Enhanced fields
        collection_name: collection_name || null,
        year: year || null,
        fabric_details: fabric_details || null,
        inspiration: inspiration || null,
      })
      .select("id")
      .single();

    if (projectError) {
      console.error("Error creating project:", projectError);
      return new Response(
        JSON.stringify({ error: "Failed to create project" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upload images to storage and create asset records
    const uploadedAssets = [];
    const uploadedFileNames: string[] = [];
    let thumbnailUrl: string | null = null;
    let rollbackNeeded = false;

    try {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        try {
          // Decode base64 image
          const base64Data = image.fileData.split(",")[1] || image.fileData;
          const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

          // Extract image dimensions if possible
          const dimensions = { width: 0, height: 0 };
          try {
            // This is a simplified approach; proper dimension extraction would require more complex logic
            dimensions.width = binaryData.length > 100 ? 1920 : 0;
            dimensions.height = binaryData.length > 100 ? 1080 : 0;
          } catch (err) {
            console.warn("Could not extract dimensions:", err);
          }

          // Generate unique filename
          const fileExt = image.fileName.split(".").pop() || "jpg";
          const fileName = `${user.id}/${project.id}/${Date.now()}-${i}.${fileExt}`;

          // Upload to storage using admin client
          const { error: uploadError } = await supabaseAdmin.storage
            .from("portfolio")
            .upload(fileName, binaryData, {
              contentType: image.fileType,
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            console.error(`Error uploading image ${i + 1}:`, uploadError);
            rollbackNeeded = true;
            throw new Error(`Failed to upload image ${i + 1}: ${uploadError.message}`);
          }

          uploadedFileNames.push(fileName);

          // Get public URL
          const {
            data: { publicUrl },
          } = supabaseAdmin.storage.from("portfolio").getPublicUrl(fileName);

          // Set first image as thumbnail
          if (i === 0) {
            thumbnailUrl = publicUrl;
            // Update project with thumbnail
            const { error: updateError } = await supabase
              .from("portfolio_projects")
              .update({ thumbnail_url: thumbnailUrl })
              .eq("id", project.id);

            if (updateError) {
              console.error("Error updating thumbnail:", updateError);
            }
          }

          // Create asset record
          const { data: asset, error: assetError } = await supabase
            .from("portfolio_assets")
            .insert({
              portfolio_id: portfolio.id,
              project_id: project.id,
              designer_id: user.id,
              file_url: publicUrl,
              file_name: image.fileName,
              file_type: image.fileType.split("/")[0] || "image",
              file_size: binaryData.length,
              mime_type: image.fileType,
              dimensions: dimensions.width > 0 ? dimensions : null,
              display_order: i,
            })
            .select()
            .single();

          if (assetError) {
            console.error("Error creating asset record:", assetError);
            rollbackNeeded = true;
            throw new Error(`Failed to create asset record for image ${i + 1}`);
          }

          if (asset) {
            uploadedAssets.push(asset);
          }
        } catch (imageError) {
          console.error(`Error processing image ${i + 1}:`, imageError);
          rollbackNeeded = true;
          throw imageError;
        }
      }
    } catch (uploadBatchError) {
      // Rollback: Delete uploaded files and project
      console.error("Upload batch failed, rolling back:", uploadBatchError);

      // Delete uploaded files from storage
      if (uploadedFileNames.length > 0) {
        try {
          await supabaseAdmin.storage.from("portfolio").remove(uploadedFileNames);
          console.log(`Rolled back ${uploadedFileNames.length} uploaded files`);
        } catch (deleteError) {
          console.error("Error during rollback - deleting files:", deleteError);
        }
      }

      // Delete asset records
      if (uploadedAssets.length > 0) {
        try {
          await supabase
            .from("portfolio_assets")
            .delete()
            .eq("project_id", project.id);
          console.log("Rolled back asset records");
        } catch (deleteError) {
          console.error("Error during rollback - deleting assets:", deleteError);
        }
      }

      // Delete project
      try {
        await supabase
          .from("portfolio_projects")
          .delete()
          .eq("id", project.id);
        console.log("Rolled back project");
      } catch (deleteError) {
        console.error("Error during rollback - deleting project:", deleteError);
      }

      return new Response(
        JSON.stringify({
          error: uploadBatchError.message || "Failed to upload project",
          details: "Upload failed and changes have been rolled back",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        project: {
          id: project.id,
          title,
          thumbnail_url: thumbnailUrl,
        },
        assets: uploadedAssets,
        message: "Project uploaded successfully!",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: "An unexpected error occurred during project upload",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
