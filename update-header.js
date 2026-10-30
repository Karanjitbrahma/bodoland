const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'stories.html',
  'young-entrepreneurs.html',
  'business-ideas.html',
  'learning.html',
  'insights.html',
  'article-detail.html',
  'article-reading.html',
  'about.html'
];

function getTopBar(maxWidthClass) {
  return `<div class="bg-primary text-on-primary border-b border-primary-container">
  <div class="${maxWidthClass} mx-auto px-gutter-sm lg:px-gutter h-10 flex items-center justify-between font-body-sm text-body-sm">
    <div class="flex items-center gap-space-md">
      <span class="flex items-center gap-space-xs font-label-sm text-label-sm text-surface-variant">
        <span class="material-symbols-outlined text-[16px]">calendar_today</span>
        <span class="top-bar-date">Thursday, October 29, 2026</span>
      </span>
      <span class="hidden sm:inline text-outline-variant">|</span>
      <span class="hidden sm:inline font-body-sm text-body-sm text-surface-variant">The Voice of Northeast Entrepreneurship</span>
    </div>
    <div class="flex items-center gap-space-md">
      <!-- Language Selector -->
      <div class="flex items-center gap-1 text-surface-variant font-label-sm text-[12px]">
        <span class="material-symbols-outlined text-[15px]">language</span>
        <select aria-label="Select Language" class="bg-transparent text-surface-variant hover:text-on-primary border-none cursor-pointer text-[12px] font-label-sm focus:outline-none pr-1">
          <option value="en" class="bg-primary text-on-primary">English</option>
          <option value="brx" class="bg-primary text-on-primary">बड़ो (Bodo)</option>
          <option value="as" class="bg-primary text-on-primary">অসমীয়া (Assamese)</option>
        </select>
      </div>
      <div class="h-4 w-px bg-outline hidden sm:block"></div>
      <!-- Social Media Icons (X, Instagram, Facebook) -->
      <div class="flex items-center gap-1.5 text-surface-variant">
        <a aria-label="X" class="hover:text-secondary-fixed transition-colors p-1 flex items-center" href="https://x.com" target="_blank" rel="noopener noreferrer">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a aria-label="Instagram" class="hover:text-secondary-fixed transition-colors p-1 flex items-center" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        <a aria-label="Facebook" class="hover:text-secondary-fixed transition-colors p-1 flex items-center" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
      </div>
      <div class="h-4 w-px bg-outline hidden md:block"></div>
      <a class="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed hover:text-on-primary transition-colors" data-path="login" href="#"><span class="material-symbols-outlined text-[16px]">account_circle</span>Login / Sign Up</a>
    </div>
  </div>
</div>`;
}

const dateScript = `<script>
  (function updateTopDate() {
    const els = document.querySelectorAll('.top-bar-date');
    if (els.length) {
      const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formatted = new Date().toLocaleDateString('en-US', opts);
      els.forEach(el => el.textContent = formatted);
    }
  })();
</script>`;

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');

  // Match 1200px variation
  const regex1200 = /<div class="bg-primary text-on-primary[^"]*">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  // Match 1160px variation
  const regex1160 = /<div class="bg-primary text-inverse-on-surface[^"]*">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

  if (regex1200.test(content)) {
    content = content.replace(regex1200, getTopBar('max-w-[1200px]'));
    console.log('Updated 1200px style in', file);
  } else if (regex1160.test(content)) {
    content = content.replace(regex1160, getTopBar('max-w-[1160px]'));
    console.log('Updated 1160px style in', file);
  } else {
    console.log('No top bar found in', file);
  }

  // Ensure date script is injected before </body>
  if (!content.includes('updateTopDate')) {
    content = content.replace('</body>', dateScript + '\n</body>');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Done!');
