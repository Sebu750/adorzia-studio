import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, Clock, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency } from "@/lib/marketplace-math";

export default function ShopOrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, isLoading } = useOrders();
  
  const order = orders?.find(o => o.id === orderId || o.order_number === orderId);

  if (isLoading) {
    return (
      <MarketplaceLayout>
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-16 w-16 bg-muted rounded-full mx-auto" />
              <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
              <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
            </div>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
            <p className="text-muted-foreground text-lg">
              Your order has been confirmed and is being processed.
            </p>
          </motion.div>

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Order Details Card */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Number</p>
                      <p className="text-xl font-bold">{order.order_number}</p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {order.status === 'confirmed' ? 'Confirmed' : order.status}
                    </Badge>
                  </div>

                  <Separator className="my-6" />

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold">Order Items</h3>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-20 bg-slate-50 rounded overflow-hidden flex-shrink-0">
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.product.title}</p>
                          {item.product.designer?.brand_name && (
                            <p className="text-sm text-muted-foreground">
                              {item.product.designer.brand_name}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Order Summary */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatCurrency(order.shipping_cost)}</span>
                    </div>
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(order.discount_amount)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What's Next */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">What's Next?</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Order Confirmation Email</p>
                        <p className="text-sm text-muted-foreground">
                          We've sent a confirmation email with your order details.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Production Begins</p>
                        <p className="text-sm text-muted-foreground">
                          Our designers will start crafting your items within 24-48 hours.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Shipping & Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          You'll receive tracking information once your order ships.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {order && (
              <Button variant="outline" size="lg" asChild>
                <Link to={`/shop/order/${order.order_number}`}>
                  Track Your Order
                </Link>
              </Button>
            )}
            <Button size="lg" asChild>
              <Link to="/shop">
                Continue Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Support */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            Have questions?{' '}
            <Link to="/shop/faq" className="text-primary hover:underline">
              Check our FAQ
            </Link>{' '}
            or{' '}
            <a href="mailto:support@adorzia.com" className="text-primary hover:underline">
              contact support
            </a>
          </motion.p>
        </div>
      </div>
    </MarketplaceLayout>
  );
}
