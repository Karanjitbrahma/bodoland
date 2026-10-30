const fs = require('fs');
const path = require('path');

// 1. Navigation Schema
const NAV_STRUCTURE = {
  home: {
    title: 'Home',
    href: 'index.html',
    hasDropdown: false
  },
  stories: {
    title: 'Stories',
    href: 'stories.html',
    hasDropdown: true,
    subpages: [
      { id: 'all-stories', title: 'All Stories', file: 'stories.html', filterTag: 'ALL' },
      { id: 'startup-stories', title: 'Startup Stories', file: 'stories-startup-stories.html', filterTag: 'STARTUP STORY' },
      { id: 'local-businesses', title: 'Local Businesses', file: 'stories-local-businesses.html', filterTag: 'LOCAL BUSINESS' },
      { id: 'founders-journey', title: "Founder's Journey", file: 'stories-founders-journey.html', filterTag: "FOUNDER'S JOURNEY" }
    ]
  },
  youngEntrepreneurs: {
    title: 'Young Entrepreneurs',
    href: 'young-entrepreneurs.html',
    hasDropdown: true,
    subpages: [
      { id: 'all-young-entrepreneurs', title: 'All Young Entrepreneurs', file: 'young-entrepreneurs.html', filterTag: 'ALL' },
      { id: 'emerging-leaders', title: 'Emerging Business Leaders', file: 'young-entrepreneurs-emerging-leaders.html', filterTag: 'Under 25 Leaders' }
    ]
  },
  businessIdeas: {
    title: 'Business Ideas',
    href: 'business-ideas.html',
    hasDropdown: true,
    subpages: [
      { id: 'all-business-ideas', title: 'All Business Ideas', file: 'business-ideas.html', filterTag: 'all' },
      { id: 'low-investment', title: 'Low-Investment Business Ideas', file: 'business-ideas-low-investment.html', filterTag: 'Low-Investment' },
      { id: 'ai-in-business', title: 'AI in Business', file: 'business-ideas-ai-in-business.html', filterTag: 'AI in Business' },
      { id: 'business-automation', title: 'Business Automation', file: 'business-ideas-business-automation.html', filterTag: 'Business Automation' },
      { id: 'digital-transformation', title: 'Digital Transformation', file: 'business-ideas-digital-transformation.html', filterTag: 'Digital Transformation' },
      { id: 'industry-opportunities', title: 'Industry Opportunities', file: 'business-ideas-industry-opportunities.html', filterTag: 'Industry Opportunities' }
    ]
  },
  learning: {
    title: 'Learning',
    href: 'learning.html',
    hasDropdown: true,
    subpages: [
      { id: 'all-learning', title: 'All Learning Resources', file: 'learning.html', filterTag: 'All Playbooks' },
      { id: 'marketing', title: 'Marketing', file: 'learning-marketing.html', filterTag: 'Marketing' },
      { id: 'sales', title: 'Sales', file: 'learning-sales.html', filterTag: 'Sales & Retail' },
      { id: 'finance', title: 'Finance', file: 'learning-finance.html', filterTag: 'Finance & Taxes' },
      { id: 'branding', title: 'Branding', file: 'learning-branding.html', filterTag: 'Branding' },
      { id: 'business-planning', title: 'Business Planning', file: 'learning-business-planning.html', filterTag: 'Business Planning' },
      { id: 'practical-guides', title: 'Practical Guides', file: 'learning-practical-guides.html', filterTag: 'Practical Guides' }
    ]
  },
  insights: {
    title: 'Insights',
    href: 'insights.html',
    hasDropdown: true,
    subpages: [
      { id: 'all-insights', title: 'All Insights', file: 'insights.html', filterTag: 'All Intelligence' },
      { id: 'founder-case-files', title: 'Founder Case Files', file: 'insights-founder-case-files.html', filterTag: 'Founder Case Files' },
      { id: 'business-brief', title: 'Business Brief', file: 'insights-business-brief.html', filterTag: 'Business Brief' },
      { id: 'market-intelligence', title: 'Market Intelligence', file: 'insights-market-intelligence.html', filterTag: 'Market Intelligence' },
      { id: 'growth-reports', title: 'Growth Reports', file: 'insights-growth-reports.html', filterTag: 'Growth Reports' }
    ]
  }
};

