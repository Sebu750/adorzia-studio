import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Shield, 
  Lock, 
  FileWarning, 
  Eye, 
  UserPlus, 
  ShieldAlert, 
  ShieldCheck,
  History,
  Search,
  RefreshCw,
  Ban,
  Mail,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const AdminSecurity = () => {
  const { user: currentUser, isSuperadmin } = useAdminAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("roles");
  const [admins, setAdmins] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Invite functionality - MVP: Only superadmin role
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    name: "",
    message: ""
  });
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    if (activeTab === "roles") {
      await fetchAdmins();
    } else {
      await fetchLogs();
    }
    setIsLoading(false);
  };

  const fetchAdmins = async () => {
    // Fetch from the isolated admin_profiles table
    // MVP: Only superadmin role
    const { data, error } = await supabase
      .from('admin_profiles')
      .select(`
        user_id,
        name,
        email,
        created_at,
        user_roles!inner (
          role
        )
      `)
      .eq('user_roles.role', 'superadmin');

    if (error) {
      // Fallback: If admin_profiles hasn't been fully populated yet, check user_roles
      // MVP: Only superadmin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          created_at,
          profiles (
            name,
            email
          )
        `)
        .eq('role', 'superadmin');
      
      if (!roleError) {
        setAdmins(roleData.map(r => ({
          user_id: r.user_id,
          name: r.profiles?.name || "Pending",
          email: r.profiles?.email || "Pending",
          role: r.role,
          created_at: r.created_at
        })) || []);
      }
    } else {
      setAdmins(data.map(a => ({
        user_id: a.user_id,
        name: a.name,
        email: a.email,
        role: a.user_roles[0]?.role,
        created_at: a.created_at
      })) || []);
    }
  };

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('auth_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      toast({ title: "Error fetching logs", description: error.message, variant: "destructive" });
    } else {
      setLogs(data || []);
    }
  };

  const handleInviteAdmin = async () => {
    if (!isSuperadmin) return;
    
    if (!inviteData.email || !inviteData.name) {
      toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    setIsSendingInvite(true);
    setInviteStatus("sending");

    try {
      // 1. Create invitation record - MVP: Always superadmin role
      const { data: invitation, error: inviteError } = await supabase
        .from('admin_invitations')
        .insert({
          email: inviteData.email,
          name: inviteData.name,
          role: 'superadmin',
          invited_by: currentUser?.id,
          message: inviteData.message || null,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .select()
        .single();

      if (inviteError) throw inviteError;

      // 2. Send invitation via edge function - MVP: Always superadmin
      const { error: sendError } = await supabase.functions.invoke('send-admin-invitation', {
        body: {
          invitationId: invitation.id,
          email: inviteData.email,
          name: inviteData.name,
          role: 'superadmin',
          message: inviteData.message,
          invitedByName: currentUser?.user_metadata?.name || 'System Administrator'
        }
      });

      if (sendError) throw sendError;

      // 3. Log the invitation
      await supabase.from('admin_logs').insert({
        admin_id: currentUser?.id,
        action: 'invite_admin',
        target_type: 'admin_invitation',
        target_id: invitation.id,
        details: { 
          email: inviteData.email, 
          name: inviteData.name, 
          role: 'superadmin'
        }
      });

      setInviteStatus("sent");
      toast({ 
        title: "Invitation Sent", 
        description: `Invitation sent to ${inviteData.email} for superadmin role.` 
      });
      
      // Reset form
      setInviteData({ email: "", name: "", message: "" });
      setTimeout(() => {
        setIsInviteDialogOpen(false);
        setInviteStatus("idle");
      }, 2000);

    } catch (error: any) {
      setInviteStatus("error");
      console.error("Invitation error:", error);
      
      // Provide helpful error message for common issues
      let errorMessage = error.message;
      if (error.message?.includes("admin_invitations") || error.message?.includes("invitation table")) {
        errorMessage = "The admin invitations table is not set up in the database. Please run the migration '20260201010000_admin_invitations.sql' in your Supabase project.";
      } else if (error.code === "42P01" || error.message?.includes("relation") || error.message?.includes("does not exist")) {
        errorMessage = "Database table missing. Please ensure all migrations have been applied to your Supabase project.";
      }
      
      toast({ title: "Invitation Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleRevokeAccess = async (userId: string, email: string) => {
    if (!isSuperadmin) return;

    try {
      // 1. Remove user roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) throw roleError;

      // 2. Remove from admin profiles
      await supabase
        .from('admin_profiles')
        .delete()
        .eq('user_id', userId);

      // 3. Log the revocation
      await supabase.from('admin_logs').insert({
        admin_id: currentUser?.id,
        action: 'revoke_access',
        target_type: 'admin_account',
        target_id: userId,
        details: { email }
      });

      toast({ title: "Access Revoked", description: `Access revoked for ${email}.` });
      fetchAdmins();
    } catch (error: any) {
      toast({ title: "Revocation Failed", description: error.message, variant: "destructive" });
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Security & Access</h1>
            <p className="text-muted-foreground">Manage administrative roles and monitor access logs</p>
          </div>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-2 py-1 px-3">
            <ShieldAlert className="h-4 w-4" />
            Super Admin Only
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-admin-muted/30 border border-admin-border p-1">
            <TabsTrigger value="roles" className="gap-2 data-[state=active]:bg-admin-card">
              <ShieldCheck className="h-4 w-4" />
              Role Management
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2 data-[state=active]:bg-admin-card">
              <History className="h-4 w-4" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="mt-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search admins..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={fetchAdmins} 
                  disabled={isLoading}
                >
                  <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
                {isSuperadmin && (
                  <Button 
                    onClick={() => setIsInviteDialogOpen(true)}
                    className="gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Invite Admin
                  </Button>
                )}
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : filteredAdmins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No administrators found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <TableRow key={admin.user_id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">{admin.name}</p>
                              <p className="text-xs text-muted-foreground">{admin.email}</p>
                            </div>
                            <Badge 
                              variant="wine"
                              className="bg-admin-wine text-admin-wine-foreground border-transparent"
                            >
                              Super Admin
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(admin.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRevokeAccess(admin.user_id, admin.email)}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No recent activity logs.
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={cn(
                              log.action.includes('failed') ? "bg-destructive/10 text-destructive border-destructive/20" : 
                              log.action.includes('success') ? "bg-success/10 text-success border-success/20" :
                              "bg-muted text-muted-foreground"
                            )}
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs truncate max-w-[120px]">
                          {log.user_id || 'anonymous'}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {JSON.stringify(log.metadata)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Invite Admin Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite New Administrator
            </DialogTitle>
            <DialogDescription>
              Send an invitation to join the admin team with specified role and permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-name">Full Name *</Label>
              <Input
                id="invite-name"
                value={inviteData.name}
                onChange={(e) => setInviteData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                disabled={isSendingInvite}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address *</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteData.email}
                onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@company.com"
                disabled={isSendingInvite}
              />
            </div>
            
            {/* MVP: All invitations are for superadmin role */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">Role: Superadmin</p>
              <p className="text-xs text-muted-foreground">
                Full system access and management capabilities
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invite-message">Personal Message (Optional)</Label>
              <Textarea
                id="invite-message"
                value={inviteData.message}
                onChange={(e) => setInviteData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Add a personal message to include in the invitation..."
                rows={3}
                disabled={isSendingInvite}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsInviteDialogOpen(false)}
              disabled={isSendingInvite}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleInviteAdmin}
              disabled={isSendingInvite || !inviteData.email || !inviteData.name}
              className={cn(
                "gap-2",
                inviteStatus === "sent" && "bg-success hover:bg-success/90",
                inviteStatus === "error" && "bg-destructive hover:bg-destructive/90"
              )}
            >
              {inviteStatus === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : inviteStatus === "sent" ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Sent!
                </>
              ) : inviteStatus === "error" ? (
                <>
                  <XCircle className="h-4 w-4" />
                  Retry
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminSecurity;
