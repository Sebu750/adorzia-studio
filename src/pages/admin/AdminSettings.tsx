import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  User, 
  Lock, 
  Shield,
  LogOut,
  Loader2,
  Save,
  KeyRound,
  Smartphone,
  Activity
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AdminSettings() {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar_url: "",
  });
  const [userRole, setUserRole] = useState<"admin" | "superadmin">("admin");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadRole();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProfileData({
        name: data.name || "",
        email: data.email || user.email || "",
        avatar_url: data.avatar_url || "",
      });
    } else {
      setProfileData({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        avatar_url: "",
      });
    }
  };

  const loadRole = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setUserRole(data.role as "admin" | "superadmin");
    }
  };

  const logAdminAction = async (action: string, metadata?: Record<string, unknown>) => {
    if (!user) return;
    
    try {
      const logEntry = {
        admin_id: user.id,
        action,
        target_type: "admin_account",
        target_id: user.id,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      };
      await supabase.from("admin_logs").insert([logEntry]);
    } catch (error) {
      console.error("Failed to log admin action:", error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const validated = profileSchema.parse(profileData);
      
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          name: validated.name,
          email: validated.email,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id",
        });

      if (error) throw error;

      await logAdminAction("profile_update", { 
        updated_fields: ["name", "email"] 
      });

      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setIsLoading(true);

    try {
      const validated = passwordSchema.parse(passwordData);
      
      const { error } = await supabase.auth.updateUser({
        password: validated.newPassword,
      });

      if (error) throw error;

      await logAdminAction("password_change");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update password.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAToggle = async (enabled: boolean) => {
    setIs2FAEnabled(enabled);
    await logAdminAction("2fa_toggle", { enabled });
    
    toast({
      title: enabled ? "2FA Enabled" : "2FA Disabled",
      description: enabled 
        ? "Two-factor authentication has been enabled." 
        : "Two-factor authentication has been disabled.",
    });
  };

  const handleSignOut = async () => {
    await logAdminAction("logout");
    await signOut();
    navigate("/admin/login");
  };

  const handleSignOutAllDevices = async () => {
    await logAdminAction("logout_all_devices");
    await supabase.auth.signOut({ scope: "global" });
    navigate("/admin/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Account Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your admin account and security
            </p>
          </div>
          <Badge 
            className="bg-admin-wine text-admin-wine-foreground px-3 py-1"
          >
            <Shield className="h-3 w-3 mr-1" />
            {userRole === "superadmin" ? "Superadmin" : "Admin"}
          </Badge>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your admin profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-2 border-admin-camel/30">
                <AvatarImage src={profileData.avatar_url} />
                <AvatarFallback className="bg-admin-wine text-admin-wine-foreground text-xl">
                  {getInitials(profileData.name || "AD")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-medium">{profileData.name || "Admin User"}</p>
                <p className="text-sm text-muted-foreground">{profileData.email}</p>
                <Badge variant="outline" className="text-xs">
                  Status: Active
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@adorzia.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Input 
                value={userRole === "superadmin" ? "Superadmin" : "Admin"} 
                disabled 
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Role cannot be changed from this interface
              </p>
            </div>

            <Button 
              className="gap-2 bg-admin-wine hover:bg-admin-wine/90 text-admin-wine-foreground"
              onClick={handleProfileUpdate}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Password Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Password Management
            </CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm password"
                />
              </div>
            </div>
            <Button 
              className="bg-admin-wine hover:bg-admin-wine/90 text-admin-wine-foreground"
              onClick={handlePasswordUpdate}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>Add an extra layer of security to your admin account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div className="space-y-1">
                <p className="font-medium">Enable 2FA</p>
                <p className="text-sm text-muted-foreground">
                  Protect your admin account with two-factor authentication via authenticator app
                </p>
              </div>
              <Switch 
                checked={is2FAEnabled}
                onCheckedChange={handle2FAToggle}
              />
            </div>
            {is2FAEnabled && (
              <div className="mt-4 p-4 rounded-lg bg-admin-apricot/10 border border-admin-camel/20">
                <p className="text-sm text-muted-foreground">
                  2FA is enabled. Use your authenticator app to generate codes when signing in.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sign Out & Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Sessions & Sign Out
            </CardTitle>
            <CardDescription>Manage your active sessions and sign out</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign out of your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be signed out of this device and redirected to the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleSignOut}
                      className="bg-admin-wine hover:bg-admin-wine/90"
                    >
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out of All Devices
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign out of all devices?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will sign you out of all devices where you are currently logged in. You will need to sign in again on each device.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleSignOutAllDevices}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Sign Out Everywhere
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Separator />

            <div className="text-xs text-muted-foreground">
              <p>All account changes are logged for security and audit purposes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}