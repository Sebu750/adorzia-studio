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

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
<<<<<<< HEAD
  console.log(`[CALC-SCORE] ${step}${detailsStr}`);
=======
  console.log(`[CALCULATE-DESIGNER-SCORE] ${step}${detailsStr}`);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
};

// Difficulty base points
const DIFFICULTY_POINTS: Record<string, number> = {
  free: 5,
  easy: 10,
  medium: 25,
  hard: 50,
  insane: 100,
};

// Score weights
const SCORE_WEIGHTS = {
  stylebox: 0.30,
  portfolio: 0.35,
  publication: 0.15,
  selling: 0.20,
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

    const { designer_id } = await req.json();
    
    if (!designer_id) {
      throw new Error("designer_id is required");
    }
    
    logStep("Processing designer", { designer_id });

    // 1. Calculate Stylebox Score (30%)
    // Get all approved stylebox submissions with evaluation scores
    const { data: submissions, error: submissionsError } = await supabaseClient
      .from('stylebox_submissions')
      .select(`
        id,
        stylebox_id,
        status,
        styleboxes (
          difficulty
        ),
        stylebox_evaluation_scores (
          final_weighted_score
        )
      `)
      .eq('designer_id', designer_id)
      .eq('status', 'approved');
    
    if (submissionsError) {
      logStep("Error fetching submissions", { error: submissionsError.message });
    }

    let styleboxScore = 0;
    if (submissions && submissions.length > 0) {
      for (const sub of submissions) {
        const evalScore = sub.stylebox_evaluation_scores?.[0]?.final_weighted_score;
        if (evalScore) {
          styleboxScore += evalScore;
        } else {
          // Fallback: use base difficulty points
          const difficulty = (sub.styleboxes as any)?.difficulty || 'easy';
          styleboxScore += DIFFICULTY_POINTS[difficulty] || 10;
        }
      }
    }
    logStep("Stylebox score calculated", { styleboxScore, submissionCount: submissions?.length || 0 });

    // 2. Calculate Portfolio Score (35%)
    // Based on approved portfolio items and quality scores
    const { data: portfolios, error: portfoliosError } = await supabaseClient
      .from('portfolios')
      .select('id, quality_score, status')
      .eq('designer_id', designer_id)
      .in('status', ['approved', 'published']);
    
    if (portfoliosError) {
      logStep("Error fetching portfolios", { error: portfoliosError.message });
    }

    let portfolioScore = 0;
    if (portfolios && portfolios.length > 0) {
      // Base score per approved portfolio + quality bonus
      for (const p of portfolios) {
        portfolioScore += 20; // Base per portfolio
        if (p.quality_score) {
          portfolioScore += (p.quality_score / 100) * 30; // Quality bonus up to 30
        }
      }
    }
    logStep("Portfolio score calculated", { portfolioScore, portfolioCount: portfolios?.length || 0 });

    // 3. Calculate Publication Score (15%)
    // Based on published items
    const { data: publications, error: publicationsError } = await supabaseClient
      .from('portfolio_publications')
      .select('id, status, quality_rating')
      .eq('status', 'published');
    
    // Filter publications that belong to this designer's portfolios
    const { data: designerPortfolios } = await supabaseClient
      .from('portfolios')
      .select('id')
      .eq('designer_id', designer_id);
    
    const portfolioIds = designerPortfolios?.map(p => p.id) || [];
    
    let publicationScore = 0;
    if (publications && portfolioIds.length > 0) {
      const designerPublications = publications.filter(
        pub => portfolioIds.includes((pub as any).portfolio_id)
      );
      for (const pub of designerPublications) {
        publicationScore += 50; // Base per publication
        if (pub.quality_rating) {
          publicationScore += pub.quality_rating * 5; // Quality bonus
        }
      }
    }
    logStep("Publication score calculated", { publicationScore });

    // 4. Calculate Selling Score (20%)
    // Based on sales and revenue
    const { data: sales, error: salesError } = await supabaseClient
      .from('product_sales')
      .select(`
        id,
        total_revenue,
        designer_share,
        marketplace_products!inner (
          designer_id
        )
      `)
      .eq('marketplace_products.designer_id', designer_id);
    
    let sellingScore = 0;
    if (sales && sales.length > 0) {
      const totalRevenue = sales.reduce((sum, s) => sum + (s.designer_share || 0), 0);
      // Score based on revenue tiers
      if (totalRevenue >= 10000) sellingScore = 100;
      else if (totalRevenue >= 5000) sellingScore = 80;
      else if (totalRevenue >= 1000) sellingScore = 60;
      else if (totalRevenue >= 500) sellingScore = 40;
      else if (totalRevenue >= 100) sellingScore = 20;
      else if (totalRevenue > 0) sellingScore = 10;
    }
    logStep("Selling score calculated", { sellingScore, salesCount: sales?.length || 0 });

    // Calculate weighted total
    const weightedTotal = 
      (styleboxScore * SCORE_WEIGHTS.stylebox) +
      (portfolioScore * SCORE_WEIGHTS.portfolio) +
      (publicationScore * SCORE_WEIGHTS.publication) +
      (sellingScore * SCORE_WEIGHTS.selling);

    logStep("Weighted total calculated", { weightedTotal });

    // Upsert designer_scores
    const { data: scoreData, error: upsertError } = await supabaseClient
      .from('designer_scores')
      .upsert({
        designer_id,
        stylebox_score: styleboxScore,
        portfolio_score: portfolioScore,
        publication_score: publicationScore,
        selling_score: sellingScore,
        last_calculated_at: new Date().toISOString(),
      }, {
        onConflict: 'designer_id',
      })
      .select()
      .single();

    if (upsertError) {
      logStep("Error upserting scores", { error: upsertError.message });
      throw new Error(`Failed to save scores: ${upsertError.message}`);
    }

    logStep("Scores saved successfully", { scoreData });

    return new Response(JSON.stringify({
      success: true,
      scores: {
        stylebox_score: styleboxScore,
        portfolio_score: portfolioScore,
        publication_score: publicationScore,
        selling_score: sellingScore,
        weighted_total: weightedTotal,
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in calculate-designer-score", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
