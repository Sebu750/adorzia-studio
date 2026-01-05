import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Award, Medal, Sparkles, Trophy } from "lucide-react";
import PublicLayout from "@/components/public/PublicLayout";
import SEOHead from "@/components/public/SEOHead";
import { mockLeaderboard } from "@/lib/styleathon-images";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="text-muted-foreground font-mono">#{rank}</span>;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 dark:from-yellow-950/20 dark:to-amber-950/20 dark:border-yellow-800/30";
    case 2:
      return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 dark:from-gray-950/20 dark:to-slate-950/20 dark:border-gray-700/30";
    case 3:
      return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-800/30";
    default:
      return "bg-card border-border";
  }
};

const StyleathonLeaderboard = () => {
  const top3 = mockLeaderboard.slice(0, 3);
  const others = mockLeaderboard.slice(3);

  return (
    <PublicLayout>
      <SEOHead
        title="Leaderboard - Styleathon 01 | Adorzia"
        description="View the current rankings for Styleathon 01 - Graduation Thesis Edition"
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 md:py-20 border-b border-border">
          <div className="container mx-auto px-4">
            <Link
              to="/styleathon/01"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Styleathon
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Award className="w-12 h-12 text-primary mx-auto mb-6" />
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Leaderboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Styleathon 01 — Graduation Thesis Edition
              </p>
            </motion.div>
          </div>
        </section>

        {/* Top 3 Highlight */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Second Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="order-2 md:order-1"
              >
                <div className={`p-6 rounded-2xl border ${getRankStyle(2)} text-center`}>
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Medal className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">2nd Place</p>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    {top3[1].name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{top3[1].project}</p>
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-mono font-semibold">{top3[1].xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </motion.div>

              {/* First Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="order-1 md:order-2 md:-mt-8"
              >
                <div className={`p-8 rounded-2xl border ${getRankStyle(1)} text-center`}>
                  <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-yellow-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">1st Place</p>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-1">
                    {top3[0].name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{top3[0].project}</p>
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-mono font-semibold text-lg">{top3[0].xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </motion.div>

              {/* Third Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="order-3"
              >
                <div className={`p-6 rounded-2xl border ${getRankStyle(3)} text-center`}>
                  <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                    <Medal className="w-8 h-8 text-amber-600" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">3rd Place</p>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    {top3[2].name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{top3[2].project}</p>
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-mono font-semibold">{top3[2].xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Full Rankings */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-8 text-center">
                Full Rankings
              </h2>
              <div className="space-y-3">
                {mockLeaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-sm ${getRankStyle(entry.rank)}`}
                  >
                    <div className="w-10 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{entry.name}</p>
                      <p className="text-sm text-muted-foreground">{entry.project}</p>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-mono font-medium">{entry.xp.toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default StyleathonLeaderboard;
