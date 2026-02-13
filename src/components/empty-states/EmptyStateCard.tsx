import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyStateCard({ icon: Icon, title, description, action }: EmptyStateCardProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-6">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
}
