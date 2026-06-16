const fs = require('fs');
const path = require('path');
const https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Simple Levenshtein distance
function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

// Fetch helper with User-Agent
function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Known spelling aliases to prevent duplicates
const spellAliases = {
  "belgaum": "belagavi",
  "gulbarga": "kalaburagi",
  "hubli": "hubballi",
  "mysore": "mysuru",
  "mangalore": "mangaluru",
  "haora": "howrah",
  "hugli": "hooghly",
  "darjiling": "darjeeling",
  "kancheepuram": "kanchipuram",
  "kanniyakumari": "kanyakumari",
  "firozepur": "firozpur",
  "ferozpur": "firozpur",
  "koch-bihar": "cooch behar",
  "ganganagar": "sri ganganagar",
  "chittaurgarh": "chittorgarh",
  "banaswara": "banswara",
  "tanuku": "tanuku", // We have Tanuku under Andhra Pradesh already
  "dispur": "guwahati", // Dispur is part of Guwahati
  "east-delhi": "delhi",
  "west-delhi": "delhi",
  "north-delhi": "delhi",
  "south-delhi": "delhi",
  "central-delhi": "delhi",
  "west-godavari": "eluru",
  "east-godavari": "kakinada",
  "west-karbi-anglong": "diphu",
  "krishna": "vijayawada",
  "bangalore-rural": "bengaluru",
  "dakshin-dinajpur": "balurghat",
  "uttar-dinajpur": "raiganj",
  "purba-medinipur": "tamluk",
  "pashchim-champaran": "bettiah",
  "purbi-champaran": "motihari",
  "puruliya": "purulia",
  "chhattisgarh": "raipur",
  "haryana": "gurgaon",
  "rajasthan": "jaipur",
  "madhya-pradesh": "bhopal",
  "maharastra": "mumbai",
  "odisha": "bhubaneswar",
  "panjab": "ludhiana",
  "sikkim": "gangtok",
  "tamilnadu": "chennai",
  "telangana": "hyderabad",
  "tripura": "agartala",
  "uttarakhand": "dehradun",
  "uttar-pradesh": "lucknow",
  "west-bengal": "kolkata"
};

async function run() {
  const unresolved = JSON.parse(fs.readFileSync(path.join(__dirname, 'unresolved-cities.json'), 'utf8'));
  
  // Load current locations
  const locationsFile = fs.readFileSync(path.join(__dirname, '../lib/data/locations.ts'), 'utf8');
  const existingCities = [];
  const lines = locationsFile.split('\n');
  lines.forEach(line => {
    const matches = line.match(/"([^"]+)"/g);
    if (matches) {
      matches.forEach(match => {
        const cityName = match.replace(/"/g, '').trim();
        if (!line.includes(match + ':')) {
          existingCities.push(cityName);
        }
      });
    }
  });

  const resolved = JSON.parse(fs.readFileSync(path.join(__dirname, 'resolved-cities.json'), 'utf8'));
  const remaining = [];

  for (const slug of unresolved) {
    const norm = slug.toLowerCase().trim();
    
    // Check alias
    if (spellAliases[norm]) {
      console.log(`- Ignoring alias/duplicate: ${slug} -> ${spellAliases[norm]}`);
      continue;
    }

    // Check fuzzy match
    let isFuzzyDuplicate = false;
    for (const city of existingCities) {
      if (similarity(norm.replace(/-/g, ' '), city.toLowerCase()) > 0.85) {
        console.log(`- Ignoring fuzzy duplicate: ${slug} similarity with ${city} is high`);
        isFuzzyDuplicate = true;
        break;
      }
    }

    if (isFuzzyDuplicate) continue;

    remaining.push(slug);
  }

  console.log(`\nRemaining to resolve via Nominatim: ${remaining.length}`);

  // Query Nominatim for the remaining ones
  for (const slug of remaining) {
    const query = slug.replace(/-/g, ' ');
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)},India&format=json&limit=1`;
    
    console.log(`Geocoding: ${query}...`);
    const results = await fetchJson(url);
    await sleep(1200); // 1.2s delay to prevent block

    if (results && results.length > 0) {
      const displayName = results[0].display_name || "";
      console.log(`  Result: ${displayName}`);
      
      // Parse state from Nominatim display_name
      // Format is usually: "City Name, District Name, State Name, Zip Code, India"
      const parts = displayName.split(',').map(p => p.trim());
      // The state is usually before the postcode / India
      let state = "";
      for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i] === "India") continue;
        if (/^\d{6}$/.test(parts[i])) continue; // Skip postcode
        state = parts[i];
        break;
      }
      
      if (state) {
        console.log(`  Resolved state: ${state}`);
        if (!resolved[state]) resolved[state] = [];
        resolved[state].push(slug);
      } else {
        console.log(`  Could not parse state for: ${slug}`);
        if (!resolved["Other"]) resolved["Other"] = [];
        resolved["Other"].push(slug);
      }
    } else {
      console.log(`  No result for: ${slug}`);
      if (!resolved["Other"]) resolved["Other"] = [];
      resolved["Other"].push(slug);
    }
  }

  console.log("\nFINAL RESOLVED COUNT BY STATE:");
  for (const [state, list] of Object.entries(resolved)) {
    console.log(`- ${state}: ${list.length} cities`);
  }

  fs.writeFileSync(path.join(__dirname, 'resolved-cities.json'), JSON.stringify(resolved, null, 2));
  console.log("Saved updated resolved-cities.json");
}

run();
