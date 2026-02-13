import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { sanitizeRichText } from '@/lib/input-sanitizer';

interface SafeHTMLRendererProps {
  html: string;
  className?: string;
  tagName?: 'div' | 'span' | 'p' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer';
  sanitizeOptions?: {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
  };
}

/**
 * Safely renders HTML content preventing XSS while allowing safe HTML tags
 * @param html - The HTML string to render safely
 * @param className - Optional CSS classes to apply
 * @param tagName - The HTML tag to render as (defaults to div)
 * @param sanitizeOptions - Custom sanitization options
 */
export const SafeHTMLRenderer: React.FC<SafeHTMLRendererProps> = ({
  html,
  className,
  tagName: TagName = 'div',
  sanitizeOptions
}) => {
  const sanitizedHTML = useMemo(() => {
    if (!html) return '';
    
    // Use default sanitization if no custom options provided
    if (!sanitizeOptions) {
      return sanitizeRichText(html);
    }
    
    // Apply custom sanitization
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: sanitizeOptions.ALLOWED_TAGS || [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'strike', 'del', 's',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'blockquote', 'q',
        'pre', 'code',
        'sub', 'sup',
        'small',
        'mark',
        'a',
        'img'
      ],
      ALLOWED_ATTR: sanitizeOptions.ALLOWED_ATTR || [
        'href', 'title', 'alt', 'src', // for links and images
        'class', 'id', 'style', // for styling
        'target', 'rel' // for links
      ],
      ADD_ATTR: ['target'], // Allow target attribute for links
      // Only allow safe protocols
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button', 'iframe', 'frame', 'frameset', 'link', 'meta', 'base', 'head'],
      FORBID_ATTR: ['on*', 'srcdoc', 'sandbox']
    });
  }, [html, sanitizeOptions]);

  return React.createElement(TagName, {
    className,
    dangerouslySetInnerHTML: { __html: sanitizedHTML }
  });
};

export default SafeHTMLRenderer;