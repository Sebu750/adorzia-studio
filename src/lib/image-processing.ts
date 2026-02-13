/**
 * Adorzia Image Processing Utility
 * Handles watermarking and professional asset preparation
 */

export interface WatermarkOptions {
  text: string;
  fontSize?: number;
  opacity?: number;
  color?: string;
  angle?: number;
}

/**
 * Applies a watermark to an image file and returns a new File object
 */
export async function applyWatermark(
  file: File,
  options: WatermarkOptions = { text: "ADORZIA INTERNAL DRAFT", opacity: 0.3 }
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Watermark settings
        const fontSize = options.fontSize || Math.floor(canvas.width / 20);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = options.color || "rgba(255, 255, 255, " + (options.opacity || 0.3) + ")";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw watermark across the center
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((options.angle || -45) * Math.PI / 180);
        
        // Repeat watermark if needed or just draw once
        ctx.fillText(options.text, 0, 0);
        
        // Secondary watermarks for coverage
        ctx.font = `bold ${fontSize / 2}px sans-serif`;
        ctx.fillText(options.text, 0, -fontSize * 2);
        ctx.fillText(options.text, 0, fontSize * 2);
        
        ctx.restore();

        // Convert back to file
        canvas.toBlob((blob) => {
          if (blob) {
            const watermarkedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(watermarkedFile);
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
        }, file.type);
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}
