import { useEffect } from 'react';
import { SEO_CONFIG } from '@/lib/seo-constants';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string;
  author?: string;
  locale?: string;
  alternateLocale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  noindex?: boolean;
}

const SEOHead = ({
  title = "Adorzia | Pakistan's Fashion Marketplace for Designers & Brands",
  description = "Where visionaries rise. Join Pakistan's first fashion marketplace where students build portfolios, designers launch startups, and brands host competitions. From Stylebox tech packs to made-to-order collections.",
  image = SEO_CONFIG.defaultImage,
  url = SEO_CONFIG.siteUrl,
  type = 'website',
  keywords = 'Fashion Marketplace Pakistan, Adorzia Fashion, Digital Tech Pack Pakistan, Fashion Portfolio Builder, Pakistani Fashion Designers, Jewelry Design Pakistan, Textile Design Portfolio, Freelance Fashion Design',
  author = 'Adorzia',
  locale = SEO_CONFIG.locale,
  alternateLocale = SEO_CONFIG.alternateLocale,
  publishedTime,
  modifiedTime,
  section,
  noindex = false,
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Remove meta tag helper
    const removeMetaTag = (name: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      const element = document.querySelector(selector);
      if (element) {
        element.remove();
      }
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    
    // Robots meta tag
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', SEO_CONFIG.siteName, true);
    updateMetaTag('og:locale', locale, true);
    
    // Alternate locale for Urdu audience
    if (alternateLocale) {
      updateMetaTag('og:locale:alternate', alternateLocale, true);
    }

    // Article-specific Open Graph tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
      if (section) {
        updateMetaTag('article:section', section, true);
      }
      updateMetaTag('article:author', author, true);
    } else {
      // Clean up article tags if not article type
      removeMetaTag('article:published_time', true);
      removeMetaTag('article:modified_time', true);
      removeMetaTag('article:section', true);
      removeMetaTag('article:author', true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', SEO_CONFIG.twitterHandle);
    updateMetaTag('twitter:creator', SEO_CONFIG.twitterHandle);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:image:alt', `${title} - Adorzia`);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Add hreflang for Pakistan/Urdu alternate
    let hreflangEn = document.querySelector('link[hreflang="en"]') as HTMLLinkElement;
    if (!hreflangEn) {
      hreflangEn = document.createElement('link');
      hreflangEn.setAttribute('rel', 'alternate');
      hreflangEn.setAttribute('hreflang', 'en');
      document.head.appendChild(hreflangEn);
    }
    hreflangEn.setAttribute('href', url);

    let hreflangUr = document.querySelector('link[hreflang="ur"]') as HTMLLinkElement;
    if (!hreflangUr) {
      hreflangUr = document.createElement('link');
      hreflangUr.setAttribute('rel', 'alternate');
      hreflangUr.setAttribute('hreflang', 'ur');
      document.head.appendChild(hreflangUr);
    }
    hreflangUr.setAttribute('href', url);

    // x-default for international targeting
    let hreflangDefault = document.querySelector('link[hreflang="x-default"]') as HTMLLinkElement;
    if (!hreflangDefault) {
      hreflangDefault = document.createElement('link');
      hreflangDefault.setAttribute('rel', 'alternate');
      hreflangDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(hreflangDefault);
    }
    hreflangDefault.setAttribute('href', url);

  }, [title, description, image, url, type, keywords, author, locale, alternateLocale, publishedTime, modifiedTime, section, noindex]);

  return null;
};

export default SEOHead;
