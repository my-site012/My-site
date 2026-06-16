const fs = require('fs');
const path = require('path');

const cgUrls = JSON.parse(fs.readFileSync(path.join(__dirname, 'cg-urls.json'), 'utf8'));
const msgUrls = JSON.parse(fs.readFileSync(path.join(__dirname, 'msg-urls.json'), 'utf8'));

console.log("CG Urls sample (first 10):");
console.log(cgUrls.slice(0, 10));

console.log("\nMSG Urls sample (first 10):");
console.log(msgUrls.slice(0, 10));

// Let's see what the pattern is
// E.g. https://schloka.com/call-girls/city-name or something
// We'll write code to parse the city slugs from the URLs
function extractSlugs(urls) {
  const slugs = new Set();
  urls.forEach(url => {
    try {
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1] || parts[parts.length - 2];
      if (lastPart && lastPart !== 'sitemap.xml') {
        slugs.add(lastPart.trim().toLowerCase());
      }
    } catch (e) {}
  });
  return Array.from(slugs);
}

const cgSlugs = extractSlugs(cgUrls);
const msgSlugs = extractSlugs(msgUrls);

console.log(`\nUnique CG slugs: ${cgSlugs.length}`);
console.log(`Unique MSG slugs: ${msgSlugs.length}`);

fs.writeFileSync(path.join(__dirname, 'cg-slugs.json'), JSON.stringify(cgSlugs, null, 2));
fs.writeFileSync(path.join(__dirname, 'msg-slugs.json'), JSON.stringify(msgSlugs, null, 2));
