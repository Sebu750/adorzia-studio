import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Award, Sparkles, Users } from "lucide-react";
import { styleathonImages } from "@/lib/styleathon-images";

const StyleathonBanner = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={styleathonImages.banner}
          alt="Styleathon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 mb-6"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-background/90 tracking-wider uppercase">
              Now Open
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-3 tracking-tight">
            STYLEATHON 01
          </h2>
          <p className="text-xl md:text-2xl text-background/80 font-light mb-6">
            Graduation Thesis Edition
          </p>

          {/* Subtitle */}
          <p className="text-background/70 text-lg mb-8 max-w-lg">
            Submit your professionally shot thesis collection. A career-defining platform for fashion designers.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-background/10 backdrop-blur-sm rounded-full border border-background/10">
              <Users className="w-4 h-4 text-background/70" />
              <span className="text-sm text-background/80">Fashion Only</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background/10 backdrop-blur-sm rounded-full border border-background/10">
              <Award className="w-4 h-4 text-background/70" />
              <span className="text-sm text-background/80">Prize Money</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background/10 backdrop-blur-sm rounded-full border border-background/10">
              <Sparkles className="w-4 h-4 text-background/70" />
              <span className="text-sm text-background/80">XP & Badges</span>
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/styleathon/01"
            className="inline-flex items-center gap-3 px-8 py-4 bg-background text-foreground font-medium rounded-full hover:bg-background/90 transition-all duration-300 group"
          >
            View Styleathon
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default StyleathonBanner;
