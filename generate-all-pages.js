const fs = require('fs');
const path = require('path');
const { NAV_STRUCTURE, generateHeaderHTML, NAV_CONTROLLER_SCRIPT } = require('./nav-config');

// Helper to replace <header>...</header> in any file
function applyHeaderAndScript(html, activeNav, activeSubnav) {
  const headerHTML = generateHeaderHTML(activeNav, activeSubnav);
  // Replace <header>...</header>
  const headerRegex = /<header[\s\S]*?<\/header>/i;
  let result = html;
  if (headerRegex.test(result)) {
    result = result.replace(headerRegex, headerHTML);
  }

  // Inject navigation controller script if not present
  if (!result.includes('initNavigationController')) {
    result = result.replace('</body>', `${NAV_CONTROLLER_SCRIPT}\n</body>`);
  } else {
    // Replace existing script
    result = result.replace(/<script>\s*\(function initNavigationController[\s\S]*?<\/script>/i, NAV_CONTROLLER_SCRIPT);
  }

  return result;
}

// 1. Process Core Existing Pages
console.log('--- Updating Core Pages with Shared Navigation ---');
const corePages = [
  { file: 'index.html', nav: 'home', subnav: '' },
  { file: 'stories.html', nav: 'stories', subnav: 'all-stories' },
  { file: 'young-entrepreneurs.html', nav: 'young-entrepreneurs', subnav: 'all-young-entrepreneurs' },
  { file: 'business-ideas.html', nav: 'business-ideas', subnav: 'all-business-ideas' },
  { file: 'learning.html', nav: 'learning', subnav: 'all-learning' },
  { file: 'insights.html', nav: 'insights', subnav: 'all-insights' },
  { file: 'search.html', nav: '', subnav: '' },
  { file: 'article-detail.html', nav: 'stories', subnav: 'all-stories' },
  { file: 'article-reading.html', nav: 'stories', subnav: 'all-stories' },
  { file: 'about.html', nav: '', subnav: '' }
];

for (const p of corePages) {
  const filePath = path.join(__dirname, p.file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  content = applyHeaderAndScript(content, p.nav, p.subnav);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Updated navigation on ${p.file}`);
}

// 2. Generate Stories Subpages
console.log('\n--- Generating Stories Subpages ---');
const storiesBase = fs.readFileSync(path.join(__dirname, 'stories.html'), 'utf8');
const storiesSubpages = [
  {
    file: 'stories-startup-stories.html',
    title: 'Startup Stories — Bodoland Entrepreneurs',
    categoryName: 'Startup Stories',
    subnav: 'startup-stories',
    tag: 'STARTUP STORY',
    description: 'Venture journeys, seed-funded models, and tech-driven startups scaling across Bodoland and Northeast India.'
  },
  {
    file: 'stories-local-businesses.html',
    title: 'Local Businesses — Bodoland Entrepreneurs',
    categoryName: 'Local Businesses',
    subnav: 'local-businesses',
    tag: 'LOCAL BUSINESS',
    description: 'Grassroots enterprises, handloom guilds, organic agro-processing, and traditional commerce building resilient local wealth.'
  },
  {
    file: 'stories-founders-journey.html',
    title: "Founder's Journey — Bodoland Entrepreneurs",
    categoryName: "Founder's Journey",
    subnav: 'founders-journey',
    tag: "FOUNDER'S JOURNEY",
    description: 'In-depth personal interviews, struggles, breakthroughs, and milestones of pioneering entrepreneurs from Northeast India.'
  }
];

for (const sub of storiesSubpages) {
  let html = storiesBase;
  // Replace title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${sub.title}</title>`);
  // Apply header
  html = applyHeaderAndScript(html, 'stories', sub.subnav);

  // Update Breadcrumb: Home > Stories > Subcategory
  const breadcrumbRegex = /(<nav[\s\S]*?>[\s\S]*?Home[\s\S]*?<\/nav>)|(<span>>[\s\S]*?<\/div>)/i;
  const newBreadcrumb = `<nav class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant mb-space-xs" aria-label="Breadcrumb">
    <a class="hover:text-secondary transition-colors" href="index.html">Home</a>
    <span>›</span>
    <a class="hover:text-secondary transition-colors" href="stories.html">Stories</a>
    <span>›</span>
    <span class="text-secondary font-semibold">${sub.categoryName}</span>
  </nav>`;
  
  // Replace section title and intro
  html = html.replace(/<h1 class="font-headline-2xl[^>]*>[\s\S]*?<\/h1>/i, 
    `<h1 class="font-headline-2xl text-headline-2xl text-primary font-extrabold tracking-tight">${sub.categoryName} <span class="text-secondary font-black">Archive</span></h1>`);
  
  html = html.replace(/<p class="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl leading-relaxed">[\s\S]*?<\/p>/i,
    `<p class="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl leading-relaxed">${sub.description}</p>`);

  // Inject category badge highlight & filter tag
  html = html.replace(/<span class="font-semibold text-primary">Sort by:<\/span>/,
    `<span class="inline-flex items-center px-2 py-0.5 rounded bg-secondary/15 text-secondary font-bold text-xs mr-2">${sub.tag}</span><span class="font-semibold text-primary">Sort by:</span>`);

  fs.writeFileSync(path.join(__dirname, sub.file), html, 'utf8');
  console.log(`✓ Created ${sub.file}`);
}

// 3. Generate Young Entrepreneurs Subpages
console.log('\n--- Generating Young Entrepreneurs Subpages ---');
const yeBase = fs.readFileSync(path.join(__dirname, 'young-entrepreneurs.html'), 'utf8');
const yeSubpages = [
  {
    file: 'young-entrepreneurs-young-founders.html',
    title: 'Young Founders — Bodoland Entrepreneurs',
    categoryName: 'Young Founders',
    subnav: 'young-founders',
    pillText: 'Young Founders',
    description: 'Founders under 30 leading innovative ventures in agricultural technology, green commerce, and digital media.'
  },
  {
    file: 'young-entrepreneurs-student-entrepreneurs.html',
    title: 'Student Entrepreneurs — Bodoland Entrepreneurs',
    categoryName: 'Student Entrepreneurs',
    subnav: 'student-entrepreneurs',
    pillText: 'Student Startups',
    description: 'Campus innovators building working prototypes and venture-backed projects at CIT Kokrajhar, Bodoland University, and IIT Guwahati.'
  },
  {
    file: 'young-entrepreneurs-emerging-leaders.html',
    title: 'Emerging Business Leaders — Bodoland Entrepreneurs',
    categoryName: 'Emerging Business Leaders',
    subnav: 'emerging-leaders',
    pillText: 'Under 25 Leaders',
    description: 'The vanguard of young leaders driving sustainable regional trade, community employment, and creative industries.'
  },
  {
    file: 'young-entrepreneurs-youth-startups.html',
    title: 'Youth-Led Startups — Bodoland Entrepreneurs',
    categoryName: 'Youth-Led Startups',
    subnav: 'youth-startups',
    pillText: 'High Growth',
    description: 'High-growth technology, logistics, and renewable energy startups conceptualized and managed by youth teams.'
  }
];

for (const sub of yeSubpages) {
  let html = yeBase;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${sub.title}</title>`);
  html = applyHeaderAndScript(html, 'young-entrepreneurs', sub.subnav);

  // Update Breadcrumb & Back navigation
  const newBreadcrumb = `<div class="mb-space-md">
    <nav class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant mb-space-xs" aria-label="Breadcrumb">
      <a class="hover:text-secondary transition-colors" href="index.html">Home</a>
      <span>›</span>
      <a class="hover:text-secondary transition-colors" href="young-entrepreneurs.html">Young Entrepreneurs</a>
      <span>›</span>
      <span class="text-secondary font-semibold">${sub.categoryName}</span>
    </nav>
    <a href="young-entrepreneurs.html" class="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm hover:underline mt-1">
      <span class="material-symbols-outlined text-[16px]">arrow_back</span> Back to All Young Entrepreneurs
    </a>
  </div>`;

  html = html.replace(/<!-- Breadcrumb Header -->[\s\S]*?<!-- Subtitle -->/i, `${newBreadcrumb}\n<!-- Subtitle -->`);

  // Activate matching pill
  html = html.replace(/class="filter-pill active[^"]*"/, 'class="filter-pill px-space-md py-space-xs rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-variant text-label-sm font-label-sm font-semibold whitespace-nowrap transition-colors"');
  const pillRegex = new RegExp(`(<button[^>]*class="filter-pill[^"]*"[^>]*>\\s*${sub.pillText}[\\s\\S]*?<\\/button>)`, 'i');
  html = html.replace(pillRegex, (match) => {
    return match.replace(/bg-surface-container-low text-on-surface-variant/, 'bg-primary-container text-secondary-fixed active font-bold shadow-sm');
  });

  fs.writeFileSync(path.join(__dirname, sub.file), html, 'utf8');
  console.log(`✓ Created ${sub.file}`);
}

// 4. Generate Business Ideas Subpages
console.log('\n--- Generating Business Ideas Subpages ---');
const biBase = fs.readFileSync(path.join(__dirname, 'business-ideas.html'), 'utf8');
const biSubpages = [
  {
    file: 'business-ideas-low-investment.html',
    title: 'Low-Investment Business Ideas — Bodoland Entrepreneurs',
    categoryName: 'Low-Investment Business Ideas',
    subnav: 'low-investment',
    pillText: 'Low-Investment',
    capital: 'Under ₹50,000',
    description: 'High-margin, micro-capital business opportunities starting under ₹50,000 with quick operational breakeven.'
  },
  {
    file: 'business-ideas-ai-in-business.html',
    title: 'AI in Business — Bodoland Entrepreneurs',
    categoryName: 'AI in Business',
    subnav: 'ai-in-business',
    pillText: 'AI in Business',
    capital: '₹50,000 – ₹2,00,000',
    description: 'Artificial intelligence tools, automated customer service, multilingual audio, and AI applications tailored for regional trade.'
  },
  {
    file: 'business-ideas-business-automation.html',
    title: 'Business Automation — Bodoland Entrepreneurs',
    categoryName: 'Business Automation',
    subnav: 'business-automation',
    pillText: 'Business Automation',
    capital: '₹50,000 – ₹2,00,000',
    description: 'Streamlining inventory, automated GST invoicing, CRM integrations, and warehouse logistics automation for Northeast SMEs.'
  },
  {
    file: 'business-ideas-digital-transformation.html',
    title: 'Digital Transformation — Bodoland Entrepreneurs',
    categoryName: 'Digital Transformation',
    subnav: 'digital-transformation',
    pillText: 'Digital Transformation',
    capital: '₹2,00,000 – ₹10,00,000',
    description: 'Bridging traditional offline enterprises, physical stores, and handicraft clusters to global omnichannel e-commerce.'
  },
  {
    file: 'business-ideas-industry-opportunities.html',
    title: 'Industry Opportunities — Bodoland Entrepreneurs',
    categoryName: 'Industry Opportunities',
    subnav: 'industry-opportunities',
    pillText: 'Industry Opportunities',
    capital: '₹2,00,000 – ₹10,00,000',
    description: 'High-potential sectors: tea export packaging, sericulture, cold storage micro-grids, and organic spice extraction.'
  }
];

for (const sub of biSubpages) {
  let html = biBase;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${sub.title}</title>`);
  html = applyHeaderAndScript(html, 'business-ideas', sub.subnav);

  // Update Breadcrumb & Back navigation
  const newBreadcrumb = `<div class="mb-space-md">
    <nav class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant mb-space-xs" aria-label="Breadcrumb">
      <a class="hover:text-secondary transition-colors" href="index.html">Home</a>
      <span>›</span>
      <a class="hover:text-secondary transition-colors" href="business-ideas.html">Business Ideas</a>
      <span>›</span>
      <span class="text-secondary font-semibold">${sub.categoryName}</span>
    </nav>
    <a href="business-ideas.html" class="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm hover:underline mt-1">
      <span class="material-symbols-outlined text-[16px]">arrow_back</span> Back to All Business Ideas
    </a>
  </div>`;

  html = html.replace(/<!-- Top Breadcrumb & Section Header[\s\S]*?<\/nav>/i, `${newBreadcrumb}`);

  // Highlight pill
  html = html.replace(/switchFilter\(this, 'all'\)" class="[^"]*"/, 'switchFilter(this, "all")" class="filter-pill shrink-0 px-space-md py-1.5 rounded-full font-label-md text-label-md bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"');
  const pillRegex = new RegExp(`(onclick="switchFilter\\(this, '${sub.pillText}'\\)" class=")([^"]*)(")`, 'i');
  html = html.replace(pillRegex, '$1filter-pill shrink-0 px-space-md py-1.5 rounded-full font-label-md text-label-md bg-primary-container text-on-primary shadow-sm transition-colors cursor-pointer$3');

  // Update counter
  html = html.replace(/Showing 1-7 of 42 blueprints/, `Showing vetted blueprints in "${sub.categoryName}" (12 matches)`);

  fs.writeFileSync(path.join(__dirname, sub.file), html, 'utf8');
  console.log(`✓ Created ${sub.file}`);
}

// 5. Generate Learning Subpages
console.log('\n--- Generating Learning Subpages ---');
const learningBase = fs.readFileSync(path.join(__dirname, 'learning.html'), 'utf8');
const learningSubpages = [
  {
    file: 'learning-marketing.html',
    title: 'Marketing Resources — Bodoland Entrepreneurs',
    categoryName: 'Marketing',
    subnav: 'marketing',
    filterTag: 'Marketing',
    description: 'Digital marketing playbooks, vernacular content strategy, meta ads, and grassroots community marketing.'
  },
  {
    file: 'learning-sales.html',
    title: 'Sales & Retail Resources — Bodoland Entrepreneurs',
    categoryName: 'Sales & Retail',
    subnav: 'sales',
    filterTag: 'Sales & Retail',
    description: 'B2B distributor onboarding, trade exhibitions, retail negotiation tactics, and marketplace pricing strategies.'
  },
  {
    file: 'learning-finance.html',
    title: 'Finance & Taxes Resources — Bodoland Entrepreneurs',
    categoryName: 'Finance',
    subnav: 'finance',
    filterTag: 'Finance & Taxes',
    description: 'Startup tax incentives in Assam/BTC, unit economics, cash flow management, Mudra loans, and seed funding compliance.'
  },
  {
    file: 'learning-branding.html',
    title: 'Branding Resources — Bodoland Entrepreneurs',
    categoryName: 'Branding',
    subnav: 'branding',
    filterTag: 'Branding',
    description: 'Packaging design for handicraft exports, brand storytelling, visual identity systems, and authentic cultural positioning.'
  },
  {
    file: 'learning-business-planning.html',
    title: 'Business Planning Resources — Bodoland Entrepreneurs',
    categoryName: 'Business Planning',
    subnav: 'business-planning',
    filterTag: 'Business Planning',
    description: 'Pitch decks for angel investors, DPR (Detailed Project Reports) preparation, and incubator application frameworks.'
  },
  {
    file: 'learning-practical-guides.html',
    title: 'Practical Guides — Bodoland Entrepreneurs',
    categoryName: 'Practical Guides',
    subnav: 'practical-guides',
    filterTag: 'Practical Guides',
    description: 'Step-by-step walkthroughs for GST registration, trademark filing, FSSAI licensing, and export documentation in Assam.'
  }
];

for (const sub of learningSubpages) {
  let html = learningBase;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${sub.title}</title>`);
  html = applyHeaderAndScript(html, 'learning', sub.subnav);

  // Update Breadcrumb & Back navigation
  const newBreadcrumb = `<div class="mb-space-md">
    <nav class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant mb-space-xs" aria-label="Breadcrumb">
      <a class="hover:text-secondary transition-colors" href="index.html">Home</a>
      <span>›</span>
      <a class="hover:text-secondary transition-colors" href="learning.html">Learning</a>
      <span>›</span>
      <span class="text-secondary font-semibold">${sub.categoryName}</span>
    </nav>
    <a href="learning.html" class="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm hover:underline mt-1">
      <span class="material-symbols-outlined text-[16px]">arrow_back</span> Back to All Learning Resources
    </a>
  </div>`;

  html = html.replace(/<!-- Breadcrumb -->[\s\S]*?<\/nav>/i, `${newBreadcrumb}`);

  // Highlight pill
  html = html.replace(/bg-primary text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded-full shadow-sm/, 
    'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded-full transition-colors');
  const pillRegex = new RegExp(`(<button[^>]*class="[^"]*rounded-full[^"]*"[^>]*>\\s*${sub.categoryName.replace('&', '&amp;')}[\\s\\S]*?<\\/button>)`, 'i');
  html = html.replace(pillRegex, (m) => m.replace(/bg-surface-container-low[^"]*/, 'bg-primary text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded-full shadow-sm font-bold'));

  fs.writeFileSync(path.join(__dirname, sub.file), html, 'utf8');
  console.log(`✓ Created ${sub.file}`);
}

// 6. Generate Insights Subpages
console.log('\n--- Generating Insights Subpages ---');
const insightsBase = fs.readFileSync(path.join(__dirname, 'insights.html'), 'utf8');
const insightsSubpages = [
  {
    file: 'insights-founder-case-files.html',
    title: 'Founder Case Files — Bodoland Entrepreneurs',
    categoryName: 'Founder Case Files',
    subnav: 'founder-case-files',
    description: 'Post-mortems, balance sheets, turnaround strategies, and unvarnished deep-dives into real businesses in Bodoland.'
  },
  {
    file: 'insights-business-brief.html',
    title: 'Business Brief — Bodoland Entrepreneurs',
    categoryName: 'Business Brief',
    subnav: 'business-brief',
    description: 'Weekly intelligence dispatch synthesizing capital investments, regulatory decisions, and grassroots economic metrics.'
  },
  {
    file: 'insights-market-intelligence.html',
    title: 'Market Intelligence — Bodoland Entrepreneurs',
    categoryName: 'Market Intelligence',
    subnav: 'market-intelligence',
    description: 'Commodity pricing benchmarks, buyer off-take trends, logistics corridors, and industrial zone updates in BTC.'
  },
  {
    file: 'insights-growth-reports.html',
    title: 'Growth Reports — Bodoland Entrepreneurs',
    categoryName: 'Growth Reports',
    subnav: 'growth-reports',
    description: 'Quarterly state-of-entrepreneurship reports covering revenue growth, venture funding, and employment creation.'
  }
];

for (const sub of insightsSubpages) {
  let html = insightsBase;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${sub.title}</title>`);
  html = applyHeaderAndScript(html, 'insights', sub.subnav);

  // Update Breadcrumb & Back navigation
  const newBreadcrumb = `<div class="mb-space-md">
    <nav class="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant mb-space-xs" aria-label="Breadcrumb">
      <a class="hover:text-secondary transition-colors" href="index.html">Home</a>
      <span class="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
      <a class="hover:text-secondary transition-colors" href="insights.html">Insights</a>
      <span class="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
      <span class="text-secondary font-bold">${sub.categoryName}</span>
    </nav>
    <a href="insights.html" class="inline-flex items-center gap-1 text-secondary font-label-md text-label-md hover:underline mt-1">
      <span class="material-symbols-outlined text-[16px]">arrow_back</span> Back to All Insights
    </a>
  </div>`;

  html = html.replace(/<!-- Breadcrumbs -->[\s\S]*?<\/nav>/i, `${newBreadcrumb}`);

  // Highlight pill
  html = html.replace(/bg-secondary text-on-secondary transition-colors shrink-0/, 
    'bg-surface-container text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container transition-colors shrink-0');
  const pillRegex = new RegExp(`(<button[^>]*class="filter-pill[^"]*"[^>]*>\\s*${sub.categoryName}[\\s\\S]*?<\\/button>)`, 'i');
  html = html.replace(pillRegex, (m) => m.replace(/bg-surface-container text-on-surface-variant/, 'bg-secondary text-on-secondary font-bold shadow-sm'));

  fs.writeFileSync(path.join(__dirname, sub.file), html, 'utf8');
  console.log(`✓ Created ${sub.file}`);
}

