import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";

interface Job {
  id?: string;
  title: string;
  company_name: string | null;
  company_logo: string | null;
  description: string | null;
  location: string | null;
  location_type: string | null;
  job_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_type: string | null;
  category: string | null;
  requirements: string[];
  benefits: string[];
  tags: string[];
  is_featured: boolean | null;
  status: string | null;
  deadline: string | null;
  contact_email: string | null;
  external_link: string | null;
}

interface JobFormProps {
  job?: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Job>) => Promise<void>;
  isSubmitting: boolean;
}

const defaultJob: Job = {
  title: '',
  company_name: '',
  company_logo: '',
  description: '',
  location: '',
  location_type: 'remote',
  job_type: 'full_time',
  salary_min: null,
  salary_max: null,
  salary_type: 'annual',
  category: 'fashion',
  requirements: [],
  benefits: [],
  tags: [],
  is_featured: false,
  status: 'draft',
  deadline: null,
  contact_email: '',
  external_link: '',
};

export function JobForm({ job, open, onOpenChange, onSubmit, isSubmitting }: JobFormProps) {
  const [formData, setFormData] = useState<Job>(defaultJob);
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({
        ...defaultJob,
        ...job,
        requirements: Array.isArray(job.requirements) ? job.requirements : [],
        benefits: Array.isArray(job.benefits) ? job.benefits : [],
        tags: Array.isArray(job.tags) ? job.tags : [],
      });
    } else {
      setFormData(defaultJob);
    }
  }, [job, open]);

  const updateField = <K extends keyof Job>(key: K, value: Job[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const addArrayItem = (field: 'requirements' | 'benefits' | 'tags', value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const removeArrayItem = (field: 'requirements' | 'benefits' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const isEditing = !!job?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Job' : 'Create New Job'}</DialogTitle>
            </DialogHeader>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g., Senior Fashion Designer"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company_name || ''}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  placeholder="Company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo URL</Label>
                <Input
                  id="logo"
                  value={formData.company_logo || ''}
                  onChange={(e) => updateField('company_logo', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe the role, responsibilities, and what makes it exciting..."
                rows={5}
              />
            </div>

            {/* Location & Type */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={formData.category || 'fashion'} 
                  onValueChange={(v) => updateField('category', v)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="textile">Textile</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select 
                  value={formData.job_type || 'full_time'} 
                  onValueChange={(v) => updateField('job_type', v)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Location Type</Label>
                <Select 
                  value={formData.location_type || 'remote'} 
                  onValueChange={(v) => updateField('location_type', v)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Salary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Min Salary</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={formData.salary_min || ''}
                  onChange={(e) => updateField('salary_min', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="e.g., 50000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMax">Max Salary</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={formData.salary_max || ''}
                  onChange={(e) => updateField('salary_max', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="e.g., 80000"
                />
              </div>

              <div className="space-y-2">
                <Label>Salary Type</Label>
                <Select 
                  value={formData.salary_type || 'annual'} 
                  onValueChange={(v) => updateField('salary_type', v)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="project">Per Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label>Requirements</Label>
              <div className="flex gap-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add a requirement..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addArrayItem('requirements', newRequirement, setNewRequirement);
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => addArrayItem('requirements', newRequirement, setNewRequirement)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.requirements.map((req, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {req}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeArrayItem('requirements', idx)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <Label>Benefits</Label>
              <div className="flex gap-2">
                <Input
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Add a benefit..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addArrayItem('benefits', newBenefit, setNewBenefit);
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => addArrayItem('benefits', newBenefit, setNewBenefit)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.benefits.map((benefit, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {benefit}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeArrayItem('benefits', idx)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addArrayItem('tags', newTag, setNewTag);
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => addArrayItem('tags', newTag, setNewTag)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeArrayItem('tags', idx)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact & Links */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contact_email || ''}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  placeholder="hr@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline ? formData.deadline.split('T')[0] : ''}
                  onChange={(e) => updateField('deadline', e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalLink">External Application Link</Label>
              <Input
                id="externalLink"
                type="url"
                value={formData.external_link || ''}
                onChange={(e) => updateField('external_link', e.target.value)}
                placeholder="https://company.com/careers/..."
              />
            </div>

            {/* Status & Featured */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status || 'draft'} 
                  onValueChange={(v) => updateField('status', v)}
                >
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-3">
                <Label htmlFor="featured">Featured Job</Label>
                <Switch
                  id="featured"
                  checked={formData.is_featured || false}
                  onCheckedChange={(v) => updateField('is_featured', v)}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Job' : 'Create Job'
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
