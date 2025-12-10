import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff,
  Settings,
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronUp,
  Type,
  Image,
  LayoutGrid,
  User,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { PortfolioSection, SectionType } from '@/lib/portfolio';

const SECTION_ICONS: Record<SectionType, typeof Type> = {
  text: Type,
  gallery: LayoutGrid,
  hero: Image,
  about: User,
  contact: Mail,
};

interface SectionEditorProps {
  section: PortfolioSection;
  onUpdate: (updates: Partial<PortfolioSection>) => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

export function SectionEditor({
  section,
  onUpdate,
  onDelete,
  dragHandleProps,
}: SectionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);

  const Icon = SECTION_ICONS[section.section_type as SectionType] || Type;

  const handleTitleSave = () => {
    onUpdate({ title });
    setIsEditing(false);
  };

  const handleContentChange = (key: string, value: any) => {
    onUpdate({
      content: { ...section.content, [key]: value },
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className={cn(
        'transition-all',
        !section.is_visible && 'opacity-50'
      )}>
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center gap-3">
            <div
              {...dragHandleProps}
              className="p-1 rounded cursor-grab active:cursor-grabbing hover:bg-muted"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="p-1.5 rounded bg-muted">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                  className="h-8 text-sm"
                  autoFocus
                />
              ) : (
                <span 
                  className="font-medium truncate cursor-pointer hover:text-primary"
                  onClick={() => setIsEditing(true)}
                >
                  {section.title}
                </span>
              )}
              
              <Badge variant="outline" className="text-xs capitalize shrink-0">
                {section.section_type}
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onUpdate({ is_visible: !section.is_visible })}
              >
                {section.is_visible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            </div>
          </div>
        </CardHeader>

        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <CardContent className="p-4 pt-4">
              <SectionContent
                type={section.section_type as SectionType}
                content={section.content}
                onChange={handleContentChange}
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}

interface SectionContentProps {
  type: SectionType;
  content: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

function SectionContent({ type, content, onChange }: SectionContentProps) {
  switch (type) {
    case 'text':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Heading</Label>
            <Input
              value={content.heading || ''}
              onChange={(e) => onChange('heading', e.target.value)}
              placeholder="Section heading"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Content</Label>
            <Textarea
              value={content.body || ''}
              onChange={(e) => onChange('body', e.target.value)}
              placeholder="Write your content here..."
              rows={4}
              className="mt-1"
            />
          </div>
        </div>
      );

    case 'hero':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Headline</Label>
            <Input
              value={content.headline || ''}
              onChange={(e) => onChange('headline', e.target.value)}
              placeholder="Your name or brand"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Tagline</Label>
            <Input
              value={content.tagline || ''}
              onChange={(e) => onChange('tagline', e.target.value)}
              placeholder="A brief tagline"
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Show scroll indicator</Label>
            <Switch
              checked={content.showScroll || false}
              onCheckedChange={(v) => onChange('showScroll', v)}
            />
          </div>
        </div>
      );

    case 'about':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Bio</Label>
            <Textarea
              value={content.bio || ''}
              onChange={(e) => onChange('bio', e.target.value)}
              placeholder="Tell your story..."
              rows={4}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Location</Label>
            <Input
              value={content.location || ''}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="City, Country"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Specialties (comma separated)</Label>
            <Input
              value={content.specialties || ''}
              onChange={(e) => onChange('specialties', e.target.value)}
              placeholder="Fashion, Textile, Jewelry"
              className="mt-1"
            />
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input
              type="email"
              value={content.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="your@email.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Website</Label>
            <Input
              value={content.website || ''}
              onChange={(e) => onChange('website', e.target.value)}
              placeholder="https://yoursite.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Social Links (JSON)</Label>
            <Input
              value={content.social || ''}
              onChange={(e) => onChange('social', e.target.value)}
              placeholder='{"instagram": "@handle"}'
              className="mt-1"
            />
          </div>
        </div>
      );

    case 'gallery':
    default:
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Grid columns</Label>
            <select
              value={content.columns || '3'}
              onChange={(e) => onChange('columns', e.target.value)}
              className="px-3 py-1.5 border rounded-md text-sm"
            >
              <option value="2">2 columns</option>
              <option value="3">3 columns</option>
              <option value="4">4 columns</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Show captions</Label>
            <Switch
              checked={content.showCaptions || false}
              onCheckedChange={(v) => onChange('showCaptions', v)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Projects will be displayed in this section based on display order.
          </p>
        </div>
      );
  }
}
