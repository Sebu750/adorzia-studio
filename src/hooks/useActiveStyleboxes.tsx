import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

export interface ActiveStylebox {
  id: string;
  title: string;
  category: string;
  difficulty: "free" | "easy" | "medium" | "hard" | "insane";
  progress: number;
  dueDate: string | null;
  thumbnail: string | null;
  // Enhanced fields
  season: string | null;
  xpReward: number;
  levelNumber: number;
  studioName: string | null;
  status: "draft" | "active" | "submitted" | "approved" | "rejected";
  submittedAt: string | null;
  deadlineDate: Date | null;
}

export interface ActiveStyleboxesResult {
  styleboxes: ActiveStylebox[];
  loading: boolean;
  error: string | null;
}

export function useActiveStyleboxes(): ActiveStyleboxesResult {
  const { user } = useAuth();
  const [styleboxes, setStyleboxes] = useState<ActiveStylebox[]>([]);
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

        // Fetch active submissions (status = 'submitted' or 'draft')
        const { data: submissions, error: subError } = await supabase
          .from("stylebox_submissions")
          .select(`
            id,
            status,
            submitted_at,
            styleboxes (
              id,
              title,
              category,
              difficulty,
              submission_deadline,
              thumbnail_url,
              season,
              xp_reward,
              level_number,
              studio_name
            )
          `)
          .eq("designer_id", user.id)
          .eq("status", "submitted");

        if (subError) throw subError;

        const activeStyleboxes: ActiveStylebox[] = (submissions || []).map(sub => {
          const stylebox = sub.styleboxes as any;
          // Calculate progress based on status
          const progress = sub.status === "submitted" ? 75 : 50;
          const deadlineDate = stylebox?.submission_deadline 
            ? new Date(stylebox.submission_deadline) 
            : null;
          
          return {
            id: sub.id,
            title: stylebox?.title || "Untitled",
            category: stylebox?.category || "fashion",
            difficulty: (stylebox?.difficulty as ActiveStylebox["difficulty"]) || "medium",
            progress,
            dueDate: stylebox?.submission_deadline 
              ? format(new Date(stylebox.submission_deadline), "MMM d")
              : null,
            thumbnail: stylebox?.thumbnail_url || null,
            // Enhanced fields
            season: stylebox?.season || null,
            xpReward: stylebox?.xp_reward || 100,
            levelNumber: stylebox?.level_number || 1,
            studioName: stylebox?.studio_name || null,
            status: sub.status === "submitted" ? "submitted" : "active",
            submittedAt: sub.submitted_at || null,
            deadlineDate,
          };
        });

        setStyleboxes(activeStyleboxes);
      } catch (err) {
        console.error("Error fetching active styleboxes:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch active styleboxes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { styleboxes, loading, error };
}
