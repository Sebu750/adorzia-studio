import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/marketplace-math";
import { useCart } from "@/hooks/useCart";
import { getProductImage, generateSrcSet } from "@/lib/cdn-image";

interface MarketplaceProductCardProps {
  id: string;
  title: string;
  price: number;
  salePrice?: number;
  images: string[];
  designerName?: string;
  brandName?: string;
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
  brandName,
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
      <Link to={productUrl} className="block group/card">
        {/* Image Container */}
        <div className="relative aspect-[2/3] bg-white border border-slate-100 overflow-hidden mb-4">
          {/* Main Image */}
          {images && images.length > 0 ? (
            <img
              src={getProductImage(images[currentImageIndex] || images[0], 'card')}
              srcSet={generateSrcSet(images[currentImageIndex] || images[0])}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out group-hover/card:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
              <ShoppingBag className="h-10 w-10 text-slate-300" />
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
        <div className="space-y-1.5 px-1">
          {/* Designer Name - NJAL Style */}
          {(brandName || designerName) && (
            <Link 
              to={`/shop?designer=${designerId}`}
              className="block"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-black hover:text-slate-600 transition-colors">
                {brandName || designerName}
              </p>
            </Link>
          )}

          {/* Title */}
          <h3 className="font-medium text-[13px] text-slate-800 line-clamp-1 group-hover/card:text-black transition-colors">
            {title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="font-medium text-[13px] text-black">
              {formatCurrency(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-[12px] text-slate-400 line-through">
                {formatCurrency(price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
