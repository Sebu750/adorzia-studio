import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
<<<<<<< HEAD
import { useFounderPurchase } from "@/hooks/useFounderPurchase";
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
<<<<<<< HEAD
import { Camera, Loader2, Save, X, MapPin, GraduationCap, Award, Globe, Instagram, Twitter, Linkedin, Facebook, Youtube, ShoppingCart, Palette, Upload, Crown, Star } from "lucide-react";
import FounderTierSelector from "@/components/founder/FounderTierSelector";
import { sanitizeInput, sanitizeStringArray } from "@/lib/input-sanitizer";
=======
import { Camera, Loader2, Save, X } from "lucide-react";
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DESIGNER_CATEGORIES = [
  { value: "fashion", label: "Fashion Design" },
  { value: "jewelry", label: "Jewelry Design" },
  { value: "textile", label: "Textile Design" },
  { value: "accessory", label: "Accessory Design" },
];

export function ProfileEditModal({ open, onOpenChange }: ProfileEditModalProps) {
  const { profile, updateProfile } = useProfile();
  
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
<<<<<<< HEAD
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");
  const [awards, setAwards] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [tiktokHandle, setTiktokHandle] = useState("");
  const [youtubeChannel, setYoutubeChannel] = useState("");
  const [dribbbleUrl, setDribbbleUrl] = useState("");
  const [behanceUrl, setBehanceUrl] = useState("");
  const [etsyShopUrl, setEtsyShopUrl] = useState("");
  const [shopifyStoreUrl, setShopifyStoreUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
=======
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setBio(profile.bio || "");
<<<<<<< HEAD
      setBrandName(profile.brand_name || "");
      setCategory(profile.category || "fashion");
      setSkills(profile.skills?.join(", ") || "");
      setAvatarUrl(profile.avatar_url || "");
      setLogoUrl(profile.logo_url || "");
      setBannerImageUrl(profile.banner_image || "");
      setLocation(profile.location || "");
      setEducation(profile.education?.join("\n") || "");
      setAwards(profile.awards?.join("\n") || "");
      setWebsiteUrl(profile.website_url || "");
      setInstagramHandle(profile.instagram_handle || "");
      setTwitterHandle(profile.twitter_handle || "");
      setLinkedinUrl(profile.linkedin_url || "");
      setFacebookUrl(profile.facebook_url || "");
      setTiktokHandle(profile.tiktok_handle || "");
      setYoutubeChannel(profile.youtube_channel || "");
      setDribbbleUrl(profile.dribbble_url || "");
      setBehanceUrl(profile.behance_url || "");
      setEtsyShopUrl(profile.etsy_shop_url || "");
      setShopifyStoreUrl(profile.shopify_store_url || "");
    }
  }, [profile]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!name.trim()) {
      errors.name = "Display name is required";
    }
    
    if (websiteUrl && !websiteUrl.match(/^https?:\/\//)) {
      errors.websiteUrl = "Please enter a valid URL starting with http:// or https://";
    }
    
    if (instagramHandle && !instagramHandle.startsWith('@')) {
      errors.instagramHandle = "Instagram handle should start with @";
    }
    
    if (twitterHandle && !twitterHandle.startsWith('@')) {
      errors.twitterHandle = "Twitter handle should start with @";
    }
    
    if (tiktokHandle && !tiktokHandle.startsWith('@')) {
      errors.tiktokHandle = "TikTok handle should start with @";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!validateForm()) {
        throw new Error("Please fix validation errors");
      }
      
      const sanitizedSkills = sanitizeInput(skills);
      const skillsArray = sanitizedSkills
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      const sanitizedEducation = sanitizeInput(education);
      const educationArray = sanitizedEducation
        .split("\n")
        .map(e => e.trim())
        .filter(e => e.length > 0);
      
      const sanitizedAwards = sanitizeInput(awards);
      const awardsArray = sanitizedAwards
        .split("\n")
        .map(a => a.trim())
        .filter(a => a.length > 0);

      // Only include fields that we know exist in the database
      const sanitizedBio = sanitizeInput(bio);
      const sanitizedName = sanitizeInput(name);
      const profileUpdates: any = {
        name: sanitizedName || null,
        bio: sanitizedBio || null,
        category: category as any,
        skills: skillsArray.length > 0 ? skillsArray : null,
        avatar_url: avatarUrl || null,
      };
      
      // Only add the new fields if we're confident they exist
      // TODO: Remove this check once the migration is applied
      const isNewFieldsSupported = true; // Set to true once migration is confirmed applied
      
      if (isNewFieldsSupported) {
        profileUpdates.brand_name = sanitizeInput(brandName) || null;
        profileUpdates.logo_url = logoUrl || null;
        profileUpdates.banner_image = bannerImageUrl || null;
        profileUpdates.location = sanitizeInput(location) || null;
        profileUpdates.education = educationArray.length > 0 ? sanitizeStringArray(educationArray) : null;
        profileUpdates.awards = awardsArray.length > 0 ? sanitizeStringArray(awardsArray) : null;
        profileUpdates.website_url = sanitizeInput(websiteUrl) || null;
        profileUpdates.instagram_handle = sanitizeInput(instagramHandle) || null;
        profileUpdates.twitter_handle = sanitizeInput(twitterHandle) || null;
        profileUpdates.linkedin_url = sanitizeInput(linkedinUrl) || null;
        profileUpdates.facebook_url = sanitizeInput(facebookUrl) || null;
        profileUpdates.tiktok_handle = sanitizeInput(tiktokHandle) || null;
        profileUpdates.youtube_channel = sanitizeInput(youtubeChannel) || null;
        profileUpdates.dribbble_url = sanitizeInput(dribbbleUrl) || null;
        profileUpdates.behance_url = sanitizeInput(behanceUrl) || null;
        profileUpdates.etsy_shop_url = sanitizeInput(etsyShopUrl) || null;
        profileUpdates.shopify_store_url = sanitizeInput(shopifyStoreUrl) || null;
      }
      
      console.log("Profile updates being sent:", profileUpdates);
      
      const { error } = await updateProfile(profileUpdates);
=======
      setCategory(profile.category || "fashion");
      setSkills(profile.skills?.join(", ") || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const skillsArray = skills
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const { error } = await updateProfile({
        name: name || null,
        bio: bio || null,
        category: category as any,
        skills: skillsArray.length > 0 ? skillsArray : null,
        avatar_url: avatarUrl || null,
      });
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      onOpenChange(false);
    },
    onError: (error) => {
<<<<<<< HEAD
      if (error.message === "Please fix validation errors") {
        toast.error("Please check the form for validation errors");
      } else {
        toast.error("Failed to update profile: " + error.message);
      }
=======
      toast.error("Failed to update profile: " + error.message);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    },
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
<<<<<<< HEAD
      const filePath = `${profile?.user_id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
=======
      const fileName = `${profile?.user_id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
<<<<<<< HEAD
        .from("avatars")
=======
        .from("portfolio-assets")
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast.success("Avatar uploaded!");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

<<<<<<< HEAD
  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB for banners)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setBannerUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${profile?.user_id}/banner-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("banners")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("banners")
        .getPublicUrl(filePath);

      setBannerImageUrl(publicUrl);
      toast.success("Banner uploaded!");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setBannerUploading(false);
    }
  };

