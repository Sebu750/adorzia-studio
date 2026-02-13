import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MarqueeTextProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  repeat?: number;
}

const MarqueeText = ({
  children,
  className = '',
  speed = 30,
  pauseOnHover = true,
  direction = 'left',
  repeat = 4,
}: MarqueeTextProps) => {
  const duration = 100 / speed;
  
  return (
    <div 
      className={`overflow-hidden whitespace-nowrap ${className}`}
    >
      <motion.div
        className={`inline-flex ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          x: {
            duration: duration,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <span key={i} className="inline-flex items-center">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeText;
