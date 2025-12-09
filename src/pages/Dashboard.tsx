import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActiveStylebox } from "@/components/dashboard/ActiveStylebox";
import { RankProgress } from "@/components/dashboard/RankProgress";
import { TeamActivity } from "@/components/dashboard/TeamActivity";
import { EarningsSnapshot } from "@/components/dashboard/EarningsSnapshot";
import { Box, Trophy, FolderOpen, DollarSign, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RankTier } from "@/lib/ranks";

const Dashboard = () => {
  const activeStyleboxes = [
    {
      title: "Sustainable Resort Collection",
      category: "Fashion",
      difficulty: "hard" as const,
      progress: 65,
      dueDate: "Dec 15",
      thumbnail: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600",
    },
    {
      title: "Modern Artisan Jewelry Set",
      category: "Jewelry",
      difficulty: "medium" as const,
      progress: 30,
      dueDate: "Dec 20",
      thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    },
  ];

  const teamData = {
    teamName: "Studio Collective",
    activeProject: "Winter Capsule Collection",
    members: [
      { name: "Emma Watson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "Lead" },
      { name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "Designer" },
      { name: "Sarah Kim", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "Designer" },
    ],
    unreadMessages: 5,
  };

  const rankData = {
    currentRank: "senior" as RankTier,
    xp: 2450,
    xpToNextLevel: 5000,
    badges: [
      { name: "First Win", icon: "🏆" },
      { name: "Team Player", icon: "🤝" },
      { name: "Creative Spark", icon: "✨" },
      { name: "10 Streak", icon: "🔥" },
    ],
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Welcome back, Aria
            </h1>
            <p className="text-muted-foreground mt-1">
              Continue your creative journey. You're on a 12-day streak! 🔥
            </p>
          </div>
          <Button variant="accent" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Explore New Styleboxes
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Styleboxes"
            value={3}
            subtitle="2 in progress, 1 pending"
            icon={Box}
            iconClassName="bg-accent/10"
          />
          <StatCard
            title="Completed"
            value={47}
            subtitle="This year"
            icon={Trophy}
            trend={{ value: 12, isPositive: true }}
            iconClassName="bg-success/10"
          />
          <StatCard
            title="Portfolio Items"
            value={89}
            subtitle="6 published"
            icon={FolderOpen}
            iconClassName="bg-secondary"
          />
          <StatCard
            title="Earnings"
            value="$4,280"
            subtitle="This month"
            icon={DollarSign}
            trend={{ value: 23, isPositive: true }}
            iconClassName="bg-accent/10"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Active Styleboxes */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Box className="h-5 w-5 text-accent" />
                  Active Styleboxes
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeStyleboxes.map((stylebox, index) => (
                    <ActiveStylebox key={index} {...stylebox} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Submitted", project: "Autumn Textile Print", time: "2 hours ago", status: "pending" },
                    { action: "Completed", project: "Minimalist Ring Collection", time: "1 day ago", status: "completed" },
                    { action: "Started", project: "Sustainable Resort Collection", time: "3 days ago", status: "active" },
                    { action: "Published", project: "Urban Street Style Series", time: "1 week ago", status: "published" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        <div>
                          <p className="text-sm">
                            <span className="text-muted-foreground">{activity.action}</span>{" "}
                            <span className="font-medium">{activity.project}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      <Badge variant={
                        activity.status === "completed" ? "success" :
                        activity.status === "pending" ? "warning" :
                        activity.status === "published" ? "accent" : "secondary"
                      }>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <RankProgress {...rankData} />
            <TeamActivity {...teamData} />
            <EarningsSnapshot
              totalEarnings={18750}
              monthlyEarnings={4280}
              pendingPayouts={890}
              productsSold={23}
              trend={23}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
