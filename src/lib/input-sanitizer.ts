import DOMPurify from 'dompurify';

/**
 * Sanitizes user input to prevent XSS while allowing safe HTML tags
 * @param input - The input string to sanitize
 * @returns Sanitized string with safe HTML tags
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Allow safe HTML tags for formatting
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'strike', 'del', 's',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'q',
      'pre', 'code',
      'sub', 'sup',
      'small',
      'mark'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', // for links and images
      'class', 'id', 'style', // for styling
      'target', 'rel' // for links
    ],
    // Only allow safe protocols
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button', 'iframe', 'frame', 'frameset', 'link', 'meta', 'base', 'head'],
    FORBID_ATTR: ['on*', 'srcdoc', 'sandbox']
  });
}

/**
 * Sanitizes user input specifically for titles (no HTML allowed)
 * @param title - The title string to sanitize
 * @returns Plain text string with no HTML
 */
export function sanitizeTitle(title: string): string {
  if (!title || typeof title !== 'string') {
    return '';
  }

  // Remove all HTML tags for titles
  return DOMPurify.sanitize(title, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

/**
 * Sanitizes rich text content allowing safe HTML formatting
 * @param content - The rich text content to sanitize
 * @returns Sanitized HTML string with safe formatting
 */
export function sanitizeRichText(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
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
    ALLOWED_ATTR: [
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
}

/**
 * Sanitizes a single line of text (for things like slugs, small descriptions)
 * @param text - The text to sanitize
 * @returns Sanitized plain text
 */
export function sanitizePlainText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Strip all HTML but preserve line breaks
  const stripped = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });

  // Replace newlines with <br> if needed for display (but return plain text)
  return stripped.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Sanitizes an array of strings
 * @param arr - Array of strings to sanitize
 * @returns Array of sanitized strings
 */
export function sanitizeStringArray(arr: string[]): string[] {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr.map(item => sanitizeInput(item));
}