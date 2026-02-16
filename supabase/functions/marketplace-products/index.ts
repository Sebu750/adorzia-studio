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
const createResponse = (body: unknown, status = 200) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...corsHeaders
  };
  return new Response(body ? JSON.stringify(body) : null, { status, headers });
};

const logStep = (step: string, details?: unknown) => {
=======
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  console.log(`[MARKETPLACE-PRODUCTS] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
<<<<<<< HEAD
  // OPTIONS preflight always succeeds with proper CORS headers
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing environment variables: SUPABASE_URL or SUPABASE_ANON_KEY');
      return createResponse({ error: 'Server configuration error' }, 500);
    }
    
=======
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'list';
    
    logStep('Processing request', { action, method: req.method });

    if (action === 'list') {
      // List products with filters
      const category = url.searchParams.get('category');
      const designer = url.searchParams.get('designer');
      const minPrice = url.searchParams.get('minPrice');
      const maxPrice = url.searchParams.get('maxPrice');
      const sort = url.searchParams.get('sort') || 'newest';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '12');
      const search = url.searchParams.get('search');
      const featured = url.searchParams.get('featured');
      const bestseller = url.searchParams.get('bestseller');

      let query = supabase
        .from('marketplace_products')
        .select(`
          *,
<<<<<<< HEAD
          category:marketplace_categories(id, name, slug)
        `, { count: 'exact' })
        .eq('status', 'live');
=======
          designer:profiles!marketplace_products_designer_id_fkey(id, name, avatar_url),
          category:marketplace_categories(id, name, slug)
        `, { count: 'exact' })
        .eq('status', 'active');
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

      if (category) {
        query = query.eq('category_id', category);
      }
      if (designer) {
        query = query.eq('designer_id', designer);
      }
      if (minPrice) {
        query = query.gte('price', parseFloat(minPrice));
      }
      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice));
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }
      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }
      if (bestseller === 'true') {
        query = query.eq('is_bestseller', true);
      }

      // Sorting
      switch (sort) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('average_rating', { ascending: false });
          break;
        case 'bestselling':
          query = query.order('sold_count', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data: products, count, error } = await query;

      if (error) {
        logStep('Error fetching products', error);
<<<<<<< HEAD
        return createResponse({ error: error.message }, 500);
=======
        throw error;
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      }

      logStep('Products fetched', { count, page, limit });

<<<<<<< HEAD
      return createResponse({
=======
      return new Response(JSON.stringify({
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        products,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil((count || 0) / limit),
        },
<<<<<<< HEAD
=======
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      });
    }

    if (action === 'detail') {
      const productId = url.searchParams.get('id');
      const slug = url.searchParams.get('slug');

      if (!productId && !slug) {
<<<<<<< HEAD
        return createResponse({ error: 'Product ID or slug required' }, 400);
=======
        return new Response(JSON.stringify({ error: 'Product ID or slug required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      }

      let query = supabase
        .from('marketplace_products')
        .select(`
          *,
<<<<<<< HEAD
          category:marketplace_categories(id, name, slug)
        `)
        .eq('status', 'live');
=======
          designer:profiles!marketplace_products_designer_id_fkey(id, name, avatar_url, bio),
          category:marketplace_categories(id, name, slug)
        `)
        .eq('status', 'active');
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

      if (productId) {
        query = query.eq('id', productId);
      } else if (slug) {
        query = query.eq('slug', slug);
      }

      const { data: product, error } = await query.single();

      if (error) {
        logStep('Error fetching product', error);
<<<<<<< HEAD
        return createResponse({ error: 'Product not found' }, 404);
=======
        return new Response(JSON.stringify({ error: 'Product not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      }

      // Increment view count
      await supabase
        .from('marketplace_products')
        .update({ view_count: (product.view_count || 0) + 1 })
        .eq('id', product.id);

<<<<<<< HEAD
      // Fetch related products - NJAL Logic: Prioritize same designer
      const { data: sameDesignerProducts } = await supabase
        .from('marketplace_products')
        .select('id, title, price, images, designer_id, average_rating')
        .eq('status', 'live')
        .eq('designer_id', product.designer_id)
        .neq('id', product.id)
        .limit(4);

      let relatedProducts = sameDesignerProducts || [];
      
      if (relatedProducts.length < 4) {
        const excludeIds = [product.id, ...relatedProducts.map(p => p.id)];
        const { data: categoryProducts } = await supabase
          .from('marketplace_products')
          .select('id, title, price, images, designer_id, average_rating')
          .eq('status', 'live')
          .eq('category_id', product.category_id)
          .not('id', 'in', `(${excludeIds.join(',')})`)
          .limit(4 - relatedProducts.length);
        
        relatedProducts = [...relatedProducts, ...(categoryProducts || [])];
      }

=======
      // Fetch related products
      const { data: relatedProducts } = await supabase
        .from('marketplace_products')
        .select('id, title, price, images, designer_id, average_rating')
        .eq('status', 'active')
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .limit(4);

>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      // Fetch reviews
      const { data: reviews } = await supabase
        .from('marketplace_reviews')
        .select(`
          *,
          customer:marketplace_customers(name)
        `)
        .eq('product_id', product.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(10);

      logStep('Product fetched', { id: product.id });

<<<<<<< HEAD
      return createResponse({
        product,
        relatedProducts: relatedProducts || [],
        reviews: reviews || [],
=======
      return new Response(JSON.stringify({
        product,
        relatedProducts: relatedProducts || [],
        reviews: reviews || [],
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      });
    }

    if (action === 'categories') {
      const { data: categories, error } = await supabase
        .from('marketplace_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

<<<<<<< HEAD
      if (error) {
        return createResponse({ error: error.message }, 500);
      }

      return createResponse({ categories });
=======
      if (error) throw error;

      return new Response(JSON.stringify({ categories }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    }

    if (action === 'collections') {
      const featured = url.searchParams.get('featured');
      
      let query = supabase
        .from('marketplace_collections')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }

      const { data: collections, error } = await query;

<<<<<<< HEAD
      if (error) {
        return createResponse({ error: error.message }, 500);
      }

      return createResponse({ collections });
    }

    return createResponse({ error: 'Invalid action' }, 400);
=======
      if (error) throw error;

      return new Response(JSON.stringify({ collections }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logStep('Error', { message: errorMessage });
<<<<<<< HEAD
    return createResponse({ error: errorMessage }, 500);
=======
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  }
});
