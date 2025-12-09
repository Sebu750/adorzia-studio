import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User, 
  Bell, 
  Lock, 
  CreditCard,
  Upload,
  Save,
  LogOut,
  Loader2,
  Crown,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  category: z.enum(["fashion", "textile", "jewelry"]),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    category: "fashion" as "fashion" | "textile" | "jewelry",
    avatar_url: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    styleboxes: true,
    earnings: true,
    portfolio: true,
    team: true,
    marketing: false,
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProfileData({
        name: data.name || "",
        email: data.email || user.email || "",
        category: (data.category as "fashion" | "textile" | "jewelry") || "fashion",
        avatar_url: data.avatar_url || "",
      });
    } else if (!error) {
      // No profile exists, use auth user data
      setProfileData({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        category: user.user_metadata?.category || "fashion",
        avatar_url: "",
      });
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
          category: validated.category,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id",
        });

      if (error) throw error;

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your account preferences
            </p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>Update your profile picture</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-border">
                  <AvatarImage src={profileData.avatar_url} />
                  <AvatarFallback className="text-xl bg-accent/10 text-accent">
                    {getInitials(profileData.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload New Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specialty Category</Label>
                  <Select 
                    value={profileData.category}
                    onValueChange={(v) => setProfileData(prev => ({ ...prev, category: v as "fashion" | "textile" | "jewelry" }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashion">Fashion Design</SelectItem>
                      <SelectItem value="textile">Textile Design</SelectItem>
                      <SelectItem value="jewelry">Jewelry Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="gap-2 bg-gradient-accent hover:opacity-90"
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
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { id: "styleboxes", label: "New Stylebox Releases", description: "Get notified when new challenges are available" },
                  { id: "earnings", label: "Earnings Updates", description: "Receive notifications about sales and payouts" },
                  { id: "portfolio", label: "Portfolio Approvals", description: "Get updates on your portfolio submission status" },
                  { id: "team", label: "Team Activity", description: "Notifications about team messages and updates" },
                  { id: "marketing", label: "Marketing & Tips", description: "Tips, trends, and promotional content" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor={item.id}>{item.label}</Label>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch 
                      id={item.id} 
                      checked={notifications[item.id as keyof typeof notifications]}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, [item.id]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
                <Button 
                  className="bg-gradient-accent hover:opacity-90"
                  onClick={handlePasswordUpdate}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Protect your account with two-factor authentication
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Manage your subscription tier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { tier: "basic", name: "Basic", price: "$15", features: ["Limited StyleBoxes", "Basic Studio", "Community Access"] },
                    { tier: "pro", name: "Pro Creator", price: "$49", features: ["Unlimited StyleBoxes", "Full Studio", "Request Publish", "Revenue Dashboard"], popular: true },
                    { tier: "elite", name: "Elite", price: "$99", features: ["Priority Publishing", "Mentorship Calls", "Early Access", "Higher Revenue Share"] },
                  ].map((plan) => (
                    <div 
                      key={plan.tier} 
                      className={`relative rounded-xl border p-4 ${
                        plan.popular 
                          ? "border-accent bg-accent/5" 
                          : "border-border bg-card"
                      }`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-accent">
                          Popular
                        </Badge>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        {plan.tier === "elite" && <Crown className="h-4 w-4 text-accent" />}
                        {plan.tier === "pro" && <Sparkles className="h-4 w-4 text-accent" />}
                        <h3 className="font-semibold">{plan.name}</h3>
                      </div>
                      <p className="text-2xl font-bold mb-4">{plan.price}<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {plan.features.map((feature, i) => (
                          <li key={i}>• {feature}</li>
                        ))}
                      </ul>
                      <Button 
                        variant={plan.popular ? "default" : "outline"} 
                        className={`w-full mt-4 ${plan.popular ? "bg-gradient-accent hover:opacity-90" : ""}`}
                        size="sm"
                      >
                        {plan.tier === "basic" ? "Current Plan" : "Upgrade"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
                <CardDescription>Configure how you receive your earnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paypal">PayPal Email</Label>
                  <Input id="paypal" type="email" placeholder="your@email.com" />
                </div>
                <Button className="bg-gradient-accent hover:opacity-90">Save Payout Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;