// 7. Generate Contact Us and Write For Us Pages
console.log('\n--- Generating Contact and Write For Us Pages ---');
const aboutBase = fs.readFileSync(path.join(__dirname, 'about.html'), 'utf8');

// Contact Us
let contactHtml = aboutBase;
contactHtml = contactHtml.replace(/<title>[\s\S]*?<\/title>/i, '<title>Contact Us — Bodoland Entrepreneurs</title>');
contactHtml = applyHeaderAndScript(contactHtml, '', '');
contactHtml = contactHtml.replace(/About Us &amp; Standards/g, 'Contact Us & Newsroom');
contactHtml = contactHtml.replace(/Documenting the Builders, Innovators, and Enterprise of Bodoland and Northeast India/g, 'Get in Touch with our Editorial & Regional Bureau Team');
contactHtml = contactHtml.replace(/CHARTER &amp; NEWSROOM ETHICS/g, 'EDITORIAL DISPATCH & INQUIRIES');
fs.writeFileSync(path.join(__dirname, 'contact.html'), contactHtml, 'utf8');
console.log('✓ Created contact.html');

// Write For Us
let writeHtml = aboutBase;
writeHtml = writeHtml.replace(/<title>[\s\S]*?<\/title>/i, '<title>Write for Us — Bodoland Entrepreneurs</title>');
writeHtml = applyHeaderAndScript(writeHtml, '', '');
writeHtml = writeHtml.replace(/About Us &amp; Standards/g, 'Write for Us & Pitch Guidelines');
writeHtml = writeHtml.replace(/Documenting the Builders, Innovators, and Enterprise of Bodoland and Northeast India/g, 'Share Your Founder Story or Pitch an Editorial Deep Dive');
writeHtml = writeHtml.replace(/CHARTER &amp; NEWSROOM ETHICS/g, 'CONTRIBUTOR GUIDELINES & DOSSIER');
fs.writeFileSync(path.join(__dirname, 'write-for-us.html'), writeHtml, 'utf8');
console.log('✓ Created write-for-us.html');

console.log('\nAll pages and navigation components built successfully!');
