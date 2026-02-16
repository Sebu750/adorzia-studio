/**
 * API Deduplication and Request Tracking Utilities
 * 
 * This module provides utilities to prevent duplicate API calls and track
 * repeated requests that might indicate infinite loops or inefficient patterns.
 */

// Track active requests to prevent duplicates
const activeRequests = new Map<string, Promise<any>>();

// Track request history for debugging
interface RequestLog {
  key: string;
  timestamp: number;
  count: number;
}

const requestLog = new Map<string, RequestLog>();
let logInterval: NodeJS.Timeout | null = null;

/**
 * Deduplicate concurrent API calls with the same key
 * If a request with the same key is already in flight, return the existing promise
 */
export function dedupeRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  // Check if there's already an active request with this key
  const activeRequest = activeRequests.get(key);
  if (activeRequest) {
    console.warn(`[API Deduplication] Duplicate request detected for key: ${key}`);
    return activeRequest as Promise<T>;
  }

  // Create new request and track it
  const requestPromise = requestFn().finally(() => {
    // Clean up after request completes
    activeRequests.delete(key);
  });

  activeRequests.set(key, requestPromise);
  
  // Log the request for monitoring
  logRequest(key);
  
  return requestPromise;
}

/**
 * Log API requests and detect potential infinite loops
 */
function logRequest(key: string): void {
  const now = Date.now();
  const existing = requestLog.get(key);
  
  if (existing) {
    existing.count++;
    existing.timestamp = now;
    
    // Warn if we see too many requests in a short time
    if (existing.count > 5) {
      console.error(`[API Warning] Request "${key}" has been called ${existing.count} times. Possible infinite loop!`);
    }
  } else {
    requestLog.set(key, { key, timestamp: now, count: 1 });
  }
}

/**
 * Start monitoring for repeated API calls
 * Logs a summary of API call patterns every 30 seconds
 */
export function startRequestMonitoring(): void {
  if (logInterval) return;
  
  logInterval = setInterval(() => {
    const entries = Array.from(requestLog.entries());
    if (entries.length === 0) return;
    
    const now = Date.now();
    const suspiciousRequests = entries.filter(([_, log]) => {
      // Flag requests that have been called more than 3 times in 30 seconds
      return log.count > 3 && (now - log.timestamp) < 30000;
    });
    
    if (suspiciousRequests.length > 0) {
      console.warn('[API Monitor] Suspicious request patterns detected:');
      suspiciousRequests.forEach(([key, log]) => {
        console.warn(`  - ${key}: ${log.count} calls`);
      });
    }
    
    // Clear old logs (older than 60 seconds)
    entries.forEach(([key, log]) => {
      if (now - log.timestamp > 60000) {
        requestLog.delete(key);
      }
    });
  }, 30000);
}

/**
 * Stop the request monitoring interval
 */
export function stopRequestMonitoring(): void {
  if (logInterval) {
    clearInterval(logInterval);
    logInterval = null;
  }
}

/**
 * Clear all request tracking data
 */
export function clearRequestTracking(): void {
  activeRequests.clear();
  requestLog.clear();
}

/**
 * Get current request statistics for debugging
 */
export function getRequestStats(): { active: number; logged: number; details: RequestLog[] } {
  return {
    active: activeRequests.size,
    logged: requestLog.size,
    details: Array.from(requestLog.values()),
  };
}

/**
 * Debounce function for API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function for API calls
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Create a stable request key from arguments
 */
export function createRequestKey(prefix: string, ...args: any[]): string {
  const serialized = args.map(arg => {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'object') return JSON.stringify(arg);
    return String(arg);
  }).join('|');
  
  return `${prefix}:${serialized}`;
}
