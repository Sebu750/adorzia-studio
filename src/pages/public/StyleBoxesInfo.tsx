import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  Sparkles,
  Target,
  CheckCircle2,
  Lock,
  Crown,
  Briefcase,
  GraduationCap,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import ParallaxSection from "@/components/public/ParallaxSection";
import SEOHead from "@/components/public/SEOHead";
import { styleboxImages, backgroundImages } from "@/lib/images";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/subscription";

const categories = [
  { name: "Streetwear", count: 24, image: styleboxImages.streetwear, description: "Urban fashion and street culture designs" },
  { name: "Couture", count: 18, image: styleboxImages.couture, description: "High-end luxury and runway pieces" },
  { name: "Essentials", count: 32, image: styleboxImages.essentials, description: "Everyday wardrobe staples" },
  { name: "Formal", count: 16, image: styleboxImages.formal, description: "Business and occasion wear" },
  { name: "Avant-Garde", count: 12, image: styleboxImages.avantGarde, description: "Experimental and boundary-pushing designs" },
  { name: "Sustainable", count: 20, image: styleboxImages.sustainable, description: "Eco-friendly and ethical fashion" },
];

const levels = [
  { name: "Free", color: "secondary", description: "Basic challenges to get started", boxes: 5 },
  { name: "Easy", color: "success", description: "Build foundational skills", boxes: 15 },
  { name: "Medium", color: "warning", description: "Production-ready techniques", boxes: 25 },
  { name: "Hard", color: "destructive", description: "Advanced industry challenges", boxes: 20 },
  { name: "Insane", color: "accent", description: "Elite designer mastery", boxes: 10 },
];

const sampleChallenges = [
<<<<<<< HEAD
  { title: "Pattern Foundation", level: "Easy", skill: "Pattern Design", sc: 100 },
  { title: "Moodboard Mastery", level: "Easy", skill: "Creative Direction", sc: 100 },
  { title: "Capsule Collection", level: "Medium", skill: "Collection Development", sc: 250 },
  { title: "Trend Interpretation", level: "Medium", skill: "Market Analysis", sc: 250 },
  { title: "Tech Pack Pro", level: "Hard", skill: "Production Ready", sc: 500 },
  { title: "Construction Expert", level: "Hard", skill: "Garment Construction", sc: 500 },
=======
  { title: "Pattern Foundation", level: "Easy", skill: "Pattern Design", xp: 100 },
  { title: "Moodboard Mastery", level: "Easy", skill: "Creative Direction", xp: 100 },
  { title: "Capsule Collection", level: "Medium", skill: "Collection Development", xp: 250 },
  { title: "Trend Interpretation", level: "Medium", skill: "Market Analysis", xp: 250 },
  { title: "Tech Pack Pro", level: "Hard", skill: "Production Ready", xp: 500 },
  { title: "Construction Expert", level: "Hard", skill: "Garment Construction", xp: 500 },
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
];

const skillMetrics = [
  { name: "Creativity", description: "Originality and innovation in design approach" },
  { name: "Execution", description: "Technical accuracy and attention to detail" },
  { name: "Originality", description: "Unique perspective and personal style" },
  { name: "Brand Coherence", description: "Consistent aesthetic and messaging" },
  { name: "Craftsmanship", description: "Quality of construction and finishing" },
];

// Build subscription access from centralized config
const tierIcons: Record<SubscriptionTier, React.ReactNode> = {
  basic: <GraduationCap className="h-5 w-5" />,
  pro: <Briefcase className="h-5 w-5" />,
  elite: <Crown className="h-5 w-5" />,
};

const tierFeatures: Record<SubscriptionTier, string[]> = {
  basic: [
    "3 Basic StyleBoxes",
    "3 Portfolio Designs",
    "Community Forum Access",
    "No Marketplace Earnings"
  ],
  pro: [
    "Full StyleBox Access",
    "20 Portfolio Designs",
    "1 Production Request/mo",
    "Marketplace Earnings ✓"
  ],
  elite: [
    "All Challenges (incl. Team)",
    "Unlimited Portfolio",
    "5 Production Requests/mo",
    "Curator Review ✓"
  ],
};

