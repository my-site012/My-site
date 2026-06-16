const fs = require('fs');
const path = require('path');

// Title Case formatter
function toTitleCase(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Map Nominatim resolved states to our locations.ts keys
const stateMapping = {
  "Delhi": "Delhi NCR",
  "Delhi NCR": "Delhi NCR",
  "National Capital Territory of Delhi": "Delhi NCR",
  "Pondicherry": "Puducherry",
  "Daman and Diu": "Dadra and Nagar Haveli",
  "Dadra and Nagar Haveli and Daman and Diu": "Dadra and Nagar Haveli",
  "Lakshadweep": "Puducherry" // Fallback Lakshadweep to Puducherry or similar if needed, or keep it under Puducherry
};

function run() {
  const resolvedPath = path.join(__dirname, 'resolved-cities.json');
  if (!fs.existsSync(resolvedPath)) {
    console.error("resolved-cities.json does not exist yet.");
    return;
  }

  const resolved = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
  
  // Read current locations.ts as text
  const locationsFilePath = path.join(__dirname, '../lib/data/locations.ts');
  const fileContent = fs.readFileSync(locationsFilePath, 'utf8');

  // Parse existing locations object
  // Since locations.ts is exported as "export const locations: Record<string, string[]> = { ... }"
  // We can evaluate it in JS using a regex or simple parse.
  // Actually, we can load it from locations.ts dynamically by temporarily writing a JS file, or we can use regex to extract the states and arrays.
  // Let's parse it using JS code compilation
  const jsLocations = fileContent
    .replace('export const locations: Record<string, string[]> =', 'const locations =')
    .replace('export function getCitySlug', '//')
    .replace('export function getAllCities', '//')
    .replace('export function getStateFromCity', '//')
    .replace('export function getAllStates', '//')
    .replace('export function getStateSlug', '//');

  let locations = {};
  try {
    eval(jsLocations + '\n locationsObject = locations;');
    locations = locationsObject;
  } catch (e) {
    console.error("Failed to parse locations.ts using eval:", e.message);
    return;
  }

  console.log("Current states in locations.ts:", Object.keys(locations).length);

  let totalAdded = 0;
  
  // Merge resolved cities
  for (const [state, cities] of Object.entries(resolved)) {
    if (state === "Other") {
      console.log(`Skipping 'Other' cities: ${JSON.stringify(cities)}`);
      continue;
    }

    // Resolve target state key
    let targetState = state;
    if (stateMapping[state]) {
      targetState = stateMapping[state];
    }

    if (!locations[targetState]) {
      // If the state is not in our keys, let's find a match by lowercase
      const matchedKey = Object.keys(locations).find(k => k.toLowerCase() === targetState.toLowerCase());
      if (matchedKey) {
        targetState = matchedKey;
      } else {
        console.log(`Warning: State '${targetState}' resolved for cities ${JSON.stringify(cities)} does not exist in locations.ts. Mapping to 'Delhi NCR' as fallback.`);
        targetState = "Delhi NCR";
      }
    }

    const citySet = new Set(locations[targetState].map(c => c.toLowerCase().trim()));
    
    cities.forEach(slug => {
      const cleanCity = slug.toLowerCase().trim().replace(/-/g, ' ');
      const formattedCity = toTitleCase(slug);

      // Make sure we don't add duplicates
      if (!citySet.has(slug.toLowerCase()) && !citySet.has(cleanCity)) {
        locations[targetState].push(formattedCity);
        citySet.add(slug.toLowerCase());
        totalAdded++;
        console.log(`Added: [${targetState}] -> ${formattedCity}`);
      }
    });
  }

  console.log(`Total new cities added: ${totalAdded}`);

  // Re-serialize the locations object back into locations.ts format
  let serializedLocations = "export const locations: Record<string, string[]> = {\n";
  for (const [state, cities] of Object.entries(locations)) {
    // Sort cities alphabetically for clean order
    const sortedCities = Array.from(new Set(cities)).sort();
    serializedLocations += `  "${state}": [\n`;
    serializedLocations += sortedCities.map(c => `    "${c}"`).join(',\n');
    serializedLocations += `\n  ],\n`;
  }
  // Remove trailing comma and close
  serializedLocations = serializedLocations.slice(0, -2) + "\n};\n";

  // Append helper functions
  const helpers = `
// Helper: get slug from city name
export function getCitySlug(city: string): string {
  return city.toLowerCase().replace(/\\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// Helper: get all cities flat list (alphabetical) for dropdown
export function getAllCities(): string[] {
  const all = Object.values(locations).flat();
  return [...new Set(all)].sort();
}

// Helper: get state from city
export function getStateFromCity(citySlug: string): string | null {
  for (const [state, cities] of Object.entries(locations)) {
    if (cities.some(c => getCitySlug(c) === citySlug)) return state;
  }
  return null;
}

// Helper: get all states
export function getAllStates(): string[] {
  return Object.keys(locations).sort();
}

// Helper: get slug from state name
export function getStateSlug(state: string): string {
  return state.toLowerCase().replace(/\\s+/g, "-").replace(/[^a-z0-9-9-]/g, "");
}
`;

  const finalContent = serializedLocations + helpers;
  fs.writeFileSync(locationsFilePath, finalContent, 'utf8');
  console.log("Successfully updated locations.ts with sorted and mapped cities!");
}

run();
