import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
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

export default function Pricing() {
  const { data: slotData, isLoading } = useFounderSlots();

  const f1Remaining = slotData?.f1Remaining ?? 847;
  const f2Remaining = slotData?.f2Remaining ?? 412;

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <motion.div 
          className="absolute top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Membership & Founder Access
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Don't Just Join the Platform.
              <br />
              <span className="text-primary">Own Your Legacy.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Secure your Lifetime Founder Rank today. Pay once, earn higher royalties forever.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-4">Why "Founder" Ranks?</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              The Philosophy
            </AnimatedHeading>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-secondary/30 border-none">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">We're in Our Launch Phase</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Adorzia is currently in its Launch Phase. We are building the future of fashion manufacturing, 
                      and we want to reward the visionaries who support us early.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Crown className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Limited-Edition Lifetime Licenses</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Instead of a standard subscription, we are offering limited-edition Lifetime Licenses. 
                      By purchasing a Founder Rank today, you secure a <strong>permanent Profit Share Bonus</strong> that 
                      future users will never be able to buy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Choose Your Path</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Select Your Membership
            </AnimatedHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Standard Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <TiltCard tiltAmount={5} glareEnabled={false}>
                <Card className="h-full">
                  <CardHeader className="text-center pb-4">
                    <motion.div 
                      className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Star className="h-7 w-7" />
                    </motion.div>
                    <div className="text-sm text-muted-foreground mb-1">For: {FOUNDER_TIERS.standard.targetAudience}</div>
                    <h3 className="font-display text-2xl font-bold">{FOUNDER_TIERS.standard.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{FOUNDER_TIERS.standard.priceFormatted}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Base Profit Share: Starts at {FOUNDER_TIERS.standard.startingShare}%
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4 text-muted-foreground" />
                        <span>Scales up to 40% with XP</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Publishing: {FOUNDER_TIERS.standard.publishingPriority}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <span>StyleBox: {FOUNDER_TIERS.standard.styleboxAccess}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Manufacturing: {FOUNDER_TIERS.standard.manufacturingAccess}</span>
                      </div>
                    </div>
                    <Link to="/auth">
                      <Button className="w-full group" variant="outline">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <TiltCard tiltAmount={6} glareEnabled={false}>
                <Card className="h-full border-primary/30">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {f1Remaining.toLocaleString()} of 1,000 Slots Left
                      </Badge>
                    </div>
                    <motion.div 
                      className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Zap className="h-7 w-7 text-primary" />
                    </motion.div>
                    <div className="text-sm text-muted-foreground mb-1">For: {FOUNDER_TIERS.f1.targetAudience}</div>
                    <h3 className="font-display text-2xl font-bold">{FOUNDER_TIERS.f1.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{FOUNDER_TIERS.f1.priceFormatted}</span>
                      <div className="text-sm text-muted-foreground mt-1">One-Time Payment</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-primary/5 rounded-lg p-3 mb-4 text-center">
                      <span className="font-semibold text-primary">+{FOUNDER_TIERS.f1.lifetimeBonus}% Lifetime Bonus</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Starting Share: {FOUNDER_TIERS.f1.startingShare}% (Instant boost over free)
                      </p>
                    </div>
                    <div className="space-y-3 mb-6">
                      {FOUNDER_TIERS.f1.features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/auth">
                      <Button className="w-full group">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <TiltCard tiltAmount={8} glareEnabled={true}>
                <Card className="h-full relative border-foreground shadow-xl">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-foreground text-background px-4">
                      <Star className="h-3 w-3 mr-1" />
                      {FOUNDER_TIERS.f2.highlightLabel}
                    </Badge>
                  </div>
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="flex justify-center gap-2 mb-3">
                      <Badge variant="destructive" className="text-xs animate-pulse">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Only {f2Remaining} of 500 Slots Left!
                      </Badge>
                    </div>
                    <motion.div 
                      className="h-14 w-14 rounded-xl bg-foreground flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Crown className="h-7 w-7 text-background" />
                    </motion.div>
                    <div className="text-sm text-muted-foreground mb-1">For: {FOUNDER_TIERS.f2.targetAudience}</div>
                    <h3 className="font-display text-2xl font-bold">{FOUNDER_TIERS.f2.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{FOUNDER_TIERS.f2.priceFormatted}</span>
                      <div className="text-sm text-muted-foreground mt-1">One-Time Payment</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-foreground/10 rounded-lg p-3 mb-4 text-center">
                      <span className="font-semibold">+{FOUNDER_TIERS.f2.lifetimeBonus}% Lifetime Bonus</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Starting Share: {FOUNDER_TIERS.f2.startingShare}% • Can reach 50% (Platform Max)
                      </p>
                    </div>
                    <div className="space-y-3 mb-6">
                      {FOUNDER_TIERS.f2.features.slice(0, 5).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <Check className="h-4 w-4 text-foreground" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/auth">
                      <Button className="w-full group bg-foreground text-background hover:bg-foreground/90">
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
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <TrendingUp className="h-3.5 w-3.5 mr-2" />
              The "Game of Ranks"
            </Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              How You Earn
            </AnimatedHeading>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              At Adorzia, your income is a combination of your <strong>Skill</strong> (Rank) and your <strong>Status</strong> (Founder License).
            </p>
          </div>

          {/* Formula Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Card className="bg-foreground text-background p-6 md:p-8 text-center">
              <p className="text-sm text-background/60 mb-2">The Formula</p>
              <p className="text-xl md:text-2xl font-display font-bold">
                Total Earnings = <span className="text-primary">(Your Skill Rank %)</span> + <span className="text-yellow-400">(Your Founder Bonus)</span>
              </p>
            </Card>
          </motion.div>

          {/* Earning Ladder Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-semibold">Skill Rank (Earned by XP)</th>
                        <th className="text-center p-4 font-semibold">Base Share (Free)</th>
                        <th className="text-center p-4 font-semibold bg-primary/5">With F1 (+5%)</th>
                        <th className="text-center p-4 font-semibold bg-foreground/5">With F2 (+10%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EARNING_LADDER.map((tier, i) => (
                        <motion.tr 
                          key={tier.rank}
                          className={`${i < EARNING_LADDER.length - 1 ? 'border-b' : ''} hover:bg-muted/50 transition-colors`}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <td className="p-4 font-medium">
                            {tier.rank}
                            {tier.rank === 'Elite' && <Badge className="ml-2 text-xs">Max Skill</Badge>}
                          </td>
                          <td className="p-4 text-center text-muted-foreground">{tier.baseShare}%</td>
                          <td className="p-4 text-center bg-primary/5 font-medium">{tier.f1Share}%</td>
                          <td className="p-4 text-center bg-foreground/5 font-bold">
                            {tier.f2Share}%
                            {tier.rank === 'Elite' && <span className="text-xs text-muted-foreground ml-1">(Max)</span>}
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
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-3">Transparency Note</Badge>
                    <h3 className="font-display text-xl font-bold mb-4">Future Subscriptions</h3>
                    <p className="text-muted-foreground mb-4">
                      We believe in total transparency with our partners.
                    </p>
                    <div className="space-y-4 text-sm">
                      <div className="flex gap-3">
                        <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        </div>
                        <div>
                          <strong>Current Phase (Launch):</strong> The F1 and F2 costs above are One-Time Payments. 
                          This secures your Rank and your Bonus Percentage for life.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Clock className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <div>
                          <strong>Future Phase (Growth):</strong> As we add advanced 3D tools, global logistics, and AI features, 
                          Adorzia will introduce a standard Monthly Studio Subscription (estimated ~$15/mo) for platform access.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Crown className="h-3.5 w-3.5 text-yellow-600" />
                        </div>
                        <div>
                          <strong>The Founder Advantage:</strong> When subscriptions launch, F1 and F2 members will still need to 
                          subscribe to access the tools, BUT you retain your Lifetime Profit Boost (+5% / +10%). 
                          Future users will pay the subscription without getting the bonus profit margins.
                        </div>
                      </div>
                    </div>
                    <p className="mt-6 font-semibold text-foreground">
                      Buying F1/F2 now is buying a permanent advantage in the marketplace.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Questions?</Badge>
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
                <AccordionItem value={`faq-${i}`} className="bg-background rounded-lg border px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 bg-foreground text-background overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        />
        
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <AnimatedHeading as="h2" className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Start Earning More Today
          </AnimatedHeading>
          <p className="text-background/60 max-w-xl mx-auto mb-8">
            Join the early designers who are securing their lifetime advantage in the Adorzia ecosystem.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="h-12 px-8 group">
                Join for Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="h-12 px-8 group border-background/30 text-background hover:bg-background/10">
                Become a Pioneer
                <Crown className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background/95 backdrop-blur-lg border-t p-4 z-50">
        <div className="flex items-center gap-3">
          <Link to="/auth" className="flex-1">
            <Button variant="outline" className="w-full h-11">
              Join Free
            </Button>
          </Link>
          <Link to="/auth" className="flex-1">
            <Button className="w-full h-11 bg-foreground text-background hover:bg-foreground/90">
              <span className="truncate">F2 Pioneer — {f2Remaining} Left</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-20 md:hidden" />
    </PublicLayout>
  );
}
