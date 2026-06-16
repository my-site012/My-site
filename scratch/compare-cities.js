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

// 2. Extracted cities from massagerepublic.com
const targetCitiesRaw = `Jaisalmer, Jhansi, Agartala, Agra, Ahmedabad, Ajmer, Akola, Aligarh, Alipurduar, Ambala, Ambarnath, Amritsar, Anantapur, Asansol, Aurangabad, Ballari, Bangalore, Bareilly, Belgaum, Bharatpur, Bhavnagar, Bhopal, Bhubaneshwar, Bikaner, Bodh Gaya, Calangute, Candolim, Goa, Chandigarh, Chennai, Coimbatore, Cuttack, Darjeeling, Dehradun, Uttarakhand, Dhanbad, Dharmapuri, Dharwad, Digha, Dimapur, Durgapur, Ernakulam, Faridabad, Gandhidham, Gangtok, Gantok, Ghaziabad, Greater Noida, Guntur, Gurgaon, Guwahati, Gwalior, Haldwani, Hyderabad, Idukki, Imphal, Indore, Jaipur, Jalandhar, Jammu, Jamshedpur, Jodhpur, Junagadh, Kakinada, Kalyan, Kanchipuram, Kannur, Kanpur, Kanyakumari, Karnal, Karur, Kasaragod, Kochi, Kolhapur, Kolkata, Kota, Kottayam, Kozhikode, Kullu, Kurukshetra, Lonavala, Lucknow, Ludhiana, Madurai, Mahabalipuram, Malappuram, Manali, Mangalore, Margao, Mathura, Meerut, Moradabad, Mount Abu, Mumbai, Mussoorie, Muzaffarpur, Mysore, Nagpur, Nanded, Nashik, Navi Mumbai, New Delhi, Nizamabad, Noida, Paschim Medinipur district, Patiala, Patna, Pondicherry, Prayagraj, Pune, Punjab, Puri, Rishikesh, Raipur, Rajkot, Rajpipla, Ranchi, Roorkee, Sambalpur, Satara, Shillong, Shimla, Siliguri, Solapur, Srinagar, Surat, Thane, Thiruvallur, Thiruvananthapuram, Thrissur, Tiruchirapalli, Tirupati, Tirupur, Udaipur, Udupi, Ulhasnagar, Vadodara, Vapi, Varanasi, Vasai, Vellore, Vijayawada, Visakhapatnam, jamnagar`;

const targetCities = targetCitiesRaw
  .split(',')
  .map(c => c.trim())
  .filter(c => c.length > 0);

// Helper for fuzzy match mapping (e.g. Bangalore -> Bengaluru)
const fuzzyMap = {
  "bangalore": "bengaluru",
  "bhubaneshwar": "bhubaneswar",
  "belgaum": "belagavi",
  "ballari": "bellary",
  "calangute": "calangute", // We have Calangute under Goa
  "goa": "panaji", // Goa is a state in locations.ts, we have cities Calangute, Margao, Vasco da Gama, Panaji
  "uttarakhand": "dehradun", // Uttarakhand is a state
  "punjab": "ludhiana", // Punjab is a state
  "pondicherry": "puducherry", // Pondicherry vs Puducherry (Puducherry is union territory, Pondicherry is city name under Puducherry)
  "mysore": "mysuru",
  "mangalore": "mangaluru",
  "gantok": "gangtok", // Typo in source site
  "tiruchirapalli": "trichy", // Trichy vs Tiruchirapalli
  "tirupur": "tiruppur", // Tiruppur vs Tirupur
  "ambarnath": "ambarnath",
  "bodh gaya": "bodh gaya",
  "dharmapuri": "dharmapuri",
  "kanyakumari": "kanyakumari",
  "mahabalipuram": "mahabalipuram",
  "paschim medinipur district": "paschim medinipur district",
  "rajpipla": "rajpipla",
  "thiruvallur": "thiruvallur",
  "vasai": "vasai virar" // Vasai Virar vs Vasai
};

const missingCities = [];

targetCities.forEach(city => {
  const normCity = city.toLowerCase();
  
  // Check direct existence
  if (existingCities.has(normCity)) {
    return;
  }
  
  // Check mapping
  const mapped = fuzzyMap[normCity];
  if (mapped && existingCities.has(mapped)) {
    return;
  }
  
  // If it's a state name in locations.ts, we ignore it as a city
  const isStateName = normCity === 'goa' || normCity === 'uttarakhand' || normCity === 'punjab';
  if (isStateName) {
    return;
  }

  // Treat "gantok" (typo) as gangtok which we already have
  if (normCity === 'gantok') {
    return;
  }

  missingCities.push(city);
});

console.log("TOTAL_MISSING_CITIES:", missingCities.length);
console.log("MISSING_CITIES_LIST:", JSON.stringify(missingCities));
