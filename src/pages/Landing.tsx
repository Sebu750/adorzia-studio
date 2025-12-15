import { useState, useEffect } from "react";
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
  Play
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-workspace.jpg";

const features = [
  {
    icon: Box,
    title: "Studio",
    description: "Build your creative portfolio with guided StyleBox challenges",
  },
  {
    icon: GraduationCap,
    title: "Academy",
    description: "Learn practical skills through curated industry modules",
  },
  {
    icon: Store,
    title: "Marketplace",
    description: "Publish and monetize your designs with global reach",
  },
  {
    icon: Crown,
    title: "Rank & Rewards",
    description: "Earn XP, level up, and maximize your revenue share",
  },
];

const steps = [
  { number: "01", title: "Sign Up", description: "Create your designer profile" },
  { number: "02", title: "Create", description: "Complete StyleBox challenges" },
  { number: "03", title: "Submit", description: "Get professional feedback" },
  { number: "04", title: "Earn", description: "Publish and grow revenue" },
];

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Fashion Designer",
    quote: "Adorzia transformed my freelance career. The StyleBox challenges pushed my creativity while the marketplace gave me a platform to sell globally.",
    avatar: "SA",
  },
  {
    name: "Kamran Malik",
    role: "Textile Artist",
    quote: "From novice to Lead Designer in 8 months. The ranking system keeps me motivated and the revenue share is unmatched.",
    avatar: "KM",
  },
  {
    name: "Zara Hussain",
    role: "Jewelry Designer",
    quote: "Finally a platform that understands Pakistani designers. The Academy modules are practical and the community is supportive.",
    avatar: "ZH",
  },
];

const stats = [
  { value: "2,500+", label: "Designers" },
  { value: "15,000+", label: "Projects" },
  { value: "500+", label: "Products" },
  { value: "50%", label: "Max Revenue" },
];

export default function Landing() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-sm border-b" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight">Adorzia</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Process</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stories</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button>
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-6">
                Fashion • Textile • Jewelry
              </Badge>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
                Where Designers
                <br />
                <span className="text-muted-foreground">Build Careers</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Create, learn, and monetize your designs. Join thousands of designers building independent creative careers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/auth">
                  <Button size="lg" className="h-12 px-8">
                    Start Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-8 gap-2">
                  <Play className="h-4 w-4" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Image */}
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
              {/* Floating Badge */}
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

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-muted-foreground">
              From skill development to marketplace monetization—the complete ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border hover:shadow-md hover:border-foreground/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Your Path to Success
            </h2>
            <p className="text-muted-foreground">
              A clear journey from creative passion to professional success.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="text-6xl font-display font-bold text-muted-foreground/20 mb-4">
                  {step.number}
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-28 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Designer Stories
            </h2>
            <p className="text-background/60">
              Hear from creators who've transformed their careers.
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
                <Card className="h-full bg-background/5 border-background/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-background text-background" />
                      ))}
                    </div>
                    <p className="text-background/80 mb-6 text-sm leading-relaxed">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-background">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-background text-sm">{testimonial.name}</p>
                        <p className="text-xs text-background/50">{testimonial.role}</p>
                      </div>
                    </div>
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
            Ready to Start?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of designers building their creative careers.
          </p>
          
          <Link to="/auth">
            <Button size="lg" className="h-12 px-8">
              Create Free Account
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

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-display text-xl font-bold">Adorzia</span>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/support#policies" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/support#policies" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/support#contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2024 Adorzia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
