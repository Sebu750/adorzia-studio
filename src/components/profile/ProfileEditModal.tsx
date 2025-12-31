import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
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
import { Camera, Loader2, Save, X } from "lucide-react";

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
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setBio(profile.bio || "");
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

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to update profile: " + error.message);
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
      const fileName = `${profile?.user_id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast.success("Avatar uploaded!");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

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
