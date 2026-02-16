import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { useCart } from "@/hooks/useCart";

export default function ShopCheckout() {
  const navigate = useNavigate();
  const { cart, itemCount } = useCart();
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  // Redirect if cart is empty
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <MarketplaceLayout>
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Your bag is empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your bag before checking out.
            </p>
            <Button size="lg" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  const handleCheckoutComplete = (orderId: string) => {
    setCompletedOrderId(orderId);
    navigate(`/shop/order-confirmation/${orderId}`);
  };

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/shop/cart" className="flex items-center hover:text-black transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-black font-medium">Checkout</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">
            Complete your purchase securely
          </p>
        </div>

        {/* Security Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-6 mb-8 p-4 bg-green-50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">SSL Encrypted</span>
          </div>
          <span className="text-sm text-green-700">
            {itemCount} item{itemCount !== 1 ? 's' : ''} in your bag
          </span>
        </motion.div>

        {/* Checkout Form */}
        <CheckoutForm onComplete={handleCheckoutComplete} />
      </div>
    </MarketplaceLayout>
  );
}