=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

<<<<<<< HEAD
        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Profile Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Palette className="h-5 w-5 text-accent" />
              Profile
            </h3>
            
            {/* Banner Image Upload */}
            <div className="w-full space-y-2">
              <Label>Banner Image</Label>
              <div className="relative h-32 bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border flex items-center justify-center">
                {bannerImageUrl ? (
                  <img 
                    src={bannerImageUrl} 
                    alt="Banner preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">No banner uploaded</p>
                )}
              </div>
              <label className="cursor-pointer">
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  disabled={bannerUploading}
                >
                  {bannerUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {bannerUploading ? "Uploading..." : "Upload Banner"}
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                  disabled={bannerUploading}
                />
              </label>
            </div>
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-2xl bg-accent text-accent-foreground">
                    {getInitials(name || profile?.name)}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="avatar-upload"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </div>
              <p className="text-xs text-muted-foreground">Click camera to upload avatar</p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Display Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (validationErrors.name) {
                    setValidationErrors(prev => ({ ...prev, name: '' }));
                  }
                }}
                placeholder="Your display name"
                className={validationErrors.name ? "border-red-500" : ""}
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>

            {/* Brand Name */}
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Your design brand/studio name"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself and your design philosophy..."
                rows={3}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Design Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {DESIGNER_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., Fashion Design, Textile Art, Pattern Making"
              />
              <p className="text-xs text-muted-foreground">
                Separate skills with commas
              </p>
            </div>
          </div>

          {/* Expertise Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-accent" />
              Expertise
            </h3>
            
            {/* Education */}
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="List your educational qualifications, one per line&#10;e.g.:&#10;BFA in Fashion Design - XYZ University&#10;Advanced Textile Workshop - ABC Institute"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Enter one qualification per line
              </p>
            </div>

            {/* Awards */}
            <div className="space-y-2">
              <Label htmlFor="awards" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Awards & Recognition
              </Label>
              <Textarea
                id="awards"
                value={awards}
                onChange={(e) => setAwards(e.target.value)}
                placeholder="List your awards, grants, and recognitions&#10;e.g.:&#10;2023 Emerging Designer Award&#10;National Fashion Council Grant Winner 2022"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Enter one award per line
              </p>
            </div>
          </div>

          {/* Social & Business Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              Social & Business Presence
            </h3>
            
            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={websiteUrl}
                onChange={(e) => {
                  setWebsiteUrl(e.target.value);
                  if (validationErrors.websiteUrl) {
                    setValidationErrors(prev => ({ ...prev, websiteUrl: '' }));
                  }
                }}
                placeholder="https://yourwebsite.com"
                className={validationErrors.websiteUrl ? "border-red-500" : ""}
              />
              {validationErrors.websiteUrl && (
                <p className="text-sm text-red-500">{validationErrors.websiteUrl}</p>
              )}
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Brand Logo
              </Label>
              <div className="flex items-center gap-3">
                {logoUrl && (
                  <img 
                    src={logoUrl} 
                    alt="Logo preview" 
                    className="h-12 w-12 object-contain border rounded"
                  />
                )}
                <div className="flex-1">
                  <Input
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="Logo URL or upload below"
                  />
                </div>
                <label className="cursor-pointer">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={logoUploading}
                    asChild
                  >
                    <span>
                      {logoUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Upload"
                      )}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      if (!file.type.startsWith("image/")) {
                        toast.error("Please upload an image file");
                        return;
                      }
                      
                      if (file.size > 2 * 1024 * 1024) {
                        toast.error("Image must be less than 2MB");
                        return;
                      }
                      
                      setLogoUploading(true);
                      try {
                        const fileExt = file.name.split(".").pop();
                        const filePath = `${profile?.user_id}/logo-${Date.now()}.${fileExt}`;
                        
                        const { error: uploadError } = await supabase.storage
                          .from("logos")
                          .upload(filePath, file);
                        
                        if (uploadError) throw uploadError;
                        
                        const { data: { publicUrl } } = supabase.storage
                          .from("logos")
                          .getPublicUrl(filePath);
                        
                        setLogoUrl(publicUrl);
                        toast.success("Logo uploaded!");
                      } catch (error: any) {
                        toast.error("Upload failed: " + error.message);
                      } finally {
                        setLogoUploading(false);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Social Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={instagramHandle}
                  onChange={(e) => {
                    setInstagramHandle(e.target.value);
                    if (validationErrors.instagramHandle) {
                      setValidationErrors(prev => ({ ...prev, instagramHandle: '' }));
                    }
                  }}
                  placeholder="@username"
                  className={validationErrors.instagramHandle ? "border-red-500" : ""}
                />
                {validationErrors.instagramHandle && (
                  <p className="text-sm text-red-500">{validationErrors.instagramHandle}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter/X
                </Label>
                <Input
                  id="twitter"
                  value={twitterHandle}
                  onChange={(e) => {
                    setTwitterHandle(e.target.value);
                    if (validationErrors.twitterHandle) {
                      setValidationErrors(prev => ({ ...prev, twitterHandle: '' }));
                    }
                  }}
                  placeholder="@username"
                  className={validationErrors.twitterHandle ? "border-red-500" : ""}
                />
                {validationErrors.twitterHandle && (
                  <p className="text-sm text-red-500">{validationErrors.twitterHandle}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
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
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tiktok">TikTok</Label>
                <Input
                  id="tiktok"
                  value={tiktokHandle}
                  onChange={(e) => {
                    setTiktokHandle(e.target.value);
                    if (validationErrors.tiktokHandle) {
                      setValidationErrors(prev => ({ ...prev, tiktokHandle: '' }));
                    }
                  }}
                  placeholder="@username"
                  className={validationErrors.tiktokHandle ? "border-red-500" : ""}
                />
                {validationErrors.tiktokHandle && (
                  <p className="text-sm text-red-500">{validationErrors.tiktokHandle}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="youtube" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube
                </Label>
                <Input
                  id="youtube"
                  value={youtubeChannel}
                  onChange={(e) => setYoutubeChannel(e.target.value)}
                  placeholder="Channel URL or username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dribbble">Dribbble</Label>
                <Input
                  id="dribbble"
                  value={dribbbleUrl}
                  onChange={(e) => setDribbbleUrl(e.target.value)}
                  placeholder="https://dribbble.com/username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="behance">Behance</Label>
                <Input
                  id="behance"
                  value={behanceUrl}
                  onChange={(e) => setBehanceUrl(e.target.value)}
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
                  value={etsyShopUrl}
                  onChange={(e) => setEtsyShopUrl(e.target.value)}
                  placeholder="https://etsy.com/shop/username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shopify">Shopify Store</Label>
                <Input
                  id="shopify"
                  value={shopifyStoreUrl}
                  onChange={(e) => setShopifyStoreUrl(e.target.value)}
                  placeholder="https://store.myshopify.com"
                />
              </div>
            </div>
=======
        <div className="space-y-6 py-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="text-2xl bg-accent text-accent-foreground">
                  {getInitials(name || profile?.name)}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </div>
            <p className="text-xs text-muted-foreground">Click camera to upload avatar</p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Design Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {DESIGNER_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., Fashion Design, Textile Art, Pattern Making"
            />
            <p className="text-xs text-muted-foreground">
              Separate skills with commas
            </p>
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={() => saveMutation.mutate()} 
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
