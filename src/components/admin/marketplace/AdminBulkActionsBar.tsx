import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  CheckCircle, 
  XCircle, 
  X,
  FolderOpen,
  Archive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AdminBulkActionsBarProps {
  selectedCount: number;
  onDelete: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onAddToCollection?: () => void;
  onArchive?: () => void;
  onClearSelection: () => void;
  entityType: 'products' | 'collections' | 'designers';
  isDeleting?: boolean;
}

export function AdminBulkActionsBar({ 
  selectedCount, 
  onDelete, 
  onActivate,
  onDeactivate,
  onAddToCollection,
  onArchive,
  onClearSelection,
  entityType,
  isDeleting = false
}: AdminBulkActionsBarProps) {
  if (selectedCount === 0) return null;

  const entityLabel = entityType === 'products' 
    ? (selectedCount === 1 ? 'product' : 'products')
    : entityType === 'collections'
    ? (selectedCount === 1 ? 'collection' : 'collections')
    : (selectedCount === 1 ? 'designer' : 'designers');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-2 bg-admin-foreground text-admin-background px-4 py-3 rounded-xl shadow-2xl border border-admin-foreground/20">
          {/* Selection Count */}
          <div className="flex items-center gap-2 pr-3 border-r border-admin-background/20">
            <Badge className="bg-admin-background text-admin-foreground font-semibold text-sm px-2.5 py-0.5 rounded-full">
              {selectedCount}
            </Badge>
            <span className="text-sm font-medium text-admin-background/90">
              {entityLabel} selected
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Activate - for products and designers */}
            {onActivate && (entityType === 'products' || entityType === 'designers') && (
              <Button
                onClick={onActivate}
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-admin-background/90 hover:text-admin-background hover:bg-admin-background/10 rounded-lg"
              >
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Activate
              </Button>
            )}

            {/* Deactivate - for products and designers */}
            {onDeactivate && (entityType === 'products' || entityType === 'designers') && (
              <Button
                onClick={onDeactivate}
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-admin-background/90 hover:text-admin-background hover:bg-admin-background/10 rounded-lg"
              >
                <XCircle className="h-4 w-4 mr-1.5" />
                Deactivate
              </Button>
            )}

            {/* Add to Collection - for products only */}
            {onAddToCollection && entityType === 'products' && (
              <Button
                onClick={onAddToCollection}
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-admin-background/90 hover:text-admin-background hover:bg-admin-background/10 rounded-lg"
              >
                <FolderOpen className="h-4 w-4 mr-1.5" />
                Add to Collection
              </Button>
            )}

            {/* Archive - for collections */}
            {onArchive && entityType === 'collections' && (
              <Button
                onClick={onArchive}
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-admin-background/90 hover:text-admin-background hover:bg-admin-background/10 rounded-lg"
              >
                <Archive className="h-4 w-4 mr-1.5" />
                Archive
              </Button>
            )}

            {/* Delete */}
            <Button
              onClick={onDelete}
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              className="h-8 px-3 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>

            {/* Divider */}
            <div className="w-px h-5 bg-admin-background/20 mx-1" />

            {/* Clear Selection */}
            <Button
              onClick={onClearSelection}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-admin-background/70 hover:text-admin-background hover:bg-admin-background/10 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
