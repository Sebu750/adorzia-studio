import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Trophy,
  Clock,
  Users,
  Flame,
  Medal,
  Crown,
  Calendar,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import TiltCard from "@/components/public/TiltCard";
import ParallaxSection from "@/components/public/ParallaxSection";
import SEOHead from "@/components/public/SEOHead";
import { eventBanners, competitionImages, designerImages } from "@/lib/images";

const liveChallenges = [
  { 
    title: "Summer Streetwear Sprint", 
    participants: 234, 
    timeLeft: "2d 14h", 
    prize: "PKR 50,000",
    difficulty: "Medium",
    image: eventBanners.fashionShow
  },
  { 
    title: "Sustainable Design Challenge", 
    participants: 156, 
    timeLeft: "5d 8h", 
    prize: "PKR 75,000",
    difficulty: "Hard",
    image: eventBanners.designContest
  },
];

const upcomingEvents = [
  { 
    title: "Eid Collection Styleathon", 
    date: "Mar 15, 2024", 
    theme: "Festive Traditional",
    registrations: 89,
    image: eventBanners.competition
  },
  { 
    title: "Brand Collaboration Challenge", 
    date: "Mar 22, 2024", 
    theme: "Streetwear x Luxury",
    sponsor: "Partner Brand",
    image: eventBanners.workshop
  },
  { 
    title: "Monsoon Fashion Week", 
    date: "Apr 1, 2024", 
    theme: "Rain-Ready Designs",
    registrations: 45,
    image: eventBanners.runway
  },
];

const pastWinners = [
  { 
    name: "Ayesha Khan", 
    competition: "Winter Collection Challenge", 
    prize: "PKR 100,000",
    avatar: designerImages.ayeshaKhan
  },
  { 
    name: "Zain Ahmed", 
    competition: "Streetwear Showdown", 
    prize: "PKR 75,000",
    avatar: designerImages.zainAhmed
  },
  { 
    name: "Fatima Malik", 
    competition: "Sustainable Fashion Sprint", 
    prize: "PKR 50,000",
    avatar: designerImages.fatimaMalik
  },
];

const leaderboard = [
  { rank: 1, name: "Sarah Iqbal", points: 12450, category: "Streetwear", avatar: designerImages.sarahIqbal },
  { rank: 2, name: "Ali Hassan", points: 11200, category: "Essentials", avatar: designerImages.aliHassan },
  { rank: 3, name: "Hira Noor", points: 10800, category: "Couture", avatar: designerImages.hiraNoor },
  { rank: 4, name: "Usman Tariq", points: 9950, category: "Sustainable", avatar: designerImages.usmanTariq },
  { rank: 5, name: "Maria Khan", points: 9200, category: "Formal", avatar: designerImages.sarahAhmed },
];

export default function Competitions() {
  return (
    <PublicLayout>
      <SEOHead 
        title="Design Competitions | Adorzia Styleathon"
        description="Compete in real-time fashion design challenges. Win prizes, build your reputation, and get discovered. Join live challenges and upcoming events."
        url="https://studio.adorzia.com/competitions"
        keywords="design competition, fashion challenge, styleathon, design contest, win prizes"
      />
      {/* Hero with animated background */}
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
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
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
            <Badge variant="secondary" className="mb-6">Styleathon Arena</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Compete. Create.
              <br />
              <span className="text-background/60">Win Recognition.</span>
            </h1>
            <p className="text-lg text-background/70 leading-relaxed mb-8">
              Real-time fashion challenges where designers prove their skills. 
              Enter the arena, build your reputation, and win prizes.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="group">
                Enter the Arena
                <Zap className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Live Challenges with images */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <motion.div 
                  className="h-3 w-3 rounded-full bg-destructive"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <Badge variant="destructive">LIVE NOW</Badge>
              </div>
              <AnimatedHeading className="font-display text-3xl font-bold tracking-tight">
                Live Challenges
              </AnimatedHeading>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {liveChallenges.map((challenge, i) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard tiltAmount={8} glareEnabled>
                  <Card className="h-full border-2 hover:border-foreground/20 transition-colors overflow-hidden">
                    <div className="aspect-[21/9] relative">
                      <img 
                        src={challenge.image} 
                        alt={challenge.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={
                            challenge.difficulty === 'Medium' ? 'warning' : 'destructive'
                          }>
                            {challenge.difficulty}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                            <Clock className="h-4 w-4 text-destructive" />
                            <span className="font-mono text-destructive">{challenge.timeLeft}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-display text-xl font-semibold mb-4">{challenge.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {challenge.participants} competing
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-warning" />
                          <span className="font-bold">{challenge.prize}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-6 group">
                        Join Challenge
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events with images */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Coming Soon</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Upcoming Events
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Seasonal themes, brand-hosted challenges, and special drops.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard>
                  <Card className="h-full overflow-hidden group">
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">Theme: {event.theme}</p>
                      {event.sponsor && (
                        <Badge variant="secondary" className="mb-4">Sponsored</Badge>
                      )}
                      {event.registrations && (
                        <p className="text-xs text-muted-foreground">
                          {event.registrations} pre-registered
                        </p>
                      )}
                      <Button variant="outline" className="w-full mt-4 group">
                        Set Reminder
                        <Calendar className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Winners with avatars */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Hall of Fame</Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Past Winners
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Top creators and their winning work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pastWinners.map((winner, i) => (
              <motion.div
                key={winner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard tiltAmount={10}>
                  <Card className="h-full overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/20 relative">
                      <div className="absolute top-4 left-4">
                        <motion.div 
                          className="h-10 w-10 rounded-full bg-warning flex items-center justify-center"
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Trophy className="h-5 w-5 text-warning-foreground" />
                        </motion.div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={winner.avatar} 
                          alt={winner.name}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-background"
                        />
                        <div>
                          <h3 className="font-display font-semibold">{winner.name}</h3>
                          <p className="text-sm text-muted-foreground">{winner.competition}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Medal className="h-4 w-4 text-warning" />
                        <span className="font-bold">{winner.prize}</span>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboards with parallax */}
      <ParallaxSection
        backgroundImage={competitionImages.leaderboard}
        className="py-20 md:py-28"
        speed={0.3}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Rankings
            </Badge>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Leaderboards
            </AnimatedHeading>
            <p className="text-muted-foreground">
              Category-based rankings and national standings.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto backdrop-blur-sm bg-background/95">
            <CardContent className="p-0">
              {leaderboard.map((entry, i) => (
                <motion.div 
                  key={entry.rank}
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
                      entry.rank === 2 ? 'bg-muted' :
                      entry.rank === 3 ? 'bg-muted/70' : 'bg-muted/50'
                    }`}>
                      {entry.rank === 1 ? (
                        <Crown className="h-5 w-5" />
                      ) : (
                        <span className="font-bold">{entry.rank}</span>
                      )}
                    </div>
                    <img 
                      src={entry.avatar}
                      alt={entry.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{entry.name}</p>
                      <p className="text-sm text-muted-foreground">{entry.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono">{entry.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </ParallaxSection>

    </PublicLayout>
  );
}
