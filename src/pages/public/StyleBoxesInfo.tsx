import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  Box, 
  Palette, 
  Layers, 
  Scissors,
  Sparkles,
  Target,
  Award,
  Lock,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";

const categories = [
  { name: "Streetwear", count: 24, icon: "🔥", description: "Urban fashion and street culture designs" },
  { name: "Couture", count: 18, icon: "✨", description: "High-end luxury and runway pieces" },
  { name: "Essentials", count: 32, icon: "👔", description: "Everyday wardrobe staples" },
  { name: "Formal", count: 16, icon: "🎩", description: "Business and occasion wear" },
  { name: "Avant-Garde", count: 12, icon: "🎨", description: "Experimental and boundary-pushing designs" },
  { name: "Sustainable", count: 20, icon: "🌱", description: "Eco-friendly and ethical fashion" },
];

const levels = [
  { name: "Free", color: "secondary", description: "Basic challenges to get started", boxes: 5 },
  { name: "Easy", color: "success", description: "Build foundational skills", boxes: 15 },
  { name: "Medium", color: "warning", description: "Production-ready techniques", boxes: 25 },
  { name: "Hard", color: "destructive", description: "Advanced industry challenges", boxes: 20 },
  { name: "Insane", color: "accent", description: "Elite designer mastery", boxes: 10 },
];

const sampleChallenges = [
  { title: "Pattern Foundation", level: "Easy", skill: "Pattern Design", xp: 100 },
  { title: "Moodboard Mastery", level: "Easy", skill: "Creative Direction", xp: 100 },
  { title: "Capsule Collection", level: "Medium", skill: "Collection Development", xp: 250 },
  { title: "Trend Interpretation", level: "Medium", skill: "Market Analysis", xp: 250 },
  { title: "Tech Pack Pro", level: "Hard", skill: "Production Ready", xp: 500 },
  { title: "Construction Expert", level: "Hard", skill: "Garment Construction", xp: 500 },
];

const skillMetrics = [
  { name: "Creativity", description: "Originality and innovation in design approach" },
  { name: "Execution", description: "Technical accuracy and attention to detail" },
  { name: "Originality", description: "Unique perspective and personal style" },
  { name: "Brand Coherence", description: "Consistent aesthetic and messaging" },
  { name: "Craftsmanship", description: "Quality of construction and finishing" },
];

const subscriptionAccess = [
  { tier: "Basic", access: "5 Free StyleBoxes", publishing: false, price: "PKR 1,500/mo" },
  { tier: "Pro", access: "Unlimited StyleBoxes", publishing: true, price: "PKR 3,900/mo" },
  { tier: "Elite", access: "Priority + Mentorship", publishing: true, price: "PKR 9,900/mo" },
];

export default function StyleBoxesInfo() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-6">Gamified Learning</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              StyleBoxes
              <br />
              <span className="text-muted-foreground">Learn by Creating</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Hands-on challenges that build true industry skills. Every completed box becomes 
              a portfolio asset and a potential product on the marketplace.
            </p>
            <Link to="/auth">
              <Button size="lg">
                Start Your First StyleBox
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Design Categories</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Explore Categories
            </h2>
            <p className="text-muted-foreground">
              Choose your path across six distinct fashion verticals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl">{cat.icon}</span>
                      <Badge variant="secondary">{cat.count} boxes</Badge>
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">{cat.name}</h3>
                    <p className="text-muted-foreground text-sm">{cat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels & Progression */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Progression System</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Levels & Progression
            </h2>
            <p className="text-muted-foreground">
              Tiered challenges that unlock as you grow. Earn badges, rankings, and portfolio assets.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {levels.map((level, i) => (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant={level.color as any}>{level.name}</Badge>
                        <span className="font-medium">{level.description}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{level.boxes} boxes</span>
                    </div>
                    <Progress value={(level.boxes / 32) * 100} className="h-2" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Challenges */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Challenge Examples</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Sample Challenges
            </h2>
            <p className="text-muted-foreground">
              From pattern building to collection development—real industry tasks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleChallenges.map((challenge, i) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={
                        challenge.level === 'Easy' ? 'success' : 
                        challenge.level === 'Medium' ? 'warning' : 'destructive'
                      }>
                        {challenge.level}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4" />
                        {challenge.xp} XP
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">{challenge.skill}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skill Metrics */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 border-background/20 text-background">
              Evaluation
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Skill Metrics
            </h2>
            <p className="text-background/60">
              Your work is evaluated across five core dimensions of fashion design.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {skillMetrics.map((metric, i) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="h-16 w-16 rounded-full bg-background/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="font-display font-semibold mb-2">{metric.name}</h3>
                <p className="text-xs text-background/60">{metric.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Access */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Access Tiers</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Subscription Access
            </h2>
            <p className="text-muted-foreground">
              Full access for Pro and Elite members with publishing rights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {subscriptionAccess.map((tier, i) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`h-full ${tier.tier === 'Pro' ? 'border-foreground' : ''}`}>
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-semibold mb-2">{tier.tier}</h3>
                    <p className="text-2xl font-bold mb-4">{tier.price}</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        {tier.access}
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        {tier.publishing ? (
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                        {tier.publishing ? 'Publishing Rights' : 'No Publishing'}
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/pricing">
              <Button size="lg">
                View Full Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
