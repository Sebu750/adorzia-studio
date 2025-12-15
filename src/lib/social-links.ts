export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/adorziaofficial",
  twitter: "https://x.com/adorziaofficial",
  linkedin: "https://linkedin.com/company/adorziaofficial",
  youtube: "https://youtube.com/@adorziaofficial",
} as const;

export type SocialPlatform = keyof typeof SOCIAL_LINKS;
