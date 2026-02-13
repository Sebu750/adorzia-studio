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
    console.log("useProfile useEffect triggered, user:", user);
    if (!user) {
      console.log("No user, setting profile to null");
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
          // Create profile if it doesn't exist
          console.log("Creating new profile for user:", user.id);
          console.log("User metadata:", user.user_metadata);
          console.log("User email:", user.email);
                
          const profileData = {
            user_id: user.id,
            name: user.user_metadata?.name || '',
            email: user.email || '',
            category: user.user_metadata?.category || 'fashion',
          };
                
          console.log("Profile data to insert:", profileData);
                
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert(profileData)
            .select()
            .single();
        
          console.log("Create profile result:", { newProfile, createError });
        
          if (createError) {
            console.error("Failed to create profile:", createError);
            setProfile(null);
          } else {
            setProfile({ ...newProfile, rank: null });
          }
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
      console.log("Updating profile for user:", user.id);
      console.log("Updates:", updates);
      
      // Filter out any fields that might not exist in the database yet
      const safeUpdates: any = {};
      const knownFields = [
        'name', 'bio', 'email', 'category', 'avatar_url', 
        'skills', 'first_login', 'notification_preferences',
        'rank_id', 'subscription_tier', 'status', 'xp'
      ];
      
      // Only include fields that we know exist or are likely to exist
      Object.keys(updates).forEach(key => {
        if (knownFields.includes(key) || key === 'user_id') {
          safeUpdates[key] = (updates as any)[key];
        }
      });
      
      console.log("Safe updates:", safeUpdates);
      
      const { error, data } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          ...safeUpdates
        }, {
          onConflict: "user_id"
        })
        .select()
        .single();

      console.log("Upsert result:", { error, data });

      if (error) throw error;

      setProfile((prev) => prev ? { ...prev, ...safeUpdates } : null);
      return { error: null };
    } catch (err) {
      console.error("Profile update error:", err);
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
