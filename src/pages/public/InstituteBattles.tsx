import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Trophy, 
  Users, 
  Crown,
  Medal,
  GraduationCap,
  Flame,
  Target,
  Star,
  TrendingUp
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
import { competitionImages, backgroundImages } from "@/lib/images";

const institutes = [
  { 
    name: "PIFD", 
    fullName: "Pakistan Institute of Fashion & Design",
    location: "Lahore", 
    students: 45,
    wins: 12,
    rank: 1,
    specialties: ["Couture", "Traditional", "Bridal"]
  },
  { 
    name: "STEP", 
    fullName: "STEP Institute of Art, Design & Management",
    location: "Karachi", 
    students: 38,
    wins: 9,
    rank: 2,
    specialties: ["Streetwear", "Contemporary", "Sustainable"]
  },
  { 
    name: "NCA", 
    fullName: "National College of Arts",
    location: "Lahore", 
    students: 28,
    wins: 7,
    rank: 3,
    specialties: ["Textile Art", "Experimental", "Heritage"]
  },
  { 
    name: "IVSAA", 
    fullName: "Indus Valley School of Art & Architecture",
    location: "Karachi", 
    students: 22,
    wins: 5,
    rank: 4,
    specialties: ["Minimalist", "Conceptual", "Art-Wear"]
  },
  { 
    name: "Beaconhouse", 
    fullName: "Beaconhouse National University",
    location: "Lahore", 
    students: 15,
    wins: 3,
    rank: 5,
    specialties: ["Commercial", "Ready-to-Wear", "Essentials"]
  },
  { 
    name: "SZABIST", 
    fullName: "SZABIST Design School",
    location: "Karachi", 
    students: 12,
    wins: 2,
    rank: 6,
    specialties: ["Urban", "Youth Culture", "Streetwear"]
  },
];

const upcomingBattles = [
  {
    title: "PIFD vs STEP: Streetwear Showdown",
    date: "Mar 2026",
    prize: "PKR 100,000",
    participants: 50,
    theme: "Urban Street Culture"
  },
  {
    title: "Inter-University Bridal Challenge",
    date: "Apr 2026",
    prize: "PKR 150,000",
    participants: 40,
    theme: "Modern Pakistani Bride"
  },
  {
    title: "NCA vs IVSAA: Textile Innovation",
    date: "May 2026",
    prize: "PKR 75,000",
    participants: 30,
    theme: "Sustainable Materials"
  },
];

const leaderboard = [
  { rank: 1, institute: "PIFD", points: 2450, wins: 12 },
  { rank: 2, institute: "STEP", points: 2180, wins: 9 },
  { rank: 3, institute: "NCA", points: 1890, wins: 7 },
  { rank: 4, institute: "IVSAA", points: 1560, wins: 5 },
  { rank: 5, institute: "Beaconhouse", points: 980, wins: 3 },
];

const pastWinners = [
  { name: "Sarah Iqbal", institute: "PIFD", competition: "Winter Challenge 2025", prize: "PKR 100K" },
  { name: "Zain Ahmed", institute: "STEP", competition: "Streetwear Sprint", prize: "PKR 75K" },
  { name: "Fatima Malik", institute: "NCA", competition: "Heritage Reimagined", prize: "PKR 50K" },
];

const faqs = [
  {
    question: "What are the best fashion design institutes in Pakistan?",
    answer: "Top fashion design institutes in Pakistan include PIFD (Pakistan Institute of Fashion & Design) in Lahore, STEP Institute in Karachi, National College of Arts (NCA), IVSAA (Indus Valley), Beaconhouse National University, and SZABIST. Each has unique strengths - PIFD excels in couture, STEP in streetwear, and NCA in textile arts."
  },
  {
    question: "How do PIFD vs STEP design competitions work?",
    answer: "Inter-university competitions on Adorzia pit students from different institutes against each other in themed design challenges. Students submit StyleBox entries, judged on creativity, execution, and market readiness. Winners receive cash prizes and brand exposure."
  },
];

