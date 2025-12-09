import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Check, 
  AlertCircle,
  Package,
  ShoppingBag,
  Eye,
  FileSearch,
  Scissors,
  DollarSign,
  Factory,
  Store,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  PublicationStatus, 
  PUBLICATION_STATUSES,
  getStatusStageProgress
} from "@/lib/publication";
import { motion } from "framer-motion";

interface PublicationStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    title: string;
    thumbnail: string;
    publicationStatus: PublicationStatus;
    submittedAt?: string;
    lastUpdated?: string;
    reviewerNotes?: string;
  };
}

const stageConfig = {
  submission: { 
    label: "Submission", 
    icon: Eye,
    color: "text-muted-foreground" 
  },
  review: { 
    label: "Review", 
    icon: FileSearch,
    color: "text-warning" 
  },
  production: { 
    label: "Production", 
    icon: Factory,
    color: "text-accent" 
  },
  marketplace: { 
    label: "Marketplace", 
    icon: Store,
    color: "text-success" 
  },
};

const statusIcons: Record<PublicationStatus, React.ElementType> = {
  draft: Clock,
  pending_review: FileSearch,
  revision_requested: AlertCircle,
  approved: Check,
  sampling: Scissors,
  sample_ready: Package,
  costing_ready: DollarSign,
  pre_production: Factory,
  marketplace_pending: ShoppingBag,
  listing_preview: Eye,
  published: CheckCircle2,
  rejected: XCircle,
};

const statusColors: Record<PublicationStatus, string> = {
  draft: "text-muted-foreground bg-muted",
  pending_review: "text-warning bg-warning/10",
  revision_requested: "text-orange-500 bg-orange-500/10",
  approved: "text-success bg-success/10",
  sampling: "text-accent bg-accent/10",
  sample_ready: "text-accent bg-accent/10",
  costing_ready: "text-accent bg-accent/10",
  pre_production: "text-accent bg-accent/10",
  marketplace_pending: "text-accent bg-accent/10",
  listing_preview: "text-success bg-success/10",
  published: "text-success bg-success/10",
  rejected: "text-destructive bg-destructive/10",
};

export function PublicationStatusModal({
  open,
  onOpenChange,
  project,
}: PublicationStatusModalProps) {
  const statusConfig = PUBLICATION_STATUSES[project.publicationStatus];
  const stageProgress = getStatusStageProgress(project.publicationStatus);
  const StatusIcon = statusIcons[project.publicationStatus];

  // Build timeline of stages
  const stages = ['submission', 'review', 'production', 'marketplace'] as const;
  const currentStageIndex = stages.indexOf(statusConfig.stage);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StatusIcon className="h-5 w-5 text-accent" />
            Publication Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Info */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 border border-border">
            <div className="h-14 w-14 rounded-lg overflow-hidden shrink-0">
              <img 
                src={project.thumbnail} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-semibold truncate">{project.title}</h3>
              {project.submittedAt && (
                <p className="text-xs text-muted-foreground">
                  Submitted {project.submittedAt}
                </p>
              )}
            </div>
          </div>

          {/* Current Status */}
          <div className={cn(
            "flex items-center gap-3 p-4 rounded-xl border",
            statusColors[project.publicationStatus]
          )}>
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              statusColors[project.publicationStatus]
            )}>
              <StatusIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{statusConfig.label}</p>
              <p className="text-sm opacity-80">{statusConfig.description}</p>
            </div>
          </div>

          {/* Reviewer Notes (if revision requested) */}
          {project.publicationStatus === 'revision_requested' && project.reviewerNotes && (
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <p className="text-sm font-medium text-orange-600 mb-1">Reviewer Feedback:</p>
              <p className="text-sm text-muted-foreground">{project.reviewerNotes}</p>
            </div>
          )}

          {/* Stage Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{stageProgress}%</span>
            </div>
            <Progress value={stageProgress} className="h-2" />
          </div>

          {/* Stage Timeline */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Journey</p>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
              
              <div className="space-y-4">
                {stages.map((stage, index) => {
                  const config = stageConfig[stage];
                  const Icon = config.icon;
                  const isComplete = index < currentStageIndex;
                  const isCurrent = index === currentStageIndex;
                  const isPending = index > currentStageIndex;
                  
                  return (
                    <motion.div
                      key={stage}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 relative"
                    >
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center z-10",
                        isComplete && "bg-success text-success-foreground",
                        isCurrent && "bg-accent text-accent-foreground ring-2 ring-accent/30 ring-offset-2 ring-offset-background",
                        isPending && "bg-muted text-muted-foreground"
                      )}>
                        {isComplete ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <div className={cn(
                        "flex-1",
                        isPending && "opacity-50"
                      )}>
                        <p className={cn(
                          "font-medium",
                          isCurrent && "text-accent"
                        )}>
                          {config.label}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-muted-foreground">
                            {statusConfig.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Last Updated */}
          {project.lastUpdated && (
            <p className="text-xs text-muted-foreground text-center">
              Last updated: {project.lastUpdated}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
