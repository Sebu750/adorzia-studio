import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
<<<<<<< HEAD
import { SafeHTMLRenderer } from "@/components/ui/SafeHTMLRenderer";
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Sparkles, Crown, Loader2, ArrowRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CountdownTimer } from "@/components/stylebox/CountdownTimer";
import { LevelBadge } from "@/components/stylebox/LevelBadge";
import { SCRewardBadge } from "@/components/stylebox/SCRewardBadge";
import type { SCDifficulty } from "@/lib/style-credits";

const Styleboxes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch all styleboxes
  const { data: styleboxes = [], isLoading } = useQuery({
    queryKey: ["styleboxes", categoryFilter, difficultyFilter, levelFilter],
    queryFn: async () => {
      let query = supabase
        .from("styleboxes")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter as "fashion" | "textile" | "jewelry");
      }
      if (difficultyFilter !== "all") {
        query = query.eq("difficulty", difficultyFilter as "free" | "easy" | "medium" | "hard" | "insane");
      }
      if (levelFilter !== "all") {
        query = query.eq("level_number", parseInt(levelFilter));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch featured stylebox
  const { data: featuredStylebox } = useQuery({
    queryKey: ["featured-stylebox"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("styleboxes")
        .select("*")
        .eq("status", "active")
        .eq("is_featured", true)
        .limit(1)
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  // Filter and sort styleboxes
  const processedStyleboxes = styleboxes
    .filter((stylebox) =>
      stylebox.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stylebox.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          if (!a.submission_deadline) return 1;
          if (!b.submission_deadline) return -1;
          return new Date(a.submission_deadline).getTime() - new Date(b.submission_deadline).getTime();
        case "sc_reward":
          return (b.xp_reward || 0) - (a.xp_reward || 0);
        case "level":
          return (a.level_number || 1) - (b.level_number || 1);
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const isPaid = (difficulty: string) => difficulty !== "free";

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Stylebox Library
            </h1>
            <p className="text-muted-foreground mt-1">
              Choose your next creative challenge and level up your design skills
            </p>
          </div>

          {/* Featured Banner - Dynamic from DB */}
          {featuredStylebox && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-dark p-6 lg:p-8">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="accent" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      Featured Challenge
                    </Badge>
                    <Badge variant={featuredStylebox.difficulty as SCDifficulty}>
                      {featuredStylebox.difficulty.charAt(0).toUpperCase() + featuredStylebox.difficulty.slice(1)}
                    </Badge>
                    <LevelBadge level={featuredStylebox.level_number || 1} size="sm" />
                  </div>
                  <h2 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground">
                    {featuredStylebox.title}
                  </h2>
                  <p className="text-primary-foreground/70 max-w-xl line-clamp-2">
                    {featuredStylebox.description || "Join this exclusive challenge and showcase your design skills."}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <SCRewardBadge difficulty={featuredStylebox.difficulty as SCDifficulty} />
                    {featuredStylebox.submission_deadline && (
                      <CountdownTimer 
                        deadline={featuredStylebox.submission_deadline} 
                        compact 
                      />
                    )}
                    {featuredStylebox.studio_name && (
                      <span className="text-sm text-primary-foreground/60">
                        Curated by {featuredStylebox.studio_name}
                      </span>
                    )}
                  </div>
                </div>
                <Button 
                  variant="accent" 
                  size="lg" 
                  className="shrink-0 gap-2"
                  onClick={() => navigate(`/styleboxes/${featuredStylebox.id}`)}
                >
                  Enter Challenge
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              {featuredStylebox.thumbnail_url && (
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-foreground" />
                  <img 
                    src={featuredStylebox.thumbnail_url} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search styleboxes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="textile">Textile</SelectItem>
                <SelectItem value="jewelry">Jewelry</SelectItem>
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="insane">Insane</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="1">Level I</SelectItem>
                <SelectItem value="2">Level II</SelectItem>
                <SelectItem value="3">Level III</SelectItem>
                <SelectItem value="4">Level IV</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="deadline">Ending Soon</SelectItem>
                <SelectItem value="sc_reward">SC Reward</SelectItem>
                <SelectItem value="level">Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && processedStyleboxes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No styleboxes found. Check back soon for new challenges!</p>
          </div>
        )}

        {/* Tabs */}
        {!isLoading && processedStyleboxes.length > 0 && (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Styleboxes</TabsTrigger>
              <TabsTrigger value="free">Free</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedStyleboxes.map((stylebox) => (
                  <StyleboxLibraryCard key={stylebox.id} stylebox={stylebox} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="free">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedStyleboxes
                  .filter((s) => s.difficulty === "free")
                  .map((stylebox) => (
                    <StyleboxLibraryCard key={stylebox.id} stylebox={stylebox} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="premium">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedStyleboxes
                  .filter((s) => s.difficulty !== "free")
                  .map((stylebox) => (
                    <StyleboxLibraryCard key={stylebox.id} stylebox={stylebox} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
};

// Enhanced Stylebox Library Card
function StyleboxLibraryCard({ stylebox }: { stylebox: any }) {
  const navigate = useNavigate();
  
  const isNew = new Date(stylebox.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
  
  return (
    <Card 
      hover
      className="overflow-hidden group cursor-pointer card-interactive"
      onClick={() => navigate(`/styleboxes/${stylebox.id}`)}
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <img
          src={stylebox.thumbnail_url || `https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&sig=${stylebox.id}`}
          alt={stylebox.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
        
        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LevelBadge level={stylebox.level_number || 1} size="sm" />
            {stylebox.season && (
              <Badge variant="season" className="text-xs">
                {stylebox.season}
              </Badge>
            )}
            {isNew && (
              <Badge variant="success" className="text-xs">New</Badge>
            )}
          </div>
          {stylebox.is_team_challenge && (
            <Badge variant="secondary" className="text-xs">Team</Badge>
          )}
        </div>
        
        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
<<<<<<< HEAD
            <Badge variant={stylebox.difficulty as SCDifficulty || "easy"} className="text-xs shadow-sm">
              {(stylebox.difficulty?.charAt(0).toUpperCase() + stylebox.difficulty?.slice(1)) || "Easy"}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-background/90 backdrop-blur-sm border-0">
              {(stylebox.category?.charAt(0).toUpperCase() + stylebox.category?.slice(1)) || "Fashion"}
=======
            <Badge variant={stylebox.difficulty as SCDifficulty} className="text-xs shadow-sm">
              {stylebox.difficulty.charAt(0).toUpperCase() + stylebox.difficulty.slice(1)}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-background/90 backdrop-blur-sm border-0">
              {stylebox.category.charAt(0).toUpperCase() + stylebox.category.slice(1)}
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
            </Badge>
          </div>
          <h3 className="font-display text-lg font-semibold text-primary-foreground leading-tight line-clamp-2">
            {stylebox.title}
          </h3>
          {stylebox.studio_name && (
            <p className="text-xs text-primary-foreground/70 mt-1">
              Curated by {stylebox.studio_name}
            </p>
          )}
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        {/* Description */}
        {stylebox.description && (
<<<<<<< HEAD
          <SafeHTMLRenderer 
            html={stylebox.description}
            className="text-sm text-muted-foreground line-clamp-2"
            tagName="p"
          />
=======
          <p className="text-sm text-muted-foreground line-clamp-2">
            {stylebox.description}
          </p>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        )}
        
        {/* SC and Deadline */}
        <div className="flex items-center justify-between">
          <SCRewardBadge difficulty={stylebox.difficulty as SCDifficulty} compact />
          {stylebox.submission_deadline ? (
            <CountdownTimer deadline={stylebox.submission_deadline} compact showIcon />
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>No deadline</span>
            </div>
          )}
        </div>
        
        {/* CTA */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full gap-1.5 btn-press font-medium hover:bg-foreground hover:text-background"
        >
          View Challenge
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default Styleboxes;
