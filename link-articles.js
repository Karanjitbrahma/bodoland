const fs = require('fs');
const path = require('path');

console.log('=== LINKING ALL ARTICLE CARDS ACROSS SITE TO MASTER DETAIL PAGE ===');

const filesToLink = [
  'index.html',
  'stories.html',
  'stories-startup-stories.html',
  'stories-local-businesses.html',
  'stories-founders-journey.html',
  'young-entrepreneurs.html',
  'young-entrepreneurs-emerging-leaders.html',
  'learning.html',
  'insights.html'
];

for (const file of filesToLink) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace article card links
  html = html.replace(/href="#"(\s+class="[^"]*group[^"]*")/g, 'href="article-detail.html?id=kokrajhar-weaves"$1');
  html = html.replace(/href="#"(\s+class="[^"]*Read Story[^"]*")/gi, 'href="article-detail.html?id=kokrajhar-weaves"$1');
  html = html.replace(/href="#"(\s+class="[^"]*Read Profile[^"]*")/gi, 'href="article-detail.html?id=cit-solar"$1');
  html = html.replace(/href="#"(\s+class="[^"]*Read More[^"]*")/gi, 'href="article-detail.html?id=kokrajhar-weaves"$1');
  html = html.replace(/href="#"(\s+class="[^"]*View Blueprint[^"]*")/gi, 'href="article-detail.html?id=ginger-turmeric"$1');

  // Specific article headlines
  html = html.replace(/href="#"([^>]*>[\s\S]*?Kokrajhar Weaves)/gi, 'href="article-detail.html?id=kokrajhar-weaves"$1');
  html = html.replace(/href="#"([^>]*>[\s\S]*?Cold Storage)/gi, 'href="article-detail.html?id=ginger-turmeric"$1');
  html = html.replace(/href="#"([^>]*>[\s\S]*?WhatsApp Invoicing)/gi, 'href="article-detail.html?id=multilingual-ai"$1');
  html = html.replace(/href="#"([^>]*>[\s\S]*?Baksa Bio-Extracts)/gi, 'href="article-detail.html?id=baksa-bioextracts"$1');
  html = html.replace(/href="#"([^>]*>[\s\S]*?Chirang Bamboo)/gi, 'href="article-detail.html?id=chirang-bamboo"$1');
  html = html.replace(/href="#"([^>]*>[\s\S]*?Small Tea Growers)/gi, 'href="article-detail.html?id=tea-growers"$1');
  html = html.replace(/href="#"([^>]*>[\s\S]*?Soil Sensors)/gi, 'href="article-detail.html?id=cit-solar"$1');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ Linked article cards in ${file}`);
}

console.log('=== ARTICLE CARDS LINKING FINISHED ===');
