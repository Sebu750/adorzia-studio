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
  Target,
  Mail,
  HelpCircle,
  Box,
  Wallet
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import SEOHead from "@/components/public/SEOHead";
import { FOUNDER_TIERS, EARNING_LADDER, DESIGNER_FAQS, FAQ_CATEGORIES, FAQCategory } from "@/lib/founder-tiers";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/lib/subscription";
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

  // F1 = 50 slots, F2 = 100 slots
  const f1Remaining = slotData?.f1Remaining ?? 47;
  const f2Remaining = slotData?.f2Remaining ?? 89;
  const f1Total = slotData?.f1Total ?? 50;
  const f2Total = slotData?.f2Total ?? 100;
  const f1Percentage = ((f1Total - f1Remaining) / f1Total) * 100;
  const f2Percentage = ((f2Total - f2Remaining) / f2Total) * 100;

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
      <SEOHead 
        title="Pricing & Founder Access | Adorzia Studio"
        description="Access professional design tools with monthly subscriptions. Secure lifetime profit boosts with limited Founder Titles. Up to 50% revenue share."
        url="https://studio.adorzia.com/pricing"
        keywords="adorzia pricing, fashion design subscription, founder access, revenue share, designer earnings"
      />
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
                Subscriptions & Founder Access
              </Badge>
            </motion.div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.05] mb-8 tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Access Tools. Earn More.
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
              <strong className="text-foreground">Subscriptions</strong> give you access. <strong className="text-foreground">Founder Titles</strong> give you profit.
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

      {/* SECTION 1: Monthly Subscriptions */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 mr-2" />
              Monthly Subscriptions
            </Badge>
            <AnimatedHeading className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Access the Studio
            </AnimatedHeading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Subscribe to access StyleBox challenges, portfolio tools, and production requests.
              <span className="block mt-2 text-primary font-medium">Coming Soon — Prebook available for Founders</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {(Object.keys(SUBSCRIPTION_TIERS) as SubscriptionTier[]).map((tierKey, index) => {
              const tier = SUBSCRIPTION_TIERS[tierKey];
              const isPopular = tierKey === 'pro';
              const isFree = tierKey === 'cadet';

              return (
                <motion.div
                  key={tierKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={isPopular ? '' : 'lg:pt-4'}
                >
                  <Card className={`h-full relative ${isPopular ? 'border-primary shadow-xl' : 'hover:shadow-lg'} transition-all duration-300`}>
                    {isPopular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                        Most Popular
                      </Badge>
                    )}
                    {!isFree && (
                      <Badge variant="secondary" className="absolute -top-3 right-4">
                        Coming Soon
                      </Badge>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        tierKey === 'cadet' ? 'bg-secondary' : 
                        tierKey === 'pro' ? 'bg-primary/10' : 
                        'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        {tierKey === 'cadet' && <Star className="h-7 w-7" />}
                        {tierKey === 'pro' && <Sparkles className="h-7 w-7 text-primary" />}
                        {tierKey === 'elite' && <Crown className="h-7 w-7 text-amber-600" />}
                      </div>
                      <h3 className="font-display text-2xl font-bold">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground">{tier.subtitle}</p>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{tier.priceFormatted.replace('/mo', '')}</span>
                        {!isFree && <span className="text-muted-foreground">/month</span>}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        {tier.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className="w-full" 
                        variant={isPopular ? 'default' : 'outline'}
                        disabled={!isFree}
                      >
                        {isFree ? 'Free Access' : 'Coming Soon'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider with explanation */}
      <section className="py-12 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-4 bg-background border rounded-full px-8 py-4 shadow-lg">
              <div className="text-left">
                <p className="font-semibold text-foreground">Subscription = Access</p>
                <p className="text-sm text-muted-foreground">Tools & Challenges</p>
              </div>
              <div className="text-3xl">+</div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Founder Title = Profit</p>
                <p className="text-sm text-muted-foreground">Lifetime Bonus</p>
              </div>
              <div className="text-3xl">=</div>
              <div className="text-left">
                <p className="font-bold text-primary text-lg">Maximum Earnings</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Lifetime Founder Titles */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 border-amber-500/50 text-amber-600">
              <Crown className="h-3.5 w-3.5 mr-2" />
              Lifetime Founder Titles
            </Badge>
            <AnimatedHeading className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Secure Your Legacy
            </AnimatedHeading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One-time payment. Permanent profit boost. Limited slots.
            </p>
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
                      Base Profit Share: <span className="font-semibold text-foreground">{FOUNDER_TIERS.standard.startingShare}%</span>
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4 mb-8">
                      {FOUNDER_TIERS.standard.perks.map((perk, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <span>{perk}</span>
                        </div>
                      ))}
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

            {/* F2 Card (The Pioneer) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="lg:pt-4"
            >
              <TiltCard tiltAmount={5} glareEnabled={false}>
                <Card className="h-full relative overflow-hidden border-slate-400/40 bg-gradient-to-b from-slate-100/10 to-background hover:shadow-xl hover:border-slate-400/60 transition-all duration-500 dark:border-slate-500/40">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-400/10 via-transparent to-transparent opacity-50" />
                  
                  <CardHeader className="text-center pb-4 relative">
                    <div className="flex justify-center mb-4">
                      <Badge variant="secondary" className="text-xs px-3 py-1 bg-slate-200/50 dark:bg-slate-700/50">
                        <Users className="h-3 w-3 mr-1.5" />
                        {f2Remaining} of {f2Total} Slots Left
                      </Badge>
                    </div>
                    
                    {/* Slots progress bar */}
                    <div className="mb-5">
                      <Progress value={f2Percentage} className="h-2 bg-slate-200/50 dark:bg-slate-700/50" />
                      <p className="text-xs text-muted-foreground mt-2">{Math.round(f2Percentage)}% claimed</p>
                    </div>
                    
                    <motion.div 
                      className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center mx-auto mb-5 shadow-lg"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Shield className="h-8 w-8 text-white" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground mb-2">For: {FOUNDER_TIERS.f2.targetAudience}</p>
                    <h3 className="font-display text-2xl font-bold">{FOUNDER_TIERS.f2.name}</h3>
                    <div className="mt-5">
                      <span className="text-5xl font-bold">{FOUNDER_TIERS.f2.priceFormatted}</span>
                      <div className="text-sm text-muted-foreground mt-2">One-Time Payment</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 relative">
                    <div className="bg-gradient-to-r from-slate-200/50 to-slate-100/30 dark:from-slate-700/50 dark:to-slate-800/30 rounded-xl p-4 mb-6 text-center border border-slate-300/30 dark:border-slate-600/30">
                      <span className="font-bold text-lg">+{FOUNDER_TIERS.f2.lifetimeBonus}% Lifetime Bonus</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Starting Share: <span className="font-semibold text-foreground">{FOUNDER_TIERS.f2.startingShare}%</span>
                      </p>
                    </div>
                    <div className="space-y-4 mb-8">
                      {FOUNDER_TIERS.f2.features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className="h-6 w-6 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/auth">
                      <Button className="w-full h-12 group text-base bg-slate-600 hover:bg-slate-700 text-white">
                        {FOUNDER_TIERS.f2.ctaText}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>

            {/* F1 Card (Founding Legacy - Highlighted) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <TiltCard tiltAmount={6} glareEnabled={true}>
                <Card className="h-full relative overflow-hidden border-2 border-amber-500 shadow-2xl bg-gradient-to-b from-amber-50/50 to-background dark:from-amber-900/20">
                  {/* Premium glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-primary/5" />
                  <motion.div 
                    className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-amber-500 text-white px-5 py-1.5 text-sm shadow-lg">
                      <Award className="h-3.5 w-3.5 mr-1.5" />
                      {FOUNDER_TIERS.f1.highlightLabel}
                    </Badge>
                  </div>
                  
                  <CardHeader className="text-center pb-4 pt-10 relative">
                    <div className="flex justify-center mb-4">
                      <Badge variant="destructive" className="text-xs px-3 py-1 animate-pulse">
                        <AlertCircle className="h-3 w-3 mr-1.5" />
                        Only {f1Remaining} of {f1Total} Slots Left!
                      </Badge>
                    </div>
                    
                    {/* Slots progress bar */}
                    <div className="mb-5">
                      <Progress value={f1Percentage} className="h-2 bg-amber-200/50 dark:bg-amber-900/30" />
                      <p className="text-xs text-muted-foreground mt-2">{Math.round(f1Percentage)}% claimed • Going fast!</p>
                    </div>
                    
                    <motion.div 
                      className="h-18 w-18 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-5 shadow-xl"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      style={{ width: 72, height: 72 }}
                    >
                      <Crown className="h-9 w-9 text-white" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground mb-2">For: {FOUNDER_TIERS.f1.targetAudience}</p>
                    <h3 className="font-display text-2xl font-bold">{FOUNDER_TIERS.f1.name}</h3>
                    <div className="mt-5">
                      <span className="text-5xl font-bold">{FOUNDER_TIERS.f1.priceFormatted}</span>
                      <div className="text-sm text-muted-foreground mt-2">One-Time Payment</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 relative">
                    <div className="bg-gradient-to-r from-amber-500/20 to-amber-400/10 rounded-xl p-4 mb-6 text-center border border-amber-500/30">
                      <span className="font-bold text-xl text-amber-600 dark:text-amber-400">+{FOUNDER_TIERS.f1.lifetimeBonus}% Lifetime Bonus</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Starting Share: <span className="font-semibold text-foreground">{FOUNDER_TIERS.f1.startingShare}%</span> • Max <span className="font-bold text-green-500">50%</span>
                      </p>
                    </div>
                    <div className="space-y-4 mb-8">
                      {FOUNDER_TIERS.f1.features.slice(0, 5).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/auth">
                      <Button className="w-full h-12 group text-base bg-amber-500 hover:bg-amber-600 text-white shadow-lg">
                        {FOUNDER_TIERS.f1.ctaText}
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
              Your income is a combination of your <strong className="text-foreground">Skill Rank</strong> + <strong className="text-foreground">Founder Title</strong>
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
                Total Earnings = <span className="text-primary">(Skill Rank %)</span> + <span className="text-amber-400">(Founder Bonus)</span>
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
                        <th className="text-center p-5 font-semibold text-muted-foreground">SC Range</th>
                        <th className="text-center p-5 font-semibold">Free</th>
                        <th className="text-center p-5 font-semibold bg-slate-100/50 dark:bg-slate-800/50">+F2 (+5%)</th>
                        <th className="text-center p-5 font-semibold bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">+F1 (+10%)</th>
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
                              {tier.rank === 'Creative Director' && (
                                <Badge variant="secondary" className="text-xs">Max Skill</Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-5 text-center text-muted-foreground text-sm">{tier.scRange}</td>
                          <td className="p-5 text-center text-muted-foreground">{tier.baseShare}%</td>
                          <td className="p-5 text-center bg-slate-50/50 dark:bg-slate-800/30 font-medium">{tier.f2Share}%</td>
                          <td className="p-5 text-center bg-amber-50/50 dark:bg-amber-900/20 font-bold text-lg text-amber-700 dark:text-amber-400">
                            {tier.f1Share}%
                            {tier.rank === 'Creative Director' && <span className="text-xs text-green-500 ml-1">(MAX)</span>}
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
                    <h3 className="font-display text-2xl font-bold mb-5">Why Buy Both?</h3>
                    <p className="text-muted-foreground mb-6">
                      Subscription gives you <strong className="text-foreground">access to tools</strong>. Founder title gives you <strong className="text-foreground">permanent earnings boost</strong>.
                    </p>
                    <div className="space-y-5">
                      <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <Zap className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <strong className="text-foreground">Subscription (Monthly):</strong>
                          <span className="text-muted-foreground ml-1">Access to StyleBoxes, portfolio, production requests.</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <Crown className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <strong className="text-foreground">Founder Title (One-Time):</strong>
                          <span className="text-muted-foreground ml-1">Permanent +5% or +10% on every sale, forever.</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <strong className="text-foreground">The ROI:</strong>
                          <span className="text-muted-foreground ml-1">Sell 5-10 items and the founder fee pays for itself. Everything after is pure extra profit.</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 p-4 bg-foreground/5 rounded-xl border border-foreground/10">
                      <p className="font-semibold text-foreground text-center">
                        🎯 Buying F1/F2 now is buying a <span className="text-primary">permanent advantage</span> before subscriptions launch.
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
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 px-4 py-1.5">Designer's FAQ</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Frequently Asked Questions
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Everything about IP, profit sharing, and the Adorzia model.
            </p>
          </div>

          {/* Category Icons Map */}
          {(() => {
            const categoryIcons: Record<FAQCategory, React.ComponentType<{ className?: string }>> = {
              general: HelpCircle,
              styleboxes: Box,
              'ip-ranks': Crown,
              teaming: Users,
              financials: Wallet,
              founders: Award,
            };

            // Group FAQs by category
            const groupedFaqs = DESIGNER_FAQS.reduce((acc, faq) => {
              if (!acc[faq.category]) acc[faq.category] = [];
              acc[faq.category].push(faq);
              return acc;
            }, {} as Record<FAQCategory, typeof DESIGNER_FAQS>);

            return (
              <div className="space-y-10">
                {(Object.keys(groupedFaqs) as FAQCategory[]).map((category, categoryIndex) => {
                  const CategoryIcon = categoryIcons[category];
                  const categoryInfo = FAQ_CATEGORIES[category];
                  
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: categoryIndex * 0.05 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CategoryIcon className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">{categoryInfo.label}</h3>
                      </div>

                      <Accordion type="single" collapsible className="space-y-3">
                        {groupedFaqs[category].map((faq, i) => (
                          <AccordionItem 
                            key={i} 
                            value={`${category}-${i}`} 
                            className="bg-background rounded-xl border px-6 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pb-5 whitespace-pre-line">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}

          {/* Contact CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground mb-4">
              Have more questions? Contact us at{' '}
              <a href="mailto:hello@adorzia.com" className="text-primary hover:underline font-medium">
                hello@adorzia.com
              </a>
            </p>
            <Link to="/support">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Go to Support Center
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t p-4 flex gap-3 lg:hidden z-50">
        <Link to="/auth" className="flex-1">
          <Button variant="outline" className="w-full">Join Free</Button>
        </Link>
        <Link to="/auth" className="flex-1">
          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
            <Crown className="h-4 w-4 mr-2" />
            F1 — {f1Remaining} left
          </Button>
        </Link>
      </div>
      
      {/* Spacer for mobile sticky bar */}
      <div className="h-20 lg:hidden" />
    </PublicLayout>
  );
}
