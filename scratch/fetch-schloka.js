const fs = require('fs');
const path = require('path');
const https = require('https');

// Disable TLS verification to bypass certificate errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function fetchSitemap(url) {
  return new Promise((resolve) => {
    console.log(`Fetching ${url} with User-Agent...`);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 10000
    };

    https.get(url, options, (res) => {
      let data = '';
      console.log(`STATUS: ${res.statusCode} for ${url}`);
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
        let match;
        const urls = [];
        while ((match = locRegex.exec(data)) !== null) {
          urls.push(match[1]);
        }
        resolve(urls);
      });
    }).on('error', (err) => {
      console.error(`Error fetching ${url}:`, err.message);
      resolve([]);
    });
  });
}

async function run() {
  const cgUrls = await fetchSitemap('https://schloka.com/cg-listings_sitemap.xml');
  const msgUrls = await fetchSitemap('https://schloka.com/msg-listings_sitemap.xml');
  
  console.log(`TOTAL_CG_URLS: ${cgUrls.length}`);
  console.log(`TOTAL_MSG_URLS: ${msgUrls.length}`);
  
  fs.writeFileSync(path.join(__dirname, 'cg-urls.json'), JSON.stringify(cgUrls, null, 2));
  fs.writeFileSync(path.join(__dirname, 'msg-urls.json'), JSON.stringify(msgUrls, null, 2));
  
  console.log("Saved URLs to scratch/cg-urls.json and scratch/msg-urls.json");
}

run();
