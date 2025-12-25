import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Rank = Database["public"]["Tables"]["ranks"]["Row"];

export interface ProfileWithRank extends Profile {
  rank?: Rank | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileWithRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (profileData) {
          // Fetch rank if profile has rank_id
          let rankData = null;
          if (profileData.rank_id) {
            const { data: rank } = await supabase
              .from("ranks")
              .select("*")
              .eq("id", profileData.rank_id)
              .maybeSingle();
            rankData = rank;
          }

          setProfile({ ...profileData, rank: rankData });
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch profile"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("No user logged in") };

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      setProfile((prev) => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error("Failed to update profile") };
    }
  };

  const markFirstLoginComplete = async () => {
    return updateProfile({ first_login: false });
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    markFirstLoginComplete,
  };
}
