import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActiveStylebox } from "@/components/dashboard/ActiveStylebox";
import { RankProgress } from "@/components/dashboard/RankProgress";
import { TeamActivity } from "@/components/dashboard/TeamActivity";
import { EarningsSnapshot } from "@/components/dashboard/EarningsSnapshot";
import { WelcomeModal } from "@/components/WelcomeModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Box, Trophy, FolderOpen, DollarSign, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RankTier } from "@/lib/ranks";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { useGreeting } from "@/hooks/useGreeting";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading, markFirstLoginComplete } = useProfile();
  const { stats, loading: statsLoading } = useDashboardStats();
  const [showWelcome, setShowWelcome] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const greeting = useGreeting({
    name: profile?.name,
    isFirstLogin: false, // We handle first login with modal instead
    joinedAt: profile?.created_at,
  });

  // Check for first login and show welcome modal
  useEffect(() => {
    if (profile?.first_login) {
      setShowWelcome(true);
    }
  }, [profile?.first_login]);

  const handleWelcomeClose = async () => {
    setShowWelcome(false);
    await markFirstLoginComplete();
  };

  // Fetch recent activities
  useEffect(() => {
    if (!user) return;

    const fetchActivities = async () => {
      const { data: submissions } = await supabase
        .from("stylebox_submissions")
        .select("*, styleboxes(title)")
        .eq("designer_id", user.id)
        .order("submitted_at", { ascending: false })
        .limit(4);

      if (submissions) {
        const activities = submissions.map((sub) => ({
          action: sub.status === "approved" ? "Completed" : 
                  sub.status === "rejected" ? "Rejected" : "Submitted",
          project: sub.styleboxes?.title || "Stylebox",
          time: getRelativeTime(new Date(sub.submitted_at)),
          status: sub.status === "approved" ? "completed" : 
                  sub.status === "rejected" ? "rejected" : "pending",
        }));
        setRecentActivities(activities);
      }
    };

    fetchActivities();
  }, [user]);

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
    currentRank: (profile?.rank?.name?.toLowerCase() || "apprentice") as RankTier,
    foundationRank: null as 'f1' | 'f2' | null, // Will be fetched from foundation_purchases in future
    styleCredits: profile?.xp || 0,
    badges: [
      { name: "First Win", icon: "🏆" },
      { name: "Team Player", icon: "🤝" },
      { name: "Creative Spark", icon: "✨" },
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

  const displayActivities = recentActivities.length > 0 ? recentActivities : [
    { action: "Submitted", project: "Autumn Textile Print", time: "2 hours ago", status: "pending" },
    { action: "Completed", project: "Minimalist Ring Collection", time: "1 day ago", status: "completed" },
    { action: "Started", project: "Sustainable Resort Collection", time: "3 days ago", status: "active" },
    { action: "Published", project: "Urban Street Style Series", time: "1 week ago", status: "published" },
  ];

  return (
    <AppLayout>
      <WelcomeModal
        isOpen={showWelcome}
        onClose={handleWelcomeClose}
        userName={profile?.name || undefined}
      />

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
              {profileLoading ? (
                <>
                  <Skeleton className="h-10 w-64" />
                  <Skeleton className="h-5 w-48" />
                </>
              ) : (
                <>
                  <h1 className="text-display-xl">{greeting.title}</h1>
                  <p className="text-caption text-base">{greeting.subtitle}</p>
                </>
              )}
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
            {statsLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </>
            ) : (
              <>
                <StatCard
                  title="Active Styleboxes"
                  value={stats.activeStyleboxes}
                  subtitle={`${stats.completedStyleboxes} completed this year`}
                  icon={Box}
                />
                <StatCard
                  title="Completed"
                  value={stats.completedStyleboxes}
                  subtitle="This year"
                  icon={Trophy}
                  trend={stats.completedStyleboxes > 0 ? { value: 12, isPositive: true } : undefined}
                />
                <StatCard
                  title="Portfolio Items"
                  value={stats.portfolioItems}
                  subtitle={`${stats.productsSold} published`}
                  icon={FolderOpen}
                />
                <StatCard
                  title="Earnings"
                  value={`$${stats.monthlyEarnings.toLocaleString()}`}
                  subtitle="This month"
                  icon={DollarSign}
                  trend={stats.monthlyEarnings > 0 ? { value: 23, isPositive: true } : undefined}
                />
              </>
            )}
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
                  {displayActivities.map((activity, index) => (
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
            <ErrorBoundary>
              <RankProgress {...rankData} />
            </ErrorBoundary>
            <ErrorBoundary>
              <TeamActivity {...teamData} />
            </ErrorBoundary>
            <ErrorBoundary>
              <EarningsSnapshot
                totalEarnings={stats.totalEarnings}
                monthlyEarnings={stats.monthlyEarnings}
                pendingPayouts={stats.pendingPayouts}
                productsSold={stats.productsSold}
                trend={stats.monthlyEarnings > 0 ? 23 : 0}
              />
            </ErrorBoundary>
          </motion.aside>
        </div>
      </motion.div>
    </AppLayout>
  );
};

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

export default Dashboard;
