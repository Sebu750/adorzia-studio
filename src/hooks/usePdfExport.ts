import { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface PdfExportOptions {
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter' | 'legal';
  margin?: number;
  quality?: number;
  scale?: number;
}

export function usePdfExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportToPdf = useCallback(async (
    elementId: string,
    options: PdfExportOptions = {}
  ) => {
    const {
      filename = 'portfolio',
      orientation = 'portrait',
      format = 'a4',
      margin = 10,
      quality = 0.95,
      scale = 2,
    } = options;

    setIsExporting(true);
    setProgress(0);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      toast.info('Preparing PDF export...');
      setProgress(10);

      // Get dimensions based on format
      const formatDimensions = {
        a4: { width: 210, height: 297 },
        letter: { width: 216, height: 279 },
        legal: { width: 216, height: 356 },
      };

      const dims = formatDimensions[format];
      const pageWidth = orientation === 'portrait' ? dims.width : dims.height;
      const pageHeight = orientation === 'portrait' ? dims.height : dims.width;

      // Create high-quality canvas from element
      setProgress(20);
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      setProgress(50);

      // Calculate dimensions for PDF
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate ratio to fit content
      const ratio = Math.min(
        (contentWidth * scale) / imgWidth,
        1 // Don't scale up
      );
      
      const scaledWidth = (imgWidth * ratio) / scale;
      const scaledHeight = (imgHeight * ratio) / scale;

      // Calculate number of pages needed
      const pagesNeeded = Math.ceil(scaledHeight / contentHeight);

      setProgress(60);

      // Create PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format,
      });

      // Split content across pages
      for (let page = 0; page < pagesNeeded; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // Calculate source position for this page
        const sourceY = (page * contentHeight * scale) / ratio;
        const sourceHeight = Math.min(
          (contentHeight * scale) / ratio,
          imgHeight - sourceY
        );

        // Create temporary canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0, sourceY, imgWidth, sourceHeight,
            0, 0, imgWidth, sourceHeight
          );
        }

        const imgData = pageCanvas.toDataURL('image/jpeg', quality);
        
        pdf.addImage(
          imgData,
          'JPEG',
          margin,
          margin,
          scaledWidth,
          (sourceHeight * ratio) / scale
        );

        setProgress(60 + ((page + 1) / pagesNeeded) * 30);
      }

      setProgress(95);

      // Save the PDF
      pdf.save(`${filename}.pdf`);
      
      setProgress(100);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  }, []);

  return {
    exportToPdf,
    isExporting,
    progress,
  };
}

export default usePdfExport;
