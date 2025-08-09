import type { SiteConfig } from '@/types';

// Site configuration with security considerations
export const SITE_CONFIG: SiteConfig = {
  title: 'Personal Blog',
  description: 'A modern, secure blog built with Astro and TypeScript',
  author: 'Blog Author',
  url: 'https://your-blog-domain.com',
  social: {
    twitter: 'https://twitter.com/yourusername',
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    email: 'your-email@example.com',
  },
};

// Security: Validate URLs to prevent XSS
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

// Security: Sanitize social links
export function getSanitizedSocialLinks() {
  const socialLinks = Object.entries(SITE_CONFIG.social)
    .filter(([, url]) => url && isValidUrl(url))
    .map(([platform, url]) => ({
      platform,
      url: url as string,
      label: `Follow on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
    }));
  
  return socialLinks;
}