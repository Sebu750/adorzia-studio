import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit2, Trash2, Eye, FileImage, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type CollectionStatus = 'draft' | 'pending' | 'approved' | 'revisions_required' | 'rejected';

interface CollectionSubmission {
  id: string;
  title: string;
  description: string | null;
  category: string;
  files: any[];
  thumbnail_url: string | null;
  status: CollectionStatus;
  admin_feedback: string | null;
  submitted_at: string | null;
  created_at: string;
}

interface CollectionCardProps {
  submission: CollectionSubmission;
  statusConfig: Record<CollectionStatus, { label: string; variant: any; icon: any }>;
  onEdit: (submission: CollectionSubmission) => void;
  onDelete: (id: string) => void;
}

export function CollectionCard({ submission, statusConfig, onEdit, onDelete }: CollectionCardProps) {
  // Safe access with fallback to draft config
  const config = statusConfig[submission.status] ?? statusConfig.draft;
  const StatusIcon = config?.icon;
  const canEdit = submission.status === 'draft' || submission.status === 'revisions_required';
  const canDelete = submission.status === 'draft';

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="aspect-[4/3] relative bg-muted overflow-hidden">
        {submission.thumbnail_url ? (
          <img
            src={submission.thumbnail_url}
            alt={submission.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : submission.files?.length > 0 ? (
          <img
            src={submission.files[0]?.url}
            alt={submission.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileImage className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Status Badge Overlay */}
        <div className="absolute top-3 left-3">
          <Badge variant={config.variant} className="gap-1 shadow-sm">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {canEdit && (
                <DropdownMenuItem onClick={() => onEdit(submission)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(submission.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* File Count */}
        {submission.files?.length > 0 && (
          <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
            {submission.files.length} files
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-medium truncate">{submission.title}</h3>
          <p className="text-sm text-muted-foreground capitalize">{submission.category}</p>
        </div>

        {submission.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {submission.description}
          </p>
        )}

        {/* Admin Feedback Alert */}
        {submission.admin_feedback && submission.status === 'revisions_required' && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-destructive line-clamp-2">{submission.admin_feedback}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>
            {submission.submitted_at 
              ? `Submitted ${formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}`
              : `Created ${formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}`
            }
          </span>
          {canEdit && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onEdit(submission)}>
              {submission.status === 'revisions_required' ? 'Revise' : 'Edit'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}