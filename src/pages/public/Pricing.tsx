import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Check,
  X,
  Crown,
  Zap,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";

const plans = [
  {
    name: "Basic",
    price: "PKR 1,500",
    period: "/month",
    description: "Learning access with limited boxes",
    popular: false,
    features: [
      { text: "5 Free StyleBoxes", included: true },
      { text: "Basic Studio Tools", included: true },
      { text: "Community Access", included: true },
      { text: "Portfolio (3 items)", included: true },
      { text: "Unlimited StyleBoxes", included: false },
      { text: "Publishing Rights", included: false },
      { text: "Styleathon Entry", included: false },
      { text: "Revenue Dashboard", included: false },
      { text: "Priority Support", included: false },
      { text: "Mentorship Calls", included: false },
    ]
  },
  {
    name: "Pro",
    price: "PKR 3,900",
    period: "/month",
    description: "Full access plus publishing rights",
    popular: true,
    features: [
      { text: "Unlimited StyleBoxes", included: true },
      { text: "Full Studio Workspace", included: true },
      { text: "Community Access", included: true },
      { text: "Unlimited Portfolio", included: true },
      { text: "Publishing Rights", included: true },
      { text: "Styleathon Entry", included: true },
      { text: "Revenue Dashboard", included: true },
      { text: "Priority Review Queue", included: false },
      { text: "Priority Support", included: false },
      { text: "Mentorship Calls", included: false },
    ]
  },
  {
    name: "Elite",
    price: "PKR 9,900",
    period: "/month",
    description: "Priority manufacturing and advanced tools",
    popular: false,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Priority Manufacturing", included: true },
      { text: "Advanced Creator Tools", included: true },
      { text: "Priority Review Queue", included: true },
      { text: "Higher Revenue Share Tier", included: true },
      { text: "Early Access Features", included: true },
      { text: "1-on-1 Mentorship Calls", included: true },
      { text: "Dedicated Support", included: true },
      { text: "Beta Feature Access", included: true },
      { text: "VIP Event Invites", included: true },
    ]
  },
];

const comparisonFeatures = [
  { feature: "StyleBoxes", basic: "5 Free", pro: "Unlimited", elite: "Unlimited + Priority" },
  { feature: "Studio Tools", basic: "Basic", pro: "Full Suite", elite: "Advanced" },
  { feature: "Portfolio Items", basic: "3", pro: "Unlimited", elite: "Unlimited" },
  { feature: "Publishing", basic: "—", pro: "✓", elite: "Priority" },
  { feature: "Styleathon", basic: "—", pro: "✓", elite: "✓" },
  { feature: "Revenue Share Tier", basic: "—", pro: "Standard", elite: "Enhanced" },
  { feature: "Review Queue", basic: "Standard", pro: "Standard", elite: "Priority" },
  { feature: "Support", basic: "Community", pro: "Email", elite: "Dedicated" },
  { feature: "Mentorship", basic: "—", pro: "—", elite: "Monthly Calls" },
];

const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, JazzCash, Easypaisa, and bank transfers for Pakistani customers."
  },
  {
    q: "Is there a free trial?",
    a: "Yes! All plans include a 7-day free trial. Start creating immediately and decide if Adorzia is right for you."
  },
  {
    q: "What happens to my designs if I cancel?",
    a: "Your portfolio and published designs remain active. You'll keep earning revenue share on existing products."
  },
];

export default function Pricing() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-6">Pricing Plans</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Choose Your Path
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade as you grow. Every plan includes access to our 
              creative community and learning resources.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`h-full relative ${
                  plan.popular ? 'border-foreground shadow-lg' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-foreground text-background">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                      {plan.name === 'Elite' ? (
                        <Crown className="h-6 w-6" />
                      ) : plan.name === 'Pro' ? (
                        <Zap className="h-6 w-6" />
                      ) : (
                        <Star className="h-6 w-6" />
                      )}
                    </div>
                    <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-foreground" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/50" />
                          )}
                          <span className={feature.included ? '' : 'text-muted-foreground/50'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/auth">
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Feature Comparison</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Compare Plans
            </h2>
          </div>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">Basic</th>
                    <th className="text-center p-4 font-semibold bg-secondary/50">Pro</th>
                    <th className="text-center p-4 font-semibold">Elite</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, i) => (
                    <tr key={row.feature} className={i < comparisonFeatures.length - 1 ? 'border-b' : ''}>
                      <td className="p-4 text-sm">{row.feature}</td>
                      <td className="p-4 text-center text-sm text-muted-foreground">{row.basic}</td>
                      <td className="p-4 text-center text-sm bg-secondary/50">{row.pro}</td>
                      <td className="p-4 text-center text-sm">{row.elite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Questions?</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Ready to Start?
          </h2>
          <p className="text-background/60 max-w-xl mx-auto mb-8">
            Choose your plan and start building your fashion brand today.
          </p>
          
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="h-12 px-8">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
