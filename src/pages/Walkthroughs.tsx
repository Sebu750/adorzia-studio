import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { WalkthroughCard } from "@/components/walkthrough/WalkthroughCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Sparkles, Filter } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Stylebox = Database['public']['Tables']['styleboxes']['Row'];
type WalkthroughProgress = Database['public']['Tables']['walkthrough_progress']['Row'];

export default function Walkthroughs() {
  const { user } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch walkthrough styleboxes
  const { data: walkthroughs, isLoading: walkthroughsLoading } = useQuery({
    queryKey: ['walkthroughs', categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('styleboxes')
        .select('*')
        .eq('is_walkthrough', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter as Database['public']['Enums']['designer_category']);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Stylebox[];
    },
  });

  // Fetch user's progress on walkthroughs
  const { data: progressData } = useQuery({
    queryKey: ['walkthrough-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('walkthrough_progress')
        .select('*')
        .eq('designer_id', user.id);
      if (error) throw error;
      return data as WalkthroughProgress[];
    },
    enabled: !!user?.id,
  });

  // Fetch user profile for rank/subscription checks
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const progressMap = new Map(
    progressData?.map(p => [p.stylebox_id, p]) || []
  );

  const filteredWalkthroughs = walkthroughs?.filter(w =>
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const inProgressWalkthroughs = filteredWalkthroughs.filter(w => {
    const progress = progressMap.get(w.id);
    return progress && !progress.completed_at;
  });

  const completedWalkthroughs = filteredWalkthroughs.filter(w => {
    const progress = progressMap.get(w.id);
    return progress?.completed_at;
  });

  const availableWalkthroughs = filteredWalkthroughs.filter(w => {
    const progress = progressMap.get(w.id);
    return !progress;
  });

  const categories = [
    { value: "all", label: "All Tracks" },
    { value: "fashion", label: "Fashion" },
    { value: "textile", label: "Textile" },
    { value: "jewelry", label: "Jewelry" },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent">
                <BookOpen className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-semibold text-foreground">
                  Walkthroughs
                </h1>
                <p className="text-muted-foreground">
                  Guided learning paths to build your design skills
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search walkthroughs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={categoryFilter === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(cat.value)}
              className="gap-2"
            >
              {cat.value !== "all" && <Filter className="h-3.5 w-3.5" />}
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {inProgressWalkthroughs.length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <BookOpen className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {completedWalkthroughs.length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {availableWalkthroughs.length}
                </p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {filteredWalkthroughs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress
              <Badge variant="secondary" className="ml-2">
                {inProgressWalkthroughs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              <Badge variant="secondary" className="ml-2">
                {completedWalkthroughs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="available">
              Available
              <Badge variant="secondary" className="ml-2">
                {availableWalkthroughs.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {walkthroughsLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : filteredWalkthroughs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-display text-lg font-medium text-foreground">
                  No Walkthroughs Found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "New walkthroughs coming soon!"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredWalkthroughs.map((walkthrough) => (
                  <WalkthroughCard
                    key={walkthrough.id}
                    walkthrough={walkthrough}
                    progress={progressMap.get(walkthrough.id)}
                    userRank={profile?.rank_id}
                    userSubscription={profile?.subscription_tier}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-6">
            {inProgressWalkthroughs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-display text-lg font-medium text-foreground">
                  No Walkthroughs In Progress
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start a walkthrough to begin learning
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {inProgressWalkthroughs.map((walkthrough) => (
                  <WalkthroughCard
                    key={walkthrough.id}
                    walkthrough={walkthrough}
                    progress={progressMap.get(walkthrough.id)}
                    userRank={profile?.rank_id}
                    userSubscription={profile?.subscription_tier}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedWalkthroughs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-display text-lg font-medium text-foreground">
                  No Completed Walkthroughs
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Complete walkthroughs to earn XP and build your portfolio
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedWalkthroughs.map((walkthrough) => (
                  <WalkthroughCard
                    key={walkthrough.id}
                    walkthrough={walkthrough}
                    progress={progressMap.get(walkthrough.id)}
                    userRank={profile?.rank_id}
                    userSubscription={profile?.subscription_tier}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available" className="space-y-6">
            {availableWalkthroughs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-display text-lg font-medium text-foreground">
                  All Walkthroughs Started
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You've started all available walkthroughs
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableWalkthroughs.map((walkthrough) => (
                  <WalkthroughCard
                    key={walkthrough.id}
                    walkthrough={walkthrough}
                    progress={progressMap.get(walkthrough.id)}
                    userRank={profile?.rank_id}
                    userSubscription={profile?.subscription_tier}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
