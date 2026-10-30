const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = process.env.STITCH_API_KEY || 'YOUR_API_KEY_HERE';
const PROJECT_ID = '4801920136333492522';

const SCREENS = [
  {
    id: 'a57e23fa248c44d1bf1c550a0c8e0535',
    file: 'index.html',
    title: 'Home — Bodoland Entrepreneurs'
  },
  {
    id: 'ce12c56d805a4f0bbd4899268c56cda1',
    file: 'stories.html',
    title: 'Stories — Bodoland Entrepreneurs'
  },
  {
    id: '777756b4ad6e4502b6e373d14e1fd80b',
    file: 'young-entrepreneurs.html',
    title: 'Young Entrepreneurs — Bodoland Entrepreneurs'
  },
  {
    id: '3e309063b70549f5a2c864cd3a2bc6ab',
    file: 'business-ideas.html',
    title: 'Business Ideas — Bodoland Entrepreneurs'
  },
  {
    id: 'c912ed25e96e4710849541b11ad4c419',
    file: 'learning.html',
    title: 'Learning — Bodoland Entrepreneurs'
  },
  {
    id: '7754483c2b4e475c97bdc1ef05cf4cdd',
    file: 'insights.html',
    title: 'Insights — Bodoland Entrepreneurs'
  },
  {
    id: 'dce604ff712543d99b0c9c2d6a665734',
    file: 'article-detail.html',
    title: 'Article Detail — Bodoland Entrepreneurs'
  },
  {
    id: 'd58682ba462c4581826ca332dd879339',
    file: 'article-reading.html',
    title: 'Article Reading — Bodoland Entrepreneurs'
  },
  {
    id: '711e5572b64e4c268911b67dec0a1a6d',
    file: 'about.html',
    title: 'About Us — Bodoland Entrepreneurs'
  }
];

function fetchFile(screenId) {
  return new Promise((resolve, reject) => {
    const url = `https://stitch.googleapis.com/v1/projects/${PROJECT_ID}/files/${screenId}:download`;
    const req = https.get(url, {
      headers: {
        'X-Goog-Api-Key': API_KEY
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.dataString) {
            resolve(json.dataString);
          } else {
            reject(new Error(`No dataString in response for ${screenId}: ` + body.substring(0, 200)));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

function linkify(html) {
  // Fix navigation data-path links and relative anchors
  let fixed = html;
  
  // Replace navigation hrefs
  fixed = fixed.replace(/data-path="home"\s+href="#"/g, 'data-path="home" href="index.html"');
  fixed = fixed.replace(/data-path="stories"\s+href="#"/g, 'data-path="stories" href="stories.html"');
  fixed = fixed.replace(/data-path="young-entrepreneurs"\s+href="#"/g, 'data-path="young-entrepreneurs" href="young-entrepreneurs.html"');
  fixed = fixed.replace(/data-path="business-ideas"\s+href="#"/g, 'data-path="business-ideas" href="business-ideas.html"');
  fixed = fixed.replace(/data-path="learning"\s+href="#"/g, 'data-path="learning" href="learning.html"');
  fixed = fixed.replace(/data-path="insights"\s+href="#"/g, 'data-path="insights" href="insights.html"');
  fixed = fixed.replace(/data-path="about"\s+href="#"/g, 'data-path="about" href="about.html"');

  // Breadcrumbs and common links
  fixed = fixed.replace(/<a class="hover:text-secondary" href="#">Home<\/a>/g, '<a class="hover:text-secondary" href="index.html">Home</a>');
  fixed = fixed.replace(/<a class="hover:text-secondary" href="#">Stories<\/a>/g, '<a class="hover:text-secondary" href="stories.html">Stories</a>');
  fixed = fixed.replace(/<a class="hover:text-secondary" href="#">Learning<\/a>/g, '<a class="hover:text-secondary" href="learning.html">Learning</a>');
  fixed = fixed.replace(/<a class="hover:text-secondary" href="#">Insights<\/a>/g, '<a class="hover:text-secondary" href="insights.html">Insights</a>');
  fixed = fixed.replace(/<a class="hover:text-secondary" href="#">Business Ideas<\/a>/g, '<a class="hover:text-secondary" href="business-ideas.html">Business Ideas</a>');
  fixed = fixed.replace(/<a class="hover:text-secondary" href="#">Young Entrepreneurs<\/a>/g, '<a class="hover:text-secondary" href="young-entrepreneurs.html">Young Entrepreneurs</a>');

  // "Read More" links to article-detail.html
  fixed = fixed.replace(/href="#"(\s+class="[^"]*font-headline-sm[^"]*group"><span>Read More<\/span>)/g, 'href="article-detail.html"$1');
  
  return fixed;
}

async function run() {
  console.log(`Starting export of ${SCREENS.length} screens for Bodoland Entrepreneurs platform...`);
  for (const screen of SCREENS) {
    try {
      console.log(`Downloading ${screen.file} (${screen.id})...`);
      let html = await fetchFile(screen.id);
      html = linkify(html);
      const destPath = path.join(__dirname, screen.file);
      fs.writeFileSync(destPath, html, 'utf8');
      console.log(`✓ Saved ${screen.file} (${html.length} bytes)`);
    } catch (err) {
      console.error(`✗ Error downloading ${screen.file}:`, err.message);
    }
  }
  console.log('All screens exported successfully!');
}

run();
