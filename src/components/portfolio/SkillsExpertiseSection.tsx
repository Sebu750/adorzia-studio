import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  GraduationCap, 
  Scissors, 
  Palette,
  Layers,
  Gem,
  Cpu,
  Settings,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

interface SkillsExpertiseSectionProps {
  skills: string[] | null;
  education?: string[] | null;
}

// Predefined skill categories for fashion designers
const SKILL_CATEGORIES = {
  embroidery: {
    label: "Embroidery Techniques",
    icon: Gem,
    keywords: ["embroidery", "zardozi", "threadwork", "beadwork", "sequin", "hand embroidery", "machine embroidery", "applique", "cutwork", "mirror work", "resham"]
  },
  silhouette: {
    label: "Silhouette Specialization",
    icon: Layers,
    keywords: ["silhouette", "draping", "tailoring", "pattern", "a-line", "bodycon", "empire", "mermaid", "ballgown", "fit and flare", "sheath"]
  },
  software: {
    label: "Software Skills",
    icon: Cpu,
    keywords: ["clo3d", "illustrator", "photoshop", "cad", "marvelous designer", "optitex", "gerber", "lectra", "browzwear", "figma", "procreate"]
  },
  production: {
    label: "Production Capabilities",
    icon: Settings,
    keywords: ["production", "manufacturing", "sampling", "quality control", "sourcing", "supply chain", "costing", "tech pack", "spec sheet", "grading"]
  }
};

function categorizeSkill(skill: string): string | null {
  const lowerSkill = skill.toLowerCase();
  for (const [category, config] of Object.entries(SKILL_CATEGORIES)) {
    if (config.keywords.some(keyword => lowerSkill.includes(keyword))) {
      return category;
    }
  }
  return null;
}

function getSkillLevel(skill: string, index: number): number {
  // Simple algorithm to assign skill levels based on position and common skill keywords
  const baseLevel = 100 - (index * 8);
  const lowerSkill = skill.toLowerCase();
  
  // Boost for specific keywords
  if (lowerSkill.includes("expert") || lowerSkill.includes("advanced")) return Math.min(95, baseLevel + 10);
  if (lowerSkill.includes("proficient")) return Math.min(85, baseLevel + 5);
  if (lowerSkill.includes("intermediate")) return Math.min(75, baseLevel);
  if (lowerSkill.includes("basic") || lowerSkill.includes("beginner")) return Math.min(50, baseLevel - 20);
  
  return Math.max(40, Math.min(95, baseLevel));
}

export function SkillsExpertiseSection({ skills, education }: SkillsExpertiseSectionProps) {
  if (!skills || skills.length === 0) return null;

  // Categorize skills
  const categorizedSkills: Record<string, string[]> = {
    embroidery: [],
    silhouette: [],
    software: [],
    production: [],
    other: []
  };

  skills.forEach(skill => {
    const category = categorizeSkill(skill);
    if (category) {
      categorizedSkills[category].push(skill);
    } else {
      categorizedSkills.other.push(skill);
    }
  });

  // Filter out empty categories
  const activeCategories = Object.entries(categorizedSkills)
    .filter(([_, categorySkills]) => categorySkills.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Skills & Expertise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Skill Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCategories.map(([category, categorySkills], catIndex) => {
            const config = SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES];
            const Icon = config?.icon || Palette;
            const label = config?.label || "Other Skills";

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
                className="space-y-4"
              >
                <h4 className="font-medium flex items-center gap-2 text-sm">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {label}
                </h4>
                <div className="space-y-3">
                  {categorySkills.map((skill, idx) => {
                    const level = getSkillLevel(skill, idx);
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{skill}</span>
                          <span className="text-muted-foreground text-xs">{level}%</span>
                        </div>
                        <Progress value={level} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* All Skills Tags */}
        <div className="pt-6 border-t">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Scissors className="h-4 w-4 text-accent" />
            All Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <Badge 
                key={idx} 
                variant="secondary"
                className="gap-1"
              >
                <CheckCircle className="h-3 w-3 text-green-500" />
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Education */}
        {education && education.length > 0 && (
          <div className="pt-6 border-t">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-accent" />
              Education & Training
            </h4>
            <div className="space-y-3">
              {education.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
