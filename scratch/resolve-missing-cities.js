const fs = require('fs');
const path = require('path');
const https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Helper to normalize strings for comparison
function clean(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
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

// Known sub-localities mapping
const subLocalities = {
  // Mumbai / Pune / Maharashtra
  "alibag": "Maharashtra",
  "andheri": "Maharashtra",
  "antop-hill": "Maharashtra",
  "bandra": "Maharashtra",
  "belapur": "Maharashtra",
  "borivali": "Maharashtra",
  "breach-candy": "Maharashtra",
  "carter-road": "Maharashtra",
  "chembur": "Maharashtra",
  "church-gate": "Maharashtra",
  "colaba": "Maharashtra",
  "cuffe-parade": "Maharashtra",
  "dombivli": "Maharashtra",
  "ghatkopar": "Maharashtra",
  "goregaon": "Maharashtra",
  "grant-road": "Maharashtra",
  "hinjewadi": "Maharashtra",
  "jogeshwari": "Maharashtra",
  "juhu": "Maharashtra",
  "kandivali": "Maharashtra",
  "kemps-corner": "Maharashtra",
  "khar": "Maharashtra",
  "kopar-khairane": "Maharashtra",
  "kurla": "Maharashtra",
  "lokhandwala": "Maharashtra",
  "mahalaxmi": "Maharashtra",
  "mahim": "Maharashtra",
  "malabar-hill": "Maharashtra",
  "malad": "Maharashtra",
  "mira-road": "Maharashtra",
  "mulund": "Maharashtra",
  "mumbai-central": "Maharashtra",
  "nerul": "Maharashtra",
  "oshiwara": "Maharashtra",
  "pali-hill": "Maharashtra",
  "powai": "Maharashtra",
  "santacruz": "Maharashtra",
  "sion": "Maharashtra",
  "versova": "Maharashtra",
  "vile-parle": "Maharashtra",
  "wadala": "Maharashtra",
  "vashi": "Maharashtra",
  "bhor": "Maharashtra",
  "chiplun": "Maharashtra",
  "kamshet": "Maharashtra",
  "karad": "Maharashtra",
  "khandala": "Maharashtra",
  "lavasa": "Maharashtra",
  "mahabaleshwar": "Maharashtra",
  "matheran": "Maharashtra",
  "panchgani": "Maharashtra",
  "saswad": "Maharashtra",
  "talegaon-dabhade": "Maharashtra",
  "vajreshwari": "Maharashtra",
  "washim": "Maharashtra",

  // Delhi NCR
  "alipur": "Delhi NCR",
  "bawana": "Delhi NCR",
  "central-delhi": "Delhi NCR",
  "east-delhi": "Delhi NCR",
  "north-delhi": "Delhi NCR",
  "south-delhi": "Delhi NCR",
  "west-delhi": "Delhi NCR",
  "kapas-hera": "Delhi NCR",
  "rajokri": "Delhi NCR",
  "sadar-bazar": "Delhi NCR",
  "sant-nagar": "Delhi NCR",
  "vikas-puri": "Delhi NCR",
  "sohna": "Delhi NCR",
  "neemrana": "Delhi NCR",

  // Goa
  "anjuna": "Goa",
  "arambol": "Goa",
  "baga": "Goa",
  "colva": "Goa",
  "cuncolim": "Goa",
  "mapusa": "Goa",
  "mormugao": "Goa",
  "pernem": "Goa",
  "ponda": "Goa",
  "porvorim": "Goa",
  "sanguem": "Goa",
  "sattari": "Goa",
  "valpoi": "Goa",
  "bicholim": "Goa",
  "canacona": "Goa",
  "bardez": "Goa",

  // Others
  "geyzing": "Sikkim",
  "geyzing-west-sikkim": "Sikkim",
  "geyzing-": "Sikkim",
  "hansi-": "Haryana"
};

const stateNames = [
  "andhra-pradesh", "arunachal-pradesh", "assam", "bihar", "chhattisgarh", "goa", 
  "gujarat", "gujrat", "haryana", "himachal-pradesh", "jammu-and-kashmir", "jharkhand", 
  "karnataka", "karnatka", "kerala", "madhya-pradesh", "maharashtra", "maharastra", 
  "manipur", "meghalaya", "mizoram", "nagaland", "odisha", "punjab", "panjab", 
  "rajasthan", "sikkim", "tamilnadu", "tamil-nadu", "telangana", "tripura", 
  "uttarakhand", "uttar-pradesh", "west-bengal", "daman", "lakshadweep"
];

async function run() {
  // 1. Fetch Indian districts
  const rawData = await fetchJson('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json');
  if (!rawData) {
    console.error("Failed to fetch states and districts JSON.");
    return;
  }
  const statesList = rawData.states;

  // 2. Load missing slugs
  const missingSlugs = JSON.parse(fs.readFileSync(path.join(__dirname, 'cg-slugs.json'), 'utf8'));
  
  // Load current locations
  const locationsFile = fs.readFileSync(path.join(__dirname, '../lib/data/locations.ts'), 'utf8');
  const existingCities = new Set();
  const lines = locationsFile.split('\n');
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

  const resolved = {}; // state -> [cities]
  const unresolved = [];

  missingSlugs.forEach(slug => {
    const norm = slug.toLowerCase().trim();
    const cleanSlug = clean(norm);

    // Skip states themselves
    if (stateNames.includes(norm) || stateNames.includes(norm.replace(/-/g, ' '))) {
      return;
    }

    // Skip if already exists in our codebase
    if (existingCities.has(norm) || existingCities.has(norm.replace(/-/g, ' '))) {
      return;
    }

    // 1. Check custom sub-localities
    if (subLocalities[norm]) {
      const state = subLocalities[norm];
      if (!resolved[state]) resolved[state] = [];
      resolved[state].push(slug);
      return;
    }

    // 2. Check in districts list
    let found = false;
    for (const s of statesList) {
      let stateName = s.state;
      // Map standard names to our state names if slightly different
      if (stateName === "Orissa") stateName = "Odisha";
      if (stateName === "Uttaranchal") stateName = "Uttarakhand";

      for (const dist of s.districts) {
        if (clean(dist) === cleanSlug || clean(dist + " district") === cleanSlug || cleanSlug.includes(clean(dist))) {
          if (!resolved[stateName]) resolved[stateName] = [];
          resolved[stateName].push(slug);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      unresolved.push(slug);
    }
  });

  console.log("RESOLVED COUNT BY STATE:");
  for (const [state, list] of Object.entries(resolved)) {
    console.log(`- ${state}: ${list.length} cities`);
  }
  console.log(`UNRESOLVED COUNT: ${unresolved.length}`);
  console.log("UNRESOLVED SAMPLE:", unresolved.slice(0, 50));

  fs.writeFileSync(path.join(__dirname, 'resolved-cities.json'), JSON.stringify(resolved, null, 2));
  fs.writeFileSync(path.join(__dirname, 'unresolved-cities.json'), JSON.stringify(unresolved, null, 2));
}

run();
