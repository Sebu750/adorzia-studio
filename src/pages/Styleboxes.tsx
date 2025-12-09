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
import { Search, Filter, Sparkles, Crown } from "lucide-react";

const styleboxes = [
  {
    id: "1",
    title: "Sustainable Resort Collection",
    description: "Design a complete resort wear collection using only sustainable and eco-friendly materials. Focus on versatility and timeless appeal.",
    category: "Fashion",
    difficulty: "hard" as const,
    isPaid: false,
    isLocked: false,
    duration: "2 weeks",
    thumbnail: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600",
    participants: 1250,
    rating: 4.8,
    isNew: true,
  },
  {
    id: "2",
    title: "Modern Artisan Jewelry Set",
    description: "Create a cohesive jewelry collection inspired by traditional craftsmanship with a contemporary twist.",
    category: "Jewelry",
    difficulty: "medium" as const,
    isPaid: false,
    isLocked: false,
    duration: "1 week",
    thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    participants: 890,
    rating: 4.6,
  },
  {
    id: "3",
    title: "Urban Street Style Editorial",
    description: "Develop a street-style focused collection that bridges high fashion and urban culture.",
    category: "Fashion",
    difficulty: "easy" as const,
    isPaid: false,
    isLocked: false,
    duration: "5 days",
    thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600",
    participants: 2100,
    rating: 4.9,
  },
  {
    id: "4",
    title: "Avant-Garde Textile Innovation",
    description: "Push the boundaries of textile design with experimental techniques and unconventional materials.",
    category: "Textile",
    difficulty: "insane" as const,
    isPaid: true,
    isLocked: false,
    duration: "3 weeks",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    participants: 340,
    rating: 4.7,
    isTeam: true,
  },
  {
    id: "5",
    title: "Heritage Pattern Revival",
    description: "Reimagine traditional textile patterns for modern fashion applications.",
    category: "Textile",
    difficulty: "medium" as const,
    isPaid: true,
    isLocked: true,
    duration: "10 days",
    thumbnail: "https://images.unsplash.com/photo-1606722590583-3b9e9e9b9b9d?w=600",
    participants: 560,
    rating: 4.5,
  },
  {
    id: "6",
    title: "Statement Earring Collection",
    description: "Design a range of bold, statement earrings that balance impact with wearability.",
    category: "Jewelry",
    difficulty: "easy" as const,
    isPaid: false,
    isLocked: false,
    duration: "4 days",
    thumbnail: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600",
    participants: 1800,
    rating: 4.4,
    isNew: true,
  },
];

const Styleboxes = () => {
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
            />
          </div>
          <div className="flex gap-3">
            <Select defaultValue="all">
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
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
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

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Styleboxes</TabsTrigger>
            <TabsTrigger value="free">Free</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="team">Team Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {styleboxes.map((stylebox) => (
                <StyleboxCard key={stylebox.id} {...stylebox} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="free">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {styleboxes.filter(s => !s.isPaid).map((stylebox) => (
                <StyleboxCard key={stylebox.id} {...stylebox} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="premium">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {styleboxes.filter(s => s.isPaid).map((stylebox) => (
                <StyleboxCard key={stylebox.id} {...stylebox} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {styleboxes.filter(s => s.isTeam).map((stylebox) => (
                <StyleboxCard key={stylebox.id} {...stylebox} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Styleboxes;
