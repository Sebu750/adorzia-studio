import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  Check,
  Crown,
  Zap,
  Star,
  Shield,
  Info,
  Sparkles,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  Rocket,
  Gift,
  Award,
  Target
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import { FOUNDER_TIERS, EARNING_LADDER, PRICING_FAQS } from "@/lib/founder-tiers";
import { useFounderSlots } from "@/hooks/useFounderSlots";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRef } from "react";

// Animated counter component
const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {value.toLocaleString()}{suffix}
    </motion.span>
  );
};

export default function Pricing() {
  const { data: slotData, isLoading } = useFounderSlots();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const f1Remaining = slotData?.f1Remaining ?? 847;
  const f2Remaining = slotData?.f2Remaining ?? 412;
  const f1Percentage = ((1000 - f1Remaining) / 1000) * 100;
  const f2Percentage = ((500 - f2Remaining) / 500) * 100;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PublicLayout>
      {/* Hero Section with Parallax */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <motion.div 
          className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-primary/20 to-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 80, 0], 
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-gradient-to-l from-secondary/30 to-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -60, 0], 
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Floating sparkles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/40 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
        
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-6 px-5 py-2 text-sm bg-secondary/80 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                Membership & Founder Access
              </Badge>
            </motion.div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.05] mb-8 tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Don't Just Join the Platform.
              </motion.span>
              <br />
              <motion.span 
                className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  backgroundPosition: ["0% center", "100% center", "0% center"]
                }}
                transition={{ 
                  opacity: { delay: 0.5 },
                  y: { delay: 0.5 },
                  backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" }
                }}
              >
                Own Your Legacy.
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Secure your Lifetime Founder Rank today. Pay once, earn higher royalties forever.
            </motion.p>

            {/* Quick stats */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 md:gap-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedNumber value={f1Remaining + f2Remaining} />
                </div>
                <div className="text-sm text-muted-foreground">Founder Slots Left</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">50%</div>
                <div className="text-sm text-muted-foreground">Max Profit Share</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-500">∞</div>
                <div className="text-sm text-muted-foreground">Lifetime Benefits</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div 
              className="w-1 h-2 bg-muted-foreground/50 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <Gift className="h-3.5 w-3.5 mr-2" />
              Why "Founder" Ranks?
            </Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              The Philosophy
            </AnimatedHeading>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full bg-gradient-to-br from-secondary/50 to-secondary/20 border-none hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5">
                    <Rocket className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">We're in Our Launch Phase</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Adorzia is building the future of fashion manufacturing. We want to reward the visionaries who support us early with exclusive lifetime benefits.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full bg-gradient-to-br from-primary/10 to-primary/5 border-none hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-foreground/20 to-foreground/5 flex items-center justify-center mb-5">
                    <Crown className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">Limited-Edition Lifetime Licenses</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    By purchasing a Founder Rank today, you secure a <strong className="text-foreground">permanent Profit Share Bonus</strong> that future users will never be able to buy.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <Target className="h-3.5 w-3.5 mr-2" />
              Choose Your Path
            </Badge>
            <AnimatedHeading className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Select Your Membership
            </AnimatedHeading>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Standard Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="lg:pt-8"
            >
              <TiltCard tiltAmount={4} glareEnabled={false}>
                <Card className="h-full bg-gradient-to-b from-background to-secondary/20 hover:shadow-xl transition-all duration-500">
                  <CardHeader className="text-center pb-4">
                    <motion.div 
                      className="h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center mx-auto mb-5 shadow-lg"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Star className="h-8 w-8" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground mb-2">For: {FOUNDER_TIERS.standard.targetAudience}</p>
                    <h3 className="font-display text-2xl font-bold">{FOUNDER_TIERS.standard.name}</h3>
                    <div className="mt-5">
                      <span className="text-5xl font-bold">{FOUNDER_TIERS.standard.priceFormatted}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Base Profit Share: Starts at <span className="font-semibold text-foreground">{FOUNDER_TIERS.standard.startingShare}%</span>
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span>Scales up to 40% with XP</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span>Publishing: Lottery System</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span>StyleBox: Easy Level Only</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span>Manufacturing: Limited Slots</span>
                      </div>
                    </div>
                    <Link to="/auth">
                      <Button className="w-full h-12 group text-base" variant="outline">
                        {FOUNDER_TIERS.standard.ctaText}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>

            {/* F1 Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="lg:pt-4"
            >
              <TiltCard tiltAmount={5} glareEnabled={false}>
                <Card className="h-full relative overflow-hidden border-primary/40 bg-gradient-to-b from-primary/5 to-background hover:shadow-xl hover:border-primary/60 transition-all duration-500">
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                  
                  <CardHeader className="text-center pb-4 relative">
                    <div className="flex justify-center mb-4">
                      <Badge variant="secondary" className="text-xs px-3 py-1 bg-primary/10 border-primary/20">
                        <Users className="h-3 w-3 mr-1.5" />
                        {f1Remaining.toLocaleString()} of 1,000 Slots Left
                      </Badge>
                    </div>
                    
                    {/* Slots progress bar */}
                    <div className="mb-5">
                      <Progress value={f1Percentage} className="h-2 bg-primary/10" />
                      <p className="text-xs text-muted-foreground mt-2">{Math.round(f1Percentage)}% claimed</p>
                    </div>
                    
                    <motion.div 
                      className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/20"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Zap className="h-8 w-8 text-primary-foreground" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground mb-2">For: {FOUNDER_TIERS.f1.targetAudience}</p>
                    <h3 className="font-display text-2xl font-bold">{FOUNDER_TIERS.f1.name}</h3>
                    <div className="mt-5">
                      <span className="text-5xl font-bold">{FOUNDER_TIERS.f1.priceFormatted}</span>
                      <div className="text-sm text-muted-foreground mt-2">One-Time Payment</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 relative">
                    <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl p-4 mb-6 text-center border border-primary/20">
                      <span className="font-bold text-lg text-primary">+{FOUNDER_TIERS.f1.lifetimeBonus}% Lifetime Bonus</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Starting Share: <span className="font-semibold text-foreground">{FOUNDER_TIERS.f1.startingShare}%</span>
                      </p>
                    </div>
                    <div className="space-y-4 mb-8">
                      {FOUNDER_TIERS.f1.features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/auth">
                      <Button className="w-full h-12 group text-base bg-primary hover:bg-primary/90">
                        {FOUNDER_TIERS.f1.ctaText}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>

            {/* F2 Card (Highlighted) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <TiltCard tiltAmount={6} glareEnabled={true}>
                <Card className="h-full relative overflow-hidden border-2 border-foreground shadow-2xl bg-gradient-to-b from-foreground/5 to-background">
                  {/* Premium glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-transparent to-primary/5" />
                  <motion.div 
                    className="absolute -top-20 -right-20 w-40 h-40 bg-foreground/10 rounded-full blur-3xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-foreground text-background px-5 py-1.5 text-sm shadow-lg">
                      <Award className="h-3.5 w-3.5 mr-1.5" />
                      {FOUNDER_TIERS.f2.highlightLabel}
                    </Badge>
                  </div>
                  
                  <CardHeader className="text-center pb-4 pt-10 relative">
                    <div className="flex justify-center mb-4">
                      <Badge variant="destructive" className="text-xs px-3 py-1 animate-pulse">
                        <AlertCircle className="h-3 w-3 mr-1.5" />
                        Only {f2Remaining} of 500 Slots Left!
                      </Badge>
                    </div>
                    
                    {/* Slots progress bar */}
                    <div className="mb-5">
                      <Progress value={f2Percentage} className="h-2 bg-foreground/10" />
                      <p className="text-xs text-muted-foreground mt-2">{Math.round(f2Percentage)}% claimed • Going fast!</p>
                    </div>
                    
                    <motion.div 
                      className="h-18 w-18 rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center mx-auto mb-5 shadow-xl"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      style={{ width: 72, height: 72 }}
                    >
                      <Crown className="h-9 w-9 text-background" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground mb-2">For: {FOUNDER_TIERS.f2.targetAudience}</p>
                    <h3 className="font-display text-2xl font-bold">{FOUNDER_TIERS.f2.name}</h3>
                    <div className="mt-5">
                      <span className="text-5xl font-bold">{FOUNDER_TIERS.f2.priceFormatted}</span>
                      <div className="text-sm text-muted-foreground mt-2">One-Time Payment</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 relative">
                    <div className="bg-gradient-to-r from-foreground/15 to-foreground/5 rounded-xl p-4 mb-6 text-center border border-foreground/20">
                      <span className="font-bold text-xl">+{FOUNDER_TIERS.f2.lifetimeBonus}% Lifetime Bonus</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Starting Share: <span className="font-semibold text-foreground">{FOUNDER_TIERS.f2.startingShare}%</span> • Max <span className="font-bold text-green-500">50%</span>
                      </p>
                    </div>
                    <div className="space-y-4 mb-8">
                      {FOUNDER_TIERS.f2.features.slice(0, 5).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 text-foreground" />
                          </div>
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/auth">
                      <Button className="w-full h-12 group text-base bg-foreground text-background hover:bg-foreground/90 shadow-lg">
                        {FOUNDER_TIERS.f2.ctaText}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Game of Ranks Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-secondary/50 via-secondary/30 to-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <TrendingUp className="h-3.5 w-3.5 mr-2" />
              The "Game of Ranks"
            </Badge>
            <AnimatedHeading className="font-display text-3xl md:text-5xl font-bold mb-5 tracking-tight">
              How You Earn
            </AnimatedHeading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your income is a combination of your <strong className="text-foreground">Skill</strong> (Rank) + <strong className="text-foreground">Status</strong> (Founder License)
            </p>
          </div>

          {/* Formula Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <Card className="bg-gradient-to-r from-foreground to-foreground/90 text-background p-8 md:p-10 text-center overflow-hidden relative">
              <motion.div 
                className="absolute inset-0 opacity-10"
                style={{
                  background: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 50%, transparent 75%)',
                  backgroundSize: '200% 200%',
                }}
                animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              />
              <p className="text-sm text-background/60 mb-3 uppercase tracking-wider">The Formula</p>
              <p className="text-2xl md:text-3xl font-display font-bold relative">
                Total Earnings = <span className="text-primary">(Skill Rank %)</span> + <span className="text-yellow-400">(Founder Bonus)</span>
              </p>
            </Card>
          </motion.div>

          {/* Earning Ladder Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden shadow-xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/70">
                        <th className="text-left p-5 font-semibold">Skill Rank</th>
                        <th className="text-center p-5 font-semibold">Free</th>
                        <th className="text-center p-5 font-semibold bg-primary/10 text-primary">With F1</th>
                        <th className="text-center p-5 font-semibold bg-foreground/10">With F2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EARNING_LADDER.map((tier, i) => (
                        <motion.tr 
                          key={tier.rank}
                          className={`${i < EARNING_LADDER.length - 1 ? 'border-b' : ''} hover:bg-muted/30 transition-colors`}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <td className="p-5 font-medium">
                            <div className="flex items-center gap-2">
                              {tier.rank}
                              {tier.rank === 'Elite' && (
                                <Badge variant="secondary" className="text-xs">Max Skill</Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-5 text-center text-muted-foreground">{tier.baseShare}%</td>
                          <td className="p-5 text-center bg-primary/5 font-semibold text-primary">{tier.f1Share}%</td>
                          <td className="p-5 text-center bg-foreground/5 font-bold text-lg">
                            {tier.f2Share}%
                            {tier.rank === 'Elite' && <span className="text-xs text-green-500 ml-1">(MAX)</span>}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Transparency Note */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-8 md:p-10 relative">
                <div className="flex items-start gap-5">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-4">Transparency Note</Badge>
                    <h3 className="font-display text-2xl font-bold mb-5">Future Subscriptions</h3>
                    <p className="text-muted-foreground mb-6">
                      We believe in total transparency with our partners.
                    </p>
                    <div className="space-y-5">
                      <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <strong className="text-foreground">Current Phase (Launch):</strong>
                          <span className="text-muted-foreground ml-1">One-Time Payments secure your Rank and Bonus for life.</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <strong className="text-foreground">Future Phase (Growth):</strong>
                          <span className="text-muted-foreground ml-1">Monthly Studio Subscription (~$15/mo) for platform access.</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                          <Crown className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <strong className="text-foreground">The Founder Advantage:</strong>
                          <span className="text-muted-foreground ml-1">You retain your Lifetime Profit Boost (+5%/+10%) forever.</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 p-4 bg-foreground/5 rounded-xl border border-foreground/10">
                      <p className="font-semibold text-foreground text-center">
                        🎯 Buying F1/F2 now is buying a <span className="text-primary">permanent advantage</span> in the marketplace.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 md:py-28 bg-secondary/20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 px-4 py-1.5">Questions?</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Frequently Asked Questions
            </AnimatedHeading>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {PRICING_FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <AccordionItem value={`faq-${i}`} className="bg-background rounded-xl border px-6 shadow-sm hover:shadow-md transition-shadow">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 bg-foreground text-background overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)',
            backgroundSize: '200% 200%',
          }}
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <AnimatedHeading as="h2" className="font-display text-3xl md:text-5xl font-bold mb-5 tracking-tight">
              Start Earning More Today
            </AnimatedHeading>
            <p className="text-background/60 text-lg max-w-xl mx-auto mb-10">
              Join the early designers securing their lifetime advantage in the Adorzia ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-base group shadow-lg">
                  Join for Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="h-14 px-10 text-base group border-background/30 text-background hover:bg-background/10">
                  Become a Pioneer
                  <Crown className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile Sticky Bottom Bar */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 md:hidden bg-background/95 backdrop-blur-xl border-t shadow-2xl p-4 z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-3">
          <Link to="/auth" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-base">
              Join Free
            </Button>
          </Link>
          <Link to="/auth" className="flex-1">
            <Button className="w-full h-12 text-base bg-foreground text-background hover:bg-foreground/90 shadow-lg">
              <span className="truncate">F2 — {f2Remaining} Left</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-24 md:hidden" />
    </PublicLayout>
  );
}
