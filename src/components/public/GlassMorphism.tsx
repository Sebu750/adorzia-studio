import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassMorphismProps {
  children: ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
}

const GlassMorphism = ({
  children,
  className = '',
  blur = 'md',
  opacity = 80,
}: GlassMorphismProps) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl border border-border/50',
        blurClasses[blur],
        className
      )}
      style={{
        backgroundColor: `hsl(var(--background) / ${opacity / 100})`,
      }}
    >
      {children}
    </div>
  );
};

export default GlassMorphism;
