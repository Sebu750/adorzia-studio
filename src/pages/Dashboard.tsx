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
import { Box, Trophy, FolderOpen, DollarSign, ArrowRight, Sparkles, Award, Heart } from "lucide-react";
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
import { useFoundingSubmissions } from "@/hooks/useFoundingSubmissions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { SCDifficulty } from "@/lib/style-credits";
import bannerImage from "@/assets/Yusra_4.jpeg";

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
    styleCredits: profile?.style_credits || 0,
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
          className="relative overflow-hidden rounded-xl p-4 sm:p-6 border border-[#bb9457]/20"
          role="banner"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#6f1d1b]/5 via-[#bb9457]/5 to-transparent" style={{ zIndex: 0 }} />
          <img 
            src={bannerImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-10"
            style={{ zIndex: 1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/70 to-background/40" style={{ zIndex: 2 }} />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-3" style={{ zIndex: 3 }}>
            <div className="space-y-1">
              {profileLoading ? (
                <>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#6f1d1b]">{greeting.title}</h1>
                  <p className="text-sm sm:text-base text-[#6f1d1b]/80">{greeting.subtitle}</p>
                </>
              )}
            </div>
            <Button 
              variant="default" 
              size="sm" 
              className="gap-1 btn-press bg-[#6f1d1b] border-[#bb9457] hover:bg-[#5a1716] hover:border-[#c9a776]"
              onClick={() => navigate("/styleboxes")}
            >
              <Sparkles className="h-3 w-3" />
              <span className="text-sm">Explore</span>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {statsLoading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-md" />
                ))}
              </>
            ) : (
              <>
                <StatCard
                  title="Active"
                  value={stats.activeStyleboxes}
                  subtitle={`${stats.completedStyleboxes} done`}
                  icon={Box}
                />
                <StatCard
                  title="Done"
                  value={stats.completedStyleboxes}
                  subtitle="This year"
                  icon={Trophy}
                  trend={stats.completedStyleboxes > 0 ? { value: 12, isPositive: true } : undefined}
                />
                <StatCard
                  title="Portfolio"
                  value={stats.portfolioItems}
                  subtitle={`${stats.productsSold} pub.`}
                  icon={FolderOpen}
                />
                <StatCard
                  title="Love"
                  value={stats.loveCount}
                  subtitle="Followers"
                  icon={Heart}
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
          {/* Founding Designers Program Banner */}
          <motion.div 
            className="lg:col-span-3"
            variants={itemVariants}
          >
            <Card className="relative overflow-hidden border-[#bb9457]/30">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6f1d1b]/10 via-[#bb9457]/5 to-[#6f1d1b]/10" />
              <img 
                src={bannerImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-10"
                style={{ zIndex: 0 }}
              />
              <CardContent className="p-4 relative z-10 bg-[#6f1d1b]/5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bb9457]/15 border border-[#bb9457]/30">
                      <Sparkles className="h-5 w-5 text-[#bb9457] animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold flex items-center gap-2">
                        Founding Designers
                        <Badge variant="outline" className="text-xs border-[#bb9457]/30 text-[#bb9457]">Limited</Badge>
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        40% profit-sharing model
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate("/founding-designers")}
                    size="sm"
                    className="gap-1 text-sm bg-[#6f1d1b] border-[#bb9457] hover:bg-[#5a1716] hover:border-[#c9a776]"
                  >
                    <Award className="h-3 w-3" />
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Left Column - Rank Progress */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            variants={itemVariants}
          >
            <Card className="overflow-hidden">
              <div className="relative bg-gradient-to-r from-[#6f1d1b]/10 to-[#bb9457]/10 p-6 border-b border-[#bb9457]/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Your Rank Progress</h3>
                    <p className="text-sm text-muted-foreground">Track your advancement through the designer tiers</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-medium border-[#bb9457]/30 text-[#bb9457]">
                      {rankData.currentRank.charAt(0).toUpperCase() + rankData.currentRank.slice(1)}
                    </Badge>
                    <Badge className="bg-[#6f1d1b] text-white border border-[#bb9457]/30">
                      SC: {rankData.styleCredits}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 bg-[#6f1d1b]/5">
                <div className="space-y-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress to Next Rank</span>
                    <span className="font-medium text-[#bb9457]">{Math.round((profile?.rank_progress || 0) * 100)}%</span>
                  </div>
                  <div className="w-full bg-[#bb9457]/20 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6f1d1b] via-[#bb9457] to-[#6f1d1b]/80 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-[#bb9457]/30"
                      style={{ 
                        width: `${(profile?.rank_progress || 0) * 100}%`
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 bg-[#bb9457]/10 rounded-lg border border-[#bb9457]/20">
                      <div className="text-2xl font-bold text-[#6f1d1b]">{profile?.style_credits || 0}</div>
                      <div className="text-xs text-muted-foreground mt-1">Style Credits</div>
                    </div>
                    <div className="text-center p-4 bg-[#bb9457]/10 rounded-lg border border-[#bb9457]/20">
                      <div className="text-2xl font-bold text-[#6f1d1b]">{stats.completedStyleboxes || 0}</div>
                      <div className="text-xs text-muted-foreground mt-1">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-[#bb9457]/10 rounded-lg border border-[#bb9457]/20">
                      <div className="text-2xl font-bold text-[#6f1d1b]">{profile?.portfolio_items_count || 0}</div>
                      <div className="text-xs text-muted-foreground mt-1">Portfolio Items</div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-3 text-[#6f1d1b]">Next Rank Benefits</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Commission Rate</span>
                        <span className="font-medium text-[#bb9457]">{rankData.currentRank === 'apprentice' ? '5%' : rankData.currentRank === 'artisan' ? '10%' : rankData.currentRank === 'craftsman' ? '15%' : '20%'} → Up to 25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Products</span>
                        <span className="font-medium text-[#bb9457]">{rankData.currentRank === 'apprentice' ? '5' : rankData.currentRank === 'artisan' ? '10' : rankData.currentRank === 'craftsman' ? '20' : '50'} → 100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Earnings Snapshot */}
            <Card className="overflow-hidden">
              <div className="relative bg-gradient-to-r from-[#6f1d1b]/20 via-[#bb9457]/10 to-[#6f1d1b]/20 p-6 border-b border-[#bb9457]/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#6f1d1b]/5 via-transparent to-transparent opacity-30"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Earnings Overview</h3>
                    <p className="text-sm text-muted-foreground">Track your financial performance</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#bb9457]/20 rounded-lg border border-[#bb9457]/30">
                      <DollarSign className="h-5 w-5 text-[#bb9457]" />
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 bg-[#6f1d1b]/5">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-[#bb9457]/10 to-[#6f1d1b]/10 rounded-xl border border-[#bb9457]/20">
                    <p className="text-sm text-muted-foreground mb-1">Monthly Earnings</p>
                    <p className="text-2xl font-bold text-[#6f1d1b]">${stats.monthlyEarnings.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[#bb9457]/5 to-[#6f1d1b]/5 rounded-xl border border-[#bb9457]/15">
                    <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold text-[#6f1d1b]/80">${stats.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pending Payouts</span>
                    <span className="font-medium text-[#6f1d1b]">${stats.pendingPayouts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Products Sold</span>
                    <span className="font-medium text-[#6f1d1b]">{stats.productsSold}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Monthly</span>
                    <span className="font-medium text-[#bb9457]">+{stats.trend}%</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-[#bb9457]/20">
                  <Button className="w-full bg-[#6f1d1b] border-[#bb9457] hover:bg-[#5a1716] hover:border-[#c9a776] text-white">
                    <DollarSign className="h-4 w-4 mr-2" />
                    View Financial Report
                  </Button>
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
                  className="gap-1.5 text-muted-foreground hover:text-foreground border-[#bb9457] hover:bg-[#6f1d1b]/20"
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
                    <Button className="bg-[#6f1d1b] border-[#bb9457] hover:bg-[#5a1716] hover:border-[#c9a776]" onClick={() => navigate("/styleboxes")}>
                      Browse Styleboxes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
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
                    <Button variant="outline" size="sm" className="border-[#bb9457] hover:bg-[#6f1d1b] hover:text-white hover:border-[#c9a776]" onClick={() => navigate("/teams")}>
                      Explore Teams
                    </Button>
                  </CardContent>
                </Card>
              )}
            </ErrorBoundary>
            <Card className="overflow-hidden">
              <div className="relative bg-gradient-to-r from-[#6f1d1b]/15 via-[#bb9457]/10 to-[#6f1d1b]/15 p-5 border-b border-[#bb9457]/25">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#6f1d1b]/5 via-transparent to-transparent opacity-20"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Recent Activity</h3>
                    <p className="text-xs text-muted-foreground">Latest actions in your account</p>
                  </div>
                  <div className="p-2 bg-[#bb9457]/15 rounded-lg border border-[#bb9457]/25">
                    <Box className="h-4 w-4 text-[#bb9457]" />
                  </div>
                </div>
              </div>
              <CardContent className="p-4 max-h-80 overflow-y-auto bg-[#6f1d1b]/5">
                <div className="space-y-3">
                  {activitiesLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-[#6f1d1b]/10 rounded-lg border border-[#bb9457]/15">
                          <div className="h-2 w-2 rounded-full bg-[#bb9457]" />
                          <div className="space-y-1 flex-1">
                            <div className="h-3 w-3/4 bg-[#6f1d1b]/20 rounded"></div>
                            <div className="h-2 w-1/2 bg-[#6f1d1b]/20 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentActivities.length > 0 ? (
                    <div className="divide-y divide-[#bb9457]/10">
                      {recentActivities.map((activity, index) => (
                        <div 
                          key={index} 
                          className="py-3 first:pt-0 last:pb-0"
                          role="listitem"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-[#bb9457]" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">
                                <span className="text-muted-foreground">{activity.action}</span>{" "}
                                <span className="font-medium truncate">{activity.project}</span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                            </div>
                            <Badge variant={
                              activity.status === "completed" ? "secondary" :
                              activity.status === "pending" ? "outline" :
                              activity.status === "published" ? "default" : "outline"
                            } className="text-xs border-[#bb9457]/30">
                              {activity.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Box className="h-8 w-8 mx-auto text-[#bb9457]/60 mb-2" />
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
