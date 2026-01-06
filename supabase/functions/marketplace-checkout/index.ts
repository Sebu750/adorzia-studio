import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  console.log(`[MARKETPLACE-CHECKOUT] ${step}`, details ? JSON.stringify(details) : '');
};

const MARKUP_MULTIPLIER = 2.3;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action, cart_id, shipping_address, billing_address, shipping_method, success_url, cancel_url } = body;

    logStep('Processing checkout request', { action, cart_id });

    if (action === 'create_session') {
      // Fetch cart
      const { data: cart, error: cartError } = await supabase
        .from('marketplace_carts')
        .select('*')
        .eq('id', cart_id)
        .single();

      if (cartError || !cart) {
        return new Response(JSON.stringify({ error: 'Cart not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!cart.items || cart.items.length === 0) {
        return new Response(JSON.stringify({ error: 'Cart is empty' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Validate products and calculate totals
      const productIds = cart.items.map((item: any) => item.product_id);
      const { data: products } = await supabase
        .from('marketplace_products')
        .select('id, title, price, images, inventory_count, status, designer_id')
        .in('id', productIds);

      if (!products || products.length !== productIds.length) {
        return new Response(JSON.stringify({ error: 'Some products are no longer available' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create line items for Stripe
      const lineItems = cart.items.map((item: any) => {
        const product = products.find((p: any) => p.id === item.product_id);
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product?.title || item.title,
              images: product?.images?.slice(0, 1) || [],
            },
            unit_amount: Math.round((product?.price || item.price) * 100),
          },
          quantity: item.quantity,
        };
      });

      // Calculate shipping cost
      let shippingCost = 0;
      if (shipping_method === 'express') {
        shippingCost = 25;
      } else if (shipping_method === 'standard') {
        shippingCost = 10;
      }
      // Free shipping over $200
      if (cart.subtotal >= 200) {
        shippingCost = 0;
      }

      // Add shipping as a line item if applicable
      if (shippingCost > 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Shipping (${shipping_method})`,
            },
            unit_amount: shippingCost * 100,
          },
          quantity: 1,
        });
      }

      // Generate order number for metadata
      const { data: orderNumber } = await supabase.rpc('generate_order_number');

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}&order=${orderNumber}`,
        cancel_url: cancel_url,
        metadata: {
          cart_id: cart.id,
          order_number: orderNumber,
          customer_id: cart.customer_id,
          shipping_address: JSON.stringify(shipping_address),
          billing_address: JSON.stringify(billing_address),
          shipping_method: shipping_method,
          shipping_cost: shippingCost.toString(),
        },
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU', 'PK'],
        },
      });

      logStep('Checkout session created', { session_id: session.id, order_number: orderNumber });

      return new Response(JSON.stringify({ 
        session_id: session.id, 
        url: session.url,
        order_number: orderNumber,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'verify_session') {
      const { session_id } = body;

      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status !== 'paid') {
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Payment not completed' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if order already exists
      const { data: existingOrder } = await supabase
        .from('marketplace_orders')
        .select('id, order_number')
        .eq('payment_intent_id', session.payment_intent)
        .single();

      if (existingOrder) {
        return new Response(JSON.stringify({ 
          success: true, 
          order: existingOrder 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create order from session metadata
      const metadata = session.metadata || {};
      const cartId = metadata.cart_id;
      
      const { data: cart } = await supabase
        .from('marketplace_carts')
        .select('*')
        .eq('id', cartId)
        .single();

      if (!cart) {
        return new Response(JSON.stringify({ error: 'Cart not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get product details for order items
      const productIds = cart.items.map((item: any) => item.product_id);
      const { data: products } = await supabase
        .from('marketplace_products')
        .select('id, designer_id, price')
        .in('id', productIds);

      const shippingCost = parseFloat(metadata.shipping_cost || '0');
      const total = cart.subtotal + shippingCost - (cart.discount_amount || 0);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('marketplace_orders')
        .insert({
          order_number: metadata.order_number,
          customer_id: metadata.customer_id,
          items: cart.items,
          subtotal: cart.subtotal,
          shipping_cost: shippingCost,
          discount_amount: cart.discount_amount || 0,
          total: total,
          shipping_address: JSON.parse(metadata.shipping_address || '{}'),
          billing_address: JSON.parse(metadata.billing_address || '{}'),
          shipping_method: metadata.shipping_method,
          status: 'confirmed',
          payment_status: 'paid',
          payment_intent_id: session.payment_intent as string,
          payment_method: 'card',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items and calculate commissions
      const orderItems = cart.items.map((item: any) => {
        const product = products?.find((p: any) => p.id === item.product_id);
        const totalPrice = item.price * item.quantity;
        const productionCost = totalPrice / MARKUP_MULTIPLIER;
        const profit = totalPrice - productionCost;
        // Default 10% commission, can be enhanced with rank-based rates
        const designerCommission = profit * 0.1;
        const platformFee = profit - designerCommission;

        return {
          order_id: order.id,
          product_id: item.product_id,
          designer_id: product?.designer_id,
          variant_data: item.variant,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: totalPrice,
          designer_commission: designerCommission,
          platform_fee: platformFee,
        };
      });

      await supabase.from('marketplace_order_items').insert(orderItems);

      // Update product sold counts
      for (const item of cart.items) {
        const { data: currentProduct } = await supabase
          .from('marketplace_products')
          .select('sold_count, inventory_count')
          .eq('id', item.product_id)
          .single();
        
        if (currentProduct) {
          await supabase
            .from('marketplace_products')
            .update({ 
              sold_count: (currentProduct.sold_count || 0) + item.quantity,
              inventory_count: Math.max(0, (currentProduct.inventory_count || 0) - item.quantity),
            })
            .eq('id', item.product_id);
        }
      }

      // Clear cart
      await supabase
        .from('marketplace_carts')
        .update({ items: [], subtotal: 0, discount_code: null, discount_amount: 0 })
        .eq('id', cartId);

      logStep('Order created', { order_id: order.id, order_number: order.order_number });

      return new Response(JSON.stringify({ 
        success: true, 
        order 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logStep('Error', { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
