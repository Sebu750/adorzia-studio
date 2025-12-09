import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamMember {
  name: string;
  avatar: string;
  role: string;
}

interface TeamActivityProps {
  teamName: string;
  activeProject: string;
  members: TeamMember[];
  unreadMessages: number;
}

export function TeamActivity({
  teamName,
  activeProject,
  members,
  unreadMessages,
}: TeamActivityProps) {
  return (
    <Card hover className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-accent" />
            Team Activity
          </CardTitle>
          {unreadMessages > 0 && (
            <Badge variant="accent" className="gap-1">
              <MessageCircle className="h-3 w-3" />
              {unreadMessages} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Active Team</p>
          <p className="font-display text-lg font-semibold">{teamName}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">Current Project</p>
          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="font-medium text-sm">{activeProject}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-3">Team Members</p>
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {members.slice(0, 4).map((member, index) => (
                <Avatar
                  key={index}
                  className="h-8 w-8 border-2 border-background ring-2 ring-background"
                >
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-xs bg-secondary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {members.length > 4 && (
              <span className="ml-2 text-sm text-muted-foreground">
                +{members.length - 4} more
              </span>
            )}
          </div>
        </div>

        <Button variant="outline" className="w-full gap-2 group">
          Open Team Space
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </CardContent>
    </Card>
  );
}
