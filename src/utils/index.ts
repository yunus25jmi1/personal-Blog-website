// Utility functions with security considerations

/**
 * Calculate reading time for blog posts
 * Security: Prevents potential DoS by limiting content length
 */
export function calculateReadingTime(content: string): number {
  // Security: Limit content length to prevent DoS
  const maxContentLength = 100000; // 100KB limit
  const safeContent = content.slice(0, maxContentLength);
  
  const wordsPerMinute = 200;
  const words = safeContent.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Format date for display
 * Security: Validates date input to prevent injection
 */
export function formatDate(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Security: Validate date
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Generate excerpt from content
 * Security: Sanitizes content and limits length
 */
export function generateExcerpt(content: string, maxLength = 160): string {
  // Security: Remove HTML tags and limit length
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s.,!?-]/g, '') // Remove special characters except basic punctuation
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last complete word within the limit
  const truncated = plainText.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return lastSpaceIndex > 0 
    ? truncated.slice(0, lastSpaceIndex) + '...'
    : truncated + '...';
}

/**
 * Sanitize slug for URLs
 * Security: Ensures safe URL slugs
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate and sanitize tag names
 * Security: Prevents XSS through tag names
 */
export function sanitizeTags(tags: string[]): string[] {
  return tags
    .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => /^[a-z0-9-\s]+$/i.test(tag)) // Only allow alphanumeric, hyphens, and spaces
    .slice(0, 10); // Limit number of tags
}