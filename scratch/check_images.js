const fs = require('fs');
const path = require('path');

const adLogicPath = 'c:/Users/u/Downloads/New webs/my-site/lib/ad-logic.ts';
const imagesDir = 'c:/Users/u/Downloads/New webs/my-site/public/images';

const content = fs.readFileSync(adLogicPath, 'utf8');

// Get imagePool - more robust regex to handle commas in filenames
const poolMatch = content.match(/export const imagePool = \[([\s\S]*?)\];/);
if (!poolMatch) {
    console.error("Could not find imagePool");
    process.exit(1);
}

// Extract strings inside double quotes
const pool = [];
const re = /"([^"]+)"/g;
let m;
while ((m = re.exec(poolMatch[1])) !== null) {
    pool.push(m[1]);
}

console.log(`Checking ${pool.length} images...`);

// Mock the hash and selection logic from ad-logic.ts
function getHash(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getImagesForCity(city, count) {
  const hash = getHash(city);
  const result = [];
  const usedIndices = new Set();
  
  for (let i = 0; i < count; i++) {
    let attempt = 0;
    let found = false;
    while (!found && attempt < pool.length) {
      const index = (hash + (i * 131) + (attempt * 17)) % pool.length;
      if (!usedIndices.has(index)) {
        usedIndices.add(index);
        result.push(pool[index]);
        found = true;
      }
      attempt++;
    }
  }
  return result;
}

const city = 'bharuch';
const cityImages = getImagesForCity(city, 24);

console.log(`\nImages for ${city}:`);
cityImages.slice(0, 4).forEach((img, i) => {
    const exists = fs.existsSync(path.join(imagesDir, img));
    process.stdout.write(`${i}: ${img} -> ${exists ? "EXISTS" : "MISSING"}\n`);
    if (!exists) {
        // Try to find a close match
        const base = img.split('-').slice(0, -1).join('-');
        const files = fs.readdirSync(imagesDir);
        const match = files.find(f => f.includes(base.substring(0, 20)));
        if (match) process.stdout.write(`   (Maybe you meant: ${match}?)\n`);
    }
});
