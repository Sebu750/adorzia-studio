import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Bookmark,
  BookmarkCheck,
  Building2,
  Briefcase,
  Calendar,
  CheckCircle2,
  Globe,
  Mail,
  Star,
  Users
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company_name: string | null;
  company_logo: string | null;
  location: string | null;
  location_type: string | null;
  job_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_type: string | null;
  description: string | null;
  requirements: string[] | null;
  benefits: string[] | null;
  tags: string[] | null;
  is_featured: boolean | null;
  deadline: string | null;
  category: string | null;
  contact_email: string | null;
  external_link: string | null;
  application_count: number | null;
  created_at: string;
}

interface JobDetailModalProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaved?: boolean;
  hasApplied?: boolean;
  onSave: (jobId: string) => void;
  onApply: (job: Job) => void;
}

const formatSalary = (min: number | null, max: number | null, type: string | null) => {
  if (!min && !max) return 'Competitive';
  const formatNum = (n: number) => n.toLocaleString();
  const suffix = type === 'hourly' ? '/hour' : type === 'monthly' ? '/month' : '/year';
  if (min && max) return `$${formatNum(min)} - $${formatNum(max)}${suffix}`;
  if (min) return `$${formatNum(min)}+${suffix}`;
  if (max) return `Up to $${formatNum(max)}${suffix}`;
  return 'Competitive';
};

const formatJobType = (type: string | null) => {
  if (!type) return 'Full Time';
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatLocationType = (type: string | null) => {
  if (!type) return 'Remote';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export function JobDetailModal({ 
  job, 
  open, 
  onOpenChange, 
  isSaved, 
  hasApplied, 
  onSave, 
  onApply 
}: JobDetailModalProps) {
  if (!job) return null;

  const requirements = Array.isArray(job.requirements) ? job.requirements : [];
  const benefits = Array.isArray(job.benefits) ? job.benefits : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="text-left">
              {job.is_featured && (
                <Badge className="w-fit mb-2 bg-primary/10 text-primary border-0">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured Position
                </Badge>
              )}
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border/50 flex-shrink-0">
                  {job.company_logo ? (
                    <img 
                      src={job.company_logo} 
                      alt={job.company_name || 'Company'} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-xl font-semibold mb-1">
                    {job.title}
                  </DialogTitle>
                  <p className="text-muted-foreground">
                    {job.company_name || 'Company Name'}
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Location
                </div>
                <p className="font-medium text-sm">
                  {job.location || formatLocationType(job.location_type)}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  Type
                </div>
                <p className="font-medium text-sm">{formatJobType(job.job_type)}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  Salary
                </div>
                <p className="font-medium text-sm">
                  {formatSalary(job.salary_min, job.salary_max, job.salary_type)}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Users className="h-3.5 w-3.5" />
                  Applicants
                </div>
                <p className="font-medium text-sm">{job.application_count || 0} applied</p>
              </div>
            </div>

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {job.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Separator className="my-6" />

            {/* Description */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">About This Role</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {job.description || 'No description provided.'}
              </p>
            </div>

            {/* Requirements */}
            {requirements.length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Requirements</h3>
                  <ul className="space-y-2">
                    {requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Benefits & Perks</h3>
                  <ul className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Additional Info */}
            <Separator className="my-6" />
            <div className="space-y-3">
              {job.deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Application Deadline:</span>
                  <span className="font-medium">
                    {new Date(job.deadline).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {job.contact_email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Contact:</span>
                  <a href={`mailto:${job.contact_email}`} className="font-medium text-primary hover:underline">
                    {job.contact_email}
                  </a>
                </div>
              )}
              {job.external_link && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">External Link:</span>
                  <a href={job.external_link} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                    View on Company Site
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Posted:</span>
                <span className="font-medium">
                  {new Date(job.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => onApply(job)}
                disabled={hasApplied}
              >
                {hasApplied ? 'Already Applied' : 'Apply Now'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onSave(job.id)}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 mr-2 fill-current" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
