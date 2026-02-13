import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GripVertical, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  status: 'completed' | 'draft' | 'pending';
  createdAt: string;
  source: 'stylebox' | 'upload';
}

interface SortablePortfolioGridProps {
  items: PortfolioItem[];
}

export const SortablePortfolioGrid: React.FC<SortablePortfolioGridProps> = ({ items }) => {
  const [sortableItems, setSortableItems] = useState(items);
  const [isReordering, setIsReordering] = useState(false);
  const queryClient = useQueryClient();

  const reorderMutation = useMutation({
    mutationFn: async (reorderedItems: PortfolioItem[]) => {
      // Update display order in database
      const updates = reorderedItems.map((item, index) => {
        return supabase
          .from('portfolio_projects')
          .update({ display_order: index })
          .eq('id', item.id);
      });

      // Execute all updates
      const results = await Promise.all(updates.map(update => update.then(r => r)));
      
      // Check for any errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Failed to update some project orders');
      }
    },
    onSuccess: () => {
      toast.success('Project order updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-projects'] });
    },
    onError: (error) => {
      toast.error('Failed to update project order: ' + error.message);
      // Revert to original order
      setSortableItems(items);
    }
  });

  const handleReorderToggle = () => {
    if (isReordering) {
      // Save the reordered items
      reorderMutation.mutate(sortableItems);
    }
    setIsReordering(!isReordering);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (!isReordering) return;
    
    const newItems = [...sortableItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setSortableItems(newItems);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex !== targetIndex) {
      moveItem(sourceIndex, targetIndex);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Projects</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReorderToggle}
          disabled={reorderMutation.isPending}
        >
          {isReordering ? 'Save Order' : 'Reorder'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortableItems.map((item, index) => (
          <Card 
            key={item.id} 
            draggable={isReordering}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative overflow-hidden ${
              isReordering ? 'cursor-move hover:shadow-lg transition-shadow' : ''
            }`}
          >
            <CardContent className="p-0">
              <div className="relative group">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                {isReordering && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-8 w-8 text-white" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="font-medium truncate">{item.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{item.category}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">{item.createdAt}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : item.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};