import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Users, 
  UserCheck, 
  Trophy, 
  BarChart3, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Crown,
  Calendar,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminTeams = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState("");

  // Fetch teams with member counts
  const { data: teams = [], isLoading: teamsLoading, refetch: refetchTeams } = useQuery({
    queryKey: ['admin-teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          profiles(name, email),
          team_members(count)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch team challenges/submissions
  const { data: submissions = [], isLoading: submissionsLoading, refetch: refetchSubmissions } = useQuery({
    queryKey: ['admin-team-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_stylebox_submissions')
        .select(`
          *,
          teams(name),
          styleboxes(title)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, feedback }: { id: string; status: string; feedback?: string }) => {
      const { error } = await supabase
        .from('team_stylebox_submissions')
        .update({ 
          status, 
          admin_feedback: feedback ? { comment: feedback } : undefined,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-submissions'] });
      setIsReviewOpen(false);
      setReviewFeedback("");
      toast({ title: "Submission status updated" });
    },
    onError: (error: any) => {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
  });

  const handleReview = (submission: any) => {
    setSelectedSubmission(submission);
    setIsReviewOpen(true);
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Teams & Challenges</h1>
            <p className="text-muted-foreground mt-1">Manage designer collectives and team-based certifications</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={() => { refetchTeams(); refetchSubmissions(); }}>
              <RefreshCw className={cn("h-4 w-4", (teamsLoading || submissionsLoading) && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="teams" className="space-y-6">
          <TabsList>
            <TabsTrigger value="teams" className="gap-2">
              <Users className="h-4 w-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              Submissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search teams by name..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Founder</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-admin-wine" />
                        </TableCell>
                      </TableRow>
                    ) : filteredTeams.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          No teams found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTeams.map((team) => (
                        <TableRow key={team.id}>
                          <TableCell className="font-medium">{team.name}</TableCell>
                          <TableCell>
                            <p className="text-sm">{team.profiles?.name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{team.profiles?.email || ''}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{team.category}</Badge>
                          </TableCell>
                          <TableCell>{team.team_members?.[0]?.count || 0}</TableCell>
                          <TableCell>{new Date(team.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Members
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Disband Team
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team</TableHead>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Started At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissionsLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-admin-wine" />
                        </TableCell>
                      </TableRow>
                    ) : submissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          No challenge submissions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      submissions.map((sub: any) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.teams?.name}</TableCell>
                          <TableCell>{sub.styleboxes?.title}</TableCell>
                          <TableCell>{sub.started_at ? new Date(sub.started_at).toLocaleDateString() : 'Not started'}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                sub.status === 'approved' ? 'success' : 
                                sub.status === 'rejected' ? 'destructive' : 
                                sub.status === 'pending' ? 'warning' : 'outline'
                              }
                              className="capitalize"
                            >
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleReview(sub)}
                              disabled={sub.status !== 'pending'}
                            >
                              <ShieldCheck className="h-4 w-4" />
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Team Submission</DialogTitle>
              <DialogDescription>
                Certify the team's completion of {selectedSubmission?.styleboxes?.title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Team</p>
                  <p className="font-medium">{selectedSubmission?.teams?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Submitted At</p>
                  <p className="font-medium">{selectedSubmission?.submitted_at ? new Date(selectedSubmission.submitted_at).toLocaleString() : 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Internal Feedback</p>
                <Input 
                  placeholder="Notes for the team..." 
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                />
              </div>

              {/* Roles Summary could go here */}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => updateStatusMutation.mutate({ id: selectedSubmission.id, status: 'rejected', feedback: reviewFeedback })}
                disabled={updateStatusMutation.isPending}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button 
                variant="success" 
                onClick={() => updateStatusMutation.mutate({ id: selectedSubmission.id, status: 'approved', feedback: reviewFeedback })}
                disabled={updateStatusMutation.isPending}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve & Certify
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTeams;
