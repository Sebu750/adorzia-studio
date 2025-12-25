import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2, Send, Loader2 } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company_name: string | null;
  company_logo: string | null;
}

interface JobApplicationFormProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { cover_letter: string; portfolio_url: string }) => Promise<void>;
  isSubmitting: boolean;
}

export function JobApplicationForm({ 
  job, 
  open, 
  onOpenChange, 
  onSubmit,
  isSubmitting
}: JobApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      cover_letter: coverLetter,
      portfolio_url: portfolioUrl
    });
    setCoverLetter("");
    setPortfolioUrl("");
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply for Position</DialogTitle>
          <DialogDescription>
            Submit your application for {job.title} at {job.company_name || 'the company'}
          </DialogDescription>
        </DialogHeader>

        {/* Job Preview */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center overflow-hidden border border-border/50">
            {job.company_logo ? (
              <img 
                src={job.company_logo} 
                alt={job.company_name || 'Company'} 
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{job.title}</p>
            <p className="text-xs text-muted-foreground">{job.company_name || 'Company'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio URL</Label>
            <Input
              id="portfolio"
              type="url"
              placeholder="https://your-portfolio.com"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Link to your portfolio, Behance, Dribbble, or personal website
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-letter">Cover Letter</Label>
            <Textarea
              id="cover-letter"
              placeholder="Tell us why you're a great fit for this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              Briefly introduce yourself and explain your interest in this position
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !coverLetter.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
