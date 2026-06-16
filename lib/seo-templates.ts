
export const metaTitles = [
  "Call Girls in (City) ❤️ Verified (City) Escorts (Cash on Delivery)",
  "Verified Escorts in (City) | #1 Independent Adult Classifieds (COD)",
  "Explore Local Call Girls in (City) | Low Cost (City) Escort Service",
  "Independent Escort Directory in (City) ❤️ Phone & WhatsApp Number",
  "Premium (City) Escorts & Call Girls | Real Photos & No Advance 24/7",
  "Book VIP Escorts in (City) | Hottest Russian & Local Call Girls",
  "Genuine Call Girls in (City) - 100% Verified Classifieds starting ₹2100"
];

export const metaDescriptions = [
  "Book premium independent Call Girls in (City) with Free Hotel Delivery. Affordable rates starting at ₹2100. Dial our verified Call Girl WhatsApp Number now.",
  "Looking for the best adult classifieds and Verified Escorts in (City)? Get 100% genuine Call Girl Number for college girls, housewives, and Russian companions.",
  "Explore verified Escort Service in (City) with Cash on Delivery. Browse real photos of independent companions, housewives, and VIP models with 100% privacy.",
  "Find verified Call Girls in (City) with zero advance payment. Our local directory features genuine Call Girl WhatsApp Numbers, real profiles, and safe dating.",
  "Discover independent call girls, Russian escorts, and VIP models in (City). Explore our verified directory for genuine profiles and top adult companionship.",
  "Explore local Call Girls in (City) with zero upfront fees. Book real companions, college girls, and adult massage services 24/7 with cash payment."
];

/**
 * Returns a deterministic SEO template based on the city name
 */
export function getCitySeo(city: string) {
  // Use a simple hash based on city string length and characters to pick a template
  const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const titleIndex = hash % metaTitles.length;
  const descIndex = hash % metaDescriptions.length;
  
  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  
  return {
    title: metaTitles[titleIndex].replace(/\(City\)/g, cityName),
    description: metaDescriptions[descIndex].replace(/\(City\)/g, cityName)
  };
}
