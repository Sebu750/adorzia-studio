import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Package, Truck, CheckCircle, Clock, MapPin, 
  Calendar, User, Mail, Phone, ChevronLeft, Download
} from "lucide-react";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/marketplace-math";

/**
 * FR 1.5: Order Tracking - Customer interface for order status
 * Tracks progression: Confirmed → Sampling/Production → Quality Check → Shipping → Delivered
 */

interface OrderStatus {
  status: 'confirmed' | 'sampling' | 'production' | 'quality_check' | 'shipping' | 'delivered' | 'cancelled';
  label: string;
  description: string;
  icon: typeof Package;
  color: string;
}

const ORDER_STATUSES: Record<string, OrderStatus> = {
  confirmed: {
    status: 'confirmed',
    label: 'Order Confirmed',
    description: 'Your order has been received and payment confirmed',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  sampling: {
    status: 'sampling',
    label: 'Sampling',
    description: 'Designer is creating samples for your order',
    icon: Clock,
    color: 'text-blue-600',
  },
  production: {
    status: 'production',
    label: 'In Production',
    description: 'Your items are being crafted by our artisans',
    icon: Package,
    color: 'text-purple-600',
  },
  quality_check: {
    status: 'quality_check',
    label: 'Quality Check',
    description: 'Final inspection to ensure luxury standards',
    icon: CheckCircle,
    color: 'text-orange-600',
  },
  shipping: {
    status: 'shipping',
    label: 'Shipped',
    description: 'Your order is on its way',
    icon: Truck,
    color: 'text-indigo-600',
  },
  delivered: {
    status: 'delivered',
    label: 'Delivered',
    description: 'Order successfully delivered',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  cancelled: {
    status: 'cancelled',
    label: 'Cancelled',
    description: 'This order has been cancelled',
    icon: Clock,
    color: 'text-red-600',
  },
};

const STATUS_PROGRESSION = [
  'confirmed',
  'sampling',
  'production',
  'quality_check',
  'shipping',
  'delivered',
];

export default function ShopOrderTracking() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-tracking', orderNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_orders')
        .select(`
          *,
          marketplace_order_items (
            *,
            product:marketplace_products (
              id,
              title,
              images
            )
          )
        `)
        .eq('order_number', orderNumber)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!orderNumber,
  });

  if (isLoading) {
    return (
      <MarketplaceLayout>
        <div className="container py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-64 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  if (!order) {
    return (
      <MarketplaceLayout>
        <div className="container py-16 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find an order with number {orderNumber}
          </p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </MarketplaceLayout>
    );
  }

  const currentStatus = order.status as string;
  const currentStatusIndex = STATUS_PROGRESSION.indexOf(currentStatus);
  const StatusIcon = ORDER_STATUSES[currentStatus]?.icon || Package;

  return (
    <MarketplaceLayout>
      <div className="container py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/shop">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 ${ORDER_STATUSES[currentStatus]?.color}`} />
                {ORDER_STATUSES[currentStatus]?.label}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {ORDER_STATUSES[currentStatus]?.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Progress Bar */}
                <div className="flex justify-between items-start mb-8">
                  {STATUS_PROGRESSION.map((status, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const StatusIcon = ORDER_STATUSES[status].icon;

                    return (
                      <div key={status} className="flex-1 flex flex-col items-center relative">
                        <motion.div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 ${
                            isCompleted
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'bg-background border-muted text-muted-foreground'
                          }`}
                          initial={false}
                          animate={{
                            scale: isCurrent ? 1.1 : 1,
                          }}
                        >
                          <StatusIcon className="h-6 w-6" />
                        </motion.div>
                        <p className={`text-xs mt-2 text-center ${
                          isCompleted ? 'font-medium' : 'text-muted-foreground'
                        }`}>
                          {ORDER_STATUSES[status].label}
                        </p>
                        {index < STATUS_PROGRESSION.length - 1 && (
                          <div
                            className={`absolute left-1/2 top-6 w-full h-0.5 -z-10 ${
                              index < currentStatusIndex ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.marketplace_order_items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product?.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                      <p className="text-sm font-medium">
                        {formatCurrency(item.total_price)}
                      </p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatCurrency(order.shipping_cost)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount_amount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Payment */}
            <div className="space-y-4">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p className="font-medium">{order.shipping_address?.name}</p>
                  <p>{order.shipping_address?.line1}</p>
                  {order.shipping_address?.line2 && <p>{order.shipping_address.line2}</p>}
                  <p>
                    {order.shipping_address?.city}, {order.shipping_address?.state}{' '}
                    {order.shipping_address?.postal_code}
                  </p>
                  <p>{order.shipping_address?.country}</p>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                      {order.payment_status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Method</span>
                    <span className="text-sm capitalize">{order.payment_method}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Number */}
              {order.tracking_number && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-mono text-sm">{order.tracking_number}</p>
                    {order.tracking_url && (
                      <Button variant="link" className="px-0 mt-2" asChild>
                        <a href={order.tracking_url} target="_blank" rel="noopener noreferrer">
                          Track Package
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
