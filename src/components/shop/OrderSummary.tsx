import { Link } from "react-router-dom";
import { Package, Truck, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/marketplace-math";

interface CartItem {
  product_id: string;
  title: string;
  designer_name?: string;
  price: number;
  image: string | null;
  quantity: number;
  variant?: Record<string, string>;
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost?: number;
  discountAmount?: number;
  promoCode?: string | null;
  onApplyPromo?: (code: string) => void;
  onRemovePromo?: () => void;
  isApplyingPromo?: boolean;
  showPromoInput?: boolean;
  isCompact?: boolean;
}

export function OrderSummary({
  items,
  subtotal,
  shippingCost = 0,
  discountAmount = 0,
  promoCode,
  onApplyPromo,
  onRemovePromo,
  isApplyingPromo = false,
  showPromoInput = true,
  isCompact = false,
}: OrderSummaryProps) {
  const total = subtotal + shippingCost - discountAmount;
  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="bg-muted/30 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      {/* Items */}
      {!isCompact && (
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.product_id} className="flex gap-3">
              <div className="w-16 h-20 bg-white rounded overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                {item.designer_name && (
                  <p className="text-xs text-muted-foreground">{item.designer_name}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Qty: {item.quantity}
                </p>
                <p className="text-sm font-medium mt-1">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCompact && items.length > 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          {items.length} item{items.length !== 1 ? 's' : ''} in cart
        </p>
      )}

      <Separator className="my-4" />

      {/* Promo Code */}
      {showPromoInput && !promoCode && (
        <div className="mb-4">
          <div className="flex gap-2">
            <Input
              placeholder="Promo code"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onApplyPromo?.((e.target as HTMLInputElement).value);
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const input = document.querySelector('input[placeholder="Promo code"]') as HTMLInputElement;
                if (input?.value) {
                  onApplyPromo?.(input.value);
                }
              }}
              disabled={isApplyingPromo}
            >
              Apply
            </Button>
          </div>
        </div>
      )}

      {promoCode && (
        <div className="flex items-center justify-between mb-4 p-2 bg-green-50 rounded">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">{promoCode}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onRemovePromo}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Shipping
          </span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              formatCurrency(shippingCost)
            )}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <Separator className="my-2" />

        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {remainingForFreeShipping > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            Add {formatCurrency(remainingForFreeShipping)} more for free shipping!
          </p>
          <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-4">
        Taxes calculated at checkout
      </p>
    </div>
  );
}
