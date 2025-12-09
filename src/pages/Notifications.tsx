import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Box, 
  DollarSign, 
  Users, 
  CheckCircle,
  Clock,
  Sparkles,
  Settings,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "stylebox",
      title: "New Stylebox Released",
      message: "\"Winter Couture Masterclass\" is now available. This premium challenge has a $5,000 prize pool!",
      time: "2 hours ago",
      read: false,
      icon: Box,
    },
    {
      id: 2,
      type: "earnings",
      title: "You made a sale!",
      message: "Someone purchased your \"Urban Street Style Collection\" for $89.99",
      time: "5 hours ago",
      read: false,
      icon: DollarSign,
    },
    {
      id: 3,
      type: "portfolio",
      title: "Portfolio Approved",
      message: "Your project \"Minimalist Ring Collection\" has been approved for the marketplace!",
      time: "1 day ago",
      read: true,
      icon: CheckCircle,
    },
    {
      id: 4,
      type: "team",
      title: "Team Message",
      message: "Emma shared new sketches in Studio Collective team chat",
      time: "1 day ago",
      read: true,
      icon: Users,
    },
    {
      id: 5,
      type: "stylebox",
      title: "Stylebox Deadline Reminder",
      message: "\"Sustainable Resort Collection\" is due in 3 days. You're at 65% progress.",
      time: "2 days ago",
      read: true,
      icon: Clock,
    },
    {
      id: 6,
      type: "achievement",
      title: "Achievement Unlocked!",
      message: "You've earned the \"On Fire\" badge for maintaining a 10-day streak!",
      time: "3 days ago",
      read: true,
      icon: Sparkles,
    },
  ];

  const iconColors = {
    stylebox: "bg-accent/10 text-accent",
    earnings: "bg-success/10 text-success",
    portfolio: "bg-success/10 text-success",
    team: "bg-secondary text-muted-foreground",
    achievement: "bg-warning/10 text-warning",
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay updated on your design journey
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Check className="h-4 w-4" />
              Mark All Read
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              All
              <Badge variant="secondary" className="ml-1">6</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-2">
              Unread
              <Badge variant="accent" className="ml-1">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="styleboxes">Styleboxes</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card 
                  key={notification.id} 
                  className={cn(
                    "transition-all cursor-pointer hover:shadow-card-hover",
                    !notification.read && "bg-accent/5 border-accent/20"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                        iconColors[notification.type as keyof typeof iconColors]
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className={cn(
                              "font-medium",
                              !notification.read && "font-semibold"
                            )}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-accent shrink-0 mt-2" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {notifications.filter(n => !n.read).map((notification) => {
              const Icon = notification.icon;
              return (
                <Card 
                  key={notification.id} 
                  className="bg-accent/5 border-accent/20 transition-all cursor-pointer hover:shadow-card-hover"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                        iconColors[notification.type as keyof typeof iconColors]
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-accent shrink-0 mt-2" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="styleboxes" className="space-y-4">
            {notifications.filter(n => n.type === "stylebox").map((notification) => {
              const Icon = notification.icon;
              return (
                <Card 
                  key={notification.id} 
                  className={cn(
                    "transition-all cursor-pointer hover:shadow-card-hover",
                    !notification.read && "bg-accent/5 border-accent/20"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                        iconColors[notification.type as keyof typeof iconColors]
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn("font-medium", !notification.read && "font-semibold")}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            {notifications.filter(n => n.type === "earnings").map((notification) => {
              const Icon = notification.icon;
              return (
                <Card 
                  key={notification.id} 
                  className={cn(
                    "transition-all cursor-pointer hover:shadow-card-hover",
                    !notification.read && "bg-accent/5 border-accent/20"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                        iconColors[notification.type as keyof typeof iconColors]
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn("font-medium", !notification.read && "font-semibold")}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Notifications;
