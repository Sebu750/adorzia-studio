import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
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
  designer?: {
    user_id: string;
    name: string;
    brand_name: string;
  };
  designerId?: string;
  averageRating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isMadeToOrder?: boolean;
  isLimitedEdition?: boolean;
  editionSize?: number;
  slug?: string;
  productionTime?: string;
}

export function MarketplaceProductCard({
  id,
  title,
  price,
  salePrice,
  images,
  designerName,
  brandName,
  designer,
  designerId,
  isNew,
  isBestseller,
  isMadeToOrder,
  isLimitedEdition,
  editionSize,
  slug,
  productionTime = "2-3 weeks",
}: MarketplaceProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem, isLoading } = useCart();

  const productUrl = slug ? `/shop/product/${slug}` : `/shop/product/${id}`;
  const displayPrice = salePrice || price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(id, 1);
  };

  return (
    <motion.div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={productUrl} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-muted overflow-hidden mb-4">
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          
          {/* Main Image */}
          {images && images.length > 0 ? (
            <img
              src={getProductImage(images[0], 'card')}
              srcSet={generateSrcSet(images[0])}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              alt={title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="font-display text-4xl text-muted-foreground/30">
                {title?.charAt(0)}
              </span>
            </div>
          )}

          {/* Badges - Minimal */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-medium bg-background/90 backdrop-blur-sm">
                New
              </Badge>
            )}
            {isLimitedEdition && (
              <Badge className="text-[10px] uppercase tracking-wider font-medium bg-amber-600 text-white border-0">
                Limited {editionSize ? `/${editionSize}` : ''}
              </Badge>
            )}
            {isMadeToOrder && (
              <Badge className="text-[10px] uppercase tracking-wider font-medium bg-blue-600 text-white border-0">
                Made to Order
              </Badge>
            )}
            {isBestseller && !isLimitedEdition && (
              <Badge className="text-[10px] uppercase tracking-wider font-medium bg-luxury-charcoal text-background">
                Bestseller
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              isLiked ? 'text-red-500' : 'text-foreground/60 hover:text-foreground'
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Add - Appears on Hover */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.25 }}
          >
            <Button
              size="sm"
              className="w-full h-10 text-xs tracking-wider bg-background text-foreground hover:bg-background/90 shadow-lg"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-2" />
              Add to Bag
            </Button>
          </motion.div>
        </div>

        {/* Product Info - Editorial Style */}
        <div className="space-y-2">
          {/* Designer Name - Brand Name by Designer Name format */}
          <div className="space-y-1">
            {(brandName || designer?.brand_name) && (
              <p className="text-editorial-label font-medium text-foreground">
                {brandName || designer?.brand_name}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              by {designerName || designer?.name || 'Designer'}</p>
          </div>

          {/* Title */}
          <h3 className="font-display text-base font-medium text-foreground line-clamp-1 group-hover:text-foreground/80 transition-colors">
            {title}
          </h3>

          {/* Price & Production Time */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-display text-lg font-medium">
              {formatCurrency(displayPrice)}
            </span>
            <span className="text-xs text-muted-foreground">
              {isMadeToOrder ? 'Made to order' : isLimitedEdition ? 'Limited edition' : productionTime}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
