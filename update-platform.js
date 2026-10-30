const fs = require('fs');
const path = require('path');
const { generateHeaderHTML, NAV_CONTROLLER_SCRIPT } = require('./nav-config');

console.log('=== BODOLAND ENTREPRENEURS PLATFORM UPDATE ===');

// Helper to replace header and nav script
function applyHeaderAndScript(html, activeNav, activeSubnav) {
  const headerHTML = generateHeaderHTML(activeNav, activeSubnav);
  const headerRegex = /<header[\s\S]*?<\/header>/i;
  let result = html;
  if (headerRegex.test(result)) {
    result = result.replace(headerRegex, headerHTML);
  }

  if (!result.includes('initNavigationController')) {
    result = result.replace('</body>', `${NAV_CONTROLLER_SCRIPT}\n</body>`);
  } else {
    result = result.replace(/<script>\s*\(function initNavigationController[\s\S]*?<\/script>/i, NAV_CONTROLLER_SCRIPT);
  }
  return result;
}

// -------------------------------------------------------------
// STEP 1: Update Core Pages Navigation
// -------------------------------------------------------------
console.log('\n[1/5] Updating Navigation on Core Pages...');
const corePages = [
  { file: 'index.html', nav: 'home', subnav: '' },
  { file: 'stories.html', nav: 'stories', subnav: 'all-stories' },
  { file: 'stories-startup-stories.html', nav: 'stories', subnav: 'startup-stories' },
  { file: 'stories-local-businesses.html', nav: 'stories', subnav: 'local-businesses' },
  { file: 'stories-founders-journey.html', nav: 'stories', subnav: 'founders-journey' },
  { file: 'learning.html', nav: 'learning', subnav: 'all-learning' },
  { file: 'learning-marketing.html', nav: 'learning', subnav: 'marketing' },
  { file: 'learning-sales.html', nav: 'learning', subnav: 'sales' },
  { file: 'learning-finance.html', nav: 'learning', subnav: 'finance' },
  { file: 'learning-branding.html', nav: 'learning', subnav: 'branding' },
  { file: 'learning-business-planning.html', nav: 'learning', subnav: 'business-planning' },
  { file: 'learning-practical-guides.html', nav: 'learning', subnav: 'practical-guides' },
  { file: 'insights.html', nav: 'insights', subnav: 'all-insights' },
  { file: 'insights-founder-case-files.html', nav: 'insights', subnav: 'founder-case-files' },
  { file: 'insights-business-brief.html', nav: 'insights', subnav: 'business-brief' },
  { file: 'insights-market-intelligence.html', nav: 'insights', subnav: 'market-intelligence' },
  { file: 'insights-growth-reports.html', nav: 'insights', subnav: 'growth-reports' },
  { file: 'search.html', nav: '', subnav: '' },
  { file: 'about.html', nav: '', subnav: '' },
  { file: 'contact.html', nav: '', subnav: '' },
  { file: 'write-for-us.html', nav: '', subnav: '' }
];

for (const p of corePages) {
  const filePath = path.join(__dirname, p.file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  content = applyHeaderAndScript(content, p.nav, p.subnav);
  fs.writeFileSync(filePath, content, 'utf8');
}
console.log(`✓ Updated navigation on ${corePages.length} core pages.`);

// -------------------------------------------------------------
// STEP 2: Young Entrepreneurs Simplification
// Keep only:
// 1) All Young Entrepreneurs (young-entrepreneurs.html)
// 2) Emerging Business Leaders (young-entrepreneurs-emerging-leaders.html)
// -------------------------------------------------------------
console.log('\n[2/5] Updating Young Entrepreneurs pages...');

const yePillsHTML = (activePill) => `
<div class="flex items-center gap-space-xs overflow-x-auto pb-1 md:pb-0" id="filter-pill-group">
  <a href="young-entrepreneurs.html" class="filter-pill px-space-md py-space-xs rounded-full ${activePill === 'all' ? 'bg-primary-container text-secondary-fixed active font-bold shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-variant font-semibold'} text-label-sm font-label-sm whitespace-nowrap transition-colors">
    All Young Entrepreneurs
  </a>
  <a href="young-entrepreneurs-emerging-leaders.html" class="filter-pill px-space-md py-space-xs rounded-full ${activePill === 'emerging-leaders' ? 'bg-primary-container text-secondary-fixed active font-bold shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-variant font-semibold'} text-label-sm font-label-sm whitespace-nowrap transition-colors">
    Emerging Business Leaders
  </a>
</div>`;

// Update young-entrepreneurs.html
let yeContent = fs.readFileSync(path.join(__dirname, 'young-entrepreneurs.html'), 'utf8');
yeContent = applyHeaderAndScript(yeContent, 'young-entrepreneurs', 'all-young-entrepreneurs');

// Replace pill group in young-entrepreneurs.html
yeContent = yeContent.replace(/<div class="flex items-center gap-space-xs overflow-x-auto pb-1 md:pb-0" id="filter-pill-group">[\s\S]*?<\/div>/i, yePillsHTML('all'));

// Link cards in young-entrepreneurs.html to detail page
yeContent = yeContent.replace(/href="#"(\s+class="[^"]*group-hover:translate-x-1[^"]*")/g, 'href="article-detail.html?id=black-rice"$1');
yeContent = yeContent.replace(/href="#"(\s+class="[^"]*Read Profile[^"]*")/gi, 'href="article-detail.html?id=cit-solar"$1');
fs.writeFileSync(path.join(__dirname, 'young-entrepreneurs.html'), yeContent, 'utf8');
console.log('✓ Updated young-entrepreneurs.html');

// Update young-entrepreneurs-emerging-leaders.html
let yeLeadersContent = fs.readFileSync(path.join(__dirname, 'young-entrepreneurs.html'), 'utf8');
yeLeadersContent = applyHeaderAndScript(yeLeadersContent, 'young-entrepreneurs', 'emerging-leaders');
yeLeadersContent = yeLeadersContent.replace(/<title>[\s\S]*?<\/title>/i, '<title>Emerging Business Leaders — Bodoland Entrepreneurs</title>');
yeLeadersContent = yeLeadersContent.replace(/<div class="flex items-center gap-space-xs overflow-x-auto pb-1 md:pb-0" id="filter-pill-group">[\s\S]*?<\/div>/i, yePillsHTML('emerging-leaders'));

// Update Breadcrumb & Header
const yeLeadersBreadcrumb = `
<nav aria-label="Breadcrumb" class="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant mb-space-xs">
  <a class="hover:text-secondary transition-colors" href="index.html">Home</a>
  <span class="text-outline-variant">/</span>
  <a class="hover:text-secondary transition-colors" href="young-entrepreneurs.html">Young Entrepreneurs</a>
  <span class="text-outline-variant">/</span>
  <span class="text-secondary font-semibold">Emerging Business Leaders</span>
</nav>
<div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
  <div>
    <h2 class="font-headline-2xl text-headline-2xl text-primary font-extrabold tracking-tight">
      Emerging <span class="text-secondary">Business Leaders</span>
    </h2>
    <p class="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-1">
      The vanguard of high-impact young founders, innovators, and enterprise leaders under 30 driving sustainable regional trade and employment across Bodoland.
    </p>
  </div>
  <div class="flex items-center gap-space-xs self-start md:self-end text-on-surface-variant font-label-md text-label-md bg-surface-container-low px-space-md py-space-xs rounded-full">
    <span class="material-symbols-outlined text-[16px] text-secondary">verified</span>
    <span>Vetted Leader Cohort (2026)</span>
  </div>
</div>`;
yeLeadersContent = yeLeadersContent.replace(/<section class="max-w-\[1160px\] mx-auto w-full px-gutter-sm lg:px-gutter mb-space-md">[\s\S]*?<\/section>/i, `<section class="max-w-[1160px] mx-auto w-full px-gutter-sm lg:px-gutter mb-space-md">${yeLeadersBreadcrumb}</section>`);
fs.writeFileSync(path.join(__dirname, 'young-entrepreneurs-emerging-leaders.html'), yeLeadersContent, 'utf8');
console.log('✓ Updated young-entrepreneurs-emerging-leaders.html');

// Setup redirect stubs for removed subcategories to keep links robust
const deprecatedYePages = [
  'young-entrepreneurs-young-founders.html',
  'young-entrepreneurs-student-entrepreneurs.html',
  'young-entrepreneurs-youth-startups.html'
];
for (const depPage of deprecatedYePages) {
  const redirectHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta http-equiv="refresh" content="0; url=young-entrepreneurs.html"/><title>Redirecting to Young Entrepreneurs...</title></head><body><p>Redirecting to <a href="young-entrepreneurs.html">Young Entrepreneurs</a>...</p></body></html>`;
  fs.writeFileSync(path.join(__dirname, depPage), redirectHtml, 'utf8');
  console.log(`✓ Redirected deprecated page ${depPage} -> young-entrepreneurs.html`);
}

console.log('=== SUCCESS STEP 1 & 2 ===');
