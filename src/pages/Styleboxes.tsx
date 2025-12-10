import { AppLayout } from "@/components/layout/AppLayout";
import { StyleboxCard } from "@/components/stylebox/StyleboxCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Sparkles, Crown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Styleboxes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const { data: styleboxes = [], isLoading } = useQuery({
    queryKey: ["styleboxes", categoryFilter, difficultyFilter],
    queryFn: async () => {
      let query = supabase
        .from("styleboxes")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (categoryFilter !== "all" && (categoryFilter === "fashion" || categoryFilter === "textile" || categoryFilter === "jewelry")) {
        query = query.eq("category", categoryFilter);
      }
      if (difficultyFilter !== "all" && (difficultyFilter === "free" || difficultyFilter === "easy" || difficultyFilter === "medium" || difficultyFilter === "hard" || difficultyFilter === "insane")) {
        query = query.eq("difficulty", difficultyFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Filter by search query
  const filteredStyleboxes = styleboxes.filter((stylebox) =>
    stylebox.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stylebox.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Map database difficulty to display format
  const mapDifficulty = (difficulty: string) => {
    const map: Record<string, "free" | "easy" | "medium" | "hard" | "insane"> = {
      free: "free",
      easy: "easy",
      medium: "medium",
      hard: "hard",
      insane: "insane",
    };
    return map[difficulty] || "easy";
  };

  // Map category to display format
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Check if stylebox is paid (based on difficulty - free tier is free, others are paid)
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

          {/* Featured Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-dark p-6 lg:p-8">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="accent" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Featured Challenge
                  </Badge>
                  <Badge variant="insane">Insane</Badge>
                </div>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground">
                  Winter Couture Masterclass
                </h2>
                <p className="text-primary-foreground/70 max-w-xl">
                  Join our most prestigious challenge yet. Create a complete haute couture collection 
                  inspired by winter elements. Top 3 designs will be featured in Adorzia's showcase.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 text-primary-foreground/60">
                    <Crown className="h-4 w-4 text-accent" />
                    <span className="text-sm">$5,000 Prize Pool</span>
                  </div>
                  <div className="text-sm text-primary-foreground/60">
                    Ends in 12 days
                  </div>
                </div>
              </div>
              <Button variant="accent" size="lg" className="shrink-0">
                Enter Challenge
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-foreground" />
              <img 
                src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800" 
                alt="" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
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
          <div className="flex gap-3">
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredStyleboxes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No styleboxes found. Check back soon for new challenges!</p>
          </div>
        )}

        {/* Tabs */}
        {!isLoading && filteredStyleboxes.length > 0 && (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Styleboxes</TabsTrigger>
              <TabsTrigger value="free">Free</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStyleboxes.map((stylebox) => (
                  <StyleboxCard
                    key={stylebox.id}
                    title={stylebox.title}
                    description={stylebox.description || ""}
                    category={formatCategory(stylebox.category)}
                    difficulty={mapDifficulty(stylebox.difficulty)}
                    isPaid={isPaid(stylebox.difficulty)}
                    isLocked={false}
                    duration={stylebox.difficulty === "insane" ? "3 weeks" : stylebox.difficulty === "hard" ? "2 weeks" : "1 week"}
                    thumbnail={`https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&sig=${stylebox.id}`}
                    participants={Math.floor(Math.random() * 2000) + 100}
                    rating={4 + Math.random()}
                    isNew={new Date(stylebox.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="free">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStyleboxes
                  .filter((s) => s.difficulty === "free")
                  .map((stylebox) => (
                    <StyleboxCard
                      key={stylebox.id}
                      title={stylebox.title}
                      description={stylebox.description || ""}
                      category={formatCategory(stylebox.category)}
                      difficulty={mapDifficulty(stylebox.difficulty)}
                      isPaid={false}
                      isLocked={false}
                      duration="1 week"
                      thumbnail={`https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&sig=${stylebox.id}`}
                      participants={Math.floor(Math.random() * 2000) + 100}
                      rating={4 + Math.random()}
                      isNew={new Date(stylebox.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="premium">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStyleboxes
                  .filter((s) => s.difficulty !== "free")
                  .map((stylebox) => (
                    <StyleboxCard
                      key={stylebox.id}
                      title={stylebox.title}
                      description={stylebox.description || ""}
                      category={formatCategory(stylebox.category)}
                      difficulty={mapDifficulty(stylebox.difficulty)}
                      isPaid={true}
                      isLocked={false}
                      duration={stylebox.difficulty === "insane" ? "3 weeks" : stylebox.difficulty === "hard" ? "2 weeks" : "1 week"}
                      thumbnail={`https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&sig=${stylebox.id}`}
                      participants={Math.floor(Math.random() * 2000) + 100}
                      rating={4 + Math.random()}
                      isNew={new Date(stylebox.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
};

export default Styleboxes;
