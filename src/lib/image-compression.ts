import imageCompression from 'browser-image-compression';

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  savings: number;
  savingsPercent: number;
}

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
  initialQuality?: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp',
  initialQuality: 0.85,
};

/**
 * Compress a single image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const originalSize = file.size;
  
  try {
    const compressedFile = await imageCompression(file, {
      ...DEFAULT_OPTIONS,
      ...options,
    });

    const compressedSize = compressedFile.size;
    const savings = originalSize - compressedSize;
    const savingsPercent = (savings / originalSize) * 100;

    return {
      file: compressedFile,
      originalSize,
      compressedSize,
      savings,
      savingsPercent,
    };
  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original file if compression fails
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savings: 0,
      savingsPercent: 0,
    };
  }
}

/**
 * Compress multiple images in parallel
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (index: number, total: number) => void
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await compressImage(files[i], options);
    results.push(result);
    
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }
  
  return results;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get total compression savings
 */
export function getTotalSavings(results: CompressionResult[]): {
  originalSize: number;
  compressedSize: number;
  savings: number;
  savingsPercent: number;
} {
  const originalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
  const compressedSize = results.reduce((sum, r) => sum + r.compressedSize, 0);
  const savings = originalSize - compressedSize;
  const savingsPercent = originalSize > 0 ? (savings / originalSize) * 100 : 0;
  
  return {
    originalSize,
    compressedSize,
    savings,
    savingsPercent,
  };
}
