import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-proto, x-real-ip',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// Enhanced response helper to ensure CORS headers are always included
const createResponse = (body: string | Record<string, unknown> | null, status = 200, includeCors = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(includeCors ? corsHeaders : {})
  };
  return new Response(body ? JSON.stringify(body) : null, { status, headers });
};

const logStep = (step: string, details?: any) => {
  console.log(`[MARKETPLACE-CART] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  // OPTIONS preflight always succeeds with proper CORS headers
  if (req.method === 'OPTIONS') {
    return createResponse(null, 204, true);
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return createResponse({ error: 'Server configuration error' }, 500, true);
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    let customerId: string | null = null;
    let sessionId: string | null = null;

    // Try to get user from auth
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        // Get or create customer record
        const { data: customer } = await supabase
          .from('marketplace_customers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (customer) {
          customerId = customer.id;
        } else {
          // Create customer record
          const { data: newCustomer } = await supabase
            .from('marketplace_customers')
            .insert({
              user_id: user.id,
              email: user.email,
              name: user.user_metadata?.name,
            })
            .select('id')
            .single();
          
          if (newCustomer) {
            customerId = newCustomer.id;
          }
        }
      }
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action || 'get';
    sessionId = body.session_id;

    logStep('Processing request', { action, customerId, sessionId });

    // Get or create cart
    const getCart = async () => {
      let query = supabase.from('marketplace_carts').select('*');
      
      if (customerId) {
        query = query.eq('customer_id', customerId);
      } else if (sessionId) {
        query = query.eq('session_id', sessionId);
      } else {
        return null;
      }

      const { data: cart } = await query.single();
      return cart;
    };

    const createCart = async () => {
      const { data: cart } = await supabase
        .from('marketplace_carts')
        .insert({
          customer_id: customerId,
          session_id: sessionId,
          items: [],
          subtotal: 0,
        })
        .select()
        .single();
      return cart;
    };

    const calculateSubtotal = (items: any[]) => {
      return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    if (action === 'get') {
      let cart = await getCart();
      
      if (!cart) {
        cart = await createCart();
      }

      // Enrich cart items with product and designer data
      if (cart && cart.items?.length > 0) {
        const productIds = cart.items.map((item: any) => item.product_id);
        const { data: products } = await supabase
          .from('marketplace_products')
          .select(`
            id, title, price, images, inventory_count, status, designer_id,
            designer:designer_profiles!marketplace_products_designer_id_fkey(brand_name, full_name)
          `)
          .in('id', productIds);

        const enrichedItems = cart.items.map((item: any) => {
          const product = products?.find((p: any) => p.id === item.product_id);
          return {
            ...item,
            product,
            designer_name: product?.designer?.brand_name || product?.designer?.full_name,
            available: product?.status === 'active' && (product?.inventory_count || 0) >= item.quantity,
          };
        });

        cart.items = enrichedItems;
      }

      return new Response(JSON.stringify({ cart }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'add') {
      const { product_id, quantity = 1, variant } = body;

      if (!product_id) {
        return new Response(JSON.stringify({ error: 'Product ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Fetch product details with designer info
      const { data: product } = await supabase
        .from('marketplace_products')
        .select(`
          id, title, price, images, inventory_count, status,
          designer:designer_profiles!marketplace_products_designer_id_fkey(brand_name, full_name)
        `)
        .eq('id', product_id)
        .eq('status', 'active')
        .single();

      if (!product) {
        return new Response(JSON.stringify({ error: 'Product not found or unavailable' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let cart = await getCart();
      if (!cart) {
        cart = await createCart();
      }

      const items = cart?.items || [];
      const existingIndex = items.findIndex((item: any) => 
        item.product_id === product_id && 
        JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (existingIndex >= 0) {
        items[existingIndex].quantity += quantity;
      } else {
        items.push({
          product_id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || null,
          designer_name: product.designer?.brand_name || product.designer?.full_name,
          quantity,
          variant,
        });
      }

      const subtotal = calculateSubtotal(items);

      const { data: updatedCart, error } = await supabase
        .from('marketplace_carts')
        .update({ items, subtotal, updated_at: new Date().toISOString() })
        .eq('id', cart.id)
        .select()
        .single();

      if (error) throw error;

      logStep('Item added to cart', { product_id, quantity });

      return new Response(JSON.stringify({ cart: updatedCart, message: 'Item added to cart' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update') {
      const { product_id, quantity, variant } = body;

      let cart = await getCart();
      if (!cart) {
        return new Response(JSON.stringify({ error: 'Cart not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const items = cart.items || [];
      const itemIndex = items.findIndex((item: any) => 
        item.product_id === product_id && 
        JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (itemIndex < 0) {
        return new Response(JSON.stringify({ error: 'Item not in cart' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (quantity <= 0) {
        items.splice(itemIndex, 1);
      } else {
        items[itemIndex].quantity = quantity;
      }

      const subtotal = calculateSubtotal(items);

      const { data: updatedCart } = await supabase
        .from('marketplace_carts')
        .update({ items, subtotal, updated_at: new Date().toISOString() })
        .eq('id', cart.id)
        .select()
        .single();

      logStep('Cart item updated', { product_id, quantity });

      return new Response(JSON.stringify({ cart: updatedCart }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'remove') {
      const { product_id, variant } = body;

      let cart = await getCart();
      if (!cart) {
        return new Response(JSON.stringify({ error: 'Cart not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const items = (cart.items || []).filter((item: any) => 
        !(item.product_id === product_id && JSON.stringify(item.variant) === JSON.stringify(variant))
      );

      const subtotal = calculateSubtotal(items);

      const { data: updatedCart } = await supabase
        .from('marketplace_carts')
        .update({ items, subtotal, updated_at: new Date().toISOString() })
        .eq('id', cart.id)
        .select()
        .single();

      logStep('Item removed from cart', { product_id });

      return new Response(JSON.stringify({ cart: updatedCart }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'clear') {
      let cart = await getCart();
      if (!cart) {
        return new Response(JSON.stringify({ error: 'Cart not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: updatedCart } = await supabase
        .from('marketplace_carts')
        .update({ items: [], subtotal: 0, discount_code: null, discount_amount: 0 })
        .eq('id', cart.id)
        .select()
        .single();

      logStep('Cart cleared');

      return new Response(JSON.stringify({ cart: updatedCart }), {
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
