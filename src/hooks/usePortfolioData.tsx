import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface PortfolioProject {
  id: string;
  title: string;
  category: string | null;
  thumbnail_url: string | null;
  created_at: string | null;
  source_type: string | null;
  description: string | null;
  tags: string[] | null;
}

export interface PortfolioStats {
  totalProjects: number;
  published: number;
  inPipeline: number;
  collections: number;
}

export interface PortfolioDataResult {
  projects: PortfolioProject[];
  stats: PortfolioStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePortfolioData(): PortfolioDataResult {
  const { user } = useAuth();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [stats, setStats] = useState<PortfolioStats>({
    totalProjects: 0,
    published: 0,
    inPipeline: 0,
    collections: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch portfolios for the user
      const { data: portfolios, error: portfoliosError } = await supabase
        .from("portfolios")
        .select("id")
        .eq("designer_id", user.id);

      if (portfoliosError) throw portfoliosError;

      const portfolioIds = portfolios?.map(p => p.id) || [];

      // Fetch portfolio projects
      let projectsData: PortfolioProject[] = [];
      if (portfolioIds.length > 0) {
        const { data: projectsResult, error: projectsError } = await supabase
          .from("portfolio_projects")
          .select("id, title, category, thumbnail_url, created_at, source_type, description, tags")
          .in("portfolio_id", portfolioIds)
          .order("created_at", { ascending: false });

        if (projectsError) throw projectsError;
        projectsData = projectsResult || [];
      }

      // Fetch publication counts
      let publishedCount = 0;
      let pipelineCount = 0;
      if (portfolioIds.length > 0) {
        const { data: publications, error: pubError } = await supabase
          .from("portfolio_publications")
          .select("status")
          .in("portfolio_id", portfolioIds);

        if (!pubError && publications) {
          publishedCount = publications.filter(p => p.status === "published").length;
          pipelineCount = publications.filter(p => 
            ["pending", "sampling", "pending_review", "marketplace_pending"].includes(p.status)
          ).length;
        }
      }

      // Count unique categories as "collections"
      const uniqueCategories = new Set(projectsData.map(p => p.category).filter(Boolean));

      setProjects(projectsData);
      setStats({
        totalProjects: projectsData.length,
        published: publishedCount,
        inPipeline: pipelineCount,
        collections: uniqueCategories.size,
      });
    } catch (err) {
      console.error("Error fetching portfolio data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch portfolio data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return { projects, stats, loading, error, refetch: fetchData };
}
