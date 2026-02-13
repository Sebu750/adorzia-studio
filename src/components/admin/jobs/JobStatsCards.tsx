import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Clock, TrendingUp } from "lucide-react";

interface JobStatsCardsProps {
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    pendingReviews: number;
    hireRate: number;
  };
}

export function JobStatsCards({ stats }: JobStatsCardsProps) {
  const cards = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      subtitle: `${stats.activeJobs} active`,
      icon: Briefcase,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      subtitle: 'All time',
      icon: Users,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      subtitle: 'Awaiting action',
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    {
      title: 'Hire Rate',
      value: `${stats.hireRate}%`,
      subtitle: 'Successful hires',
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
