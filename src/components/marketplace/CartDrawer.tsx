import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, X, Trash2, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/marketplace-math";

interface CartDrawerProps {
  onClose: () => void;
}

export function CartDrawer({ onClose }: CartDrawerProps) {
  const { cart, itemCount, isLoading, updateQuantity, removeItem } = useCart();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-editorial-title text-xl">Your Bag</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-display mb-2">Your bag is empty</h3>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Looks like you haven't added any items yet. Start shopping to discover beautiful pieces.
          </p>
          <Button onClick={onClose} asChild size="lg">
            <Link to="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = cart.subtotal || 0;
  const freeShippingThreshold = 200;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-editorial-title text-xl">Your Bag</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Free Shipping Progress */}
      {remainingForFreeShipping > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-muted/30 border-b"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{formatCurrency(remainingForFreeShipping)}</span> more for free shipping
            </p>
            <Sparkles className="h-4 w-4 text-foreground" />
          </div>
          <div className="w-full bg-border rounded-full h-1.5">
            <motion.div 
              className="bg-foreground h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {remainingForFreeShipping <= 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border-b"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-700 font-medium">
              Congratulations! You qualify for free shipping.
            </p>
          </div>
        </motion.div>
      )}

      {/* Cart Items */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          <AnimatePresence>
            {cart.items.map((item: any, index: number) => (
              <motion.div
                key={`${item.product_id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-4 border rounded-sm hover:bg-muted/30 transition-colors"
              >
                {/* Product Image */}
                <div className="w-24 h-32 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  {item.designer_name && (
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      {item.designer_name}
                    </p>
                  )}
                  <h4 className="font-display text-base mb-2 line-clamp-2">{item.title}</h4>
                  
                  {item.variant && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Object.entries(item.variant).map(([key, value]) => (
                        <div key={key} className="text-xs bg-muted/50 px-2 py-1 rounded-sm">
                          {key}: {value}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="font-display text-lg mb-4">
                    {formatCurrency(item.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-none"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-none"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.product_id, item.variant)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right min-w-fit">
                  <p className="font-display text-lg">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-6 border-t space-y-4">
        <div className="flex items-center justify-between text-base">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-display text-xl">{formatCurrency(subtotal)}</span>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Shipping & taxes calculated at checkout
        </p>
        
        <div className="grid gap-3">
          <Button asChild className="h-14 text-base" onClick={onClose}>
            <Link to="/shop/checkout">
              Proceed to Checkout
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-12 text-base" onClick={onClose}>
            <Link to="/shop/cart">View Full Bag</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
