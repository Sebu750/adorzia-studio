import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { WishlistItem } from "@/components/shop/WishlistItem";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

export default function ShopWishlist() {
  const { items, isLoading, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem(productId, 1);
    } catch (error) {
      // Error handled in cart hook
    }
  };

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {items.length} item{items.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/shop">
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Wishlist Items */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
                <div className="h-6 bg-slate-100 rounded animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <WishlistItem
                key={item.id}
                id={item.id}
                productId={item.product_id}
                title={item.title}
                price={item.price}
                salePrice={item.sale_price}
                images={item.images}
                designerId={item.designer_id}
                designerName={item.designer_name}
                brandName={item.brand_name}
                onRemove={() => removeFromWishlist(item.product_id)}
                onAddToCart={() => handleAddToCart(item.product_id)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Save your favorite items to your wishlist and they'll be here waiting for you.
            </p>
            <Button size="lg" asChild>
              <Link to="/shop">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Start Shopping
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </MarketplaceLayout>
  );
}
