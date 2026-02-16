import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
<<<<<<< HEAD
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  "Content-Type": "application/xml",
};

const BASE_URL = "https://adorzia.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Fetch all live products
    const { data: products } = await supabase
      .from("marketplace_products")
      .select("slug, updated_at")
      .eq("status", "live");

    // Fetch all active categories
    const { data: categories } = await supabase
      .from("marketplace_categories")
      .select("slug, updated_at")
      .eq("is_active", true);

    // Fetch all published articles
    const { data: articles } = await supabase
      .from("articles")
      .select("slug, updated_at")
      .eq("status", "published");

    const today = new Date().toISOString().split("T")[0];

    // Static pages
    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/about", priority: "0.8", changefreq: "monthly" },
      { url: "/pricing", priority: "0.8", changefreq: "weekly" },
      { url: "/shop", priority: "0.9", changefreq: "daily" },
      { url: "/shop/products", priority: "0.9", changefreq: "daily" },
      { url: "/designers", priority: "0.7", changefreq: "weekly" },
      { url: "/styleboxes-info", priority: "0.7", changefreq: "monthly" },
      { url: "/studio-info", priority: "0.7", changefreq: "monthly" },
      { url: "/monetization", priority: "0.7", changefreq: "monthly" },
      { url: "/competitions", priority: "0.7", changefreq: "weekly" },
      { url: "/brands", priority: "0.7", changefreq: "monthly" },
      { url: "/support", priority: "0.5", changefreq: "monthly" },
      { url: "/articles", priority: "0.8", changefreq: "daily" },
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add static pages
    for (const page of staticPages) {
      sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add category pages
    if (categories) {
      for (const category of categories) {
        const lastmod = category.updated_at
          ? new Date(category.updated_at).toISOString().split("T")[0]
          : today;
        sitemap += `  <url>
    <loc>${BASE_URL}/shop/category/${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }
    }

    // Add product pages
    if (products) {
      for (const product of products) {
        const lastmod = product.updated_at
          ? new Date(product.updated_at).toISOString().split("T")[0]
          : today;
        sitemap += `  <url>
    <loc>${BASE_URL}/shop/product/${product.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }
    }

    // Add article pages
    if (articles) {
      for (const article of articles) {
        const lastmod = article.updated_at
          ? new Date(article.updated_at).toISOString().split("T")[0]
          : today;
        sitemap += `  <url>
    <loc>${BASE_URL}/articles/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      }
    }

    sitemap += `</urlset>`;

    console.log(`Generated sitemap with ${staticPages.length} static pages, ${categories?.length || 0} categories, ${products?.length || 0} products, ${articles?.length || 0} articles`);

    return new Response(sitemap, { headers: corsHeaders });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
