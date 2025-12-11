import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  backgroundImage?: string;
  speed?: number;
  overlay?: boolean;
}

const ParallaxSection = ({
  children,
  className = '',
  backgroundImage,
  speed = 0.5,
  overlay = true,
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);

  return (
    <section ref={ref} className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <>
          <motion.div
            className="absolute inset-0 -top-20 -bottom-20 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              y,
            }}
          />
          {overlay && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          )}
        </>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
};

export default ParallaxSection;
