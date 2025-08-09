// Performance optimization utilities
// This module provides utilities for monitoring and optimizing web performance

/**
 * Initialize performance optimizations
 */
export function initPerformanceOptimizations() {
  // Preload critical resources on user interaction
  setupResourcePreloading();
  
  // Optimize font loading
  optimizeFontLoading();
  
  // Setup intersection observer for lazy loading
  setupLazyLoading();
  
  // Initialize performance monitoring
  setupPerformanceMonitoring();
  
  // Optimize images
  optimizeImages();
}

/**
 * Setup resource preloading on user interaction
 */
function setupResourcePreloading() {
  const preloadOnInteraction = () => {
    // Preload blog page
    const blogLink = document.createElement('link');
    blogLink.rel = 'prefetch';
    blogLink.href = '/blog';
    document.head.appendChild(blogLink);
    
    // Preload RSS feed
    const rssLink = document.createElement('link');
    rssLink.rel = 'prefetch';
    rssLink.href = '/rss.xml';
    document.head.appendChild(rssLink);
  };
  
  // Add event listeners for preloading
  ['mouseenter', 'touchstart', 'focus'].forEach(event => {
    document.addEventListener(event, preloadOnInteraction, { once: true, passive: true });
  });
}

/**
 * Optimize font loading for better performance
 */
function optimizeFontLoading() {
  if ('fonts' in document) {
    // Preload critical fonts
    const criticalFonts = [
      { family: 'Inter', weight: '400' },
      { family: 'Inter', weight: '600' },
      { family: 'JetBrains Mono', weight: '400' }
    ];
    
    criticalFonts.forEach(font => {
      document.fonts.load(`${font.weight} 16px ${font.family}`);
    });
    
    // Add fonts-loaded class when fonts are ready
    document.fonts.ready.then(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
  }
}

/**
 * Setup lazy loading for images and other resources
 */
function setupLazyLoading() {
  // Use Intersection Observer for better lazy loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load the image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Load srcset if available
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          // Remove loading class and add loaded class
          img.classList.remove('lazy-loading');
          img.classList.add('lazy-loaded');
          
          // Stop observing this image
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.classList.add('lazy-loading');
      imageObserver.observe(img);
    });
  }
}

/**
 * Setup performance monitoring
 */
function setupPerformanceMonitoring() {
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      
      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            console.log('CLS:', entry.value);
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      
    } catch (e) {
      console.warn('Performance monitoring not fully supported');
    }
  }
}

/**
 * Optimize images for better performance
 */
function optimizeImages() {
  // Add loading="lazy" to images that don't have it
  document.querySelectorAll('img:not([loading])').forEach(img => {
    // Don't add lazy loading to above-the-fold images
    const rect = img.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      img.loading = 'lazy';
    }
  });
  
  // Add decoding="async" for better performance
  document.querySelectorAll('img:not([decoding])').forEach(img => {
    img.decoding = 'async';
  });
  
  // Optimize image placeholder handling
  document.querySelectorAll('img[data-placeholder="blur"]').forEach(img => {
    img.addEventListener('load', () => {
      img.style.filter = 'none';
      const placeholder = img.parentElement?.querySelector('.image-placeholder');
      if (placeholder) {
        placeholder.style.opacity = '0';
        setTimeout(() => placeholder.remove(), 300);
      }
    });
  });
}

/**
 * Log performance metrics for debugging
 */
export function logPerformanceMetrics() {
  if ('performance' in window) {
    // Navigation timing
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      console.group('Navigation Performance');
      console.log('DNS Lookup:', navigation.domainLookupEnd - navigation.domainLookupStart, 'ms');
      console.log('TCP Connection:', navigation.connectEnd - navigation.connectStart, 'ms');
      console.log('Request Time:', navigation.responseStart - navigation.requestStart, 'ms');
      console.log('Response Time:', navigation.responseEnd - navigation.responseStart, 'ms');
      console.log('DOM Processing:', navigation.domComplete - navigation.responseEnd, 'ms');
      console.log('Total Load Time:', navigation.loadEventEnd - navigation.fetchStart, 'ms');
      console.groupEnd();
    }
    
    // Resource timing
    const resources = performance.getEntriesByType('resource');
    const slowResources = resources.filter(resource => resource.duration > 100);
    if (slowResources.length > 0) {
      console.group('Slow Resources (>100ms)');
      slowResources.forEach(resource => {
        console.log(resource.name, resource.duration.toFixed(2), 'ms');
      });
      console.groupEnd();
    }
    
    // Memory usage (if available)
    if ('memory' in performance) {
      console.group('Memory Usage');
      console.log('Used:', (performance.memory.usedJSHeapSize / 1048576).toFixed(2), 'MB');
      console.log('Total:', (performance.memory.totalJSHeapSize / 1048576).toFixed(2), 'MB');
      console.log('Limit:', (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2), 'MB');
      console.groupEnd();
    }
  }
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  const criticalResources = [
    { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
    { href: '/fonts/jetbrains-mono-var.woff2', as: 'font', type: 'font/woff2' },
    { href: '/styles/global.css', as: 'style' }
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.as === 'font') link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Optimize third-party scripts
 */
export function optimizeThirdPartyScripts() {
  // Defer non-critical scripts
  document.querySelectorAll('script[src]:not([async]):not([defer])').forEach(script => {
    if (!script.src.includes('critical')) {
      script.defer = true;
    }
  });
}

/**
 * Setup service worker for caching (if available)
 */
export function setupServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}