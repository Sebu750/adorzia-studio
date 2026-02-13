import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
}

const ImageReveal = ({
  src,
  alt,
  className = '',
  delay = 0,
  direction = 'left',
  duration = 0.8,
}: ImageRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isLoaded, setIsLoaded] = useState(false);

  const getClipPath = () => {
    switch (direction) {
      case 'left': return { hidden: 'inset(0 100% 0 0)', visible: 'inset(0 0% 0 0)' };
      case 'right': return { hidden: 'inset(0 0 0 100%)', visible: 'inset(0 0 0 0%)' };
      case 'up': return { hidden: 'inset(100% 0 0 0)', visible: 'inset(0% 0 0 0)' };
      case 'down': return { hidden: 'inset(0 0 100% 0)', visible: 'inset(0 0 0% 0)' };
    }
  };

  const clipPaths = getClipPath();

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: clipPaths.hidden }}
        animate={isInView && isLoaded ? { clipPath: clipPaths.visible } : {}}
        transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
        className="w-full h-full"
      >
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          initial={{ scale: 1.2 }}
          animate={isInView && isLoaded ? { scale: 1 } : {}}
          transition={{ duration: duration * 1.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>
      
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
};

export default ImageReveal;
