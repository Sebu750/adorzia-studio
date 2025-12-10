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
    { label: "Submissions", value: stats.submission, icon: FileText },
    { label: "Sampling", value: stats.sampling, icon: Beaker },
    { label: "Tech Packs", value: stats.techpack, icon: FileSpreadsheet },
    { label: "Pre-Production", value: stats.preproduction, icon: Factory },
    { label: "Marketplace", value: stats.marketplace, icon: Store },
  ];

  return (
    <div className="space-y-4">
      {/* Queue Counts */}
      <div className="grid grid-cols-5 gap-3">
        {queueStats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border bg-card">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{stats.urgent}</p>
              <p className="text-xs text-muted-foreground">Urgent Items</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{stats.avgWaitTime}</p>
              <p className="text-xs text-muted-foreground">Avg. Wait Time</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{stats.completedToday}</p>
              <p className="text-xs text-muted-foreground">Completed Today</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
