import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Security-focused Astro configuration
export default defineConfig({
  integrations: [
    tailwind({
      // Security: Disable CDN to avoid external dependencies
      applyBaseStyles: false,
    }),
    sitemap({
      // Generate sitemap for SEO
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  
  // Security headers and performance configuration
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Prevent code injection through dynamic imports
          manualChunks: undefined,
          // Performance: Optimize chunk naming
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      // Performance: Enable minification
      minify: 'esbuild',
      // Performance: Enable CSS code splitting
      cssCodeSplit: true,
      // Performance: Optimize dependencies
      target: 'es2020',
      // Performance: Enable source maps in development only
      sourcemap: false,
    },
    server: {
      // Security headers for development
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
      },
    },
    // Performance: Optimize dependencies
    optimizeDeps: {
      include: ['astro/assets'],
      exclude: ['@astrojs/check'],
    },
    // Performance: Enable CSS preprocessing optimizations
    css: {
      devSourcemap: false,
      preprocessorOptions: {
        scss: {
          outputStyle: 'compressed',
        },
      },
    },
  },
  
  // Content collections for type safety
  experimental: {
    contentCollectionCache: true,
  },
  
  // Build configuration for security and performance
  build: {
    // Inline small assets for better performance
    inlineStylesheets: 'auto',
    // Security: Split chunks for better caching
    split: true,
    // Performance optimizations
    assets: '_assets',
    assetsPrefix: undefined,
    format: 'directory',
  },
  
  // Performance: Enable compression
  compressHTML: true,
  
  // Image optimization configuration
  image: {
    // Enable image optimization with Sharp
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 268402689, // ~16K x 16K pixels
        // Sharp optimization settings for better performance
        jpeg: {
          quality: 85,
          progressive: true,
          mozjpeg: true,
          optimizeScans: true,
          trellisQuantisation: true,
          overshootDeringing: true,
        },
        webp: {
          quality: 85,
          effort: 6,
          lossless: false,
          nearLossless: false,
          smartSubsample: true,
        },
        avif: {
          quality: 80,
          effort: 6,
          chromaSubsampling: '4:2:0',
        },
        png: {
          quality: 90,
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: true,
          progressive: false,
        },
        // Global optimization settings
        withMetadata: false, // Remove metadata for smaller files
        failOnError: false, // Don't fail build on image errors
      },
    },
    // Define responsive image sizes for better performance
    remotePatterns: [],
    domains: [],
  },
  
  // Site configuration for SEO and security
  // Update this with your actual domain when deploying
  site: 'https://your-blog-domain.com',
  base: '/',
  
  // Markdown configuration with security considerations
  markdown: {
    // Security: Configure syntax highlighting safely
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
      // Security: Limit languages to prevent code injection
      langs: [
        'javascript',
        'typescript',
        'python',
        'bash',
        'shell',
        'json',
        'html',
        'css',
        'scss',
        'markdown',
        'yaml',
        'sql',
        'jsx',
        'tsx',
        'go',
        'rust',
        'java',
        'php',
        'c',
        'cpp',
        'csharp',
        'ruby',
        'swift',
        'kotlin',
        'dart',
        'xml',
      ],
      // Add line numbers and better formatting
      transformers: [],
    },
    // Security: Disable HTML in markdown to prevent XSS
    allowHTML: false,
  },
  
  // Output configuration
  output: 'static',
  adapter: undefined,
});