export default function StyleBoxesInfo() {
  return (
    <PublicLayout>
      <SEOHead 
        title="StyleBoxes - Learn Fashion Design | Adorzia"
        description="Hands-on design challenges that build real industry skills. Every completed StyleBox becomes a portfolio asset and potential marketplace product."
        url="https://studio.adorzia.com/styleboxes-info"
        keywords="fashion design challenges, learn fashion design, design portfolio, stylebox, gamified learning"
      />
      {/* Hero with gradient background */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <motion.div 
          className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative">
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
              <Button size="lg" className="group">
                Start Your First StyleBox
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories with images */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Design Categories</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Explore Categories
            </AnimatedHeading>
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
                <TiltCard className="h-full">
                  <Card className="h-full overflow-hidden group">
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <Badge variant="secondary" className="absolute bottom-3 right-3">
                        {cat.count} boxes
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-display text-xl font-semibold mb-2">{cat.name}</h3>
                      <p className="text-muted-foreground text-sm">{cat.description}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels & Progression with parallax */}
      <ParallaxSection 
        backgroundImage={backgroundImages.textile}
        className="py-20 md:py-28"
        speed={0.3}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Progression System</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Levels & Progression
            </AnimatedHeading>
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
                <Card className="backdrop-blur-sm bg-background/90">
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
      </ParallaxSection>

      {/* Sample Challenges */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Challenge Examples</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Sample Challenges
            </AnimatedHeading>
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
                <TiltCard tiltAmount={8}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
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
<<<<<<< HEAD
                          {challenge.sc} SC
=======
                          {challenge.xp} XP
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                        </div>
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-2">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.skill}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
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
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Skill Metrics
            </AnimatedHeading>
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
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="h-16 w-16 rounded-full bg-background/10 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Target className="h-8 w-8" />
                </motion.div>
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
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Subscription Access
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Subscriptions unlock tools & challenges. Choose the tier that fits your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(Object.keys(SUBSCRIPTION_TIERS) as SubscriptionTier[]).map((tierId, i) => {
              const tier = SUBSCRIPTION_TIERS[tierId];
              const isPopular = tierId === 'pro';
              const isElite = tierId === 'elite';
              const features = tierFeatures[tierId];
              
              return (
                <motion.div
                  key={tierId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <TiltCard tiltAmount={5}>
                    <Card className={`h-full relative overflow-hidden ${
                      isPopular ? 'border-primary ring-2 ring-primary/20' : 
                      isElite ? 'border-amber-500/50 ring-1 ring-amber-500/20' : ''
                    }`}>
                      {/* Coming Soon Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="text-xs">
                          {tier.price === 0 ? 'Free' : 'Coming Soon'}
                        </Badge>
                      </div>
                      
                      {/* Popular Badge */}
                      {isPopular && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                            <Star className="h-3 w-3" /> Popular
                          </Badge>
                        </div>
                      )}
                      
                      <CardContent className="p-6 pt-8">
                        {/* Icon & Title */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            isElite ? 'bg-amber-500/10 text-amber-600' :
                            isPopular ? 'bg-primary/10 text-primary' : 
                            'bg-muted text-muted-foreground'
                          }`}>
                            {tierIcons[tierId]}
                          </div>
                          <div>
                            <h3 className="font-display text-lg font-semibold">{tier.name}</h3>
                            <p className="text-xs text-muted-foreground">{tier.subtitle}</p>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="mb-5">
                          <p className="text-2xl font-bold">
                            {tier.priceFormatted}
                          </p>
                        </div>
                        
                        {/* Features */}
                        <ul className="space-y-2.5">
                          {features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              {feature.includes('No ') || feature.includes('✗') ? (
                                <Lock className="h-4 w-4 text-muted-foreground/50 mt-0.5 shrink-0" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              )}
                              <span className={feature.includes('No ') ? 'text-muted-foreground' : ''}>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                        
                        {/* Publishing Status */}
                        <div className={`mt-4 pt-4 border-t flex items-center gap-2 text-sm ${
                          tier.limits.canPublish ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {tier.limits.canPublish ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Publishing Rights Included
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4" />
                              No Publishing Rights
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12 space-y-4">
            <p className="text-sm text-muted-foreground">
              Subscriptions are for <span className="font-medium text-foreground">access to tools & challenges</span>. 
              Want lifetime profit boosts? Check out our Founder Titles.
            </p>
            <Link to="/pricing">
              <Button size="lg" className="group">
                View Full Pricing & Founder Titles
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
