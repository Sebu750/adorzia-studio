import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  Send, 
  History, 
  AlertCircle,
  Loader2,
  RefreshCw,
  Users,
  User,
  Megaphone,
  Eye,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

// Broadcast Analytics Component
const BroadcastAnalytics = ({ message, createdAt }: { message: string; createdAt: string }) => {
  const { data: analytics } = useQuery({
    queryKey: ['broadcast-analytics', message, createdAt],
    queryFn: async () => {
      // Find all notifications with same message sent within 1 minute of createdAt
      const oneMinuteBefore = new Date(new Date(createdAt).getTime() - 60000).toISOString();
      const oneMinuteAfter = new Date(new Date(createdAt).getTime() + 60000).toISOString();
      
      const { data, error } = await supabase
        .from('notifications')
        .select('status')
        .eq('message', message)
        .gte('created_at', oneMinuteBefore)
        .lte('created_at', oneMinuteAfter);
      
      if (error) return { total: 0, read: 0 };
      
      const total = data?.length || 0;
      const read = data?.filter(n => n.status === 'read').length || 0;
      return { total, read };
    },
    enabled: !!message && !!createdAt,
  });

  const total = analytics?.total || 0;
  const read = analytics?.read || 0;
  const percentage = total > 0 ? Math.round((read / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-sm">
        <Eye className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{read}</span>
        <span className="text-muted-foreground">/</span>
        <span>{total}</span>
      </div>
      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{percentage}%</span>
    </div>
  );
};

// Email Templates Tab Component
const EmailTemplatesTab = () => {
  const { toast } = useToast();
  const [emailTemplate, setEmailTemplate] = useState<'welcome' | 'announcement' | 'alert' | 'custom'>('announcement');
  const [emailTarget, setEmailTarget] = useState<'individual' | 'all'>('all');
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const templatePresets = {
    welcome: { subject: 'Welcome to Adorzia!', content: 'We\'re thrilled to have you join our community of creative professionals. Get started by exploring your dashboard and setting up your profile.' },
    announcement: { subject: 'Platform Announcement', content: 'We have exciting news to share with you! Check out the latest updates and improvements we\'ve made to the platform.' },
    alert: { subject: 'Important Alert', content: 'Please be aware of an important update that may affect your account. Review the details below.' },
    custom: { subject: '', content: '' },
  };

  const handleTemplateChange = (template: typeof emailTemplate) => {
    setEmailTemplate(template);
    const preset = templatePresets[template];
    setEmailSubject(preset.subject);
    setEmailContent(preset.content);
  };

  const sendEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast({ title: "Subject and content required", variant: "destructive" });
      return;
    }

    if (emailTarget === 'individual' && !emailRecipient) {
      toast({ title: "Recipient email required", variant: "destructive" });
      return;
    }

    setIsSendingEmail(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-admin-email', {
        body: {
          template: emailTemplate,
          to: emailTarget === 'individual' ? emailRecipient : [],
          subject: emailSubject,
          content: emailContent,
          targetType: emailTarget,
        }
      });

      if (error) throw error;

      toast({ 
        title: "Email sent successfully", 
        description: `Sent to ${data.sent} recipients (${data.failed} failed)` 
      });
      
      setEmailRecipient('');
      if (emailTemplate === 'custom') {
        setEmailSubject('');
        setEmailContent('');
      }
    } catch (error: any) {
      console.error('[EmailTemplates] Send error:', error);
      toast({ title: "Failed to send email", description: error.message, variant: "destructive" });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Email
        </CardTitle>
        <CardDescription>Send branded emails to users using templates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={emailTemplate} onValueChange={(v) => handleTemplateChange(v as typeof emailTemplate)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Email</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="alert">Important Alert</SelectItem>
                  <SelectItem value="custom">Custom Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={emailTarget === "all" ? "default" : "outline"} 
                  className="gap-2"
                  onClick={() => setEmailTarget("all")}
                >
                  <Users className="h-4 w-4" />
                  All Users
                </Button>
                <Button 
                  variant={emailTarget === "individual" ? "default" : "outline"} 
                  className="gap-2"
                  onClick={() => setEmailTarget("individual")}
                >
                  <User className="h-4 w-4" />
                  Individual
                </Button>
              </div>
            </div>

            {emailTarget === 'individual' && (
              <div className="space-y-2">
                <Label>Recipient Email</Label>
                <Input 
                  placeholder="user@example.com" 
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  type="email"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input 
                placeholder="Email subject..." 
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea 
                placeholder="Email content..." 
                className="min-h-[200px]"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
            </div>

            <Button 
              className="w-full gap-2" 
              onClick={sendEmail}
              disabled={isSendingEmail}
            >
              {isSendingEmail ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {emailTarget === 'all' ? 'Send to All Users' : 'Send Email'}
            </Button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Recent Email Activity
          </h4>
          <EmailLogsTable />
        </div>
      </CardContent>
    </Card>
  );
};

// Email Logs Table Component
const EmailLogsTable = () => {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['admin-email-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .eq('subdomain', 'admin')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin mx-auto" />;
  }

  if (logs.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">No emails sent yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>To</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log: any) => (
          <TableRow key={log.id}>
            <TableCell className="text-sm">{log.to_address}</TableCell>
            <TableCell className="text-sm max-w-[200px] truncate">{log.subject}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">{log.email_type}</Badge>
            </TableCell>
            <TableCell>
              <Badge 
                variant={log.status === 'sent' ? 'success' : 'destructive'} 
                className="capitalize"
              >
                {log.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">
              {new Date(log.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const AdminNotifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("broadcast");
  
  // Form states
  const [targetType, setTargetType] = useState<"all" | "individual">("all");
  const [targetUserId, setTargetUserId] = useState("");
  const [notificationType, setNotificationType] = useState("submission");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch notification history - include broadcast notifications (metadata->broadcast = true)
  const { data: history = [], isLoading: historyLoading, refetch: refetchHistory } = useQuery({
    queryKey: ['admin-notifications-history'],
    queryFn: async () => {
      console.log('[AdminNotifications] Fetching history...');
      
      // First try without the join to see if that's the issue
      const { data: notifs, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      
      if (notifError) {
        console.error('[AdminNotifications] Query error:', notifError);
        throw notifError;
      }
      
      console.log('[AdminNotifications] Raw notifications:', notifs?.length || 0);
      
      // Fetch profiles separately for the notifications we have
      const userIds = [...new Set((notifs || []).map((n: any) => n.user_id).filter(Boolean))];
      let profilesMap: Record<string, any> = {};
      
      if (userIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('user_id, name, email')
          .in('user_id', userIds.slice(0, 100));
        
        if (!profileError && profiles) {
          profilesMap = profiles.reduce((acc: any, p: any) => {
            acc[p.user_id] = p;
            return acc;
          }, {});
        }
      }
      
      // Merge data
      const merged = (notifs || []).map((notif: any) => ({
        ...notif,
        profiles: profilesMap[notif.user_id] || null
      }));
      
      // Deduplicate broadcast notifications - show only one entry per broadcast
      const seenBroadcasts = new Set();
      const deduplicated = merged.filter((notif: any) => {
        if (notif.metadata?.broadcast) {
          const key = `${notif.message}-${notif.created_at}`;
          if (seenBroadcasts.has(key)) return false;
          seenBroadcasts.add(key);
          return true;
        }
        return true;
      });
      
      return deduplicated.slice(0, 50);
    }
  });

  const resolveUserId = async (input: string): Promise<string | null> => {
    // If input looks like a UUID, return it directly
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(input)) {
      return input;
    }
    
    // Otherwise, treat as email and look up user
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', input)
      .maybeSingle();
    
    if (error || !data) {
      return null;
    }
    return data.user_id;
  };

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
      
      // Resolve user ID if email was provided
      let resolvedUserId = targetUserId;
      if (targetType === "individual") {
        resolvedUserId = await resolveUserId(targetUserId);
        if (!resolvedUserId) {
          throw new Error('User not found. Please check the email or UUID.');
        }
      }
      
      if (targetType === "all") {
        // Fallback: Use direct database insert for broadcast (edge function may not be deployed)
        const title = notificationType === 'submission' ? 'Platform Announcement' : 
                      notificationType === 'earnings' ? 'Important Alert' :
                      notificationType === 'portfolio' ? 'Achievement Unlocked' :
                      'System Update';
        
        // Fetch all active users
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('user_id')
          .limit(1000);
        
        if (usersError) {
          console.error('[AdminNotifications] Error fetching users:', usersError);
          throw new Error('Failed to fetch users for broadcast');
        }
        
        if (!users || users.length === 0) {
          throw new Error('No users found to notify');
        }
        
        // Create notification records for all users
        const notifications = users.map(u => ({
          user_id: u.user_id,
          type: notificationType,
          message,
          status: 'unread' as const,
          metadata: {
            sent_by: 'admin',
            sent_at: new Date().toISOString(),
            broadcast: true,
            title: title
          }
        }));
        
        // Insert in batches of 100
        const batchSize = 100;
        let totalInserted = 0;
        for (let i = 0; i < notifications.length; i += batchSize) {
          const batch = notifications.slice(i, i + batchSize);
          const { error: insertError } = await supabase
            .from('notifications')
            .insert(batch);
          
          if (insertError) {
            console.error('[AdminNotifications] Batch insert error:', insertError);
            throw new Error(`Failed to send notifications: ${insertError.message}`);
          }
          totalInserted += batch.length;
        }
        
        console.log('[AdminNotifications] Broadcast notification sent:', totalInserted, 'users');
      } else {
        // Targeted notification - direct insert
        // Note: notifications table doesn't have a title column, so we include it in metadata
        const title = notificationType === 'submission' ? 'Platform Announcement' : 
                      notificationType === 'earnings' ? 'Important Alert' :
                      notificationType === 'portfolio' ? 'Achievement Unlocked' :
                      'System Update';
        
        const { error } = await supabase.from('notifications').insert({
          user_id: resolvedUserId,
          type: notificationType,
          message,
          status: 'unread',
          metadata: { sent_by: 'admin', sent_at: new Date().toISOString(), title: title }
        });
        if (error) {
          console.error('[AdminNotifications] Individual notification failed:', error);
          throw error;
        }
        console.log('[AdminNotifications] Individual notification sent to:', resolvedUserId);
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
                  <Label>User Email or UUID</Label>
                  <Input 
                    placeholder="Enter user email or UUID..." 
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can enter either an email address or a user UUID
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Notification Type</Label>
                <Select value={notificationType} onValueChange={setNotificationType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submission">Announcement</SelectItem>
                    <SelectItem value="earnings">Alert</SelectItem>
                    <SelectItem value="portfolio">Achievement</SelectItem>
                    <SelectItem value="marketplace">System Update</SelectItem>
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
                                {notif.metadata?.broadcast ? (
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">All Users (Broadcast)</span>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-sm font-medium">{notif.profiles?.name || 'Unknown'}</p>
                                    <p className="text-xs text-muted-foreground">{notif.profiles?.email || 'N/A'}</p>
                                  </>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {notif.type === 'submission' ? 'Announcement' :
                                   notif.type === 'earnings' ? 'Alert' :
                                   notif.type === 'portfolio' ? 'Achievement' :
                                   notif.type === 'marketplace' ? 'System' : notif.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {notif.message}
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(notif.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {notif.metadata?.broadcast ? (
                                  <BroadcastAnalytics message={notif.message} createdAt={notif.created_at} />
                                ) : (
                                  <Badge variant={notif.status === 'read' ? 'success' : 'outline'} className="capitalize">
                                    {notif.status}
                                  </Badge>
                                )}
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
                <EmailTemplatesTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
