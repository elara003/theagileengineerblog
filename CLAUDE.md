# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

The Agile Engineer is a personal blog about software architecture and engineering practices. It's a static site with a Node.js development server.

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript with Web Components
- **Server**: Node.js (server.js) for local development
- **Styling**: Single `styles.css` file with CSS custom properties
- **Content**: HTML files for pages and blog posts

## Project Structure

```
├── index.html          # Homepage with hero section and posts list
├── about.html          # About page content
├── resume.html         # Resume/CV page
├── styles.css          # All CSS styles
├── server.js           # Node.js development server
├── sitemap.xml         # Site structure and blog post metadata
├── js/
│   └── blog.js         # Web components (blog-header, blog-footer, posts-list)
└── posts/              # Blog post HTML files
    └── *.html
```

## Development Commands

```bash
# Start the development server
node server.js

# Server runs on http://localhost:8000 (or PORT env variable)
```

## Key Patterns

### Web Components
The site uses custom elements defined in `js/blog.js`:
- `<blog-header>` - Navigation header
- `<blog-footer>` - Site footer
- `<posts-list>` - Renders blog posts from sitemap.xml via HTMX

### Adding Blog Posts
1. Create a new HTML file in `posts/` directory
2. Add an entry to `sitemap.xml` with `<loc>`, `<lastmod>`, and `<blog:title>` tags
3. Posts are automatically listed via the sitemap-driven posts list

### Routing
- The server handles HTMX requests (checks `hx-request` header)
- Routes like `/about`, `/resume`, `/posts-list` serve corresponding HTML files
- Direct access to post URLs serves the full page; HTMX requests get fragments

### Styling Conventions
- Use existing CSS classes from `styles.css`
- Blog posts use `.content-page` class structure
- Colors and spacing use CSS custom properties in `:root`

## Deployment

- **Hosting**: AWS CloudFront backed by S3
- **Domain**: theagileengineer.net (DNS managed via GoDaddy)
- **URLs**:
  - https://www.theagileengineer.net
  - https://blog.theagileengineer.net

Deploy by uploading static files to the S3 bucket. CloudFront handles CDN distribution and HTTPS.

## Content Guidelines

- Blog posts focus on software architecture, engineering practices, and technical leadership
- Use semantic HTML with proper heading hierarchy
- Keep posts in self-contained HTML files
