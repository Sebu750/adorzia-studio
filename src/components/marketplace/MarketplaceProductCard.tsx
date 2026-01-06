import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/marketplace-math";
import { useCart } from "@/hooks/useCart";

interface MarketplaceProductCardProps {
  id: string;
  title: string;
  price: number;
  salePrice?: number;
  images: string[];
  designerName?: string;
  designerId?: string;
  averageRating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  slug?: string;
}

export function MarketplaceProductCard({
  id,
  title,
  price,
  salePrice,
  images,
  designerName,
  designerId,
  averageRating = 0,
  reviewCount = 0,
  isNew,
  isBestseller,
  slug,
}: MarketplaceProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem, isLoading } = useCart();

  const productUrl = slug ? `/shop/product/${slug}` : `/shop/product/${id}`;
  const hasDiscount = salePrice && salePrice < price;
  const displayPrice = salePrice || price;
  const discountPercent = hasDiscount ? Math.round((1 - salePrice / price) * 100) : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(id, 1);
  };

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={productUrl} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-3">
          {/* Main Image */}
          {images && images.length > 0 ? (
            <img
              src={images[currentImageIndex] || images[0]}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Image Navigation Dots */}
          {images && images.length > 1 && isHovered && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.slice(0, 4).map((_, index) => (
                <button
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onMouseEnter={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                New
              </Badge>
            )}
            {isBestseller && (
              <Badge variant="secondary" className="text-xs">
                Bestseller
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all ${
              isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Actions */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 text-xs"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                Add to Bag
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="px-3"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Quick view modal
                }}
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          {/* Designer Name */}
          {designerName && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {designerName}
            </p>
          )}

          {/* Title */}
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${hasDiscount ? 'text-destructive' : ''}`}>
              {formatCurrency(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
