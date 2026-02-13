import { motion } from 'framer-motion';

interface WaveDividerProps {
  position?: 'top' | 'bottom';
  variant?: 'wave' | 'curve' | 'triangle' | 'tilt';
  className?: string;
  fillClassName?: string;
  animated?: boolean;
}

const WaveDivider = ({ 
  position = 'bottom',
  variant = 'wave',
  className = '',
  fillClassName = 'fill-background',
  animated = false,
}: WaveDividerProps) => {
  const isTop = position === 'top';
  
  const getPath = () => {
    switch (variant) {
      case 'wave':
        return "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";
      case 'curve':
        return "M0,160L1440,64L1440,320L0,320Z";
      case 'triangle':
        return "M0,320L720,160L1440,320L1440,320L0,320Z";
      case 'tilt':
        return "M0,224L1440,96L1440,320L0,320Z";
      default:
        return "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";
    }
  };

  const svgProps = {
    className: `absolute left-0 w-full h-auto ${isTop ? 'top-0' : 'bottom-0'} ${className}`,
    style: { 
      transform: isTop ? 'rotate(180deg)' : undefined,
      marginBottom: isTop ? undefined : '-1px',
      marginTop: isTop ? '-1px' : undefined,
    },
    viewBox: "0 0 1440 320",
    preserveAspectRatio: "none",
  };

  if (animated && variant === 'wave') {
    return (
      <motion.svg
        {...svgProps}
        initial={{ x: 0 }}
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d={getPath()} className={fillClassName} />
      </motion.svg>
    );
  }

  return (
    <svg {...svgProps}>
      <path d={getPath()} className={fillClassName} />
    </svg>
  );
};

export default WaveDivider;
