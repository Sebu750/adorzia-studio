import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface StyleathonSubmissionCardProps {
  id: string;
  title: string;
  designerName: string;
  designerAvatar: string;
  designerLevel: string;
  xp: number;
  heroImage: string;
  index?: number;
}

const StyleathonSubmissionCard = ({
  id,
  title,
  designerName,
  designerAvatar,
  designerLevel,
  xp,
  heroImage,
  index = 0,
}: StyleathonSubmissionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
    >
      <Link
        to={`/styleathon/01/project/${id}`}
        className="group block"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
          {/* Image */}
          <img
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Submission Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs">
              Styleathon Submission
            </Badge>
          </div>

          {/* Hover Content */}
          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            {/* Designer Info */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={designerAvatar}
                alt={designerName}
                className="w-10 h-10 rounded-full object-cover border-2 border-background/20"
              />
              <div>
                <p className="text-background font-medium">{designerName}</p>
                <div className="flex items-center gap-2 text-background/70 text-sm">
                  <span>{designerLevel}</span>
                  <span className="w-1 h-1 rounded-full bg-background/40" />
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Project Title */}
            <h3 className="font-display text-xl text-background font-semibold">
              {title}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default StyleathonSubmissionCard;
