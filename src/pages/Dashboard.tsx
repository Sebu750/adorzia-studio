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
import { motion } from "framer-motion";

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
    currentRank: "stylist" as RankTier,
    foundationRank: "f1" as 'f1' | 'f2' | null,
    styleCredits: 1250,
    badges: [
      { name: "First Win", icon: "🏆" },
      { name: "Team Player", icon: "🤝" },
      { name: "Creative Spark", icon: "✨" },
      { name: "10 Streak", icon: "🔥" },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <AppLayout>
      <motion.div 
        className="p-4 sm:p-6 lg:p-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.header 
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-secondary/50 p-6 sm:p-8"
          role="banner"
        >
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-display-xl">
                Welcome back, Aria
              </h1>
              <p className="text-caption text-base">
                Continue your creative journey. You're on a 12-day streak!
              </p>
            </div>
            <Button variant="default" size="lg" className="gap-2 btn-press shadow-md">
              <Sparkles className="h-4 w-4" />
              Explore Styleboxes
            </Button>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <motion.section 
          variants={itemVariants}
          aria-labelledby="stats-heading"
          role="region"
        >
          <h2 id="stats-heading" className="sr-only">Dashboard Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            <StatCard
              title="Active Styleboxes"
              value={3}
              subtitle="2 in progress, 1 pending"
              icon={Box}
            />
            <StatCard
              title="Completed"
              value={47}
              subtitle="This year"
              icon={Trophy}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Portfolio Items"
              value={89}
              subtitle="6 published"
              icon={FolderOpen}
            />
            <StatCard
              title="Earnings"
              value="$4,280"
              subtitle="This month"
              icon={DollarSign}
              trend={{ value: 23, isPositive: true }}
            />
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Active Styleboxes */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            variants={itemVariants}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
                <CardTitle className="flex items-center gap-2.5 text-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                    <Box className="h-4 w-4 text-foreground" />
                  </div>
                  Active Styleboxes
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {activeStyleboxes.map((stylebox, index) => (
                    <ActiveStylebox key={index} {...stylebox} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-4 border-b border-border">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="divide-y divide-border">
                  {[
                    { action: "Submitted", project: "Autumn Textile Print", time: "2 hours ago", status: "pending" },
                    { action: "Completed", project: "Minimalist Ring Collection", time: "1 day ago", status: "completed" },
                    { action: "Started", project: "Sustainable Resort Collection", time: "3 days ago", status: "active" },
                    { action: "Published", project: "Urban Street Style Series", time: "1 week ago", status: "published" },
                  ].map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group"
                      role="listitem"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-foreground/20 group-hover:bg-foreground/40 transition-colors" />
                        <div className="space-y-0.5">
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
                        activity.status === "published" ? "default" : "secondary"
                      }>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column */}
          <motion.aside 
            className="space-y-6"
            variants={itemVariants}
            role="complementary"
            aria-label="Sidebar widgets"
          >
            <RankProgress {...rankData} />
            <TeamActivity {...teamData} />
            <EarningsSnapshot
              totalEarnings={18750}
              monthlyEarnings={4280}
              pendingPayouts={890}
              productsSold={23}
              trend={23}
            />
          </motion.aside>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Dashboard;