const fs = require('fs');
const path = require('path');

// 1. Read existing cities from locations.ts
const locationsContent = fs.readFileSync(path.join(__dirname, '../lib/data/locations.ts'), 'utf8');
const existingCities = new Set();

const lines = locationsContent.split('\n');
lines.forEach(line => {
  const matches = line.match(/"([^"]+)"/g);
  if (matches) {
    matches.forEach(match => {
      const cityName = match.replace(/"/g, '').trim().toLowerCase();
      if (!line.includes(match + ':')) {
        existingCities.add(cityName);
      }
    });
  }
});

// 2. Read schloka slugs
const cgSlugs = JSON.parse(fs.readFileSync(path.join(__dirname, 'cg-slugs.json'), 'utf8'));

const missing = [];
cgSlugs.forEach(slug => {
  const norm = slug.toLowerCase().trim();
  // Standardize the slug format (e.g. replace dashes with spaces)
  const cityNameSpaced = norm.replace(/-/g, ' ');
  
  if (!existingCities.has(norm) && !existingCities.has(cityNameSpaced)) {
    missing.push(slug);
  }
});

console.log("TOTAL_MISSING:", missing.length);
console.log("MISSING_LIST (first 100):", JSON.stringify(missing.slice(0, 100)));
console.log("FULL_MISSING_LIST:", JSON.stringify(missing));
