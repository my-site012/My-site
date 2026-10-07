import { locations, getStateFromCity, getCitySlug } from "./data/locations";
import { getHash } from "./ad-logic";

// Verified GPS Coordinates for Major Indian Cities & Metro Hubs
const KNOWN_COORDINATES: Record<string, { lat: number; lng: number }> = {
  delhi: { lat: 28.6139, lng: 77.2090 },
  "new-delhi": { lat: 28.6139, lng: 77.2090 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  pune: { lat: 18.5204, lng: 73.8567 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  surat: { lat: 21.1702, lng: 72.8311 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  kanpur: { lat: 26.4499, lng: 80.3319 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  indore: { lat: 22.7196, lng: 75.8577 },
  thane: { lat: 19.2183, lng: 72.9781 },
  bhopal: { lat: 23.2599, lng: 77.4126 },
  visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  patna: { lat: 25.5941, lng: 85.1376 },
  vadodara: { lat: 22.3072, lng: 73.1812 },
  ghaziabad: { lat: 28.6692, lng: 77.4538 },
  ludhiana: { lat: 30.9010, lng: 75.8573 },
  agra: { lat: 27.1767, lng: 78.0081 },
  nashik: { lat: 19.9975, lng: 73.7898 },
  faridabad: { lat: 28.4089, lng: 77.3178 },
  meerut: { lat: 28.9845, lng: 77.7064 },
  rajkot: { lat: 22.3039, lng: 70.8022 },
  varanasi: { lat: 25.3176, lng: 82.9739 },
  srinagar: { lat: 34.0837, lng: 74.7973 },
  aurangabad: { lat: 19.8762, lng: 75.3433 },
  dhanbad: { lat: 23.7957, lng: 86.4304 },
  amritsar: { lat: 31.6340, lng: 74.8723 },
  "navi-mumbai": { lat: 19.0330, lng: 73.0297 },
  allahabad: { lat: 25.4358, lng: 81.8463 },
  prayagraj: { lat: 25.4358, lng: 81.8463 },
  ranchi: { lat: 23.3441, lng: 85.3096 },
  howrah: { lat: 22.5958, lng: 88.2636 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  jabalpur: { lat: 23.1815, lng: 79.9864 },
  gwalior: { lat: 26.2183, lng: 78.1828 },
  vijayawada: { lat: 16.5062, lng: 80.6480 },
  jodhpur: { lat: 26.2389, lng: 73.0243 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  raipur: { lat: 21.2514, lng: 81.6296 },
  kota: { lat: 25.2138, lng: 75.8648 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  guwahati: { lat: 26.1445, lng: 91.7362 },
  mysore: { lat: 12.2958, lng: 76.6394 },
  gurgaon: { lat: 28.4595, lng: 77.0266 },
  gurugram: { lat: 28.4595, lng: 77.0266 },
  noida: { lat: 28.5355, lng: 77.3910 },
  jalandhar: { lat: 31.3260, lng: 75.5762 },
  bhubaneswar: { lat: 20.2961, lng: 85.8245 },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  dehradun: { lat: 30.3165, lng: 78.0322 },
  udaipur: { lat: 24.5854, lng: 73.7125 },
  goa: { lat: 15.2993, lng: 74.1240 },
  panaji: { lat: 15.4909, lng: 73.8278 },
  calangute: { lat: 15.5439, lng: 73.7553 },
  shimla: { lat: 31.1048, lng: 77.1734 },
  manali: { lat: 32.2432, lng: 77.1892 },
  haridwar: { lat: 29.9457, lng: 78.1642 },
  rishikesh: { lat: 30.0869, lng: 78.2676 },
};

/**
 * Get geographical latitude and longitude coordinates for any Indian city
 */
export function getCityGeoCoordinates(citySlug: string): { lat: number; lng: number } {
  const clean = citySlug.toLowerCase().trim();
  if (KNOWN_COORDINATES[clean]) {
    return KNOWN_COORDINATES[clean];
  }
  // Deterministic GPS formula fallback within India's boundary (Lat ~10 to 30, Lng ~72 to 88)
  const hash = getHash(clean);
  const lat = parseFloat((12.5 + ((hash % 1600) / 100)).toFixed(4));
  const lng = parseFloat((73.0 + ((hash % 1400) / 100)).toFixed(4));
  return { lat, lng };
}

/**
 * Returns the official Wikipedia knowledge graph entity URL for a city
 */
export function getCityWikipediaUrl(cityName: string): string {
  const formatted = cityName.trim().replace(/\s+/g, "_");
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(formatted)}`;
}

/**
 * Generates deterministic 4.8 - 4.9 star ratings and review count for Google Rich Snippets
 */
export function getCityReviewData(citySlug: string): {
  ratingValue: string;
  reviewCount: number;
  bestRating: string;
  worstRating: string;
} {
  const hash = getHash(citySlug);
  const ratingValue = (4.8 + (hash % 2) * 0.1).toFixed(1);
  const reviewCount = 180 + (hash % 260); // 180 to 440 reviews
  return {
    ratingValue,
    reviewCount,
    bestRating: "5",
    worstRating: "1",
  };
}

/**
 * Generates Google BreadcrumbList schema
 */
export function generateBreadcrumbsSchema(
  categoryName: string,
  categorySlug: string,
  cityName: string,
  citySlug: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://callgirl4u.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `https://callgirl4u.com/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cityName,
        item: `https://callgirl4u.com/${categorySlug}/${citySlug}`,
      },
    ],
  };
}

/**
 * Generates enhanced LocalBusiness + Service rich snippet schema with AggregateRating,
 * GeoCoordinates, and Wikipedia Entity Grounding
 */
export function generateEnhancedLocalBusinessSchema({
  title,
  description,
  cityName,
  citySlug,
  stateName,
  categorySlug = "call-girls",
  phone = "+91 9232504628",
}: {
  title: string;
  description: string;
  cityName: string;
  citySlug: string;
  stateName: string;
  categorySlug?: string;
  phone?: string;
}) {
  const geo = getCityGeoCoordinates(citySlug);
  const reviews = getCityReviewData(citySlug);
  const wikiUrl = getCityWikipediaUrl(cityName);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: title,
    image: "https://callgirl4u.com/icon.png",
    description: description,
    url: `https://callgirl4u.com/${categorySlug}/${citySlug}`,
    telephone: phone,
    priceRange: "INR 3000 - 10000",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${cityName} Center`,
      addressLocality: cityName,
      addressRegion: stateName,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.lat,
      longitude: geo.lng,
    },
    areaServed: {
      "@type": "City",
      name: cityName,
      sameAs: wikiUrl,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviews.ratingValue,
      reviewCount: reviews.reviewCount,
      bestRating: reviews.bestRating,
      worstRating: reviews.worstRating,
    },
  };
}

/**
 * Returns nearby cities within the same state for the internal linking navigation grid
 */
export function getNearbyCities(
  citySlug: string,
  cityName: string,
  limit: number = 10
): { name: string; slug: string }[] {
  const state = getStateFromCity(cityName);
  if (!state || !locations[state]) {
    // Default popular fallback cities
    return [
      { name: "Delhi", slug: "delhi" },
      { name: "Mumbai", slug: "mumbai" },
      { name: "Bengaluru", slug: "bengaluru" },
      { name: "Jaipur", slug: "jaipur" },
      { name: "Goa", slug: "goa" },
      { name: "Pune", slug: "pune" },
    ].filter((c) => c.slug !== citySlug);
  }

  const citiesInState = locations[state];
  return citiesInState
    .filter((c) => c.toLowerCase() !== cityName.toLowerCase())
    .slice(0, limit)
    .map((c) => ({
      name: c,
      slug: getCitySlug(c),
    }));
}
