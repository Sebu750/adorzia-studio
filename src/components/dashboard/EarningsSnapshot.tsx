import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EarningsSnapshotProps {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayouts: number;
  productsSold: number;
  trend: number;
}

export function EarningsSnapshot({
  totalEarnings,
  monthlyEarnings,
  pendingPayouts,
  productsSold,
  trend,
}: EarningsSnapshotProps) {
  return (
    <Card className="overflow-hidden bg-gradient-dark border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-primary-foreground">
          <DollarSign className="h-5 w-5 text-accent" />
          Earnings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-primary-foreground/60 mb-1">This Month</p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-primary-foreground">
              ${monthlyEarnings.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-success text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>+{trend}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
            <p className="text-xs text-primary-foreground/60 mb-1">Total Earnings</p>
            <p className="font-display text-xl font-semibold text-primary-foreground">
              ${totalEarnings.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
            <p className="text-xs text-primary-foreground/60 mb-1">Pending</p>
            <p className="font-display text-xl font-semibold text-accent">
              ${pendingPayouts.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" />
            <span className="text-sm text-primary-foreground/80">Products Sold</span>
          </div>
          <span className="font-display text-xl font-semibold text-primary-foreground">
            {productsSold}
          </span>
        </div>

        <Button variant="accent" className="w-full gap-2 group">
          View Full Analytics
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </CardContent>
    </Card>
  );
}
