import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedCounter from './AnimatedCounter';
import hero1 from '@/assets/hero1.png';
import hero2 from '@/assets/hero2.png';
import hero3 from '@/assets/hero3.png';

const heroSlides = [
  {
    image: hero1,
    title: 'Design Your Future',
    subtitle: 'Join Pakistan\'s premier fashion design platform',
  },
  {
    image: hero2,
    title: 'Create & Earn',
    subtitle: 'Turn your designs into marketplace-ready products',
  },
  {
    image: hero3,
    title: 'Learn & Grow',
    subtitle: 'Master skills through guided StyleBox challenges',
  },
];

const stats = [
  { value: 200, suffix: '+', label: 'Designers' },
  { value: 150, suffix: '+', label: 'StyleBoxes' },
  { value: 50, prefix: '$', suffix: 'K+', label: 'Paid to Creators' },
];

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Background Slides with Ken Burns effect */}
      {heroSlides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: currentSlide === index ? 1 : 0,
            scale: currentSlide === index ? 1.05 : 1,
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{ y, scale }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </motion.div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-20 h-20 border border-primary/20 rounded-full"
        animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-1/3 right-20 w-32 h-32 border-2 border-dashed border-primary/10 rounded-full"
        animate={{ y: [0, 30, 0], rotate: [360, 180, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto h-full flex flex-col justify-center px-4"
        style={{ opacity }}
      >
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full text-sm text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Foundation Ranks Open - Limited Spots
            </span>
          </motion.div>

          {/* Animated Title */}
          <motion.h1
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight"
          >
            {heroSlides[currentSlide].title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            key={`sub-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl"
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
            >
              <Link to="/auth">
                <span className="relative z-10 flex items-center gap-2">
                  Start Creating
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-foreground/20 hover:bg-foreground/5 px-8 py-6 text-lg"
            >
              <Link to="/shop">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Marketplace
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex gap-8 md:gap-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center md:text-left">
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-muted-foreground text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Slide Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-background/20 backdrop-blur-sm border border-foreground/10 hover:bg-background/40 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'w-8 bg-primary' 
                  : 'w-2 bg-foreground/30 hover:bg-foreground/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-background/20 backdrop-blur-sm border border-foreground/10 hover:bg-background/40 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 right-8 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-foreground/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
