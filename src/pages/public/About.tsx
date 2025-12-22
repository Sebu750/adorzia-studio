import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Target, 
  Eye, 
  Sparkles, 
  Users, 
  Newspaper,
  Linkedin,
  Twitter,
  Globe,
  Trophy,
  TrendingUp,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import TiltCard from "@/components/public/TiltCard";
import StatsSection from "@/components/public/StatsSection";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import ParallaxSection from "@/components/public/ParallaxSection";
import { SOCIAL_LINKS } from "@/lib/social-links";

const uniquePoints = [
  {
    title: "End-to-End Integration",
    description: "No other platform combines education, studio tools, manufacturing automation, and monetization in one ecosystem."
  },
  {
    title: "Merit-Based Progression",
    description: "Your talent and output determine your success—not connections or traditional gatekeeping."
  },
  {
    title: "Production-Ready Output",
    description: "Every StyleBox produces actual market-ready designs, not just practice work."
  },
  {
    title: "Transparent Revenue Share",
    description: "Clear, rank-based revenue sharing up to 50%—you always know what you'll earn."
  }
];

const leadership = [
  {
    name: "Haseeb Malik",
    role: "Founder & CEO",
    bio: "A contrarian at heart, Haseeb built Adorzia with a single mission: to prove that designers don't need to starve to succeed. With a background in fashion-tech and entrepreneurship, he realized the fashion industry was broken—prioritizing platforms over people. Adorzia is his answer to the 'Exposure Economy.'",
    avatar: "HM",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
  },
  {
    name: "Ahmed Raza",
    role: "Co-Founder & CTO",
    bio: "The architect of the 'Adorzia Cloud.' Ahmed bridges the gap between complex logistics and seamless user experience. Passionate about using technology to remove friction, he ensures that while designers focus on art, the code handles the business.",
    avatar: "AR",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
  }
];

const featuredArticles = [
  {
    outlet: "FashionTech Daily",
    title: "Meet Haseeb Malik: The Contrarian Betting on the 'Artist,' Not the Algorithm",
    excerpt: "In a world obsessed with fast fashion and faster algorithms, Haseeb Malik is hitting the brakes. As the founder of Adorzia, Malik isn't just building another marketplace; he is engineering a rescue mission for the independent designer.",
    content: `The fashion industry has long operated on a brutal, unspoken rule: designers are disposable. Platforms demand high fees, retailers demand 60% margins, and everyone pays the creator in "exposure."

Haseeb Malik decided that math didn't work.

"I looked at the industry and saw brilliant people quitting not because they lacked talent, but because they were drowning in logistics," Malik says. "We built Adorzia to prove that you can treat designers like partners, not inventory, and still build a massive business."

Malik's background gave him a unique vantage point—seeing the gap between creative genius and operational reality. Adorzia was born from his refusal to accept the status quo. His vision was to create a "Cloud" for fashion—an infrastructure that handles the boring, difficult parts of business (shipping, tech, payments) so the designer can simply create.

Under Malik's leadership, Adorzia has adopted a "Contrarian" approach. While competitors squeeze margins, Adorzia offers revenue splits up to 50%. While others automate support, Adorzia offers partnership.

"We aren't looking for the ones who want to make a quick buck," Malik notes. "We are looking for the designers who want to build a legacy. Adorzia is just the foundation they stand on."`,
    category: "Founder Profile"
  },
  {
    outlet: "The Startup Insider",
    title: "Why 90% of Fashion Startups Fail (And How Adorzia is Fixing the Odds)",
    excerpt: "The statistics are grim. Nine out of ten independent fashion brands will close their doors within the first three years. The reason is rarely 'bad design.' The killer is almost always 'bad operations.'",
    content: `For a young designer, launching a brand involves a paralyzing checklist: sourcing fabric, managing inventory, building a website, fighting algorithms for traffic, and handling returns. It is a CEO's job forced onto an Artist's shoulders.

Adorzia creates a new category in the market: The Fashion Accelerator Platform.

"We analyzed why startups fail," says the Adorzia team. "They fail because they spend 80% of their time packing boxes and fixing website bugs, and only 20% designing. We flipped that ratio."

Adorzia operates as an operational backbone for these startups. By joining the platform, designers essentially outsource their headaches.

• The Tech is handled: No more broken websites or invisible text.
• The Logistics are streamlined: No more manual shipping nightmares.
• The Money is fair: A transparent revenue model that actually leaves room for profit.

For a new generation of fashion startups, Adorzia isn't just a shop window; it is a survival kit. By removing the friction of "running a business," Adorzia allows startups to do the one thing that actually scales: making great products.`,
    category: "Industry Analysis"
  },
  {
    outlet: "Future Trends Weekly",
    title: "The 'Cloud Dancer' Era: How Adorzia is Defining the Look of 2026 Retail",
    excerpt: "Pantone recently announced 'Cloud Dancer' as the Color of the Year for 2026—a symbol of clarity, balance, and a fresh start. But for one company, this isn't just a color trend; it is a business model.",
    content: `Adorzia is positioning itself as the "Cloud" behind the fashion industry's new wave.

The platform's branding and philosophy align perfectly with this shift toward serenity and minimalism. In an e-commerce landscape that feels cluttered, noisy, and aggressive, Adorzia offers a "clean canvas."

"We believe technology should be invisible," the company states. "Like a cloud, it should be everywhere, supporting everything, but you shouldn't have to think about it."

This philosophy extends to their promotional strategy for designers. Adorzia promotes a "Quality over Quantity" approach. Instead of flooding users with cheap items, the platform curates a selection of designers who care about craft.

For shoppers, it offers a premium, calm experience. For designers, it offers the freedom to "dance"—to move fluidly without being weighed down by the heavy machinery of business.

As we move toward 2026, Adorzia is betting that the future belongs to those who can cut through the noise. With their advanced platform and "founder-friendly" ethos, they are poised to become the standard-bearer for the new digital fashion economy.`,
    category: "Trend Piece"
  }
];

