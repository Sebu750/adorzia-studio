<<<<<<< HEAD
=======
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  console.log(`[FOUNDATION-PURCHASE] ${step}`, details ? JSON.stringify(details) : '');
};

// Foundation tier configuration
const FOUNDATION_TIERS = {
  f1: {
<<<<<<< HEAD
    name: 'F1 — Founding Legacy',
    priceInPKR: 50000,
    maxSlots: 50,
    bonusPercentage: 10,
  },
  f2: {
    name: 'F2 — The Pioneer',
    priceInPKR: 25000,
    maxSlots: 100,
    bonusPercentage: 5,
=======
    name: 'F1 — Founder Circle',
    priceInPKR: 25000,
    maxSlots: 1000,
    bonusPercentage: 5,
  },
  f2: {
    name: 'F2 — Pioneer Designer',
    priceInPKR: 50000,
    maxSlots: 500,
    bonusPercentage: 10,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  },
};

// PKR to USD conversion (approximate for Stripe)
const PKR_TO_USD_RATE = 0.0036; // ~278 PKR = 1 USD

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
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

<<<<<<< HEAD
  // Cache rank IDs to avoid repeated queries
  let f1RankId: string | null = null;
  let f2RankId: string | null = null;

=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  try {
    logStep("Starting foundation rank purchase flow");

    // Parse request body
    const { tierId } = await req.json();
    
    if (!tierId || !['f1', 'f2'].includes(tierId)) {
      throw new Error("Invalid tier ID. Must be 'f1' or 'f2'");
    }

    const tier = FOUNDATION_TIERS[tierId as keyof typeof FOUNDATION_TIERS];
    logStep("Processing tier", { tierId, tier });

<<<<<<< HEAD
    // Get the rank ID from the ranks table
    let rankId;
    if (tierId === 'f1') {
      if (!f1RankId) {
        const { data: f1Rank, error: f1Error } = await supabaseClient
          .from('ranks')
          .select('id')
          .eq('rank_order', 0)
          .single();
        
        if (f1Error || !f1Rank) {
          logStep('Error getting F1 rank ID', { f1Error });
          throw new Error('Could not find F1 rank');
        }
        f1RankId = f1Rank.id;
      }
      rankId = f1RankId;
    } else if (tierId === 'f2') {
      if (!f2RankId) {
        const { data: f2Rank, error: f2Error } = await supabaseClient
          .from('ranks')
          .select('id')
          .eq('rank_order', 1)
          .single();
        
        if (f2Error || !f2Rank) {
          logStep('Error getting F2 rank ID', { f2Error });
          throw new Error('Could not find F2 rank');
        }
        f2RankId = f2Rank.id;
      }
      rankId = f2RankId;
    }

=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user?.email) {
      logStep("Auth error", { authError });
      throw new Error("User not authenticated or email not available");
    }

    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if user already has this foundation rank
    const { data: existingPurchase, error: checkError } = await supabaseClient
      .from('foundation_purchases')
      .select('id, status')
      .eq('designer_id', user.id)
<<<<<<< HEAD
      .eq('rank_id', rankId)
=======
      .eq('rank_id', tierId)
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      .eq('status', 'completed')
      .maybeSingle();

    if (checkError) {
      logStep("Error checking existing purchase", { checkError });
    }

    if (existingPurchase) {
      throw new Error(`You already have the ${tier.name} rank`);
    }

<<<<<<< HEAD
    // Additional security: Check if user already has a higher tier
    // F1 is higher than F2, so if they already have F1, they shouldn't buy F2
    if (tierId === 'f2') {
      // Check if user already has F1 rank
      if (f1RankId) {
        const { data: f1Purchase } = await supabaseClient
          .from('foundation_purchases')
          .select('id')
          .eq('designer_id', user.id)
          .eq('rank_id', f1RankId)
          .eq('status', 'completed')
          .maybeSingle();

        if (f1Purchase) {
          throw new Error('You already have the higher F1 Founding Legacy rank');
        }
      }
    }

    // Also check from the profile to ensure consistency
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('founder_tier')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile && profile.founder_tier) {
      if (profile.founder_tier === tierId) {
        throw new Error(`Your profile already shows you have the ${tier.name} rank`);
      }
      // If they have F1 and are trying to buy F2
      if (profile.founder_tier === 'f1' && tierId === 'f2') {
        throw new Error('You already have the higher F1 Founding Legacy rank');
      }
    }

    if (checkError) {
      logStep("Error checking existing purchase", { checkError });
    }

    if (existingPurchase) {
      throw new Error(`You already have the ${tier.name} rank`);
    }

=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    // Check available slots
    const { count: soldCount, error: countError } = await supabaseClient
      .from('foundation_purchases')
      .select('*', { count: 'exact', head: true })
<<<<<<< HEAD
      .eq('rank_id', rankId)
=======
      .eq('rank_id', tierId)
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      .eq('status', 'completed');

    if (countError) {
      logStep("Error counting sold slots", { countError });
    }

    const slotsRemaining = tier.maxSlots - (soldCount || 0);
    logStep("Slots check", { soldCount, slotsRemaining, maxSlots: tier.maxSlots });

    if (slotsRemaining <= 0) {
      throw new Error(`Sorry, all ${tier.name} slots have been sold out`);
    }

<<<<<<< HEAD
    // Additional security: Check for suspicious activity
    // Limit to 1 pending purchase per user
    const { count: pendingCount } = await supabaseClient
      .from('foundation_purchases')
      .select('*', { count: 'exact', head: true })
      .eq('designer_id', user.id)
      .eq('status', 'pending');
    
    if (pendingCount && pendingCount > 0) {
      throw new Error('You already have a pending purchase. Please complete it or wait for it to expire.');
    }

    // Additional validation: ensure tier exists and has valid configuration
    if (!tier || tier.priceInPKR <= 0) {
      throw new Error('Invalid tier configuration');
    }

=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { customerId });
    }

    // Calculate price in USD cents (Stripe requires cents)
    const priceInUSD = Math.round(tier.priceInPKR * PKR_TO_USD_RATE * 100);
    logStep("Price calculation", { priceInPKR: tier.priceInPKR, priceInUSDCents: priceInUSD });

    // Create a pending purchase record
    const { data: purchaseRecord, error: insertError } = await supabaseClient
      .from('foundation_purchases')
      .insert({
        designer_id: user.id,
<<<<<<< HEAD
        rank_id: rankId,
=======
        rank_id: tierId,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        amount_usd: Math.round(tier.priceInPKR * PKR_TO_USD_RATE),
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      logStep("Error creating purchase record", { insertError });
      throw new Error("Failed to initiate purchase");
    }

    logStep("Created pending purchase record", { purchaseId: purchaseRecord.id });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: tier.name,
              description: `Lifetime +${tier.bonusPercentage}% Profit Share Bonus - One-Time Purchase`,
              metadata: {
                tier_id: tierId,
                purchase_id: purchaseRecord.id,
              },
            },
            unit_amount: priceInUSD,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/dashboard?purchase=success&tier=${tierId}`,
      cancel_url: `${req.headers.get("origin")}/pricing?purchase=cancelled`,
      metadata: {
        tier_id: tierId,
        user_id: user.id,
        purchase_id: purchaseRecord.id,
      },
    });

    logStep("Created Stripe checkout session", { sessionId: session.id, url: session.url });

    // Update purchase record with Stripe session info
    await supabaseClient
      .from('foundation_purchases')
      .update({ stripe_payment_id: session.id })
      .eq('id', purchaseRecord.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logStep("Error in purchase flow", { error: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
