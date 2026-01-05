import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StyleathonInfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  items?: string[];
  index?: number;
}

const StyleathonInfoCard = ({
  icon: Icon,
  title,
  description,
  items,
  index = 0,
}: StyleathonInfoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group p-8 bg-card border border-border rounded-2xl hover:border-primary/20 transition-all duration-500"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-muted mb-6 group-hover:bg-primary/10 transition-colors">
        <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-4">{description}</p>
      {items && items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="w-1 h-1 rounded-full bg-primary/50" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default StyleathonInfoCard;
