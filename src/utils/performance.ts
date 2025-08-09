/**
 * Performance utilities for optimization and monitoring
 */

import { initWebVitals } from './web-vitals.js';

/**
 * Initialize Core Web Vitals monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Initialize Web Vitals measurement
  initWebVitals();
}

/**
 * Advanced image loading optimization utilities
 */
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return;

  // Enhanced lazy loading with intersection observer
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
          // Load the image with data-src attribute
          const dataSrc = img.dataset['src'];
          if (dataSrc) {
            img.src = dataSrc;
            img.removeAttribute('data-src');
          }
          
          // Load srcset if available
          const dataSrcset = img.dataset['srcset'];
          if (dataSrcset) {
            img.srcset = dataSrcset;
            img.removeAttribute('data-srcset');
          }
          
          // Handle loading states
          img.classList.remove('lazy-loading');
          img.classList.add('lazy-loaded');
          
          // Add fade-in effect
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.3s ease-in-out';
          
          img.onload = () => {
            img.style.opacity = '1';
            // Remove placeholder if exists
            const placeholder = img.parentElement?.querySelector('.image-placeholder');
            if (placeholder) {
              placeholder.remove();
            }
          };
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before entering viewport
      threshold: 0.01
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Optimize existing images with native lazy loading fallback
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach((img) => {
    const imgElement = img as HTMLImageElement;
    
    // Add loading event listeners for better UX
    imgElement.addEventListener('load', () => {
      imgElement.classList.add('loaded');
    });
    
    imgElement.addEventListener('error', () => {
      imgElement.classList.add('error');
      console.warn('Failed to load image:', imgElement.src);
    });
  });
}

/**
 * Preload critical resources for better performance
 */
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload above-the-fold images
  const criticalImages = document.querySelectorAll('img[data-priority="high"], img[fetchpriority="high"]');
  criticalImages.forEach((img) => {
    const imgElement = img as HTMLImageElement;
    const src = imgElement.getAttribute('src') || imgElement.getAttribute('data-src');
    
    if (src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      
      // Add type hint for better browser optimization
      if (src.includes('.webp')) link.type = 'image/webp';
      else if (src.includes('.avif')) link.type = 'image/avif';
      else if (src.includes('.jpg') || src.includes('.jpeg')) link.type = 'image/jpeg';
      else if (src.includes('.png')) link.type = 'image/png';
      
      document.head.appendChild(link);
    }
  });

  // Preload critical CSS files
  const criticalCSS = [
    '/styles/global.css',
  ];

  criticalCSS.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });

  // Preload critical JavaScript modules
  const criticalJS = [
    '/src/utils/web-vitals.js',
  ];

  criticalJS.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = href;
    document.head.appendChild(link);
  });
}

/**
 * Resource hints for better performance
 */
export function addResourceHints() {
  if (typeof window === 'undefined') return;

  // Add dns-prefetch for external domains
  const externalDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'www.google-analytics.com',
    'www.googletagmanager.com'
  ];

  externalDomains.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
}

/**
 * Optimize Core Web Vitals specifically
 */
export function optimizeCoreWebVitals() {
  if (typeof window === 'undefined') return;

  // Optimize LCP (Largest Contentful Paint)
  const optimizeLCP = () => {
    // Preload LCP candidate images
    const heroImages = document.querySelectorAll('img[data-lcp], .hero img, h1 + img');
    heroImages.forEach((img) => {
      const imgElement = img as HTMLImageElement;
      if (imgElement.src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imgElement.src;
        document.head.appendChild(link);
      }
    });

    // Optimize font loading for text LCP candidates
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }
  };

  // Optimize CLS (Cumulative Layout Shift)
  const optimizeCLS = () => {
    // Add aspect ratios to images without dimensions
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach((img) => {
      const imgElement = img as HTMLImageElement;
      imgElement.style.aspectRatio = '16/9'; // Default aspect ratio
    });

    // Reserve space for dynamic content
    const dynamicElements = document.querySelectorAll('[data-dynamic]');
    dynamicElements.forEach((element) => {
      const el = element as HTMLElement;
      if (!el.style.minHeight) {
        el.style.minHeight = '100px'; // Reserve minimum space
      }
    });
  };

  // Optimize FID (First Input Delay)
  const optimizeFID = () => {
    // Break up long tasks
    const deferNonCriticalJS = () => {
      const scripts = document.querySelectorAll('script[data-defer]');
      scripts.forEach((script) => {
        const scriptElement = script as HTMLScriptElement;
        setTimeout(() => {
          const newScript = document.createElement('script');
          newScript.src = scriptElement.src;
          newScript.async = true;
          document.head.appendChild(newScript);
        }, 100);
      });
    };

    // Use requestIdleCallback for non-critical tasks
    if ('requestIdleCallback' in window && window.requestIdleCallback) {
      window.requestIdleCallback(deferNonCriticalJS);
    } else {
      setTimeout(deferNonCriticalJS, 100);
    }
  };

  // Apply optimizations
  optimizeLCP();
  optimizeCLS();
  optimizeFID();
}

/**
 * Initialize all performance optimizations
 */
export function initPerformanceOptimizations() {
  if (typeof window === 'undefined') return;

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPerformanceMonitoring();
      optimizeImageLoading();
      preloadCriticalResources();
      addResourceHints();
      optimizeCoreWebVitals();
    });
  } else {
    initPerformanceMonitoring();
    optimizeImageLoading();
    preloadCriticalResources();
    addResourceHints();
    optimizeCoreWebVitals();
  }
}

/**
 * Utility to measure and log performance metrics
 */
export function logPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
          'TCP Connection': navigation.connectEnd - navigation.connectStart,
          'TLS Handshake': navigation.secureConnectionStart > 0 ? navigation.connectEnd - navigation.secureConnectionStart : 0,
          'Request': navigation.responseStart - navigation.requestStart,
          'Response': navigation.responseEnd - navigation.responseStart,
          'DOM Processing': navigation.domComplete - navigation.responseEnd,
          'Total Load Time': navigation.loadEventEnd - navigation.fetchStart,
          'Time to First Byte': navigation.responseStart - navigation.fetchStart,
          'DOM Content Loaded': navigation.domContentLoadedEventEnd - navigation.fetchStart,
          'Load Complete': navigation.loadEventEnd - navigation.fetchStart
        };

        console.group('Performance Metrics');
        Object.entries(metrics).forEach(([key, value]) => {
          if (value > 0) {
            console.log(`${key}: ${Math.round(value)}ms`);
          }
        });
        console.groupEnd();
      }
    }, 0);
  });
}

// Type declarations for global objects
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}