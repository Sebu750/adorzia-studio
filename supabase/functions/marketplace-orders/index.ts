import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
<<<<<<< HEAD
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-proto, x-real-ip',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// Enhanced response helper to ensure CORS headers are always included
const createResponse = (body: string | Record<string, unknown>, status = 200, includeCors = true) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(includeCors ? corsHeaders : {})
  };
  return new Response(JSON.stringify(body), { status, headers });
=======
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
};

const logStep = (step: string, details?: any) => {
  console.log(`[MARKETPLACE-ORDERS] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
<<<<<<< HEAD
  // OPTIONS preflight always succeeds with proper CORS headers
  if (req.method === 'OPTIONS') {
    return createResponse(null, 204, true);
=======
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
<<<<<<< HEAD
      return createResponse({ error: 'Authorization required' }, 401, true);
=======
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
<<<<<<< HEAD
      return createResponse({ error: 'Invalid token' }, 401, true);
=======
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    }

    // Get customer ID
    const { data: customer } = await supabase
      .from('marketplace_customers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!customer) {
<<<<<<< HEAD
      return createResponse({ error: 'Customer not found' }, 404, true);
=======
      return new Response(JSON.stringify({ error: 'Customer not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'list';

    logStep('Processing request', { action, customer_id: customer.id });

    if (action === 'list') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const status = url.searchParams.get('status');

      let query = supabase
        .from('marketplace_orders')
        .select('*', { count: 'exact' })
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data: orders, count, error } = await query;

      if (error) throw error;

      logStep('Orders fetched', { count });

      return new Response(JSON.stringify({
        orders,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil((count || 0) / limit),
        },
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'detail') {
      const orderId = url.searchParams.get('id');
      const orderNumber = url.searchParams.get('order_number');

      if (!orderId && !orderNumber) {
        return new Response(JSON.stringify({ error: 'Order ID or number required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let query = supabase
        .from('marketplace_orders')
        .select('*')
        .eq('customer_id', customer.id);

      if (orderId) {
        query = query.eq('id', orderId);
      } else {
        query = query.eq('order_number', orderNumber);
      }

      const { data: order, error } = await query.single();

      if (error || !order) {
        return new Response(JSON.stringify({ error: 'Order not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Fetch order items with product details
      const { data: orderItems } = await supabase
        .from('marketplace_order_items')
        .select(`
          *,
          product:marketplace_products(id, title, images)
        `)
        .eq('order_id', order.id);

      logStep('Order detail fetched', { order_id: order.id });

      return new Response(JSON.stringify({
        order,
        items: orderItems || [],
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'cancel') {
      const body = await req.json();
      const { order_id, reason } = body;

      const { data: order, error: orderError } = await supabase
        .from('marketplace_orders')
        .select('*')
        .eq('id', order_id)
        .eq('customer_id', customer.id)
        .single();

      if (orderError || !order) {
        return new Response(JSON.stringify({ error: 'Order not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Only allow cancellation of pending/confirmed orders
      if (!['pending', 'confirmed'].includes(order.status)) {
        return new Response(JSON.stringify({ error: 'Order cannot be cancelled' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: updatedOrder, error: updateError } = await supabase
        .from('marketplace_orders')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          notes: reason ? `Customer cancelled: ${reason}` : 'Cancelled by customer',
        })
        .eq('id', order_id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Restore inventory
      for (const item of order.items) {
        const { data: currentProduct } = await supabase
          .from('marketplace_products')
          .select('sold_count, inventory_count')
          .eq('id', item.product_id)
          .single();
        
        if (currentProduct) {
          await supabase
            .from('marketplace_products')
            .update({
              inventory_count: (currentProduct.inventory_count || 0) + item.quantity,
              sold_count: Math.max(0, (currentProduct.sold_count || 0) - item.quantity),
            })
            .eq('id', item.product_id);
        }
      }

      logStep('Order cancelled', { order_id });

      return new Response(JSON.stringify({ order: updatedOrder }), {
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
