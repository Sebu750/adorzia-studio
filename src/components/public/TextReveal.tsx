import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  type?: 'words' | 'chars' | 'lines';
}

const TextReveal = ({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.03,
  type = 'words',
}: TextRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const text = typeof children === 'string' ? children : '';
  
  const elements = type === 'chars' 
    ? text.split('') 
    : type === 'words' 
      ? text.split(' ') 
      : text.split('\n');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  if (!text) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`${className} overflow-hidden`}
      style={{ perspective: '1000px' }}
    >
      {elements.map((element, i) => (
        <motion.span
          key={i}
          variants={itemVariants}
          className="inline-block origin-bottom"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {element}
          {type === 'words' && i < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TextReveal;
