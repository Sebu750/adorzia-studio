import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

export interface ActiveStylebox {
  id: string;
  title: string;
  category: string;
  difficulty: "easy" | "medium" | "hard" | "insane";
  progress: number;
  dueDate: string | null;
  thumbnail: string | null;
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

        // Fetch active submissions (status = 'submitted')
        const { data: submissions, error: subError } = await supabase
          .from("stylebox_submissions")
          .select(`
            id,
            status,
            styleboxes (
              id,
              title,
              category,
              difficulty,
              submission_deadline,
              thumbnail_url
            )
          `)
          .eq("designer_id", user.id)
          .eq("status", "submitted");

        if (subError) throw subError;

        const activeStyleboxes: ActiveStylebox[] = (submissions || []).map(sub => {
          const stylebox = sub.styleboxes as any;
          // Calculate progress based on status
          const progress = sub.status === "submitted" ? 75 : 50;
          
          return {
            id: sub.id,
            title: stylebox?.title || "Untitled",
            category: stylebox?.category || "Fashion",
            difficulty: (stylebox?.difficulty as ActiveStylebox["difficulty"]) || "medium",
            progress,
            dueDate: stylebox?.submission_deadline 
              ? format(new Date(stylebox.submission_deadline), "MMM d")
              : null,
            thumbnail: stylebox?.thumbnail_url || null,
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
