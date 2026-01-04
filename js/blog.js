// The Agile Engineer Blog - All-in-one JavaScript
// Web Components and Blog Functionality

// Blog Header Component
class BlogHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <nav class="nav-container">
          <div class="nav-brand">
            <div class="brand-icon"></div>
            <h1>The Agile Engineer</h1>
          </div>
          <div class="nav-links">
            <a href="/" class="nav-link">Blog</a>
            <a href="/about.html" class="nav-link">About</a>
            <a href="/resume.html" class="nav-link">Resume</a>
          </div>
        </nav>
      </header>
    `;
    
    // Set active link based on current page
    this.setActiveLink();
  }
  
  setActiveLink() {
    const currentPath = window.location.pathname;
    const links = this.querySelectorAll('.nav-link');
    
    links.forEach(link => {
      link.classList.remove('active');
      
      const href = link.getAttribute('href');
      if (
        (currentPath === '/' && href === '/') ||
        (currentPath === '/index.html' && href === '/') ||
        (currentPath.includes('/about') && href === '/about.html') ||
        (currentPath.includes('/resume') && href === '/resume.html')
      ) {
        link.classList.add('active');
      }
    });
  }
}

// Blog Footer Component
class BlogFooter extends HTMLElement {
  connectedCallback() {
    const currentYear = new Date().getFullYear();
    
    this.innerHTML = `
      <footer class="footer">
        <div class="footer-content">
          <p>&copy; ${currentYear} theagileengineer.net All rights reserved.</p>
        </div>
      </footer>
    `;
  }
}

// Posts List Component (reads from sitemap.xml)
class PostsList extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = '<div class="loading">Loading posts from sitemap...</div>';
    
    try {
      await this.loadPosts();
    } catch (error) {
      console.error('Failed to load posts:', error);
      this.innerHTML = `
        <div class="error">
          <p>Failed to load posts from sitemap.xml</p>
          <p>Make sure the sitemap file exists and is accessible.</p>
        </div>
      `;
    }
  }
  
  async loadPosts() {
    const response = await fetch('/sitemap.xml');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'application/xml');
    const urlNodes = xml.getElementsByTagName('url');
    const posts = [];

    for (let i = 0; i < urlNodes.length; i++) {
      const urlEl = urlNodes[i];
      const locEl = urlEl.getElementsByTagName('loc')[0];
      
      if (!locEl) continue;
      
      const loc = locEl.textContent.trim();
      
      // Only process URLs that contain '/posts/'
      if (!loc.includes('/posts/')) continue;

      const lastmodEl = urlEl.getElementsByTagName('lastmod')[0];
      const lastmod = lastmodEl ? lastmodEl.textContent.trim() : '';

      // Try to get title from blog:title element
      let title = '';
      let titleEl = urlEl.getElementsByTagName('blog:title')[0];

      if (titleEl) {
        title = titleEl.textContent.trim();
      } else {
        title = this.deriveTitleFromUrl(loc);
      }

      posts.push({ loc, title, lastmod });
    }

    // Sort by date, newest first
    posts.sort((a, b) => {
      const dateA = a.lastmod ? new Date(a.lastmod) : new Date(0);
      const dateB = b.lastmod ? new Date(b.lastmod) : new Date(0);
      return dateB - dateA;
    });

    this.renderPosts(posts);
  }
  
  deriveTitleFromUrl(url) {
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
  
  renderPosts(posts) {
    if (posts.length === 0) {
      this.innerHTML = `
        <div class="content-section">
          <p>No blog posts found in sitemap.xml</p>
          <p>Add posts with URLs containing '/posts/' to see them here.</p>
        </div>
      `;
      return;
    }

    const postsHtml = posts.map(post => {
      const formattedDate = post.lastmod 
        ? new Date(post.lastmod).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short', 
            day: 'numeric'
          })
        : 'No date';

      return `
        <a href="${post.loc}" class="post-card">
          <h3>${post.title}</h3>
          <p>Click to read this post about software architecture and engineering practices.</p>
          <div class="post-meta">
            <span class="post-date">${formattedDate}</span>
            <span class="read-time">~ min read</span>
          </div>
        </a>
      `;
    }).join('');

    this.innerHTML = `<div class="posts-grid">${postsHtml}</div>`;
  }
}

// Register all web components
customElements.define('blog-header', BlogHeader);
customElements.define('blog-footer', BlogFooter);
customElements.define('posts-list', PostsList);

// Smooth scroll for internal links
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});