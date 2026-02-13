import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Building2, 
  Users, 
  Factory, 
  Trophy,
  Sparkles,
  Target,
  Handshake,
  CheckCircle2,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import ParallaxSection from "@/components/public/ParallaxSection";
import StatsSection from "@/components/public/StatsSection";
import SEOHead from "@/components/public/SEOHead";
import { brandPartnershipImages, backgroundImages } from "@/lib/images";

const offerings = [
  { 
    icon: Trophy, 
    title: "Host Challenges", 
    desc: "Engage designers through StyleBoxes and Styleathon events tailored to your brand.",
    features: ["Custom brief creation", "Branded challenges", "Winner showcases"]
  },
  { 
    icon: Users, 
    title: "Collaborations", 
    desc: "Co-create collections with emerging talent and fresh perspectives.",
    features: ["Designer matching", "Creative direction", "Exclusive drops"]
  },
  { 
    icon: Factory, 
    title: "White-Label Production", 
    desc: "Scalable, quality manufacturing handled end-to-end.",
    features: ["Local production", "Quality control", "Fast turnaround"]
  },
];

const stats = [
  { value: "500+", label: "Active Designers" },
  { value: "50+", label: "Brand Partners" },
  { value: "10K+", label: "Products Created" },
  { value: "95%", label: "Partner Satisfaction" },
];

const processSteps = [
  { step: 1, title: "Discovery Call", desc: "We learn about your brand goals and target audience." },
  { step: 2, title: "Custom Proposal", desc: "Tailored partnership plan with clear deliverables." },
  { step: 3, title: "Designer Matching", desc: "Connect with designers that fit your aesthetic." },
  { step: 4, title: "Execution", desc: "Seamless collaboration from concept to delivery." },
];

const testimonials = [
  {
    quote: "Adorzia connected us with incredible emerging talent. The collaboration exceeded our expectations.",
    author: "Sarah Ahmed",
    role: "Brand Director",
    company: "Lahore Fashion House"
  },
  {
    quote: "The StyleBox challenges brought fresh perspectives we never would have found otherwise.",
    author: "Kamran Ali",
    role: "Creative Lead",
    company: "Urban Threads Co."
  },
];

export default function ForBrands() {
  return (
    <PublicLayout>
      <SEOHead 
        title="Brand Partnerships | Adorzia"
        description="Partner with Adorzia to access Pakistan's top emerging design talent and manufacturing infrastructure. Host challenges, collaborate, and scale production."
        url="https://studio.adorzia.com/brands"
        keywords="brand partnerships, fashion collaboration, white label production, design challenges, pakistan manufacturing"
      />
      {/* Hero with parallax background */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${brandPartnershipImages.collaboration})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        <motion.div 
          className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-6">Brand Partnerships</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Partner With Adorzia
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Access Pakistan's top emerging design talent and manufacturing infrastructure. 
              From custom challenges to full production—we're your creative partner.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="group">
                Contact Sales 
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                View Case Studies
              </Button>
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
                <motion.p 
                  className="text-4xl md:text-5xl font-bold font-display mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings with images */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Partnership Options</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              How We Partner
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Flexible engagement models tailored to your brand's needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {offerings.map((item, i) => (
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
                        className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <item.icon className="h-7 w-7 text-primary" />
                      </motion.div>
                      <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground mb-6">{item.desc}</p>
                      <ul className="space-y-2">
                        {item.features.map((feature, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
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

      {/* Process with parallax */}
      <ParallaxSection
        backgroundImage={backgroundImages.studio}
        className="py-20 md:py-28"
        speed={0.3}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Our Process</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Simple Partnership Journey
            </AnimatedHeading>
            <p className="text-muted-foreground">
              From first call to final delivery—a streamlined experience.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
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
                      className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg"
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

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Partner Stories</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              What Brands Say
            </AnimatedHeading>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard tiltAmount={5}>
                  <Card className="h-full">
                    <CardContent className="p-8">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                        ))}
                      </div>
                      <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
