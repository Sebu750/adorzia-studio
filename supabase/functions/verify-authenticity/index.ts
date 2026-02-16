import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * FR 1.6: Authenticity Verification Edge Function
 * - Verify product authenticity by certificate/serial/verification code
 * - Generate certificates for products
 * - Public verification endpoint for customers
 */

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

interface VerificationRequest {
  action: 'verify' | 'generate' | 'get_certificate';
  verification_code?: string;
  serial_number?: string;
  certificate_number?: string;
  product_id?: string;
}

serve(async (req) => {
  // OPTIONS preflight always succeeds with proper CORS headers
  if (req.method === 'OPTIONS') {
    return createResponse(null, 204, true);
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return createResponse({ error: 'Server configuration error' }, 500, true);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: VerificationRequest = await req.json();
    const { action, verification_code, serial_number, certificate_number, product_id } = body;

    // Public verification - no auth required
    if (action === 'verify') {
      let query = supabase
        .from('order_item_certificates')
        .select(`
          *,
          certificate:product_authenticity_certificates (
            *,
            product:marketplace_products (
              id,
              title,
              images
            ),
            designer:profiles!designer_id (
              id,
              name,
              brand_name,
              avatar_url
            )
          )
        `);

      if (verification_code) {
        query = query.eq('verification_code', verification_code.toUpperCase());
      } else if (serial_number) {
        query = query.eq('serial_number', serial_number.toUpperCase());
      } else {
        return new Response(
          JSON.stringify({ error: 'verification_code or serial_number required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: certificate, error } = await query.single();

      if (error || !certificate) {
        return new Response(
          JSON.stringify({
            verified: false,
            message: 'Certificate not found or invalid',
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update verification count
      await supabase
        .from('order_item_certificates')
        .update({
          last_verified_at: new Date().toISOString(),
          verification_count: (certificate.verification_count || 0) + 1,
        })
        .eq('id', certificate.id);

      return new Response(
        JSON.stringify({
          verified: true,
          certificate: {
            serial_number: certificate.serial_number,
            certificate_number: certificate.certificate.certificate_number,
            issue_date: certificate.issued_at,
            product: {
              id: certificate.certificate.product.id,
              title: certificate.certificate.product.title,
              image: certificate.certificate.product.images?.[0],
            },
            designer: {
              name: certificate.certificate.designer.name,
              brand_name: certificate.certificate.designer.brand_name,
              avatar: certificate.certificate.designer.avatar_url,
            },
            authenticity: {
              materials: certificate.certificate.materials_certified,
              production_location: certificate.certificate.production_location,
              production_date: certificate.certificate.production_date,
              craftsmanship_notes: certificate.certificate.craftsmanship_notes,
            },
            verification_stats: {
              verified_count: certificate.verification_count + 1,
              last_verified: new Date().toISOString(),
            },
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get product certificate (public for product pages)
    if (action === 'get_certificate' && product_id) {
      const { data: certificate, error } = await supabase
        .from('product_authenticity_certificates')
        .select(`
          *,
          designer:profiles!designer_id (
            id,
            name,
            brand_name,
            avatar_url
          ),
          ip_links:product_ip_linkage (
            ip_registry:designer_ip_registry (
              ip_type,
              registration_number,
              registration_country,
              design_name,
              status
            )
          )
        `)
        .eq('product_id', product_id)
        .eq('is_active', true)
        .single();

      if (error || !certificate) {
        return new Response(
          JSON.stringify({ error: 'Certificate not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          certificate_number: certificate.certificate_number,
          designer: {
            name: certificate.designer.name,
            brand_name: certificate.designer.brand_name,
            signature: certificate.designer_signature,
          },
          design_info: {
            date: certificate.design_date,
            description: certificate.design_description,
          },
          materials: certificate.materials_certified,
          production: {
            location: certificate.production_location,
            date: certificate.production_date,
          },
          intellectual_property: certificate.ip_links.map((link: any) => ({
            type: link.ip_registry.ip_type,
            registration_number: link.ip_registry.registration_number,
            country: link.ip_registry.registration_country,
            design_name: link.ip_registry.design_name,
            status: link.ip_registry.status,
          })),
          qr_code_url: certificate.qr_code_url,
          certificate_pdf_url: certificate.certificate_pdf_url,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate certificate (admin only - would need auth check)
    if (action === 'generate' && product_id) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get product and designer info
      const { data: product, error: productError } = await supabase
        .from('marketplace_products')
        .select('*, designer:profiles!designer_id(id, name, brand_name)')
        .eq('id', product_id)
        .single();

      if (productError || !product) {
        return new Response(
          JSON.stringify({ error: 'Product not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate certificate number
      const { data: certNumber } = await supabase.rpc('generate_certificate_number', {
        p_designer_id: product.designer_id,
      });

      // Create hash for blockchain (SHA-256 of key data)
      const hashData = `${product_id}:${product.designer_id}:${certNumber}:${new Date().toISOString()}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(hashData);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const certificate_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Insert certificate
      const { data: certificate, error: certError } = await supabase
        .from('product_authenticity_certificates')
        .insert({
          product_id,
          designer_id: product.designer_id,
          certificate_number: certNumber,
          designer_name: product.designer.brand_name || product.designer.name,
          materials_certified: product.materials,
          certificate_hash,
        })
        .select()
        .single();

      if (certError) throw certError;

      return new Response(
        JSON.stringify({
          success: true,
          certificate,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
