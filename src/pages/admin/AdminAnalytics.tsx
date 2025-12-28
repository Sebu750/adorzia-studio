import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, TrendingUp, Activity } from "lucide-react";

const AdminAnalytics = () => {
  const plannedFeatures = [
    { icon: TrendingUp, title: "Revenue Analytics", description: "Track revenue trends and financial performance" },
    { icon: PieChart, title: "User Analytics", description: "Analyze user behavior and engagement metrics" },
    { icon: Activity, title: "Platform Health", description: "Monitor system performance and uptime" },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <Card className="bg-admin-card border-admin-border">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-admin-muted flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-admin-foreground" />
            </div>
            <CardTitle className="text-2xl text-admin-foreground">Analytics</CardTitle>
            <Badge variant="outline" className="mx-auto mt-2 bg-warning/10 text-warning border-warning/20">
              Coming Soon
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-admin-muted-foreground">
              View comprehensive analytics and reports for platform performance.
            </p>
            
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-admin-foreground">Planned Features</h3>
              <div className="grid gap-3">
                {plannedFeatures.map((feature) => (
                  <div 
                    key={feature.title}
                    className="flex items-start gap-3 p-3 rounded-lg bg-admin-muted/50 border border-admin-border"
                  >
                    <div className="h-9 w-9 rounded-lg bg-admin-muted flex items-center justify-center shrink-0">
                      <feature.icon className="h-4 w-4 text-admin-foreground/70" />
                    </div>
                    <div>
                      <p className="font-medium text-admin-foreground">{feature.title}</p>
                      <p className="text-sm text-admin-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
