import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  from?: string;
  via?: string;
  to?: string;
}

const GradientText = ({
  children,
  className = '',
  animate = true,
  from = 'hsl(var(--primary))',
  via = 'hsl(var(--primary) / 0.7)',
  to = 'hsl(var(--muted-foreground))',
}: GradientTextProps) => {
  return (
    <motion.span
      className={`bg-clip-text text-transparent bg-gradient-to-r ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
        backgroundSize: animate ? '200% 200%' : '100% 100%',
      }}
      animate={animate ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      } : {}}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
};

export default GradientText;
