<<<<<<< HEAD
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
=======
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
<<<<<<< HEAD
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
};

// SC Difficulty Ranges
const SC_DIFFICULTY_RANGES: Record<string, { min: number; max: number }> = {
  free: { min: 5, max: 10 },
  easy: { min: 10, max: 20 },
  medium: { min: 20, max: 30 },
  hard: { min: 30, max: 50 },
  insane: { min: 50, max: 100 },
};

// SC Rank Thresholds
const SC_RANK_THRESHOLDS = [
  { rankOrder: 2, minSC: 0 },
  { rankOrder: 3, minSC: 301 },
  { rankOrder: 4, minSC: 801 },
  { rankOrder: 5, minSC: 2001 },
  { rankOrder: 6, minSC: 3201 },
  { rankOrder: 7, minSC: 5001 },
];

function generateRandomSC(difficulty: string): number {
  const range = SC_DIFFICULTY_RANGES[difficulty] || SC_DIFFICULTY_RANGES.easy;
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

function getRankOrderFromSC(sc: number): number {
  for (let i = SC_RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (sc >= SC_RANK_THRESHOLDS[i].minSC) {
      return SC_RANK_THRESHOLDS[i].rankOrder;
    }
  }
  return 2; // Default to Apprentice
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AWARD-SC] ${step}${detailsStr}`);
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
    logStep("Function started");

    const { submission_id, difficulty, designer_id, bonus_sc } = await req.json();

    if (!submission_id || !designer_id) {
      throw new Error("Missing required fields: submission_id and designer_id");
    }

    logStep("Processing SC award", { submission_id, difficulty, designer_id, bonus_sc });

    // Generate random SC based on difficulty
    const awardedSC = bonus_sc || generateRandomSC(difficulty || 'easy');
    logStep("Generated SC award", { awardedSC, difficulty });

    // Get current profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('style_credits, total_style_credits, rank_id, user_id')
      .eq('user_id', designer_id)
      .single();

    if (profileError) {
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }

    const currentSC = profile.style_credits || 0;
    const totalSC = profile.total_style_credits || 0;
    const newSC = currentSC + awardedSC;
    const newTotalSC = totalSC + awardedSC;

    logStep("Current SC status", { currentSC, totalSC, newSC, newTotalSC });

    // Check if rank should be upgraded
    const newRankOrder = getRankOrderFromSC(newSC);
    
    // Get current rank order
    const { data: currentRank } = await supabaseClient
      .from('ranks')
      .select('rank_order')
      .eq('id', profile.rank_id)
      .single();

    const currentRankOrder = currentRank?.rank_order || 2;
    const shouldPromote = newRankOrder > currentRankOrder;

    logStep("Rank check", { currentRankOrder, newRankOrder, shouldPromote });

    // Get new rank ID if promotion
    let newRankId = profile.rank_id;
    if (shouldPromote) {
      const { data: newRank } = await supabaseClient
        .from('ranks')
        .select('id, name')
        .eq('rank_order', newRankOrder)
        .single();
      
      if (newRank) {
        newRankId = newRank.id;
        logStep("Promotion!", { newRankName: newRank.name, newRankOrder });
      }
    }

    // Update profile
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        style_credits: newSC,
        total_style_credits: newTotalSC,
        rank_id: newRankId,
      })
      .eq('user_id', designer_id);

    if (updateError) {
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }

    logStep("Profile updated successfully");

    // Create notification
    let notificationMessage = `You earned ${awardedSC} Style Credits for your StyleBox submission!`;
    if (shouldPromote) {
      const { data: newRank } = await supabaseClient
        .from('ranks')
        .select('name')
        .eq('rank_order', newRankOrder)
        .single();
      
      notificationMessage += ` Congratulations! You've been promoted to ${newRank?.name}!`;
    }

    await supabaseClient
      .from('notifications')
      .insert({
        user_id: designer_id,
        type: 'submission',
        message: notificationMessage,
        status: 'unread',
      });

    logStep("Notification created");

    return new Response(JSON.stringify({
      success: true,
      awarded_sc: awardedSC,
      new_total_sc: newSC,
      lifetime_sc: newTotalSC,
      promoted: shouldPromote,
      new_rank_order: newRankOrder,
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
