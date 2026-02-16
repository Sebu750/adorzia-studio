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
    // Prevent multiple fetches for the same user
    const userId = user?.id;
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        
        if (isCancelled) return;
        
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
          const newProfileData = {
            user_id: userId,
            name: user?.user_metadata?.name || '',
            email: user?.email || '',
            category: user?.user_metadata?.category || 'fashion',
          };
                
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert(newProfileData)
            .select()
            .single();
        
          if (isCancelled) return;
        
          if (createError) {
            console.error("Failed to create profile:", createError);
            setProfile(null);
          } else {
            setProfile({ ...newProfile, rank: null });
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Error fetching profile:", err);
          setError(err instanceof Error ? err : new Error("Failed to fetch profile"));
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();
    
    return () => {
      isCancelled = true;
    };
  }, [user?.id]); // Only depend on user.id, not the entire user object

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
        'rank_id', 'subscription_tier', 'status', 'style_credits',
        // Enhanced profile fields
        'brand_name', 'logo_url', 'banner_image', 'location',
        'education', 'awards', 'website_url', 'instagram_handle',
        'twitter_handle', 'linkedin_url', 'facebook_url',
        'tiktok_handle', 'youtube_channel', 'dribbble_url',
        'behance_url', 'etsy_shop_url', 'shopify_store_url'
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