const pressHighlights = [
  { outlet: "Dawn", title: "Pakistani startup revolutionizes fashion design education" },
  { outlet: "Express Tribune", title: "Adorzia raises seed funding to scale designer marketplace" },
  { outlet: "TechCrunch", title: "How Pakistan is becoming a fashion-tech hub" },
];

const companyStats = [
  { value: 2500, suffix: '+', label: 'Designers Onboarded', icon: <Users className="h-6 w-6 text-muted-foreground" /> },
  { value: 150, suffix: '+', label: 'StyleBoxes Created', icon: <Briefcase className="h-6 w-6 text-muted-foreground" /> },
  { value: 50, prefix: '$', suffix: 'K+', label: 'Paid to Creators', icon: <TrendingUp className="h-6 w-6 text-muted-foreground" /> },
  { value: 3, label: 'Countries Reached', icon: <Globe className="h-6 w-6 text-muted-foreground" /> },
];

export default function About() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-6">About Adorzia</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Reinventing Fashion
              <br />
              <span className="text-muted-foreground">From Pakistan</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're building the world's first end-to-end fashion creation operating system—
              where talent, output, and merit define opportunity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-t border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <StatsSection stats={companyStats} variant="default" />
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <TiltCard tiltAmount={6}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <motion.div 
                      className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Eye className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h2 className="font-display text-2xl font-bold mb-4">Vision</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      To build a world where every designer can create, launch, and scale their own 
                      fashion brand without barriers. A future where geographic location, social 
                      connections, and capital are no longer prerequisites for success in fashion.
                    </p>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <TiltCard tiltAmount={6}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <motion.div 
                      className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                    >
                      <Target className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h2 className="font-display text-2xl font-bold mb-4">Mission</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      To empower designers to become independent fashionpreneurs through a seamless 
                      model that merges learning, creation, production, and commerce. We provide 
                      the tools, infrastructure, and marketplace—designers provide the creativity.
                    </p>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <ParallaxSection
        backgroundImage="https://images.unsplash.com/photo-1558171813-01ed3d751c2c?w=1920&q=80"
        className="py-20 md:py-28"
        speed={0.3}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-6">Our Story</Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-8 tracking-tight">
              Replacing Gatekeeping with Merit
            </AnimatedHeading>
            <motion.div 
              className="text-left space-y-6 text-muted-foreground leading-relaxed bg-background/80 backdrop-blur-sm rounded-2xl p-8 border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p>
                Adorzia was born from a simple observation: the fashion industry is filled with 
                talented designers who never get a chance. Traditional paths require expensive 
                education, industry connections, or startup capital that most creative people 
                simply don't have.
              </p>
              <p>
                We asked: what if there was a system where your output was your credential? 
                Where completing a design challenge could lead directly to a product on shelves? 
                Where revenue share was transparent and fair?
              </p>
              <p>
                That question became Adorzia—the world's first fashion creation operating system. 
                Built in Pakistan, leveraging the country's manufacturing strength and creative youth, 
                and engineered for global scale.
              </p>
            </motion.div>
          </div>
        </div>
      </ParallaxSection>

      {/* What Makes Adorzia Unique */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">Differentiation</Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              What Makes Adorzia Unique
            </AnimatedHeading>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              No other platform unifies the entire fashion lifecycle in one ecosystem.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {uniquePoints.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard tiltAmount={5}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center shrink-0"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Sparkles className="h-5 w-5 text-primary" />
                        </motion.div>
                        <div>
                          <h3 className="font-display text-lg font-semibold mb-2">{point.title}</h3>
                          <p className="text-muted-foreground text-sm">{point.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership - The Visionaries */}
      <section className="py-20 md:py-28 bg-foreground text-background relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 border-background/20 text-background">The Team</Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight text-background">
              The Visionaries Behind the Shift
            </AnimatedHeading>
            <motion.p 
              className="text-background/60"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              A founding team committed to reinventing the global fashion pipeline from Pakistan outward.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leadership.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="bg-background/5 border-background/10 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0">
                    {/* Photo - desaturated for premium aesthetic */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display text-xl font-bold text-background">{member.name}</h3>
                        <p className="text-sm text-background/80">{member.role}</p>
                      </div>
                    </div>
                    {/* Bio */}
                    <div className="p-6">
                      <p className="text-sm text-background/70 leading-relaxed">{member.bio}</p>
                      <div className="flex gap-2 mt-4">
                        <motion.a 
                          href={SOCIAL_LINKS.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Linkedin className="h-4 w-4" />
                        </motion.a>
                        <motion.a 
                          href={SOCIAL_LINKS.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Twitter className="h-4 w-4" />
                        </motion.a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">Featured Stories</Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              The Adorzia Story
            </AnimatedHeading>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Deep dives into our mission, vision, and the future we're building.
            </motion.p>
          </div>

          <div className="space-y-8">
            {featuredArticles.map((article, i) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-3 gap-0">
                      {/* Article Header */}
                      <div className="p-8 bg-gradient-to-br from-primary/5 to-secondary/10 flex flex-col justify-center">
                        <Badge variant="secondary" className="w-fit mb-4">{article.category}</Badge>
                        <p className="text-sm text-muted-foreground mb-2">{article.outlet}</p>
                        <h3 className="font-display text-xl font-bold leading-tight">{article.title}</h3>
                      </div>
                      {/* Article Content */}
                      <div className="md:col-span-2 p-8">
                        <p className="text-muted-foreground font-medium mb-4 text-lg">{article.excerpt}</p>
                        <div className="text-sm text-muted-foreground/80 leading-relaxed whitespace-pre-line line-clamp-6">
                          {article.content}
                        </div>
                        <Button variant="link" className="mt-4 p-0 h-auto text-primary">
                          Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section id="press" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">In The News</Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Press Coverage
            </AnimatedHeading>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Positioning Adorzia as Pakistan's flagship fashion-tech innovator.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pressHighlights.map((press, i) => (
              <motion.div
                key={press.outlet}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard tiltAmount={5}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Newspaper className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">{press.outlet}</span>
                      </div>
                      <h3 className="font-display font-semibold">{press.title}</h3>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <motion.div 
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Join the Movement
          </AnimatedHeading>
          <motion.p 
            className="text-muted-foreground max-w-xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Be part of the ecosystem that's redefining fashion creation.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/auth">
              <Button size="lg" className="h-12 px-8 group">
                Start Creating
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/brands">
              <Button size="lg" variant="outline" className="h-12 px-8">
                Partner With Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
