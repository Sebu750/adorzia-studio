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
<<<<<<< HEAD
  Activity,
  Camera,
  X
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
=======
  Activity
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
<<<<<<< HEAD
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
=======
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AdminSettings() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const { user, signOut, isAdmin, isSuperadmin } = useAdminAuth();
=======
  const { user, signOut, isAdmin } = useAdminAuth();
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar_url: "",
  });
<<<<<<< HEAD
=======
  const [userRole, setUserRole] = useState<"admin" | "superadmin">("admin");
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
<<<<<<< HEAD
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

  useEffect(() => {
    if (user) {
      loadProfile();
<<<<<<< HEAD
=======
      loadRole();
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
<<<<<<< HEAD
    // Check admin_profiles FIRST
    const { data } = await supabase
      .from("admin_profiles")
=======
    const { data } = await supabase
      .from("profiles")
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
      // Fallback to legacy profiles table
      const { data: legacyData } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (legacyData) {
        setProfileData({
          name: legacyData.name || "",
          email: legacyData.email || user.email || "",
          avatar_url: legacyData.avatar_url || "",
        });
      } else {
        setProfileData({
          name: user.user_metadata?.name || "",
          email: user.email || "",
          avatar_url: "",
        });
      }
=======
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
      // Silently fail logging errors in production
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) {
      console.error('No file selected or no user logged in');
      return;
    }

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, WebP).",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `admin-avatars/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('admin-assets')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('admin-assets')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      setProfileData(prev => ({ ...prev, avatar_url: publicUrl }));

      // Auto-save the avatar change
      const { data: updateData, error: updateError } = await supabase.functions.invoke('manage-admin', {
        body: { 
          action: 'update_auth', 
          targetUserId: user.id, 
          avatar_url: publicUrl
        }
      });
      
      if (updateError) {
        console.error('Edge function error:', updateError);
        throw new Error(updateError.message || 'Failed to save avatar URL');
      }
      
      console.log('Avatar update response:', updateData);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    
    setProfileData(prev => ({ ...prev, avatar_url: "" }));
    
    try {
      const { error } = await supabase.functions.invoke('manage-admin', {
        body: { 
          action: 'update_auth', 
          targetUserId: user.id, 
          avatar_url: null
        }
      });

      if (error) throw error;

      toast({
        title: "Avatar removed",
        description: "Your profile picture has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove avatar.",
        variant: "destructive",
      });
=======
      console.error("Failed to log admin action:", error);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const validated = profileSchema.parse(profileData);
      
<<<<<<< HEAD
      // Use Edge Function to update BOTH auth and profile to ensure consistency
      const { data, error } = await supabase.functions.invoke('manage-admin', {
        body: { 
          action: 'update_auth', 
          targetUserId: user.id, 
          email: validated.email,
          name: validated.name,
          avatar_url: profileData.avatar_url
        }
      });
=======
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

      if (error) throw error;

      await logAdminAction("profile_update", { 
<<<<<<< HEAD
        updated_fields: ["name", "email", "avatar_url"] 
=======
        updated_fields: ["name", "email"] 
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      });

      toast({
        title: "Profile updated",
<<<<<<< HEAD
        description: "Account details and authentication updated successfully.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      
      // Provide more specific error messages
      let errorMessage = error instanceof Error ? error.message : "Failed to update profile.";
      if (error.code === "23505") {
        errorMessage = "This email address is already in use by another account.";
      } else if (error.message?.includes("User not found")) {
        errorMessage = "User account not found. Please log in again.";
      } else if (error.message?.includes("SUPABASE_SERVICE_ROLE_KEY")) {
        errorMessage = "Server configuration error. Please contact support.";
      }
      
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
=======
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
<<<<<<< HEAD
    if (!user) return;
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    setIsLoading(true);

    try {
      const validated = passwordSchema.parse(passwordData);
      
<<<<<<< HEAD
      // Use Edge Function to update password via service role (more reliable for isolated auth)
      const { data, error } = await supabase.functions.invoke('manage-admin', {
        body: { 
          action: 'update_auth', 
          targetUserId: user.id, 
          password: validated.newPassword 
        }
=======
      const { error } = await supabase.auth.updateUser({
        password: validated.newPassword,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
        description: "Your authentication password has been changed successfully.",
      });
    } catch (error: any) {
      console.error("Password update error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update password.";
      
      // Specific error handling for known Supabase auth errors
      if (errorMessage.includes("WeakPassword") || error.message?.includes("weak_password") || errorMessage.toLowerCase().includes("password") && (errorMessage.toLowerCase().includes("weak") || errorMessage.toLowerCase().includes("compromised"))) {
        toast({
          title: "Password Rejected",
          description: "The password you chose has been identified as potentially compromised. Please select a stronger, unique password that hasn't been used in data breaches.",
          variant: "destructive",
        });
      } else if (error.message?.includes("SUPABASE_SERVICE_ROLE_KEY")) {
        toast({
          title: "Server Error",
          description: "Server configuration error. Please contact support.",
=======
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
<<<<<<< HEAD
          description: errorMessage,
=======
          description: "Failed to update password.",
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
      <div className="p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-admin-foreground">
              Account Settings
            </h1>
            <p className="text-sm text-admin-muted-foreground mt-1">
              Manage your admin account and security preferences
            </p>
          </div>
          <Badge 
            className="h-7 px-3 bg-admin-foreground text-admin-background border-0 font-bold uppercase tracking-wider text-xs w-fit"
          >
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Super Admin
=======
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          </Badge>
        </div>

        {/* Profile Information */}
<<<<<<< HEAD
        <Card className="border-admin-border shadow-sm">
          <CardHeader className="pb-4 border-b border-admin-border bg-admin-muted/30">
            <CardTitle className="flex items-center gap-2.5 text-base font-bold uppercase tracking-wider text-admin-foreground">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription className="text-xs text-admin-muted-foreground">Update your admin profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center gap-5 p-5 rounded-xl bg-admin-muted/30 border border-admin-border/50">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-2 ring-admin-border">
                  <AvatarImage src={profileData.avatar_url} />
                  <AvatarFallback className="bg-admin-foreground text-admin-background text-lg font-semibold">
                    {getInitials(profileData.name || "AD")}
                  </AvatarFallback>
                </Avatar>
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="text-base font-semibold text-admin-foreground">{profileData.name || "Admin User"}</p>
                <p className="text-sm text-admin-muted-foreground">{profileData.email}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-admin-border bg-success/10 text-success border-success/30">
                    Active
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    disabled={isUploadingAvatar}
                    asChild
                  >
                    <span>
                      <Camera className="h-4 w-4" />
                      {profileData.avatar_url ? 'Change' : 'Upload'}
                    </span>
                  </Button>
                </label>
                {profileData.avatar_url && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 text-destructive hover:text-destructive"
                    onClick={handleRemoveAvatar}
                    disabled={isUploadingAvatar}
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            <Separator className="bg-admin-border" />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">Full Name</Label>
=======
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                <Input 
                  id="name" 
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
<<<<<<< HEAD
                  className="h-11 bg-admin-card border-admin-border focus:ring-2 focus:ring-admin-foreground/10"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">Email Address</Label>
=======
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                <Input 
                  id="email" 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@adorzia.com"
<<<<<<< HEAD
                  className="h-11 bg-admin-card border-admin-border focus:ring-2 focus:ring-admin-foreground/10"
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                />
              </div>
            </div>
            
<<<<<<< HEAD
            <div className="space-y-2.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">Admin Role</Label>
              <Input 
                value="Super Admin" 
                disabled 
                className="h-11 bg-admin-muted/50 border-admin-border text-admin-muted-foreground cursor-not-allowed"
              />
              <p className="text-[10px] text-admin-muted-foreground italic">
                You have full administrative access to the dashboard
=======
            <div className="space-y-2">
              <Label>Role</Label>
              <Input 
                value={userRole === "superadmin" ? "Superadmin" : "Admin"} 
                disabled 
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Role cannot be changed from this interface
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              </p>
            </div>

            <Button 
<<<<<<< HEAD
              className="gap-2 h-11 px-6 bg-admin-foreground text-admin-background hover:bg-admin-foreground/90 font-bold transition-all active:scale-[0.98] shadow-md"
=======
              className="gap-2 bg-admin-wine hover:bg-admin-wine/90 text-admin-wine-foreground"
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
        <Card className="border-admin-border shadow-sm">
          <CardHeader className="pb-4 border-b border-admin-border bg-admin-muted/30">
            <CardTitle className="flex items-center gap-2.5 text-base font-bold uppercase tracking-wider text-admin-foreground">
              <KeyRound className="h-5 w-5" />
              Password Management
            </CardTitle>
            <CardDescription className="text-xs text-admin-muted-foreground">Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2.5">
              <Label htmlFor="currentPassword" className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">Current Password</Label>
=======
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              <Input 
                id="currentPassword" 
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
<<<<<<< HEAD
                className="h-11 bg-admin-card border-admin-border focus:ring-2 focus:ring-admin-foreground/10"
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">New Password</Label>
=======
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                <Input 
                  id="newPassword" 
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Min 6 characters"
<<<<<<< HEAD
                  className="h-11 bg-admin-card border-admin-border focus:ring-2 focus:ring-admin-foreground/10"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-admin-muted-foreground">Confirm New Password</Label>
=======
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm password"
<<<<<<< HEAD
                  className="h-11 bg-admin-card border-admin-border focus:ring-2 focus:ring-admin-foreground/10"
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                />
              </div>
            </div>
            <Button 
<<<<<<< HEAD
              className="gap-2 h-11 px-6 bg-admin-foreground text-admin-background hover:bg-admin-foreground/90 font-bold transition-all active:scale-[0.98] shadow-md"
              onClick={handlePasswordUpdate}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
=======
              className="bg-admin-wine hover:bg-admin-wine/90 text-admin-wine-foreground"
              onClick={handlePasswordUpdate}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
<<<<<<< HEAD
        <Card className="border-admin-border shadow-sm">
          <CardHeader className="pb-4 border-b border-admin-border bg-admin-muted/30">
            <CardTitle className="flex items-center gap-2.5 text-base font-bold uppercase tracking-wider text-admin-foreground">
              <Smartphone className="h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-xs text-admin-muted-foreground">Add an extra layer of security to your admin account</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between p-5 rounded-xl bg-admin-muted/30 border border-admin-border">
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-admin-foreground">Enable 2FA</p>
                <p className="text-xs text-admin-muted-foreground max-w-md leading-relaxed">
=======
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                  Protect your admin account with two-factor authentication via authenticator app
                </p>
              </div>
              <Switch 
                checked={is2FAEnabled}
                onCheckedChange={handle2FAToggle}
              />
            </div>
            {is2FAEnabled && (
<<<<<<< HEAD
              <div className="mt-4 p-4 rounded-xl bg-success/5 border border-success/20">
                <p className="text-xs text-admin-foreground leading-relaxed">
                  ✓ 2FA is enabled. Use your authenticator app to generate codes when signing in.
=======
              <div className="mt-4 p-4 rounded-lg bg-admin-apricot/10 border border-admin-camel/20">
                <p className="text-sm text-muted-foreground">
                  2FA is enabled. Use your authenticator app to generate codes when signing in.
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sign Out & Sessions */}
<<<<<<< HEAD
        <Card className="border-admin-border shadow-sm">
          <CardHeader className="pb-4 border-b border-admin-border bg-admin-muted/30">
            <CardTitle className="flex items-center gap-2.5 text-base font-bold uppercase tracking-wider text-admin-foreground">
              <Activity className="h-5 w-5" />
              Sessions & Sign Out
            </CardTitle>
            <CardDescription className="text-xs text-admin-muted-foreground">Manage your active sessions and sign out</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 h-10 border-admin-border hover:bg-admin-muted transition-all">
=======
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </AlertDialogTrigger>
<<<<<<< HEAD
                <AlertDialogContent className="border-admin-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-admin-foreground">Sign out of your account?</AlertDialogTitle>
                    <AlertDialogDescription className="text-admin-muted-foreground">
=======
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign out of your account?</AlertDialogTitle>
                    <AlertDialogDescription>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                      You will be signed out of this device and redirected to the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
<<<<<<< HEAD
                    <AlertDialogCancel className="border-admin-border">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleSignOut}
                      className="bg-admin-foreground hover:bg-admin-foreground/90 text-admin-background"
=======
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleSignOut}
                      className="bg-admin-wine hover:bg-admin-wine/90"
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                    >
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
<<<<<<< HEAD
                  <Button variant="destructive" className="gap-2 h-10 transition-all">
=======
                  <Button variant="destructive" className="gap-2">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                    <LogOut className="h-4 w-4" />
                    Sign Out of All Devices
                  </Button>
                </AlertDialogTrigger>
<<<<<<< HEAD
                <AlertDialogContent className="border-admin-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-admin-foreground">Sign out of all devices?</AlertDialogTitle>
                    <AlertDialogDescription className="text-admin-muted-foreground">
=======
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign out of all devices?</AlertDialogTitle>
                    <AlertDialogDescription>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                      This will sign you out of all devices where you are currently logged in. You will need to sign in again on each device.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
<<<<<<< HEAD
                    <AlertDialogCancel className="border-admin-border">Cancel</AlertDialogCancel>
=======
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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

<<<<<<< HEAD
            <Separator className="bg-admin-border" />

            <div className="text-[10px] text-admin-muted-foreground italic bg-admin-muted/30 p-3 rounded-lg">
=======
            <Separator />

            <div className="text-xs text-muted-foreground">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              <p>All account changes are logged for security and audit purposes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}