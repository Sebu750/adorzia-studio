import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/marketplace-math";

interface WishlistItemProps {
  id: string;
  productId: string;
  title: string;
  price: number;
  salePrice: number | null;
  images: string[];
  designerId: string;
  designerName: string;
  brandName: string;
  onRemove: () => void;
  onAddToCart: () => void;
  index?: number;
}

export function WishlistItem({
  productId,
  title,
  price,
  salePrice,
  images,
  designerId,
  designerName,
  brandName,
  onRemove,
  onAddToCart,
  index = 0,
}: WishlistItemProps) {
  const displayPrice = salePrice || price;
  const hasDiscount = salePrice && salePrice < price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-white border border-slate-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
      >
        <X className="h-4 w-4 text-slate-600 hover:text-red-500" />
      </button>

      {/* Image */}
      <Link to={`/shop/product/${productId}`}>
        <div className="aspect-[3/4] bg-slate-50 overflow-hidden">
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-slate-300" />
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Designer */}
        <Link
          to={`/shop/designer/${designerId}`}
          className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-black transition-colors"
        >
          {brandName || designerName}
        </Link>

        {/* Title */}
        <Link to={`/shop/product/${productId}`}>
          <h3 className="font-medium text-sm mt-1 mb-2 line-clamp-2 group-hover:text-slate-600 transition-colors">
            {title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-semibold">
            {formatCurrency(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through">
              {formatCurrency(price)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={onAddToCart}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
