<<<<<<< HEAD
=======
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Subscription token grants per tier
const TOKEN_GRANTS: Record<string, { requestTokens: number; styleboxTokens: number; uploadTokens: number }> = {
  basic: { requestTokens: 1, styleboxTokens: 0, uploadTokens: 0 },
  pro: { requestTokens: 0, styleboxTokens: 3, uploadTokens: 1 }, // 'pro' maps to premium
  elite: { requestTokens: 0, styleboxTokens: 5, uploadTokens: 2 }, // higher tier if exists
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RESET-TOKENS] ${step}${detailsStr}`);
};

<<<<<<< HEAD
Deno.serve(async (req) => {
=======
serve(async (req) => {
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Monthly token reset started");

    // Get all profiles that need token reset
    const { data: profiles, error: fetchError } = await supabaseClient
      .from('profiles')
      .select('user_id, subscription_tier, tokens_reset_at')
      .not('subscription_tier', 'is', null);

    if (fetchError) {
      throw new Error(`Failed to fetch profiles: ${fetchError.message}`);
    }

    logStep("Found profiles to process", { count: profiles?.length || 0 });

    const now = new Date();
    let resetCount = 0;
    let skippedCount = 0;

    for (const profile of profiles || []) {
      // Check if reset is needed (different month or never reset)
      const lastReset = profile.tokens_reset_at ? new Date(profile.tokens_reset_at) : null;
      const needsReset = !lastReset || 
        lastReset.getMonth() !== now.getMonth() || 
        lastReset.getFullYear() !== now.getFullYear();

      if (!needsReset) {
        skippedCount++;
        continue;
      }

      const tier = profile.subscription_tier as string;
      const grant = TOKEN_GRANTS[tier] || TOKEN_GRANTS.basic;

      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({
          request_tokens: grant.requestTokens,
          stylebox_tokens: grant.styleboxTokens,
          upload_tokens: grant.uploadTokens,
          tokens_reset_at: now.toISOString(),
        })
        .eq('user_id', profile.user_id);

      if (updateError) {
        logStep("Failed to reset tokens for user", { 
          userId: profile.user_id, 
          error: updateError.message 
        });
      } else {
        resetCount++;
        logStep("Reset tokens for user", { 
          userId: profile.user_id, 
          tier,
          tokens: grant 
        });
      }
    }

    logStep("Token reset completed", { resetCount, skippedCount });

    return new Response(JSON.stringify({
      success: true,
      reset_count: resetCount,
      skipped_count: skippedCount,
      timestamp: now.toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
