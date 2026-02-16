import { Link } from "react-router-dom";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/marketplace-math";

export default function ShopCart() {
  const { cart, itemCount, isLoading, updateQuantity, removeItem, clearCart } = useCart();

  if (isLoading) {
    return (
      <MarketplaceLayout>
        <div className="container py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <MarketplaceLayout>
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your bag is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your bag yet.
              Start shopping to find something you'll love!
            </p>
            <Button size="lg" asChild>
              <Link to="/shop">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  const subtotal = cart.subtotal || 0;
  const freeShippingThreshold = 200;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;
  const estimatedShipping = subtotal >= freeShippingThreshold ? 0 : 10;
  const estimatedTotal = subtotal + estimatedShipping;

  return (
    <MarketplaceLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Bag ({itemCount})</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Progress */}
            {remainingForFreeShipping > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-center mb-2">
                  Add <span className="font-semibold">{formatCurrency(remainingForFreeShipping)}</span> more for free shipping!
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="space-y-4">
              {cart.items.map((item: any, index: number) => (
                <div key={`${item.product_id}-${index}`} className="flex gap-4 p-4 border rounded-lg">
                  {/* Product Image */}
                  <Link 
                    to={`/shop/product/${item.product_id}`}
                    className="w-24 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0"
                  >
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
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
<<<<<<< HEAD
                    {item.designer_name && (
                      <p className="text-[11px] font-bold uppercase tracking-widest text-black mb-1">
                        {item.designer_name}
                      </p>
                    )}
                    <Link to={`/shop/product/${item.product_id}`}>
                      <h3 className="font-medium hover:text-primary transition-colors text-[14px]">
=======
                    <Link to={`/shop/product/${item.product_id}`}>
                      <h3 className="font-medium hover:text-primary transition-colors">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                        {item.title}
                      </h3>
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {Object.entries(item.variant).map(([key, value]) => `${key}: ${value}`).join(', ')}
                      </p>
                    )}
                    <p className="font-semibold mt-2">{formatCurrency(item.price)}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.product_id, item.variant)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart */}
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => clearCart()}>
                Clear Bag
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-muted/30 rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {estimatedShipping === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      formatCurrency(estimatedShipping)
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Estimated Total</span>
                  <span>{formatCurrency(estimatedTotal)}</span>
                </div>
              </div>

              <Button className="w-full mt-6" size="lg" asChild>
                <Link to="/shop/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Taxes calculated at checkout
              </p>

              <Separator className="my-6" />

              <div className="text-center">
                <Link to="/shop" className="text-sm text-primary hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
