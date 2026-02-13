import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Heart, Eye, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductCardProps {
  id: string | number;
  title: string;
  price: string;
  image?: string;
  designer?: string;
  category?: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

const ProductCard = ({
  id,
  title,
  price,
  image,
  designer,
  category,
  isNew = false,
  isFeatured = false,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  return (
    <>
      <motion.div
        className="group relative rounded-xl overflow-hidden bg-card border border-border cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {/* Placeholder or actual image */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          
          {image && (
            <motion.img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {isNew && (
              <Badge className="bg-primary text-primary-foreground">New</Badge>
            )}
            {isFeatured && (
              <Badge variant="secondary">Featured</Badge>
            )}
          </div>

          {/* Like Button */}
          <motion.button
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-foreground'
              }`}
            />
          </motion.button>

          {/* Hover Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-6"
              >
                <div className="flex gap-2">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowQuickView(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      Quick View
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Button size="sm" className="gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-4">
          {category && (
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
              {category}
            </p>
          )}
          <h3 className="font-medium text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {designer && (
            <p className="text-sm text-muted-foreground mb-2">by {designer}</p>
          )}
          <div className="flex items-center justify-between">
            <motion.p
              className="font-display font-semibold text-lg"
              animate={{ scale: isHovered ? 1.05 : 1 }}
            >
              {price}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{title}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted relative">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10" />
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              {category && (
                <Badge variant="outline" className="w-fit mb-4">
                  {category}
                </Badge>
              )}
              
              <p className="text-muted-foreground mb-4">
                This is a beautifully crafted design piece from our curated marketplace. 
                Each item is created by talented designers and produced with high-quality materials.
              </p>

              {designer && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Designer</p>
                  <p className="font-medium">{designer}</p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-display text-3xl font-bold">{price}</p>
              </div>

              <div className="flex gap-3 mt-auto">
                <Button className="flex-1 gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isLiked ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
