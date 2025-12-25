import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, Clock } from "lucide-react";

interface Application {
  id: string;
  job_id: string;
  status: string;
  applied_at: string;
  cover_letter: string | null;
  portfolio_url: string | null;
  interview_date: string | null;
  jobs?: {
    title: string;
    company_name: string | null;
    company_logo: string | null;
    location: string | null;
    job_type: string | null;
  };
}

interface ApplicationCardProps {
  application: Application;
  onClick?: () => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    applied: { label: 'Applied', variant: 'secondary' },
    shortlisted: { label: 'Shortlisted', variant: 'default' },
    rejected: { label: 'Rejected', variant: 'destructive' },
    hired: { label: 'Hired', variant: 'default' },
  };

  const config = statusConfig[status] || { label: status, variant: 'outline' as const };
  
  return (
    <Badge 
      variant={config.variant}
      className={status === 'hired' ? 'bg-green-500 hover:bg-green-600' : ''}
    >
      {config.label}
    </Badge>
  );
};

const formatJobType = (type: string | null) => {
  if (!type) return 'Full Time';
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  const job = application.jobs;

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            {job?.company_logo ? (
              <img 
                src={job.company_logo} 
                alt={job.company_name || 'Company'} 
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium line-clamp-1">{job?.title || 'Unknown Position'}</h4>
                <p className="text-sm text-muted-foreground">{job?.company_name || 'Company'}</p>
              </div>
              {getStatusBadge(application.status)}
            </div>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Applied {new Date(application.applied_at).toLocaleDateString()}
              </div>
              {application.interview_date && (
                <div className="flex items-center gap-1 text-primary">
                  <Clock className="h-3 w-3" />
                  Interview: {new Date(application.interview_date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
