import { useState } from "react";
import { useWizardContext } from "../WizardContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileText, Image, Code, Package, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { DetailedDeliverable } from "@/lib/stylebox-template";

const DELIVERABLE_CATEGORIES: { value: DetailedDeliverable['category']; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'illustration', label: 'Illustration', icon: <Image className="h-4 w-4" />, color: 'bg-purple-500/20 text-purple-600' },
  { value: 'technical', label: 'Technical', icon: <Code className="h-4 w-4" />, color: 'bg-blue-500/20 text-blue-600' },
  { value: 'documentation', label: 'Documentation', icon: <FileText className="h-4 w-4" />, color: 'bg-amber-500/20 text-amber-600' },
  { value: 'digital', label: 'Digital', icon: <Package className="h-4 w-4" />, color: 'bg-success/20 text-success' },
  { value: 'sample', label: 'Sample', icon: <Package className="h-4 w-4" />, color: 'bg-pink-500/20 text-pink-600' },
];

export function DetailedDeliverablesTab() {
  const { formData, updateFormData } = useWizardContext();
  const deliverables = formData.detailed_deliverables || [];
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const [newDeliverable, setNewDeliverable] = useState<Partial<DetailedDeliverable>>({
    name: '',
    description: '',
    specifications: [],
    file_format: '',
    dimensions: '',
    required: true,
    category: 'illustration',
  });
  const [newSpec, setNewSpec] = useState('');

  const generateId = () => `del-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addDeliverable = () => {
    if (!newDeliverable.name?.trim()) return;
    
    const deliverable: DetailedDeliverable = {
      id: generateId(),
      name: newDeliverable.name.trim(),
      description: newDeliverable.description?.trim() || '',
      specifications: newDeliverable.specifications || [],
      file_format: newDeliverable.file_format || undefined,
      dimensions: newDeliverable.dimensions || undefined,
      required: newDeliverable.required ?? true,
      category: newDeliverable.category as DetailedDeliverable['category'],
    };
    
    updateFormData("detailed_deliverables", [...deliverables, deliverable]);
    setNewDeliverable({
      name: '',
      description: '',
      specifications: [],
      file_format: '',
      dimensions: '',
      required: true,
      category: 'illustration',
    });
  };

  const removeDeliverable = (id: string) => {
    updateFormData("detailed_deliverables", deliverables.filter(d => d.id !== id));
  };

  const toggleRequired = (id: string) => {
    const updated = deliverables.map(d => 
      d.id === id ? { ...d, required: !d.required } : d
    );
    updateFormData("detailed_deliverables", updated);
  };

  const addSpecToNew = () => {
    if (!newSpec.trim()) return;
    setNewDeliverable(prev => ({
      ...prev,
      specifications: [...(prev.specifications || []), newSpec.trim()],
    }));
    setNewSpec('');
  };

  const removeSpecFromNew = (index: number) => {
    setNewDeliverable(prev => ({
      ...prev,
      specifications: prev.specifications?.filter((_, i) => i !== index) || [],
    }));
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getCategoryInfo = (category: DetailedDeliverable['category']) => {
    return DELIVERABLE_CATEGORIES.find(c => c.value === category) || DELIVERABLE_CATEGORIES[0];
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Detailed Deliverables</h3>
        <p className="text-sm text-muted-foreground">
          Define specific deliverables with detailed specifications for production-grade submissions.
        </p>
      </div>

      {/* Current Deliverables */}
      {deliverables.length > 0 && (
        <div className="space-y-3">
          {deliverables.map((deliverable) => {
            const categoryInfo = getCategoryInfo(deliverable.category);
            const isExpanded = expandedItems.has(deliverable.id);
            
            return (
              <Collapsible key={deliverable.id} open={isExpanded}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader 
                      className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => toggleExpanded(deliverable.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                            {categoryInfo.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              {deliverable.name}
                              {deliverable.required && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                              {deliverable.specifications?.length || 0} specifications
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={categoryInfo.color}>
                            {categoryInfo.label}
                          </Badge>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      <p className="text-sm text-muted-foreground">{deliverable.description}</p>
                      
                      {deliverable.specifications && deliverable.specifications.length > 0 && (
                        <div className="space-y-1">
                          <Label className="text-xs">Specifications:</Label>
                          <ul className="space-y-1">
                            {deliverable.specifications.map((spec, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {spec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
                        {deliverable.file_format && (
                          <span>Format: {deliverable.file_format}</span>
                        )}
                        {deliverable.dimensions && (
                          <span>Size: {deliverable.dimensions}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={deliverable.required}
                            onCheckedChange={() => toggleRequired(deliverable.id)}
                          />
                          <Label className="text-sm">Required</Label>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDeliverable(deliverable.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      )}

      {/* Add New Deliverable */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            Add Deliverable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={newDeliverable.name || ''}
                onChange={(e) => setNewDeliverable(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Fashion Illustration"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={newDeliverable.category}
                onValueChange={(value) => setNewDeliverable(prev => ({ ...prev, category: value as DetailedDeliverable['category'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERABLE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className="flex items-center gap-2">
                        {cat.icon}
                        {cat.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={newDeliverable.description || ''}
              onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this deliverable should contain..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>File Format</Label>
              <Input
                value={newDeliverable.file_format || ''}
                onChange={(e) => setNewDeliverable(prev => ({ ...prev, file_format: e.target.value }))}
                placeholder="e.g., PNG, PDF, AI"
              />
            </div>
            <div className="space-y-2">
              <Label>Dimensions</Label>
              <Input
                value={newDeliverable.dimensions || ''}
                onChange={(e) => setNewDeliverable(prev => ({ ...prev, dimensions: e.target.value }))}
                placeholder="e.g., 1000x1000px"
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newDeliverable.required ?? true}
                  onCheckedChange={(checked) => setNewDeliverable(prev => ({ ...prev, required: checked }))}
                />
                <Label>Required</Label>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-2">
            <Label>Specifications</Label>
            <div className="flex gap-2">
              <Input
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="Add a specification..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecToNew())}
              />
              <Button type="button" variant="outline" onClick={addSpecToNew}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {newDeliverable.specifications && newDeliverable.specifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newDeliverable.specifications.map((spec, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {spec}
                    <button 
                      onClick={() => removeSpecFromNew(idx)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button 
            type="button" 
            onClick={addDeliverable}
            disabled={!newDeliverable.name?.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Deliverable
          </Button>
        </CardContent>
      </Card>

      {/* Empty State */}
      {deliverables.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/30">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No detailed deliverables added yet.</p>
          <p className="text-sm text-muted-foreground">Add deliverables to define what designers must submit.</p>
        </div>
      )}
    </div>
  );
}
