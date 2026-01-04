const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8000;

// MIME types mapping
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function serveFile(filePath, contentType, response) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('File not found');
      return;
    }
    
    response.writeHead(200, { 
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);
  let pathname = parsedUrl.pathname;
  
  // Handle HTMX sitemap processing
  if (pathname === '/sitemap.xml' && request.headers['hx-request']) {
    processSitemapForPosts(response);
    return;
  }
  
  // Handle JavaScript files
  if (pathname.startsWith('/js/') && pathname.endsWith('.js')) {
    const filename = path.basename(pathname);
    const filePath = path.join('js', filename);
    serveFile(filePath, 'application/javascript', response);
    return;
  }

  // Handle CSS files
  if (pathname === '/styles.css') {
    serveFile('styles.css', 'text/css', response);
    return;
  }

  // Handle HTMX routes
  if (pathname === '/posts-list') {
    serveFile('posts-list.html', 'text/html', response);
    return;
  }
  
  if (pathname === '/about') {
    serveFile('about.html', 'text/html', response);
    return;
  }
  
  if (pathname === '/resume') {
    serveFile('resume.html', 'text/html', response);
    return;
  }
  
  // Handle blog posts
  if (pathname.startsWith('/posts/') && pathname.endsWith('.html')) {
    const filename = path.basename(pathname);
    const filePath = path.join('posts', filename);
    
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Post not found');
        return;
      }
      
      // If this is an HTMX request, serve the fragment
      if (request.headers['hx-request']) {
        serveFile(filePath, 'text/html', response);
      } else {
        // If accessed directly, wrap in full page structure
        servePostWithLayout(filePath, response);
      }
    });
    return;
  }
  
  // Default file serving
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  const filePath = path.join(__dirname, pathname);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/plain';
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('File not found');
      return;
    }
    
    serveFile(filePath, contentType, response);
  });
});

function processSitemapForPosts(response) {
  fs.readFile('sitemap.xml', 'utf8', (err, xmlData) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/html' });
      response.end('<div class="error">Failed to read sitemap.xml</div>');
      return;
    }
    
    try {
      // Simple XML parsing to extract posts
      const postMatches = xmlData.match(/<url>[\s\S]*?<\/url>/g) || [];
      const posts = [];
      
      postMatches.forEach(urlBlock => {
        const locMatch = urlBlock.match(/<loc>(.*?)<\/loc>/);
        const titleMatch = urlBlock.match(/<blog:title>(.*?)<\/blog:title>/);
        const lastmodMatch = urlBlock.match(/<lastmod>(.*?)<\/lastmod>/);
        
        if (locMatch && locMatch[1].includes('/posts/')) {
          const loc = locMatch[1].trim();
          const title = titleMatch ? titleMatch[1].trim() : deriveTitleFromUrl(loc);
          const lastmod = lastmodMatch ? lastmodMatch[1].trim() : '';
          
          posts.push({ loc, title, lastmod });
        }
      });
      
      // Sort by date, newest first
      posts.sort((a, b) => {
        const dateA = a.lastmod ? new Date(a.lastmod) : new Date(0);
        const dateB = b.lastmod ? new Date(b.lastmod) : new Date(0);
        return dateB - dateA;
      });
      
      // Generate HTML for posts
      const postsHtml = posts.map(post => {
        const formattedDate = post.lastmod 
          ? new Date(post.lastmod).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short', 
              day: 'numeric'
            })
          : 'No date';
        
        // Use relative path for HTMX
        const relativePath = post.loc.startsWith('/') ? post.loc.substring(1) : post.loc;
        
        return `
          <a href="#" 
             hx-get="${relativePath}" 
             hx-target="#main-content"
             hx-push-url="${post.loc}"
             class="post-card">
            <h3>${post.title}</h3>
            <p>Click to read this post about software architecture and engineering practices.</p>
            <div class="post-meta">
              <span class="post-date">${formattedDate}</span>
              <span class="read-time">~ min read</span>
            </div>
          </a>
        `;
      }).join('');
      
      const html = posts.length > 0 
        ? `<div class="posts-grid">${postsHtml}</div>`
        : '<div class="content-section"><p>No blog posts found in sitemap.xml</p></div>';
      
      response.writeHead(200, { 
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      });
      response.end(html);
      
    } catch (parseError) {
      response.writeHead(500, { 'Content-Type': 'text/html' });
      response.end('<div class="error">Failed to parse sitemap.xml</div>');
    }
  });
}

function servePostWithLayout(postPath, response) {
  // When accessed directly, just serve the post file as-is
  // The post files now have full HTML structure with proper absolute paths
  fs.readFile(postPath, 'utf8', (err, postData) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Failed to load post');
      return;
    }
    
    response.writeHead(200, { 
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*'
    });
    response.end(postData);
  });
}

function deriveTitleFromUrl(url) {
  try {
    const segments = url.split('/').filter(Boolean);
    let slug = segments[segments.length - 1] || '';
    slug = slug.replace(/\.[^/.]+$/, ''); // Remove extension
    
    return slug
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  } catch (e) {
    return 'Untitled Post';
  }
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    process.exit(0);
  });
});