export default function InstituteBattles() {
  const seo = PAGE_SEO.instituteBattles;
  
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
        { name: "Competitions", url: "https://www.adorzia.com/competitions" },
        { name: "Institute Battles", url: "https://www.adorzia.com/institute-battles" }
      ]} />
      <FAQSchema items={[...COMMON_FAQS.competitions, ...faqs]} mainEntityName="Adorzia Institute Battles" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-foreground text-background overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${competitionImages.arena})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-warning/20 rounded-full blur-[120px]"
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
            <Badge variant="secondary" className="mb-6">Inter-University Competitions</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              PIFD vs STEP
              <br />
              <span className="text-background/60">The Battle of Institutes</span>
            </h1>
            <p className="text-lg text-background/70 leading-relaxed mb-8">
              Watch Pakistan's top fashion design institutes compete head-to-head. 
              Inter-university design competitions where talent from PIFD, STEP, NCA, and more 
              battle for supremacy.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="group">
                  Join the Battle
                  <Flame className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
              <Link to="/competitions">
                <Button size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10">
                  All Competitions
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Institute Leaderboard */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Rankings</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Institute Leaderboard 2026
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Current standings based on competition wins and points.
            </p>
          </div>

          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-0">
              {leaderboard.map((entry, i) => (
                <motion.div 
                  key={entry.institute}
                  className={`flex items-center justify-between p-4 ${
                    i < leaderboard.length - 1 ? 'border-b' : ''
                  } hover:bg-muted/50 transition-colors`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      entry.rank === 1 ? 'bg-warning text-warning-foreground' :
                      entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
                      entry.rank === 3 ? 'bg-amber-700 text-white' : 'bg-muted'
                    }`}>
                      {entry.rank === 1 ? (
                        <Crown className="h-5 w-5" />
                      ) : entry.rank <= 3 ? (
                        <Medal className="h-5 w-5" />
                      ) : (
                        <span className="font-bold">{entry.rank}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{entry.institute}</p>
                      <p className="text-sm text-muted-foreground">{entry.wins} competition wins</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono text-lg">{entry.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Institute Cards */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Partner Institutes</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Competing Institutes
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Fashion schools from across Pakistan battling for design supremacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutes.map((institute, i) => (
              <motion.div
                key={institute.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard tiltAmount={8}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-display font-semibold">{institute.name}</h3>
                            <p className="text-xs text-muted-foreground">{institute.location}</p>
                          </div>
                        </div>
                        <Badge variant={institute.rank <= 3 ? "default" : "secondary"}>
                          #{institute.rank}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{institute.fullName}</p>
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {institute.students} students
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-warning" />
                          {institute.wins} wins
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {institute.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Battles */}
      <ParallaxSection
        backgroundImage={backgroundImages.fashion}
        className="py-20 md:py-28"
        speed={0.3}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Coming Soon</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Upcoming Institute Battles
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Don't miss these epic showdowns between Pakistan's top fashion schools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingBattles.map((battle, i) => (
              <motion.div
                key={battle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard tiltAmount={10} glareEnabled>
                  <Card className="h-full backdrop-blur-sm bg-background/95">
                    <CardContent className="p-6">
                      <Badge variant="destructive" className="mb-4">
                        <Flame className="h-3 w-3 mr-1" />
                        {battle.date}
                      </Badge>
                      <h3 className="font-display text-lg font-semibold mb-2">{battle.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">Theme: {battle.theme}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {battle.participants} expected
                        </div>
                        <div className="flex items-center gap-1 font-semibold">
                          <Trophy className="h-4 w-4 text-warning" />
                          {battle.prize}
                        </div>
                      </div>
                      <Button className="w-full mt-4 group" variant="outline">
                        Set Reminder
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Past Winners */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Hall of Fame</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Recent Champions
            </AnimatedHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pastWinners.map((winner, i) => (
              <motion.div
                key={winner.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-8 w-8 text-warning" />
                    </div>
                    <h3 className="font-semibold">{winner.name}</h3>
                    <p className="text-sm text-primary mb-2">{winner.institute}</p>
                    <p className="text-xs text-muted-foreground mb-2">{winner.competition}</p>
                    <Badge variant="secondary">{winner.prize}</Badge>
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
            <GraduationCap className="h-16 w-16 mx-auto mb-6" />
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Represent Your Institute
            </AnimatedHeading>
            <p className="text-lg text-background/70 mb-8">
              Whether you're from PIFD, STEP, NCA, or any other fashion school in Pakistan, 
              join the battle and prove your institute's design excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="group">
                  Join Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/students">
                <Button size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10">
                  Student Resources
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
