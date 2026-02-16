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
import { Textarea } from "@/components/ui/textarea";
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
  Sparkles,
  MessageSquarePlus,
<<<<<<< HEAD
  Send,
  MapPin,
  GraduationCap,
  Award,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  ShoppingCart,
  Palette,
  AlertTriangle,
  Trash2
=======
  Send
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
<<<<<<< HEAD
    brand_name: "",
    category: "fashion" as "fashion" | "textile" | "jewelry",
    avatar_url: "",
    logo_url: "",
    banner_image: "",
    location: "",
    education: "" as string | string[],
    awards: "" as string | string[],
    website_url: "",
    instagram_handle: "",
    twitter_handle: "",
    linkedin_url: "",
    facebook_url: "",
    tiktok_handle: "",
    youtube_channel: "",
    dribbble_url: "",
    behance_url: "",
    etsy_shop_url: "",
    shopify_store_url: "",
=======
    category: "fashion" as "fashion" | "textile" | "jewelry",
    avatar_url: "",
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
  const [feedbackData, setFeedbackData] = useState({
    role: "" as "designer" | "founder" | "",
    category: "" as "bug" | "ux" | "feature" | "other" | "",
    message: "",
  });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
<<<<<<< HEAD
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

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
<<<<<<< HEAD
        brand_name: data.brand_name || "",
        category: (data.category as "fashion" | "textile" | "jewelry") || "fashion",
        avatar_url: data.avatar_url || "",
        logo_url: data.logo_url || "",
        banner_image: data.banner_image || "",
        location: data.location || "",
        education: Array.isArray(data.education) ? data.education.join("\n") : "",
        awards: Array.isArray(data.awards) ? data.awards.join("\n") : "",
        website_url: data.website_url || "",
        instagram_handle: data.instagram_handle || "",
        twitter_handle: data.twitter_handle || "",
        linkedin_url: data.linkedin_url || "",
        facebook_url: data.facebook_url || "",
        tiktok_handle: data.tiktok_handle || "",
        youtube_channel: data.youtube_channel || "",
        dribbble_url: data.dribbble_url || "",
        behance_url: data.behance_url || "",
        etsy_shop_url: data.etsy_shop_url || "",
        shopify_store_url: data.shopify_store_url || "",
=======
        category: (data.category as "fashion" | "textile" | "jewelry") || "fashion",
        avatar_url: data.avatar_url || "",
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      });
    } else if (!error) {
      // No profile exists, use auth user data
      setProfileData({
        name: user.user_metadata?.name || "",
        email: user.email || "",
<<<<<<< HEAD
        brand_name: "",
        category: user.user_metadata?.category || "fashion",
        avatar_url: "",
        logo_url: "",
        banner_image: "",
        location: "",
        education: "",
        awards: "",
        website_url: "",
        instagram_handle: "",
        twitter_handle: "",
        linkedin_url: "",
        facebook_url: "",
        tiktok_handle: "",
        youtube_channel: "",
        dribbble_url: "",
        behance_url: "",
        etsy_shop_url: "",
        shopify_store_url: "",
=======
        category: user.user_metadata?.category || "fashion",
        avatar_url: "",
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      });
    }
  };

