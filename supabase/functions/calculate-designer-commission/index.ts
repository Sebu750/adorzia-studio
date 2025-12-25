import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Markup multiplier for retail pricing
const MARKUP_MULTIPLIER = 2.3;

// SC Rank Thresholds with commission rates
const SC_RANK_THRESHOLDS = [
  { minSC: 0, commission: 8 },
  { minSC: 301, commission: 12 },
  { minSC: 801, commission: 18 },
  { minSC: 2001, commission: 25 },
  { minSC: 3201, commission: 32 },
  { minSC: 5001, commission: 40 },
];

// Founder bonuses
const FOUNDER_BONUSES: Record<string, number> = {
  'F1': 10,
  'F2': 5,
};

function getCommissionFromSC(sc: number): number {
  for (let i = SC_RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (sc >= SC_RANK_THRESHOLDS[i].minSC) {
      return SC_RANK_THRESHOLDS[i].commission;
    }
  }
  return 8; // Default to Apprentice
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CALC-COMMISSION] ${step}${detailsStr}`);
};

serve(async (req) => {
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

    const { designer_id, production_cost, product_id, sale_quantity } = await req.json();

    if (!designer_id || !production_cost) {
      throw new Error("Missing required fields: designer_id and production_cost");
    }

    logStep("Processing commission calculation", { designer_id, production_cost, product_id, sale_quantity });

    // Get designer profile with SC and rank
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select(`
        style_credits,
        rank_id,
        ranks (
          name,
          bonus_percentage,
          is_foundation
        )
      `)
      .eq('user_id', designer_id)
      .single();

    if (profileError) {
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }

    const sc = profile.style_credits || 0;
    logStep("Designer SC", { sc });

    // Calculate base commission from SC
    const baseCommission = getCommissionFromSC(sc);
    logStep("Base commission from SC", { baseCommission });

    // Check for founder bonus
    let founderBonus = 0;
    
    // Check if user has a foundation rank purchase
    const { data: foundationPurchase } = await supabaseClient
      .from('foundation_purchases')
      .select(`
        rank_id,
        ranks (
          name,
          bonus_percentage
        )
      `)
      .eq('designer_id', designer_id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (foundationPurchase?.ranks) {
      const rankName = (foundationPurchase.ranks as any).name;
      founderBonus = FOUNDER_BONUSES[rankName] || 0;
      logStep("Founder bonus applied", { rankName, founderBonus });
    }

    // Calculate total commission (capped at 50%)
    const totalCommission = Math.min(50, baseCommission + founderBonus);
    logStep("Total commission", { baseCommission, founderBonus, totalCommission });

    // Calculate marketplace profit
    const quantity = sale_quantity || 1;
    const totalProductionCost = production_cost * quantity;
    const retailPrice = production_cost * MARKUP_MULTIPLIER;
    const totalRetailPrice = retailPrice * quantity;
    const totalProfit = totalRetailPrice - totalProductionCost;
    
    // Calculate payouts
    const designerPayout = totalProfit * (totalCommission / 100);
    const adorziaPayout = totalProfit - designerPayout;

    logStep("Profit calculation", {
      quantity,
      totalProductionCost,
      retailPrice,
      totalRetailPrice,
      totalProfit,
      designerPayout,
      adorziaPayout,
    });

    // Record earnings if product_id provided
    if (product_id) {
      const { error: earningsError } = await supabaseClient
        .from('earnings')
        .insert({
          designer_id,
          product_id,
          amount: designerPayout,
          revenue_share_percent: totalCommission,
        });

      if (earningsError) {
        logStep("Warning: Failed to record earnings", { error: earningsError.message });
      } else {
        logStep("Earnings recorded successfully");
      }

      // Record sale
      const { error: saleError } = await supabaseClient
        .from('product_sales')
        .insert({
          product_id,
          quantity_sold: quantity,
          total_revenue: totalRetailPrice,
          designer_share: designerPayout,
        });

      if (saleError) {
        logStep("Warning: Failed to record sale", { error: saleError.message });
      } else {
        logStep("Sale recorded successfully");
      }
    }

    return new Response(JSON.stringify({
      success: true,
      style_credits: sc,
      base_commission: baseCommission,
      founder_bonus: founderBonus,
      total_commission: totalCommission,
      production_cost: totalProductionCost,
      retail_price: totalRetailPrice,
      total_profit: Math.round(totalProfit * 100) / 100,
      designer_payout: Math.round(designerPayout * 100) / 100,
      adorzia_payout: Math.round(adorziaPayout * 100) / 100,
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
