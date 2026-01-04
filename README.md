# The Agile Engineer Blog

A modern, professional blog built with HTMX for dynamic content loading and a clean, responsive design focused on software engineering and architecture topics.

## Features

- **HTMX-powered dynamic loading**: Navigate between pages without full page reloads
- **Sitemap-driven content**: Blog posts are defined in `sitemap.xml` for easy management
- **Professional design**: Clean, modern styling optimized for readability
- **Responsive layout**: Works seamlessly on desktop and mobile devices
- **Static hosting ready**: Can be deployed to any static hosting service

## Architecture

### Technology Stack
- **Frontend**: Pure HTML, CSS, and JavaScript with HTMX
- **Content Management**: File-based with HTML fragments
- **Navigation**: HTMX handles client-side routing and content swapping
- **Deployment**: Static files suitable for CDN deployment

### Project Structure
```
├── index.html              # Main page with navigation and HTMX setup
├── styles.css             # Professional CSS styling
├── sitemap.xml            # Defines site structure and blog posts
├── posts-list.html        # Blog post listing page
├── about.html            # About page content
├── resume.html           # Resume/CV page content
├── posts/                # Individual blog post files
│   ├── hands-on-vs-ivory-tower-architecture.html
│   └── cqrs-event-sourcing.html
├── server.py             # Development server (Python)
└── README.md             # This file
```

### How It Works

1. **Main Navigation**: The header contains HTMX-enabled links that load content into the main container
2. **Content Loading**: Each page is an HTML fragment that gets loaded via HTMX
3. **Blog Posts**: Individual posts are HTML files in the `/posts` directory
4. **URL Management**: HTMX handles pushing URLs to the browser history for proper navigation

## Development

### Local Development Server

Use the included Python development server to test the blog locally:

```bash
# Start the server on port 8000 (default)
python server.py

# Or specify a custom port
python server.py 3000
```

Visit `http://localhost:8000` to view the blog.

### Adding New Blog Posts

1. Create a new HTML file in the `posts/` directory
2. Add an entry to `sitemap.xml` with the post URL and title
3. Update `posts-list.html` to include a link to the new post

### Content Guidelines

- **Blog posts**: Use semantic HTML with the `.content-page` class structure
- **Styling**: Follow the established CSS classes for consistent formatting
- **HTMX links**: Use `hx-get` attributes for navigation within the site

## Deployment

This blog is designed for static hosting. You can deploy it to:

- **AWS CloudFront + S3**: Upload files to S3 and serve via CloudFront
- **Netlify**: Connect your Git repository for automatic deployments
- **Vercel**: Simple deployment with Git integration
- **GitHub Pages**: Host directly from your repository

### Deployment Checklist

1. Update URLs in `sitemap.xml` to match your domain
2. Configure your hosting service to handle client-side routing
3. Set up proper caching headers for static assets
4. Test all HTMX functionality in the production environment

## Content Areas

### Blog Posts
Focus on practical software engineering topics:
- Architecture patterns and their real-world application
- Team leadership and engineering management
- Technology decisions and trade-offs
- Lessons learned from production systems

### About Page
Professional background and expertise areas, including:
- Technical experience and specializations
- Engineering philosophy and approach
- Professional interests and focus areas

### Resume
Comprehensive professional experience including:
- Work history and achievements
- Technical skills and certifications
- Notable projects and their impact
- Leadership and mentoring experience

## Customization

### Branding
- Update the brand name in `index.html`
- Modify the brand icon in CSS (`.brand-icon::before`)
- Adjust color scheme in CSS custom properties

### Styling
- Colors: Modify CSS custom properties in `:root`
- Typography: Update font families and sizes
- Layout: Adjust grid layouts and spacing

### Content Structure
- Add new sections by creating HTML fragments
- Modify navigation in `index.html`
- Update HTMX routing as needed

## Performance Considerations

- **Lightweight**: Minimal JavaScript dependencies (only HTMX)
- **Efficient loading**: Only loads content that changes between pages
- **Responsive images**: Use appropriate image sizing and formats
- **Caching**: Static files can be heavily cached by CDNs

## Browser Support

- Modern browsers with ES2015+ support
- HTMX is compatible with IE11+ (with polyfills if needed)
- Progressive enhancement: Works without JavaScript for basic functionality

## License

This project template is available for use in your own blog projects. Feel free to adapt and modify as needed.