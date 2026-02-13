import { Link } from "react-router-dom";
import PublicLayout from "@/components/public/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Users, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { STUDIOS_INFO, getStyleBoxesByStudio } from "@/lib/stylebox-content";
import { LEVEL_LABELS } from "@/lib/stylebox-template";
import type { StudioName, LevelNumber } from "@/lib/stylebox-template";

export default function Studios() {
  const studios = Object.entries(STUDIOS_INFO) as [StudioName, typeof STUDIOS_INFO[StudioName]][];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              MVP Launch - All Challenges Free
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Production-Grade{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Design Studios
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master factory-ready design through 4 progressive levels. From concept sketches to 
              manufacturing specs — every deliverable is production-grade.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Studios Grid */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {studios.map(([studioKey, studio], index) => {
              const styleboxes = getStyleBoxesByStudio(studioKey);
              
              return (
                <motion.div
                  key={studioKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                    <div className={`h-2 bg-gradient-to-r ${studio.color}`} />
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-4xl mb-2 block">{studio.icon}</span>
                          <CardTitle className="text-2xl font-display">{studio.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{studio.subtitle}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {studio.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-muted-foreground">{studio.description}</p>
                      
                      {/* Level Progression */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-primary" />
                          4-Level Progression
                        </h4>
                        <div className="space-y-2">
                          {([1, 2, 3, 4] as LevelNumber[]).map((level) => {
                            const stylebox = styleboxes.find(sb => sb.level_number === level);
                            const levelInfo = LEVEL_LABELS[level];
                            
                            return (
                              <div 
                                key={level}
                                className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                              >
                                <span className={`h-3 w-3 rounded-full ${levelInfo.color}`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {stylebox?.title?.split(':')[1]?.trim() || `Level ${level}`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {stylebox?.time_limit_hours || 4}h
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {stylebox?.xp_reward || 100} XP
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Target Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          4 Challenges
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          136+ Hours Content
                        </span>
                      </div>

                      <Button className="w-full group-hover:bg-primary" asChild>
                        <Link to={`/styleboxes?studio=${studioKey}`}>
                          Start Studio Journey
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Build Your Portfolio?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Complete all 16 challenges across 4 studios to become a production-ready designer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/auth">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/styleboxes">Browse All Challenges</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
