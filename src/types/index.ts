// Type definitions for the blog application

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  publishDate: Date;
  author: string;
  tags: string[];
  image?: string;
  draft: boolean;
  content: string;
  readingTime: number;
}

export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  url: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishDate?: Date;
  author?: string;
}

// Security: Strict typing for user inputs
export interface SafeMarkdownContent {
  content: string;
  excerpt: string;
  readingTime: number;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}