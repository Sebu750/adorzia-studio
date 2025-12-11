import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
  targetDate?: Date;
  initialTime?: string; // Format: "2d 14h" or similar
  className?: string;
  compact?: boolean;
}

interface TimeUnit {
  value: number;
  label: string;
}

const parseInitialTime = (timeString: string): number => {
  // Parse formats like "2d 14h", "5h 30m", "1d", etc.
  let totalMs = 0;
  const parts = timeString.toLowerCase().split(' ');
  
  parts.forEach(part => {
    const num = parseInt(part);
    if (part.includes('d')) totalMs += num * 24 * 60 * 60 * 1000;
    else if (part.includes('h')) totalMs += num * 60 * 60 * 1000;
    else if (part.includes('m')) totalMs += num * 60 * 1000;
    else if (part.includes('s')) totalMs += num * 1000;
  });
  
  return totalMs;
};

const CountdownTimer = ({ 
  targetDate, 
  initialTime, 
  className = '',
  compact = false 
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (targetDate) {
      return targetDate.getTime() - Date.now();
    }
    if (initialTime) {
      return parseInitialTime(initialTime);
    }
    return 0;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1000;
        return newTime > 0 ? newTime : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft > 0]);

  const getTimeUnits = (): TimeUnit[] => {
    const seconds = Math.floor((timeLeft / 1000) % 60);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
    const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24);

    if (compact) {
      if (days > 0) {
        return [
          { value: days, label: 'd' },
          { value: hours, label: 'h' },
        ];
      }
      return [
        { value: hours, label: 'h' },
        { value: minutes, label: 'm' },
      ];
    }

    return [
      { value: days, label: 'Days' },
      { value: hours, label: 'Hours' },
      { value: minutes, label: 'Min' },
      { value: seconds, label: 'Sec' },
    ].filter(unit => unit.value > 0 || unit.label === 'Sec');
  };

  const timeUnits = getTimeUnits();

  if (compact) {
    return (
      <div className={`flex items-center gap-1 font-mono text-sm font-medium ${className}`}>
        {timeUnits.map((unit, i) => (
          <span key={unit.label} className="flex items-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={unit.value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-block tabular-nums"
              >
                {unit.value}
              </motion.span>
            </AnimatePresence>
            <span className="text-muted-foreground">{unit.label}</span>
            {i < timeUnits.length - 1 && <span className="mx-0.5 text-muted-foreground">:</span>}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {timeUnits.map((unit, i) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="relative w-14 h-14 bg-card border rounded-lg flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={unit.value}
                initial={{ y: -20, opacity: 0, rotateX: 90 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: 20, opacity: 0, rotateX: -90 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                className="text-xl font-bold font-mono tabular-nums"
              >
                {String(unit.value).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            {/* Flip effect line */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          </div>
          <span className="text-xs text-muted-foreground mt-1">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
