import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  FileImage,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import PublicLayout from "@/components/public/PublicLayout";
import SEOHead from "@/components/public/SEOHead";
import StyleathonInfoCard from "@/components/styleathon/StyleathonInfoCard";
import { styleathonImages } from "@/lib/styleathon-images";

const evaluationCriteria = [
  { title: "Concept & Originality", description: "Strength of creative vision and unique perspective" },
  { title: "Design Consistency", description: "Cohesive collection with strong silhouette development" },
  { title: "Craftsmanship Quality", description: "Excellence in construction and finishing details" },
  { title: "Visual Storytelling", description: "Impact of styling and photographic presentation" },
  { title: "Market Potential", description: "Commercial viability and brand positioning clarity" },
];

const timeline = [
  { phase: "Submissions Open", date: "Jan 15 - Feb 28, 2026", status: "active" },
  { phase: "Review Period", date: "Mar 1 - Mar 15, 2026", status: "upcoming" },
  { phase: "Results Announcement", date: "Mar 20, 2026", status: "upcoming" },
];

const StyleathonOverview = () => {
  return (
    <PublicLayout>
      <SEOHead
        title="Styleathon 01 - Graduation Thesis Edition | Adorzia"
        description="Submit your professionally shot thesis collection. A career-defining platform for fashion designers."
      />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={styleathonImages.hero}
            alt="Styleathon Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/50" />
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-background/90 tracking-wider uppercase">
                Now Accepting Submissions
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-background mb-4 tracking-tight">
              STYLEATHON 01
            </h1>
            <p className="text-2xl md:text-3xl text-background/80 font-light mb-8">
              Graduation Thesis Edition
            </p>
            <p className="text-lg text-background/70 max-w-xl mb-12 leading-relaxed">
              A career-defining platform for fashion designers to present their graduation thesis collections 
              through high-quality, professionally shot visuals. This is not a casual contest — it's a milestone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/styleathon/01/submit"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-background text-foreground font-medium rounded-full hover:bg-background/90 transition-all duration-300 group"
              >
                Submit Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/styleathon/01/submissions"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-background font-medium rounded-full border border-background/30 hover:bg-background/10 transition-all duration-300"
              >
                View Submissions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Competition Overview
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to know about Styleathon 01
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StyleathonInfoCard
              icon={Users}
              title="Eligibility"
              description="Open exclusively to fashion designers"
              items={[
                "Final-year fashion students",
                "Recent graduates (last 2 years)",
                "Independent designers with thesis work",
              ]}
              index={0}
            />
            <StyleathonInfoCard
              icon={FileImage}
              title="Submission Type"
              description="Professional thesis collection shoot"
              items={[
                "6-10 high-resolution images",
                "Concept statement (300 words)",
                "Collection breakdown details",
              ]}
              index={1}
            />
            <StyleathonInfoCard
              icon={Trophy}
              title="Rewards"
              description="Recognition and career advancement"
              items={[
                "Cash prizes for top winners",
                "Elite XP boost & rare badges",
                "Featured designer profile",
              ]}
              index={2}
            />
            <StyleathonInfoCard
              icon={Calendar}
              title="Timeline"
              description="Key dates and milestones"
              items={[
                "Submissions: Jan 15 - Feb 28",
                "Review: Mar 1 - Mar 15",
                "Results: Mar 20, 2026",
              ]}
              index={3}
            />
          </div>
        </div>
      </section>

      {/* Evaluation Criteria */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Evaluation Criteria
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Projects are evaluated by industry professionals on these key dimensions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {evaluationCriteria.map((criteria, index) => (
              <motion.div
                key={criteria.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-6 bg-card border border-border rounded-xl"
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {criteria.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {criteria.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Competition Timeline
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

              {timeline.map((item, index) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative flex gap-6 pb-12 last:pb-0"
                >
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                      item.status === "active"
                        ? "bg-primary/10 border-primary"
                        : "bg-muted border-border"
                    }`}
                  >
                    {item.status === "active" ? (
                      <Clock className="w-6 h-6 text-primary" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="pt-4">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                      {item.phase}
                    </h3>
                    <p className="text-muted-foreground">{item.date}</p>
                    {item.status === "active" && (
                      <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        Currently Active
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Award className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Why This Styleathon Matters
            </h2>
            <p className="text-xl text-background/80 leading-relaxed mb-8">
              This is not a casual contest. Styleathon 01 is a career milestone — a moment where 
              designers transition from students to professionals. It bridges fashion education 
              to industry, rewards serious creative work, and builds a verified talent pool for 
              future product launches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/styleathon/01/submit"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-background text-foreground font-medium rounded-full hover:bg-background/90 transition-all duration-300 group"
              >
                Submit Your Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default StyleathonOverview;
