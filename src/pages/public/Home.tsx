import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Star,
  Box,
  GraduationCap,
  Store,
  Crown,
  Play,
  Zap,
  Target,
  TrendingUp,
  Globe,
  Users,
  Factory,
  Smartphone
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import heroImage from "@/assets/hero-workspace.jpg";

const stats = [
  { value: "2,500+", label: "Designers" },
  { value: "15,000+", label: "Projects" },
  { value: "500+", label: "Products Live" },
  { value: "50%", label: "Max Revenue" },
];

const howItWorks = [
  { 
    icon: GraduationCap, 
    title: "Learn", 
    description: "Master industry skills through gamified StyleBoxes" 
  },
  { 
    icon: Box, 
    title: "Create", 
    description: "Build production-ready assets and portfolio pieces" 
  },
  { 
    icon: Store, 
    title: "Publish", 
    description: "Submit designs seamlessly to the marketplace" 
  },
  { 
    icon: Crown, 
    title: "Earn", 
    description: "Generate revenue from real product sales" 
  },
];

const styleboxCategories = [
  { name: "Streetwear", count: 24 },
  { name: "Couture", count: 18 },
  { name: "Essentials", count: 32 },
  { name: "Formal", count: 16 },
  { name: "Avant-Garde", count: 12 },
  { name: "Sustainable", count: 20 },
];

const successPath = [
  { level: "Beginner", title: "Foundation", desc: "Learn basics through guided challenges" },
  { level: "Intermediate", title: "Portfolio Builder", desc: "Create production-ready work" },
  { level: "Advanced", title: "Market Ready", desc: "Publish designs to marketplace" },
  { level: "Expert", title: "Fashionpreneur", desc: "Build your own fashion brand" },
];

const whyPakistan = [
  { icon: Users, title: "Creative Youth", desc: "70% of population under 35 with untapped creative talent" },
  { icon: Factory, title: "Manufacturing Hub", desc: "5th largest textile exporter with established infrastructure" },
  { icon: Smartphone, title: "Digital Ready", desc: "100M+ smartphone users driving digital transformation" },
  { icon: Globe, title: "Global Reach", desc: "Strategic location connecting East and West markets" },
];

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Fashion Designer",
    quote: "Adorzia transformed my freelance career. The StyleBox challenges pushed my creativity while the marketplace gave me a platform to sell globally.",
    avatar: "SA",
    rank: "Elite Designer"
  },
  {
    name: "Kamran Malik",
    role: "Textile Artist",
    quote: "From novice to Lead Designer in 8 months. The ranking system keeps me motivated and the revenue share is unmatched.",
    avatar: "KM",
    rank: "Lead Designer"
  },
  {
    name: "Zara Hussain",
    role: "Jewelry Designer",
    quote: "Finally a platform that understands Pakistani designers. The Academy modules are practical and the community is supportive.",
    avatar: "ZH",
    rank: "Senior Designer"
  },
];

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-6">
                The World's First Fashion Creation Ecosystem
              </Badge>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
                Learn. Create.
                <br />
                <span className="text-muted-foreground">Publish. Earn.</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Adorzia is the integrated pipeline where designers learn through gamified StyleBoxes, 
                create production-ready assets, publish to the marketplace, and earn from real sales. 
                Built in Pakistan. Engineered for global scale.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/auth">
                  <Button size="lg" className="h-12 px-8">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="h-12 px-8 gap-2">
                    <Play className="h-4 w-4" />
                    Watch Story
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="Fashion design workspace" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-background border rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <Crown className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Elite Designer</p>
                    <p className="text-xs text-muted-foreground">50% Revenue Share</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How Adorzia Works */}
      <section className="py-20 md:py-28 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">The Unified Journey</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              How Adorzia Works
            </h2>
            <p className="text-muted-foreground">
              A seamless pipeline from learning to earning—no gatekeeping, no barriers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border hover:shadow-md hover:border-foreground/20 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl font-display font-bold text-muted-foreground/10">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <CardContent className="p-6 relative">
                    <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* StyleBoxes Overview */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Gamified Learning</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                StyleBoxes Overview
              </h2>
              <p className="text-muted-foreground mb-6">
                Hands-on challenges that build true industry skills. Every completed box 
                becomes a portfolio asset and a potential product on the marketplace.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                {styleboxCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <span className="font-medium text-sm">{cat.name}</span>
                    <Badge variant="secondary" className="text-xs">{cat.count}</Badge>
                  </div>
                ))}
              </div>

              <Link to="/styleboxes-info">
                <Button>
                  Explore StyleBoxes
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['Pattern Design', 'Moodboard Creation', 'Tech Pack', 'Collection Dev'].map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="aspect-square bg-background border rounded-xl p-6 flex flex-col justify-between"
                >
                  <Zap className="h-8 w-8 text-muted-foreground" />
                  <p className="font-medium text-sm">{skill}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Designer Success Path */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Progression System</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Designer Success Path
            </h2>
            <p className="text-muted-foreground">
              From beginner to fashionpreneur: level-based progression with practical tasks and real-world output.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {successPath.map((stage, i) => (
              <motion.div
                key={stage.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="h-full p-6 border rounded-xl bg-background">
                  <Badge variant="secondary" className="mb-4">{stage.level}</Badge>
                  <h3 className="font-display text-lg font-semibold mb-2">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground">{stage.desc}</p>
                </div>
                {i < successPath.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 border-background/20 text-background">
              Designer Marketplace
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Marketplace Preview
            </h2>
            <p className="text-background/60">
              Showcase of designer-made collections, limited drops, and next-gen fashion talent.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-background/5 border-background/10 overflow-hidden">
                <div className="aspect-[3/4] bg-background/10" />
                <CardContent className="p-4">
                  <p className="font-medium text-background">Designer Collection #{i}</p>
                  <p className="text-sm text-background/60">Starting at PKR 2,500</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/marketplace-preview">
              <Button variant="secondary" size="lg">
                Browse Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Pakistan / Why Now */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Strategic Advantage</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Why Pakistan. Why Now.
            </h2>
            <p className="text-muted-foreground">
              A powerful combination of creative youth, manufacturing strength, and digital transformation 
              makes Pakistan the ideal launchpad for global fashion innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyPakistan.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Success Stories</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Designer Testimonials
            </h2>
            <p className="text-muted-foreground">
              Early creators proving Adorzia's model through real products and global-ready portfolios.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-foreground text-foreground" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-medium">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="mt-4 text-xs">{testimonial.rank}</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Join the Next Era of Fashion Creation
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Be part of the ecosystem that's redefining how designers learn, create, and earn.
          </p>
          
          <Link to="/auth">
            <Button size="lg" className="h-12 px-8">
              Start Free Today
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Free to start
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              No credit card
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
