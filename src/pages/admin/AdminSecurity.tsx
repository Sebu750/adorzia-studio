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
  MoreVertical,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  
  // Invite functionality
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    name: "",
    role: "admin" as "admin" | "superadmin",
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
      `);

    if (error) {
      // Fallback: If admin_profiles hasn't been fully populated yet, check user_roles
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
        .in('role', ['admin', 'superadmin']);
      
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

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'superadmin') => {
    if (!isSuperadmin) return;

    try {
      // 1. Update the role in user_roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (roleError) throw roleError;

      // 2. Log the administrative change
      await supabase.from('admin_logs').insert({
        admin_id: currentUser?.id,
        action: 'update_role',
        target_type: 'user_role',
        target_id: userId,
        details: { new_role: newRole }
      });

      toast({ title: "Role updated", description: `User is now a ${newRole}.` });
      fetchAdmins();
    } catch (error: any) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
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
      // 1. Create invitation record
      const { data: invitation, error: inviteError } = await supabase
        .from('admin_invitations')
        .insert({
          email: inviteData.email,
          name: inviteData.name,
          role: inviteData.role,
          invited_by: currentUser?.id,
          message: inviteData.message || null,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .select()
        .single();

      if (inviteError) throw inviteError;

      // 2. Send invitation via edge function
      const { error: sendError } = await supabase.functions.invoke('send-admin-invitation', {
        body: {
          invitationId: invitation.id,
          email: inviteData.email,
          name: inviteData.name,
          role: inviteData.role,
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
          role: inviteData.role 
        }
      });

      setInviteStatus("sent");
      toast({ 
        title: "Invitation Sent", 
        description: `Invitation sent to ${inviteData.email} for ${inviteData.role} role.` 
      });
      
      // Reset form
      setInviteData({ email: "", name: "", role: "admin", message: "" });
      setTimeout(() => {
        setIsInviteDialogOpen(false);
        setInviteStatus("idle");
      }, 2000);

    } catch (error: any) {
      setInviteStatus("error");
      toast({ title: "Invitation Failed", description: error.message, variant: "destructive" });
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
            Superadmin Access Only
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
                    <TableHead>Role</TableHead>
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
                          <div>
                            <p className="font-medium">{admin.name}</p>
                            <p className="text-xs text-muted-foreground">{admin.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={admin.role === 'superadmin' ? "wine" : "outline"}
                            className={cn(
                              admin.role === 'superadmin' 
                                ? "bg-admin-wine text-admin-wine-foreground border-transparent" 
                                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            )}
                          >
                            {admin.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(admin.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Manage Role</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                disabled={admin.role === 'superadmin'}
                                onClick={() => handleUpdateRole(admin.user_id, 'superadmin')}
                              >
                                <ShieldAlert className="h-4 w-4 mr-2 text-wine" />
                                Promote to Superadmin
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                disabled={admin.role === 'admin'}
                                onClick={() => handleUpdateRole(admin.user_id, 'admin')}
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Demote to Admin
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleRevokeAccess(admin.user_id, admin.email)}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Revoke Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
            
            <div className="space-y-2">
              <Label htmlFor="invite-role">Admin Role *</Label>
              <Select 
                value={inviteData.role} 
                onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value as "admin" | "superadmin" }))}
                disabled={isSendingInvite}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {inviteData.role === "superadmin" 
                  ? "Full system access and role management capabilities" 
                  : "Standard administrative access with limited role management"}
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
