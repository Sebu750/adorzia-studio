import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Beaker, 
  FileSpreadsheet, 
  Factory, 
  Store,
  Clock,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QueueStats {
  submission: number;
  sampling: number;
  techpack: number;
  preproduction: number;
  marketplace: number;
  urgent: number;
  avgWaitTime: string;
  completedToday: number;
}

interface QueueStatsHeaderProps {
  stats: QueueStats;
}

export function QueueStatsHeader({ stats }: QueueStatsHeaderProps) {
  const queueStats = [
    { label: "Submissions", value: stats.submission, icon: FileText, color: "text-blue-400" },
    { label: "Sampling", value: stats.sampling, icon: Beaker, color: "text-purple-400" },
    { label: "Tech Packs", value: stats.techpack, icon: FileSpreadsheet, color: "text-cyan-400" },
    { label: "Pre-Production", value: stats.preproduction, icon: Factory, color: "text-amber-400" },
    { label: "Marketplace", value: stats.marketplace, icon: Store, color: "text-green-400" },
  ];

  return (
    <div className="space-y-4">
      {/* Queue Counts */}
      <div className="grid grid-cols-5 gap-3">
        {queueStats.map((stat) => (
          <Card key={stat.label} className="border-admin-chocolate bg-admin-coffee/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
                <span className="text-2xl font-bold text-admin-wine-foreground">
                  {stat.value}
                </span>
              </div>
              <p className="text-xs text-admin-apricot/70 mt-2">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-admin-chocolate bg-admin-coffee/50">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-admin-wine-foreground">{stats.urgent}</p>
              <p className="text-xs text-admin-apricot/70">Urgent Items</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-admin-chocolate bg-admin-coffee/50">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-admin-wine-foreground">{stats.avgWaitTime}</p>
              <p className="text-xs text-admin-apricot/70">Avg. Wait Time</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-admin-chocolate bg-admin-coffee/50">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-admin-wine-foreground">{stats.completedToday}</p>
              <p className="text-xs text-admin-apricot/70">Completed Today</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
