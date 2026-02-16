import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { StyleboxDashboardCard } from "@/components/stylebox/StyleboxDashboardCard";
import { RankProgress } from "@/components/dashboard/RankProgress";
import { TeamActivity } from "@/components/dashboard/TeamActivity";
import { EarningsSnapshot } from "@/components/dashboard/EarningsSnapshot";
import { WelcomeModal } from "@/components/WelcomeModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EmptyActivity } from "@/components/empty-states/EmptyActivity";
<<<<<<< HEAD
import { Box, Trophy, FolderOpen, DollarSign, ArrowRight, Sparkles, Award, Heart } from "lucide-react";
=======
import { Box, Trophy, FolderOpen, DollarSign, ArrowRight, Sparkles } from "lucide-react";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RankTier, STANDARD_RANKS } from "@/lib/ranks";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { useGreeting } from "@/hooks/useGreeting";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useActiveStyleboxes } from "@/hooks/useActiveStyleboxes";
import { useTeamData } from "@/hooks/useTeamData";
<<<<<<< HEAD
import { useFoundingSubmissions } from "@/hooks/useFoundingSubmissions";
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { SCDifficulty } from "@/lib/style-credits";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, loading: profileLoading, markFirstLoginComplete } = useProfile();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { styleboxes: activeStyleboxes, loading: styleboxesLoading } = useActiveStyleboxes();
  const { team: teamData, loading: teamLoading } = useTeamData();
  const [showWelcome, setShowWelcome] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  const greeting = useGreeting({
    name: profile?.name,
    isFirstLogin: false,
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
    if (!user) {
      setActivitiesLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        const { data: submissions } = await supabase
          .from("stylebox_submissions")
          .select("*, styleboxes(title)")
          .eq("designer_id", user.id)
          .order("submitted_at", { ascending: false })
          .limit(4);

        if (submissions && submissions.length > 0) {
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
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  // Safely determine current rank from profile
  const getCurrentRank = (): RankTier => {
    if (profile?.rank?.rank_order !== undefined) {
      const order = profile.rank.rank_order;
      const standardRankIndex = order - 2;
      if (standardRankIndex >= 0 && standardRankIndex < STANDARD_RANKS.length) {
        return STANDARD_RANKS[standardRankIndex];
      }
    }
    return 'apprentice';
  };

  const rankData = {
    currentRank: getCurrentRank(),
    foundationRank: null as 'f1' | 'f2' | null,
<<<<<<< HEAD
    styleCredits: profile?.style_credits || 0,
=======
    styleCredits: profile?.xp || 0,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    badges: [],
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
            <Button 
              variant="default" 
              size="lg" 
              className="gap-2 btn-press shadow-md"
              onClick={() => navigate("/styleboxes")}
            >
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
<<<<<<< HEAD
                  title="Love Count"
                  value={stats.loveCount}
                  subtitle="Total followers"
                  icon={Heart}
                />
                <StatCard
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
          {/* Founding Designers Program Banner */}
          <motion.div 
            className="lg:col-span-3"
            variants={itemVariants}
          >
            <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        Founding Designers Program
                        <Badge variant="secondary">Limited Slots</Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Launch your debut collection with 40% profit-sharing model
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate("/founding-designers")}
                    className="gap-2"
                  >
                    <Award className="h-4 w-4" />
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={() => navigate("/styleboxes")}
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                {styleboxesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <Skeleton className="h-48 rounded-xl" />
                    <Skeleton className="h-48 rounded-xl" />
                  </div>
                ) : activeStyleboxes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {activeStyleboxes.map((stylebox) => (
                      <StyleboxDashboardCard 
                        key={stylebox.id} 
                        id={stylebox.id}
                        title={stylebox.title}
                        category={stylebox.category}
                        difficulty={stylebox.difficulty as SCDifficulty}
                        season={stylebox.season || undefined}
                        levelNumber={stylebox.levelNumber}
                        xpReward={stylebox.xpReward}
                        deadline={stylebox.deadlineDate || undefined}
                        thumbnail={stylebox.thumbnail || undefined}
                        studioName={stylebox.studioName || undefined}
                        progress={stylebox.progress}
                        status={stylebox.status === "submitted" ? "submitted" : "active"}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Box className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h4 className="font-medium mb-2">No Active Styleboxes</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start a new challenge to build your portfolio
                    </p>
                    <Button onClick={() => navigate("/styleboxes")}>
                      Browse Styleboxes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-4 border-b border-border">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {activitiesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12" />
                    ))}
                  </div>
                ) : recentActivities.length > 0 ? (
                  <div className="divide-y divide-border">
                    {recentActivities.map((activity, index) => (
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
                ) : (
                  <EmptyActivity />
                )}
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
              {teamLoading ? (
                <Skeleton className="h-48 rounded-xl" />
              ) : teamData ? (
                <TeamActivity {...teamData} />
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <h4 className="font-medium mb-2">No Team Yet</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Join or create a team to collaborate
                    </p>
                    <Button variant="outline" size="sm" onClick={() => navigate("/teams")}>
                      Explore Teams
                    </Button>
                  </CardContent>
                </Card>
              )}
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
