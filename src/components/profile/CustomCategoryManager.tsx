import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Palette,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface CustomCategory {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export function CustomCategoryManager() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("custom_categories")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error("Failed to load categories: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("custom_categories")
        .insert({
          user_id: user!.id,
          name: newName.trim(),
          description: newDescription.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => [data, ...prev]);
      setNewName("");
      setNewDescription("");
      setIsAdding(false);
      toast.success("Category added successfully!");
    } catch (error: any) {
      toast.error("Failed to add category: " + error.message);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("custom_categories")
        .update({
          name: editName.trim(),
          description: editDescription.trim() || null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => prev.map(cat => cat.id === id ? data : cat));
      setEditingId(null);
      toast.success("Category updated successfully!");
    } catch (error: any) {
      toast.error("Failed to update category: " + error.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("custom_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success("Category deleted successfully!");
    } catch (error: any) {
      toast.error("Failed to delete category: " + error.message);
    }
  };

  const startEditing = (category: CustomCategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Custom Categories</h3>
            <p className="text-sm text-muted-foreground">
              Create and manage your custom design categories
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Add Category Form */}
      {isAdding && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5" />
              Create New Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Category Name *</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Sustainable Fashion, Luxury Accessories"
                maxLength={50}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-description">Description (Optional)</Label>
              <Textarea
                id="new-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe this category..."
                rows={3}
                maxLength={200}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddCategory} className="gap-2">
                <Check className="h-4 w-4" />
                Create
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewName("");
                  setNewDescription("");
                }}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.length === 0 ? (
          <Card className="border-dashed border-muted">
            <CardContent className="p-12 text-center">
              <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium mb-2">No custom categories yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first custom category to better organize your designs
              </p>
              <Button onClick={() => setIsAdding(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Category
              </Button>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              {editingId === category.id ? (
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-name-${category.id}`}>Category Name *</Label>
                    <Input
                      id={`edit-name-${category.id}`}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Category name"
                      maxLength={50}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edit-description-${category.id}`}>Description</Label>
                    <Textarea
                      id={`edit-description-${category.id}`}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Category description"
                      rows={2}
                      maxLength={200}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleUpdateCategory(category.id)} 
                      size="sm"
                      className="gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={cancelEditing}
                      size="sm"
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg mb-1">{category.name}</h4>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created {new Date(category.created_at).toLocaleDateString()}</span>
                        {category.is_active && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(category)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}