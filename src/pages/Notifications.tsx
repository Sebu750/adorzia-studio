import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Bell, 
  Box, 
  DollarSign, 
  Users, 
  CheckCircle,
  Clock,
  Sparkles,
  Settings,
  Check,
  Inbox
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const iconMap: Record<string, any> = {
    stylebox: Box,
    earnings: DollarSign,
    portfolio: CheckCircle,
    team: Users,
    achievement: Sparkles,
    deadline: Clock,
  };

  const iconColors: Record<string, string> = {
    stylebox: "bg-accent/10 text-accent",
    earnings: "bg-success/10 text-success",
    portfolio: "bg-success/10 text-success",
    team: "bg-secondary text-muted-foreground",
    achievement: "bg-warning/10 text-warning",
    deadline: "bg-warning/10 text-warning",
  };

  const renderNotificationCard = (notification: any) => {
    const Icon = iconMap[notification.type] || Bell;
    const isUnread = notification.status === "unread";
    const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

    return (
      <Card 
        key={notification.id} 
        className={cn(
          "transition-all cursor-pointer hover:shadow-card-hover",
          isUnread && "bg-accent/5 border-accent/20"
        )}
        onClick={() => isUnread && markAsRead(notification.id)}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
              iconColors[notification.type] || "bg-secondary text-muted-foreground"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className={cn(
                    "font-medium",
                    isUnread && "font-semibold"
                  )}>
                    {getNotificationTitle(notification.type)}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
                {isUnread && (
                  <div className="h-2 w-2 rounded-full bg-accent shrink-0 mt-2" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{timeAgo}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const filterNotifications = (type?: string) => {
    if (!type || type === "all") return notifications;
    if (type === "unread") return notifications.filter(n => n.status === "unread");
    return notifications.filter(n => n.type === type);
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-medium mb-1">No notifications</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

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
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
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
              <Badge variant="secondary" className="ml-1">{notifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-2">
              Unread
              <Badge variant="accent" className="ml-1">{unreadCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="stylebox">Styleboxes</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.length === 0 ? (
              <EmptyState message="You're all caught up! New notifications will appear here." />
            ) : (
              notifications.map(renderNotificationCard)
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {unreadCount === 0 ? (
              <EmptyState message="No unread notifications. Great job staying on top of things!" />
            ) : (
              filterNotifications("unread").map(renderNotificationCard)
            )}
          </TabsContent>

          <TabsContent value="stylebox" className="space-y-4">
            {filterNotifications("stylebox").length === 0 ? (
              <EmptyState message="No stylebox notifications yet." />
            ) : (
              filterNotifications("stylebox").map(renderNotificationCard)
            )}
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            {filterNotifications("earnings").length === 0 ? (
              <EmptyState message="No earnings notifications yet. Start selling to receive updates!" />
            ) : (
              filterNotifications("earnings").map(renderNotificationCard)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

function getNotificationTitle(type: string): string {
  const titles: Record<string, string> = {
    stylebox: "Stylebox Update",
    earnings: "Earnings Update",
    portfolio: "Portfolio Update",
    team: "Team Activity",
    achievement: "Achievement Unlocked!",
    deadline: "Deadline Reminder",
  };
  return titles[type] || "Notification";
}

export default Notifications;