// 2. Canonical Shared Header Template Function
function generateHeaderHTML(activeNav = '', activeSubnav = '') {
  return `<header class="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest" id="site-header">
  <!-- Top Utility Bar (Dynamic Date, Language Selector, Social Links) -->
  <div class="bg-primary text-on-primary border-b border-primary-container">
    <div class="max-w-[1200px] mx-auto px-gutter-sm lg:px-gutter h-10 flex items-center justify-between font-body-sm text-body-sm">
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
  </div>

  <!-- Primary Header & Main Navigation Bar -->
  <div class="shadow-[0_1px_8px_rgba(0,0,0,0.04)] relative">
    <div class="max-w-[1200px] mx-auto px-gutter-sm lg:px-gutter h-20 flex items-center justify-between">
      <!-- Brand Logo -->
      <div class="flex items-center gap-space-md">
        <a class="flex items-center gap-space-sm text-decoration-none group" data-path="home" href="index.html">
          <img alt="Bodoland Entrepreneurs Profile Logo" class="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1VngNN9LxnZKnBuUMCGIDwfzuIAxN0oT6Q-iruoar0VyXowhuq6DFass1fwD4s6ardYPwlyjA7B8Mvp9KBnZYJQ4WvohXCRAq3GM1MKRd7xULHoPXWGKqPp7VaP8ypF5iSlZ51pXdif0w-MKDXGy1c1xuQxeobbbJAUAZIGjlPgxQjzgBA3rnTFO3rZop5IHIAvqYXGhNCzzoBWilyMlWfAGaSEH_OPIWEUL3n1aLQ5HA6R_yXZuCvS6fU"/>
          <div class="flex flex-col">
            <span class="font-headline-md text-headline-md text-primary font-bold tracking-tight group-hover:text-secondary transition-colors">Bodoland Entrepreneurs</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[9px] leading-tight">Inspire • Innovate • Elevate</span>
          </div>
        </a>
      </div>

      <!-- Desktop Navigation Menu -->
      <nav class="hidden xl:flex items-center gap-space-sm h-full" id="desktop-nav-bar" aria-label="Main Navigation">
        <!-- 1. Home (Direct link without dropdown) -->
        <a class="nav-item-link h-full flex items-center px-3 font-headline-sm text-headline-sm transition-colors ${activeNav === 'home' ? 'text-secondary border-b-2 border-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-nav="home" href="index.html">Home</a>

        <!-- 2. Stories Dropdown -->
        <div class="nav-dropdown-item relative group h-full flex items-center" data-nav="stories">
          <button class="nav-btn h-full flex items-center gap-1 px-3 font-headline-sm text-headline-sm transition-colors ${activeNav === 'stories' ? 'text-secondary border-b-2 border-secondary font-bold' : 'text-on-surface-variant group-hover:text-secondary'} focus:outline-none" type="button" aria-expanded="false" aria-haspopup="true">
            <span>Stories</span>
            <span class="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180">keyboard_arrow_down</span>
          </button>
          <div class="dropdown-menu absolute left-0 top-[calc(100%-4px)] w-60 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'all-stories' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="all-stories" href="stories.html">All Stories</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'startup-stories' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="startup-stories" href="stories-startup-stories.html">Startup Stories</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'local-businesses' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="local-businesses" href="stories-local-businesses.html">Local Businesses</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'founders-journey' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="founders-journey" href="stories-founders-journey.html">Founder's Journey</a>
          </div>
        </div>

        <!-- 3. Young Entrepreneurs Dropdown -->
        <div class="nav-dropdown-item relative group h-full flex items-center" data-nav="young-entrepreneurs">
          <button class="nav-btn h-full flex items-center gap-1 px-3 font-headline-sm text-headline-sm transition-colors ${activeNav === 'young-entrepreneurs' ? 'text-secondary border-b-2 border-secondary font-bold' : 'text-on-surface-variant group-hover:text-secondary'} focus:outline-none" type="button" aria-expanded="false" aria-haspopup="true">
            <span>Young Entrepreneurs</span>
            <span class="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180">keyboard_arrow_down</span>
          </button>
          <div class="dropdown-menu absolute left-0 top-[calc(100%-4px)] w-64 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'all-young-entrepreneurs' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="all-young-entrepreneurs" href="young-entrepreneurs.html">All Young Entrepreneurs</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'emerging-leaders' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="emerging-leaders" href="young-entrepreneurs-emerging-leaders.html">Emerging Business Leaders</a>
          </div>
        </div>

        <!-- 4. Business Ideas Dropdown -->
        <div class="nav-dropdown-item relative group h-full flex items-center" data-nav="business-ideas">
          <button class="nav-btn h-full flex items-center gap-1 px-3 font-headline-sm text-headline-sm transition-colors ${activeNav === 'business-ideas' ? 'text-secondary border-b-2 border-secondary font-bold' : 'text-on-surface-variant group-hover:text-secondary'} focus:outline-none" type="button" aria-expanded="false" aria-haspopup="true">
            <span>Business Ideas</span>
            <span class="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180">keyboard_arrow_down</span>
          </button>
          <div class="dropdown-menu absolute left-0 top-[calc(100%-4px)] w-64 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'all-business-ideas' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="all-business-ideas" href="business-ideas.html">All Business Ideas</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'low-investment' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="low-investment" href="business-ideas-low-investment.html">Low-Investment Business Ideas</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'ai-in-business' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="ai-in-business" href="business-ideas-ai-in-business.html">AI in Business</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'business-automation' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="business-automation" href="business-ideas-business-automation.html">Business Automation</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'digital-transformation' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="digital-transformation" href="business-ideas-digital-transformation.html">Digital Transformation</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'industry-opportunities' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="industry-opportunities" href="business-ideas-industry-opportunities.html">Industry Opportunities</a>
          </div>
        </div>

        <!-- 5. Learning Dropdown -->
        <div class="nav-dropdown-item relative group h-full flex items-center" data-nav="learning">
          <button class="nav-btn h-full flex items-center gap-1 px-3 font-headline-sm text-headline-sm transition-colors ${activeNav === 'learning' ? 'text-secondary border-b-2 border-secondary font-bold' : 'text-on-surface-variant group-hover:text-secondary'} focus:outline-none" type="button" aria-expanded="false" aria-haspopup="true">
            <span>Learning</span>
            <span class="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180">keyboard_arrow_down</span>
          </button>
          <div class="dropdown-menu absolute left-0 top-[calc(100%-4px)] w-60 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'all-learning' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="all-learning" href="learning.html">All Learning Resources</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'marketing' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="marketing" href="learning-marketing.html">Marketing</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'sales' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="sales" href="learning-sales.html">Sales</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'finance' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="finance" href="learning-finance.html">Finance</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'branding' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="branding" href="learning-branding.html">Branding</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'business-planning' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="business-planning" href="learning-business-planning.html">Business Planning</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'practical-guides' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="practical-guides" href="learning-practical-guides.html">Practical Guides</a>
          </div>
        </div>

        <!-- 6. Insights Dropdown (right-aligned to avoid clipping) -->
        <div class="nav-dropdown-item relative group h-full flex items-center" data-nav="insights">
          <button class="nav-btn h-full flex items-center gap-1 px-3 font-headline-sm text-headline-sm transition-colors ${activeNav === 'insights' ? 'text-secondary border-b-2 border-secondary font-bold' : 'text-on-surface-variant group-hover:text-secondary'} focus:outline-none" type="button" aria-expanded="false" aria-haspopup="true">
            <span>Insights</span>
            <span class="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180">keyboard_arrow_down</span>
          </button>
          <div class="dropdown-menu absolute right-0 top-[calc(100%-4px)] w-60 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'all-insights' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="all-insights" href="insights.html">All Insights</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'founder-case-files' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="founder-case-files" href="insights-founder-case-files.html">Founder Case Files</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'business-brief' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="business-brief" href="insights-business-brief.html">Business Brief</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'market-intelligence' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="market-intelligence" href="insights-market-intelligence.html">Market Intelligence</a>
            <a class="dropdown-link block px-4 py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low hover:text-secondary transition-colors ${activeSubnav === 'growth-reports' ? 'bg-secondary/10 text-secondary font-semibold' : ''}" data-subnav="growth-reports" href="insights-growth-reports.html">Growth Reports</a>
          </div>
        </div>
      </nav>

      <!-- Right Utility Actions -->
      <div class="flex items-center gap-space-sm">
        <a aria-label="Search Articles" class="p-space-xs text-on-surface-variant hover:text-secondary transition-colors flex items-center justify-center" data-path="search" href="search.html">
          <span class="material-symbols-outlined text-[24px]">search</span>
        </a>
        <button aria-label="Open Mobile Navigation" id="mobile-menu-toggle-btn" class="xl:hidden p-space-xs text-on-surface-variant hover:text-secondary transition-colors flex items-center justify-center focus:outline-none" type="button" aria-expanded="false" aria-controls="mobile-drawer">
          <span class="material-symbols-outlined text-[26px]">menu</span>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Accordion Navigation -->
    <div class="hidden xl:hidden bg-surface-container-lowest border-t border-outline-variant/40 px-gutter-sm py-space-md max-h-[calc(100vh-120px)] overflow-y-auto" id="mobile-drawer">
      <div class="flex flex-col gap-space-sm font-headline-sm">
        <a class="py-space-xs ${activeNav === 'home' ? 'text-secondary font-bold' : 'text-on-surface hover:text-secondary'} transition-colors" data-nav="home" href="index.html">Home</a>

        <!-- Stories Accordion -->
        <details class="group border-b border-outline-variant/20 pb-2" data-nav="stories" ${activeNav === 'stories' ? 'open' : ''}>
          <summary class="flex items-center justify-between py-space-xs cursor-pointer list-none ${activeNav === 'stories' ? 'text-secondary font-bold' : 'text-on-surface hover:text-secondary'} transition-colors">
            <span>Stories</span>
            <span class="material-symbols-outlined text-[20px] transition-transform duration-200 group-open:rotate-180">expand_more</span>
          </summary>
          <div class="pl-4 py-1 flex flex-col gap-1 border-l-2 border-secondary/40 my-1">
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'all-stories' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="all-stories" href="stories.html">All Stories</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'startup-stories' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="startup-stories" href="stories-startup-stories.html">Startup Stories</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'local-businesses' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="local-businesses" href="stories-local-businesses.html">Local Businesses</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'founders-journey' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="founders-journey" href="stories-founders-journey.html">Founder's Journey</a>
          </div>
        </details>

        <!-- Young Entrepreneurs Accordion -->
        <details class="group border-b border-outline-variant/20 pb-2" data-nav="young-entrepreneurs" ${activeNav === 'young-entrepreneurs' ? 'open' : ''}>
          <summary class="flex items-center justify-between py-space-xs cursor-pointer list-none ${activeNav === 'young-entrepreneurs' ? 'text-secondary font-bold' : 'text-on-surface hover:text-secondary'} transition-colors">
            <span>Young Entrepreneurs</span>
            <span class="material-symbols-outlined text-[20px] transition-transform duration-200 group-open:rotate-180">expand_more</span>
          </summary>
          <div class="pl-4 py-1 flex flex-col gap-1 border-l-2 border-secondary/40 my-1">
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'all-young-entrepreneurs' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="all-young-entrepreneurs" href="young-entrepreneurs.html">All Young Entrepreneurs</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'emerging-leaders' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="emerging-leaders" href="young-entrepreneurs-emerging-leaders.html">Emerging Business Leaders</a>
          </div>
        </details>

        <!-- Business Ideas Accordion -->
        <details class="group border-b border-outline-variant/20 pb-2" data-nav="business-ideas" ${activeNav === 'business-ideas' ? 'open' : ''}>
          <summary class="flex items-center justify-between py-space-xs cursor-pointer list-none ${activeNav === 'business-ideas' ? 'text-secondary font-bold' : 'text-on-surface hover:text-secondary'} transition-colors">
            <span>Business Ideas</span>
            <span class="material-symbols-outlined text-[20px] transition-transform duration-200 group-open:rotate-180">expand_more</span>
          </summary>
          <div class="pl-4 py-1 flex flex-col gap-1 border-l-2 border-secondary/40 my-1">
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'all-business-ideas' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="all-business-ideas" href="business-ideas.html">All Business Ideas</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'low-investment' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="low-investment" href="business-ideas-low-investment.html">Low-Investment Business Ideas</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'ai-in-business' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="ai-in-business" href="business-ideas-ai-in-business.html">AI in Business</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'business-automation' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="business-automation" href="business-ideas-business-automation.html">Business Automation</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'digital-transformation' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="digital-transformation" href="business-ideas-digital-transformation.html">Digital Transformation</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'industry-opportunities' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="industry-opportunities" href="business-ideas-industry-opportunities.html">Industry Opportunities</a>
          </div>
        </details>

        <!-- Learning Accordion -->
        <details class="group border-b border-outline-variant/20 pb-2" data-nav="learning" ${activeNav === 'learning' ? 'open' : ''}>
          <summary class="flex items-center justify-between py-space-xs cursor-pointer list-none ${activeNav === 'learning' ? 'text-secondary font-bold' : 'text-on-surface hover:text-secondary'} transition-colors">
            <span>Learning</span>
            <span class="material-symbols-outlined text-[20px] transition-transform duration-200 group-open:rotate-180">expand_more</span>
          </summary>
          <div class="pl-4 py-1 flex flex-col gap-1 border-l-2 border-secondary/40 my-1">
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'all-learning' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="all-learning" href="learning.html">All Learning Resources</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'marketing' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="marketing" href="learning-marketing.html">Marketing</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'sales' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="sales" href="learning-sales.html">Sales</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'finance' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="finance" href="learning-finance.html">Finance</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'branding' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="branding" href="learning-branding.html">Branding</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'business-planning' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="business-planning" href="learning-business-planning.html">Business Planning</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'practical-guides' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="practical-guides" href="learning-practical-guides.html">Practical Guides</a>
          </div>
        </details>

        <!-- Insights Accordion -->
        <details class="group border-b border-outline-variant/20 pb-2" data-nav="insights" ${activeNav === 'insights' ? 'open' : ''}>
          <summary class="flex items-center justify-between py-space-xs cursor-pointer list-none ${activeNav === 'insights' ? 'text-secondary font-bold' : 'text-on-surface hover:text-secondary'} transition-colors">
            <span>Insights</span>
            <span class="material-symbols-outlined text-[20px] transition-transform duration-200 group-open:rotate-180">expand_more</span>
          </summary>
          <div class="pl-4 py-1 flex flex-col gap-1 border-l-2 border-secondary/40 my-1">
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'all-insights' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="all-insights" href="insights.html">All Insights</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'founder-case-files' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="founder-case-files" href="insights-founder-case-files.html">Founder Case Files</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'business-brief' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="business-brief" href="insights-business-brief.html">Business Brief</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'market-intelligence' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="market-intelligence" href="insights-market-intelligence.html">Market Intelligence</a>
            <a class="py-1 font-body-sm text-body-sm transition-colors ${activeSubnav === 'growth-reports' ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}" data-subnav="growth-reports" href="insights-growth-reports.html">Growth Reports</a>
          </div>
        </details>
      </div>
    </div>
  </div>
</header>`;
}

