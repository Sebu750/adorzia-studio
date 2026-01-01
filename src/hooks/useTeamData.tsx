import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface TeamMember {
  name: string;
  avatar: string | null;
  role: string;
}

export interface TeamData {
  teamName: string;
  activeProject: string | null;
  members: TeamMember[];
  unreadMessages: number;
}

export interface TeamDataResult {
  team: TeamData | null;
  loading: boolean;
  error: string | null;
}

export function useTeamData(): TeamDataResult {
  const { user } = useAuth();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Find user's team membership
        const { data: membership, error: memberError } = await supabase
          .from("team_members")
          .select(`
            team_id,
            role,
            teams (
              id,
              name
            )
          `)
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (memberError) throw memberError;

        if (!membership) {
          setTeam(null);
          setLoading(false);
          return;
        }

        const teamInfo = membership.teams as any;

        // Fetch team members
        const { data: membersData, error: membersError } = await supabase
          .from("team_members")
          .select(`
            user_id,
            role
          `)
          .eq("team_id", membership.team_id);

        if (membersError) throw membersError;

        // Fetch profiles for team members
        const memberIds = membersData?.map(m => m.user_id) || [];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, name, avatar_url")
          .in("user_id", memberIds);

        const members: TeamMember[] = (membersData || []).map(m => {
          const profile = profiles?.find(p => p.user_id === m.user_id);
          return {
            name: profile?.name || "Unknown",
            avatar: profile?.avatar_url || null,
            role: m.role === "lead" ? "Lead" : "Member",
          };
        });

        // Fetch active team stylebox submission
        const { data: activeSubmission } = await supabase
          .from("team_stylebox_submissions")
          .select(`
            styleboxes (
              title
            )
          `)
          .eq("team_id", membership.team_id)
          .in("status", ["forming", "in_progress", "submitted"])
          .limit(1)
          .maybeSingle();

        const activeProject = activeSubmission?.styleboxes 
          ? (activeSubmission.styleboxes as any).title 
          : null;

        setTeam({
          teamName: teamInfo?.name || "My Team",
          activeProject,
          members,
          unreadMessages: 0, // Would need a messages table to track this
        });
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch team data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { team, loading, error };
}
