const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../lib/data/locations.ts'), 'utf8');

// Parse city names inside the arrays
const cities = [];
const lines = content.split('\n');
let insideArray = false;

lines.forEach(line => {
  // Regex to match string literals in quotes
  const matches = line.match(/"([^"]+)"/g);
  if (matches) {
    matches.forEach(match => {
      const cityName = match.replace(/"/g, '').trim();
      // Ignore keys of the main locations object (states)
      // States are followed by : [ in locations.ts, e.g. "Andhra Pradesh": [
      if (!line.includes(match + ':')) {
        cities.push(cityName);
      }
    });
  }
});

const uniqueCities = Array.from(new Set(cities.map(c => c.toLowerCase().trim())));
console.log("TOTAL_EXISTING_CITIES:", uniqueCities.length);
console.log(JSON.stringify(uniqueCities));