// 3. Client Navigation Script Function
const NAV_CONTROLLER_SCRIPT = `<script>
  (function initNavigationController() {
    // 1. Dynamic Date Update
    const dateEls = document.querySelectorAll('.top-bar-date');
    if (dateEls.length) {
      const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formatted = new Date().toLocaleDateString('en-US', opts);
      dateEls.forEach(el => el.textContent = formatted);
    }

    // 2. Mobile Drawer Toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = mobileDrawer.classList.contains('hidden');
        if (isHidden) {
          mobileDrawer.classList.remove('hidden');
          mobileToggle.setAttribute('aria-expanded', 'true');
        } else {
          mobileDrawer.classList.add('hidden');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // 3. Desktop Dropdown Click & Keyboard Navigation
    const dropdownItems = document.querySelectorAll('.nav-dropdown-item');
    dropdownItems.forEach((item) => {
      const btn = item.querySelector('.nav-btn');
      const menu = item.querySelector('.dropdown-menu');
      if (!btn || !menu) return;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('opacity-100');
        // Close other dropdowns
        dropdownItems.forEach((other) => {
          if (other !== item) {
            const otherMenu = other.querySelector('.dropdown-menu');
            const otherBtn = other.querySelector('.nav-btn');
            if (otherMenu) otherMenu.classList.remove('opacity-100', 'visible', '!opacity-100', '!visible');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          menu.classList.remove('opacity-100', 'visible', '!opacity-100', '!visible');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          menu.classList.add('!opacity-100', '!visible');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      dropdownItems.forEach((item) => {
        const menu = item.querySelector('.dropdown-menu');
        const btn = item.querySelector('.nav-btn');
        if (menu && !item.contains(e.target)) {
          menu.classList.remove('!opacity-100', '!visible');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
      if (mobileDrawer && mobileToggle && !mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.add('hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Keyboard Accessibility: Escape key closes all dropdowns & drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownItems.forEach((item) => {
          const menu = item.querySelector('.dropdown-menu');
          const btn = item.querySelector('.nav-btn');
          if (menu) menu.classList.remove('!opacity-100', '!visible');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        if (mobileDrawer) {
          mobileDrawer.classList.add('hidden');
          if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // 4. URL Parameter category filter support
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      const pills = document.querySelectorAll('.filter-pill');
      pills.forEach((pill) => {
        const pillText = pill.textContent.trim().toLowerCase();
        if (pillText === categoryParam.toLowerCase() || pillText.includes(categoryParam.toLowerCase())) {
          pill.click();
        }
      });
    }
  })();
</script>`;

module.exports = {
  NAV_STRUCTURE,
  generateHeaderHTML,
  NAV_CONTROLLER_SCRIPT
};
