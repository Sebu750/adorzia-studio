import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  GripVertical, 
  MoreHorizontal, 
  Filter,
  LayoutGrid,
  List,
  Download,
  Upload,
  Eye,
  Edit3,
  Star,
  Trash2,
  Archive,
  Copy,
  MessageSquare
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { BulkPortfolioActions } from './BulkPortfolioActions';

interface PortfolioManagementControlsProps {
  items: any[];
  selectedItems: string[];
  onSelectionChange: (ids: string[]) => void;
  onReorderToggle: () => void;
  isReordering: boolean;
  onViewChange: (view: 'grid' | 'list') => void;
  currentView: 'grid' | 'list';
}

export const PortfolioManagementControls: React.FC<PortfolioManagementControlsProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  onReorderToggle,
  isReordering,
  onViewChange,
  currentView
}) => {
  const [showBulkActions, setShowBulkActions] = useState(false);

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map(item => item.id));
    }
  };

  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      onSelectionChange(selectedItems.filter(itemId => itemId !== id));
    } else {
      onSelectionChange([...selectedItems, id]);
    }
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        {/* Selection controls */}
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all"
              checked={selectedItems.length > 0 && selectedItems.length === items.length}
              onCheckedChange={toggleSelectAll}
              className="h-4 w-4"
            />
            <label htmlFor="select-all" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {selectedItems.length} selected
            </label>
            {selectedItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="ml-2"
              >
                Clear
              </Button>
            )}
          </div>
        )}

        {/* Bulk actions */}
        {selectedItems.length > 0 && (
          <BulkPortfolioActions 
            selectedProjectIds={selectedItems} 
            onActionComplete={clearSelection}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* View toggle */}
        <div className="flex border border-border rounded-md overflow-hidden">
          <Button
            variant={currentView === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('grid')}
            className="h-8 w-8 p-0"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={currentView === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('list')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Reorder toggle */}
        <Button
          variant={isReordering ? 'secondary' : 'outline'}
          size="sm"
          onClick={onReorderToggle}
          className="gap-2"
        >
          <GripVertical className="h-4 w-4" />
          {isReordering ? 'Exit Reorder' : 'Reorder'}
        </Button>

        {/* Filter and more options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <MoreHorizontal className="h-4 w-4" />
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="h-4 w-4 mr-2" />
              Archive All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit3 className="h-4 w-4 mr-2" />
              Batch Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              Preview All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};