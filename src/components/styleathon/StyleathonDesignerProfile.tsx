import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface StyleathonDesignerProfileProps {
  name: string;
  avatar: string;
  level: string;
  xp: number;
}

const StyleathonDesignerProfile = ({
  name,
  avatar,
  level,
  xp,
}: StyleathonDesignerProfileProps) => {
  return (
    <div className="flex items-center gap-4 p-6 bg-card border border-border rounded-2xl">
      <img
        src={avatar}
        alt={name}
        className="w-16 h-16 rounded-full object-cover border-2 border-border"
      />
      <div className="flex-1">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
          {name}
        </h3>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs">
            {level}
          </Badge>
          <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            {xp.toLocaleString()} XP
          </span>
        </div>
      </div>
    </div>
  );
};

export default StyleathonDesignerProfile;
