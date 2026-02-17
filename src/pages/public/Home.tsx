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
  Zap,
  Users,
  Factory,
  Smartphone,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import HeroSection from "@/components/public/HeroSection";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import AnimatedCounter from "@/components/public/AnimatedCounter";
import ParallaxSection from "@/components/public/ParallaxSection";
import TestimonialCarousel from "@/components/public/TestimonialCarousel";
import WaveDivider from "@/components/public/WaveDivider";
import MarqueeText from "@/components/public/MarqueeText";
import ScrollReveal from "@/components/public/ScrollReveal";
import SEOHead from "@/components/public/SEOHead";
import { designerImages, productImages } from "@/lib/images";
import hero1 from "@/assets/hero1.png";
import hero2 from "@/assets/hero2.png";
import hero3 from "@/assets/hero3.png";
import yusra1 from "@/assets/Yusra_1.jpeg";
import yusra2 from "@/assets/Yusra_2.jpeg";
import yusra3 from "@/assets/Yusra_3.jpeg";

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

const marketplaceProducts = [
  { id: 1, title: "Karachi Street Hoodie", price: "PKR 4,500", image: yusra1 },
  { id: 2, title: "Heritage Kurta Set", price: "PKR 8,900", image: yusra2 },
  { id: 3, title: "Urban Joggers", price: "PKR 3,200", image: yusra3 },
];

const testimonials = [
  {
    quote: "Adorzia transformed my freelance career. The StyleBox challenges pushed my creativity while the marketplace gave me a platform to sell globally.",
    author: "Sarah Ahmed",
    role: "Fashion Designer • Elite Designer",
    avatar: designerImages.sarahAhmed,
  },
  {
    quote: "From novice to Lead Designer in 8 months. The ranking system keeps me motivated and the revenue share is unmatched.",
    author: "Kamran Malik",
    role: "Textile Artist • Lead Designer",
    avatar: designerImages.kamranMalik,
  },
  {
    quote: "Finally a platform that understands Pakistani designers. The Academy modules are practical and the community is supportive.",
    author: "Zara Hussain",
    role: "Jewelry Designer • Senior Designer",
    avatar: designerImages.zaraHussain,
  },
];

export default function Home() {
  return (
    <PublicLayout showPreloader={false}>
      <SEOHead 
        title="Adorzia Studio - Design, Create, Collaborate"
        description="The central platform for fashion, textile, and jewelry designers. Create with Styleboxes, build your portfolio, collaborate with teams, and publish to the marketplace."
        url="https://studio.adorzia.com"
      />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Brand Marquee */}
      <div className="py-6 border-y bg-muted/30 overflow-hidden">
        <MarqueeText speed={25} className="text-muted-foreground/60 font-medium text-sm uppercase tracking-widest">
          <span className="mx-8">Fashion Design</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Textile Innovation</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Jewelry Creation</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Portfolio Building</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Marketplace Publishing</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Revenue Sharing</span>
          <span className="mx-8">•</span>
        </MarqueeText>
      </div>

      {/* How Adorzia Works */}
      <section className="py-20 md:py-28 border-t relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 dot-pattern opacity-30" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">The Unified Journey</Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              How Adorzia Works
            </AnimatedHeading>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              A seamless pipeline from learning to earning—no gatekeeping, no barriers.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border hover:shadow-lg hover:border-primary/20 transition-all duration-500 relative overflow-hidden group">
                  <div className="absolute top-4 right-4 text-6xl font-display font-bold text-muted-foreground/10 group-hover:text-primary/10 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <CardContent className="p-6 relative">
                    <motion.div 
                      className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <step.icon className="h-6 w-6" />
                    </motion.div>
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
      <section className="py-20 md:py-28 bg-secondary/50 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/20" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="mb-4">Gamified Learning</Badge>
              </motion.div>
              <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                StyleBoxes Overview
              </AnimatedHeading>
              <motion.p 
                className="text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Hands-on challenges that build true industry skills. Every completed box 
                becomes a portfolio asset and a potential product on the marketplace.
              </motion.p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                {styleboxCategories.map((cat, i) => (
                  <motion.div 
                    key={cat.name} 
                    className="flex items-center justify-between p-3 bg-background rounded-lg border hover:border-primary/30 transition-colors cursor-pointer group"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">{cat.name}</span>
                    <Badge variant="secondary" className="text-xs">{cat.count}</Badge>
                  </motion.div>
                ))}
              </div>

              <Link to="/styleboxes-info">
                <Button className="group">
                  Explore StyleBoxes
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="aspect-square bg-background border rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <Zap className="h-8 w-8 text-muted-foreground" />
                  </motion.div>
                  <p className="font-medium text-sm">{skill}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Designer Success Path */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">Progression System</Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Designer Success Path
            </AnimatedHeading>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              From beginner to fashionpreneur: level-based progression with practical tasks and real-world output.
            </motion.p>
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
                <motion.div 
                  className="h-full p-6 border rounded-xl bg-background hover:bg-secondary/30 transition-colors"
                  whileHover={{ y: -4 }}
                >
                  <Badge variant="secondary" className="mb-4">{stage.level}</Badge>
                  <h3 className="font-display text-lg font-semibold mb-2">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground">{stage.desc}</p>
                </motion.div>
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
      <section className="py-20 md:py-28 bg-foreground text-background relative overflow-hidden">
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 border-background/20 text-background">
                Designer Marketplace
              </Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight text-background">
              Marketplace Preview
            </AnimatedHeading>
            <motion.p 
              className="text-background/60"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Showcase of designer-made collections, limited drops, and next-gen fashion talent.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {marketplaceProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="bg-background/5 border-background/10 overflow-hidden group cursor-pointer">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <motion.img 
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <motion.div 
                      className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Button variant="secondary" size="sm" className="w-full">
                        Quick View
                      </Button>
                    </motion.div>
                  </div>
                  <CardContent className="p-4">
                    <p className="font-medium text-background">{product.title}</p>
                    <p className="text-sm text-background/60">{product.price}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/marketplace-preview">
              <Button variant="secondary" size="lg" className="group">
                Browse Marketplace
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Pakistan / Why Now */}
      <ParallaxSection 
        backgroundImage="https://images.unsplash.com/photo-1558171813-01ed3d751c2c?w=1920&q=80"
        className="py-20 md:py-28"
        speed={0.3}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">Strategic Advantage</Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Why Pakistan. Why Now.
            </AnimatedHeading>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              A powerful combination of creative youth, manufacturing strength, and digital transformation 
              makes Pakistan the ideal launchpad for global fashion innovation.
            </motion.p>
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
                <motion.div whileHover={{ y: -4 }}>
                  <Card className="h-full bg-background/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <motion.div 
                        className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-4"
                        whileHover={{ scale: 1.1 }}
                      >
                        <item.icon className="h-6 w-6" />
                      </motion.div>
                      <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">Success Stories</Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Designer Testimonials
            </AnimatedHeading>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Early creators proving Adorzia's model through real products and global-ready portfolios.
            </motion.p>
          </div>

          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

    </PublicLayout>
  );
}
