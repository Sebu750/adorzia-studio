import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Crown, 
  Edit, 
  MapPin, 
  Calendar, 
  Link as LinkIcon,
  Instagram,
  Twitter,
  Star,
  Trophy,
  Box,
  Flame,
  Target,
  Award,
  ExternalLink,
  Sparkles,
  Percent
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RANKS, RankTier } from "@/lib/ranks";
import { RankOverview } from "@/components/rank/RankOverview";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({
    styleboxes: 0,
    xpPoints: 0,
    dayStreak: 0,
    achievementsCount: "0/0",
    productsSold: 0,
  });

  const currentRank: RankTier = (profile?.rank?.name?.toLowerCase() as RankTier) || "apprentice";

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch achievements
      const { data: userBadges } = await supabase
        .from("user_achievement_badges")
        .select("*, achievement_badges(*)")
        .eq("user_id", user.id);

      const { data: allBadges } = await supabase
        .from("achievement_badges")
        .select("*");

      if (allBadges) {
        const mappedAchievements = allBadges.map((badge) => ({
          name: badge.name,
          icon: badge.icon || "🎖️",
          description: badge.description || "",
          unlocked: userBadges?.some((ub) => ub.badge_id === badge.id) || false,
        }));
        setAchievements(mappedAchievements);
      }

      // Fetch portfolio projects
      const { data: portfolios } = await supabase
        .from("portfolios")
        .select("*")
        .eq("designer_id", user.id)
        .limit(4);

      if (portfolios) {
        setPortfolioProjects(portfolios.map((p) => ({
          title: p.title,
          image: p.cover_image || "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400",
          category: p.category || "Design",
        })));
      }

      // Fetch stats
      const { count: styleboxCount } = await supabase
        .from("stylebox_submissions")
        .select("*", { count: "exact", head: true })
        .eq("designer_id", user.id)
        .eq("status", "approved");

      const { data: products } = await supabase
        .from("marketplace_products")
        .select("id")
        .eq("designer_id", user.id)
        .eq("status", "live");

      let productsSold = 0;
      if (products && products.length > 0) {
        const { data: sales } = await supabase
          .from("product_sales")
          .select("quantity_sold")
          .in("product_id", products.map((p) => p.id));
        productsSold = sales?.reduce((sum, s) => sum + s.quantity_sold, 0) || 0;
      }

      const unlockedCount = userBadges?.length || 0;
      const totalCount = allBadges?.length || 0;

      setStats({
        styleboxes: styleboxCount || 0,
        xpPoints: profile?.xp || 0,
        dayStreak: 0, // Would need separate tracking
        achievementsCount: `${unlockedCount}/${totalCount}`,
        productsSold,
      });
    };

    fetchData();
  }, [user, profile]);

  const skills = profile?.skills?.map((skill, index) => ({
    name: skill,
    level: Math.max(50, 100 - index * 10), // Simulate skill levels
  })) || [
    { name: "Fashion Design", level: 85 },
    { name: "Textile Art", level: 72 },
    { name: "Jewelry Design", level: 68 },
  ];

  const getInitials = (name?: string | null) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const joinedDate = profile?.created_at 
    ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: false })
    : "Recently";

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 space-y-8">
          <Card>
            <div className="h-32 bg-gradient-accent" />
            <CardContent className="relative px-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-5 w-64" />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-accent" />
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-2xl bg-accent text-accent-foreground">
                  {getInitials(profile?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 md:pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-2xl font-bold">
                    {profile?.name || user?.email?.split("@")[0] || "Designer"}
                  </h1>
                  <Badge className={cn(
                    "gap-1 border",
                    `bg-rank-${currentRank}/20 text-rank-${currentRank} border-rank-${currentRank}/30`
                  )}>
                    <Crown className="h-3 w-3" />
                    {RANKS[currentRank]?.name || "Apprentice"}
                  </Badge>
                  <Badge variant="accent" className="gap-1">
                    <Percent className="h-3 w-3" />
                    {RANKS[currentRank]?.revenueShare || 10}% Share
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  {profile?.bio || `${profile?.category || "Fashion"} Designer`}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="gap-2 shrink-0"
                onClick={() => navigate("/settings")}
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Joined {joinedDate} ago
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {profile?.category || "Fashion"} Designer
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Styleboxes", value: stats.styleboxes.toString(), icon: Box },
            { label: "XP Points", value: stats.xpPoints.toLocaleString(), icon: Star },
            { label: "Day Streak", value: stats.dayStreak.toString(), icon: Flame },
            { label: "Achievements", value: stats.achievementsCount, icon: Trophy },
            { label: "Products Sold", value: stats.productsSold.toString(), icon: Target },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <stat.icon className="h-5 w-5 mx-auto text-accent mb-2" />
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Work */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Work</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/portfolio")}>
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {portfolioProjects.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No portfolio projects yet</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => navigate("/portfolio")}
                        >
                          Create Your First Project
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {portfolioProjects.map((project, index) => (
                          <div key={index} className="group cursor-pointer">
                            <div className="aspect-square rounded-lg overflow-hidden mb-2">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <p className="text-sm font-medium truncate">{project.title}</p>
                            <p className="text-xs text-muted-foreground">{project.category}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Rank Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className={`h-5 w-5 text-rank-${currentRank}`} />
                    Rank Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className={cn(
                      "inline-flex h-20 w-20 items-center justify-center rounded-2xl border-2 mb-3",
                      `bg-gradient-to-br from-rank-${currentRank}/20 to-rank-${currentRank}/5 border-rank-${currentRank}/30`
                    )}>
                      <Crown className={`h-10 w-10 text-rank-${currentRank}`} />
                    </div>
                    <h3 className={`font-display text-xl font-semibold text-rank-${currentRank}`}>
                      {RANKS[currentRank]?.name || "Apprentice"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {RANKS[currentRank]?.title || "Rising Designer"}
                    </p>
                  </div>

                  <div className={cn(
                    "p-3 rounded-xl text-center border",
                    `bg-rank-${currentRank}/10 border-rank-${currentRank}/20`
                  )}>
                    <p className="text-sm text-muted-foreground">Revenue Share</p>
                    <p className={`font-display text-3xl font-bold text-rank-${currentRank}`}>
                      {RANKS[currentRank]?.revenueShare || 10}%
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>XP Progress</span>
                      <span className="text-muted-foreground">{profile?.xp || 0} XP</span>
                    </div>
                    <Progress value={Math.min((profile?.xp || 0) / 100, 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Full Rank Overview */}
            <RankOverview currentRank={currentRank} />
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="text-center py-12">
                    <Trophy className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No achievements yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete styleboxes and challenges to earn badges!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                achievements.map((achievement, index) => (
                  <Card 
                    key={index} 
                    className={cn(
                      "transition-all",
                      !achievement.unlocked && "opacity-50"
                    )}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={cn(
                        "h-16 w-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-3",
                        achievement.unlocked 
                          ? "bg-accent/10 border-2 border-accent/30" 
                          : "bg-muted border-2 border-border"
                      )}>
                        {achievement.icon}
                      </div>
                      <h3 className="font-medium">{achievement.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                      {achievement.unlocked && (
                        <Badge variant="success" className="mt-3">Unlocked</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Design Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace">
            <Card>
              <CardHeader>
                <CardTitle>Published Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No published products yet</p>
                  <p className="text-sm mt-1">
                    Complete styleboxes and submit your work to get featured!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// Import needed for empty state icon
import { FolderOpen } from "lucide-react";

export default Profile;
