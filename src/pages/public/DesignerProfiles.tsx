import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Users, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/public/PublicLayout";
import TiltCard from "@/components/public/TiltCard";
import StatsSection from "@/components/public/StatsSection";
import AnimatedHeading from "@/components/public/AnimatedHeading";
import SEOHead from "@/components/public/SEOHead";
import { designerImages } from "@/lib/images";
import { Link } from "react-router-dom";

const designers = [
  { 
    name: "Sarah Iqbal", 
    specialty: "Streetwear", 
    products: 12, 
    rating: 4.9,
    image: designerImages.sarahIqbal,
    rank: "Lead Designer"
  },
  { 
    name: "Ali Hassan", 
    specialty: "Essentials", 
    products: 8, 
    rating: 4.8,
    image: designerImages.aliHassan,
    rank: "Senior Designer"
  },
  { 
    name: "Fatima Malik", 
    specialty: "Couture", 
    products: 15, 
    rating: 4.9,
    image: designerImages.fatimaMalik,
    rank: "Elite Designer"
  },
  { 
    name: "Zain Ahmed", 
    specialty: "Sustainable", 
    products: 10, 
    rating: 4.7,
    image: designerImages.zainAhmed,
    rank: "Designer"
  },
  { 
    name: "Ayesha Khan", 
    specialty: "Traditional", 
    products: 18, 
    rating: 4.9,
    image: designerImages.ayeshaKhan,
    rank: "Elite Designer"
  },
  { 
    name: "Usman Tariq", 
    specialty: "Streetwear", 
    products: 14, 
    rating: 4.8,
    image: designerImages.usmanTariq,
    rank: "Lead Designer"
  },
  { 
    name: "Hira Noor", 
    specialty: "Couture", 
    products: 6, 
    rating: 4.9,
    image: designerImages.hiraNoor,
    rank: "Senior Designer"
  },
  { 
    name: "Kamran Malik", 
    specialty: "Textile Art", 
    products: 22, 
    rating: 4.8,
    image: designerImages.kamranMalik,
    rank: "Elite Designer"
  },
];

const designerStats = [
  { value: 120, suffix: '+', label: 'Active Designers', icon: <Users className="h-6 w-6 text-muted-foreground" /> },
  { value: 450, suffix: '+', label: 'Products Created', icon: <Award className="h-6 w-6 text-muted-foreground" /> },
  { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: <TrendingUp className="h-6 w-6 text-muted-foreground" /> },
];

export default function DesignerProfiles() {
  return (
    <PublicLayout>
      <SEOHead 
        title="Pakistani Fashion Designers | Textile & Jewelry Design Portfolio"
        description="Best fashion designers in Karachi. Textile design talent Faisalabad. Jewelry design portfolios. Get hired by top fashion brands in Pakistan as a fresher."
        url="https://www.adorzia.com/designer-profiles"
        keywords="Pakistani Fashion Designers, Best fashion designers Karachi, Textile design talent Faisalabad, Jewelry design portfolio, Fashion design fresher jobs Pakistan"
      />
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-6">Designer Directory</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Meet Our Designers
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover talented creators from across Pakistan, each bringing unique perspectives 
              and exceptional craftsmanship to the fashion industry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-t border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <StatsSection stats={designerStats} variant="default" />
        </div>
      </section>

      {/* Designer Grid */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">Featured Creators</Badge>
            </motion.div>
            <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Top Designers
            </AnimatedHeading>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              These talented designers are shaping the future of Pakistani fashion.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {designers.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <TiltCard tiltAmount={8}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
                    <div className="aspect-square relative overflow-hidden">
                      <motion.img 
                        src={d.image} 
                        alt={d.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <motion.div 
                        className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ y: 10 }}
                        whileHover={{ y: 0 }}
                      >
                        <Button variant="secondary" size="sm" className="w-full">
                          View Profile
                        </Button>
                      </motion.div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-display font-semibold group-hover:text-primary transition-colors">
                            {d.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{d.specialty}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">{d.rank}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-2 border-t">
                        <span className="text-muted-foreground">{d.products} products</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-foreground" />
                          <span className="font-medium">{d.rating}</span>
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

      {/* CTA */}
      <section className="py-20 md:py-28 bg-foreground text-background relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <AnimatedHeading className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight text-background">
            Become a Designer
          </AnimatedHeading>
          <motion.p 
            className="text-background/60 max-w-xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join our community of talented creators. Start your journey today.
          </motion.p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
