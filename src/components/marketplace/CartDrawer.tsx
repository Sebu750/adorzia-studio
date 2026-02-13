import { Link } from "react-router-dom";
import { ShoppingBag, Minus, Plus, X, Trash2 } from "lucide-react";
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
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-lg font-semibold">Shopping Bag</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">Your bag is empty</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Looks like you haven't added any items yet.
          </p>
          <Button onClick={onClose} asChild>
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
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-lg font-semibold">Shopping Bag ({itemCount})</h2>
      </div>

      {/* Free Shipping Progress */}
      {remainingForFreeShipping > 0 && (
        <div className="py-3 px-4 bg-muted/50 my-4 rounded-lg">
          <p className="text-sm text-center">
            Add <span className="font-semibold">{formatCurrency(remainingForFreeShipping)}</span> more for free shipping!
          </p>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Cart Items */}
      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="space-y-4 py-4">
          {cart.items.map((item: any, index: number) => (
            <div key={`${item.product_id}-${index}`} className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
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
                  <p className="text-[10px] font-bold uppercase tracking-wider text-black mb-0.5">
                    {item.designer_name}
                  </p>
                )}
                <h4 className="font-medium text-sm truncate">{item.title}</h4>
                {item.variant && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {Object.entries(item.variant).map(([key, value]) => `${key}: ${value}`).join(', ')}
                  </p>
                )}
                <p className="font-semibold text-sm mt-1">{formatCurrency(item.price)}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.product_id, item.variant)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="font-semibold text-sm">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="pt-4 border-t space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Shipping & taxes calculated at checkout
        </p>
        <div className="grid gap-2">
          <Button asChild className="w-full" onClick={onClose}>
            <Link to="/shop/checkout">Checkout</Link>
          </Button>
          <Button variant="outline" asChild className="w-full" onClick={onClose}>
            <Link to="/shop/cart">View Bag</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
