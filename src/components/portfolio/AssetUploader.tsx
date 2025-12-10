import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, Video, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ASSET_CATEGORIES, type AssetCategory } from '@/lib/portfolio';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AssetUploaderProps {
  onUpload: (file: File, category?: string) => Promise<void>;
  isUploading?: boolean;
  accept?: string;
  maxSize?: number;
  showCategorySelect?: boolean;
  className?: string;
}

export function AssetUploader({
  onUpload,
  isUploading = false,
  accept = 'image/*,video/*,.pdf',
  maxSize = 52428800, // 50MB
  showCategorySelect = true,
  className,
}: AssetUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | ''>('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`);
      return false;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM, PDF');
      return false;
    }

    return true;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (validateFile(file)) {
        await onUpload(file, selectedCategory || undefined);
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [selectedCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    return FileText;
  };

  return (
    <div className={cn('space-y-3', className)}>
      {showCategorySelect && (
        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as AssetCategory)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select asset category (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No category</SelectItem>
            {ASSET_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50',
          isUploading && 'pointer-events-none opacity-60'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Images, videos, or PDFs up to 50MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}

interface AssetThumbnailProps {
  asset: {
    id: string;
    file_url: string;
    file_name: string;
    file_type: string;
    asset_category?: string | null;
    caption?: string | null;
  };
  onDelete?: () => void;
  onEdit?: () => void;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AssetThumbnail({
  asset,
  onDelete,
  onEdit,
  isSelected,
  onClick,
  size = 'md',
}: AssetThumbnailProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const FileIcon = asset.file_type === 'video' ? Video 
    : asset.file_type === 'document' ? FileText 
    : Image;

  return (
    <div 
      className={cn(
        'relative group rounded-lg overflow-hidden bg-muted cursor-pointer transition-all',
        sizeClasses[size],
        isSelected && 'ring-2 ring-primary',
        onClick && 'hover:ring-2 hover:ring-primary/50'
      )}
      onClick={onClick}
    >
      {asset.file_type === 'image' ? (
        <img
          src={asset.file_url}
          alt={asset.file_name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <FileIcon className="w-8 h-8 text-muted-foreground" />
        </div>
      )}

      {asset.asset_category && (
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] font-medium bg-background/80 rounded">
          {asset.asset_category}
        </div>
      )}

      {(onDelete || onEdit) && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
          {onEdit && (
            <Button size="icon" variant="ghost" className="h-7 w-7 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <FileText className="w-3.5 h-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button size="icon" variant="ghost" className="h-7 w-7 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
