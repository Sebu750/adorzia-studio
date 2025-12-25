import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  Star, 
  StarOff,
  Play,
  Pause,
  CheckCircle,
  Users
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company_name: string | null;
  category: string | null;
  job_type: string | null;
  location_type: string | null;
  status: string | null;
  is_featured: boolean | null;
  application_count: number | null;
  created_at: string;
}

interface JobsTableProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDuplicate: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onToggleStatus: (jobId: string, status: string) => void;
  onToggleFeatured: (jobId: string, featured: boolean) => void;
  onViewApplications: (jobId: string) => void;
}

const getStatusBadge = (status: string | null) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-gray-500/10 text-gray-500' },
    active: { label: 'Active', className: 'bg-green-500/10 text-green-500' },
    paused: { label: 'Paused', className: 'bg-yellow-500/10 text-yellow-500' },
    closed: { label: 'Closed', className: 'bg-red-500/10 text-red-500' },
    expired: { label: 'Expired', className: 'bg-gray-500/10 text-gray-400' },
  };

  const config = statusConfig[status || 'draft'] || statusConfig.draft;
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

const formatJobType = (type: string | null) => {
  if (!type) return 'Full Time';
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export function JobsTable({ 
  jobs, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onToggleStatus, 
  onToggleFeatured,
  onViewApplications 
}: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-1">No jobs found</h3>
          <p className="text-sm text-muted-foreground">Create your first job posting to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Job</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Applications</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {job.is_featured && (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.company_name || 'No company'}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {job.category || 'fashion'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatJobType(job.job_type)}
              </TableCell>
              <TableCell>{getStatusBadge(job.status)}</TableCell>
              <TableCell className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => onViewApplications(job.id)}
                >
                  <Users className="h-3.5 w-3.5" />
                  {job.application_count || 0}
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(job)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(job)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewApplications(job.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Applications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onToggleFeatured(job.id, !job.is_featured)}>
                      {job.is_featured ? (
                        <>
                          <StarOff className="h-4 w-4 mr-2" />
                          Remove Featured
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Make Featured
                        </>
                      )}
                    </DropdownMenuItem>
                    {job.status === 'active' ? (
                      <DropdownMenuItem onClick={() => onToggleStatus(job.id, 'paused')}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </DropdownMenuItem>
                    ) : job.status === 'paused' ? (
                      <DropdownMenuItem onClick={() => onToggleStatus(job.id, 'active')}>
                        <Play className="h-4 w-4 mr-2" />
                        Activate
                      </DropdownMenuItem>
                    ) : job.status === 'draft' ? (
                      <DropdownMenuItem onClick={() => onToggleStatus(job.id, 'active')}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Publish
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(job.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
