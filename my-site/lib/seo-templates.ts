
export const metaTitles = [
  "Low cost call Girls in (City)at cash payment Delivery",
  "(City) Call Girls | Verified Call Girls in (City)",
  "(City) Call Girls Number ₹2999 Genuine Escorts Free Delivery",
  "Independent Escorts (City) - Call Girls (City) - Callgirl4U",
  "Book Call Girls in (City) and escort services 24x7",
  "(City) Call Girls | Book Your Dream Girl From Here 24/7",
  "(City) Call Girls, ₹5k 100% Genuine Call Girls in (City)",
  "Cheap Call girls in (City) low cost cash payment delivery",
  "(City) Call Girls Book Now No Advance Payment Free Delivery"
];

export const metaDescriptions = [
  "Looking for trusted Call Girls in (City)? Callgirl4u brings you premium call girls (City)& Escorts service instant booking, and 50% exclusive discounts.",
  "Call US NOW We providing Genuine Call girls in (City)- College & Student sex and independent call girls in (City). We providing a Top Class Escort service.",
  "Call Girl in (City) - We are one of the Trusted call girl service in (City) at low price. call now to Book Most beautiful call girl in (City) near you for night services.",
  "Are You Looking for (City) ESCORTS and Call Girls services? Oklute.com adult classifieds ads, independent call girls in (City). The largest call girls ads selection in (City). Browse in our call girl category for finding a SEX MEETING in (City). Call girl number whatsapp in (City).",
  "Book premium (City) Call Girls Starting price just ₹2999 with doorstep delivery, Call us to get your desired escorts service in (City) for your 1st night stand.",
  "Are you looking for CALL GIRLS in (City) and escort service? Callgirl4U Adult classifieds ads, independent (City) call girls. The largest call girls ads selection in (City).",
  "Are you looking for Call Girls in (City)? Callgirl4U is an escort service website that provides access to call girls and escorts in (City) and other Indian cities.",
  "Callgirl4U is one of the oldest call girls agency in (City). Book verified call girls in (City). 24/7 service, cash payment, quick delivery, professional and genuine (City) call girls across all localities.",
  "VIP (City) Call girls are the highest of the class beauties. We are providing one of the best night partners & call girls in (City) just like your dream girl."
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
