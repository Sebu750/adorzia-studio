import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Bookmark,
  BookmarkCheck,
  Building2,
  Briefcase,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  tags: string[] | null;
  is_featured: boolean | null;
  deadline: string | null;
  category: string | null;
  created_at: string;
}

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  hasApplied?: boolean;
  onView: (job: Job) => void;
  onSave: (jobId: string) => void;
  onApply: (job: Job) => void;
}

const formatSalary = (min: number | null, max: number | null, type: string | null) => {
  if (!min && !max) return null;
  const formatNum = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
    return n.toString();
  };
  const suffix = type === 'hourly' ? '/hr' : type === 'monthly' ? '/mo' : '/yr';
  if (min && max) return `$${formatNum(min)} - $${formatNum(max)}${suffix}`;
  if (min) return `$${formatNum(min)}+${suffix}`;
  if (max) return `Up to $${formatNum(max)}${suffix}`;
  return null;
};

const formatJobType = (type: string | null) => {
  if (!type) return 'Full Time';
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatLocationType = (type: string | null) => {
  if (!type) return 'Remote';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const getTimeAgo = (date: string) => {
  const now = new Date();
  const posted = new Date(date);
  const diffDays = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export function JobCard({ job, isSaved, hasApplied, onView, onSave, onApply }: JobCardProps) {
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_type);

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer border-border/50",
        job.is_featured && "ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
      )}
      onClick={() => onView(job)}
    >
      {job.is_featured && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </div>
        </div>
      )}
      
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border/50">
              {job.company_logo ? (
                <img 
                  src={job.company_logo} 
                  alt={job.company_name || 'Company'} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>
          
          {/* Job Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {job.company_name || 'Company Name'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave(job.id);
                }}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-primary fill-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{job.location || formatLocationType(job.location_type)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                <span>{formatJobType(job.job_type)}</span>
              </div>
              {salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>{salary}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{getTimeAgo(job.created_at)}</span>
              </div>
            </div>

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs font-normal">
                    {tag}
                  </Badge>
                ))}
                {job.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs font-normal">
                    +{job.tags.length - 4}
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(job);
                }}
                disabled={hasApplied}
                className="h-8"
              >
                {hasApplied ? 'Applied' : 'Apply Now'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(job);
                }}
                className="h-8"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
