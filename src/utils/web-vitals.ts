/**
 * Core Web Vitals measurement utilities
 * Provides accurate measurement of LCP, FID, CLS, FCP, and TTFB
 */

// Web Vitals thresholds (in milliseconds for timing metrics, unitless for CLS)
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 }, // Interaction to Next Paint
} as const;

export type WebVitalName = keyof typeof WEB_VITALS_THRESHOLDS;

export interface WebVitalMetric {
  name: WebVitalName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  entries: PerformanceEntry[];
}

export type WebVitalCallback = (metric: WebVitalMetric) => void;

// Utility to determine rating based on thresholds
function getRating(name: WebVitalName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

// Generate unique ID for each metric
function generateUniqueID(): string {
  return `${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
}

/**
 * Measures Largest Contentful Paint (LCP)
 */
export function getLCP(callback: WebVitalCallback): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    let metric: WebVitalMetric | undefined;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      if (lastEntry) {
        const value = lastEntry.startTime;
        
        if (!metric) {
          metric = {
            name: 'LCP',
            value,
            rating: getRating('LCP', value),
            delta: value,
            id: generateUniqueID(),
            entries: [lastEntry],
          };
        } else {
          metric.value = value;
          metric.delta = metric.entries.length > 0 ? value - (metric.entries[0]?.startTime || 0) : value;
          metric.rating = getRating('LCP', value);
          metric.entries = [lastEntry];
        }

        callback(metric);
      }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });

    // Stop observing after page is fully loaded
    addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        observer.disconnect();
      }
    }, { once: true });

  } catch (error) {
    console.warn('LCP measurement failed:', error);
  }
}

/**
 * Measures First Input Delay (FID)
 */
export function getFID(callback: WebVitalCallback): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEventTiming;
        const value = fidEntry.processingStart - fidEntry.startTime;

        const metric: WebVitalMetric = {
          name: 'FID',
          value,
          rating: getRating('FID', value),
          delta: value,
          id: generateUniqueID(),
          entries: [entry],
        };

        callback(metric);
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    console.warn('FID measurement failed:', error);
  }
}

/**
 * Measures Cumulative Layout Shift (CLS)
 */
export function getCLS(callback: WebVitalCallback): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    let clsValue = 0;
    const clsEntries: PerformanceEntry[] = [];
    let metric: WebVitalMetric | undefined;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        const clsEntry = entry as LayoutShift;
        
        // Only count layout shifts that weren't caused by user input
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value;
          clsEntries.push(entry);

          if (!metric) {
            metric = {
              name: 'CLS',
              value: clsValue,
              rating: getRating('CLS', clsValue),
              delta: clsEntry.value,
              id: generateUniqueID(),
              entries: clsEntries,
            };
          } else {
            metric.value = clsValue;
            metric.delta = clsEntry.value;
            metric.rating = getRating('CLS', clsValue);
            metric.entries = clsEntries;
          }

          callback(metric);
        }
      });
    });

    observer.observe({ type: 'layout-shift', buffered: true });

    // Report final CLS value when page visibility changes
    addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && metric) {
        callback(metric);
        observer.disconnect();
      }
    }, { once: true });

  } catch (error) {
    console.warn('CLS measurement failed:', error);
  }
}

/**
 * Measures First Contentful Paint (FCP)
 */
export function getFCP(callback: WebVitalCallback): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');

      if (fcpEntry) {
        const value = fcpEntry.startTime;
        
        const metric: WebVitalMetric = {
          name: 'FCP',
          value,
          rating: getRating('FCP', value),
          delta: value,
          id: generateUniqueID(),
          entries: [fcpEntry],
        };

        callback(metric);
        observer.disconnect();
      }
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.warn('FCP measurement failed:', error);
  }
}

/**
 * Measures Time to First Byte (TTFB)
 */
export function getTTFB(callback: WebVitalCallback): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const navigationEntry = entries[0] as PerformanceNavigationTiming;

      if (navigationEntry) {
        const value = navigationEntry.responseStart - navigationEntry.fetchStart;
        
        const metric: WebVitalMetric = {
          name: 'TTFB',
          value,
          rating: getRating('TTFB', value),
          delta: value,
          id: generateUniqueID(),
          entries: [navigationEntry],
        };

        callback(metric);
        observer.disconnect();
      }
    });

    observer.observe({ type: 'navigation', buffered: true });
  } catch (error) {
    console.warn('TTFB measurement failed:', error);
  }
}

/**
 * Initialize all Core Web Vitals measurements
 */
export function initWebVitals(callback?: WebVitalCallback): void {
  if (typeof window === 'undefined') return;

  const defaultCallback: WebVitalCallback = (metric) => {
    console.log(`${metric.name}:`, {
      value: Math.round(metric.value),
      rating: metric.rating,
      delta: Math.round(metric.delta),
    });

    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: {
          metric_rating: metric.rating,
          metric_delta: Math.round(metric.delta),
        },
      });
    }
  };

  const finalCallback = callback || defaultCallback;

  // Measure all Core Web Vitals
  getLCP(finalCallback);
  getFID(finalCallback);
  getCLS(finalCallback);
  getFCP(finalCallback);
  getTTFB(finalCallback);
}

/**
 * Performance API type extensions
 */
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  cancelable: boolean;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  lastInputTime: number;
  sources: LayoutShiftAttribution[];
}

interface LayoutShiftAttribution {
  node?: Node;
  previousRect: DOMRectReadOnly;
  currentRect: DOMRectReadOnly;
}

// Global type declarations
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}