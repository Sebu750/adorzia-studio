import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface TeamMember {
  user_id: string;
  name: string;
  avatar: string | null;
  role: 'lead' | 'member';
  joined_at: string;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  category: string;
  max_members: number;
  member_count?: number;
  is_open: boolean;
  is_preview?: boolean;
  completed_challenges: number;
  created_at: string;
  created_by: string;
  banner_url?: string | null;
  logo_url?: string | null;
}

export interface TeamWithMembers extends Team {
  members: TeamMember[];
  member_count: number;
  active_project: string | null;
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  team_name: string;
  inviter_name: string;
  message: string | null;
  created_at: string;
  status: string;
}

export interface JoinRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  message: string | null;
  created_at: string;
  status: string;
}

export function useTeams() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myTeam, setMyTeam] = useState<TeamWithMembers | null>(null);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's team
  const fetchMyTeam = async () => {
    if (!user) return;

    try {
      console.log("[useTeams] Fetching my team for user:", user.id);

      // Find user's team membership
      const { data: membership, error: memberError } = await supabase
        .from("team_members")
        .select("team_id, role, joined_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (memberError) throw memberError;

      if (!membership) {
        setMyTeam(null);
        return;
      }

      // Fetch team details
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("id", membership.team_id)
        .single();

      if (teamError) throw teamError;

      // Fetch all team members
      const { data: membersData, error: membersError } = await supabase
        .from("team_members")
        .select("user_id, role, joined_at")
        .eq("team_id", membership.team_id);

      if (membersError) throw membersError;

      // Fetch profiles for members
      const memberIds = membersData?.map(m => m.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name, avatar_url")
        .in("user_id", memberIds);

      const members: TeamMember[] = (membersData || []).map(m => {
        const profile = profiles?.find(p => p.user_id === m.user_id);
        return {
          user_id: m.user_id,
          name: profile?.name || "Unknown",
          avatar: profile?.avatar_url || null,
          role: m.role as 'lead' | 'member',
          joined_at: m.joined_at,
        };
      });

      // Fetch active project (team stylebox submission)
      const { data: activeSubmission } = await supabase
        .from("team_stylebox_submissions")
        .select("styleboxes(title)")
        .eq("team_id", membership.team_id)
        .in("status", ["forming", "in_progress", "submitted"])
        .limit(1)
        .maybeSingle();

      const activeProject = activeSubmission?.styleboxes 
        ? (activeSubmission.styleboxes as any).title 
        : null;

      setMyTeam({
        ...teamData,
        members,
        member_count: members.length,
        active_project: activeProject,
      });

      console.log("[useTeams] Team loaded:", teamData.name);
    } catch (err) {
      console.error("[useTeams] Error fetching my team:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch team");
    }
  };

  // Fetch available teams (open teams user can join)
  const fetchAvailableTeams = async () => {
    if (!user) {
      console.log("[useTeams] ❌ No user, skipping fetchAvailableTeams");
      return;
    }

    try {
      console.log("[useTeams] 🔍 Fetching available teams for user:", user.id);
      
      const { data, error } = await supabase
        .from("teams")
        .select(`
          *,
          team_members(count)
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      console.log("[useTeams] 📊 Raw query result:", { 
        success: !error, 
        dataLength: data?.length || 0,
        error: error?.message || null,
        errorCode: error?.code || null
      });

      if (error) {
        console.error("[useTeams] ❌ Query error:", JSON.stringify(error, null, 2));
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn("[useTeams] ⚠️ No teams returned from database!");
        setAvailableTeams([]);
        return;
      }

      console.log("[useTeams] 📋 Teams from DB:", data.map(t => ({ 
        id: t.id, 
        name: t.name, 
        is_open: t.is_open
      })));

      // Include all teams (both open and preview teams), add member count
      const formatted = (data || []).map(team => {
        const isPreview = team.id.startsWith('00000000-');
        const memberCount = Array.isArray(team.team_members) 
          ? team.team_members.length 
          : (team.team_members as any)?.count || 0;
        
        return {
          ...team,
          member_count: memberCount,
          is_preview: isPreview,
        };
      });

      console.log("[useTeams] ✅ Formatted teams:", formatted.length);

      // Filter out user's own team if they have one
      const filtered = formatted.filter(team => !myTeam || team.id !== myTeam.id);

      console.log("[useTeams] 🎯 Final filtered teams:", {
        total: filtered.length,
        myTeamId: myTeam?.id || 'none',
        teamNames: filtered.map(t => t.name)
      });
      
      setAvailableTeams(filtered);
    } catch (err) {
      console.error("[useTeams] ❌ Error fetching available teams:", err);
      console.error("[useTeams] Error details:", {
        message: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  // Fetch pending invitations
  const fetchInvitations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("team_invitations")
        .select(`
          id,
          team_id,
          message,
          created_at,
          status,
          teams(name),
          profiles!team_invitations_inviter_id_fkey(name)
        `)
        .eq("invitee_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted: TeamInvitation[] = (data || []).map(inv => ({
        id: inv.id,
        team_id: inv.team_id,
        team_name: (inv.teams as any)?.name || "Unknown Team",
        inviter_name: (inv.profiles as any)?.name || "Unknown",
        message: inv.message,
        created_at: inv.created_at,
        status: inv.status,
      }));

      setInvitations(formatted);
      console.log("[useTeams] Invitations loaded:", formatted.length);
    } catch (err) {
      console.error("[useTeams] Error fetching invitations:", err);
    }
  };

  // Fetch join requests (if user is team lead)
  const fetchJoinRequests = async () => {
    if (!user || !myTeam || myTeam.members.find(m => m.user_id === user.id)?.role !== 'lead') {
      setJoinRequests([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("team_join_requests")
        .select(`
          id,
          user_id,
          message,
          created_at,
          status,
          profiles(name, avatar_url)
        `)
        .eq("team_id", myTeam.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted: JoinRequest[] = (data || []).map(req => ({
        id: req.id,
        user_id: req.user_id,
        user_name: (req.profiles as any)?.name || "Unknown",
        user_avatar: (req.profiles as any)?.avatar_url || null,
        message: req.message,
        created_at: req.created_at,
        status: req.status,
      }));

      setJoinRequests(formatted);
      console.log("[useTeams] Join requests loaded:", formatted.length);
    } catch (err) {
      console.error("[useTeams] Error fetching join requests:", err);
    }
  };

  // Create team
  const createTeam = async (teamData: {
    name: string;
    description?: string;
    category?: string;
    max_members?: number;
    is_open?: boolean;
  }) => {
    try {
      console.log("[useTeams] Creating team:", teamData.name);
      
      const { data, error } = await supabase.functions.invoke("manage-team", {
        body: { action: "create", ...teamData },
      });

      console.log("[useTeams] Create team response:", { data, error });

      if (error) {
        console.error("[useTeams] Function invocation error:", error);
        throw new Error(error.message || "Failed to invoke function");
      }
      
      if (data?.error) {
        console.error("[useTeams] Server returned error:", data.error);
        // Check if there are additional error details
        const errorDetails = data.details ? ` - ${data.details}` : '';
        const errorCode = data.code ? ` (Code: ${data.code})` : '';
        throw new Error(data.error + errorDetails + errorCode);
      }

      toast({ title: "Team created successfully!", description: `Welcome to ${teamData.name}!` });
      
      // Refresh all data
      await Promise.all([
        fetchMyTeam(),
        fetchAvailableTeams(),
      ]);
      
      return data.team;
    } catch (err) {
      console.error("[useTeams] Create team error:", err);
      const message = err instanceof Error ? err.message : "Failed to create team";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  // Send invitation
  const inviteMember = async (invitee_id: string, message?: string) => {
    if (!myTeam) throw new Error("Not in a team");

    try {
      const { data, error } = await supabase.functions.invoke("manage-team", {
        body: {
          action: "invite",
          team_id: myTeam.id,
          invitee_id,
          message,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({ title: "Invitation sent!" });
      return data.invitation;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send invitation";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  // Respond to invitation
  const respondToInvitation = async (invitation_id: string, accept: boolean) => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-team", {
        body: {
          action: "respond_invitation",
          invitation_id,
          accept,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({ title: accept ? "Invitation accepted!" : "Invitation declined" });
      
      // Refresh all data
      await Promise.all([
        fetchMyTeam(),
        fetchInvitations(),
        fetchAvailableTeams(),
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to respond to invitation";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  // Send join request
  const requestToJoin = async (team_id: string, message?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-team", {
        body: {
          action: "join_request",
          team_id,
          message,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({ title: "Join request sent!" });
      return data.request;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send join request";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  // Respond to join request
  const respondToJoinRequest = async (request_id: string, approve: boolean) => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-team", {
        body: {
          action: "respond_request",
          request_id,
          approve,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({ title: approve ? "Join request approved!" : "Join request declined" });
      
      // Refresh team data and join requests
      await Promise.all([
        fetchMyTeam(),
        fetchJoinRequests(),
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to respond to join request";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  // Leave team
  const leaveTeam = async () => {
    if (!myTeam) throw new Error("Not in a team");

    try {
      const { data, error } = await supabase.functions.invoke("manage-team", {
        body: {
          action: "leave",
          team_id: myTeam.id,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({ title: "Left team successfully" });
      setMyTeam(null);
      await fetchAvailableTeams();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to leave team";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await fetchMyTeam();
      await Promise.all([
        fetchAvailableTeams(),
        fetchInvitations(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  // Fetch join requests when myTeam changes
  useEffect(() => {
    if (myTeam) {
      fetchJoinRequests();
    }
  }, [myTeam]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to invitation changes
    const invitationChannel = supabase
      .channel("team_invitations_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_invitations",
          filter: `invitee_id=eq.${user.id}`,
        },
        () => {
          fetchInvitations();
        }
      )
      .subscribe();

    // Subscribe to team member changes if in a team
    let memberChannel: any = null;
    if (myTeam) {
      memberChannel = supabase
        .channel("team_members_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "team_members",
            filter: `team_id=eq.${myTeam.id}`,
          },
          () => {
            fetchMyTeam();
          }
        )
        .subscribe();
    }

    return () => {
      invitationChannel.unsubscribe();
      if (memberChannel) memberChannel.unsubscribe();
    };
  }, [user, myTeam?.id]);

  return {
    myTeam,
    availableTeams,
    invitations,
    joinRequests,
    loading,
    error,
    createTeam,
    inviteMember,
    respondToInvitation,
    requestToJoin,
    respondToJoinRequest,
    leaveTeam,
    refetch: async () => {
      await fetchMyTeam();
      await fetchAvailableTeams();
      await fetchInvitations();
      await fetchJoinRequests();
    },
  };
}
