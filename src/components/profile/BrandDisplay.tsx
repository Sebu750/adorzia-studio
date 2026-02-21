import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  Image, 
  Palette, 
  Sparkles,
  BadgePercent,
  type LucideIcon
} from "lucide-react";
import { toast } from "sonner";

interface BrandDisplayProps {
  designerName: string;
  brandName: string | null;
  bannerImage: string | null;
  logoUrl: string | null;
  onBrandUpdate: (brandName: string | null, bannerImage: string | null, logoUrl: string | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function BrandDisplay({ 
  designerName, 
  brandName, 
  bannerImage, 
  logoUrl,
  onBrandUpdate 
}: BrandDisplayProps) {
  const { user } = useAuth();
  const [localBrandName, setLocalBrandName] = useState(brandName || "");
  const [localBannerImage, setLocalBannerImage] = useState(bannerImage);
  const [localLogoUrl, setLocalLogoUrl] = useState(logoUrl);
  const [uploading, setUploading] = useState<{banner: boolean; logo: boolean}>({ banner: false, logo: false });

  useEffect(() => {
    setLocalBrandName(brandName || "");
    setLocalBannerImage(bannerImage);
    setLocalLogoUrl(logoUrl);
  }, [brandName, bannerImage, logoUrl]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return "Invalid file type. Only JPEG, PNG, and WebP are allowed.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 5MB limit.";
    }
    return null;
  };

  const uploadImage = async (file: File, type: 'banner' | 'logo'): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${user!.id}/${type}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: '3600',
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      toast.error(`Failed to upload ${type}: ${error.message}`);
      return null;
    }
  };

  const handleImageUpload = async (file: File, type: 'banner' | 'logo') => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));
    
    try {
      const publicUrl = await uploadImage(file, type);
      if (publicUrl) {
        if (type === 'banner') {
          setLocalBannerImage(publicUrl);
          onBrandUpdate(localBrandName, publicUrl, localLogoUrl);
        } else {
          setLocalLogoUrl(publicUrl);
          onBrandUpdate(localBrandName, localBannerImage, publicUrl);
        }
        toast.success(`${type === 'banner' ? 'Banner' : 'Logo'} uploaded successfully!`);
      }
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleBrandNameSave = () => {
    onBrandUpdate(localBrandName, localBannerImage, localLogoUrl);
    toast.success("Brand name updated!");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
    // Reset input to allow uploading the same file again
    e.target.value = '';
  };

  const ImageUploadSection = ({ 
    title, 
    icon: Icon, 
    currentImage, 
    type,
    description 
  }: { 
    title: string; 
    icon: LucideIcon; 
    currentImage: string | null; 
    type: 'banner' | 'logo';
    description: string;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h4 className="font-medium">{title}</h4>
      </div>
      
      <p className="text-sm text-muted-foreground">{description}</p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1">
          {currentImage ? (
            <div className="relative group">
              <img
                src={currentImage}
                alt={title}
                className={`w-full ${type === 'logo' ? 'max-w-[200px] h-auto' : 'h-32 object-cover'} rounded-lg border`}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <label className="cursor-pointer">
                  <Input
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={(e) => handleFileInput(e, type)}
                    className="hidden"
                    disabled={uploading[type]}
                  />
                  <Button 
                    variant="secondary" 
                    size="sm"
                    disabled={uploading[type]}
                    className="gap-2"
                  >
                    {uploading[type] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Change {title}
                      </>
                    )}
                  </Button>
                </label>
              </div>
            </div>
          ) : (
            <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors ${uploading[type] ? 'opacity-50' : ''}`}>
              <label>
                <Input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(e) => handleFileInput(e, type)}
                  className="hidden"
                  disabled={uploading[type]}
                />
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </div>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BadgePercent className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold">Brand Identity</h3>
          <p className="text-sm text-muted-foreground">
            Manage your brand presentation in the marketplace
          </p>
        </div>
      </div>

      {/* Brand Name */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Brand Name
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name">Brand Name</Label>
            <Input
              id="brand-name"
              value={localBrandName}
              onChange={(e) => setLocalBrandName(e.target.value)}
              placeholder="Your brand name"
              maxLength={100}
            />
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <div className="text-lg font-medium">
              {localBrandName || "Your Brand Name"} <span className="text-muted-foreground font-normal">by</span> {designerName}
            </div>
          </div>
          
          <Button 
            onClick={handleBrandNameSave}
            disabled={localBrandName === (brandName || "")}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Save Brand Name
          </Button>
        </CardContent>
      </Card>

      {/* Banner Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Brand Banner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploadSection
            title="Banner Image"
            icon={Image}
            currentImage={localBannerImage}
            type="banner"
            description="This banner will be displayed on your designer profile page in the marketplace. Recommended size: 1200x400 pixels."
          />
        </CardContent>
      </Card>

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Brand Logo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploadSection
            title="Logo"
            icon={Palette}
            currentImage={localLogoUrl}
            type="logo"
            description="Your brand logo will appear alongside your brand name in the marketplace. Recommended size: 300x300 pixels."
          />
        </CardContent>
      </Card>
    </div>
  );
}