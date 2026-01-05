import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, Medal, Sparkles, Trophy } from "lucide-react";
import PublicLayout from "@/components/public/PublicLayout";
import SEOHead from "@/components/public/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockWinners, mockLeaderboard } from "@/lib/styleathon-images";

const getPlaceLabel = (rank: number) => {
  switch (rank) {
    case 1:
      return "1st Place";
    case 2:
      return "2nd Place";
    case 3:
      return "3rd Place";
    default:
      return `${rank}th Place`;
  }
};

const getPlaceIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-600" />;
    default:
      return null;
  }
};

const StyleathonResults = () => {
  const finalists = mockLeaderboard.slice(3, 10);

  return (
    <PublicLayout>
      <SEOHead
        title="Results - Styleathon 01 | Adorzia"
        description="Winners and results of Styleathon 01 - Graduation Thesis Edition"
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 md:py-20 border-b border-border bg-foreground text-background">
          <div className="container mx-auto px-4">
            <Link
              to="/styleathon/01"
              className="inline-flex items-center gap-2 text-background/70 hover:text-background transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Styleathon
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Award className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                Styleathon 01 Winners
              </h1>
              <p className="text-background/70 text-lg md:text-xl">
                Graduation Thesis Edition — Celebrating exceptional design talent
              </p>
            </motion.div>
          </div>
        </section>

        {/* Winners Spotlight */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-semibold text-foreground text-center mb-12"
            >
              Winners Spotlight
            </motion.h2>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {mockWinners.map((winner, index) => (
                <motion.div
                  key={winner.rank}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`relative group ${
                    winner.rank === 1 ? "lg:-mt-8" : ""
                  }`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={winner.heroImage}
                      alt={winner.project}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />

                    {/* Place Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/95 backdrop-blur-sm">
                        {getPlaceIcon(winner.rank)}
                        <span className="font-semibold">{getPlaceLabel(winner.rank)}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={winner.avatar}
                          alt={winner.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-background/20"
                        />
                        <div>
                          <h3 className="font-display text-xl text-background font-semibold">
                            {winner.name}
                          </h3>
                          <p className="text-background/70">{winner.project}</p>
                        </div>
                      </div>

                      {/* Prize & Rewards */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary/90 text-primary-foreground">
                          {winner.prize}
                        </Badge>
                        <Badge variant="secondary" className="bg-background/20 text-background">
                          <Sparkles className="w-3 h-3 mr-1" />
                          +{winner.xpEarned.toLocaleString()} XP
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Badges Earned */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {winner.badges.map((badge) => (
                      <Badge key={badge} variant="outline" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Prize Highlights */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                Prize Distribution
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: "Total Prize Pool", value: "₨950,000" },
                { label: "1st Place", value: "₨500,000" },
                { label: "2nd Place", value: "₨300,000" },
                { label: "3rd Place", value: "₨150,000" },
              ].map((prize, index) => (
                <motion.div
                  key={prize.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-card border border-border rounded-xl text-center"
                >
                  <p className="text-sm text-muted-foreground mb-2">{prize.label}</p>
                  <p className="font-display text-2xl font-bold text-foreground">
                    {prize.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Finalists */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                Finalists
              </h2>
              <p className="text-muted-foreground">
                Outstanding designers who made it to the top 10
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {finalists.map((finalist, index) => (
                <motion.div
                  key={finalist.rank}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 bg-card border border-border rounded-xl text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <span className="font-mono text-muted-foreground">#{finalist.rank}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{finalist.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{finalist.project}</p>
                  <div className="flex items-center justify-center gap-1 text-primary text-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>{finalist.xp.toLocaleString()} XP</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-foreground text-background">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Explore Top Designers
              </h2>
              <p className="text-background/70 text-lg mb-8">
                Connect with the talented designers from Styleathon 01 and explore their work
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/styleathon/01/submissions">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    View All Submissions
                  </Button>
                </Link>
                <Link to="/designers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-background/30 text-background hover:bg-background/10"
                  >
                    Explore Top Designers
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default StyleathonResults;