<<<<<<< HEAD
  const validateProfileForm = () => {
    const errors: Record<string, string> = {};
    
    if (!profileData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (profileData.website_url && !profileData.website_url.match(/^https?:\/\//)) {
      errors.website_url = "Please enter a valid URL starting with http:// or https://";
    }
    
    if (profileData.instagram_handle && !profileData.instagram_handle.startsWith('@')) {
      errors.instagram_handle = "Instagram handle should start with @";
    }
    
    if (profileData.twitter_handle && !profileData.twitter_handle.startsWith('@')) {
      errors.twitter_handle = "Twitter handle should start with @";
    }
    
    if (profileData.tiktok_handle && !profileData.tiktok_handle.startsWith('@')) {
      errors.tiktok_handle = "TikTok handle should start with @";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  const handleProfileUpdate = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
<<<<<<< HEAD
      if (!validateProfileForm()) {
        toast({
          title: "Validation Error",
          description: "Please fix the validation errors in the form.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const validated = profileSchema.parse({
        name: profileData.name,
        email: profileData.email,
        category: profileData.category,
      });
      
      // Process arrays
      const educationArray = typeof profileData.education === 'string' 
        ? profileData.education.split('\n').map(e => e.trim()).filter(e => e)
        : profileData.education;
      
      const awardsArray = typeof profileData.awards === 'string'
        ? profileData.awards.split('\n').map(a => a.trim()).filter(a => a)
        : profileData.awards;
      
      // Only include fields that we know exist in the database
      const profileUpdates: any = {
        user_id: user.id,
        name: validated.name,
        email: validated.email,
        category: validated.category,
        avatar_url: profileData.avatar_url || null,
        updated_at: new Date().toISOString(),
      };
      
      // Only add the new fields if we're confident they exist
      // TODO: Remove this check once the migration is applied
      const isNewFieldsSupported = true; // Set to true once migration is confirmed applied
      
      if (isNewFieldsSupported) {
        profileUpdates.brand_name = profileData.brand_name || null;
        profileUpdates.logo_url = profileData.logo_url || null;
        profileUpdates.banner_image = profileData.banner_image || null;
        profileUpdates.location = profileData.location || null;
        profileUpdates.education = educationArray.length > 0 ? educationArray : null;
        profileUpdates.awards = awardsArray.length > 0 ? awardsArray : null;
        profileUpdates.website_url = profileData.website_url || null;
        profileUpdates.instagram_handle = profileData.instagram_handle || null;
        profileUpdates.twitter_handle = profileData.twitter_handle || null;
        profileUpdates.linkedin_url = profileData.linkedin_url || null;
        profileUpdates.facebook_url = profileData.facebook_url || null;
        profileUpdates.tiktok_handle = profileData.tiktok_handle || null;
        profileUpdates.youtube_channel = profileData.youtube_channel || null;
        profileUpdates.dribbble_url = profileData.dribbble_url || null;
        profileUpdates.behance_url = profileData.behance_url || null;
        profileUpdates.etsy_shop_url = profileData.etsy_shop_url || null;
        profileUpdates.shopify_store_url = profileData.shopify_store_url || null;
      }
      
      console.log("Settings profile updates being sent:", profileUpdates);
      
      const { error } = await supabase
        .from("profiles")
        .upsert(profileUpdates, {
          onConflict: "user_id",
        });

      console.log("Settings update result:", { error, data: profileUpdates });
      
=======
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

>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
        const errorMessage = error?.message || error?.error_description || error?.error || "Failed to update password.";
        
        // Specific error handling for known Supabase auth errors
        if (errorMessage.includes("WeakPassword") || errorMessage.toLowerCase().includes("password") && (errorMessage.toLowerCase().includes("weak") || errorMessage.toLowerCase().includes("compromised"))) {
          toast({
            title: "Password Rejected",
            description: "The password you chose has been identified as potentially compromised. Please select a stronger, unique password that hasn't been used in data breaches.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
=======
        toast({
          title: "Error",
          description: "Failed to update password.",
          variant: "destructive",
        });
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

<<<<<<< HEAD
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Confirmation required",
        description: 'Please type "DELETE" to confirm account deletion.',
        variant: "destructive",
      });
      return;
    }

    setIsDeletingAccount(true);

    try {
      // Call admin function to delete user account
      const { error } = await supabase.rpc('delete_user_account');

      if (error) throw error;

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });

      // Sign out and redirect
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Account deletion error:", error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteDialog(false);
      setDeleteConfirmation("");
    }
  };

=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  const handleFeedbackSubmit = async () => {
    if (!user) return;
    
    if (!feedbackData.role || !feedbackData.category || !feedbackData.message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (feedbackData.message.length > 2000) {
      toast({
        title: "Message too long",
        description: "Please keep your message under 2000 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      const { data, error } = await supabase.functions.invoke("submit-feedback", {
        body: {
          user_name: profileData.name || "Anonymous User",
          user_role: feedbackData.role,
          category: feedbackData.category,
          message: feedbackData.message.trim(),
        },
      });

<<<<<<< HEAD
      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }

      if (data?.error) {
        console.error("Function returned error:", data.error);
        throw new Error(data.error);
      }
=======
      if (error) throw error;
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

      toast({
        title: "Thank you for your feedback!",
        description: "We've received your submission and will review it shortly.",
      });

      // Reset form
      setFeedbackData({
        role: "",
        category: "",
        message: "",
      });
<<<<<<< HEAD
    } catch (error: any) {
      console.error("Feedback submission error:", error);
      const errorMessage = error?.message || error?.error || "Something went wrong. Please try again.";
      toast({
        title: "Submission failed",
        description: errorMessage,
=======
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
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
<<<<<<< HEAD
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
          {/* Header with Profile Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-accent opacity-5 rounded-2xl blur-3xl" />
            <Card className="relative border-accent/20 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-accent/20">
                      <AvatarImage src={profileData.avatar_url} />
                      <AvatarFallback className="text-lg bg-gradient-accent text-white">
                        {getInitials(profileData.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="font-display text-2xl font-bold tracking-tight">
                        {profileData.name || "Your Profile"}
                      </h1>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <span className="capitalize">{profileData.category || "Designer"}</span>
                        {profileData.location && (
                          <>
                            <span className="text-accent">•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {profileData.location}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <div className="sticky top-6 z-10 bg-background/80 backdrop-blur-md rounded-xl border border-border/50 p-1">
              <TabsList className="grid w-full grid-cols-5 bg-transparent">
                <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-gradient-accent data-[state=active]:text-white transition-all">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-gradient-accent data-[state=active]:text-white transition-all">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-gradient-accent data-[state=active]:text-white transition-all">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="gap-2 data-[state=active]:bg-gradient-accent data-[state=active]:text-white transition-all">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger value="feedback" className="gap-2 data-[state=active]:bg-gradient-accent data-[state=active]:text-white transition-all">
                  <MessageSquarePlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Feedback</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card className="border-accent/10 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Profile Photos</CardTitle>
                <CardDescription>Update your profile pictures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 border-2 border-border">
                    <AvatarImage src={profileData.avatar_url} />
                    <AvatarFallback className="text-xl bg-accent/10 text-accent">
                      {getInitials(profileData.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <label className="cursor-pointer">
                      <Button variant="outline" className="gap-2" asChild>
                        <span>
                          <Upload className="h-4 w-4" />
                          Upload New Photo
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          // Validate file type
                          if (!file.type.startsWith("image/")) {
                            toast({
                              title: "Invalid file type",
                              description: "Please upload an image file",
                              variant: "destructive",
                            });
                            return;
                          }
                          
                          // Validate file size (max 2MB)
                          if (file.size > 2 * 1024 * 1024) {
                            toast({
                              title: "File too large",
                              description: "Image must be less than 2MB",
                              variant: "destructive",
                            });
                            return;
                          }
                          
                          try {
                            const fileExt = file.name.split(".").pop();
                            const filePath = `${user?.id}/avatar-${Date.now()}.${fileExt}`;
                            
                            const { error: uploadError } = await supabase.storage
                              .from("avatars")
                              .upload(filePath, file, { upsert: true });
                            
                            if (uploadError) throw uploadError;
                            
                            const { data: { publicUrl } } = supabase.storage
                              .from("avatars")
                              .getPublicUrl(filePath);
                            
                            setProfileData(prev => ({ ...prev, avatar_url: publicUrl }));
                            
                            toast({
                              title: "Success",
                              description: "Avatar uploaded successfully!",
                            });
                          } catch (error: any) {
                            toast({
                              title: "Upload failed",
                              description: error.message,
                              variant: "destructive",
                            });
                          }
                        }}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>
                
                {/* Banner */}
                <div className="space-y-2">
                  <Label>Banner Image</Label>
                  <div className="relative h-32 bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border flex items-center justify-center">
                    {profileData.banner_image ? (
                      <img 
                        src={profileData.banner_image} 
                        alt="Banner preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <p className="text-muted-foreground text-sm">No banner uploaded</p>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <Button variant="outline" className="w-full gap-2" asChild>
                      <span>
                        <Upload className="h-4 w-4" />
                        Upload Banner
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        // Validate file type
                        if (!file.type.startsWith("image/")) {
                          toast({
                            title: "Invalid file type",
                            description: "Please upload an image file",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        // Validate file size (max 5MB for banners)
                        if (file.size > 5 * 1024 * 1024) {
                          toast({
                            title: "File too large",
                            description: "Image must be less than 5MB",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        try {
                          const fileExt = file.name.split(".").pop();
                          const filePath = `${user?.id}/banner-${Date.now()}.${fileExt}`;
                          
                          const { error: uploadError } = await supabase.storage
                            .from("banners")
                            .upload(filePath, file, { upsert: true });
                          
                          if (uploadError) throw uploadError;
                          
                          const { data: { publicUrl } } = supabase.storage
                            .from("banners")
                            .getPublicUrl(filePath);
                          
                          setProfileData(prev => ({ ...prev, banner_image: publicUrl }));
                          
                          toast({
                            title: "Success",
                            description: "Banner uploaded successfully!",
                          });
                        } catch (error: any) {
                          toast({
                            title: "Upload failed",
                            description: error.message,
                            variant: "destructive",
                          });
                        }
                      }}
                    />
                  </label>
=======
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
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
            <TabsTrigger value="feedback" className="gap-2">
              <MessageSquarePlus className="h-4 w-4" />
              <span className="hidden sm:inline">Feedback</span>
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                </div>
              </CardContent>
            </Card>

<<<<<<< HEAD
            <Card className="border-accent/10 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  Personal Information
                </CardTitle>
=======
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
<<<<<<< HEAD
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    value={profileData.name}
                    onChange={(e) => {
                      setProfileData(prev => ({ ...prev, name: e.target.value }));
                      if (validationErrors.name) {
                        setValidationErrors(prev => ({ ...prev, name: '' }));
                      }
                    }}
                    placeholder="Your name"
                    className={validationErrors.name ? "border-red-500" : ""}
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-500">{validationErrors.name}</p>
                  )}
=======
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                  />
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input 
                    id="brand-name" 
                    value={profileData.brand_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, brand_name: e.target.value }))}
                    placeholder="Your design brand/studio name"
                  />
                </div>
                <div className="space-y-2">
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input 
                    id="location" 
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                  />
                </div>
                <Button 
                  className="gap-2 bg-gradient-accent hover:opacity-90 transition-opacity shadow-sm"
=======
                <Button 
                  className="gap-2 bg-gradient-accent hover:opacity-90"
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
<<<<<<< HEAD
            
            <Card className="border-accent/10 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  Education & Awards
                </CardTitle>
                <CardDescription>Highlight your academic background and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Textarea
                    id="education"
                    value={typeof profileData.education === 'string' ? profileData.education : profileData.education.join('\n')}
                    onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                    placeholder="List your educational qualifications, one per line"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awards" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Awards & Recognition
                  </Label>
                  <Textarea
                    id="awards"
                    value={typeof profileData.awards === 'string' ? profileData.awards : profileData.awards.join('\n')}
                    onChange={(e) => setProfileData(prev => ({ ...prev, awards: e.target.value }))}
                    placeholder="List your awards, grants, and recognitions"
                    rows={4}
                  />
                </div>
                <Button 
                  className="gap-2 bg-gradient-accent hover:opacity-90 transition-opacity shadow-sm"
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
            
            <Card className="border-accent/10 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent" />
                  Social & Business Presence
                </CardTitle>
                <CardDescription>Connect your online profiles and business links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={profileData.website_url}
                    onChange={(e) => {
                      setProfileData(prev => ({ ...prev, website_url: e.target.value }));
                      if (validationErrors.website_url) {
                        setValidationErrors(prev => ({ ...prev, website_url: '' }));
                      }
                    }}
                    placeholder="https://yourwebsite.com"
                    className={validationErrors.website_url ? "border-red-500" : ""}
                  />
                  {validationErrors.website_url && (
                    <p className="text-sm text-red-500">{validationErrors.website_url}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo-url" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Brand Logo URL
                  </Label>
                  <Input 
                    id="logo-url" 
                    value={profileData.logo_url}
                    onChange={(e) => setProfileData(prev => ({ ...prev, logo_url: e.target.value }))}
                    placeholder="https://yourwebsite.com/logo.png"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Label>
                    <Input 
                      id="instagram" 
                      value={profileData.instagram_handle}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, instagram_handle: e.target.value }));
                        if (validationErrors.instagram_handle) {
                          setValidationErrors(prev => ({ ...prev, instagram_handle: '' }));
                        }
                      }}
                      placeholder="@username"
                      className={validationErrors.instagram_handle ? "border-red-500" : ""}
                    />
                    {validationErrors.instagram_handle && (
                      <p className="text-sm text-red-500">{validationErrors.instagram_handle}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter/X
                    </Label>
                    <Input 
                      id="twitter" 
                      value={profileData.twitter_handle}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, twitter_handle: e.target.value }));
                        if (validationErrors.twitter_handle) {
                          setValidationErrors(prev => ({ ...prev, twitter_handle: '' }));
                        }
                      }}
                      placeholder="@username"
                      className={validationErrors.twitter_handle ? "border-red-500" : ""}
                    />
                    {validationErrors.twitter_handle && (
                      <p className="text-sm text-red-500">{validationErrors.twitter_handle}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Label>
                    <Input 
                      id="linkedin" 
                      value={profileData.linkedin_url}
                      onChange={(e) => setProfileData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </Label>
                    <Input 
                      id="facebook" 
                      value={profileData.facebook_url}
                      onChange={(e) => setProfileData(prev => ({ ...prev, facebook_url: e.target.value }))}
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input 
                      id="tiktok" 
                      value={profileData.tiktok_handle}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, tiktok_handle: e.target.value }));
                        if (validationErrors.tiktok_handle) {
                          setValidationErrors(prev => ({ ...prev, tiktok_handle: '' }));
                        }
                      }}
                      placeholder="@username"
                      className={validationErrors.tiktok_handle ? "border-red-500" : ""}
                    />
                    {validationErrors.tiktok_handle && (
                      <p className="text-sm text-red-500">{validationErrors.tiktok_handle}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="youtube" className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </Label>
                    <Input 
                      id="youtube" 
                      value={profileData.youtube_channel}
                      onChange={(e) => setProfileData(prev => ({ ...prev, youtube_channel: e.target.value }))}
                      placeholder="Channel URL or username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dribbble">Dribbble</Label>
                    <Input 
                      id="dribbble" 
                      value={profileData.dribbble_url}
                      onChange={(e) => setProfileData(prev => ({ ...prev, dribbble_url: e.target.value }))}
                      placeholder="https://dribbble.com/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="behance">Behance</Label>
                    <Input 
                      id="behance" 
                      value={profileData.behance_url}
                      onChange={(e) => setProfileData(prev => ({ ...prev, behance_url: e.target.value }))}
                      placeholder="https://behance.net/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="etsy" className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Etsy Shop
                    </Label>
                    <Input 
                      id="etsy" 
                      value={profileData.etsy_shop_url}
                      onChange={(e) => setProfileData(prev => ({ ...prev, etsy_shop_url: e.target.value }))}
                      placeholder="https://etsy.com/shop/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shopify">Shopify Store</Label>
                    <Input 
                      id="shopify" 
                      value={profileData.shopify_store_url}
                      onChange={(e) => setProfileData(prev => ({ ...prev, shopify_store_url: e.target.value }))}
                      placeholder="https://store.myshopify.com"
                    />
                  </div>
                </div>
                
                <Button 
                  className="gap-2 bg-gradient-accent hover:opacity-90 mt-4"
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

            <TabsContent value="notifications" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card className="border-accent/10 shadow-sm hover:shadow-md transition-shadow">
=======
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
            </TabsContent>

            <TabsContent value="security" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card className="border-accent/10 shadow-sm hover:shadow-md transition-shadow">
=======
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
            
            <Card className="border-accent/10 shadow-sm hover:shadow-md transition-shadow">
=======

            <Card>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that will permanently affect your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-destructive">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button 
                      variant="destructive"
                      className="gap-2"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card className="border-accent/10 shadow-sm hover:shadow-md transition-shadow">
=======
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
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
<<<<<<< HEAD
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6 animate-in fade-in-50 duration-300">
              <Card className="border-accent/10 shadow-sm hover:shadow-md transition-shadow">
=======
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquarePlus className="h-5 w-5 text-accent" />
                  Share Your Feedback
                </CardTitle>
                <CardDescription>
                  Help us improve Adorzia! Report bugs, suggest features, or share your thoughts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Your Role *</Label>
                    <Select
                      value={feedbackData.role}
                      onValueChange={(v) => setFeedbackData(prev => ({ ...prev, role: v as "designer" | "founder" }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="founder">Founder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={feedbackData.category}
                      onValueChange={(v) => setFeedbackData(prev => ({ ...prev, category: v as "bug" | "ux" | "feature" | "other" }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">🐛 Bug Report</SelectItem>
                        <SelectItem value="ux">🎨 UX Issue</SelectItem>
                        <SelectItem value="feature">✨ Feature Request</SelectItem>
                        <SelectItem value="other">📝 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Your Message *</Label>
                    <span className="text-xs text-muted-foreground">
                      {feedbackData.message.length}/2000
                    </span>
                  </div>
                  <Textarea
                    value={feedbackData.message}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your feedback in detail. What happened? What did you expect? How can we improve?"
                    rows={6}
                    maxLength={2000}
                    className="resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-muted-foreground">
                    Submitting as: <span className="font-medium text-foreground">{profileData.name || "Anonymous"}</span>
                  </p>
                  <Button
                    onClick={handleFeedbackSubmit}
                    disabled={isSubmittingFeedback || !feedbackData.role || !feedbackData.category || !feedbackData.message.trim()}
                    className="gap-2 bg-gradient-accent hover:opacity-90"
                  >
                    {isSubmittingFeedback ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Submit Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-accent/10 p-3">
                    <MessageSquarePlus className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Direct Contact</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      For urgent issues or detailed discussions, email us at{" "}
                      <a 
                        href="mailto:hello@adorzia.com" 
                        className="text-accent hover:underline font-medium"
                      >
                        hello@adorzia.com
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      We typically respond within 24 hours.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
<<<<<<< HEAD

        {/* Delete Account Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Delete Account?
                </CardTitle>
                <CardDescription>
                  This action cannot be undone. All your data will be permanently deleted.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="delete-confirm">
                    Type <span className="font-mono font-bold">DELETE</span> to confirm
                  </Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="DELETE"
                    className="font-mono"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteDialog(false);
                      setDeleteConfirmation("");
                    }}
                    disabled={isDeletingAccount}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount || deleteConfirmation !== "DELETE"}
                  >
                    {isDeletingAccount ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        </div>
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      </div>
    </AppLayout>
  );
};

export default Settings;