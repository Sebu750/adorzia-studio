import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  ExternalLink, 
  Loader2, 
  Mail, 
  User,
  Building2,
  FileText,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Application {
  id: string;
  job_id: string;
  designer_id: string;
  status: string;
  cover_letter: string | null;
  portfolio_url: string | null;
  notes: string | null;
  interview_date: string | null;
  applied_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  jobs?: {
    title: string;
    company_name: string | null;
  };
  profiles?: {
    name: string | null;
    email: string | null;
    avatar_url: string | null;
    category: string | null;
  };
}

interface ApplicationsTableProps {
  applications: Application[];
  isLoading?: boolean;
  onUpdateStatus: (applicationId: string, status: string, notes?: string, interviewDate?: string) => Promise<void>;
  selectedJobId?: string | null;
  onJobFilter: (jobId: string | null) => void;
  jobs: { id: string; title: string }[];
}

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    applied: { label: 'Applied', className: 'bg-blue-500/10 text-blue-500' },
    shortlisted: { label: 'Shortlisted', className: 'bg-yellow-500/10 text-yellow-500' },
    rejected: { label: 'Rejected', className: 'bg-red-500/10 text-red-500' },
    hired: { label: 'Hired', className: 'bg-green-500/10 text-green-500' },
  };

  const config = statusConfig[status] || statusConfig.applied;
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

export function ApplicationsTable({ 
  applications, 
  isLoading, 
  onUpdateStatus, 
  selectedJobId,
  onJobFilter,
  jobs
}: ApplicationsTableProps) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [interviewDate, setInterviewDate] = useState("");

  const openReview = (app: Application) => {
    setSelectedApp(app);
    setNotes(app.notes || "");
    setNewStatus(app.status);
    setInterviewDate(app.interview_date ? app.interview_date.split('T')[0] : "");
    setSheetOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setUpdating(true);
    try {
      await onUpdateStatus(
        selectedApp.id, 
        newStatus, 
        notes,
        interviewDate ? new Date(interviewDate).toISOString() : undefined
      );
      setSheetOpen(false);
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Filter */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-64">
          <Select value={selectedJobId || 'all'} onValueChange={(v) => onJobFilter(v === 'all' ? null : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map(job => (
                <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No applications found</h3>
            <p className="text-sm text-muted-foreground">Applications will appear here when designers apply</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Applicant</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Interview</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={app.profiles?.avatar_url || undefined} />
                        <AvatarFallback>
                          {app.profiles?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{app.profiles?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{app.profiles?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{app.jobs?.title || 'Unknown Job'}</p>
                      <p className="text-xs text-muted-foreground">{app.jobs?.company_name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(app.applied_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-sm">
                    {app.interview_date ? (
                      <div className="flex items-center gap-1 text-primary">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(app.interview_date).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openReview(app)}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Review Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Review Application</SheetTitle>
          </SheetHeader>

          {selectedApp && (
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <div className="space-y-6 py-4">
                {/* Applicant Info */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={selectedApp.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="text-lg">
                      {selectedApp.profiles?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedApp.profiles?.name || 'Unknown'}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {selectedApp.profiles?.email}
                    </div>
                    {selectedApp.profiles?.category && (
                      <Badge variant="outline" className="mt-2 capitalize">
                        {selectedApp.profiles.category} Designer
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Job Info */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Applied for</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{selectedApp.jobs?.title}</p>
                      <p className="text-sm text-muted-foreground">{selectedApp.jobs?.company_name}</p>
                    </div>
                  </div>
                </div>

                {/* Applied Date */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Applied:</span>
                  <span>{new Date(selectedApp.applied_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </div>

                {/* Portfolio */}
                {selectedApp.portfolio_url && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Portfolio</Label>
                    <a 
                      href={selectedApp.portfolio_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Portfolio
                    </a>
                  </div>
                )}

                <Separator />

                {/* Cover Letter */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Cover Letter</Label>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedApp.cover_letter || 'No cover letter provided.'}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Status Update */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Interview Date</Label>
                    <Input
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Admin Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this application..."
                      rows={4}
                    />
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleUpdateStatus}
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Application'
                    )}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
