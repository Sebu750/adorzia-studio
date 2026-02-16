import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
<<<<<<< HEAD
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
};

interface BadgeAward {
  user_id: string;
  badge_name: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      team_submission_id, 
      badge_awards, 
      awarded_by,
      award_team_badge,
      team_badge_name = 'LEGACY ATELIER'
    } = await req.json();

    if (!team_submission_id) {
      return new Response(
        JSON.stringify({ error: 'team_submission_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Awarding badges for team submission ${team_submission_id}`);

    // Get the team submission to find team members
    const { data: submission, error: submissionError } = await supabase
      .from('team_stylebox_submissions')
      .select('team_id, role_assignments')
      .eq('id', team_submission_id)
      .single();

    if (submissionError || !submission) {
      return new Response(
        JSON.stringify({ error: 'Team submission not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const awardedBadges: any[] = [];
    const errors: string[] = [];

    // Award individual role badges
    if (badge_awards && Array.isArray(badge_awards)) {
      for (const award of badge_awards as BadgeAward[]) {
        // Get badge ID by name
        const { data: badge, error: badgeError } = await supabase
          .from('achievement_badges')
          .select('id')
          .eq('name', award.badge_name)
          .single();

        if (badgeError || !badge) {
          errors.push(`Badge "${award.badge_name}" not found`);
          continue;
        }

        // Check if already awarded
        const { data: existing } = await supabase
          .from('user_achievement_badges')
          .select('id')
          .eq('user_id', award.user_id)
          .eq('badge_id', badge.id)
          .eq('team_submission_id', team_submission_id)
          .maybeSingle();

        if (existing) {
          console.log(`Badge "${award.badge_name}" already awarded to user ${award.user_id}`);
          continue;
        }

        // Award the badge
        const { data: awardedBadge, error: awardError } = await supabase
          .from('user_achievement_badges')
          .insert({
            user_id: award.user_id,
            badge_id: badge.id,
            awarded_by,
            team_submission_id,
            notes: `Awarded for team challenge completion`
          })
          .select()
          .single();

        if (awardError) {
          errors.push(`Failed to award "${award.badge_name}" to user ${award.user_id}: ${awardError.message}`);
        } else {
          awardedBadges.push(awardedBadge);
          console.log(`Awarded "${award.badge_name}" to user ${award.user_id}`);

          // Create notification for the user
          await supabase.from('notifications').insert({
            user_id: award.user_id,
            type: 'submission',
            message: `Congratulations! You earned the "${award.badge_name}" badge!`
          });
        }
      }
    }

    // Award team badge to all members
    if (award_team_badge) {
      const { data: teamBadge } = await supabase
        .from('achievement_badges')
        .select('id')
        .eq('name', team_badge_name)
        .single();

      if (teamBadge) {
        // Get all team members
        const { data: members } = await supabase
          .from('team_members')
          .select('user_id')
          .eq('team_id', submission.team_id);

        if (members) {
          for (const member of members) {
            const { data: existing } = await supabase
              .from('user_achievement_badges')
              .select('id')
              .eq('user_id', member.user_id)
              .eq('badge_id', teamBadge.id)
              .eq('team_submission_id', team_submission_id)
              .maybeSingle();

            if (!existing) {
              await supabase.from('user_achievement_badges').insert({
                user_id: member.user_id,
                badge_id: teamBadge.id,
                awarded_by,
                team_submission_id,
                notes: 'Team achievement badge'
              });

              await supabase.from('notifications').insert({
                user_id: member.user_id,
                type: 'submission',
                message: `Your team earned the "${team_badge_name}" badge! You are now a Rank 4 candidate.`
              });

              console.log(`Awarded team badge to user ${member.user_id}`);
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        awarded_count: awardedBadges.length,
        awarded_badges: awardedBadges,
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error awarding badges:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
