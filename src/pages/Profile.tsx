import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const currentRank: RankTier = "stylist";

const Profile = () => {
  const skills = [
    { name: "Fashion Design", level: 85 },
    { name: "Textile Art", level: 72 },
    { name: "Jewelry Design", level: 68 },
    { name: "Pattern Making", level: 80 },
    { name: "Sustainable Design", level: 75 },
  ];

  const achievements = [
    { name: "First Victory", icon: "🏆", description: "Complete your first Stylebox", unlocked: true },
    { name: "Team Player", icon: "🤝", description: "Complete a team challenge", unlocked: true },
    { name: "Creative Spark", icon: "✨", description: "Receive 10 likes on a project", unlocked: true },
    { name: "On Fire", icon: "🔥", description: "Maintain a 10-day streak", unlocked: true },
    { name: "Marketplace Star", icon: "⭐", description: "Get your first sale", unlocked: true },
    { name: "Master Crafter", icon: "👑", description: "Complete 50 Styleboxes", unlocked: false },
    { name: "Trendsetter", icon: "🎯", description: "Get featured on Adorzia", unlocked: false },
    { name: "Mentor", icon: "🎓", description: "Help 5 new designers", unlocked: false },
  ];

  const recentProjects = [
    { title: "Urban Street Style", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400", category: "Fashion" },
    { title: "Minimalist Rings", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400", category: "Jewelry" },
    { title: "Autumn Textiles", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", category: "Textile" },
    { title: "Evening Wear", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400", category: "Fashion" },
  ];

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-accent" />
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" />
                <AvatarFallback className="text-2xl bg-accent text-accent-foreground">AK</AvatarFallback>
              </Avatar>
              <div className="flex-1 md:pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-2xl font-bold">Aria Kim</h1>
                  <Badge className="gap-1 bg-rank-stylist/20 text-rank-stylist border-rank-stylist/30">
                    <Crown className="h-3 w-3" />
                    {RANKS[currentRank].name}
                  </Badge>
                  <Badge variant="accent" className="gap-1">
                    <Percent className="h-3 w-3" />
                    {RANKS[currentRank].revenueShare}% Share
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Fashion & Textile Designer | Sustainable Design Advocate
                </p>
              </div>
              <Button variant="outline" className="gap-2 shrink-0">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                Seoul, South Korea
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Joined March 2023
              </div>
              <div className="flex items-center gap-1.5">
                <LinkIcon className="h-4 w-4" />
                <a href="#" className="text-accent hover:underline">ariakim.design</a>
              </div>
              <div className="flex items-center gap-3">
                <a href="#" className="hover:text-accent transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="hover:text-accent transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Styleboxes", value: "47", icon: Box },
            { label: "XP Points", value: "2,450", icon: Star },
            { label: "Day Streak", value: "12", icon: Flame },
            { label: "Achievements", value: "5/8", icon: Trophy },
            { label: "Products Sold", value: "23", icon: Target },
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
                    <Button variant="ghost" size="sm">View All</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {recentProjects.map((project, index) => (
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
                  </CardContent>
                </Card>
              </div>

              {/* Rank Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-rank-stylist" />
                    Rank Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rank-stylist/20 to-rank-stylist/5 border-2 border-rank-stylist/30 mb-3">
                      <Crown className="h-10 w-10 text-rank-stylist" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-rank-stylist">
                      {RANKS[currentRank].name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{RANKS[currentRank].title}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-rank-stylist/10 border border-rank-stylist/20 text-center">
                    <p className="text-sm text-muted-foreground">Revenue Share</p>
                    <p className="font-display text-3xl font-bold text-rank-stylist">
                      {RANKS[currentRank].revenueShare}%
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Couturier</span>
                      <span className="text-muted-foreground">49%</span>
                    </div>
                    <Progress value={49} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      1,200 more SC to unlock Couturier
                    </p>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <h4 className="text-sm font-medium">Next Perks at Couturier</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Percent className="h-4 w-4 text-accent" />
                        25% Revenue Share
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-accent" />
                        Priority Production
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="h-4 w-4 text-accent" />
                        Mentorship Opportunities
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Full Rank Overview */}
            <RankOverview currentRank={currentRank} />
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
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
              ))}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <Card key={item} hover>
                      <div className="aspect-[4/3] relative overflow-hidden rounded-t-xl">
                        <img
                          src={`https://images.unsplash.com/photo-${1509631179647 + item}-0177331693ae?w=400`}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">Design Product {item}</h3>
                        <p className="text-sm text-muted-foreground">12 sales</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-display text-lg font-semibold text-accent">$49.99</span>
                          <Button variant="ghost" size="sm" className="gap-1">
                            View <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Profile;
