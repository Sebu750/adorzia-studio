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
    <Card hover className="overflow-hidden" role="region" aria-labelledby="team-title">
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle id="team-title" className="flex items-center gap-2.5 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
              <Users className="h-4 w-4 text-foreground" />
            </div>
            Team Activity
          </CardTitle>
          {unreadMessages > 0 && (
            <Badge 
              variant="default" 
              className="gap-1.5 badge-pulse"
              aria-label={`${unreadMessages} new messages`}
            >
              <MessageCircle className="h-3 w-3" />
              {unreadMessages} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6 space-y-5">
        <div>
          <p className="text-label mb-1.5">Active Team</p>
          <p className="font-display text-lg font-semibold">{teamName}</p>
        </div>
        
        <div>
          <p className="text-label mb-2.5">Current Project</p>
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/50 transition-all duration-200 hover:border-border hover:bg-secondary">
            <p className="font-medium text-sm">{activeProject}</p>
          </div>
        </div>

        <div>
          <p className="text-label mb-3">Team Members</p>
          <div className="flex items-center">
            <div className="flex avatar-stack" role="list" aria-label="Team members">
              {members.slice(0, 4).map((member, index) => (
                <Avatar
                  key={index}
                  className="h-9 w-9 border-2 border-background transition-transform duration-200 hover:scale-110 hover:z-10"
                  role="listitem"
                  aria-label={member.name}
                >
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-xs bg-secondary font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {members.length > 4 && (
              <span className="ml-3 text-sm text-muted-foreground font-medium">
                +{members.length - 4} more
              </span>
            )}
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full gap-2 group btn-press hover:bg-foreground hover:text-background hover:border-foreground"
        >
          Open Team Space
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </CardContent>
    </Card>
  );
}