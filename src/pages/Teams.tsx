import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Search,
  Crown,
  Calendar,
  ArrowRight,
  UserPlus
} from "lucide-react";

const Teams = () => {
  const myTeam = {
    name: "Studio Collective",
    description: "A group of passionate designers focused on sustainable fashion and innovative textiles.",
    members: [
      { name: "Aria Kim", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", role: "Leader", level: 24 },
      { name: "Emma Watson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "Member", level: 18 },
      { name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "Member", level: 21 },
      { name: "Sarah Kim", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "Member", level: 16 },
    ],
    activeProject: "Winter Capsule Collection",
    completedProjects: 8,
    unreadMessages: 5,
  };

  const availableTeams = [
    {
      name: "Design Rebels",
      description: "Pushing boundaries in avant-garde fashion design",
      members: 4,
      maxMembers: 5,
      category: "Fashion",
      level: "Advanced",
    },
    {
      name: "Textile Innovators",
      description: "Exploring new materials and sustainable fabrics",
      members: 3,
      maxMembers: 4,
      category: "Textile",
      level: "Intermediate",
    },
    {
      name: "Jewelry Artisans",
      description: "Crafting unique jewelry with traditional techniques",
      members: 2,
      maxMembers: 4,
      category: "Jewelry",
      level: "All Levels",
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Teams
            </h1>
            <p className="text-muted-foreground mt-1">
              Collaborate with other designers on team challenges
            </p>
          </div>
          <Button variant="accent" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Team
          </Button>
        </div>

        <Tabs defaultValue="my-team" className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-team">My Team</TabsTrigger>
            <TabsTrigger value="discover">Discover Teams</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>

          <TabsContent value="my-team" className="space-y-6">
            {/* Team Overview Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="font-display text-2xl font-bold">{myTeam.name}</h2>
                        <Badge variant="accent">Active</Badge>
                      </div>
                      <p className="text-muted-foreground">{myTeam.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{myTeam.members.length} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{myTeam.completedProjects} projects completed</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="default" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Team Chat
                        {myTeam.unreadMessages > 0 && (
                          <Badge variant="accent" className="ml-1">
                            {myTeam.unreadMessages}
                          </Badge>
                        )}
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Invite
                      </Button>
                    </div>
                  </div>

                  {/* Current Project */}
                  <Card className="lg:w-80 bg-secondary/50">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-2">Current Project</p>
                      <h3 className="font-display font-semibold mb-3">{myTeam.activeProject}</h3>
                      <Button variant="outline" size="sm" className="w-full gap-2 group">
                        View Project
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {myTeam.members.map((member, index) => (
                    <Card key={index} hover className="overflow-hidden">
                      <CardContent className="p-4 text-center">
                        <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-border">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-medium">{member.name}</h3>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          {member.role === "Leader" && (
                            <Crown className="h-4 w-4 text-accent" />
                          )}
                          <Badge variant="secondary">{member.role}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Level {member.level}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search teams..." className="pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTeams.map((team, index) => (
                <Card key={index} hover>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-accent" />
                      </div>
                      <Badge variant="outline">{team.category}</Badge>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{team.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{team.description}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{team.members}/{team.maxMembers} members</span>
                      <Badge variant="secondary">{team.level}</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      Request to Join
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invitations">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">No Invitations</h3>
                <p className="text-muted-foreground">
                  You don't have any pending team invitations
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Teams;
