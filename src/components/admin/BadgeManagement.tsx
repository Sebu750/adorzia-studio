import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, Award, Users } from "lucide-react";
import { toast } from "sonner";

interface AchievementBadge {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  category: string | null;
  criteria: Record<string, any>;
  created_at: string;
}

export function BadgeManagement() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<AchievementBadge | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🎖️',
    category: ''
  });

  const { data: badges, isLoading } = useQuery({
    queryKey: ['achievement-badges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievement_badges')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AchievementBadge[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (badge: Omit<AchievementBadge, 'id' | 'created_at' | 'criteria'>) => {
      const { data, error } = await supabase
        .from('achievement_badges')
        .insert([badge])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievement-badges'] });
      toast.success('Badge created successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to create badge: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AchievementBadge> & { id: string }) => {
      const { data, error } = await supabase
        .from('achievement_badges')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievement-badges'] });
      toast.success('Badge updated successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to update badge: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('achievement_badges')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievement-badges'] });
      toast.success('Badge deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete badge: ' + error.message);
    }
  });

  const handleOpenDialog = (badge?: AchievementBadge) => {
    if (badge) {
      setEditingBadge(badge);
      setFormData({
        name: badge.name,
        description: badge.description || '',
        icon: badge.icon,
        category: badge.category || ''
      });
    } else {
      setEditingBadge(null);
      setFormData({
        name: '',
        description: '',
        icon: '🎖️',
        category: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBadge(null);
    setFormData({
      name: '',
      description: '',
      icon: '🎖️',
      category: ''
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Badge name is required');
      return;
    }

    if (editingBadge) {
      updateMutation.mutate({
        id: editingBadge.id,
        name: formData.name,
        description: formData.description || null,
        icon: formData.icon,
        category: formData.category || null
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        description: formData.description || null,
        icon: formData.icon,
        category: formData.category || null
      });
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'master_cutter': return 'bg-amber-500/20 text-amber-500';
      case 'artisan_weaver': return 'bg-purple-500/20 text-purple-500';
      case 'draping_specialist': return 'bg-cyan-500/20 text-cyan-500';
      case 'creative_director': return 'bg-emerald-500/20 text-emerald-500';
      case 'team': return 'bg-pink-500/20 text-pink-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Achievement Badges
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Badge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBadge ? 'Edit Badge' : 'Create Badge'}</DialogTitle>
              <DialogDescription>
                {editingBadge ? 'Update the badge details below.' : 'Create a new achievement badge for designers.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="🎖️"
                    className="text-2xl text-center"
                  />
                </div>
                <div className="col-span-3 space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Golden Scissors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., master_cutter, team"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Your patterns are production-ready."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingBadge ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading badges...</div>
        ) : badges && badges.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {badges.map((badge) => (
                <TableRow key={badge.id}>
                  <TableCell className="text-2xl">{badge.icon}</TableCell>
                  <TableCell className="font-medium">{badge.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {badge.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getCategoryColor(badge.category)}>
                      {badge.category || 'general'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(badge)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(badge.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No badges created yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
