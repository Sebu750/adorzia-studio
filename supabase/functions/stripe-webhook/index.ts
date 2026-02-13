import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!endpointSecret) {
    console.error("[STRIPE-WEBHOOK] CRITICAL: STRIPE_WEBHOOK_SECRET is not set");
    return new Response(JSON.stringify({ error: "Server configuration error: Missing STRIPE_WEBHOOK_SECRET" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;

  try {
    event = Stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`[STRIPE-WEBHOOK] Signature verification failed: ${err.message}`);
    return new Response(`Webhook signature verification failed: ${err.message}`, {
      status: 400,
    });
  }

  // Get Supabase client with service role to bypass RLS
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRoleKey) {
    console.error("[STRIPE-WEBHOOK] CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not set");
    return new Response(JSON.stringify({ error: "Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    serviceRoleKey
  );

  console.log(`[STRIPE-WEBHOOK] Event received: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        
        console.log(`[STRIPE-WEBHOOK] Processing checkout session: ${session.id}`);
        
        // Extract purchase_id from session metadata
        const purchaseId = session.metadata?.purchase_id;
        const tierId = session.metadata?.tier_id;
        
        if (!purchaseId) {
          console.error("[STRIPE-WEBHOOK] No purchase_id found in session metadata", { session });
          break;
        }

        // Update the foundation purchase record to completed
        const { error: updateError } = await supabaseAdmin
          .from("foundation_purchases")
          .update({
            status: "completed",
            stripe_payment_id: session.payment_intent,
            purchased_at: new Date().toISOString(),
          })
          .eq("id", purchaseId);

        if (updateError) {
          console.error("[STRIPE-WEBHOOK] Error updating purchase record", { updateError, purchaseId });
          throw updateError;
        }

        console.log(`[STRIPE-WEBHOOK] Successfully updated purchase ${purchaseId} to completed`);

        // Get the designer_id from the purchase record
        const { data: purchaseData, error: fetchError } = await supabaseAdmin
          .from("foundation_purchases")
          .select("designer_id")
          .eq("id", purchaseId)
          .single();

        if (fetchError || !purchaseData) {
          console.error("[STRIPE-WEBHOOK] Error fetching purchase record", { fetchError, purchaseId });
          break;
        }

        // Update the user's profile with the founder tier
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .update({
            founder_tier: tierId,
            is_founding_designer: true,
            founding_date: new Date().toISOString(),
          })
          .eq("user_id", purchaseData.designer_id);

        if (profileError) {
          console.error("[STRIPE-WEBHOOK] Error updating profile with founder tier", { 
            profileError, 
            designerId: purchaseData.designer_id,
            tierId 
          });
          // Don't throw here as the purchase is already marked as completed
        } else {
          console.log(`[STRIPE-WEBHOOK] Successfully updated profile for designer ${purchaseData.designer_id} with tier ${tierId}`);
        }

        break;

      case "checkout.session.expired":
      case "checkout.session.canceled":
        const canceledSession = event.data.object;
        const canceledPurchaseId = canceledSession.metadata?.purchase_id;
        
        if (canceledPurchaseId) {
          // Update the purchase record to cancelled
          const { error: cancelError } = await supabaseAdmin
            .from("foundation_purchases")
            .update({
              status: "cancelled",
            })
            .eq("id", canceledPurchaseId);

          if (cancelError) {
            console.error("[STRIPE-WEBHOOK] Error cancelling purchase record", { cancelError, canceledPurchaseId });
          } else {
            console.log(`[STRIPE-WEBHOOK] Successfully cancelled purchase ${canceledPurchaseId}`);
          }
        }
        break;

      default:
        console.log(`[STRIPE-WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[STRIPE-WEBHOOK] Error processing webhook", { error: error instanceof Error ? error.message : error });
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});