import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Settings, 
  Send, 
  History, 
  AlertCircle,
  Loader2,
  RefreshCw,
  Users,
  User,
  Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminNotifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("broadcast");
  
  // Form states
  const [targetType, setTargetType] = useState<"all" | "individual">("all");
  const [targetUserId, setTargetUserId] = useState("");
  const [notificationType, setNotificationType] = useState("announcement");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch notification history
  const { data: history = [], isLoading: historyLoading, refetch: refetchHistory } = useQuery({
    queryKey: ['admin-notifications-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          profiles(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    }
  });

  const sendNotification = async () => {
    if (!message.trim()) {
      toast({ title: "Message required", variant: "destructive" });
      return;
    }

    if (targetType === "individual" && !targetUserId) {
      toast({ title: "Target user required", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('[AdminNotifications] Sending notification', { targetType, notificationType, recipientCount: targetType === 'all' ? 'broadcast' : 1 });
      
      if (targetType === "all") {
        // Use edge function for broadcast notifications (better performance)
        const { data, error } = await supabase.functions.invoke('broadcast-notification', {
          body: {
            type: notificationType,
            message,
            title: notificationType === 'announcement' ? 'Platform Announcement' : 'System Update'
          }
        });

        if (error) {
          console.error('[AdminNotifications] Broadcast failed:', error);
          throw error;
        }
        
        console.log('[AdminNotifications] Broadcast notification sent:', data);
      } else {
        // Targeted notification - direct insert
        const { error } = await supabase.from('notifications').insert({
          user_id: targetUserId,
          type: notificationType,
          message,
          status: 'unread',
          metadata: { sent_by: 'admin', sent_at: new Date().toISOString() }
        });
        if (error) {
          console.error('[AdminNotifications] Individual notification failed:', error);
          throw error;
        }
        console.log('[AdminNotifications] Individual notification sent to:', targetUserId);
      }

      toast({ title: "Notification sent successfully", description: targetType === 'all' ? 'Broadcast to all users' : 'Sent to selected user' });
      setMessage("");
      setTargetUserId("");
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-history'] });
    } catch (error: any) {
      console.error('[AdminNotifications] Send error:', error);
      toast({ title: "Failed to send notification", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground mt-1">Communicate with designers and manage system alerts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Send Form */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Compose
              </CardTitle>
              <CardDescription>Send a new system notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={targetType === "all" ? "default" : "outline"} 
                    className="gap-2"
                    onClick={() => setTargetType("all")}
                  >
                    <Users className="h-4 w-4" />
                    All Designers
                  </Button>
                  <Button 
                    variant={targetType === "individual" ? "default" : "outline"} 
                    className="gap-2"
                    onClick={() => setTargetType("individual")}
                  >
                    <User className="h-4 w-4" />
                    Individual
                  </Button>
                </div>
              </div>

              {targetType === "individual" && (
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input 
                    placeholder="Enter user UUID..." 
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Notification Type</Label>
                <Select value={notificationType} onValueChange={setNotificationType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="system">System Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea 
                  placeholder="Type your notification message here..." 
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <Button 
                className="w-full gap-2" 
                onClick={sendNotification}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Megaphone className="h-4 w-4" />
                )}
                Send Notification
              </Button>
            </CardContent>
          </Card>

          {/* History & Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="history">
              <TabsList>
                <TabsTrigger value="history" className="gap-2">
                  <History className="h-4 w-4" />
                  Recent History
                </TabsTrigger>
                <TabsTrigger value="templates" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Email Templates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Sent Notifications</CardTitle>
                      <CardDescription>Track recently delivered communications</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => refetchHistory()}>
                      <RefreshCw className={cn("h-4 w-4", historyLoading && "animate-spin")} />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historyLoading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto text-admin-wine" />
                            </TableCell>
                          </TableRow>
                        ) : history.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                              No notifications sent yet.
                            </TableCell>
                          </TableRow>
                        ) : (
                          history.map((notif: any) => (
                            <TableRow key={notif.id}>
                              <TableCell>
                                <p className="text-sm font-medium">{notif.profiles?.name || 'Unknown'}</p>
                                <p className="text-xs text-muted-foreground">{notif.profiles?.email || 'N/A'}</p>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">{notif.type}</Badge>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {notif.message}
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(notif.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge variant={notif.status === 'read' ? 'success' : 'outline'} className="capitalize">
                                  {notif.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="templates" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription>Configure system-generated emails</CardDescription>
                  </CardHeader>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Templates Module Coming Soon</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      We are currently integrating with the transactional email provider to allow direct template editing.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
