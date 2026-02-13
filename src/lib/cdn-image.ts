/**
 * NFR 1.1 & 1.4: CDN Image Optimization for Luxury E-commerce
 * - Supports WebP/AVIF formats for high-fidelity fashion imagery
 * - Lazy loading with intersection observer
 * - Responsive image sizing for mobile-first UI
 * - LCP optimization through priority loading
 */

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  blur?: number;
}

/**
 * Generate Supabase Storage CDN URL with transformations
 * Supabase uses ImgProxy for image transformations
 */
export function getOptimizedImageUrl(
  storageUrl: string,
  options: ImageTransformOptions = {}
): string {
  if (!storageUrl) return '';
  
  // If already a full URL or external, return as-is
  if (storageUrl.startsWith('http')) {
    return storageUrl;
  }

  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    fit = 'cover',
  } = options;

  // Build transformation parameters
  const params = new URLSearchParams();
  if (width) params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  params.append('quality', quality.toString());
  params.append('format', format);
  params.append('resize', fit);

  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const transformUrl = `${baseUrl}/storage/v1/render/image/public/${storageUrl}?${params.toString()}`;
  
  return transformUrl;
}

/**
 * Generate srcset for responsive images
 * NFR 1.2: Mobile-first optimization with different device densities
 */
export function generateSrcSet(
  storageUrl: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920],
  format: 'webp' | 'avif' = 'webp'
): string {
  return widths
    .map((width) => {
      const url = getOptimizedImageUrl(storageUrl, { width, format, quality: 85 });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Product image presets for consistent marketplace display
 * FR 1.2: Dynamic Product Detail Pages with professional assets
 */
export const PRODUCT_IMAGE_PRESETS = {
  thumbnail: { width: 200, height: 300, quality: 80 },
  card: { width: 400, height: 600, quality: 85 },
  detail: { width: 1200, height: 1800, quality: 90 },
  hero: { width: 1920, height: 1080, quality: 95, fit: 'cover' as const },
  zoom: { width: 2400, height: 3600, quality: 95 },
} as const;

/**
 * Designer profile image presets
 * FR 1.1: Designer-Attributed Catalog with Creative Partner profiles
 */
export const DESIGNER_IMAGE_PRESETS = {
  avatar: { width: 128, height: 128, quality: 85, fit: 'cover' as const },
  banner: { width: 1920, height: 400, quality: 90, fit: 'cover' as const },
  portfolio: { width: 800, height: 600, quality: 85 },
} as const;

/**
 * Get optimized product image URL with preset
 */
export function getProductImage(
  storageUrl: string,
  preset: keyof typeof PRODUCT_IMAGE_PRESETS = 'card',
  format: 'webp' | 'avif' = 'webp'
): string {
  return getOptimizedImageUrl(storageUrl, {
    ...PRODUCT_IMAGE_PRESETS[preset],
    format,
  });
}

/**
 * Get optimized designer image URL with preset
 */
export function getDesignerImage(
  storageUrl: string,
  preset: keyof typeof DESIGNER_IMAGE_PRESETS = 'avatar',
  format: 'webp' | 'avif' = 'webp'
): string {
  return getOptimizedImageUrl(storageUrl, {
    ...DESIGNER_IMAGE_PRESETS[preset],
    format,
  });
}

/**
 * Lazy load image with Intersection Observer
 * NFR 1.1: Performance optimization for LCP
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  priority: boolean = false
): void {
  if (priority || 'loading' in HTMLImageElement.prototype) {
    // Native lazy loading or priority image
    img.loading = priority ? 'eager' : 'lazy';
    img.src = src;
    return;
  }

  // Fallback to Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.disconnect();
        }
      });
    },
    { rootMargin: '50px' }
  );

  observer.observe(img);
}

/**
 * Preload critical images for LCP optimization
 * NFR 1.1: Largest Contentful Paint < 1.2s
 */
export function preloadImage(src: string, as: 'image' = 'image'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  link.type = 'image/webp';
  document.head.appendChild(link);
}

/**
 * Check browser support for modern image formats
 * NFR 1.4: Visual Fidelity with WebP/AVIF
 */
export async function getSupportedFormat(): Promise<'avif' | 'webp' | 'jpeg'> {
  // Check AVIF support
  const avifSupported = await checkImageSupport(
    'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI='
  );
  if (avifSupported) return 'avif';

  // Check WebP support
  const webpSupported = await checkImageSupport(
    'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
  );
  if (webpSupported) return 'webp';

  return 'jpeg';
}

async function checkImageSupport(dataUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = dataUrl;
  });
}
