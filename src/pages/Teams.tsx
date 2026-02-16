import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
<<<<<<< HEAD
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Search,
  Crown,
  Calendar,
  ArrowRight,
  UserPlus,
<<<<<<< HEAD
  Swords,
  Loader2,
  Mail,
  Check,
  X,
  LogOut
} from "lucide-react";
import { TeamStyleboxCard } from "@/components/teams/TeamStyleboxCard";
import { SOVEREIGN_ATELIER_CHALLENGE, SOVEREIGN_ATELIER_ROLES } from "@/lib/sovereign-atelier";
import { useTeams } from "@/hooks/useTeams";
import { useState } from "react";
import { EmptyStateCard } from "@/components/empty-states/EmptyStateCard";

const Teams = () => {
  const {
    myTeam,
    availableTeams,
    invitations,
    joinRequests,
    loading,
    createTeam,
    respondToInvitation,
    requestToJoin,
    respondToJoinRequest,
    leaveTeam,
  } = useTeams();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my-team");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTeamData, setNewTeamData] = useState({
    name: "",
    description: "",
    category: "fashion" as const,
    max_members: 5,
    is_open: true,
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTeam = async () => {
    if (newTeamData.name.trim().length < 3) return;
    
    setIsCreating(true);
    try {
      await createTeam(newTeamData);
      setCreateDialogOpen(false);
      setNewTeamData({
        name: "",
        description: "",
        category: "fashion",
        max_members: 5,
        is_open: true,
      });
      // Switch to My Team tab after successful creation
      setActiveTab("my-team");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredTeams = availableTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock team eligibility - in real app, this would come from the validate-team-eligibility edge function
  const isTeamEligible = myTeam ? myTeam.member_count >= 4 : false;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }
=======
  Swords
} from "lucide-react";
import { TeamStyleboxCard } from "@/components/teams/TeamStyleboxCard";
import { SOVEREIGN_ATELIER_CHALLENGE, SOVEREIGN_ATELIER_ROLES } from "@/lib/sovereign-atelier";

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

  // Mock team eligibility - in real app, this would come from the validate-team-eligibility edge function
  const isTeamEligible = myTeam.members.length >= 4;
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241

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
<<<<<<< HEAD
          {!myTeam && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="accent" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Team</DialogTitle>
                  <DialogDescription>
                    <div className="space-y-2">
                      <p>Start your own designer collective and invite others to join</p>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <Crown className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                          Requires Rank 3 (Stylist) or higher - 801+ SC
                        </span>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Team Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Studio Collective"
                      value={newTeamData.name}
                      onChange={(e) => setNewTeamData({ ...newTeamData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your team's focus and goals..."
                      value={newTeamData.description}
                      onChange={(e) => setNewTeamData({ ...newTeamData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max_members">Max Members</Label>
                      <Input
                        id="max_members"
                        type="number"
                        min={2}
                        max={10}
                        value={newTeamData.max_members}
                        onChange={(e) => setNewTeamData({ ...newTeamData, max_members: parseInt(e.target.value) || 5 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newTeamData.category}
                        onChange={(e) => setNewTeamData({ ...newTeamData, category: e.target.value as any })}
                      >
                        <option value="fashion">Fashion</option>
                        <option value="textile">Textile</option>
                        <option value="jewelry">Jewelry</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_open"
                      checked={newTeamData.is_open}
                      onChange={(e) => setNewTeamData({ ...newTeamData, is_open: e.target.checked })}
                    />
                    <Label htmlFor="is_open" className="cursor-pointer font-normal">
                      Allow anyone to request to join
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTeam}
                    disabled={isCreating || newTeamData.name.trim().length < 3}
                  >
                    {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Team
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
=======
          <Button variant="accent" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Team
          </Button>
        </div>

        <Tabs defaultValue="my-team" className="space-y-6">
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          <TabsList>
            <TabsTrigger value="my-team">My Team</TabsTrigger>
            <TabsTrigger value="challenges" className="gap-1">
              <Swords className="h-4 w-4" />
              Team Challenges
            </TabsTrigger>
            <TabsTrigger value="discover">Discover Teams</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>

          <TabsContent value="my-team" className="space-y-6">
<<<<<<< HEAD
            {!myTeam ? (
              <EmptyStateCard
                icon={Users}
                title="No Team Yet"
                description="Create or join a team to collaborate with other designers on challenges"
                action={
                  <Button variant="accent" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Create Team
                  </Button>
                }
              />
            ) : (
              <>
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
                          <p className="text-muted-foreground">{myTeam.description || "No description"}</p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{myTeam.member_count}/{myTeam.max_members} members</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{myTeam.completed_challenges} challenges completed</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="default" className="gap-2" disabled>
                            <MessageCircle className="h-4 w-4" />
                            Team Chat
                          </Button>
                          <Button variant="outline" className="gap-2" disabled>
                            <UserPlus className="h-4 w-4" />
                            Invite
                          </Button>
                          <Button 
                            variant="outline" 
                            className="gap-2 ml-auto text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              if (confirm("Are you sure you want to leave this team?")) {
                                leaveTeam();
                              }
                            }}
                          >
                            <LogOut className="h-4 w-4" />
                            Leave Team
                          </Button>
                        </div>
                      </div>

                      {/* Current Project */}
                      {myTeam.active_project && (
                        <Card className="lg:w-80 bg-secondary/50">
                          <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground mb-2">Current Project</p>
                            <h3 className="font-display font-semibold mb-3">{myTeam.active_project}</h3>
                            <Button variant="outline" size="sm" className="w-full gap-2 group">
                              View Project
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </Button>
                          </CardContent>
                        </Card>
                      )}
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
                      {myTeam.members.map((member) => (
                        <Card key={member.user_id} hover className="overflow-hidden">
                          <CardContent className="p-4 text-center">
                            <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-border">
                              <AvatarImage src={member.avatar || undefined} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-medium truncate">{member.name}</h3>
                            <div className="flex items-center justify-center gap-2 mt-1">
                              {member.role === "lead" && (
                                <Crown className="h-4 w-4 text-accent" />
                              )}
                              <Badge variant="secondary">{member.role === 'lead' ? 'Leader' : 'Member'}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Joined {new Date(member.joined_at).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Join Requests (Team Leads Only) */}
                {joinRequests.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Join Requests ({joinRequests.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {joinRequests.map((request) => (
                          <div key={request.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={request.user_avatar || undefined} />
                              <AvatarFallback>{request.user_name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{request.user_name}</p>
                              {request.message && (
                                <p className="text-sm text-muted-foreground mt-1">{request.message}</p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(request.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                className="gap-1"
                                onClick={() => respondToJoinRequest(request.id, true)}
                              >
                                <Check className="h-4 w-4" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                onClick={() => respondToJoinRequest(request.id, false)}
                              >
                                <X className="h-4 w-4" />
                                Decline
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
=======
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sovereign Atelier Challenge */}
              <TeamStyleboxCard
                title={SOVEREIGN_ATELIER_CHALLENGE.title}
                description={SOVEREIGN_ATELIER_CHALLENGE.description}
                difficulty="insane"
                teamSize={SOVEREIGN_ATELIER_CHALLENGE.team_size}
                minimumRankOrder={4}
                timeLimit={SOVEREIGN_ATELIER_CHALLENGE.time_limit_hours}
                xpReward={SOVEREIGN_ATELIER_CHALLENGE.xp_reward}
                roles={SOVEREIGN_ATELIER_ROLES}
                isTeamEligible={isTeamEligible}
<<<<<<< HEAD
                currentTeamSize={myTeam?.member_count || 0}
=======
                currentTeamSize={myTeam.members.length}
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
                onViewDetails={() => console.log('View details')}
                onStartChallenge={() => console.log('Start challenge')}
              />
            </div>

            {/* Info section */}
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Crown className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-1">Team Challenges</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete team challenges to earn exclusive badges and unlock Rank 4+ progression. 
                      Each team member takes on a specialized role with unique deliverables.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                        ✂️ Master Cutter
                      </Badge>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                        🪡 Needle Artisan
                      </Badge>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                        💃 Drape Stylist
                      </Badge>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                        👁️ Creative Lead
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
<<<<<<< HEAD
                <Input 
                  placeholder="Search teams..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredTeams.length === 0 ? (
              <EmptyStateCard
                icon={Search}
                title="No Teams Found"
                description={searchQuery ? "Try adjusting your search" : "No public teams available yet"}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.map((team) => (
                  <Card key={team.id} hover className={team.is_preview ? "border-dashed border-2 overflow-hidden" : "overflow-hidden"}>
                    {/* Team Banner */}
                    {team.banner_url && (
                      <div className="h-32 w-full bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                        <img 
                          src={team.banner_url} 
                          alt={team.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Team Logo */}
                        {team.logo_url ? (
                          <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-border shrink-0">
                            <img 
                              src={team.logo_url} 
                              alt={team.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.parentElement!.innerHTML = `
                                  <div class="h-full w-full bg-accent/10 flex items-center justify-center">
                                    <svg class="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                  </div>
                                `;
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                            <Users className="h-8 w-8 text-accent" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-display text-lg font-semibold line-clamp-1">{team.name}</h3>
                            <div className="flex flex-col gap-1 items-end shrink-0">
                              <Badge variant="outline" className="text-xs">{team.category}</Badge>
                              {team.is_preview && (
                                <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs">
                                  Preview
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {team.description || "No description"}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{team.member_count || 0}/{team.max_members}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs">{team.completed_challenges} challenges</span>
                        </div>
                      </div>
                      
                      {team.is_preview ? (
                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center">
                          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                            Preview team - Reach Rank 3 to create your own
                          </p>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => requestToJoin(team.id)}
                          disabled={!!myTeam || !team.is_open}
                        >
                          {myTeam ? 'Already in Team' : team.is_open ? 'Request to Join' : 'Private Team'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="invitations">
            {invitations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="h-16 w-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">No Invitations</h3>
                  <p className="text-muted-foreground">
                    You don't have any pending team invitations
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <Card key={invitation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                          <Users className="h-6 w-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-lg font-semibold mb-1">{invitation.team_name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Invited by <span className="font-medium">{invitation.inviter_name}</span>
                          </p>
                          {invitation.message && (
                            <p className="text-sm bg-muted/50 p-3 rounded-lg mb-3">
                              {invitation.message}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(invitation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            className="gap-1"
                            onClick={async () => {
                              await respondToInvitation(invitation.id, true);
                              setActiveTab("my-team");
                            }}
                          >
                            <Check className="h-4 w-4" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            className="gap-1"
                            onClick={() => respondToInvitation(invitation.id, false)}
                          >
                            <X className="h-4 w-4" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
=======
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
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Teams;
