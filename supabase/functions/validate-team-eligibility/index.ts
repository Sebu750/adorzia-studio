import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TeamMemberWithRank {
  user_id: string;
  role: string;
  rank_order: number;
  style_credits: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { team_id, stylebox_id } = await req.json();

    if (!team_id || !stylebox_id) {
      return new Response(
        JSON.stringify({ error: 'team_id and stylebox_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Validating team ${team_id} for stylebox ${stylebox_id}`);

    // Get stylebox requirements
    const { data: stylebox, error: styleboxError } = await supabase
      .from('styleboxes')
      .select('is_team_challenge, team_size, minimum_team_rank_order, team_role_requirements')
      .eq('id', stylebox_id)
      .single();

    if (styleboxError || !stylebox) {
      return new Response(
        JSON.stringify({ error: 'Stylebox not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!stylebox.is_team_challenge) {
      return new Response(
        JSON.stringify({ error: 'This is not a team challenge' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get team members with their profiles and ranks
    const { data: teamMembers, error: membersError } = await supabase
      .from('team_members')
      .select(`
        user_id,
        role,
        profiles!inner (
          style_credits,
          ranks!inner (
            rank_order
          )
        )
      `)
      .eq('team_id', team_id);

    if (membersError) {
      console.error('Error fetching team members:', membersError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch team members' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const memberCount = teamMembers?.length || 0;
    const requiredSize = stylebox.team_size || 4;
    const minimumRankOrder = stylebox.minimum_team_rank_order || 0;

    // Check team size
    if (memberCount < requiredSize) {
      return new Response(
        JSON.stringify({
          eligible: false,
          reason: `Team needs ${requiredSize} members, currently has ${memberCount}`,
          memberCount,
          requiredSize,
          members: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check each member's rank
    const membersWithRanks: TeamMemberWithRank[] = teamMembers.map((m: any) => ({
      user_id: m.user_id,
      role: m.role,
      rank_order: m.profiles?.ranks?.rank_order || 0,
      style_credits: m.profiles?.style_credits || 0
    }));

    const ineligibleMembers = membersWithRanks.filter(m => m.rank_order < minimumRankOrder);

    if (ineligibleMembers.length > 0) {
      return new Response(
        JSON.stringify({
          eligible: false,
          reason: `${ineligibleMembers.length} team member(s) do not meet the minimum rank requirement`,
          minimumRankOrder,
          ineligibleMembers: ineligibleMembers.map(m => m.user_id),
          members: membersWithRanks
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // All checks passed
    console.log(`Team ${team_id} is eligible for stylebox ${stylebox_id}`);
    return new Response(
      JSON.stringify({
        eligible: true,
        memberCount,
        requiredSize,
        minimumRankOrder,
        members: membersWithRanks,
        teamRoles: stylebox.team_role_requirements
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error validating team eligibility:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
