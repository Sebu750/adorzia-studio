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

const liveChallenges = [
  { 
    title: "Summer Streetwear Sprint", 
    participants: 234, 
    timeLeft: "2d 14h", 
    prize: "PKR 50,000",
    difficulty: "Medium"
  },
  { 
    title: "Sustainable Design Challenge", 
    participants: 156, 
    timeLeft: "5d 8h", 
    prize: "PKR 75,000",
    difficulty: "Hard"
  },
];

const upcomingEvents = [
  { 
    title: "Eid Collection Styleathon", 
    date: "Mar 15, 2024", 
    theme: "Festive Traditional",
    registrations: 89
  },
  { 
    title: "Brand Collaboration Challenge", 
    date: "Mar 22, 2024", 
    theme: "Streetwear x Luxury",
    sponsor: "Partner Brand"
  },
  { 
    title: "Monsoon Fashion Week", 
    date: "Apr 1, 2024", 
    theme: "Rain-Ready Designs",
    registrations: 45
  },
];

const pastWinners = [
  { 
    name: "Ayesha Khan", 
    competition: "Winter Collection Challenge", 
    prize: "PKR 100,000",
    avatar: "AK"
  },
  { 
    name: "Zain Ahmed", 
    competition: "Streetwear Showdown", 
    prize: "PKR 75,000",
    avatar: "ZA"
  },
  { 
    name: "Fatima Malik", 
    competition: "Sustainable Fashion Sprint", 
    prize: "PKR 50,000",
    avatar: "FM"
  },
];

const leaderboard = [
  { rank: 1, name: "Sarah Iqbal", points: 12450, category: "Streetwear" },
  { rank: 2, name: "Ali Hassan", points: 11200, category: "Essentials" },
  { rank: 3, name: "Hira Noor", points: 10800, category: "Couture" },
  { rank: 4, name: "Usman Tariq", points: 9950, category: "Sustainable" },
  { rank: 5, name: "Maria Khan", points: 9200, category: "Formal" },
];

export default function Competitions() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6">
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
              <Button size="lg" variant="secondary">
                Enter the Arena
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Live Challenges */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                <Badge variant="destructive">LIVE NOW</Badge>
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight">
                Live Challenges
              </h2>
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
                <Card className="h-full border-2 hover:border-foreground/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={
                        challenge.difficulty === 'Medium' ? 'warning' : 'destructive'
                      }>
                        {challenge.difficulty}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-destructive" />
                        <span className="font-mono text-destructive">{challenge.timeLeft}</span>
                      </div>
                    </div>
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
                    <Button className="w-full mt-6">Join Challenge</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Coming Soon</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Upcoming Events
            </h2>
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
                <Card className="h-full">
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
                    <Button variant="outline" className="w-full mt-4">
                      Set Reminder
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Winners */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Hall of Fame</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Past Winners
            </h2>
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
                <Card className="h-full">
                  <div className="aspect-video bg-secondary relative">
                    <div className="absolute top-4 left-4">
                      <div className="h-10 w-10 rounded-full bg-warning flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-warning-foreground" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                        <span className="font-bold">{winner.avatar}</span>
                      </div>
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboards */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 border-background/20 text-background">
              Rankings
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Leaderboards
            </h2>
            <p className="text-background/60">
              Category-based rankings and national standings.
            </p>
          </div>

          <Card className="bg-background/5 border-background/10 max-w-2xl mx-auto">
            <CardContent className="p-0">
              {leaderboard.map((entry, i) => (
                <div 
                  key={entry.rank}
                  className={`flex items-center justify-between p-4 ${
                    i < leaderboard.length - 1 ? 'border-b border-background/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      entry.rank === 1 ? 'bg-warning text-warning-foreground' :
                      entry.rank === 2 ? 'bg-background/20' :
                      entry.rank === 3 ? 'bg-background/15' : 'bg-background/10'
                    }`}>
                      {entry.rank === 1 ? (
                        <Crown className="h-5 w-5" />
                      ) : (
                        <span className="font-bold">{entry.rank}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{entry.name}</p>
                      <p className="text-sm text-background/60">{entry.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono">{entry.points.toLocaleString()}</p>
                    <p className="text-xs text-background/60">points</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Flame className="h-8 w-8" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Enter the Arena
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Build your reputation. Win prizes. Get discovered.
          </p>
          
          <Link to="/auth">
            <Button size="lg" className="h-12 px-8">
              Start Competing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
