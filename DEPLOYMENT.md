# Cloudflare Pages Deployment Guide

This document provides instructions for deploying the personal blog website to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account
2. A GitHub repository containing this blog code
3. A custom domain (optional)

## Deployment Steps

### 1. Connect Repository to Cloudflare Pages

1. Log in to your Cloudflare dashboard
2. Navigate to "Pages" in the sidebar
3. Click "Create a project"
4. Select "Connect to Git"
5. Choose your GitHub repository
6. Click "Begin setup"

### 2. Configure Build Settings

Use the following build configuration:

- **Framework preset**: Astro
- **Build command**: `npm run build:ci`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty if the project is in the root)

### 3. Environment Variables

No environment variables are required for the basic setup. If you add features that require environment variables later, add them in the Cloudflare Pages dashboard under "Settings" > "Environment variables".

### 4. Custom Domain Setup (Optional)

1. In your Cloudflare Pages project, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain name
4. Follow the DNS configuration instructions
5. SSL certificates will be automatically provisioned

### 5. Build Configuration Details

The project is configured with the following build settings:

- **Node.js version**: 18+ (automatically detected)
- **Package manager**: npm
- **Build command**: `npm run build:ci` (skips type checking for faster CI builds)
- **Output directory**: `dist`

### 6. Automatic Deployments

Once connected, Cloudflare Pages will automatically:

- Deploy on every push to the main branch
- Create preview deployments for pull requests
- Provide deployment status updates

### 7. Performance Optimizations

The site includes several optimizations for Cloudflare Pages:

- Static asset caching headers in `_headers`
- Redirect rules in `_redirects`
- Optimized image processing
- Minified CSS and JavaScript
- Automatic compression

## Build Troubleshooting

### Common Issues

1. **Build fails with content collection errors**:
   - Ensure all blog post frontmatter follows the correct schema
   - Check that dates are in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
   - Clear the build cache by redeploying

2. **Missing dependencies**:
   - Ensure all dependencies are listed in `package.json`
   - Check that the Node.js version is compatible (18+)

3. **Path resolution issues**:
   - Verify that all import paths use the configured aliases
   - Check that file extensions are correct

### Build Commands

- **Development**: `npm run dev`
- **Production build**: `npm run build`
- **CI build**: `npm run build:ci`
- **Preview**: `npm run preview`

## Security Features

The deployment includes several security headers:

- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection
- Referrer Policy

## Performance Features

- Automatic asset optimization
- Image compression and responsive images
- CSS and JavaScript minification
- Static asset caching
- CDN distribution via Cloudflare's global network

## Monitoring

Monitor your deployment through:

- Cloudflare Pages dashboard for build status
- Cloudflare Analytics for traffic insights
- Core Web Vitals monitoring
- Error tracking through browser console

## Support

For deployment issues:

1. Check the Cloudflare Pages build logs
2. Review the [Astro deployment documentation](https://docs.astro.build/en/guides/deploy/cloudflare/)
3. Consult the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)