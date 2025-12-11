import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import AnimatedCounter from './AnimatedCounter';

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  icon?: ReactNode;
}

interface StatsSectionProps {
  stats: Stat[];
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'cards' | 'minimal';
}

const StatsSection = ({
  stats,
  title,
  subtitle,
  className = '',
  variant = 'default',
}: StatsSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (variant === 'cards') {
    return (
      <div ref={ref} className={className}>
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <motion.h2
                className="font-display text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p
                className="text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg hover:border-primary/20 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {stat.icon && (
                <div className="flex justify-center mb-3">
                  {stat.icon}
                </div>
              )}
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div ref={ref} className={`flex flex-wrap justify-center gap-8 md:gap-16 ${className}`}>
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 }}
          >
            <div className="font-display text-4xl md:text-5xl font-bold text-foreground">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </div>
            <p className="text-muted-foreground mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div ref={ref} className={className}>
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <motion.h2
              className="font-display text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 }}
          >
            {stat.icon && (
              <div className="flex justify-center mb-3">
                {stat.icon}
              </div>
            )}
            <div className="font-display text-3xl md:text-4xl font-bold text-foreground">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
