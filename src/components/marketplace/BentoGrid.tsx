import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getProductImage } from "@/lib/cdn-image";

/**
 * UI/UX Strategy: Editorial Bento/Masonry Layouts
 * High-fashion digital flagship with immersive editorial design
 * Modular boxes highlighting collections, designer quotes, and video lookbooks
 */

interface BentoItem {
  type: 'product' | 'collection' | 'designer_quote' | 'video' | 'cta';
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  data: any;
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 row-span-2',
  large: 'col-span-2 row-span-2',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-3',
};

export function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px]",
      className
    )}>
      {items.map((item, index) => (
        <BentoCard key={index} item={item} index={index} />
      ))}
    </div>
  );
}

function BentoCard({ item, index }: { item: BentoItem; index: number }) {
  const baseClasses = cn(
    "group relative overflow-hidden rounded-2xl",
    "transition-all duration-500 hover:shadow-2xl",
    sizeClasses[item.size]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={baseClasses}
    >
      {item.type === 'product' && <ProductCard data={item.data} />}
      {item.type === 'collection' && <CollectionCard data={item.data} />}
      {item.type === 'designer_quote' && <DesignerQuoteCard data={item.data} />}
      {item.type === 'video' && <VideoCard data={item.data} />}
      {item.type === 'cta' && <CTACard data={item.data} />}
    </motion.div>
  );
}

function ProductCard({ data }: { data: any }) {
  return (
    <Link to={`/shop/product/${data.id}`} className="block h-full">
      {/* Adaptive Glassmorphism Background */}
      <div className="absolute inset-0">
        <img
          src={getProductImage(data.images?.[0], 'card')}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Liquid Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
      </div>

      {/* Content with Glassmorphism */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <Badge variant="secondary" className="mb-2 bg-white/90 text-black">
            {data.designer?.brand_name || 'Designer'}
          </Badge>
          <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1">
            {data.title}
          </h3>
          <p className="text-white/90 font-medium">
            ${data.price}
          </p>
        </div>
      </div>
    </Link>
  );
}

function CollectionCard({ data }: { data: any }) {
  return (
    <Link to={`/shop/collections/${data.slug}`} className="block h-full group">
      <div className="absolute inset-0">
        <img
          src={data.image_url}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent" />
      </div>

      <div className="absolute inset-0 p-8 flex flex-col justify-between">
        <Badge variant="outline" className="self-start bg-white/10 backdrop-blur-sm border-white/30 text-white">
          Collection
        </Badge>
        
        <div>
          <h2 className="font-display text-3xl font-bold text-white mb-2 leading-tight">
            {data.name}
          </h2>
          <p className="text-white/80 text-sm mb-4 line-clamp-2">
            {data.description}
          </p>
          <Button 
            variant="secondary" 
            size="sm"
            className="group-hover:translate-x-1 transition-transform"
          >
            Explore
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}

function DesignerQuoteCard({ data }: { data: any }) {
  return (
    <div className="h-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm border border-primary/10">
      <div className="h-full p-8 flex flex-col justify-between">
        <Quote className="h-12 w-12 text-primary/30" />
        
        <div className="space-y-4">
          <blockquote className="font-display text-xl italic leading-relaxed text-foreground/90">
            "{data.quote}"
          </blockquote>
          
          <div className="flex items-center gap-3">
            {data.avatar && (
              <img
                src={data.avatar}
                alt={data.designer_name}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
              />
            )}
            <div>
              <p className="font-semibold text-sm">{data.designer_name}</p>
              <p className="text-xs text-muted-foreground">{data.brand_name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ data }: { data: any }) {
  return (
    <div className="h-full group cursor-pointer">
      <div className="absolute inset-0">
        <img
          src={data.thumbnail}
          alt={data.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center"
        >
          <Play className="h-8 w-8 text-white ml-1" fill="white" />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <Badge variant="secondary" className="mb-2 bg-white/90">
          Lookbook
        </Badge>
        <h3 className="font-semibold text-white text-lg">
          {data.title}
        </h3>
      </div>
    </div>
  );
}

function CTACard({ data }: { data: any }) {
  return (
    <div className="h-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
      <div className="h-full p-8 flex flex-col justify-between">
        <div className="space-y-3">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {data.badge}
          </Badge>
          <h2 className="font-display text-3xl font-bold leading-tight">
            {data.title}
          </h2>
          <p className="text-white/90 text-sm leading-relaxed">
            {data.description}
          </p>
        </div>

        <Button 
          variant="secondary"
          className="self-start group"
          asChild
        >
          <Link to={data.link}>
            {data.buttonText}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * Helper function to generate editorial Bento layout from marketplace data
 */
export function generateBentoLayout(products: any[], collections: any[], designers: any[]): BentoItem[] {
  const items: BentoItem[] = [];

  // Large hero collection
  if (collections[0]) {
    items.push({
      type: 'collection',
      size: 'large',
      data: collections[0],
    });
  }

  // Featured products
  products.slice(0, 2).forEach(product => {
    items.push({
      type: 'product',
      size: 'medium',
      data: product,
    });
  });

  // Designer quote
  if (designers[0]) {
    items.push({
      type: 'designer_quote',
      size: 'wide',
      data: {
        quote: designers[0].bio || "Fashion is the armor to survive the reality of everyday life.",
        designer_name: designers[0].name,
        brand_name: designers[0].brand_name,
        avatar: designers[0].avatar_url,
      },
    });
  }

  // More products
  products.slice(2, 4).forEach(product => {
    items.push({
      type: 'product',
      size: 'small',
      data: product,
    });
  });

  // CTA
  items.push({
    type: 'cta',
    size: 'medium',
    data: {
      badge: 'New Arrivals',
      title: 'Discover Rising Designers',
      description: 'Explore exclusive collections from Pakistan\'s most promising fashion talent.',
      buttonText: 'View All',
      link: '/shop/products',
    },
  });

  // Video lookbook
  if (collections[1]) {
    items.push({
      type: 'video',
      size: 'wide',
      data: {
        title: `${collections[1].name} Lookbook`,
        thumbnail: collections[1].image_url,
        videoUrl: '#',
      },
    });
  }

  return items;
}
