import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ChevronRight, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/marketplace-math";

interface OrderHistoryItemProps {
  order: {
    id: string;
    order_number: string;
    status: string;
    payment_status: string;
    total: number;
    created_at: string;
    items: Array<{
      id: string;
      product: {
        id: string;
        title: string;
        images: string[];
        designer?: {
          brand_name: string;
        };
      };
      quantity: number;
    }>;
  };
  index?: number;
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Package; color: string; bgColor: string }> = {
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  sampling: {
    label: 'Sampling',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  production: {
    label: 'In Production',
    icon: Package,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  quality_check: {
    label: 'Quality Check',
    icon: CheckCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  shipping: {
    label: 'Shipped',
    icon: Truck,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  cancelled: {
    label: 'Cancelled',
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
};

export function OrderHistoryItem({ order, index = 0 }: OrderHistoryItemProps) {
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-slate-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">Order #{order.order_number}</h3>
            <div className={`flex items-center gap-1 px-2 py-1 rounded ${statusConfig.bgColor}`}>
              <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
              <span className={`text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold">{formatCurrency(order.total)}</span>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/shop/order/${order.order_number}`}>
              Track
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Items */}
      <div className="p-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {order.items.slice(0, 4).map((item) => (
            <div key={item.id} className="flex-shrink-0">
              <Link to={`/shop/product/${item.product.id}`}>
                <div className="w-20 h-24 bg-slate-50 rounded overflow-hidden">
                  {item.product.images && item.product.images.length > 0 ? (
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
              </Link>
              {item.quantity > 1 && (
                <div className="mt-1 text-center">
                  <Badge variant="secondary" className="text-xs">
                    x{item.quantity}
                  </Badge>
                </div>
              )}
            </div>
          ))}
          {order.items.length > 4 && (
            <div className="flex-shrink-0 w-20 h-24 bg-slate-50 rounded flex items-center justify-center">
              <span className="text-sm text-slate-500">+{order.items.length - 4}</span>
            </div>
          )}
        </div>

        {order.items.length === 1 && (
          <div className="mt-3">
            <p className="text-sm font-medium">{order.items[0].product.title}</p>
            {order.items[0].product.designer?.brand_name && (
              <p className="text-xs text-slate-500">
                {order.items[0].product.designer.brand_name}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
