import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Trophy, 
  Star,
  Medal,
  Crown,
  Newspaper,
  Scroll,
  BadgeCheck
} from "lucide-react";
import { motion } from "framer-motion";

interface AchievementsSectionProps {
  awards: string[] | null;
  features?: string[] | null;
  competitions?: string[] | null;
  certifications?: string[] | null;
}

// Achievement type detection based on keywords
function getAchievementType(achievement: string): {
  type: "award" | "feature" | "competition" | "certification";
  icon: typeof Award;
} {
  const lowerAchievement = achievement.toLowerCase();
  
  if (lowerAchievement.includes("feature") || lowerAchievement.includes("magazine") || 
      lowerAchievement.includes("interview") || lowerAchievement.includes("press") ||
      lowerAchievement.includes("publication") || lowerAchievement.includes("article")) {
    return { type: "feature", icon: Newspaper };
  }
  
  if (lowerAchievement.includes("competition") || lowerAchievement.includes("winner") ||
      lowerAchievement.includes("finalist") || lowerAchievement.includes("runner-up") ||
      lowerAchievement.includes("contest") || lowerAchievement.includes("championship")) {
    return { type: "competition", icon: Trophy };
  }
  
  if (lowerAchievement.includes("certified") || lowerAchievement.includes("certification") ||
      lowerAchievement.includes("diploma") || lowerAchievement.includes("degree") ||
      lowerAchievement.includes("accredited") || lowerAchievement.includes("qualified")) {
    return { type: "certification", icon: Scroll };
  }
  
  return { type: "award", icon: Award };
}

// Get color class based on achievement type
function getTypeColor(type: string): string {
  switch (type) {
    case "award": return "text-yellow-500 bg-yellow-500/10";
    case "feature": return "text-blue-500 bg-blue-500/10";
    case "competition": return "text-purple-500 bg-purple-500/10";
    case "certification": return "text-green-500 bg-green-500/10";
    default: return "text-accent bg-accent/10";
  }
}

export function AchievementsSection({ 
  awards, 
  features, 
  competitions, 
  certifications 
}: AchievementsSectionProps) {
  // Combine all achievements or use just awards if others aren't provided
  const allAchievements = [
    ...(awards || []),
    ...(features || []),
    ...(competitions || []),
    ...(certifications || []),
  ];

  if (allAchievements.length === 0) return null;

  // Group achievements by type
  const groupedAchievements: Record<string, { items: string[]; icon: typeof Award }> = {
    award: { items: [], icon: Award },
    feature: { items: [], icon: Newspaper },
    competition: { items: [], icon: Trophy },
    certification: { items: [], icon: Scroll },
  };

  allAchievements.forEach(achievement => {
    const { type } = getAchievementType(achievement);
    groupedAchievements[type].items.push(achievement);
  });

  const activeGroups = Object.entries(groupedAchievements)
    .filter(([_, group]) => group.items.length > 0);

  const groupLabels: Record<string, string> = {
    award: "Awards & Recognition",
    feature: "Media Features",
    competition: "Competition Wins",
    certification: "Certifications",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          Achievements
          <Badge variant="secondary" className="ml-2">
            {allAchievements.length} Total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Achievement Groups */}
        {activeGroups.map(([type, group], groupIndex) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <group.icon className={`h-4 w-4 ${getTypeColor(type).split(" ")[0]}`} />
              {groupLabels[type]}
              <Badge variant="outline" className="text-xs">
                {group.items.length}
              </Badge>
            </h4>
            <div className="grid gap-3">
              {group.items.map((achievement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (groupIndex * 0.1) + (idx * 0.05) }}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getTypeColor(type)}`}>
                    <group.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{achievement}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {groupLabels[type].split(" ")[0]}
                      </Badge>
                      <BadgeCheck className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-muted-foreground">Verified</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Summary Stats */}
        <div className="pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Awards", count: groupedAchievements.award.items.length, icon: Award, color: "text-yellow-500" },
              { label: "Features", count: groupedAchievements.feature.items.length, icon: Newspaper, color: "text-blue-500" },
              { label: "Competitions", count: groupedAchievements.competition.items.length, icon: Trophy, color: "text-purple-500" },
              { label: "Certifications", count: groupedAchievements.certification.items.length, icon: Scroll, color: "text-green-500" },
            ].filter(item => item.count > 0).map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-4 bg-muted/50 rounded-lg"
              >
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="font-display text-2xl font-bold">{stat.count}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
