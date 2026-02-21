import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Rocket, 
  Users, 
  Factory, 
  Handshake,
  CheckCircle2,
  TrendingUp,
  Package,
  Zap,
  Target,
  Lightbulb,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import ParallaxSection from "@/components/public/ParallaxSection";
import SEOHead from "@/components/public/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PAGE_SEO } from "@/lib/seo-constants";
import { backgroundImages } from "@/lib/images";

const benefits = [
  { 
    icon: Package, 
    title: "Zero Inventory Model", 
    desc: "Launch your fashion brand without holding any stock. Made-to-order production eliminates inventory risk.",
    features: ["No upfront inventory costs", "Zero warehousing fees", "Scale on demand"]
  },
  { 
    icon: Factory, 
    title: "Production Infrastructure", 
    desc: "Access local manufacturing without the headache of factory relationships and minimum orders.",
    features: ["Vetted local factories", "Quality control included", "No minimum orders"]
  },
  { 
    icon: Handshake, 
    title: "Designer Collaboration", 
    desc: "Find co-founders, partners, or freelance designers for your capsule collections.",
    features: ["Designer matching", "Revenue sharing models", "Creative partnerships"]
  },
];

const startupSteps = [
  { step: 1, title: "Create Your Brand", desc: "Set up your brand profile and define your aesthetic." },
  { step: 2, title: "Design or Collaborate", desc: "Create designs yourself or partner with designers." },
  { step: 3, title: "List Products", desc: "Add products to marketplace with zero inventory required." },
  { step: 4, title: "Receive Orders", desc: "Customers order, we handle production and shipping." },
  { step: 5, title: "Earn Revenue", desc: "Get paid monthly with transparent revenue sharing." },
];

const useCases = [
  {
    title: "Fashion Entrepreneur",
    desc: "Start your own fashion brand with zero inventory and full creative control.",
    icon: Rocket,
    ideal: "Ideal for: First-time founders, side hustlers"
  },
  {
    title: "Designer-Led Brand",
    desc: "Turn your designs into a business without handling operations.",
    icon: Lightbulb,
    ideal: "Ideal for: Designers wanting to monetize"
  },
  {
    title: "Capsule Collection",
    desc: "Launch limited-edition collections with designer collaborations.",
    icon: Target,
    ideal: "Ideal for: Collaborative projects, seasonal drops"
  },
];

const stats = [
  { value: "50+", label: "Active Startups" },
  { value: "PKR 5M+", label: "Revenue Generated" },
  { value: "0", label: "Inventory Required" },
  { value: "40%", label: "Max Revenue Share" },
];

const faqs = [
  {
    question: "How to start a fashion brand with zero inventory in Pakistan?",
    answer: "Adorzia's made-to-order model lets you launch a fashion brand without holding any inventory. You design or curate products, list them on the marketplace, and we handle production only when orders come in. This eliminates upfront costs and inventory risk."
  },
  {
    question: "How to find a co-founder for a fashion startup in Pakistan?",
    answer: "Use Adorzia's designer network to find potential co-founders. Browse designer profiles, review portfolios, and reach out for collaboration. Many successful fashion startups on our platform started as designer-entrepreneur partnerships."
  },
  {
    question: "What is the revenue share for fashion startups?",
    answer: "Startups earn up to 40% revenue share depending on their rank and founder status. Early founders (F1/F2) receive permanent bonus percentages. Production costs, shipping, and platform fees are deducted from the remaining share."
  },
];

export default function ForStartups() {
  const seo = PAGE_SEO.forStartups;
  
  return (
    <PublicLayout>
      <SEOHead 
        title={seo.title}
        description={seo.description}
        url={seo.url}
        keywords={seo.keywords}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.adorzia.com" },
        { name: "For Startups", url: "https://www.adorzia.com/startups" }
      ]} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-background to-primary/10" />
        <motion.div 
          className="absolute top-20 right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-6">For Fashion Startups</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Launch Your Fashion Brand
              <br />
              <span className="text-muted-foreground">With Zero Inventory</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Start a fashion brand in Pakistan without inventory risk. Made-to-order production, 
              designer collaborations, and end-to-end infrastructure—all in one platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/auth">
                <Button size="lg" className="group">
                  Start Your Brand
                  <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/monetization">
                <Button size="lg" variant="outline">
                  See Revenue Model
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-b bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold font-display mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Why Adorzia</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Everything You Need to Launch
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Infrastructure, production, and partnerships—built for fashion startups.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard tiltAmount={8} glareEnabled>
                  <Card className="h-full hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8">
                      <motion.div 
                        className="h-14 w-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-6"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <item.icon className="h-7 w-7 text-green-600" />
                      </motion.div>
                      <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground mb-6">{item.desc}</p>
                      <ul className="space-y-2">
                        {item.features.map((feature, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <ParallaxSection
        backgroundImage={backgroundImages.studio}
        className="py-20 md:py-28"
        speed={0.3}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Launch in 5 Simple Steps
            </AnimatedHeading>
            <p className="text-muted-foreground">
              From idea to revenue in weeks, not months.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {startupSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full backdrop-blur-sm bg-background/90">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className="h-12 w-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg"
                      whileHover={{ scale: 1.2 }}
                    >
                      {step.step}
                    </motion.div>
                    <h3 className="font-display font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Use Cases */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who It's For</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Perfect For Every Type of Founder
            </AnimatedHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, i) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard tiltAmount={5}>
                  <Card className="h-full">
                    <CardContent className="p-8">
                      <useCase.icon className="h-10 w-10 text-green-500 mb-4" />
                      <h3 className="font-display text-xl font-semibold mb-3">{useCase.title}</h3>
                      <p className="text-muted-foreground mb-4">{useCase.desc}</p>
                      <p className="text-sm text-primary font-medium">{useCase.ideal}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Common Questions
            </AnimatedHeading>
          </div>

          <div className="space-y-6">
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
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Rocket className="h-16 w-16 mx-auto mb-6" />
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Ready to Launch Your Fashion Startup?
            </AnimatedHeading>
            <p className="text-lg text-background/70 mb-8">
              Join 50+ fashion startups already building on Adorzia. Zero inventory, 
              full creative control, and up to 40% revenue share.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
