import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  Star, 
  Copy, 
  Download, 
  Archive,
  MessageSquare,
  Eye,
  Edit3
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface BulkPortfolioActionsProps {
  selectedProjectIds: string[];
  onActionComplete?: () => void;
}

export const BulkPortfolioActions: React.FC<BulkPortfolioActionsProps> = ({ 
  selectedProjectIds, 
  onActionComplete 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const bulkMutation = useMutation({
    mutationFn: async ({ action, ids }: { action: string; ids: string[] }) => {
      if (ids.length === 0) return;

      switch (action) {
        case 'delete':
          // Delete assets first
          const { error: assetsError } = await supabase
            .from('portfolio_assets')
            .delete()
            .in('project_id', ids);

          if (assetsError) throw assetsError;

          // Then delete projects
          const { error: projectError } = await supabase
            .from('portfolio_projects')
            .delete()
            .in('id', ids);

          if (projectError) throw projectError;
          break;

        case 'feature':
          const { error: featureError } = await supabase
            .from('portfolio_projects')
            .update({ is_featured: true })
            .in('id', ids);

          if (featureError) throw featureError;
          break;

        case 'unfeature':
          const { error: unfeatureError } = await supabase
            .from('portfolio_projects')
            .update({ is_featured: false })
            .in('id', ids);

          if (unfeatureError) throw unfeatureError;
          break;

        case 'archive':
          const { error: archiveError } = await supabase
            .from('portfolio_projects')
            .update({ status: 'archived' })
            .in('id', ids);

          if (archiveError) throw archiveError;
          break;

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    },
    onMutate: () => {
      setIsProcessing(true);
    },
    onSuccess: (_, variables) => {
      const actionMap: Record<string, string> = {
        delete: 'deleted',
        feature: 'featured',
        unfeature: 'unfeatured',
        archive: 'archived'
      };
      
      const action = actionMap[variables.action] || variables.action;
      toast.success(`${variables.ids.length} project(s) ${action} successfully!`);
      
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-projects'] });
      
      if (onActionComplete) {
        onActionComplete();
      }
    },
    onError: (error) => {
      toast.error(`Bulk operation failed: ${error.message}`);
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });

  const handleAction = (action: string) => {
    if (selectedProjectIds.length === 0) return;
    
    bulkMutation.mutate({
      action,
      ids: selectedProjectIds
    });
  };

  if (selectedProjectIds.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Bulk Actions ({selectedProjectIds.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => handleAction('feature')}>
          <Star className="h-4 w-4 mr-2" />
          Feature Selected
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('unfeature')}>
          <Star className="h-4 w-4 mr-2 fill-current opacity-50" />
          Unfeature Selected
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction('archive')}>
          <Archive className="h-4 w-4 mr-2" />
          Archive Selected
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('delete')} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate Selected
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="h-4 w-4 mr-2" />
          Export Selected
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Selected
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Eye className="h-4 w-4 mr-2" />
          View Selected
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};