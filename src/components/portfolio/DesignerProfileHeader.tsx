import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  MapPin, 
  Globe, 
  Instagram, 
  Twitter, 
  Linkedin,
  ExternalLink,
  Share2,
  Briefcase,
  Store
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface DesignerProfile {
  id?: string;
  user_id: string;
  name: string | null;
  brand_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  logo_url: string | null;
  banner_image: string | null;
  category: string | null;
  location: string | null;
  skills: string[] | null;
  education: string[] | null;
  awards: string[] | null;
  website_url: string | null;
  instagram_handle: string | null;
  twitter_handle: string | null;
  linkedin_url: string | null;
  behance_url: string | null;
  dribbble_url: string | null;
  rank: { name: string } | null;
  style_credits: number | null;
}

interface DesignerProfileHeaderProps {
  profile: DesignerProfile;
}

const CATEGORY_LABELS: Record<string, string> = {
  fashion: "Fashion Design",
  jewelry: "Jewelry Design",
  textile: "Textile Design",
  accessory: "Accessory Design",
  bridal: "Bridal Couture",
  couture: "Haute Couture",
  pret: "Prêt-à-Porter",
  streetwear: "Streetwear",
  sustainable: "Sustainable Fashion",
};

export function DesignerProfileHeader({ profile }: DesignerProfileHeaderProps) {
  const rankName = profile.rank?.name?.toLowerCase() || "apprentice";

  const getInitials = (name?: string | null) => {
    if (!name) return "D";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Portfolio link copied to clipboard!");
  };

  const socialLinks = [
    { 
      handle: profile.instagram_handle, 
      icon: Instagram, 
      href: profile.instagram_handle ? `https://instagram.com/${profile.instagram_handle.replace('@', '')}` : null,
      label: "Instagram"
    },
    { 
      handle: profile.twitter_handle, 
      icon: Twitter, 
      href: profile.twitter_handle ? `https://twitter.com/${profile.twitter_handle.replace('@', '')}` : null,
      label: "Twitter"
    },
    { 
      handle: profile.linkedin_url, 
      icon: Linkedin, 
      href: profile.linkedin_url,
      label: "LinkedIn"
    },
  ].filter(link => link.handle);

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-48 md:h-64 relative overflow-hidden bg-gradient-to-br from-accent/20 via-primary/10 to-secondary/20">
        {profile.banner_image ? (
          <img 
            src={profile.banner_image}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-primary/20 to-secondary/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative -mt-20 pb-6">
          <motion.div 
            className="flex flex-col md:flex-row md:items-end gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Avatar & Logo */}
            <div className="flex items-end gap-4">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-3xl bg-accent text-accent-foreground">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              {profile.logo_url && (
                <div className="hidden md:block -mb-2">
                  <img 
                    src={profile.logo_url} 
                    alt="Brand logo" 
                    className="h-12 w-auto object-contain"
                  />
                </div>
              )}
            </div>

            {/* Name & Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl md:text-4xl font-bold">
                  {profile.name || "Designer"}
                </h1>
                <Badge className={cn(
                  "gap-1 border",
                  `bg-rank-${rankName}/20 text-rank-${rankName} border-rank-${rankName}/30`
                )}>
                  <Crown className="h-3 w-3" />
                  {profile.rank?.name || "Apprentice"}
                </Badge>
              </div>

              {profile.brand_name && (
                <div className="flex items-center gap-2 text-lg text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span className="font-medium">{profile.brand_name}</span>
                </div>
              )}

              {profile.bio && (
                <p className="text-muted-foreground max-w-2xl line-clamp-2">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {profile.category && (
                  <Badge variant="secondary">
                    {CATEGORY_LABELS[profile.category] || profile.category}
                  </Badge>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </span>
                )}
                {profile.website_url && (
                  <a 
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-accent transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="default" size="sm" asChild className="gap-2">
                <Link to={`/shop/designer/${profile.user_id}`}>
                  <Store className="h-4 w-4" />
                  Visit Store
                </Link>
              </Button>
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-2">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-accent/10 hover:border-accent transition-colors"
                      title={link.label}
                    >
                      <link.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
