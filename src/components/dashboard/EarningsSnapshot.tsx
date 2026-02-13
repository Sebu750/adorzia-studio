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
    <Card 
      className="overflow-hidden bg-gradient-dark border-0 shadow-xl"
      role="region"
      aria-labelledby="earnings-title"
    >
      <CardHeader className="pb-4 border-b border-primary-foreground/10">
        <CardTitle id="earnings-title" className="flex items-center gap-2.5 text-lg text-primary-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/10">
            <DollarSign className="h-4 w-4 text-primary-foreground" />
          </div>
          Earnings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 sm:p-6 space-y-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/50 mb-1.5">This Month</p>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground tabular-nums">
              ${monthlyEarnings.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-success text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>+{trend}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 transition-all duration-200 hover:bg-primary-foreground/10">
            <p className="text-xs text-primary-foreground/50 mb-1">Total Earnings</p>
            <p className="font-display text-xl font-semibold text-primary-foreground tabular-nums">
              ${totalEarnings.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 transition-all duration-200 hover:bg-primary-foreground/10">
            <p className="text-xs text-primary-foreground/50 mb-1">Pending</p>
            <p className="font-display text-xl font-semibold text-primary-foreground/80 tabular-nums">
              ${pendingPayouts.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/10">
          <div className="flex items-center gap-2.5">
            <Package className="h-5 w-5 text-primary-foreground/70" />
            <span className="text-sm text-primary-foreground/70">Products Sold</span>
          </div>
          <span className="font-display text-xl font-semibold text-primary-foreground tabular-nums">
            {productsSold}
          </span>
        </div>

        <Button 
          variant="secondary" 
          className="w-full gap-2 group btn-press bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
        >
          View Full Analytics
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </CardContent>
    </Card>
  );
}