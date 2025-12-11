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
  { rank: "Novice", share: "20%", description: "Starting designers" },
  { rank: "Apprentice", share: "25%", description: "Building skills" },
  { rank: "Designer", share: "30%", description: "Consistent quality" },
  { rank: "Senior", share: "35%", description: "Proven track record" },
  { rank: "Lead", share: "40%", description: "Industry expert" },
  { rank: "Elite", share: "50%", description: "Top performer" },
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
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
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
              You keep up to 50% of every product sold.
            </p>
            <Link to="/auth">
              <Button size="lg">
                Start Earning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How Publishing Works */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Publication Pipeline</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              How Publishing Works
            </h2>
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
                <Card className="h-full">
                  <CardContent className="p-4">
                    <div className="text-3xl font-display font-bold text-muted-foreground/20 mb-2">
                      {String(item.step).padStart(2, '0')}
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Share */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 border-background/20 text-background">
              Transparent Earnings
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Revenue Share by Rank
            </h2>
            <p className="text-background/60">
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
                <Card className={`bg-background/5 border-background/10 ${
                  tier.rank === 'Elite' ? 'ring-2 ring-background/30' : ''
                }`}>
                  <CardContent className="p-6 text-center">
                    {tier.rank === 'Elite' && (
                      <Crown className="h-5 w-5 mx-auto mb-2" />
                    )}
                    <h3 className="font-display font-semibold mb-1">{tier.rank}</h3>
                    <p className="text-3xl font-bold mb-2">{tier.share}</p>
                    <p className="text-xs text-background/60">{tier.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-background/60 text-sm">
              Early F1/F2 founders receive 45-50% lifetime revenue share regardless of rank.
            </p>
          </div>
        </div>
      </section>

      {/* Manufacturing & Fulfillment */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">End-to-End Production</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Manufacturing & Fulfillment
              </h2>
              <p className="text-muted-foreground mb-6">
                Local production strength connected directly to designers. We handle everything 
                from sourcing to shipping—you focus on design.
              </p>
              <ul className="space-y-3">
                {manufacturingBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Factory className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold">Local Production</h3>
                  <p className="text-sm text-muted-foreground">Made in Pakistan</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Truck className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold">Fast Shipping</h3>
                  <p className="text-sm text-muted-foreground">Nationwide delivery</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <PieChart className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold">Transparent Pricing</h3>
                  <p className="text-sm text-muted-foreground">Know your margins</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold">Scale Ready</h3>
                  <p className="text-sm text-muted-foreground">Grow with demand</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Dashboard Preview */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Real-Time Tracking</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Earnings Dashboard
            </h2>
            <p className="text-muted-foreground">
              Track sales, royalties, and performance in real-time.
            </p>
          </div>

          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {earningsDashboard.map((item, i) => (
                  <div key={item.metric} className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">{item.metric}</p>
                    <p className="text-2xl font-bold">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Monthly Goal Progress</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Next Payout</span>
                    <span className="font-medium">Dec 1, 2024</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <DollarSign className="h-12 w-12 mx-auto mb-6 text-muted-foreground" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Start Monetizing Your Designs
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of designers already earning from their creativity.
          </p>
          
          <Link to="/auth">
            <Button size="lg" className="h-12 px-8">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
