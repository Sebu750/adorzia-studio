import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, Loader2 } from 'lucide-react';
import { usePdfExport } from '@/hooks/usePdfExport';

interface PdfExportDialogProps {
  portfolioTitle: string;
  elementId: string;
  trigger?: React.ReactNode;
}

export function PdfExportDialog({ 
  portfolioTitle, 
  elementId,
  trigger 
}: PdfExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [format, setFormat] = useState<'a4' | 'letter'>('a4');
  const [quality, setQuality] = useState<'standard' | 'high'>('high');
  
  const { exportToPdf, isExporting, progress } = usePdfExport();

  const handleExport = async () => {
    const filename = portfolioTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    await exportToPdf(elementId, {
      filename: `${filename}-portfolio`,
      orientation,
      format,
      quality: quality === 'high' ? 0.95 : 0.8,
      scale: quality === 'high' ? 2 : 1.5,
    });

    if (!isExporting) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Portfolio as PDF
          </DialogTitle>
          <DialogDescription>
            Generate a high-quality PDF version of your portfolio.
          </DialogDescription>
        </DialogHeader>

        {isExporting ? (
          <div className="py-8 space-y-4">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              {progress < 20 && 'Preparing content...'}
              {progress >= 20 && progress < 50 && 'Rendering pages...'}
              {progress >= 50 && progress < 90 && 'Generating PDF...'}
              {progress >= 90 && 'Finalizing...'}
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Orientation */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Page Orientation</Label>
              <RadioGroup
                value={orientation}
                onValueChange={(v) => setOrientation(v as 'portrait' | 'landscape')}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="portrait"
                    id="portrait"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="portrait"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <div className="w-6 h-8 border-2 border-current rounded-sm mb-2" />
                    <span className="text-sm">Portrait</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="landscape"
                    id="landscape"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="landscape"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <div className="w-8 h-6 border-2 border-current rounded-sm mb-2" />
                    <span className="text-sm">Landscape</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Format */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Paper Size</Label>
              <RadioGroup
                value={format}
                onValueChange={(v) => setFormat(v as 'a4' | 'letter')}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="a4"
                    id="a4"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="a4"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="font-medium">A4</span>
                    <span className="text-xs text-muted-foreground">210 × 297 mm</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="letter"
                    id="letter"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="letter"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="font-medium">Letter</span>
                    <span className="text-xs text-muted-foreground">8.5 × 11 in</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Quality */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Export Quality</Label>
              <RadioGroup
                value={quality}
                onValueChange={(v) => setQuality(v as 'standard' | 'high')}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="standard"
                    id="standard"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="standard"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="font-medium">Standard</span>
                    <span className="text-xs text-muted-foreground">Faster, smaller file</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="high"
                    id="high"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="high"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="font-medium">High</span>
                    <span className="text-xs text-muted-foreground">Best quality</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
