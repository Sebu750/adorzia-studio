import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  GraduationCap, 
  Trophy, 
  Briefcase, 
  Users,
  Star,
  CheckCircle2,
  Target,
  Rocket,
  BookOpen,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import ParallaxSection from "@/components/public/ParallaxSection";
import SEOHead from "@/components/public/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FAQSchema, COMMON_FAQS } from "@/components/seo/FAQSchema";
import { PAGE_SEO } from "@/lib/seo-constants";
import { backgroundImages, competitionImages } from "@/lib/images";

const pathways = [
  { 
    icon: BookOpen, 
    title: "Build Your Portfolio", 
    desc: "Complete StyleBox challenges to create production-ready designs for your portfolio.",
    features: ["Industry-standard tech packs", "Real design briefs", "Portfolio-ready assets"]
  },
  { 
    icon: Trophy, 
    title: "Win Competitions", 
    desc: "Compete in fashion design challenges against students from top Pakistani institutes.",
    features: ["Cash prizes up to PKR 100K", "Brand exposure", "Industry recognition"]
  },
  { 
    icon: Briefcase, 
    title: "Get Hired", 
    desc: "Connect with brands looking for fresh talent and freelance opportunities.",
    features: ["Job board access", "Brand partnerships", "Freelance gigs"]
  },
];

const institutes = [
  { name: "PIFD", location: "Lahore", students: 45 },
  { name: "STEP", location: "Karachi", students: 38 },
  { name: "IVSAA", location: "Karachi", students: 22 },
  { name: "NCA", location: "Lahore", students: 28 },
  { name: "Beaconhouse", location: "Lahore", students: 15 },
  { name: "Indus Valley", location: "Karachi", students: 19 },
];

const successStories = [
  {
    name: "Ayesha Khan",
    institute: "PIFD",
    achievement: "Won Summer Streetwear Sprint",
    prize: "PKR 50,000",
    quote: "Adorzia helped me build a portfolio that got me noticed by top brands."
  },
  {
    name: "Zain Ahmed",
    institute: "STEP",
    achievement: "Hired by Urban Threads",
    role: "Junior Designer",
    quote: "The competitions gave me real industry experience before graduation."
  },
  {
    name: "Fatima Malik",
    institute: "NCA",
    achievement: "Launched own collection",
    sales: "50+ orders",
    quote: "From student to entrepreneur - Adorzia made it possible."
  },
];

const stats = [
  { value: "500+", label: "Student Designers" },
  { value: "PKR 2M+", label: "Prizes Awarded" },
  { value: "15+", label: "Partner Institutes" },
  { value: "85%", label: "Employment Rate" },
];

export default function ForStudents() {
  const seo = PAGE_SEO.forStudents;
  
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
        { name: "For Students", url: "https://www.adorzia.com/students" }
      ]} />
      <FAQSchema items={COMMON_FAQS.portfolio} mainEntityName="Adorzia for Students" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <motion.div 
          className="absolute top-20 right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
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
            <Badge variant="secondary" className="mb-6">For Fashion Students</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Launch Your Fashion Career
              <br />
              <span className="text-muted-foreground">From Campus to Industry</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Build a professional portfolio, compete in design challenges, and get hired by 
              top Pakistani fashion brands—all while you're still studying.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/auth">
                <Button size="lg" className="group">
                  Start Building Portfolio
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/competitions">
                <Button size="lg" variant="outline">
                  View Competitions
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

      {/* Pathways Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Career Pathways</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Your Path to Success
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Three ways Adorzia helps fashion students build their careers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pathways.map((item, i) => (
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

      {/* Partner Institutes */}
      <ParallaxSection
        backgroundImage={backgroundImages.textile}
        className="py-20 md:py-28"
        speed={0.3}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Partner Institutes</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Students From Top Institutes
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Join designers from Pakistan's leading fashion schools.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {institutes.map((institute, i) => (
              <motion.div
                key={institute.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="backdrop-blur-sm bg-background/90 text-center">
                  <CardContent className="p-4">
                    <GraduationCap className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">{institute.name}</h3>
                    <p className="text-xs text-muted-foreground">{institute.location}</p>
                    <p className="text-sm font-medium mt-1">{institute.students} students</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Success Stories */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Success Stories</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              From Students to Professionals
            </AnimatedHeading>
            <p className="text-muted-foreground">
              See how fashion students transformed their careers with Adorzia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, i) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard tiltAmount={5}>
                  <Card className="h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{story.name}</h3>
                          <p className="text-sm text-muted-foreground">{story.institute}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="mb-4">{story.achievement}</Badge>
                      <p className="text-muted-foreground italic mb-4">"{story.quote}"</p>
                      {story.prize && (
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Trophy className="h-4 w-4 text-warning" />
                          {story.prize}
                        </div>
                      )}
                      {story.role && (
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Briefcase className="h-4 w-4 text-primary" />
                          {story.role}
                        </div>
                      )}
                      {story.sales && (
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Rocket className="h-4 w-4 text-green-500" />
                          {story.sales}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GraduationCap className="h-16 w-16 mx-auto mb-6 text-primary" />
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Ready to Start Your Journey?
            </AnimatedHeading>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of fashion students from PIFD, STEP, NCA, and other top institutes 
              who are building their careers on Adorzia.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="group">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/styleboxes-info">
                <Button size="lg" variant="outline">
                  Explore StyleBoxes
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
