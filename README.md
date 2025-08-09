# Personal Blog Website

A modern, secure, and performant blog website built with Astro, TypeScript, and Tailwind CSS. Designed for deployment on Cloudflare Pages with a focus on security, accessibility, and SEO.

## 🚀 Features

- **Modern Stack**: Built with Astro 4.x, TypeScript, and Tailwind CSS
- **Security First**: Comprehensive security measures including CSP headers, input sanitization, and XSS prevention
- **Performance Optimized**: Static site generation with minimal JavaScript and optimized assets
- **SEO Ready**: Automatic sitemap generation, RSS feeds, and structured data
- **Responsive Design**: Mobile-first design that works on all devices
- **Accessibility**: WCAG compliant with semantic HTML and screen reader support
- **Content Management**: Type-safe content collections with Markdown support
- **Syntax Highlighting**: Code blocks with Shiki syntax highlighting
- **Cloudflare Pages**: Optimized for deployment on Cloudflare Pages

## 🛡️ Security Features

- Content Security Policy (CSP) headers
- XSS prevention through input sanitization
- Safe external link handling with `rel="noopener noreferrer"`
- HTML sanitization in Markdown content
- Secure dependency management
- ESLint security plugin integration

## 📁 Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable Astro components
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route pages
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── config/          # Site configuration
├── content/
│   └── blog/            # Blog posts in Markdown
└── package.json
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:4321](http://localhost:4321) in your browser

## 📝 Writing Blog Posts

Create new blog posts in the `content/blog/` directory using Markdown format:

```markdown
---
title: "Your Blog Post Title"
description: "A brief description of your post"
publishDate: 2024-01-01
author: "Your Name"
tags: ["tag1", "tag2"]
image: "/images/post-image.jpg"
draft: false
---

Your blog post content here...
```

## 🔧 Configuration

Update the site configuration in `src/config/site.ts`:

```typescript
export const SITE_CONFIG = {
  title: 'Your Blog Title',
  description: 'Your blog description',
  author: 'Your Name',
  url: 'https://your-domain.com',
  social: {
    twitter: 'https://twitter.com/yourusername',
    github: 'https://github.com/yourusername',
    // ... other social links
  },
};
```

## 🚀 Deployment

### Cloudflare Pages

This project is optimized for deployment on Cloudflare Pages. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

**Quick Setup:**

1. Connect your repository to Cloudflare Pages
2. Set build settings:
   - Build command: `npm run build:ci`
   - Build output directory: `dist`
   - Node.js version: 18+

3. Deploy automatically on push to main branch

**Features included:**
- Security headers via `_headers` file
- Redirect rules via `_redirects` file
- Optimized caching for static assets
- Automatic SSL certificate provisioning

## 📊 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run Astro type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🧪 Quality Assurance

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and security linting
- **Prettier**: Consistent code formatting
- **Security**: ESLint security plugin for vulnerability detection

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## 📞 Support

If you have any questions or need help, please open an issue in the repository.