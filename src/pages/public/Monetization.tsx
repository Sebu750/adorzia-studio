import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  DollarSign,
  TrendingUp,
  Factory,
  Truck,
  PieChart,
  CheckCircle2,
  Crown
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import ParallaxSection from "@/components/public/ParallaxSection";
import SEOHead from "@/components/public/SEOHead";
import { monetizationImages, backgroundImages } from "@/lib/images";

const publishingSteps = [
  { step: 1, title: "Create", description: "Complete StyleBox challenges and build portfolio" },
  { step: 2, title: "Submit", description: "Request publication through Studio" },
  { step: 3, title: "Review", description: "Our team evaluates for marketplace fit" },
  { step: 4, title: "Refine", description: "Production team creates tech packs" },
  { step: 5, title: "Produce", description: "Manufacturing begins locally" },
  { step: 6, title: "List", description: "Product goes live on marketplace" },
  { step: 7, title: "Sell", description: "Customers purchase your designs" },
  { step: 8, title: "Earn", description: "Receive revenue share monthly" },
];

const revenueShare = [
  { rank: "Novice", share: "10%", description: "Starting designers" },
  { rank: "Apprentice", share: "15%", description: "Building skills" },
  { rank: "Designer", share: "20%", description: "Consistent quality" },
  { rank: "Senior", share: "28%", description: "Proven track record" },
  { rank: "Lead", share: "34%", description: "Industry expert" },
  { rank: "Elite", share: "40%", description: "Top performer" },
];

const manufacturingBenefits = [
  "Local production in Pakistan",
  "Quality control at every step",
  "Ethical manufacturing practices",
  "Sustainable material sourcing",
  "Direct factory relationships",
  "Fast turnaround times"
];

const earningsDashboard = [
  { metric: "Total Sales", value: "PKR 145,000" },
  { metric: "This Month", value: "PKR 32,500" },
  { metric: "Products Live", value: "8" },
  { metric: "Avg. Order Value", value: "PKR 4,200" },
];

export default function Monetization() {
  return (
    <PublicLayout>
      <SEOHead 
        title="Sell Fashion Designs Online Pakistan | Made-to-Order Marketplace"
        description="How to start a fashion brand with zero inventory in Pakistan. Sell your jewelry designs on a made-to-order marketplace. Peer-to-peer fashion design networking. Up to 40% revenue share."
        url="https://www.adorzia.com/monetization"
        keywords="Sell fashion designs Pakistan, Made-to-order marketplace, Fashion brand zero inventory, Freelance Fashion Design Pakistan, Fashion monetization, Designer earnings Pakistan"
      />
      {/* Hero with animated gradient */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <motion.div 
          className="absolute top-10 right-10 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-6">Earn From Your Designs</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Turn Creativity
              <br />
              <span className="text-muted-foreground">Into Income</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              From design to doorstep—we handle production, fulfillment, and sales. 
              You keep up to 40% of every product sold.
            </p>
            <Link to="/auth">
              <Button size="lg" className="group">
                Start Earning
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How Publishing Works with animated steps */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Publication Pipeline</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              How Publishing Works
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Submit your StyleBox output. Adorzia handles refinement, tech packs, and production.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {publishingSteps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <TiltCard tiltAmount={8}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <motion.div 
                        className="text-3xl font-display font-bold text-primary/20 mb-2"
                        whileHover={{ scale: 1.2, color: 'var(--primary)' }}
                      >
                        {String(item.step).padStart(2, '0')}
                      </motion.div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Share with parallax */}
      <ParallaxSection
        backgroundImage={backgroundImages.fashion}
        className="py-20 md:py-28"
        speed={0.3}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Transparent Earnings
            </Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Revenue Share by Rank
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Creators keep the majority. Higher ranks earn more per sale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {revenueShare.map((tier, i) => (
              <motion.div
                key={tier.rank}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <TiltCard tiltAmount={12} glareEnabled={tier.rank === 'Elite'}>
                  <Card className={`backdrop-blur-sm bg-background/90 ${
                    tier.rank === 'Elite' ? 'ring-2 ring-primary/50' : ''
                  }`}>
                    <CardContent className="p-6 text-center">
                      {tier.rank === 'Elite' && (
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Crown className="h-5 w-5 mx-auto mb-2 text-warning" />
                        </motion.div>
                      )}
                      <h3 className="font-display font-semibold mb-1">{tier.rank}</h3>
                      <p className="text-3xl font-bold mb-2">{tier.share}</p>
                      <p className="text-xs text-muted-foreground">{tier.description}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground text-sm backdrop-blur-sm bg-background/80 inline-block px-4 py-2 rounded-lg">
              Early F1/F2 founders receive +5% to +10% bonus on top of their rank share.
            </p>
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Manufacturing & Fulfillment with images */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">End-to-End Production</Badge>
              <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Manufacturing & Fulfillment
              </AnimatedHeading>
              <p className="text-muted-foreground mb-6">
                Local production strength connected directly to designers. We handle everything 
                from sourcing to shipping—you focus on design.
              </p>
              <ul className="space-y-3">
                {manufacturingBenefits.map((benefit, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Factory, title: "Local Production", desc: "Made in Pakistan" },
                { icon: Truck, title: "Fast Shipping", desc: "Nationwide delivery" },
                { icon: PieChart, title: "Transparent Pricing", desc: "Know your margins" },
                { icon: TrendingUp, title: "Scale Ready", desc: "Grow with demand" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <TiltCard tiltAmount={15}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 text-center">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          className="inline-block"
                        >
                          <item.icon className="h-10 w-10 mx-auto mb-4 text-primary" />
                        </motion.div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Dashboard Preview with animations */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Real-Time Tracking</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Earnings Dashboard
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Track sales, royalties, and performance in real-time.
            </p>
          </div>

          <TiltCard tiltAmount={5} className="max-w-3xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {earningsDashboard.map((item, i) => (
                    <motion.div 
                      key={item.metric} 
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <p className="text-sm text-muted-foreground mb-1">{item.metric}</p>
                      <p className="text-2xl font-bold">{item.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Monthly Goal Progress</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    >
                      <Progress value={65} className="h-2" />
                    </motion.div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Next Payout</span>
                    <motion.span 
                      className="font-medium flex items-center gap-2"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Dec 1, 2024
                    </motion.span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TiltCard>
        </div>
      </section>

    </PublicLayout>
  );
}
